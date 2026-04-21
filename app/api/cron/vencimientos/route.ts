import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarVencimientoCuota } from '@/lib/email'

export async function GET(request: NextRequest) {
  // const authHeader = request.headers.get('authorization')
  // const cronSecret = process.env.CRON_SECRET
  // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const supabase = createAdminClient()
  const hoy = new Date().toISOString().split('T')[0]

  const { data: recienVencidas } = await supabase
    .from('cuotas_pendientes')
    .select('id, tipo, meses_cubiertos, monto, fecha_vencimiento, beneficiarios:beneficiario_id(nombre, apellido, email, mail_contacto)')
    .eq('estado', 'pendiente')
    .lte('fecha_vencimiento', hoy)

  if (!recienVencidas?.length) {
    return NextResponse.json({ message: 'Sin cuotas vencidas hoy', updated: 0 })
  }

  await supabase
    .from('cuotas_pendientes')
    .update({ estado: 'vencido' })
    .in('id', recienVencidas.map((c) => c.id))

  let notified = 0
  for (const cp of recienVencidas) {
    const protagonista = cp.beneficiarios as unknown as {
      nombre: string
      apellido: string
      email?: string
      mail_contacto?: string
    }
    if (protagonista) {
      await enviarVencimientoCuota(protagonista, cp)
      notified++
    }
  }

  return NextResponse.json({
    message: `${recienVencidas.length} cuota(s) marcadas como vencidas, ${notified} notificación(es) enviada(s)`,
    updated: recienVencidas.length,
    notified,
  })
}
