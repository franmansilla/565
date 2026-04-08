import type { Metadata } from 'next'
import Link from 'next/link'
import { GiFleurDeLys } from 'react-icons/gi'

export const metadata: Metadata = {
  title: 'Niño Jesús de Praga — Grupo Scout 565',
  description: 'Formamos ciudadanos comprometidos a través de la aventura, el servicio y el contacto con la naturaleza desde hace más de 50 años.',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-[#f9f9ff] text-[#111c2d]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-[#005cad] hover:opacity-80 transition-opacity">
            <GiFleurDeLys size={22} />
            <span className="text-xl font-bold tracking-tight">Niño Jesús de Praga</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center font-semibold tracking-tight text-sm">
            <Link href="/" className="text-[#005cad] border-b-2 border-[#005cad] pb-0.5">Home</Link>
            <Link href="/#ramas" className="text-slate-600 hover:text-[#005cad] transition-colors">Ramas</Link>
            <Link href="/#actividades" className="text-slate-600 hover:text-[#005cad] transition-colors">Actividades</Link>
            <Link href="/blog" className="text-slate-600 hover:text-[#005cad] transition-colors">Blog</Link>
            <Link href="/#contacto" className="text-slate-600 hover:text-[#005cad] transition-colors">Contacto</Link>
          </div>
          <Link
            href="/#contacto"
            className="bg-[#005cad] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#004787] transition-colors shadow-lg shadow-[#005cad]/20"
          >
            Inscribirse
          </Link>
        </div>
        <div className="bg-gradient-to-r from-transparent via-blue-100 to-transparent h-px absolute bottom-0 w-full" />
      </nav>

      <main className="flex-1 pt-[73px]">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-50 rounded-t-3xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto text-sm">
          <div className="col-span-1">
            <div className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <GiFleurDeLys className="text-[#005cad]" size={18} />
              Niño Jesús de Praga
            </div>
            <p className="text-slate-500 mb-6">Educar para la vida, a través de la formación de carácter, salud, destrezas manuales y servicio al prójimo.</p>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-5">Navegación</h5>
            <ul className="space-y-3">
              {[['Home', '/'], ['Ramas', '/#ramas'], ['Actividades', '/#actividades'], ['Blog', '/blog']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-slate-500 hover:text-slate-800 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-5">Acceso</h5>
            <ul className="space-y-3">
              <li><Link href="/#contacto" className="text-slate-500 hover:text-slate-800 transition-colors">Contacto</Link></li>
              <li><Link href="/admin" className="text-slate-500 hover:text-slate-800 transition-colors">Área Educadores</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-5">Ubicación</h5>
            <p className="text-slate-500">Alto Alberdi, Córdoba<br />Argentina</p>
            <p className="text-slate-500 mt-3">Reuniones: <strong className="text-slate-700">Sábados 9–12 hs</strong></p>
          </div>
        </div>
        <div className="border-t border-slate-200 px-8 py-5 max-w-7xl mx-auto text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} Grupo Scout 565 Niño Jesús de Praga. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
