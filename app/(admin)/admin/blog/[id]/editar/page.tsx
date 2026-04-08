import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MdArrowBack } from 'react-icons/md'
import { getBlogPostById } from '@/lib/data'
import { updateBlogPost } from '@/lib/actions'

export default async function EditarBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id).catch(() => null)
  if (!post) notFound()

  const updateAction = updateBlogPost.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm">
          <MdArrowBack size={16} /> Volver al blog
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Editar publicación</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <form action={updateAction} className="space-y-5">
          <Field label="Título" required>
            <input name="titulo" required defaultValue={post.titulo} className={inputCls} />
          </Field>

          <Field label="Resumen">
            <textarea name="resumen" rows={2} defaultValue={post.resumen || ''} className={inputCls} />
          </Field>

          <Field label="Contenido" required>
            <textarea name="contenido" required rows={12} defaultValue={post.contenido} className={inputCls} />
          </Field>

          <Field label="URL de imagen de portada">
            <input name="imagen_url" type="url" defaultValue={post.imagen_url || ''} className={inputCls} />
          </Field>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                name="publicado"
                value="true"
                defaultChecked={post.publicado}
                className="w-4 h-4 accent-primary"
              />
              Publicado (visible en el sitio)
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/blog"
              className="flex-1 text-center border border-slate-200 text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 text-sm'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
