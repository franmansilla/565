import Link from 'next/link'
import { MdAdd, MdChevronRight } from 'react-icons/md'
import { getBeneficiariosConEstado } from '@/lib/data'
import { RAMAS, type Rama, type EstadoPago } from '@/lib/types'

export const dynamic = 'force-dynamic'

const RAMA_CHIP: Record<Rama, { bg: string; fg: string; dot: string }> = {
  'Lobatos y Lobeznas': { bg: '#fef3c7', fg: '#92400e', dot: '#f59e0b' },
  Scouts:               { bg: '#dcfce7', fg: '#166534', dot: '#22c55e' },
  Caminantes:           { bg: '#dbeafe', fg: '#1e40af', dot: '#2085EE' },
  Rovers:               { bg: '#fee4e2', fg: '#991b1b', dot: '#ED1C1C' },
}

const ESTADO_DOT: Record<EstadoPago, { c: string; bg: string; label: string }> = {
  al_dia:     { c: '#0f7a3d', bg: '#c8ecd4', label: 'Al día' },
  adeuda:     { c: '#ba1a1a', bg: '#ffdad6', label: 'Adeuda' },
  adelantado: { c: '#2085EE', bg: '#dbeafe', label: 'Adelantado' },
}

const sel: React.CSSProperties = {
  background: '#f0f3ff', border: 'none', outline: 'none',
  padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
  fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 13, color: '#414753',
}

export default async function ProtagonistasPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; rama?: string; activo?: string; estado?: string }>
}) {
  const { search, rama, activo, estado } = await searchParams
  const protagonistas = await getBeneficiariosConEstado(new Date().getFullYear(), search, rama, activo, estado)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 4px' }}>Gestión</p>
          <h1 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#111c2d', letterSpacing: '-0.02em', margin: 0 }}>
            Nómina del grupo
          </h1>
        </div>
        <Link href="/protagonistas/nuevo" style={{
          background: 'linear-gradient(135deg, #2085EE 0%, #1468c9 100%)',
          color: '#fff', padding: '11px 20px', borderRadius: 12,
          fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(32,133,238,0.22)', textDecoration: 'none',
        }}>
          <MdAdd size={18} /> Inscribir
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
        <form style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <input name="search" defaultValue={search} placeholder="Buscar protagonista, DNI…"
            style={{ flex: 1, minWidth: 220, background: '#f0f3ff', border: 'none', outline: 'none', padding: '9px 14px', borderRadius: 999, fontSize: 13, color: '#111c2d' }} />
          <select name="rama" defaultValue={rama || 'all'} style={sel}>
            <option value="all">Todas las ramas</option>
            {RAMAS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select name="activo" defaultValue={activo || 'all'} style={sel}>
            <option value="all">Activos e inactivos</option>
            <option value="true">Solo activos</option>
            <option value="false">Solo inactivos</option>
          </select>
          <select name="estado" defaultValue={estado || 'all'} style={sel}>
            <option value="all">Todos los estados</option>
            <option value="al_dia">Al día</option>
            <option value="adeuda">Adeuda</option>
            <option value="adelantado">Adelantado</option>
          </select>
          <button type="submit" style={{ background: '#2085EE', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            Buscar
          </button>
          {(search || (rama && rama !== 'all') || (activo && activo !== 'all') || (estado && estado !== 'all')) && (
            <Link href="/protagonistas" style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #c0c6d5', color: '#414753', fontSize: 13, textDecoration: 'none' }}>
              Limpiar
            </Link>
          )}
        </form>
      </div>

      {protagonistas.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 64, textAlign: 'center' }}>
          <p style={{ color: '#717784', fontSize: 16, margin: '0 0 16px' }}>No se encontraron protagonistas</p>
          <Link href="/protagonistas/nuevo" style={{ color: '#2085EE', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Agregar el primero <MdChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr 1.1fr 1.1fr 1.2fr 1fr 36px', padding: '14px 20px', gap: 16, background: '#f0f3ff' }}>
            {['Protagonista', 'DNI', 'Rama', 'Activo', 'Cuotas', 'Ingreso', ''].map(h => (
              <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784' }}>{h}</div>
            ))}
          </div>

          {protagonistas.map((p, i) => {
            const chip = RAMA_CHIP[p.rama as Rama] ?? { bg: '#e7eeff', fg: '#414753', dot: '#717784' }
            const dot = p.activo && p.estado ? ESTADO_DOT[p.estado as EstadoPago] : null
            return (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '2.4fr 1fr 1.1fr 1.1fr 1.2fr 1fr 36px',
                padding: '14px 20px', gap: 16, alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : '#f9f9ff',
                borderTop: '1px solid rgba(192,198,213,0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, flexShrink: 0, background: chip.bg, color: chip.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                    {p.nombre[0]}{p.apellido[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#111c2d', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.apellido}, {p.nombre}
                    </div>
                    {p.mail_contacto && <div style={{ fontSize: 11.5, color: '#717784', marginTop: 1 }}>{p.mail_contacto}</div>}
                  </div>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#414753' }}>{p.dni || '—'}</div>

                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: chip.bg, color: chip.fg, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: chip.dot }} />
                    {p.rama.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: p.activo ? '#dbeafe' : '#f0f3ff', color: p.activo ? '#004787' : '#717784', padding: '3px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 700 }}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div>
                  {dot && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: dot.c, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot.c, boxShadow: `0 0 0 3px ${dot.bg}` }} />
                      {dot.label}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 12.5, color: '#717784' }}>
                  {p.fecha_ingreso ? new Date(p.fecha_ingreso + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                </div>

                <Link href={`/protagonistas/${p.id}`} style={{ color: '#2085EE', display: 'flex', alignItems: 'center' }}>
                  <MdChevronRight size={20} />
                </Link>
              </div>
            )
          })}

          <div style={{ padding: '14px 20px', background: '#f0f3ff', fontSize: 12.5, color: '#414753', borderTop: '1px solid rgba(192,198,213,0.2)' }}>
            {protagonistas.length} protagonista(s)
          </div>
        </div>
      )}
    </div>
  )
}
