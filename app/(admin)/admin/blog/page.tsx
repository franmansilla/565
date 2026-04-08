import Link from 'next/link'
import { MdAdd, MdEdit, MdVisibility, MdVisibilityOff, MdMail, MdMarkEmailRead } from 'react-icons/md'
import { getBlogPosts, getMensajesContacto } from '@/lib/data'
import { deleteBlogPost, marcarMensajeLeido } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const [posts, mensajes] = await Promise.all([
    getBlogPosts(false),
    getMensajesContacto(),
  ])
  const noLeidos = mensajes.filter((m) => !m.leido).length

  return (
    <div className="space-y-8">
      {/* Blog posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blog</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gestión de publicaciones del sitio público</p>
          </div>
          <Link
            href="/admin/blog/nuevo"
            className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <MdAdd size={16} /> Nueva publicación
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400">
            <p>Sin publicaciones aún.</p>
            <Link href="/admin/blog/nuevo" className="text-primary hover:underline text-sm mt-2 inline-block">
              Crear la primera
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
            {posts.map((post) => {
              const deleteAction = deleteBlogPost.bind(null, post.id)
              return (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800 truncate">{post.titulo}</h3>
                      {post.publicado
                        ? <MdVisibility size={15} className="text-green-500 flex-shrink-0" title="Publicado" />
                        : <MdVisibilityOff size={15} className="text-slate-300 flex-shrink-0" title="Borrador" />
                      }
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {post.publicado ? 'Publicado' : 'Borrador'} ·{' '}
                      {new Date(post.updated_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.publicado && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-primary transition-colors"
                      >
                        Ver
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}/editar`}
                      className="inline-flex items-center gap-1 text-xs border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <MdEdit size={13} /> Editar
                    </Link>
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="text-xs text-red-400 hover:text-red-600 transition-colors px-1.5 py-1.5"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mensajes de contacto */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">Mensajes de Contacto</h2>
          {noLeidos > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {noLeidos} sin leer
            </span>
          )}
        </div>

        {mensajes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
            Sin mensajes aún.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
            {mensajes.map((msg) => {
              const marcarAction = marcarMensajeLeido.bind(null, msg.id)
              return (
                <div key={msg.id} className={`p-4 ${!msg.leido ? 'bg-blue-50/50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {!msg.leido
                          ? <MdMail size={15} className="text-primary flex-shrink-0" />
                          : <MdMarkEmailRead size={15} className="text-slate-300 flex-shrink-0" />
                        }
                        <span className="font-medium text-slate-800 text-sm">{msg.nombre}</span>
                        <span className="text-xs text-slate-400">{msg.email}</span>
                        {msg.telefono && <span className="text-xs text-slate-400">· {msg.telefono}</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{msg.mensaje}</p>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {new Date(msg.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!msg.leido && (
                      <form action={marcarAction}>
                        <button
                          type="submit"
                          className="text-xs text-primary hover:underline whitespace-nowrap flex-shrink-0"
                        >
                          Marcar leído
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
