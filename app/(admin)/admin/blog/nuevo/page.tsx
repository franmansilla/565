import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'
import { createBlogPost } from '@/lib/actions'

export default function NuevoBlogPostPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm">
          <MdArrowBack size={16} /> Volver al blog
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Nueva publicación</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <form action={createBlogPost} className="space-y-5">
          <Field label="Título" required>
            <input name="titulo" required className={inputCls} placeholder="Título de la publicación" />
          </Field>

          <Field label="Resumen">
            <textarea
              name="resumen"
              rows={2}
              className={inputCls}
              placeholder="Breve descripción que aparece en la lista del blog (opcional)"
            />
          </Field>

          <Field label="Contenido" required>
            <textarea
              name="contenido"
              required
              rows={12}
              className={inputCls}
              placeholder="Escribí el contenido de la nota aquí..."
            />
          </Field>

          <Field label="URL de imagen de portada">
            <input
              name="imagen_url"
              type="url"
              className={inputCls}
              placeholder="https://... (opcional)"
            />
          </Field>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input type="checkbox" name="publicado" value="true" className="w-4 h-4 accent-primary" />
              Publicar inmediatamente
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Guardar publicación
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
