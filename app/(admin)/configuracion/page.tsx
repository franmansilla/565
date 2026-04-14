import { redirect } from 'next/navigation'
import { MdSettings, MdHistory } from 'react-icons/md'
import { createServerClient } from '@/lib/supabase/server'
import { getCuotaActual, getHistorialCuota, getCurrentUserRole } from '@/lib/data'
import { updateCuota } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rol = await getCurrentUserRole(user.id)
  if (rol !== 'admin') redirect('/admin')

  const [cuotaActual, historial] = await Promise.all([
    getCuotaActual(),
    getHistorialCuota(),
  ])

  const c = cuotaActual as Record<string, unknown> | null
  const fmt = (v: unknown) => v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <MdSettings size={28} /> Configuración
        </h1>
        <p className="text-slate-500 mt-1">Montos de cuotas vigentes</p>
      </div>

      {/* ── Resumen vigente ───────────────────────────────────── */}
      {c && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Mensual Titular',      val: c.monto },
            { label: 'Mensual Hermano 1',    val: c.monto_hermano1 },
            { label: 'Mensual Hermano 2+',   val: c.monto_hermano2 },
            { label: 'Sem. 1 Titular',       val: c.monto_semestral1 },
            { label: 'Sem. 1 Hermano 1',     val: c.monto_semestral1_hermano1 },
            { label: 'Sem. 1 Hermano 2+',    val: c.monto_semestral1_hermano2 },
            { label: 'Sem. 2 Titular',       val: c.monto_semestral2 },
            { label: 'Sem. 2 Hermano 1',     val: c.monto_semestral2_hermano1 },
            { label: 'Sem. 2 Hermano 2+',    val: c.monto_semestral2_hermano2 },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <p className="text-[11px] text-slate-500 mb-1">{label}</p>
              <p className={`text-lg font-bold ${val != null ? 'text-slate-800' : 'text-slate-300'}`}>{fmt(val)}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Formulario ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Actualizar Cuotas</h2>
        <p className="text-sm text-slate-500 mb-5">
          Sem. 1 cubre <strong>Abr–Jul</strong> (vence 10 de Mayo) · Sem. 2 cubre <strong>Ago–Nov</strong> (vence 10 de Sep)
        </p>

        <form action={updateCuota} className="space-y-6">
          {/* Mensual */}
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Mensual</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Titular ($)" required>
                <input name="monto" type="number" step="1" min="0" required placeholder="18000" className={inputCls} />
              </Field>
              <Field label="Hermano 1 ($)">
                <input name="monto_hermano1" type="number" step="1" min="0" placeholder="13000" className={inputCls} />
              </Field>
              <Field label="Hermano 2+ ($)">
                <input name="monto_hermano2" type="number" step="1" min="0" placeholder="12000" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* Semestral 1 */}
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Semestral 1 — Abr a Jul</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Titular ($)">
                <input name="monto_semestral1" type="number" step="1" min="0" placeholder="60000" className={inputCls} />
              </Field>
              <Field label="Hermano 1 ($)">
                <input name="monto_semestral1_hermano1" type="number" step="1" min="0" placeholder="42000" className={inputCls} />
              </Field>
              <Field label="Hermano 2+ ($)">
                <input name="monto_semestral1_hermano2" type="number" step="1" min="0" placeholder="39000" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* Semestral 2 */}
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Semestral 2 — Ago a Nov</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Titular ($)">
                <input name="monto_semestral2" type="number" step="1" min="0" placeholder="A confirmar" className={inputCls} />
              </Field>
              <Field label="Hermano 1 ($)">
                <input name="monto_semestral2_hermano1" type="number" step="1" min="0" placeholder="A confirmar" className={inputCls} />
              </Field>
              <Field label="Hermano 2+ ($)">
                <input name="monto_semestral2_hermano2" type="number" step="1" min="0" placeholder="A confirmar" className={inputCls} />
              </Field>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <Field label="Trimestral por mes ($) (legacy)">
              <input name="monto_trimestral_mes" type="number" step="1" min="0" className={inputCls} />
            </Field>
            <Field label="Descripción / Motivo">
              <input name="descripcion" type="text" placeholder="Ej: Actualización mayo 2026" className={inputCls} />
            </Field>
          </div>

          <button type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm">
            Guardar Configuración
          </button>
        </form>
      </div>

      {/* ── Historial ─────────────────────────────────────────── */}
      {historial.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MdHistory size={20} /> Historial
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-2 font-medium">Fecha</th>
                  <th className="pb-2 font-medium">Mensual Titular</th>
                  <th className="pb-2 font-medium">H1</th>
                  <th className="pb-2 font-medium">H2+</th>
                  <th className="pb-2 font-medium">Sem1 Titular</th>
                  <th className="pb-2 font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historial.map((row, i) => {
                  const r = row as Record<string, unknown>
                  return (
                    <tr key={r.id as string} className={i === 0 ? 'font-semibold text-slate-800' : 'text-slate-600'}>
                      <td className="py-2.5">
                        {new Date(r.created_at as string).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        {i === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">vigente</span>}
                      </td>
                      <td className="py-2.5">{fmt(r.monto)}</td>
                      <td className="py-2.5">{fmt(r.monto_hermano1)}</td>
                      <td className="py-2.5">{fmt(r.monto_hermano2)}</td>
                      <td className="py-2.5">{fmt(r.monto_semestral1)}</td>
                      <td className="py-2.5 text-slate-500">{(r.descripcion as string) || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-slate-800'

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
