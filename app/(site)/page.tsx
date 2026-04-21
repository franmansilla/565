import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostsPublic } from '@/lib/data'
import { enviarMensajeContacto } from '@/lib/actions'
import { MdCheckCircle } from 'react-icons/md'
import { GiFleurDeLys } from 'react-icons/gi'

export const dynamic = 'force-dynamic'

const LP = {
  primary: '#2085EE',
  primaryDark: '#1468c9',
  primaryFixed: '#dbeafe',
  primaryFixedDim: '#bfdbfe',
  accent: '#ED1C1C',
  accentSoft: '#fee4e2',
  ink: '#1E293B',
  inkSoft: '#475569',
  inkMuted: '#64748b',
  surface: '#f8fafc',
  surfaceAlt: '#f1f5f9',
  surfaceCard: '#ffffff',
  line: '#e2e8f0',
  lobatos: { bg: '#fef3c7', fg: '#92400e', track: '#f59e0b' },
  unidad: { bg: '#dcfce7', fg: '#166534', track: '#22c55e' },
  caminantes: { bg: '#dbeafe', fg: '#1e40af', track: '#2085EE' },
  rovers: { bg: '#fee4e2', fg: '#991b1b', track: '#ED1C1C' },
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ contacto?: string }>
}) {
  const { contacto } = await searchParams
  const posts = await getBlogPostsPublic().catch(() => [])
  const ultPosts = posts.slice(0, 4)

  return (
    <>
      {/* Material Symbols font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 760, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Image src="/hero.png" alt="Scouts en actividad" fill className="object-cover" priority />
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 20% 40%, #1e3a8a 0%, transparent 50%),
            radial-gradient(ellipse at 80% 60%, #1e40af 0%, transparent 50%),
            linear-gradient(180deg, #0f172a 0%, #1e293b 100%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(95deg, transparent 0 120px, rgba(255,255,255,0.02) 120px 121px),
                       repeating-linear-gradient(5deg, transparent 0 80px, rgba(255,255,255,0.02) 80px 81px)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, rgba(32,133,238,0.88) 0%, rgba(20,104,201,0.72) 100%)`,
        }} />

        {/* Floating badge */}
        <div style={{
          position: 'absolute', top: 40, right: 56,
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
          padding: '10px 16px', borderRadius: 999, color: '#fff',
          fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid rgba(255,255,255,0.2)',
          zIndex: 2,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.3)', display: 'inline-block' }} />
          Inscripciones 2026 abiertas
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '120px 24px', maxWidth: 900 }}>
          <span style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
            color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: 28, border: '1px solid rgba(255,255,255,0.2)',
          }}>Grupo Scout 565 · Córdoba</span>

          <h1 style={{
            fontFamily: 'var(--font-manrope), Manrope, sans-serif',
            fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 800,
            letterSpacing: '-0.035em', color: '#fff', margin: 0, lineHeight: 0.98,
          }}>
            Construyendo un<br />
            <span style={{ color: LP.primaryFixed, fontStyle: 'italic' }}>Mundo Mejor</span>
          </h1>

          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.85)', maxWidth: 620, margin: '32px auto 0', lineHeight: 1.55 }}>
            Formamos ciudadanos comprometidos a través de la aventura, el servicio y el contacto con la naturaleza desde hace más de 50 años.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <a href="#contacto" style={{
              background: '#fff', color: LP.primary, padding: '16px 26px', borderRadius: 12,
              fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 15, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(15,23,42,0.12)', textDecoration: 'none',
            }}>Sumate al Grupo →</a>
            <a href="#ramas" style={{
              background: 'transparent', color: '#fff', padding: '16px 26px', borderRadius: 12,
              fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 15, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.5)', textDecoration: 'none',
            }}>Conocenos más</a>
          </div>

          {/* Trust strip */}
          <div style={{
            marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.15)',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, maxWidth: 720, margin: '56px auto 0',
          }}>
            {[
              { n: '54', l: 'Años de historia' },
              { n: '142', l: 'Protagonistas' },
              { n: '28', l: 'Educadores' },
              { n: '12', l: 'Campamentos/año' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em' }}>{s.n}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section style={{ padding: '96px 56px', background: LP.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.accent }}>Nuestro Propósito</div>
            <h2 style={{
              fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800,
              letterSpacing: '-0.03em', margin: '12px 0 24px', color: LP.ink, lineHeight: 1.02,
            }}>
              Scouts que <span style={{ color: LP.primary, fontStyle: 'italic' }}>sueñan</span>, actúan y transforman.
            </h2>
            <p style={{ fontSize: 17, color: LP.inkSoft, lineHeight: 1.65, margin: 0 }}>
              Desde 1971 acompañamos a niñas, niños y jóvenes del barrio a descubrir quiénes son y qué pueden aportar al mundo. Lo hacemos con el método scout: aprender haciendo, en naturaleza, con adultos que los escuchan.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🧠', t: 'Carácter', d: 'Formar personas íntegras capaces de decidir con conciencia.', c: LP.primary },
              { icon: '👥', t: 'Comunidad', d: 'Vivir el grupo como una segunda familia.', c: LP.accent },
              { icon: '🌿', t: 'Naturaleza', d: 'El bosque y la montaña son nuestras aulas principales.', c: '#22c55e' },
              { icon: '❤️', t: 'Servicio', d: 'Dejar el mundo mejor que como lo encontraste.', c: '#f59e0b' },
            ].map((v) => (
              <div key={v.t} style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${LP.line}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: v.c + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {v.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: LP.ink, marginTop: 16, letterSpacing: '-0.015em' }}>{v.t}</div>
                <div style={{ fontSize: 13.5, color: LP.inkMuted, marginTop: 6, lineHeight: 1.5 }}>{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RAMAS ── */}
      <section id="ramas" style={{ padding: '96px 56px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>Nuestras Unidades</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>Crecimiento en Etapas</h2>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 16, color: LP.inkSoft, lineHeight: 1.55, margin: '16px auto 0', maxWidth: 560 }}>
              Cada rama acompaña una etapa del desarrollo con un método, un lenguaje y una pedagogía propia.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { k: 'lobatos' as const, icon: '🐺', n: 'Lobatos', a: '7 - 11 años', d: 'Niños y niñas que aprenden a través del juego y el Libro de las Tierras Vírgenes.' },
              { k: 'unidad' as const, icon: '🧭', n: 'Unidad Scout', a: '11 - 14 años', d: 'Jóvenes organizados en patrullas que fomentan liderazgo y autonomía.' },
              { k: 'caminantes' as const, icon: '🥾', n: 'Caminantes', a: '14 - 17 años', d: 'Adolescentes descubriendo horizontes con proyectos y desafíos grupales.' },
              { k: 'rovers' as const, icon: '🤝', n: 'Rovers', a: '17 - 21 años', d: 'Jóvenes que ponen al servicio comunitario en el centro de su proyecto de vida.' },
            ].map((r) => {
              const c = LP[r.k]
              return (
                <div key={r.k} style={{ background: '#fff', borderRadius: 20, padding: 32, position: 'relative', border: `1px solid ${LP.line}`, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${c.bg} 0%, transparent 40%)`, opacity: 0.5, pointerEvents: 'none' }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 28 }}>{r.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 26, fontWeight: 800, color: LP.ink, margin: 0, letterSpacing: '-0.02em' }}>{r.n}</h3>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.fg, marginTop: 4 }}>{r.a}</div>
                    <p style={{ fontSize: 13.5, color: LP.inkMuted, marginTop: 18, lineHeight: 1.55 }}>{r.d}</p>
                    <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6, color: LP.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Conocer más →</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HISTORIA / TIMELINE ── */}
      <section id="historia" style={{ padding: '96px 56px', background: LP.ink }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>50 Años de Historia</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: '#fff', lineHeight: 1.05 }}>Un camino, muchas generaciones.</h2>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '16px 0 0', maxWidth: 560 }}>
              Desde la fundación hasta hoy, cada ciclo agregó una piedra a nuestra mochila colectiva.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 40, left: '5%', right: '5%', height: 2, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, position: 'relative' }}>
              {[
                { y: '1971', t: 'Fundación', d: 'El Padre Julio funda el Grupo en la parroquia Niño Jesús de Praga.' },
                { y: '1987', t: 'Primer Jamboree', d: 'Ocho caminantes representan al grupo en el Jamboree Nacional.' },
                { y: '2005', t: 'Sede propia', d: 'Inauguración del galpón y cancha de actividades en el barrio.' },
                { y: '2018', t: 'Clan Rovers', d: 'Se abre formalmente el Clan Rovers, completando las cuatro ramas.' },
                { y: '2026', t: 'Hoy', d: '142 protagonistas y 28 educadores activos en el ciclo actual.', active: true },
              ].map((e) => (
                <div key={e.y}>
                  <div style={{
                    width: 80, height: 80, margin: '0 auto 24px', borderRadius: '50%',
                    background: e.active ? LP.accent : '#fff',
                    color: e.active ? '#fff' : LP.ink,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 800,
                    border: e.active ? 'none' : `4px solid ${LP.ink}`,
                    boxShadow: e.active ? `0 0 0 6px rgba(237,28,28,0.25)` : 'none',
                    position: 'relative', zIndex: 2, letterSpacing: '-0.01em',
                  }}>{e.y}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.015em' }}>{e.t}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.55 }}>{e.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MÉTODO SCOUT ── */}
      <section style={{ padding: '96px 56px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>Metodología</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>El Método Scout en 7 pilares.</h2>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 16, color: LP.inkSoft, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 560 }}>
              Es el cómo. Lo que diferencia a un grupo scout de cualquier otra actividad formativa o recreativa.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: LP.line, borderRadius: 20, overflow: 'hidden' }}>
            {[
              { n: '01', icon: '🤝', t: 'Promesa y Ley', d: 'Compromiso personal con valores universales.' },
              { n: '02', icon: '🎒', t: 'Aprender haciendo', d: 'Pedagogía experiencial, no pasiva.' },
              { n: '03', icon: '👫', t: 'Equipo pequeño', d: 'Sistema de patrullas y seisenas.' },
              { n: '04', icon: '🧑‍🏫', t: 'Adultos que acompañan', d: 'Educadores formados, presentes pero no invasivos.' },
              { n: '05', icon: '🌿', t: 'Naturaleza', d: 'El entorno natural como escenario privilegiado.' },
              { n: '06', icon: '📈', t: 'Progresión personal', d: 'Cada uno a su ritmo, con metas propias.' },
              { n: '07', icon: '🏅', t: 'Símbolos y tradición', d: 'Uniforme, insignias y ritos que crean pertenencia.' },
              { n: '+', icon: '💙', t: 'Y algo más…', d: 'Lo que cada grupo le agrega desde su identidad.' },
            ].map((p) => (
              <div key={p.n} style={{ background: '#fff', padding: 32, position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 14, fontWeight: 800, color: LP.primary, letterSpacing: '0.08em' }}>{p.n}</div>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: LP.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, fontSize: 22 }}>{p.icon}</div>
                <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 17, fontWeight: 700, color: LP.ink, marginTop: 16, letterSpacing: '-0.015em' }}>{p.t}</div>
                <div style={{ fontSize: 13, color: LP.inkMuted, marginTop: 6, lineHeight: 1.5 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      { <section id="blog" style={{ padding: '96px 56px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, gap: 40 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>Bitácora de Viaje</div>
              <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>Aventuras Recientes</h2>
            </div>
            <Link href="/blog" style={{ color: LP.primary, fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Ver todas las entradas →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {ultPosts.length > 0 ? ultPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${LP.line}` }}>
                  {post.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imagen_url} alt={post.titulo} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 220, background: `linear-gradient(135deg, ${LP.primary} 0%, ${LP.primaryDark} 100%)`, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 12px, transparent 12px 24px)' }} />
                  )}
                  <div style={{ padding: 28 }}>
                    <div style={{ fontSize: 12, color: LP.inkMuted, marginBottom: 16 }}>
                      {new Date(post.publicado_en || post.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 21, fontWeight: 700, color: LP.ink, margin: 0, lineHeight: 1.3, letterSpacing: '-0.015em' }}>{post.titulo}</h3>
                    {post.resumen && <p style={{ fontSize: 13.5, color: LP.inkMuted, marginTop: 14, lineHeight: 1.55 }}>{post.resumen}</p>}
                    <div style={{ marginTop: 20, color: LP.primary, fontSize: 13, fontWeight: 700 }}>Leer más →</div>
                  </div>
                </article>
              </Link>
            )) : [
              { tag: 'Campamentos', tagBg: LP.primaryFixed, tagFg: LP.primaryDark, d: '15 Ago, 2026', t: 'Crónica del Campamento de Invierno: Desafío de la Nieve', e: 'Nuestra última expedición a las Altas Cumbres puso a prueba el temple de los Caminantes en condiciones extremas…', g: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' },
              { tag: 'Institucional', tagBg: LP.accentSoft, tagFg: LP.accent, d: '28 Jul, 2026', t: 'Nuevos dirigentes en el Grupo: compromiso con la niñez', e: 'Damos la bienvenida a los nuevos educadores scouts que se integran a la Manada y a la Unidad Scout…', g: `linear-gradient(135deg, ${LP.accent} 0%, #7f1d1d 100%)` },
              { tag: 'Comunidad', tagBg: '#dcfce7', tagFg: '#166534', d: '12 Jun, 2026', t: 'Proyecto Huertas: cultivando valores en el barrio', e: 'Los Rovers iniciaron una huerta comunitaria con vecinos para fomentar la soberanía alimentaria…', g: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)' },
            ].map((p, i) => (
              <article key={i} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${LP.line}` }}>
                <div style={{ height: 220, background: p.g, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 12px, transparent 12px 24px)' }} />
                <div style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: p.tagBg, color: p.tagFg, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.tag}</span>
                    <span style={{ fontSize: 12, color: LP.inkMuted }}>{p.d}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 21, fontWeight: 700, color: LP.ink, margin: 0, lineHeight: 1.3, letterSpacing: '-0.015em' }}>{p.t}</h3>
                  <p style={{ fontSize: 13.5, color: LP.inkMuted, marginTop: 14, lineHeight: 1.55 }}>{p.e}</p>
                  <div style={{ marginTop: 20, color: LP.primary, fontSize: 13, fontWeight: 700 }}>Leer más →</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {/* ── TESTIMONIOS ── */}
      <section style={{ padding: '96px 56px', background: LP.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>Voces del grupo</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>Lo que cuentan nuestras familias</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { q: 'Cata llega los sábados con pilas y se va cansada pero feliz. En tres años la vimos crecer en autonomía como no imaginamos.', n: 'Valeria R.', r: 'Mamá de Caminante', b: LP.caminantes },
              { q: 'Los campamentos son momentos únicos. Ver a mi hijo armando su carpa, cocinando con sus amigos, es una enseñanza que no tiene precio.', n: 'Andrés B.', r: 'Papá de Unidad', b: LP.unidad },
              { q: 'El Grupo 565 me formó más que cualquier otra cosa en la vida. Hoy vuelvo como educadora a devolver lo que me dieron.', n: 'Rocío B.', r: 'Ex-caminante, hoy Subjefa', b: LP.rovers },
            ].map((t, i) => (
              <figure key={i} style={{ background: '#fff', borderRadius: 20, padding: 32, margin: 0, border: `1px solid ${LP.line}` }}>
                <div style={{ fontSize: 36, color: t.b.track, lineHeight: 1 }}>"</div>
                <blockquote style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 500, color: LP.ink, margin: '16px 0 24px', lineHeight: 1.45, letterSpacing: '-0.01em' }}>
                  {t.q}
                </blockquote>
                <figcaption style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 20, borderTop: `1px solid ${LP.line}` }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 999,
                    background: t.b.bg, color: t.b.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontWeight: 700, fontSize: 14,
                  }}>{t.n.split(' ').map((w: string) => w[0]).join('')}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: LP.ink }}>{t.n}</div>
                    <div style={{ fontSize: 12, color: LP.inkMuted }}>{t.r}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '96px 56px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>Preguntas frecuentes</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>¿Cómo sumarse al grupo?</h2>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 16, color: LP.inkSoft, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 560 }}>Lo esencial antes de venir un sábado. Si queda alguna duda, escribinos.</p>
          </div>
          {(() => {
            const faqs = [
              { q: '¿Cuándo se reúnen?', a: 'Los sábados de 14:30 a 17:30 en la sede, con salidas y campamentos agendados a lo largo del ciclo.' },
              { q: '¿Cómo inscribo a mi hijo/a?', a: 'Ingresá por el botón "Inscribirse" y completá la ficha. Un educador te contacta dentro de 48hs.' },
              { q: '¿Hay cuota? ¿Cuánto sale?', a: 'La cuota mensual 2026 es $ 28.500 y cubre seguro, materiales y mantenimiento. Hay becas disponibles.' },
              { q: '¿Necesito equipo especial?', a: 'No al inicio. Para campamentos prestamos carpas y material grupal; el equipo personal se arma de a poco.' },
              { q: '¿Quiénes son los educadores?', a: 'Jóvenes y adultos del grupo con formación scout y acompañamiento permanente del Consejo.' },
            ]
            const col1 = faqs.slice(0, 3)
            const col2 = faqs.slice(3)
            const renderItem = (f: { q: string; a: string }, i: number, open: boolean) => (
              <details key={i} style={{ background: LP.surface, borderRadius: 14, padding: '20px 24px', border: `1px solid ${LP.line}`, cursor: 'pointer' }} open={open}>
                <summary style={{
                  fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 16, fontWeight: 700, color: LP.ink,
                  letterSpacing: '-0.01em', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {f.q}
                  <span style={{ color: LP.primary, fontSize: 20 }}>+</span>
                </summary>
                <p style={{ fontSize: 14, color: LP.inkSoft, marginTop: 12, marginBottom: 0, lineHeight: 1.55 }}>{f.a}</p>
              </details>
            )
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {col1.map((f, i) => renderItem(f, i, i === 0))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {col2.map((f, i) => renderItem(f, i, false))}
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" style={{ padding: '96px 56px', background: LP.surface }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: LP.primary }}>¿Querés sumarte?</div>
            <h2 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 0', color: LP.ink, lineHeight: 1.05 }}>Escribinos</h2>
            <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 16, color: LP.inkSoft, lineHeight: 1.55, margin: '16px auto 0', maxWidth: 480 }}>
              Completá el formulario y nos ponemos en contacto para contarte cómo empezar.
            </p>
          </div>

          {contacto === 'ok' ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: 32, textAlign: 'center' }}>
              <MdCheckCircle size={40} style={{ color: '#22c55e', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#166534', margin: 0 }}>¡Mensaje enviado!</p>
              <p style={{ fontSize: 14, color: '#15803d', marginTop: 6 }}>Nos ponemos en contacto a la brevedad.</p>
            </div>
          ) : (
            <form action={enviarMensajeContacto} style={{ background: '#fff', borderRadius: 20, border: `1px solid ${LP.line}`, padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <LPField label="Nombre" required><input name="nombre" required style={inputStyle} placeholder="Tu nombre" /></LPField>
                <LPField label="Email" required><input name="email" type="email" required style={inputStyle} placeholder="correo@ejemplo.com" /></LPField>
              </div>
              <div style={{ marginBottom: 16 }}>
                <LPField label="Teléfono"><input name="telefono" type="tel" style={inputStyle} placeholder="(opcional)" /></LPField>
              </div>
              <div style={{ marginBottom: 24 }}>
                <LPField label="Mensaje" required>
                  <textarea name="mensaje" required rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Contanos sobre el chico/a: nombre, edad, rama de interés..." />
                </LPField>
              </div>
              <button type="submit" style={{
                width: '100%', background: LP.primary, color: '#fff',
                padding: '16px', borderRadius: 12, border: 'none',
                fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 6px 18px rgba(32,133,238,0.3)',
              }}>
                Enviar consulta
              </button>
            </form>
          )}

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: LP.inkMuted }}>
            Reuniones: <strong style={{ color: LP.ink }}>Sábados de 14:30 a 17:30 hs</strong> · Alto Alberdi, Córdoba
          </p>
        </div>
      </section>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
  fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: 14, color: '#1E293B',
  boxSizing: 'border-box',
}

function LPField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ED1C1C' }}>*</span>}
      </label>
      {children}
    </div>
  )
}
