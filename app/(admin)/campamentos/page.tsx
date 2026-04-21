import Link from 'next/link'
import { Suspense } from 'react'
import { MdAdd, MdChevronRight, MdPlace, MdEvent, MdGroup } from 'react-icons/md'
import { getCampamentos, getProximoCampamento, getInscripcionesPorCampamento } from '@/lib/data'
import { T, BRANCH_KEY } from '@/lib/tokens'
import { BranchChip } from '@/components/ui'
import CampamentosFilter from '@/components/CampamentosFilter'
import type { RamaCampamento } from '@/lib/types'

export const dynamic = 'force-dynamic'

const TILE_PATTERN: Record<string, string> = {
  'Lobatos y Lobeznas': `repeating-linear-gradient(45deg, ${T.lobatos.bg} 0px, ${T.lobatos.bg} 8px, ${T.lobatos.track}22 8px, ${T.lobatos.track}22 16px)`,
  Scouts:               `repeating-linear-gradient(45deg, ${T.unidad.bg} 0px, ${T.unidad.bg} 8px, ${T.unidad.track}22 8px, ${T.unidad.track}22 16px)`,
  Caminantes:           `repeating-linear-gradient(45deg, ${T.caminantes.bg} 0px, ${T.caminantes.bg} 8px, ${T.caminantes.track}22 8px, ${T.caminantes.track}22 16px)`,
  Rovers:               `repeating-linear-gradient(45deg, ${T.rovers.bg} 0px, ${T.rovers.bg} 8px, ${T.rovers.track}22 8px, ${T.rovers.track}22 16px)`,
  Grupal:               `repeating-linear-gradient(45deg, ${T.caminantes.bg} 0px, ${T.caminantes.bg} 8px, ${T.primary}18 8px, ${T.primary}18 16px)`,
}

