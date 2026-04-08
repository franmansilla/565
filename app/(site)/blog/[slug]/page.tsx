import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostPublic } from '@/lib/data'
import { MdArrowBack } from 'react-icons/md'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostPublic(slug).catch(() => null)
  if (!post || !post.publicado) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-6">
        <MdArrowBack size={16} /> Volver al blog
      </Link>

      {post.imagen_url && (
        <img src={post.imagen_url} alt={post.titulo} className="w-full rounded-xl mb-6 max-h-72 object-cover" />
      )}

      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
        {new Date(post.publicado_en || post.created_at).toLocaleDateString('es-AR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
      <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">{post.titulo}</h1>
      {post.resumen && (
        <p className="text-lg text-slate-500 mb-6 border-l-4 border-primary pl-4">{post.resumen}</p>
      )}

      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap"
      >
        {post.contenido}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-100">
        <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
          ← Ver todas las noticias
        </Link>
      </div>
    </div>
  )
}
