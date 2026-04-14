import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'
import { createGrupoFamiliar } from '@/lib/actions'

export default function NuevoGrupoFamiliarPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <Link href="/admin/grupos-familiares" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm">
          <MdArrowBack size={16} /> Volver a Grupos Familiares
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Nuevo Grupo Familiar</h1>
        <p className="text-slate-500 mt-1">
          Creá el grupo y luego editá cada protagonista para asignarle el grupo y su orden de hermano.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <form action={createGrupoFamiliar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del grupo <span className="text-brand-red">*</span>
              </label>
              <input name="nombre" required placeholder="Ej: Familia González" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Apellido de la familia <span className="text-brand-red">*</span>
              </label>
              <input name="apellido_familia" required placeholder="Ej: González" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono de contacto</label>
              <input name="telefono_contacto" type="tel" placeholder="351 000 0000" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email de contacto</label>
              <input name="email_contacto" type="email" placeholder="familia@ejemplo.com" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input name="direccion" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Barrio</label>
              <input name="barrio" className={inputCls} />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            Después de crear el grupo, editá cada protagonista: asignale este grupo y su <strong>orden de hermano</strong> (1 = titular, 2 = hermano 1, 3+ = hermano 2+).
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium">
              Crear Grupo
            </button>
            <Link href="/admin/grupos-familiares"
              className="flex-1 text-center border border-slate-200 text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-slate-800'
