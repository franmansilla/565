import type { Metadata } from 'next'
import Link from 'next/link'
import { GiFleurDeLys } from 'react-icons/gi'

export const metadata: Metadata = {
  title: 'Niño Jesús de Praga — Grupo Scout 565',
  description: 'Formamos ciudadanos comprometidos a través de la aventura, el servicio y el contacto con la naturaleza desde hace más de 50 años.',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { l: 'Inicio', href: '/' },
    { l: 'Ramas', href: '/#ramas' },
    { l: 'Actividades', href: '/#actividades' },
    { l: 'Historia', href: '/#historia' },
    { l: 'Bitácora', href: '/blog' },
    { l: 'Contacto', href: '/#contacto' },
  ]

  return (
    <div className="min-h-full flex flex-col" style={{ background: '#fff', color: '#1E293B' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'linear-gradient(135deg, #2085EE, #1468c9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 6px 16px rgba(32,133,238,0.3)',
            }}>
              <GiFleurDeLys size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 15, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.02em' }}>
                Niño Jesús de Praga
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                Grupo Scout 565 · Desde 1971
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {navLinks.map((item) => (
              <Link key={item.l} href={item.href} style={{
                fontSize: 13.5, fontWeight: 500, color: '#475569', textDecoration: 'none',
                cursor: 'pointer',
              }}>{item.l}</Link>
            ))}
            <Link href="/#contacto" style={{
              background: '#2085EE', color: '#fff',
              padding: '12px 20px', borderRadius: 12,
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: 14, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', boxShadow: '0 6px 18px rgba(32,133,238,0.3)',
              textDecoration: 'none',
            }}>
              Inscribirse →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', color: '#fff', padding: '72px 56px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: 48, marginBottom: 48 }}>
            {/* Brand col */}
            <div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'linear-gradient(135deg, #2085EE, #1468c9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                  <GiFleurDeLys size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>Niño Jesús de Praga</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Grupo Scout 565</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
                Educar para la vida a través de la formación de carácter, salud, destrezas manuales y servicio al prójimo.
              </p>
            </div>
            {/* Nav col */}
            <div>
              <h5 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Navegación</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Inicio', 'Ramas', 'Actividades', 'Historia', 'Bitácora'].map((l) => (
                  <li key={l}><a href="/" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</a></li>
                ))}
              </ul>
            </div>
            {/* Access col */}
            <div>
              <h5 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Acceso</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Inscribirse', '/#contacto'], ['Área Educadores', '/admin'], ['Blog', '/blog']].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</Link></li>
                ))}
              </ul>
            </div>
            {/* Location col */}
            <div>
              <h5 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Ubicación</h5>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
                Parroquia Niño Jesús de Praga<br />
                Av. Colón 3421<br />
                Córdoba (5003), Argentina
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>
                Reuniones: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Sábados 14:30–17:30</strong>
              </p>
            </div>
          </div>
          <div style={{
            paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              © 2026 Grupo Scout 565 Niño Jesús de Praga. Todos los derechos reservados.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)', display: 'inline-block' }} />
              Inscripciones 2026 abiertas — cierran el 08/10
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
