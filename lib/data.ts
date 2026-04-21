import { createServerClient } from './supabase/server'
import { calcularEstadoPago, MESES_SCOUT, type EstadoPago } from './types'

function dbError(error: { message: string; hint?: string }): never {
  throw new Error(`Error de base de datos: ${error.message}${error.hint ? ` (${error.hint})` : ''}`)
}

// ============================================================
// PROTAGONISTAS (tabla: beneficiarios)
// ============================================================

export async function getBeneficiarios(
  search?: string,
  rama?: string,
  activo?: string
) {
  const supabase = await createServerClient()
  let query = supabase.from('beneficiarios').select('*').order('apellido', { ascending: true })

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,apellido.ilike.%${search}%,dni.ilike.%${search}%`
    )
  }
  if (rama && rama !== 'all') {
    query = query.eq('rama', rama)
  }
  if (activo && activo !== 'all') {
    query = query.eq('activo', activo === 'true')
  }

  const { data, error } = await query
  if (error) dbError(error)
  return data || []
}

/** Retorna protagonistas con su estado de pago calculado para el año dado */
export async function getBeneficiariosConEstado(
  anio: number,
  search?: string,
  rama?: string,
  activo?: string,
  estadoPago?: string
) {
  const supabase = await createServerClient()
  const mesActual = new Date().getMonth() + 1

  let query = supabase
    .from('beneficiarios')
    .select('*, pagos(periodo_mes, periodo_anio, meses_cubiertos, tipo)')
    .order('apellido', { ascending: true })

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,apellido.ilike.%${search}%,dni.ilike.%${search}%`
    )
  }
  if (rama && rama !== 'all') query = query.eq('rama', rama)
  if (activo && activo !== 'all') query = query.eq('activo', activo === 'true')

  const { data, error } = await query
  if (error) dbError(error)

  const conEstado = (data || []).map((b) => {
    const pagos = (b.pagos || []) as Array<{
      periodo_mes: number
      periodo_anio: number
      meses_cubiertos?: string[]
      tipo: string
    }>
    const estado: EstadoPago = b.activo
      ? calcularEstadoPago(pagos as never, anio, mesActual)
      : 'al_dia'
    return { ...b, estado }
  })

  if (estadoPago && estadoPago !== 'all') {
    return conEstado.filter((b) => b.estado === estadoPago)
  }
  return conEstado
}

export async function getBeneficiario(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('beneficiarios')
    .select('*')
    .eq('id', id)
    .single()
  if (error) dbError(error)
  return data!
}

// ============================================================
// HISTORIAL DE RAMA
// ============================================================

export async function getHistorialRama(protagonistaId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('historial_rama')
    .select('*')
    .eq('protagonista_id', protagonistaId)
    .order('fecha', { ascending: false })
  if (error) dbError(error)
  return data || []
}

// ============================================================
// PAGOS
// ============================================================

export async function getPagosByBeneficiario(beneficiarioId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('beneficiario_id', beneficiarioId)
    .order('fecha_pago', { ascending: false })
  if (error) dbError(error)
  return data || []
}

export async function getPago(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pagos')
    .select('*, beneficiarios(*)')
    .eq('id', id)
    .single()
  if (error) dbError(error)
  return data!
}

export async function getUltimosPagos(limite = 5) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pagos')
    .select('*, beneficiarios(nombre, apellido, rama)')
    .order('created_at', { ascending: false })
    .limit(limite)
  if (error) dbError(error)
  return data || []
}

// ============================================================
// CAMPAMENTOS
// ============================================================

export async function getCampamentos(soloActivos = false) {
  const supabase = await createServerClient()
  let query = supabase
    .from('campamentos')
    .select('*')
    .order('fecha_inicio', { ascending: true })
  if (soloActivos) query = query.eq('activo', true)
  const { data, error } = await query
  if (error) dbError(error)
  return data || []
}

