'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { T } from '@/lib/tokens'

const MESES_SCOUT = [
  { m: 4, l: 'Abr' }, { m: 5, l: 'May' }, { m: 6, l: 'Jun' },
  { m: 7, l: 'Jul' }, { m: 8, l: 'Ago' }, { m: 9, l: 'Sep' },
  { m: 10, l: 'Oct' }, { m: 11, l: 'Nov' },
]

export function PeriodSelector({ mesActivo, anio }: { mesActivo: number; anio: number }) {
  const router = useRouter()

  function select(mes: number) {
    const params = new URLSearchParams()
    params.set('mes', String(mes))
    params.set('anio', String(anio))
    router.push(`/pagos?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.outline }}>
        Período
      </span>
      <div style={{ background: T.surfaceLowest, borderRadius: T.r.pill, padding: 4, display: 'inline-flex', gap: 2 }}>
        {MESES_SCOUT.map(({ m, l }) => {
          const active = m === mesActivo
          return (
            <button
              key={m}
              onClick={() => select(m)}
              style={{
                padding: '6px 14px', borderRadius: T.r.pill, border: 'none',
                background: active ? T.primary : 'transparent',
                color: active ? '#fff' : T.onSurfaceVariant,
                fontFamily: T.body, fontSize: 12.5, fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
              }}
            >
              {l}
            </button>
          )
        })}
      </div>
      <span style={{ fontFamily: T.mono, fontSize: 12, color: T.outline }}>
        {MESES_SCOUT.find(x => x.m === mesActivo)?.l} {anio}
      </span>
    </div>
  )
}
