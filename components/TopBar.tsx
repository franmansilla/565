'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MdSearch, MdChevronRight, MdLogout } from 'react-icons/md'
import { T, BRANCH_KEY } from '@/lib/tokens'
import { signOut } from '@/app/(admin)/login/actions'
import { quickSearchProtagonistas } from '@/lib/actions'

// ─── Breadcrumb derivation ────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  admin:               'Dashboard',
  protagonistas:       'Protagonistas',
  campamentos:         'Campamentos',
  pagos:               'Pagos',
  educadores:          'Educadores',
  configuracion:       'Configuración',
  blog:                'Blog / Contacto',
  'grupos-familiares': 'Grupos Familiares',
  nuevo:               'Nuevo',
  editar:              'Editar',
  'paso-de-rama':      'Paso de Rama',
  comprobante:         'Comprobante',
}

const PARENT_SINGULAR: Record<string, string> = {
  Protagonistas: 'Ficha',
  Campamentos:   'Detalle',
  Pagos:         'Pago',
  Educadores:    'Educador',
}

function deriveBreadcrumbs(pathname: string): string[] {
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean)
  const crumbs: string[] = []
  for (const seg of segments) {
    const isId = /^[0-9a-f-]{8,}$/i.test(seg) || /^\d+$/.test(seg)
    if (isId) {
      const parent = crumbs[crumbs.length - 1]
      crumbs.push(PARENT_SINGULAR[parent] ?? 'Detalle')
    } else {
      const label = ROUTE_LABELS[seg]
      if (label) crumbs.push(label)
    }
  }
  return crumbs.length ? crumbs : ['Dashboard']
}

// ─── Branch dot colors ────────────────────────────────────────────────────────

