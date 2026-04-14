'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MdEdit } from 'react-icons/md'
import { createPago } from '@/lib/actions'
import { MESES, MESES_SCOUT, METODOS_PAGO } from '@/lib/types'

// Semestres fijos
const SEMESTRES = {
  semestral_1: { meses: [4, 5, 6, 7], periodoMes: 4, label: 'Semestral 1 — Abr a Jul' },
  semestral_2: { meses: [8, 9, 10, 11], periodoMes: 8, label: 'Semestral 2 — Ago a Nov' },
}

type Protagonista = {
  id: string
  apellido: string
  nombre: string
  rama: string
  orden_hermano: number
}
type Campamento = {
  id: string
  nombre: string
  precio_estimado?: number | null
  fecha_inicio: string
}

interface CuotaConfig {
  monto: number
  monto_hermano1?: number | null
  monto_hermano2?: number | null
  monto_semestral1?: number | null
  monto_semestral1_hermano1?: number | null
  monto_semestral1_hermano2?: number | null
  monto_semestral2?: number | null
  monto_semestral2_hermano1?: number | null
  monto_semestral2_hermano2?: number | null
}

interface Props {
  protagonistas: Protagonista[]
  campamentos: Campamento[]
  preseleccionadoId?: string
  today: string
  currentMonth: number
  currentYear: number
  cuota: CuotaConfig | null
  beneficiarioId?: string
}

function montoParaTipo(tipo: string, ordenHermano: number, cuota: CuotaConfig | null): number {
  if (!cuota) return 0
  const tier = ordenHermano <= 1 ? 'titular' : ordenHermano === 2 ? 'h1' : 'h2'

  if (tipo === 'mensual') {
    if (tier === 'titular') return Number(cuota.monto) || 0
    if (tier === 'h1') return Number(cuota.monto_hermano1) || 0
    return Number(cuota.monto_hermano2) || 0
  }
  if (tipo === 'semestral_1') {
    if (tier === 'titular') return Number(cuota.monto_semestral1) || 0
    if (tier === 'h1') return Number(cuota.monto_semestral1_hermano1) || 0
    return Number(cuota.monto_semestral1_hermano2) || 0
  }
  if (tipo === 'semestral_2') {
    if (tier === 'titular') return Number(cuota.monto_semestral2) || 0
    if (tier === 'h1') return Number(cuota.monto_semestral2_hermano1) || 0
    return Number(cuota.monto_semestral2_hermano2) || 0
  }
  return 0
}

const TIPOS_FORM = [
  { value: 'mensual',     label: 'Mensual' },
  { value: 'semestral_1', label: 'Semestral 1 (Abr–Jul)' },
  { value: 'semestral_2', label: 'Semestral 2 (Ago–Nov)' },
  { value: 'campamento',  label: 'Campamento' },
]

