'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { T } from '@/lib/tokens'

const FILTROS = [
  { key: '',                    label: 'Todas' },
  { key: 'activo',              label: 'Del ciclo' },
  { key: 'Lobatos y Lobeznas',  label: 'Manada' },
  { key: 'Scouts',              label: 'Unidad' },
  { key: 'Caminantes',          label: 'Caminantes' },
  { key: 'Rovers',              label: 'Rovers' },
  { key: 'archivado',           label: 'Archivadas' },
]

export default function CampamentosFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get('rama') ?? ''

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {FILTROS.map(f => {
        const active = f.key === current
        return (
          <button
            key={f.key}
            onClick={() => {
              const url = f.key ? `/campamentos?rama=${encodeURIComponent(f.key)}` : '/campamentos'
              router.push(url)
            }}
            style={{
              padding: '7px 16px', borderRadius: T.r.pill,
              border: active ? 'none' : `1.5px solid ${T.outlineVariant}`,
              background: active ? T.primary : T.surfaceLowest,
              color: active ? T.onPrimary : T.onSurfaceVariant,
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: 'pointer', fontFamily: T.body,
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
