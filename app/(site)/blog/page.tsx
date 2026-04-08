import Link from 'next/link'
import { getBlogPostsPublic } from '@/lib/data'
import { MdArrowBack } from 'react-icons/md'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getBlogPostsPublic().catch(() => [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-3">
          <MdArrowBack size={16} /> Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Blog</h1>
        <p className="text-slate-500 mt-1">Noticias y novedades del Grupo Scout 565</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">Próximamente las primeras novedades del grupo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {post.imagen_url && (
                <img src={post.imagen_url} alt={post.titulo} className="w-full h-44 object-cover" />
              )}
              <div className="p-5">
                <p className="text-xs text-slate-400 mb-2">
                  {new Date(post.publicado_en || post.created_at).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <h2 className="font-bold text-slate-800 text-lg leading-snug mb-2">{post.titulo}</h2>
                {post.resumen && <p className="text-slate-500 text-sm line-clamp-3">{post.resumen}</p>}
                <span className="inline-block mt-3 text-primary text-sm font-medium hover:underline">
                  Leer más →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