export async function getCampamento(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('campamentos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) dbError(error)
  return data!
}

export async function getProximoCampamento() {
  const supabase = await createServerClient()
  const hoy = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('campamentos')
    .select('*')
    .eq('activo', true)
    .gte('fecha_inicio', hoy)
    .order('fecha_inicio', { ascending: true })
    .limit(1)
    .single()
  return data || null
}

export async function getInscripcionesPorCampamento(): Promise<Record<string, number>> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('inscripciones_campamento')
    .select('campamento_id')
  if (!data) return {}
  return data.reduce((acc: Record<string, number>, row: { campamento_id: string }) => {
    acc[row.campamento_id] = (acc[row.campamento_id] || 0) + 1
    return acc
  }, {})
}

// ============================================================
// MESES ACTIVOS
// ============================================================

export async function getMesesActivos(anio: number) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meses_activos')
    .select('mes')
    .eq('anio', anio)
    .order('mes', { ascending: true })
  if (error) dbError(error)
  return (data || []).map((r) => r.mes as number)
}

// ============================================================
// EDUCADORES / USUARIOS APP
// ============================================================

export async function getUsuariosApp() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('usuarios_app')
    .select('*')
    .order('nombre', { ascending: true })
  if (error) dbError(error)
  return data || []
}

// ============================================================
// ESTADO DE CUENTA
// ============================================================

export type MovimientoCuenta = {
  id: string
  tipo: 'debito' | 'credito'
  concepto: string
  monto: number
  fecha: string
  referencia?: string
}

export type EstadoCuentaCampamento = {
  campamento: { id: string; nombre: string }
  movimientos: MovimientoCuenta[]
  totalDebitos: number
  totalCreditos: number
  saldo: number
}

export type EstadoCuenta = {
  membresia: {
    movimientos: MovimientoCuenta[]
    totalDebitos: number
    totalCreditos: number
    saldo: number
  }
  campamentos: EstadoCuentaCampamento[]
}

