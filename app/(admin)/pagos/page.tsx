import Link from 'next/link'
import { MdAdd, MdDownload, MdTrendingUp, MdTrendingDown, MdMail, MdChevronRight } from 'react-icons/md'
import { getPagosStats, getFlujoMensual, getUltimosPagosDetallados, getCuotaActual } from '@/lib/data'
import { T, BRANCH_KEY } from '@/lib/tokens'
import { Avatar } from '@/components/ui'
import { PeriodSelector } from '@/components/PeriodSelector'
import { MESES } from '@/lib/types'

export const dynamic = 'force-dynamic'

const MESES_LABEL: Record<number, string> = {
  4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov',
}

const METODO_COLOR: Record<string, string> = {
  Transferencia: T.primary,
  Efectivo:      T.success,
  Cheque:        T.warn,
  MercadoPago:   '#9333ea',
}

function fmt(v: number) {
  return `$${v.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; anio?: string }>
}) {
  const { mes: mesParam, anio: anioParam } = await searchParams
  const now = new Date()
  const anio = anioParam ? Number(anioParam) : now.getFullYear()
  // Default to current month, but clamp to scout months (4–11)
  const mesDefault = Math.min(11, Math.max(4, now.getMonth() + 1))
  const mes = mesParam ? Number(mesParam) : mesDefault

  const [stats, flujo, ultimosPagos, cuotaActual] = await Promise.all([
    getPagosStats(mes, anio),
    getFlujoMensual(anio),
    getUltimosPagosDetallados(10),
    getCuotaActual(),
  ])

  const cuotaMensual = cuotaActual ? Number((cuotaActual as Record<string, unknown>).monto) : 0

  // Bar chart — only scout months (4–11)
  const mesesChart = [4, 5, 6, 7, 8, 9, 10, 11]
  const chartData = mesesChart.map(m => ({
    mes: m,
    label: MESES_LABEL[m],
    cuotas: flujo[m]?.cuotas ?? 0,
    campamentos: flujo[m]?.campamentos ?? 0,
    active: m === mes,
  }))
  const maxTotal = Math.max(...chartData.map(d => d.cuotas + d.campamentos), 1)
  const CHART_H = 180

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline, margin: '0 0 4px', fontFamily: T.body }}>
            Finanzas
          </p>
          <h1 style={{ fontFamily: T.headline, fontSize: 28, fontWeight: 800, color: T.onSurface, letterSpacing: '-0.02em', margin: 0 }}>
            Pagos del grupo
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/api/export/pagos" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: T.primaryFixed, color: T.onPrimaryFixedVariant,
            padding: '10px 16px', borderRadius: T.r.md,
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>
            <MdDownload size={16} /> Exportar
          </Link>
          <Link href="/pagos/nuevo" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
            color: T.onPrimary, padding: '10px 16px', borderRadius: T.r.md,
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,92,173,0.22)',
          }}>
            <MdAdd size={16} /> Registrar cobro
          </Link>
        </div>
      </div>

      {/* Period selector */}
      <PeriodSelector mesActivo={mes} anio={anio} />

      {/* KPI hero ribbon */}
      <div style={{
        background: `linear-gradient(110deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
        borderRadius: T.r.xl, padding: 32, color: '#fff', marginBottom: 20,
        display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: 32, alignItems: 'center',
      }}>
        {/* Main KPI */}
        <div>
          <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.primaryFixedDim }}>
            Cobrado en {MESES_LABEL[mes] ?? ''} {anio}
          </span>
          <div style={{ fontFamily: T.headline, fontSize: 48, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 6 }}>
            {fmt(stats.cobradoMes)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontFamily: T.body, fontSize: 12.5, color: T.primaryFixedDim }}>
            {stats.variacion >= 0
              ? <MdTrendingUp size={15} />
              : <MdTrendingDown size={15} />
            }
            {stats.variacion >= 0 ? '+' : ''}{stats.variacion.toFixed(1)}% respecto al mes anterior
            {' · '}{stats.cuotasMesPagadas} de {stats.totalActivos} cuotas cobradas
          </div>
        </div>

        {[
          {
            l: 'Cuota mensual',
            v: fmt(cuotaMensual),
            s: `Titular · ciclo ${anio}`,
          },
          {
            l: 'Pendiente',
            v: fmt(stats.pendienteTotal),
            s: `${stats.morosos.length} protagonistas con deuda`,
          },
          {
            l: 'Fondo campamentos',
            v: fmt(stats.fondoCamp),
            s: 'Aportes del mes',
          },
        ].map((k, i) => (
          <div key={i}>
            <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.primaryFixedDim }}>
              {k.l}
            </span>
            <div style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6 }}>{k.v}</div>
            <div style={{ fontFamily: T.body, fontSize: 11.5, color: T.primaryFixedDim, marginTop: 2 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Chart + mora */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Bar chart */}
        <div style={{ background: T.surfaceLowest, borderRadius: T.r.lg, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.primary }}>
                Ingreso mensual
              </span>
              <h3 style={{ fontFamily: T.headline, fontSize: 20, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.015em', color: T.onSurface }}>
                Flujo del ciclo {anio}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 16, fontFamily: T.body, fontSize: 12, color: T.onSurfaceVariant }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.primary }} /> Cuotas
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.lobatos.bg }} /> Campamentos
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mesesChart.length}, 1fr)`, gap: 12, height: CHART_H + 40, alignItems: 'end' }}>
            {chartData.map((d) => {
              const total = d.cuotas + d.campamentos
              const hCuotas = total > 0 ? Math.round((d.cuotas / maxTotal) * CHART_H) : 0
              const hCamp = total > 0 ? Math.round((d.campamentos / maxTotal) * CHART_H) : 0
              return (
                <div key={d.mes} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {total > 0 && (
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: d.active ? T.primary : T.outline, fontWeight: 700 }}>
                      {fmt(total)}
                    </span>
                  )}
                  <div style={{
                    width: '100%', maxWidth: 52, display: 'flex', flexDirection: 'column',
                    borderRadius: T.r.sm, overflow: 'hidden',
                    opacity: d.active ? 1 : 0.65,
                    minHeight: 4,
                  }}>
                    {hCamp > 0 && <div style={{ height: hCamp, background: T.lobatos.bg }} />}
                    {hCuotas > 0 && <div style={{ height: hCuotas, background: d.active ? T.primary : T.primaryFixedDim }} />}
                    {total === 0 && <div style={{ height: 4, background: T.surfaceContainer, borderRadius: T.r.sm }} />}
                  </div>
                  <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: d.active ? 700 : 500, color: d.active ? T.onSurface : T.outline }}>
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* En mora */}
        <div style={{ background: T.surfaceLowest, borderRadius: T.r.lg, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
                Atención
              </span>
              <h3 style={{ fontFamily: T.headline, fontSize: 20, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.015em', color: T.onSurface }}>
                En mora
              </h3>
            </div>
            {stats.morosos.length > 0 && (
              <span style={{
                background: T.errorContainer, color: T.onSecondaryFixedVariant,
                padding: '3px 10px', borderRadius: T.r.pill,
                fontSize: 11, fontWeight: 700, fontFamily: T.body,
              }}>
                {stats.morosos.length} casos
              </span>
            )}
          </div>

          {stats.morosos.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: T.outline, fontSize: 13, fontFamily: T.body }}>
              Sin protagonistas en mora
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {stats.morosos.map((p, i) => {
                  const key = BRANCH_KEY[p.rama]
                  const branchColors = key ? T[key] : T.caminantes
                  const initials = `${p.nombre[0]}${p.apellido[0]}`
                  const cuotasLabel = p.cuotas === 1 ? '1 cuota' : `${p.cuotas} cuotas`
                  return (
                    <Link key={p.id} href={`/protagonistas/${p.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 0', textDecoration: 'none',
                      borderBottom: i < stats.morosos.length - 1 ? `1px solid ${T.outlineVariant}33` : 'none',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                        background: branchColors.bg, color: branchColors.fg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: T.headline, fontWeight: 700, fontSize: 11,
                      }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.onSurface, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.apellido}, {p.nombre}
                        </div>
                        <div style={{ fontFamily: T.body, fontSize: 11.5, color: T.outline }}>{cuotasLabel} vencida{p.cuotas > 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ fontFamily: T.mono, fontSize: 12.5, fontWeight: 700, color: T.error, flexShrink: 0 }}>
                        {fmt(p.monto)}
                      </div>
                    </Link>
                  )
                })}
              </div>
              <Link href="/protagonistas?estado=adeuda" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 14, padding: '10px 0',
                background: T.primaryFixed, color: T.onPrimaryFixedVariant,
                borderRadius: T.r.md, textDecoration: 'none',
                fontFamily: T.body, fontSize: 13, fontWeight: 700,
              }}>
                <MdMail size={16} /> Ver todos en mora
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Últimos cobros */}
      <div style={{ background: T.surfaceLowest, borderRadius: T.r.lg, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <div>
            <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
              Movimientos
            </span>
            <h3 style={{ fontFamily: T.headline, fontSize: 20, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.015em', color: T.onSurface }}>
              Últimos cobros
            </h3>
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1fr 36px',
          padding: '12px 24px', gap: 16, background: T.surfaceLow,
        }}>
          {['Protagonista / Familia', 'Concepto', 'Fecha', 'Medio', 'Monto', ''].map((h, i) => (
            <span key={i} style={{ fontFamily: T.body, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
              {h}
            </span>
          ))}
        </div>

        {ultimosPagos.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: T.outline, fontFamily: T.body, fontSize: 14 }}>
            No hay cobros registrados
          </div>
        ) : (
          ultimosPagos.map((pago, i) => {
            const b = pago.beneficiarios as { id: string; nombre: string; apellido: string; rama: string } | null
            const key = b ? BRANCH_KEY[b.rama] : undefined
            const branchColors = key ? T[key] : T.caminantes
            const initials = b ? `${b.nombre[0]}${b.apellido[0]}` : '?'
            const nombreDisplay = b ? `${b.apellido}, ${b.nombre}` : '—'
            const fecha = new Date(pago.fecha_pago + 'T00:00:00')
            const fechaStr = fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
            const metodoBg = METODO_COLOR[pago.metodo_pago] ?? T.outline

            return (
              <div key={pago.id} style={{
                display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1fr 36px',
                padding: '13px 24px', gap: 16, alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : T.surface,
                borderTop: `1px solid ${T.outlineVariant}22`,
              }}>
                {/* Protagonista */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                    background: branchColors.bg, color: branchColors.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.headline, fontWeight: 700, fontSize: 11,
                  }}>
                    {initials}
                  </div>
                  <span style={{ fontFamily: T.body, fontSize: 13.5, fontWeight: 600, color: T.onSurface, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nombreDisplay}
                  </span>
                </div>

                {/* Concepto */}
                <span style={{ fontFamily: T.body, fontSize: 13, color: T.onSurfaceVariant, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pago.concepto || (pago.tipo === 'campamento' ? 'Campamento' : `${MESES[pago.periodo_mes - 1]} ${pago.periodo_anio}`)}
                </span>

                {/* Fecha */}
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.outline }}>
                  {fechaStr}
                </span>

                {/* Método */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: T.body, fontSize: 12.5, color: T.onSurfaceVariant,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: metodoBg, flexShrink: 0 }} />
                  {pago.metodo_pago}
                </span>

                {/* Monto */}
                <span style={{ fontFamily: T.mono, fontSize: 13.5, fontWeight: 700, color: T.onSurface }}>
                  {fmt(Number(pago.monto))}
                </span>

                {/* Link */}
                {b && (
                  <Link href={`/protagonistas/${b.id}`} style={{ color: T.primary, display: 'flex', alignItems: 'center' }}>
                    <MdChevronRight size={18} />
                  </Link>
                )}
              </div>
            )
          })
        )}

        <div style={{ padding: '12px 24px', background: T.surfaceLow, fontFamily: T.body, fontSize: 12, color: T.outline, borderTop: `1px solid ${T.outlineVariant}22` }}>
          Mostrando los últimos {ultimosPagos.length} cobros
        </div>
      </div>
    </div>
  )
}
