import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['400','500','600','700','800'] })
const inter = Inter({ variable: '--font-inter', subsets: ['latin'], weight: ['400','500','600','700'] })

export const metadata: Metadata = {
  title: 'Niño Jesús de Praga — Grupo Scout 565',
  description: 'Grupo Scout Niño Jesús de Praga, Córdoba Argentina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.variable} ${manrope.variable} ${inter.variable} font-sans bg-slate-50 h-full`}>
        {children}
      </body>
    </html>
  )
}