export async function getEstadoCuenta(beneficiarioId: string): Promise<EstadoCuenta> {
  const supabase = await createServerClient()

  const [cuotasRes, pagosRes, notasRes, inscripcionesRes] = await Promise.all([
    supabase
      .from('cuotas_pendientes')
      .select('id, tipo, meses_cubiertos, monto, created_at')
      .eq('beneficiario_id', beneficiarioId)
      .order('created_at', { ascending: false }),
    supabase
      .from('pagos')
      .select('id, tipo, monto, fecha_pago, concepto, campamento_id, periodo_mes, periodo_anio, meses_cubiertos')
      .eq('beneficiario_id', beneficiarioId)
      .order('fecha_pago', { ascending: false }),
    supabase
      .from('notas_credito')
      .select('id, monto, concepto, fecha, campamento_aplicado_id')
      .eq('protagonista_id', beneficiarioId)
      .order('fecha', { ascending: false }),
    supabase
      .from('inscripciones_campamento')
      .select('id, monto, notas, created_at, campamento_id, campamentos(id, nombre)')
      .eq('beneficiario_id', beneficiarioId)
      .order('created_at', { ascending: false }),
  ])

  // ── Membresía ────────────────────────────────────────────
  const movMemb: MovimientoCuenta[] = []

  for (const cp of cuotasRes.data || []) {
    if (cp.tipo === 'mensual' || cp.tipo === 'trimestral') {
      movMemb.push({
        id: `cp-${cp.id}`,
        tipo: 'debito',
        concepto: cp.tipo === 'trimestral' ? 'Cuota trimestral' : 'Cuota mensual',
        monto: Number(cp.monto),
        fecha: cp.created_at,
      })
    }
  }

  for (const p of pagosRes.data || []) {
    if (p.tipo === 'mensual' || p.tipo === 'trimestral') {
      movMemb.push({
        id: `p-${p.id}`,
        tipo: 'credito',
        concepto: p.concepto || (p.tipo === 'trimestral' ? 'Cuota trimestral' : 'Cuota mensual'),
        monto: Number(p.monto),
        fecha: p.fecha_pago,
      })
    }
  }

  for (const n of notasRes.data || []) {
    if (!n.campamento_aplicado_id) {
      movMemb.push({
        id: `n-${n.id}`,
        tipo: 'credito',
        concepto: n.concepto || 'Nota de crédito',
        monto: Number(n.monto),
        fecha: n.fecha,
      })
    }
  }

  movMemb.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  const debitosMemb = movMemb.filter(m => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0)
  const creditosMemb = movMemb.filter(m => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0)

  // ── Campamentos ──────────────────────────────────────────
  const campMap = new Map<string, EstadoCuentaCampamento>()

  for (const insc of inscripcionesRes.data || []) {
    const camp = insc.campamentos as unknown as { id: string; nombre: string }
    if (!campMap.has(insc.campamento_id)) {
      campMap.set(insc.campamento_id, {
        campamento: { id: camp.id, nombre: camp.nombre },
        movimientos: [],
        totalDebitos: 0,
        totalCreditos: 0,
        saldo: 0,
      })
    }
    campMap.get(insc.campamento_id)!.movimientos.push({
      id: `i-${insc.id}`,
      tipo: 'debito',
      concepto: `Inscripción${insc.notas ? ` — ${insc.notas}` : ''}`,
      monto: Number(insc.monto),
      fecha: insc.created_at,
    })
  }

  for (const p of pagosRes.data || []) {
    if (p.tipo === 'campamento' && p.campamento_id) {
      if (!campMap.has(p.campamento_id)) {
        campMap.set(p.campamento_id, {
          campamento: { id: p.campamento_id, nombre: 'Campamento' },
          movimientos: [],
          totalDebitos: 0,
          totalCreditos: 0,
          saldo: 0,
        })
      }
      campMap.get(p.campamento_id)!.movimientos.push({
        id: `p-${p.id}`,
        tipo: 'credito',
        concepto: p.concepto || 'Pago campamento',
        monto: Number(p.monto),
        fecha: p.fecha_pago,
      })
    }
  }

  for (const n of notasRes.data || []) {
    if (n.campamento_aplicado_id && campMap.has(n.campamento_aplicado_id)) {
      campMap.get(n.campamento_aplicado_id)!.movimientos.push({
        id: `n-${n.id}`,
        tipo: 'credito',
        concepto: n.concepto || 'Nota de crédito',
        monto: Number(n.monto),
        fecha: n.fecha,
      })
    }
  }

  const campamentos = Array.from(campMap.values()).map((c) => {
    c.movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    c.totalDebitos = c.movimientos.filter(m => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0)
    c.totalCreditos = c.movimientos.filter(m => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0)
    c.saldo = c.totalCreditos - c.totalDebitos
    return c
  })

  return {
    membresia: {
      movimientos: movMemb,
      totalDebitos: debitosMemb,
      totalCreditos: creditosMemb,
      saldo: creditosMemb - debitosMemb,
    },
    campamentos,
  }
}

// ============================================================
// CUOTAS PENDIENTES
// ============================================================

export async function getInscripcionesByBeneficiario(beneficiarioId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('inscripciones_campamento')
    .select('id, monto, notas, created_at, campamento_id, campamentos(id, nombre, fecha_inicio, fecha_fin, activo)')
    .eq('beneficiario_id', beneficiarioId)
    .order('created_at', { ascending: false })
  if (error) dbError(error)
  return data || []
}

export async function getCuotasPendientesByBeneficiario(beneficiarioId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cuotas_pendientes')
    .select('*')
    .eq('beneficiario_id', beneficiarioId)
    .order('fecha_vencimiento', { ascending: true })
  if (error) dbError(error)
  return data || []
}

// ============================================================
// CUOTA CONFIG
// ============================================================

export async function getCuotaActual() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('cuota_config')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data || null
}

export async function getHistorialCuota() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cuota_config')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) dbError(error)
  return data || []
}

export async function getCurrentUserRole(userId: string) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('usuarios_app')
    .select('rol')
    .eq('id', userId)
    .single()
  return data?.rol as string | null
}

// ============================================================
// GRUPOS FAMILIARES
// ============================================================

export async function getGruposFamiliares() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('grupos_familiares')
    .select('*, beneficiarios(id, nombre, apellido, rama, orden_hermano, activo)')
    .order('apellido_familia', { ascending: true })
  if (error) dbError(error)
  return data || []
}