function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function fmtFull(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function CampamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ rama?: string }>
}) {
  const { rama } = await searchParams

  const [allCampamentos, proximo, inscCount] = await Promise.all([
    getCampamentos(),
    getProximoCampamento(),
    getInscripcionesPorCampamento(),
  ])

  // Filter
  let campamentos = allCampamentos
  if (rama === 'activo') {
    campamentos = allCampamentos.filter(c => c.activo)
  } else if (rama === 'archivado') {
    campamentos = allCampamentos.filter(c => !c.activo)
  } else if (rama) {
    campamentos = allCampamentos.filter(c => c.rama === rama)
  }

  const proxInsc = proximo ? (inscCount[proximo.id] ?? 0) : 0
  const CAP = 40 // assumed capacity for progress bar

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero */}
      {proximo && (
        <section style={{
          borderRadius: T.r.xxl,
          background: `linear-gradient(120deg, ${T.primary} 0%, ${T.primaryContainer} 55%, ${T.caminantes.track} 100%)`,
          padding: 32, color: T.onPrimary, position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 60, bottom: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>
                Próxima aventura
              </div>
              <h2 style={{ fontFamily: T.headline, fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px', lineHeight: 1.1 }}>
                {proximo.nombre}
              </h2>
              <div style={{ display: 'flex', gap: 20, fontSize: 13.5, opacity: 0.88, flexWrap: 'wrap', marginBottom: 20 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MdEvent size={15} /> {fmt(proximo.fecha_inicio)} — {fmtFull(proximo.fecha_fin)}
                </span>
                {proximo.lugar && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdPlace size={15} /> {proximo.lugar}
                  </span>
                )}
                {proximo.precio_estimado && (
                  <span style={{ fontWeight: 700 }}>
                    ${Number(proximo.precio_estimado).toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              {/* Inscription progress */}
              <div style={{ maxWidth: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MdGroup size={13} /> {proxInsc} anotados</span>
                  <span>{CAP} cupos</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (proxInsc / CAP) * 100)}%`, background: '#fff', borderRadius: 999 }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <Link href={`/campamentos/${proximo.id}`} style={{
                background: '#fff', color: T.primary, padding: '12px 22px', borderRadius: T.r.lg,
                fontFamily: T.body, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}>
                Ver aventura <MdChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Header + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline, margin: '0 0 3px' }}>Actividades</p>
          <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.onSurface, letterSpacing: '-0.02em', margin: 0 }}>
            Campamentos
          </h1>
        </div>
        <Link href="/campamentos/nuevo" style={{
          background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
          color: T.onPrimary, padding: '11px 20px', borderRadius: T.r.md,
          fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(0,92,173,0.25)', textDecoration: 'none',
        }}>
          <MdAdd size={18} /> Nueva aventura
        </Link>
      </div>

      {/* Filter pills */}
      <Suspense>
        <CampamentosFilter />
      </Suspense>

      {/* List */}
      {campamentos.length === 0 ? (
        <div style={{ background: T.surfaceLowest, borderRadius: T.r.xl, padding: 64, textAlign: 'center' }}>
          <p style={{ color: T.outline, fontSize: 15, margin: '0 0 16px' }}>Sin campamentos en esta categoría</p>
          <Link href="/campamentos/nuevo" style={{ color: T.primary, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Planificar el primero <MdChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {campamentos.map((c) => {
            const inicio = new Date(c.fecha_inicio + 'T00:00:00')
            const fin = new Date(c.fecha_fin + 'T00:00:00')
            const hoy = new Date()
            const diasRestantes = Math.ceil((inicio.getTime() - hoy.getTime()) / 86400000)
            const enCurso = inicio <= hoy && hoy <= fin
            const pasado = fin < hoy
            const branchKey = BRANCH_KEY[c.rama as RamaCampamento]
            const branchToken = branchKey ? T[branchKey] : T.caminantes
            const insc = inscCount[c.id] ?? 0
            const tilePattern = TILE_PATTERN[c.rama] ?? TILE_PATTERN['Grupal']

            let stateLabel = 'Próximo'
            let stateBg = '#d5e3ff'
            let stateFg = '#004787'
            if (!c.activo) { stateLabel = 'Archivado'; stateBg = '#e7eeff'; stateFg = '#717784' }
            else if (enCurso) { stateLabel = 'En curso'; stateBg = '#c8ecd4'; stateFg = '#0f7a3d' }
            else if (pasado) { stateLabel = 'Finalizado'; stateBg = '#e7eeff'; stateFg = '#717784' }
            else if (diasRestantes <= 14) { stateLabel = `${diasRestantes}d`; stateBg = '#ffe3b0'; stateFg = '#a86400' }

            return (
              <div key={c.id} style={{
                background: T.surfaceLowest, borderRadius: T.r.xl,
                display: 'grid', gridTemplateColumns: '140px 1fr auto',
                gap: 0, alignItems: 'stretch',
                boxShadow: T.shadowSoft, overflow: 'hidden',
                opacity: !c.activo && pasado ? 0.6 : 1,
              }}>
                {/* Patterned tile */}
                <div style={{
                  background: tilePattern,
                  minHeight: 120, display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: 12,
                }}>
                  <span style={{
                    fontFamily: T.mono, fontSize: 10.5, fontWeight: 600,
                    background: 'rgba(255,255,255,0.85)', padding: '3px 8px',
                    borderRadius: T.r.sm, color: T.onSurfaceVariant, backdropFilter: 'blur(4px)',
                    display: 'inline-block',
                  }}>
                    {inicio.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                  {/* Chips row */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <BranchChip branch={c.rama} />
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: stateBg, color: stateFg,
                      padding: '3px 10px', borderRadius: T.r.pill,
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    }}>
                      {stateLabel}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: T.headline, fontSize: 20, fontWeight: 700, color: T.onSurface, margin: 0, letterSpacing: '-0.018em', lineHeight: 1.2 }}>
                    {c.nombre}
                  </h3>

                  <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: T.onSurfaceVariant, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MdEvent size={13} style={{ color: T.outline }} />
                      {fmt(c.fecha_inicio)} — {fmtFull(c.fecha_fin)}
                    </span>
                    {c.lugar && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MdPlace size={13} style={{ color: T.outline }} /> {c.lugar}
                      </span>
                    )}
                    {c.precio_estimado && (
                      <span style={{ fontWeight: 700, color: T.primary }}>
                        ${Number(c.precio_estimado).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>

                  {/* Inscription bar */}
                  <div style={{ maxWidth: 200, marginTop: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.outline, marginBottom: 4 }}>
                      <span>{insc} anotados</span>
                    </div>
                    <div style={{ height: 4, background: T.surfaceHighest, borderRadius: T.r.pill, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${Math.min(100, (insc / CAP) * 100)}%`,
                        background: branchToken.track, borderRadius: T.r.pill,
                      }} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, alignItems: 'flex-end' }}>
                  <Link href={`/campamentos/${c.id}`} style={{
                    background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
                    color: T.onPrimary, padding: '9px 16px', borderRadius: T.r.md,
                    fontSize: 12.5, fontWeight: 700, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    boxShadow: '0 3px 10px rgba(0,92,173,0.2)', whiteSpace: 'nowrap',
                  }}>
                    Ver aventura <MdChevronRight size={14} />
                  </Link>
                  <span style={{ fontSize: 12, color: T.outline, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdGroup size={13} /> {insc} anotados
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