function branchDot(rama: string) {
  const key = BRANCH_KEY[rama]
  const c = key ? T[key] : T.caminantes
  return c.track
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchResult = {
  id: string
  nombre: string
  apellido: string
  dni: string | null
  rama: string
  activo: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TopBar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const crumbs = deriveBreadcrumbs(pathname)
  const pageTitle = crumbs[crumbs.length - 1]

  const initials = userEmail
    ? userEmail.split('@')[0].split(/[._\-]/).map(p => p[0]?.toUpperCase()).slice(0, 2).join('')
    : 'U'

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    setLoading(true)
    setOpen(true)
    try {
      const res = await quickSearchProtagonistas(q)
      setResults(res as SearchResult[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); setOpen(false); return }
    debounceRef.current = setTimeout(() => doSearch(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
        && inputRef.current && !inputRef.current.closest('form')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on route change
  useEffect(() => { setOpen(false); setQuery('') }, [pathname])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/protagonistas?search=${encodeURIComponent(query.trim())}`)
  }

  function handleSelect(id: string) {
    setOpen(false)
    setQuery('')
    router.push(`/protagonistas/${id}`)
  }

  return (
    <header style={{
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      background: 'rgba(249,249,255,0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 20,
      borderBottom: `1px solid ${T.surfaceHigh}`,
    }}>

      {/* Left — breadcrumbs + page title */}
      <div style={{ minWidth: 0 }}>
        {crumbs.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            {crumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  fontFamily: T.body, fontSize: 12,
                  fontWeight: i === crumbs.length - 1 ? 600 : 400,
                  color: i === crumbs.length - 1 ? T.onSurface : T.outline,
                  whiteSpace: 'nowrap',
                }}>
                  {crumb}
                </span>
                {i < crumbs.length - 1 && (
                  <MdChevronRight size={14} style={{ color: T.outlineVariant, flexShrink: 0 }} />
                )}
              </span>
            ))}
          </div>
        )}
        <div style={{
          fontFamily: T.headline, fontSize: 15, fontWeight: 700,
          color: T.primary, letterSpacing: '-0.01em', lineHeight: 1.2,
        }}>
          {pageTitle}
        </div>
      </div>

      {/* Right — search + notifications + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

        {/* Search + dropdown */}
        <div style={{ position: 'relative' }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: T.surfaceLowest,
            border: `1px solid ${open ? T.primaryFixedDim : T.surfaceHigh}`,
            padding: '7px 12px', borderRadius: T.r.pill,
            minWidth: 260,
            transition: 'border-color 0.15s',
          }}>
            <MdSearch size={16} style={{ color: loading ? T.primary : T.outline, flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => { if (results.length) setOpen(true) }}
              placeholder="Buscar protagonista, DNI…"
              style={{
                background: 'none', border: 'none', outline: 'none', flex: 1,
                fontFamily: T.body, fontSize: 13, color: T.onSurface,
                minWidth: 0,
              }}
            />
          </form>

          {/* Results dropdown */}
          {open && (
            <div ref={dropdownRef} style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: T.surfaceLowest,
              borderRadius: T.r.lg,
              boxShadow: T.shadowLift,
              border: `1px solid ${T.surfaceHigh}`,
              overflow: 'hidden',
              zIndex: 40,
              minWidth: 300,
            }}>
              {loading ? (
                <div style={{ padding: '8px 12px 10px' }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 999, background: T.surfaceContainer, flexShrink: 0, animation: 'pulse 1.4s ease-in-out infinite' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ height: 11, borderRadius: 6, background: T.surfaceContainer, width: '65%', animation: 'pulse 1.4s ease-in-out infinite' }} />
                        <div style={{ height: 9, borderRadius: 6, background: T.surfaceContainer, width: '40%', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '0.1s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div style={{ padding: '14px 16px', fontFamily: T.body, fontSize: 13, color: T.outline, textAlign: 'center' }}>
                  Sin resultados
                </div>
              ) : (
                <>
                  <div style={{ padding: '8px 12px 4px', fontFamily: T.body, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: T.outline }}>
                    Protagonistas
                  </div>
                  {results.map(r => (
                    <button
                      key={r.id}
                      onMouseDown={() => handleSelect(r.id)}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        padding: '9px 12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10,
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.surfaceLow)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                        background: T.surfaceContainer,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: T.headline, fontWeight: 700, fontSize: 11,
                        color: T.onSurfaceVariant,
                      }}>
                        {r.nombre[0]}{r.apellido[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.onSurface, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.apellido}, {r.nombre}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                          {r.dni && <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.outline }}>{r.dni}</span>}
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.outline }}>
                            <span style={{ width: 5, height: 5, borderRadius: 999, background: branchDot(r.rama), flexShrink: 0 }} />
                            {r.rama.split(' ')[0]}
                          </span>
                          {!r.activo && (
                            <span style={{ fontSize: 10, color: T.outline, background: T.surfaceContainer, padding: '1px 6px', borderRadius: 999 }}>Inactivo</span>
                          )}
                        </div>
                      </div>
                      <MdChevronRight size={14} style={{ color: T.outlineVariant, flexShrink: 0 }} />
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${T.surfaceHigh}`, padding: '8px 12px' }}>
                    <button
                      onMouseDown={handleSubmit as never}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: T.body, fontSize: 12, fontWeight: 600,
                        color: T.primary, padding: 0,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <MdSearch size={14} />
                      Ver todos los resultados de &ldquo;{query}&rdquo;
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* User avatar + menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            title={userEmail}
            style={{
              width: 36, height: 36, borderRadius: 999, border: 'none',
              background: `linear-gradient(135deg, ${T.caminantes.bg}, ${T.primaryFixed})`,
              color: T.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.headline, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {initials}
          </button>

          {showUserMenu && (
            <>
              <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 29 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: T.surfaceLowest,
                borderRadius: T.r.lg,
                boxShadow: T.shadowLift,
                minWidth: 200, zIndex: 30, overflow: 'hidden',
                border: `1px solid ${T.surfaceHigh}`,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.surfaceHigh}` }}>
                  <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.onSurface, marginBottom: 2 }}>
                    {initials}
                  </div>
                  <div style={{ fontFamily: T.body, fontSize: 11, color: T.outline, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userEmail}
                  </div>
                </div>
                <form action={signOut}>
                  <button type="submit" style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '11px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: T.body, fontSize: 13, fontWeight: 600,
                    color: T.error, textAlign: 'left',
                  }}>
                    <MdLogout size={16} />
                    Cerrar sesión
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