export async function getGrupoFamiliar(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('grupos_familiares')
    .select('*, beneficiarios(id, nombre, apellido, rama, orden_hermano, activo)')
    .eq('id', id)
    .single()
  if (error) dbError(error)
  return data!
}

// ============================================================
// NOTAS DE CRÉDITO
// ============================================================

export async function getNotasCreditoByProtagonista(protagonistaId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('notas_credito')
    .select('*')
    .eq('protagonista_id', protagonistaId)
    .order('fecha', { ascending: false })
  if (error) dbError(error)
  return data || []
}

// ============================================================
// DOCUMENTOS PROTAGONISTA
// ============================================================

export async function getDocumentosByProtagonista(protagonistaId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('documentos_protagonista')
    .select('*')
    .eq('protagonista_id', protagonistaId)
    .order('created_at', { ascending: false })
  if (error) dbError(error)

  const docs = data || []
  const docsConUrl = await Promise.all(
    docs.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from('documentos')
        .createSignedUrl(doc.storage_path, 3600)
      return { ...doc, url: signed?.signedUrl ?? '' }
    })
  )
  return docsConUrl
}

// ============================================================
// DASHBOARD
// ============================================================

export async function getDashboardStats() {
  const supabase = await createServerClient()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const [benRes, pagosRes] = await Promise.all([
    supabase.from('beneficiarios').select('activo, rama'),
    supabase.from('pagos').select('monto, fecha_pago, periodo_mes, periodo_anio'),
  ])

  const beneficiarios = benRes.data || []
  const pagos = pagosRes.data || []

  const totalProtagonistas = beneficiarios.length
  const activos = beneficiarios.filter((b) => b.activo).length

  const recaudadoMes = pagos
    .filter((p) => p.periodo_mes === currentMonth && p.periodo_anio === currentYear)
    .reduce((sum, p) => sum + Number(p.monto), 0)

  const recaudadoAnio = pagos
    .filter((p) => p.periodo_anio === currentYear)
    .reduce((sum, p) => sum + Number(p.monto), 0)

  // Protagonistas con deuda (los que no pagaron al menos un mes scout transcurrido)
  const { data: conPagos } = await supabase
    .from('beneficiarios')
    .select('id, nombre, apellido, rama, activo, pagos(periodo_mes, periodo_anio, meses_cubiertos)')
    .eq('activo', true)

  let conDeuda = 0
  const mesesTranscurridos = MESES_SCOUT.filter((m) => m <= currentMonth)

  for (const b of conPagos || []) {
    const estado = calcularEstadoPago(
      (b.pagos || []) as never,
      currentYear,
      currentMonth
    )
    if (estado === 'adeuda' && mesesTranscurridos.length > 0) conDeuda++
  }

  // Resumen por rama
  const resumenRama: Record<string, { total: number; activos: number }> = {}
  for (const b of beneficiarios) {
    if (!resumenRama[b.rama]) resumenRama[b.rama] = { total: 0, activos: 0 }
    resumenRama[b.rama].total++
    if (b.activo) resumenRama[b.rama].activos++
  }

  return {
    totalProtagonistas,
    activos,
    recaudadoMes,
    recaudadoAnio,
    conDeuda,
    resumenRama,
  }
}

// ============================================================
// BLOG
// ============================================================

export async function getBlogPosts(soloPublicados = true) {
  const supabase = await createServerClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (soloPublicados) query = query.eq('publicado', true)
  const { data, error } = await query
  if (error) dbError(error)
  return data || []
}

export async function getBlogPost(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) dbError(error)
  return data
}

export async function getBlogPostById(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) dbError(error)
  return data
}

// ============================================================
// MENSAJES DE CONTACTO
// ============================================================

export async function getMensajesContacto() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) dbError(error)
  return data || []
}

// ============================================================
// BLOG — versiones públicas (sin sesión, usan anon key)
// ============================================================

