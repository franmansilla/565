import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Niño Jesús de Praga — Grupo Scout 565',
  description: 'Grupo Scout Niño Jesús de Praga, Córdoba Argentina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.variable} font-sans bg-slate-50 h-full`}>
        {children}
      </body>
    </html>
  )
}
