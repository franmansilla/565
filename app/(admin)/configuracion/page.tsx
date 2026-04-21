import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCuotaActual, getHistorialCuota, getCurrentUserRole } from '@/lib/data'
import { updateCuota } from '@/lib/actions'

export const dynamic = 'force-dynamic'

const SECCIONES = [
  { i: '🏛️', l: 'Identidad del grupo', active: false },
  { i: '📅', l: 'Ciclo lectivo', active: false },
  { i: '💰', l: 'Cobros y cuotas', active: true },
  { i: '✉️', l: 'Comunicaciones', active: false },
  { i: '🔐', l: 'Permisos y roles', active: false },
]

const inp: React.CSSProperties = {
  background: '#f0f3ff', border: 'none', outline: 'none',
  padding: '10px 14px', borderRadius: 10, width: '100%',
  fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 14, color: '#111c2d',
  boxSizing: 'border-box',
}

export default async function ConfiguracionPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rol = await getCurrentUserRole(user.id)
  if (rol !== 'admin') redirect('/admin')

  const [cuotaActual, historial] = await Promise.all([getCuotaActual(), getHistorialCuota()])
  const c = cuotaActual as Record<string, unknown> | null
  const fmt = (v: unknown) => v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—'

  const cuotaFields = [
    { name: 'monto',                   label: 'Mensual – Titular',        val: c?.monto },
    { name: 'monto_hermano1',          label: 'Mensual – Hermano 1',      val: c?.monto_hermano1 },
    { name: 'monto_hermano2',          label: 'Mensual – Hermano 2+',     val: c?.monto_hermano2 },
    { name: 'monto_semestral1',        label: 'Sem. 1 – Titular',         val: c?.monto_semestral1 },
    { name: 'monto_semestral1_hermano1', label: 'Sem. 1 – Hermano 1',    val: c?.monto_semestral1_hermano1 },
    { name: 'monto_semestral1_hermano2', label: 'Sem. 1 – Hermano 2+',   val: c?.monto_semestral1_hermano2 },
    { name: 'monto_semestral2',        label: 'Sem. 2 – Titular',         val: c?.monto_semestral2 },
    { name: 'monto_semestral2_hermano1', label: 'Sem. 2 – Hermano 1',    val: c?.monto_semestral2_hermano1 },
    { name: 'monto_semestral2_hermano2', label: 'Sem. 2 – Hermano 2+',   val: c?.monto_semestral2_hermano2 },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>

      {/* Side nav */}
      <aside style={{ position: 'sticky', top: 8 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', padding: '0 12px', margin: '0 0 10px' }}>Secciones</p>
        {SECCIONES.map(s => (
          <div key={s.l} style={{
            padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2,
            background: s.active ? '#dbeafe' : 'transparent',
            color: s.active ? '#004787' : '#414753',
            fontSize: 13.5, fontWeight: s.active ? 700 : 500,
          }}>
            <span>{s.i}</span>
            {s.l}
          </div>
        ))}

        <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 14 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 6px' }}>¿Necesitás ayuda?</p>
          <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#111c2d', letterSpacing: '-0.01em' }}>
            Manual del dirigente 2026
          </div>
          <div style={{ fontSize: 12, color: '#717784', marginTop: 4 }}>Guía para gestión administrativa del grupo.</div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Cuota vigente */}
        {c && (
          <section style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 4px' }}>Aporte económico</p>
                <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 24, fontWeight: 800, color: '#111c2d', letterSpacing: '-0.02em', margin: 0 }}>
                  Cuotas vigentes
                </h2>
              </div>
              <span style={{ display: 'inline-block', background: '#dbeafe', color: '#004787', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                Ciclo {new Date().getFullYear()}
              </span>
            </div>

            {/* Valor principal */}
            <div style={{ padding: 20, background: '#dbeafe', borderRadius: 14, display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#004787', margin: '0 0 4px' }}>Mensual titular</p>
                <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 42, fontWeight: 800, color: '#001c3b', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {fmt(c.monto)}
                </div>
              </div>
            </div>

            {/* Grid de valores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {cuotaFields.slice(1).map(({ label, val }) => (
                <div key={label} style={{ background: '#f9f9ff', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10.5, color: '#717784', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: val != null ? '#111c2d' : '#c0c6d5', margin: 0 }}>
                    {fmt(val)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulario */}
        <section style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: '#111c2d', margin: '0 0 6px', letterSpacing: '-0.015em' }}>
              Actualizar cuotas
            </h3>
            <p style={{ fontSize: 13, color: '#717784', margin: 0 }}>
              Sem. 1 cubre <strong style={{ color: '#414753' }}>Abr–Jul</strong> (vence 10 May) · Sem. 2 cubre <strong style={{ color: '#414753' }}>Ago–Nov</strong> (vence 10 Sep)
            </p>
          </div>

          <form action={updateCuota} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {c && <input type="hidden" name="id" value={c.id as string} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {cuotaFields.map(({ name, label, val }) => (
                <div key={name}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#414753', marginBottom: 6 }}>{label}</label>
                  <input name={name} type="number" step="0.01" defaultValue={val != null ? String(val) : ''} placeholder="0.00" style={inp} />
                </div>
              ))}
            </div>
            <div>
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #2085EE 0%, #1468c9 100%)',
                color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 12,
                fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(32,133,238,0.22)',
              }}>
                Guardar cambios
              </button>
            </div>
          </form>
        </section>

        {/* Historial */}
        {historial.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: '#111c2d', margin: '0 0 20px', letterSpacing: '-0.015em' }}>
              Historial de cuotas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {historial.slice(0, 6).map((h: Record<string, unknown>, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: idx % 2 === 0 ? '#f9f9ff' : 'transparent', borderRadius: 10, fontSize: 13, color: '#414753' }}>
                  <span>{String(h.vigente_desde ?? '—')}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111c2d' }}>{fmt(h.monto)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section style={{ background: '#ffdad6', borderRadius: 20, padding: 28, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#ffdad5', color: '#930006', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            ⚠️
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#930006', margin: '0 0 2px' }}>Zona sensible</p>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#410001', letterSpacing: '-0.01em' }}>
              Cerrar ciclo lectivo {new Date().getFullYear()}
            </div>
            <div style={{ fontSize: 13, color: '#930006', marginTop: 2 }}>
              Archiva protagonistas, cierra cuotas y habilita la migración al ciclo siguiente.
            </div>
          </div>
          <button disabled style={{ background: '#fff', color: '#930006', border: 'none', padding: '11px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'not-allowed', opacity: 0.7 }}>
            Cerrar ciclo
          </button>
        </section>
      </div>
    </div>
  )
}
