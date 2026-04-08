import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostsPublic } from '@/lib/data'
import { enviarMensajeContacto } from '@/lib/actions'
import { MdCheckCircle } from 'react-icons/md'

export const dynamic = 'force-dynamic'

const RAMAS = [
  {
    nombre: 'Lobatos y Lobeznas',
    edad: '7 – 11 años',
    desc: 'Niños y niñas que aprenden a través del juego y el Libro de las Tierras Vírgenes.',
    bg: 'bg-[#e7eeff]',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: '🐺',
  },
  {
    nombre: 'Scouts',
    edad: '11 – 14 años',
    desc: 'El sistema de patrullas fomenta el liderazgo, la autonomía y la aventura.',
    bg: 'bg-[#f0f3ff]',
    badge: 'bg-green-100 text-green-800',
    icon: '🧭',
  },
  {
    nombre: 'Caminantes',
    edad: '14 – 17 años',
    desc: 'Descubriendo horizontes a través de proyectos y desafíos grupales.',
    bg: 'bg-[#e7eeff]',
    badge: 'bg-blue-100 text-blue-800',
    icon: '🥾',
  },
  {
    nombre: 'Rovers',
    edad: '17 – 21 años',
    desc: 'El servicio comunitario es el motor de su propio proyecto de vida.',
    bg: 'bg-[#f0f3ff]',
    badge: 'bg-purple-100 text-purple-800',
    icon: '🤝',
  },
]