export async function getBlogPostsPublic() {
  const { createPublicClient } = await import('./supabase/public')
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getBlogPostPublic(slug: string) {
  const { createPublicClient } = await import('./supabase/public')
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()
  return data
}

// ============================================================
// PAGOS — dashboard stats
// ============================================================

export async function getPagosStats(mes: number, anio: number) {
  const supabase = await createServerClient()

  const pad = (n: number) => String(n).padStart(2, '0')
  const primerDia = `${anio}-${pad(mes)}-01`
  const diasMes = new Date(anio, mes, 0).getDate()
  const ultimoDia = `${anio}-${pad(mes)}-${pad(diasMes)}`

  const mesAnt = mes === 1 ? 12 : mes - 1
  const anioAnt = mes === 1 ? anio - 1 : anio
  const primerDiaAnt = `${anioAnt}-${pad(mesAnt)}-01`
  const ultimoDiaAnt = `${anioAnt}-${pad(mesAnt)}-${pad(new Date(anioAnt, mesAnt, 0).getDate())}`

  const [pagosMesRes, pagosAntRes, cuotasPendRes, activosRes] = await Promise.all([
    supabase.from('pagos').select('id, monto, beneficiario_id, concepto')
      .gte('fecha_pago', primerDia).lte('fecha_pago', ultimoDia),
    supabase.from('pagos').select('monto')
      .gte('fecha_pago', primerDiaAnt).lte('fecha_pago', ultimoDiaAnt),
    supabase.from('cuotas_pendientes')
      .select('monto, estado, beneficiario_id, beneficiarios(id, nombre, apellido, rama)')
      .in('estado', ['pendiente', 'vencido']),
    supabase.from('beneficiarios').select('id').eq('activo', true),
  ])

  const pagosMes = pagosMesRes.data || []
  const cobradoMes = pagosMes.reduce((s, p) => s + Number(p.monto), 0)
  const cobradoAnt = (pagosAntRes.data || []).reduce((s, p) => s + Number(p.monto), 0)
  const variacion = cobradoAnt > 0 ? ((cobradoMes - cobradoAnt) / cobradoAnt) * 100 : 0
  const cuotasMesPagadas = new Set(pagosMes.map(p => p.beneficiario_id)).size
  const totalActivos = activosRes.data?.length ?? 0
  const fondoCamp = pagosMes
    .filter(p => (p.concepto || '').toLowerCase().includes('campamento'))
    .reduce((s, p) => s + Number(p.monto), 0)

  const cuotasPend = cuotasPendRes.data || []
  const pendienteTotal = cuotasPend.reduce((s, p) => s + Number(p.monto), 0)

  const morososMap = new Map<string, { id: string; nombre: string; apellido: string; rama: string; monto: number; cuotas: number }>()
  for (const cp of cuotasPend) {
    const b = cp.beneficiarios as unknown as { id: string; nombre: string; apellido: string; rama: string } | null
    if (!b || Array.isArray(b)) continue
    if (!morososMap.has(b.id)) morososMap.set(b.id, { id: b.id, nombre: b.nombre, apellido: b.apellido, rama: b.rama, monto: 0, cuotas: 0 })
    const e = morososMap.get(b.id)!
    e.monto += Number(cp.monto)
    e.cuotas += 1
  }
  const morosos = Array.from(morososMap.values()).sort((a, b) => b.monto - a.monto).slice(0, 6)

  return { cobradoMes, variacion, cuotasMesPagadas, totalActivos, pendienteTotal, fondoCamp, morosos }
}

export async function getFlujoMensual(anio: number) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('pagos')
    .select('monto, fecha_pago, concepto')
    .gte('fecha_pago', `${anio}-01-01`)
    .lte('fecha_pago', `${anio}-12-31`)

  const flujo: Record<number, { cuotas: number; campamentos: number }> = {}
  for (let m = 1; m <= 12; m++) flujo[m] = { cuotas: 0, campamentos: 0 }

  for (const p of data || []) {
    const m = new Date(p.fecha_pago + 'T00:00:00').getMonth() + 1
    const monto = Number(p.monto)
    const concepto = (p.concepto || '').toLowerCase()
    if (concepto.includes('campamento')) flujo[m].campamentos += monto
    else flujo[m].cuotas += monto
  }
  return flujo
}

export async function getUltimosPagosDetallados(limite = 10) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pagos')
    .select('*, beneficiarios(id, nombre, apellido, rama)')
    .order('fecha_pago', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limite)
  if (error) dbError(error)
  return data || []
}
