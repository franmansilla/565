import Link from 'next/link'
import { getUsuariosApp } from '@/lib/data'
import { deleteEducador } from '@/lib/actions'
import { DeleteButton } from '@/components/DeleteButton'

const ROL_LABEL: Record<string, string> = {
  admin: 'Administrador',
  educador: 'Educador',
  readonly: 'Solo lectura',
}

const ROL_CHIP: Record<string, { bg: string; fg: string }> = {
  admin:    { bg: '#f4d4d4', fg: '#7a1f24' },
  educador: { bg: '#dbeafe', fg: '#004787' },
  readonly: { bg: '#f0f3ff', fg: '#717784' },
}

export default async function EducadoresPage() {
  const usuarios = await getUsuariosApp()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 4px' }}>Equipo</p>
          <h1 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#111c2d', letterSpacing: '-0.02em', margin: 0 }}>
            Educadores
          </h1>
        </div>
        <Link href="/educadores/nuevo" style={{
          background: 'linear-gradient(135deg, #2085EE 0%, #1468c9 100%)',
          color: '#fff', padding: '11px 20px', borderRadius: 12,
          fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(32,133,238,0.22)', textDecoration: 'none',
        }}>
          + Sumar educador
        </Link>
      </div>

      {/* Stats band */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[
          { l: 'Total educadores', v: String(usuarios.length) },
          { l: 'Administradores', v: String(usuarios.filter(u => u.rol === 'admin').length) },
          { l: 'Activos', v: String(usuarios.filter(u => u.activo).length) },
        ].map(k => (
          <div key={k.l}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 6px' }}>{k.l}</p>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 36, fontWeight: 800, color: '#111c2d', letterSpacing: '-0.025em', lineHeight: 1 }}>{k.v}</div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#717784', margin: '0 0 12px' }}>No hay educadores registrados</p>
          <Link href="/educadores/nuevo" style={{ color: '#2085EE', fontWeight: 700, textDecoration: 'none' }}>Agregar el primero →</Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1fr 100px', padding: '14px 20px', gap: 16, background: '#f0f3ff' }}>
            {['Educador', 'Función / Rama', 'Rol', 'Estado', 'Últ. actividad', ''].map(h => (
              <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784' }}>{h}</div>
            ))}
          </div>

          {usuarios.map((u, i) => {
            const deleteWithId = deleteEducador.bind(null, u.id)
            const rolChip = ROL_CHIP[u.rol] ?? { bg: '#f0f3ff', fg: '#717784' }
            const initials = u.nombre.split(' ').map((w: string) => w[0]).slice(0, 2).join('')
            return (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1fr 100px',
                padding: '16px 20px', gap: 16, alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : '#f9f9ff',
                borderTop: '1px solid rgba(192,198,213,0.18)',
              }}>
                {/* Name + initials */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 999, flexShrink: 0, background: '#dbeafe', color: '#004787', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111c2d', fontSize: 14 }}>{u.nombre}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10.5, color: '#717784', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      EDU-{u.id.slice(0, 6).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Rama */}
                <div style={{ fontSize: 13, color: '#414753' }}>{u.rama || '—'}</div>

                {/* Rol */}
                <div>
                  <span style={{ display: 'inline-block', background: rolChip.bg, color: rolChip.fg, padding: '3px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {ROL_LABEL[u.rol] ?? u.rol}
                  </span>
                </div>

                {/* Activo */}
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: u.activo ? '#0f7a3d' : '#717784', fontSize: 13, fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: u.activo ? '#0f7a3d' : '#717784', boxShadow: u.activo ? '0 0 0 3px #c8ecd4' : 'none' }} />
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Placeholder últ. actividad */}
                <div style={{ fontSize: 12.5, color: '#717784' }}>—</div>

                <DeleteButton
                  action={deleteWithId}
                  label="Eliminar"
                  confirmMessage={`¿Eliminar a ${u.nombre}? Esta acción también revocará su acceso al sistema.`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
