import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarAvisoCuota, enviarVencimientoCuota } from '@/lib/email'

// Trimestrales: se generan el 1ro del primer mes, vencen el 10 del segundo mes
const TRIMESTRES = [
  { startMes: 4,  meses: [4, 5, 6],  segundoMes: 5  },
  { startMes: 7,  meses: [7, 8, 9],  segundoMes: 8  },
  { startMes: 10, meses: [10, 11],   segundoMes: 11 },
]

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export async function GET(request: NextRequest) {
  // Verificar cron secret (Vercel lo envía automáticamente con CRON_SECRET)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const supabase = createAdminClient()

  const now = new Date()
  const mes = now.getMonth() + 1
  const anio = now.getFullYear()

  const MESES_SCOUT = [3,4, 5, 6, 7, 8, 9, 10, 11]
  if (!MESES_SCOUT.includes(mes)) {
    return NextResponse.json({
      message: `Mes ${mes} fuera del período scout (abril-noviembre). Sin cuotas generadas.`,
      created: 0,
    })
  }

  // Cuota vigente
  const { data: cuota } = await supabase
    .from('cuota_config')
    .select('monto, monto_trimestral_mes')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!cuota) {
    return NextResponse.json({ error: 'No hay cuota configurada' }, { status: 500 })
  }

  // Protagonistas activos
  const { data: protagonistas } = await supabase
    .from('beneficiarios')
    .select('id, tipo_cuota, nombre, apellido, email, mail_contacto')
    .eq('activo', true)

  if (!protagonistas?.length) {
    return NextResponse.json({ message: 'Sin protagonistas activos', created: 0 })
  }

  const trimestreActual = TRIMESTRES.find((t) => t.startMes === mes)
  let created = 0

  for (const p of protagonistas) {
    const tipoCuota = p.tipo_cuota || 'mensual'

    if (tipoCuota === 'mensual') {
      const mesClave = `${anio}-${pad(mes)}`

      // Verificar que no exista ya para este mes
      const { data: existing } = await supabase
        .from('cuotas_pendientes')
        .select('id')
        .eq('beneficiario_id', p.id)
        .eq('tipo', 'mensual')
        .contains('meses_cubiertos', [mesClave])
        .maybeSingle()

      if (!existing) {
        const nuevaCuota = {
          beneficiario_id: p.id,
          tipo: 'mensual',
          meses_cubiertos: [mesClave],
          monto: Number(cuota.monto),
          fecha_vencimiento: `${anio}-${pad(mes)}-10`,
        }
        await supabase.from('cuotas_pendientes').insert(nuevaCuota)
        created++
        await enviarAvisoCuota(p, nuevaCuota)
      }
    } else if (tipoCuota === 'trimestral' && trimestreActual) {
      // Solo se genera en los meses de inicio de trimestre
      const mesClave = `${anio}-${pad(mes)}`

      const { data: existing } = await supabase
        .from('cuotas_pendientes')
        .select('id')
        .eq('beneficiario_id', p.id)
        .eq('tipo', 'trimestral')
        .contains('meses_cubiertos', [mesClave])
        .maybeSingle()

      if (!existing) {
        const mesesCubiertos = trimestreActual.meses.map((m) => `${anio}-${pad(m)}`)
        const montoTrimestral =
          Number(cuota.monto_trimestral_mes || cuota.monto) * trimestreActual.meses.length
        const nuevaCuota = {
          beneficiario_id: p.id,
          tipo: 'trimestral',
          meses_cubiertos: mesesCubiertos,
          monto: montoTrimestral,
          fecha_vencimiento: `${anio}-${pad(trimestreActual.segundoMes)}-10`,
        }
        await supabase.from('cuotas_pendientes').insert(nuevaCuota)
        created++
        await enviarAvisoCuota(p, nuevaCuota)
      }
    }
    // Trimestral en mes que no es inicio de trimestre: no se genera nada
  }

  // Marcar vencidas y notificar
  const hoy = now.toISOString().split('T')[0]
  const { data: recienVencidas } = await supabase
    .from('cuotas_pendientes')
    .select('id, tipo, meses_cubiertos, monto, fecha_vencimiento, beneficiarios:beneficiario_id(nombre, apellido, email, mail_contacto)')
    .eq('estado', 'pendiente')
    .lt('fecha_vencimiento', hoy)

  if (recienVencidas?.length) {
    await supabase
      .from('cuotas_pendientes')
      .update({ estado: 'vencido' })
      .in('id', recienVencidas.map((c) => c.id))

    for (const cp of recienVencidas) {
      const protagonista = cp.beneficiarios as unknown as { nombre: string; apellido: string; email?: string; mail_contacto?: string }
      if (protagonista) {
        await enviarVencimientoCuota(protagonista, cp)
      }
    }
  }

  return NextResponse.json({
    message: `Cron ejecutado: ${created} cuota(s) generada(s)`,
    mes,
    anio,
    created,
  })
}
