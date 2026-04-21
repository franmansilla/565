// Design tokens — "Modern Navigator" for Grupo Scout 565
// Source: shared.jsx design file

export const T = {
  // Surfaces (tonal ladder)
  surface:           '#f9f9ff',
  surfaceLow:        '#f0f3ff',
  surfaceContainer:  '#e7eeff',
  surfaceHigh:       '#dee8ff',
  surfaceHighest:    '#d8e3fb',
  surfaceLowest:     '#ffffff',
  surfaceDim:        '#cfdaf2',
  inverseSurface:    '#263143',

  // Ink
  onSurface:         '#111c2d',
  onSurfaceVariant:  '#414753',
  outline:           '#717784',
  outlineVariant:    '#c0c6d5',

  // Brand blue
  primary:                  '#005cad',
  primaryContainer:         '#0075d8',
  primaryFixed:             '#d5e3ff',
  primaryFixedDim:          '#a6c8ff',
  onPrimary:                '#ffffff',
  onPrimaryFixed:           '#001c3b',
  onPrimaryFixedVariant:    '#004787',

  // Red (identity — sparingly)
  secondary:               '#bc000b',
  secondaryFixed:          '#ffdad5',
  onSecondaryFixed:        '#410001',
  onSecondaryFixedVariant: '#930006',
  error:                   '#ba1a1a',
  errorContainer:          '#ffdad6',

  // Functional
  success:      '#0f7a3d',
  successFixed: '#c8ecd4',
  warn:         '#a86400',
  warnFixed:    '#ffe3b0',

  // Branch accents
  lobatos:    { bg: '#fff1c9', fg: '#6b4e00', track: '#ebc04a' },
  unidad:     { bg: '#d6ecd6', fg: '#1f5230', track: '#4f9665' },
  caminantes: { bg: '#d5e3ff', fg: '#004787', track: '#2175d1' },
  rovers:     { bg: '#f4d4d4', fg: '#7a1f24', track: '#b8424a' },

  // Fonts
  headline: "'Manrope', 'Helvetica Neue', sans-serif",
  body:     "'Inter', 'Helvetica Neue', sans-serif",
  mono:     "'JetBrains Mono', ui-monospace, monospace",

  // Radii
  r: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 9999 },

  // Elevation
  shadowSoft: '0 1px 2px rgba(17,28,45,0.04), 0 6px 18px rgba(17,28,45,0.05)',
  shadowLift: '0 12px 40px rgba(17,28,45,0.08)',
} as const

// Branch name map: DB values → T keys
export const BRANCH_KEY: Record<string, keyof Pick<typeof T, 'lobatos' | 'unidad' | 'caminantes' | 'rovers'>> = {
  'Lobatos y Lobeznas': 'lobatos',
  'Scouts':             'unidad',
  'Caminantes':         'caminantes',
  'Rovers':             'rovers',
}
