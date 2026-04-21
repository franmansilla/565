// Shared UI atoms — translated from shared.jsx design file
// "Modern Navigator" design system for Grupo Scout 565

import React from 'react'
import { T, BRANCH_KEY } from '@/lib/tokens'

// ─── Overline ─────────────────────────────────────────────────────────────────

type OverlineTone = 'primary' | 'muted' | 'variant'

export function Overline({
  children,
  tone = 'muted',
  style,
}: {
  children: React.ReactNode
  tone?: OverlineTone
  style?: React.CSSProperties
}) {
  const color =
    tone === 'primary' ? T.primary :
    tone === 'muted'   ? T.outline :
    T.onSurfaceVariant
  return (
    <span style={{
      fontFamily: T.body, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color, display: 'inline-block', ...style,
    }}>
      {children}
    </span>
  )
}

// ─── BranchChip ───────────────────────────────────────────────────────────────

type BranchKey = 'lobatos' | 'unidad' | 'caminantes' | 'rovers'
const BRANCH_LABELS: Record<BranchKey, string> = {
  lobatos:    'Manada',
  unidad:     'Unidad',
  caminantes: 'Caminantes',
  rovers:     'Rovers',
}

export function BranchChip({
  branch,
  size = 'sm',
}: {
  branch: BranchKey | string
  size?: 'sm' | 'md'
}) {
  const key = (BRANCH_KEY[branch] ?? branch) as BranchKey
  const c = T[key] ?? T.caminantes
  const label = BRANCH_LABELS[key] ?? branch
  const pad = size === 'sm' ? '3px 10px' : '5px 12px'
  const fs = size === 'sm' ? 10 : 11
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.fg, padding: pad, borderRadius: T.r.pill,
      fontSize: fs, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      fontFamily: T.body,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c.track, flexShrink: 0 }} />
      {label}
    </span>
  )
}

// ─── StatusDot ────────────────────────────────────────────────────────────────

type StatusTone = 'ok' | 'warn' | 'err' | 'off' | 'info'
const STATUS_PALETTE: Record<StatusTone, { c: string; bg: string }> = {
  ok:   { c: T.success, bg: T.successFixed },
  warn: { c: T.warn,    bg: T.warnFixed },
  err:  { c: T.error,   bg: T.errorContainer },
  off:  { c: T.outline, bg: T.surfaceContainer },
  info: { c: T.primary, bg: T.primaryFixed },
}

export function StatusDot({
  tone = 'ok',
  label,
}: {
  tone?: StatusTone
  label?: string
}) {
  const p = STATUS_PALETTE[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      color: p.c, fontSize: 13, fontWeight: 600,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: p.c, boxShadow: `0 0 0 3px ${p.bg}`, flexShrink: 0 }} />
      {label}
    </span>
  )
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

type PillTone = 'ok' | 'warn' | 'err' | 'info' | 'neutral'
const PILL_PALETTE: Record<PillTone, { bg: string; fg: string }> = {
  ok:      { bg: T.successFixed,          fg: T.success },
  warn:    { bg: T.warnFixed,             fg: T.warn },
  err:     { bg: T.errorContainer,        fg: T.onSecondaryFixedVariant },
  info:    { bg: T.primaryFixed,          fg: T.onPrimaryFixedVariant },
  neutral: { bg: T.surfaceContainer,      fg: T.onSurfaceVariant },
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: PillTone
}) {
  const p = PILL_PALETTE[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: p.bg, color: p.fg,
      padding: '3px 10px', borderRadius: T.r.pill,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      fontFamily: T.body,
    }}>
      {children}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({
  initials,
  branch = 'caminantes',
  size = 40,
}: {
  initials: string
  branch?: BranchKey | string
  size?: number
}) {
  const key = (BRANCH_KEY[branch] ?? branch) as BranchKey
  const c = T[key] ?? T.caminantes
  return (
    <div style={{
      width: size, height: size, borderRadius: T.r.pill,
      background: c.bg, color: c.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.headline, fontWeight: 700, fontSize: Math.round(size * 0.38),
      flexShrink: 0, letterSpacing: '-0.01em',
    }}>
      {initials}
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

type BtnProps = {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function BtnPrimary({ children, style, onClick, type = 'button', disabled }: BtnProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryContainer} 100%)`,
      color: T.onPrimary, border: 'none',
      padding: '11px 20px', borderRadius: T.r.md,
      fontFamily: T.body, fontSize: 14, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 14px rgba(0,92,173,0.22)',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}>
      {children}
    </button>
  )
}

export function BtnSecondary({ children, style, onClick, type = 'button', disabled }: BtnProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: T.primaryFixed, color: T.onPrimaryFixedVariant, border: 'none',
      padding: '11px 18px', borderRadius: T.r.md,
      fontFamily: T.body, fontSize: 14, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}>
      {children}
    </button>
  )
}

export function BtnGhost({ children, style, onClick, type = 'button', disabled }: BtnProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: 'transparent', color: T.primary, border: 'none',
      padding: '9px 14px', borderRadius: T.r.md,
      fontFamily: T.body, fontSize: 14, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}>
      {children}
    </button>
  )
}

// ─── ProgressRing ─────────────────────────────────────────────────────────────

export function ProgressRing({
  value = 70,
  size = 80,
  stroke = 8,
  label,
}: {
  value?: number
  size?: number
  stroke?: number
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(100, Math.max(0, value)) / 100)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.primaryFixed} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={T.primary} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: T.primary,
      }}>
        {label !== undefined ? (
          <span style={{ fontFamily: T.headline, fontWeight: 700, fontSize: size * 0.22, lineHeight: 1 }}>{label}</span>
        ) : (
          <span style={{ fontFamily: T.headline, fontWeight: 700, fontSize: size * 0.22, lineHeight: 1 }}>{value}%</span>
        )}
      </div>
    </div>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

export function Sparkline({
  data = [4, 7, 5, 9, 6, 11, 14, 12, 16, 18],
  width = 100,
  height = 32,
  color,
}: {
  data?: number[]
  width?: number
  height?: number
  color?: string
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  const strokeColor = color ?? T.primary
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={strokeColor} opacity={0.08} />
    </svg>
  )
}