const ACTIVIDADES = [
  {
    titulo: 'Vida al Aire Libre',
    desc: 'Nuestra principal aula es la naturaleza.',
    src: '/actividad-aire-libre.jpg',
    accent: 'from-[#263143]',
    col: 'md:col-span-2',
  },
  {
    titulo: 'Servicio',
    desc: 'Compromiso con el prójimo.',
    src: '/actividad-servicio.jpg',
    accent: 'from-[#bc000b]',
    col: 'md:col-span-1',
  },
  {
    titulo: 'Campamentos',
    desc: 'Experiencias que duran toda la vida.',
    src: '/actividad-campamentos.jpg',
    accent: 'from-[#005cad]',
    col: 'md:col-span-1',
  },
  {
    titulo: 'Formación en Valores',
    desc: 'Liderazgo, empatía y resiliencia.',
    src: '/actividad-valores.jpg',
    accent: 'from-[#005cae]',
    col: 'md:col-span-2',
  },
]

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ contacto?: string }>
}) {
  const { contacto } = await searchParams
  const posts = await getBlogPostsPublic().catch(() => [])
  const ultPosts = posts.slice(0, 3)

  return (
    <>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative h-[88vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Scouts en actividad"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#005cad]/90 to-[#0075d8]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 text-white backdrop-blur-md text-sm font-semibold tracking-widest uppercase">
            Grupo Scout 565
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Construyendo un<br />
            <span className="text-[#d5e3ff]">Mundo Mejor</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Formamos ciudadanos comprometidos a través de la aventura, el servicio y el contacto con la naturaleza desde hace más de 50 años.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contacto"
              className="bg-white text-[#005cad] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f0f3ff] transition-all"
            >
              Sumate al Grupo
            </a>
            <a
              href="#ramas"
              className="bg-transparent border-2 border-white/40 text-white backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Conocenos más
            </a>
          </div>
        </div>
      </section>

      {/* ── Ramas ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f9f9ff]" id="ramas">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-[#005cad] font-bold tracking-widest text-xs uppercase">Nuestras Unidades</span>
            <h2 className="text-4xl font-bold text-[#111c2d] mt-2">Crecimiento en Etapas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RAMAS.map((r) => (
              <div
                key={r.nombre}
                className={`p-8 rounded-xl ${r.bg} hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/5 transition-all`}
              >
                <div className="text-4xl mb-5">{r.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#111c2d]">{r.nombre}</h3>
                <p className="text-[#414753] mb-5 text-sm leading-relaxed">{r.desc}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${r.badge}`}>
                  {r.edad}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actividades bento ───────────────────────────── */}
      <section className="py-24 px-6 bg-[#f0f3ff]" id="actividades">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <h2 className="text-4xl font-bold text-[#111c2d]">Lo que Hacemos</h2>
            <p className="text-[#414753] mt-3 text-lg">Aprendizaje activo en entornos significativos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {ACTIVIDADES.map((a) => (
              <div key={a.titulo} className={`relative rounded-xl overflow-hidden group ${a.col}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.src}
                  alt={a.titulo}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${a.accent}/80 to-transparent`} />
                <div className="absolute bottom-8 left-8">
                  <h4 className="text-2xl font-bold text-white">{a.titulo}</h4>
                  <p className="text-white/80 mt-1">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────── */}
      {ultPosts.length > 0 && (
        <section className="py-24 px-6 bg-[#f9f9ff]" id="blog">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
              <div>
                <span className="text-[#005cad] font-bold tracking-widest text-xs uppercase">Bitácora de Viaje</span>
                <h2 className="text-4xl font-bold text-[#111c2d] mt-2">Aventuras Recientes</h2>
              </div>
              <Link href="/blog" className="text-[#005cad] font-bold flex items-center gap-1 hover:underline text-sm">
                Ver todas las entradas →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ultPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all border border-[#c0c6d5]/10 block"
                >
                  {post.imagen_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imagen_url} alt={post.titulo} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <p className="text-[#717784] text-xs mb-3">
                      {new Date(post.publicado_en || post.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <h3 className="text-xl font-bold mb-3 leading-snug text-[#111c2d]">{post.titulo}</h3>
                    {post.resumen && (
                      <p className="text-[#414753] text-sm mb-4 line-clamp-3">{post.resumen}</p>
                    )}
                    <span className="text-[#005cad] text-sm font-bold">Leer más →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA newsletter ──────────────────────────────── */}
      <section className="py-20 px-6 bg-[#005cad] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 italic">&ldquo;Siempre Listos para Servir&rdquo;</h2>
          <p className="text-white/80 text-lg mb-8">
            Recibí las últimas novedades del grupo y enterate de las fechas de inscripción para el próximo ciclo scout.
          </p>
          <a
            href="#contacto"
            className="inline-block bg-white text-[#005cad] px-8 py-4 rounded-xl font-bold hover:bg-[#f0f3ff] transition-all"
          >
            Escribinos
          </a>
        </div>
      </section>

      {/* ── Contacto ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f9f9ff]" id="contacto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#005cad] font-bold tracking-widest text-xs uppercase">¿Querés sumarte?</span>
            <h2 className="text-4xl font-bold text-[#111c2d] mt-2">Escribinos</h2>
            <p className="text-[#414753] mt-3">
              Completá el formulario y nos ponemos en contacto para contarte cómo empezar.
            </p>
          </div>

          {contacto === 'ok' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <MdCheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <p className="text-green-800 font-bold text-lg">¡Mensaje enviado!</p>
              <p className="text-green-700 text-sm mt-1">Nos ponemos en contacto a la brevedad.</p>
            </div>
          ) : (
            <form action={enviarMensajeContacto} className="bg-white rounded-xl border border-[#c0c6d5]/30 shadow-sm p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre" required>
                  <input name="nombre" required className={inputCls} placeholder="Tu nombre" />
                </Field>
                <Field label="Email" required>
                  <input name="email" type="email" required className={inputCls} placeholder="correo@ejemplo.com" />
                </Field>
              </div>
              <Field label="Teléfono">
                <input name="telefono" type="tel" className={inputCls} placeholder="(opcional)" />
              </Field>
              <Field label="Mensaje" required>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  className={inputCls}
                  placeholder="Contanos sobre el chico/a: nombre, edad, rama de interés..."
                />
              </Field>
              <button
                type="submit"
                className="w-full bg-[#005cad] text-white py-3 rounded-xl font-bold hover:bg-[#004787] transition-colors shadow-lg shadow-[#005cad]/20"
              >
                Enviar consulta
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#717784]">
            Reuniones: <strong className="text-[#111c2d]">Sábados de 9:00 a 12:00 hs</strong> · Alto Alberdi, Córdoba
          </p>
        </div>
      </section>
    </>
  )
}

const inputCls =
  'w-full border border-[#c0c6d5] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#005cad] text-[#111c2d] text-sm bg-[#f9f9ff]'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#414753] mb-1">
        {label} {required && <span className="text-[#bc000b]">*</span>}
      </label>
      {children}
    </div>
  )
}
