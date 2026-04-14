import Link from 'next/link'
import { MdAdd, MdFamilyRestroom, MdPeople } from 'react-icons/md'
import { getGruposFamiliares } from '@/lib/data'
import { deleteGrupoFamiliar } from '@/lib/actions'
import { RAMA_COLORS, type Rama } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function GruposFamiliaresPage() {
  const grupos = await getGruposFamiliares()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MdFamilyRestroom size={26} /> Grupos Familiares
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Hermanos agrupados reciben descuento según su orden (titular → hermano 1 → hermano 2+).
          </p>
        </div>
        <Link
          href="/admin/grupos-familiares/nuevo"
          className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          <MdAdd size={16} /> Nuevo Grupo
        </Link>
      </div>

      <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-primary">
        <p className="font-semibold mb-2">Descuentos vigentes</p>
        <div className="flex flex-wrap gap-6">
          <span>🥇 Titular (orden 1): <strong>$18.000/mes · $60.000/sem1</strong></span>
          <span>🥈 Hermano 1 (orden 2): <strong>$13.000/mes · $42.000/sem1</strong></span>
          <span>🥉 Hermano 2+ (orden 3+): <strong>$12.000/mes · $39.000/sem1</strong></span>
        </div>
        <p className="mt-1 text-xs text-primary/70">
          Editá el <strong>orden_hermano</strong> de cada protagonista desde su perfil para asignarlo.
        </p>
      </div>

      {grupos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400">
          <MdFamilyRestroom size={40} className="mx-auto mb-3 text-slate-200" />
          <p>No hay grupos familiares creados aún.</p>
          <Link href="/admin/grupos-familiares/nuevo" className="text-primary hover:underline text-sm mt-2 inline-block">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {grupos.map((grupo) => {
            const g = grupo as Record<string, unknown>
            const miembros = ((g.beneficiarios as Array<{
              id: string; nombre: string; apellido: string; rama: string; orden_hermano: number; activo: boolean
            }>) || []).sort((a, b) => a.orden_hermano - b.orden_hermano)
            const deleteAction = deleteGrupoFamiliar.bind(null, g.id as string)

            return (
              <div key={g.id as string} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {g.nombre as string}
                      {g.apellido_familia ? <span className="text-slate-500 font-normal text-base ml-2">— familia {g.apellido_familia as string}</span> : ''}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-1">
                      {g.telefono_contacto ? <span>📞 {String(g.telefono_contacto)}</span> : null}
                      {g.email_contacto ? <span>✉ {String(g.email_contacto)}</span> : null}
                      {g.barrio ? <span>📍 {String(g.barrio)}</span> : null}
                    </div>
                  </div>
                  <form action={deleteAction}>
                    <button type="submit"
                      className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1">
                      Eliminar
                    </button>
                  </form>
                </div>

                {miembros.length === 0 ? (
                  <p className="text-slate-400 text-sm mt-3">Sin miembros asignados.</p>
                ) : (
                  <div className="mt-3 divide-y divide-slate-50">
                    {miembros.map((m) => {
                      const tierLabel = m.orden_hermano === 1 ? '🥇 Titular' : m.orden_hermano === 2 ? '🥈 Hermano 1' : '🥉 Hermano 2+'
                      return (
                        <div key={m.id} className="flex items-center gap-3 py-2.5">
                          <span className="text-xs text-slate-400 w-24 flex-shrink-0">{tierLabel}</span>
                          <Link href={`/protagonistas/${m.id}`}
                            className="flex-1 flex items-center gap-2 hover:text-primary transition-colors">
                            <MdPeople size={15} className="text-slate-300" />
                            <span className="font-medium text-slate-800 text-sm">{m.apellido}, {m.nombre}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${RAMA_COLORS[m.rama as Rama] ?? 'bg-slate-100 text-slate-600'}`}>
                              {m.rama}
                            </span>
                            {!m.activo && <span className="text-xs text-slate-400">(inactivo)</span>}
                          </Link>
                          <Link href={`/protagonistas/${m.id}/editar`}
                            className="text-xs text-slate-400 hover:text-primary transition-colors">
                            Editar
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
