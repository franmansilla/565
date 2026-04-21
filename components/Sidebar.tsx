'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdDashboard, MdPeople, MdPersonAdd, MdPayment, MdSchool, MdSettings, MdArticle, MdFamilyRestroom } from 'react-icons/md'
import { GiFleurDeLys, GiCampingTent } from 'react-icons/gi'
import { T } from '@/lib/tokens'

const QUICK_ACTIONS = [
  { href: '/protagonistas/nuevo', label: 'Nuevo Protagonista', icon: MdPersonAdd },
  { href: '/pagos/nuevo',         label: 'Registrar Pago',     icon: MdPayment },
  { href: '/campamentos/nuevo',   label: 'Nuevo Campamento',   icon: GiCampingTent },
]

const NAV_ITEMS = [
  { href: '/admin',         label: 'Dashboard',       icon: MdDashboard,      exact: true },
  { href: '/protagonistas', label: 'Protagonistas',   icon: MdPeople },
  { href: '/campamentos',   label: 'Campamentos',     icon: GiCampingTent },
  { href: '/pagos',         label: 'Pagos',           icon: MdPayment },
  { href: '/educadores',    label: 'Educadores',      icon: MdSchool },
  { href: '/admin/blog',              label: 'Blog / Contacto',  icon: MdArticle },
  { href: '/admin/grupos-familiares', label: 'Grupos Familiares', icon: MdFamilyRestroom },
]

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside style={{
      width: 256, background: T.surfaceLow, padding: '24px 14px',
      display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
      height: '100%', overflow: 'auto',
    }} className="hidden lg:flex flex-col">
      {/* Brand */}
      <div style={{ padding: '0 10px 28px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: T.r.md,
          background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.onPrimary, boxShadow: '0 4px 14px rgba(0,92,173,0.3)', flexShrink: 0,
        }}>
          <GiFleurDeLys size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.headline, fontWeight: 800, fontSize: 14, color: T.primary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Grupo Scout 565
          </div>
          <div style={{ fontFamily: T.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
            Niño Jesús de Praga
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href} style={{
              position: 'relative',
              background: active ? T.primaryFixed : 'transparent',
              borderRadius: T.r.md,
              padding: '11px 14px 11px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              textDecoration: 'none',
              color: active ? T.onPrimaryFixedVariant : T.onSurfaceVariant,
              fontFamily: T.body,
              fontWeight: active ? 700 : 500,
              fontSize: 13.5,
            }}>
              {active && (
                <span style={{
                  position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
                  width: 4, height: 20, borderRadius: 999, background: T.primary,
                }} />
              )}
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
        {isAdmin && (
          <Link href="/configuracion" style={{
            position: 'relative',
            background: isActive('/configuracion') ? T.primaryFixed : 'transparent',
            borderRadius: T.r.md,
            padding: '11px 14px 11px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none',
            color: isActive('/configuracion') ? T.onPrimaryFixedVariant : T.onSurfaceVariant,
            fontFamily: T.body,
            fontWeight: isActive('/configuracion') ? 700 : 500,
            fontSize: 13.5,
          }}>
            {isActive('/configuracion') && (
              <span style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 4, height: 20, borderRadius: 999, background: T.primary }} />
            )}
            <MdSettings size={20} />
            Configuración
          </Link>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: T.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline, padding: '0 12px', marginBottom: 4 }}>
          Acciones rápidas
        </div>
        {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
            borderRadius: T.r.md, textDecoration: 'none',
            color: T.onSurfaceVariant, fontFamily: T.body, fontSize: 13, fontWeight: 500,
          }}>
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