export function NuevoPagoForm({
  protagonistas,
  campamentos,
  preseleccionadoId,
  today,
  currentMonth,
  currentYear,
  cuota,
  beneficiarioId,
}: Props) {
  const [tipo, setTipo] = useState('mensual')
  const [selectedId, setSelectedId] = useState(preseleccionadoId || '')
  const [campamentoId, setCampamentoId] = useState(campamentos[0]?.id || '')
  const [editarMonto, setEditarMonto] = useState(false)
  const [montoManual, setMontoManual] = useState('')
  const [concepto, setConcepto] = useState('Cuota mensual')

  const esCampamento = tipo === 'campamento'
  const esSemestral = tipo === 'semestral_1' || tipo === 'semestral_2'

  const campamentoSeleccionado = useMemo(
    () => campamentos.find((c) => c.id === campamentoId) ?? null,
    [campamentos, campamentoId]
  )

  const campamentoPeriodoMes = useMemo(() => {
    if (!campamentoSeleccionado) return currentMonth
    return parseInt(campamentoSeleccionado.fecha_inicio.split('-')[1], 10)
  }, [campamentoSeleccionado, currentMonth])

  const campamentoPeriodoAnio = useMemo(() => {
    if (!campamentoSeleccionado) return currentYear
    return parseInt(campamentoSeleccionado.fecha_inicio.split('-')[0], 10)
  }, [campamentoSeleccionado, currentYear])

  // Protagonista seleccionado y su tier
  const protagonistaSeleccionado = protagonistas.find(p => p.id === selectedId) ?? null
  const ordenHermano = protagonistaSeleccionado?.orden_hermano ?? 1
  const tierLabel = ordenHermano <= 1 ? 'Titular' : ordenHermano === 2 ? 'Hermano 1' : 'Hermano 2+'
  const tierEmoji = ordenHermano <= 1 ? '🥇' : ordenHermano === 2 ? '🥈' : '🥉'

  const montoCalculado = useMemo(() => {
    if (esCampamento) return campamentoSeleccionado?.precio_estimado ?? 0
    return montoParaTipo(tipo, ordenHermano, cuota)
  }, [tipo, ordenHermano, cuota, esCampamento, campamentoSeleccionado])

  const tieneAutoMonto = montoCalculado > 0

  // Meses cubiertos para semestral
  const mesesCubiertosStr = useMemo(() => {
    if (esSemestral) {
      const sem = SEMESTRES[tipo as keyof typeof SEMESTRES]
      return sem.meses.map(m => `${currentYear}-${String(m).padStart(2, '0')}`).join(',')
    }
    return ''
  }, [tipo, esSemestral, currentYear])

  // Período para semestral
  const semPeriodoMes = esSemestral ? SEMESTRES[tipo as keyof typeof SEMESTRES].periodoMes : currentMonth
  const semPeriodoAnio = currentYear

  function handleTipoChange(v: string) {
    setTipo(v)
    setEditarMonto(false)
    setMontoManual('')
    const labels: Record<string, string> = {
      mensual: 'Cuota mensual',
      semestral_1: 'Cuota semestral 1 (Abr–Jul)',
      semestral_2: 'Cuota semestral 2 (Ago–Nov)',
    }
    setConcepto(labels[v] ?? 'Campamento')
  }

  function handleCampamentoChange(id: string) {
    setCampamentoId(id)
    setEditarMonto(false)
    setMontoManual('')
    const camp = campamentos.find(c => c.id === id)
    setConcepto(camp ? `Campamento ${camp.nombre}` : 'Campamento')
  }

  const montoValue = tieneAutoMonto && !editarMonto ? String(montoCalculado) : editarMonto ? montoManual : ''

  return (
    <form action={createPago} className="space-y-5">
      {/* Protagonista */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Protagonista <span className="text-brand-red">*</span>
        </label>
        <select
          name="beneficiario_id"
          required
          value={selectedId}
          onChange={(e) => { setSelectedId(e.target.value); setEditarMonto(false); setMontoManual('') }}
          className={`${inputCls} bg-white`}
        >
          <option value="" disabled>Seleccionar protagonista...</option>
          {protagonistas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellido}, {p.nombre} — {p.rama}
              {p.orden_hermano > 1 ? ` (H${p.orden_hermano})` : ''}
            </option>
          ))}
        </select>
        {selectedId && ordenHermano > 1 && (
          <p className="text-xs text-primary mt-1 font-medium">
            {tierEmoji} {tierLabel} — descuento de hermano aplicado automáticamente
          </p>
        )}
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tipo de Pago <span className="text-brand-red">*</span>
        </label>
        <select
          name="tipo"
          required
          value={tipo}
          onChange={(e) => handleTipoChange(e.target.value)}
          className={`${inputCls} bg-white`}
        >
          {TIPOS_FORM.filter(t => t.value !== 'campamento' || campamentos.length > 0).map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Campamento */}
      {esCampamento && campamentos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Campamento <span className="text-brand-red">*</span>
          </label>
          <select name="campamento_id" required value={campamentoId}
            onChange={(e) => handleCampamentoChange(e.target.value)}
            className={`${inputCls} bg-white`}>
            {campamentos.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}{c.precio_estimado ? ` — $${Number(c.precio_estimado).toLocaleString('es-AR')}` : ''}
              </option>
            ))}
          </select>
          {campamentoSeleccionado && (
            <p className="text-xs text-slate-400 mt-1">
              Inicio: {new Date(campamentoSeleccionado.fecha_inicio + 'T00:00:00').toLocaleDateString('es-AR')}
              {' · '}Período: {MESES[campamentoPeriodoMes - 1]} {campamentoPeriodoAnio}
            </p>
          )}
          <input type="hidden" name="periodo_mes" value={campamentoPeriodoMes} />
          <input type="hidden" name="periodo_anio" value={campamentoPeriodoAnio} />
        </div>
      )}

      {/* Período mensual */}
      {tipo === 'mensual' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mes <span className="text-brand-red">*</span>
            </label>
            <select name="periodo_mes" required
              defaultValue={MESES_SCOUT.includes(currentMonth) ? currentMonth : MESES_SCOUT[0]}
              className={`${inputCls} bg-white`}>
              {MESES_SCOUT.map(m => <option key={m} value={m}>{MESES[m - 1]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Año <span className="text-brand-red">*</span></label>
            <input name="periodo_anio" type="number" required defaultValue={currentYear} min={2000} max={2100} className={inputCls} />
          </div>
        </div>
      )}

      {/* Semestral — período fijo */}
      {esSemestral && (
        <>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
            {tipo === 'semestral_1'
              ? 'Cubre: Abril, Mayo, Junio, Julio — Vence 10 de Mayo'
              : 'Cubre: Agosto, Septiembre, Octubre, Noviembre — Vence 10 de Septiembre'}
          </div>
          <input type="hidden" name="periodo_mes" value={semPeriodoMes} />
          <input type="hidden" name="periodo_anio" value={semPeriodoAnio} />
          <input type="hidden" name="meses_cubiertos" value={mesesCubiertosStr} />
        </>
      )}

      {/* Monto */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700">
            Monto ($) <span className="text-brand-red">*</span>
          </label>
          {tieneAutoMonto && (
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
              <input type="checkbox" checked={editarMonto}
                onChange={e => { setEditarMonto(e.target.checked); if (e.target.checked) setMontoManual(String(montoCalculado)) }}
                className="w-3.5 h-3.5 accent-primary" />
              <MdEdit size={13} /> Editar monto
            </label>
          )}
        </div>
        <input
          name="monto" type="number" required step="0.01" min="0"
          readOnly={tieneAutoMonto && !editarMonto}
          value={tieneAutoMonto ? montoValue : undefined}
          onChange={tieneAutoMonto ? e => editarMonto && setMontoManual(e.target.value) : undefined}
          placeholder="0.00"
          className={`${inputCls} ${tieneAutoMonto && !editarMonto ? 'bg-slate-50 text-slate-600' : ''}`}
        />
        {tieneAutoMonto && !editarMonto && montoCalculado > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {tipo !== 'campamento' && `${tierEmoji} ${tierLabel}: `}
            ${montoCalculado.toLocaleString('es-AR')}
          </p>
        )}
      </div>

      {/* Método y Fecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Método de Pago <span className="text-brand-red">*</span>
          </label>
          <select name="metodo_pago" required className={`${inputCls} bg-white`}>
            {METODOS_PAGO.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Pago</label>
          <input name="fecha_pago" type="date" defaultValue={today} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
        <input name="concepto" value={concepto} onChange={e => setConcepto(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas (opcional)</label>
        <textarea name="notas" rows={2} className={`${inputCls} resize-none`} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit"
          className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium">
          Registrar y Ver Comprobante
        </button>
        <Link href={beneficiarioId ? `/protagonistas/${beneficiarioId}` : '/protagonistas'}
          className="flex-1 text-center border border-slate-200 text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-slate-800'
