import { GiFleurDeLys } from 'react-icons/gi'
import { signIn } from './actions'

const T = {
  primary: '#2085EE',
  primaryContainer: '#1468c9',
  primaryFixed: '#dbeafe',
  primaryFixedDim: '#bfdbfe',
  surfaceLow: '#f0f3ff',
  surfaceLowest: '#ffffff',
  onSurface: '#111c2d',
  onSurfaceVariant: '#414753',
  outline: '#717784',
  outlineVariant: '#c0c6d5',
  secondary: '#ED1C1C',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1.05fr',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    }}>

      {/* ── Left: editorial brand panel ── */}
      <div style={{
        background: `linear-gradient(160deg, ${T.primary} 0%, ${T.primaryContainer} 60%, #003063 100%)`,
        padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 20%, #fff 0 2px, transparent 2px) 0 0/32px 32px,
            radial-gradient(circle at 60% 60%, #fff 0 1px, transparent 1px) 0 0/24px 24px`,
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GiFleurDeLys size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Niño Jesús de Praga
            </div>
            <div style={{ fontSize: 11, color: T.primaryFixedDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 2 }}>
              Grupo Scout 565 · Gestión
            </div>
          </div>
        </div>

        {/* Quote */}
        <div style={{ position: 'relative', maxWidth: 440 }}>
          <div style={{ fontSize: 56, color: T.primaryFixedDim, opacity: 0.6, lineHeight: 0.8, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
          <div style={{
            fontFamily: 'var(--font-manrope), Manrope, sans-serif',
            fontSize: 38, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: 16,
          }}>
            Dejá el mundo<br />
            <span style={{ fontStyle: 'italic', color: T.primaryFixedDim }}>un poco mejor</span><br />
            de como lo encontraste.
          </div>
          <div style={{ fontSize: 13, color: T.primaryFixedDim, marginTop: 20, letterSpacing: '0.04em' }}>
            — Baden-Powell, último mensaje
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, position: 'relative' }}>
          {[
            { v: '54', l: 'Años de grupo' },
            { v: '142', l: 'Protagonistas' },
            { v: '28', l: 'Educadores' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.v}
              </div>
              <div style={{ fontSize: 11, color: T.primaryFixedDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 6 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div style={{
        padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: T.surfaceLowest, position: 'relative', overflowY: 'auto',
      }}>
<div style={{ maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: T.primary, marginBottom: 10,
          }}>
            Gestión del grupo
          </div>

          <h1 style={{
            fontFamily: 'var(--font-manrope), Manrope, sans-serif',
            fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em',
            margin: '0 0 8px', color: T.onSurface, lineHeight: 1.05,
          }}>
            Bienvenido de vuelta.
          </h1>
          <p style={{ fontSize: 14.5, color: T.onSurfaceVariant, margin: '0 0 36px', lineHeight: 1.5 }}>
            Iniciá sesión con tus credenciales de educador para acceder al sistema.
          </p>

          {error && (
            <div style={{
              marginBottom: 20, padding: '12px 16px',
              background: T.errorContainer, borderRadius: 10,
              fontSize: 13.5, color: T.error, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form action={signIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email field */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline, marginBottom: 8 }}>
                Correo institucional
              </div>
              <div style={{
                background: T.surfaceLow, borderRadius: 12,
                padding: '2px 4px 2px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.outline} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="educador@scouts565.org"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    padding: '14px 8px', fontSize: 14.5, color: T.onSurface,
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
                  Contraseña
                </div>
                <a href="#" style={{ fontSize: 12, color: T.primary, fontWeight: 600, textDecoration: 'none' }}>
                  ¿La olvidaste?
                </a>
              </div>
              <div style={{
                background: T.surfaceLow, borderRadius: 12,
                padding: '2px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.outline} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    padding: '14px 8px', fontSize: 14.5, color: T.onSurface, letterSpacing: '0.1em',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                  }}
                />
              </div>
            </div>

            {/* Remember me (decorative — no JS needed) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, background: T.primary, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, color: T.onSurfaceVariant }}>
                Mantener sesión iniciada en este equipo
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                marginTop: 14, padding: '16px 22px',
                background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
                color: '#fff', border: 'none', borderRadius: 12,
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(32,133,238,0.22)',
              }}
            >
              Ingresar al grupo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          {/* Privacy notice */}
          <div style={{
            marginTop: 40, padding: '18px 20px', background: T.surfaceLow, borderRadius: 12,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={T.primary} style={{ marginTop: 1, flexShrink: 0 }}>
              <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
            </svg>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: T.onSurface }}>
                Protección de datos de menores (Ley 26.061)
              </div>
              <div style={{ fontSize: 11.5, color: T.onSurfaceVariant, marginTop: 2, lineHeight: 1.4 }}>
                El acceso está auditado y las fichas de protagonistas se almacenan con cifrado en tránsito y en reposo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
