import Link from 'next/link'
import { MdArrowBack, MdAdd, MdSwapHoriz, MdCheck, MdPriorityHigh, MdChevronRight, MdAccessTime, MdWarning } from 'react-icons/md'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { getBeneficiario, getPagosByBeneficiario, getHistorialRama, getCuotasPendientesByBeneficiario, getEstadoCuenta, getInscripcionesByBeneficiario, getDocumentosByProtagonista } from '@/lib/data'
import { EstadoCuentaView } from '@/components/EstadoCuenta'
import { deleteBeneficiario, desInscribirCampamento, enviarEmailCuotaVencida } from '@/lib/actions'
import { DocumentosSection } from '@/components/DocumentosSection'
import {
  RAMA_COLORS, ESTADO_PAGO_STYLES, MESES, MESES_SCOUT,
  calcularEstadoPago, type Rama, type EstadoPago,
} from '@/lib/types'
import { DeleteButton } from '@/components/DeleteButton'

const RAMA_CHIP: Partial<Record<Rama, { bg: string; fg: string; dot: string; grad: string }>> = {
  'Lobatos y Lobeznas': { bg: '#fef3c7', fg: '#92400e', dot: '#f59e0b', grad: 'linear-gradient(135deg, #fef3c7, #fed7aa)' },
  Scouts:               { bg: '#dcfce7', fg: '#166534', dot: '#22c55e', grad: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  Caminantes:           { bg: '#dbeafe', fg: '#1e40af', dot: '#2085EE', grad: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  Rovers:               { bg: '#fee4e2', fg: '#991b1b', dot: '#ED1C1C', grad: 'linear-gradient(135deg, #fee4e2, #fecaca)' },
}

const ESTADO_DOT: Record<EstadoPago, { c: string; bg: string; label: string }> = {
  al_dia:     { c: '#0f7a3d', bg: '#c8ecd4', label: 'Al día' },
  adeuda:     { c: '#ba1a1a', bg: '#ffdad6', label: 'Adeuda' },
  adelantado: { c: '#2085EE', bg: '#dbeafe', label: 'Adelantado' },
}

export default async function ProtagonistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [protagonista, pagos, historialRama, cuotasPendientes, estadoCuenta, inscripciones, documentos] = await Promise.all([
    getBeneficiario(id),
    getPagosByBeneficiario(id),
    getHistorialRama(id),
    getCuotasPendientesByBeneficiario(id),
    getEstadoCuenta(id),
    getInscripcionesByBeneficiario(id),
    getDocumentosByProtagonista(id),
  ])

  const deleteWithId = deleteBeneficiario.bind(null, id)
  const totalPagado = pagos.reduce((sum, p) => sum + Number(p.monto), 0)

  const now = new Date()
  const anioActual = now.getFullYear()
  const mesActual = now.getMonth() + 1
  const estado: EstadoPago = protagonista.activo
    ? calcularEstadoPago(pagos as never, anioActual, mesActual)
    : 'al_dia'

  const fechaIngreso = new Date(protagonista.fecha_ingreso + 'T00:00:00').toLocaleDateString(
    'es-AR', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  const mesesPagados = new Set<number>()
  for (const pago of pagos) {
    if (pago.meses_cubiertos && pago.meses_cubiertos.length > 0) {
      for (const mc of pago.meses_cubiertos) {
        const [a, m] = mc.split('-').map(Number)
        if (a === anioActual) mesesPagados.add(m)
      }
    } else if (pago.periodo_anio === anioActual) {
      mesesPagados.add(pago.periodo_mes)
    }
  }

  const chip = RAMA_CHIP[protagonista.rama as Rama] ?? { bg: '#e7eeff', fg: '#004787', dot: '#2085EE', grad: 'linear-gradient(135deg, #e7eeff, #dbeafe)' }
  const dot = protagonista.activo ? ESTADO_DOT[estado] : null
  const initials = `${protagonista.nombre[0]}${protagonista.apellido[0]}`

  const pendientes = cuotasPendientes.filter(cp => cp.estado !== 'pagado')
  const edad = protagonista.fecha_nacimiento
    ? Math.floor((Date.now() - new Date(protagonista.fecha_nacimiento + 'T00:00:00').getTime()) / 31557600000)
    : null

  return (
    <div>
      {/* Back link */}
      <Link href="/protagonistas" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#717784', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
        <MdArrowBack size={16} /> Volver a Protagonistas
      </Link>

      {/* Hero card */}
      <div style={{ background: chip.grad, borderRadius: 20, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'rgba(255,255,255,0.7)', color: chip.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26, flexShrink: 0, fontFamily: 'var(--font-manrope), Manrope, sans-serif' }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: chip.bg, color: chip.fg, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: chip.dot }} />
              {protagonista.rama}
            </span>
            {dot && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: dot.bg, color: dot.c, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                {dot.label}
              </span>
            )}
            {!protagonista.activo && (
              <span style={{ background: '#f0f3ff', color: '#717784', padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Inactivo</span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#111c2d', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
            {protagonista.apellido}, {protagonista.nombre}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#414753' }}>
            {protagonista.dni && <span>DNI {protagonista.dni}</span>}
            {edad !== null && <span>{edad} años</span>}
            <span>Ingreso {fechaIngreso}</span>
            <span style={{ fontWeight: 700, color: '#2085EE' }}>${totalPagado.toLocaleString('es-AR')} pagado</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href={`/protagonistas/${id}/paso-de-rama`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.7)', color: '#414753', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            <MdSwapHoriz size={16} /> Paso de Rama
          </Link>
          <Link href={`/protagonistas/${id}/editar`} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.7)', color: '#414753', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Editar
          </Link>
          <Link href={`/pagos/nuevo?beneficiario=${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #2085EE 0%, #1468c9 100%)', color: '#fff', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(32,133,238,0.25)' }}>
            <MdAdd size={16} /> Registrar Pago
          </Link>
        </div>
      </div>

      {/* Body grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 20, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Info personal */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 16px' }}>Información</p>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoItem label="DNI" value={protagonista.dni || '—'} />
              {protagonista.fecha_nacimiento && (
                <InfoItem label="Fecha de nacimiento" value={new Date(protagonista.fecha_nacimiento + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} />
              )}
              {protagonista.direccion && <InfoItem label="Dirección" value={protagonista.direccion} />}
              {protagonista.barrio && <InfoItem label="Barrio" value={protagonista.barrio} />}
              <InfoItem label="Email" value={protagonista.email || '—'} />
              <InfoItem label="Teléfono" value={protagonista.telefono || '—'} />
              {protagonista.mail_contacto && <InfoItem label="Mail contacto" value={protagonista.mail_contacto} />}
              {protagonista.telefono_contacto && <InfoItem label="Tel. contacto" value={protagonista.telefono_contacto} />}
              <InfoItem label="Tipo cuota" value={protagonista.tipo_cuota === 'trimestral' ? 'Trimestral' : 'Mensual'} />
              <InfoItem label="Ingreso" value={fechaIngreso} />
            </dl>
          </section>

          {/* Cuotas año actual */}
          {protagonista.activo && (
            <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 14px' }}>Cuotas {anioActual}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {MESES_SCOUT.map((mes) => {
                  const pagado = mesesPagados.has(mes)
                  const transcurrido = mes <= mesActual
                  const esFuturo = mes > mesActual
                  return (
                    <div key={mes} style={{
                      padding: '7px 6px', borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                      background: pagado ? '#dcfce7' : transcurrido ? '#fef3c7' : '#f0f3ff',
                      color: pagado ? '#166534' : transcurrido ? '#92400e' : '#717784',
                    }}>
                      {MESES[mes - 1].slice(0, 3)}
                      {pagado
                        ? <MdCheck size={11} />
                        : esFuturo
                        ? <span style={{ fontSize: 10 }}>·</span>
                        : <MdPriorityHigh size={11} />
                      }
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Cuotas pendientes */}
          {pendientes.length > 0 && (
            <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 12px' }}>Cuotas Pendientes</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendientes.map((cp) => {
                  const vencida = cp.estado === 'vencido'
                  const vto = new Date(cp.fecha_vencimiento + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  const wspHref = vencida ? buildWhatsappLink(protagonista, cp, vto) : null
                  return (
                    <div key={cp.id} style={{
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 10, fontSize: 12,
                      background: vencida ? '#fff0f0' : '#fffbf0',
                      border: `1px solid ${vencida ? '#ffd6d6' : '#fdeecf'}`,
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: vencida ? '#ba1a1a' : '#92400e' }}>
                          {cp.tipo === 'trimestral' ? 'Trimestral' : 'Mensual'}{' · '}
                          {cp.meses_cubiertos.map((m: string) => MESES[parseInt(m.split('-')[1]) - 1].slice(0, 3)).join(' - ')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: vencida ? '#ba1a1a' : '#92400e' }}>
                          {vencida ? <MdWarning size={11} /> : <MdAccessTime size={11} />}
                          Vence {vto}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: vencida ? '#ba1a1a' : '#92400e' }}>
                          ${Number(cp.monto).toLocaleString('es-AR')}
                        </span>
                        {wspHref && (
                          <a href={wspHref} target="_blank" rel="noopener noreferrer" title="Notificar por WhatsApp" style={{ color: '#16a34a', display: 'flex' }}>
                            <FaWhatsapp size={16} />
                          </a>
                        )}
                        {vencida && (protagonista.mail_contacto || protagonista.email) && (
                          <form action={enviarEmailCuotaVencida.bind(null, cp.id, id)}>
                            <button type="submit" title="Notificar por email" style={{ background: 'none', border: 'none', color: '#2085EE', cursor: 'pointer', display: 'flex', padding: 0 }}>
                              <FaEnvelope size={15} />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Campamentos inscritos */}
          {inscripciones.length > 0 && (
            <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 12px' }}>Campamentos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {inscripciones.map((insc) => {
                  const camp = insc.campamentos as unknown as { id: string; nombre: string; activo: boolean }
                  const desinscribir = desInscribirCampamento.bind(null, insc.id, id, camp.id)
                  return (
                    <div key={insc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f0f3ff', borderRadius: 10 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111c2d', margin: 0 }}>{camp.nombre}</p>
                        <p style={{ fontSize: 11.5, color: '#717784', margin: '2px 0 0' }}>
                          ${Number(insc.monto).toLocaleString('es-AR')}
                          {!camp.activo && <span style={{ color: '#c0c6d5', marginLeft: 4 }}>(inactivo)</span>}
                        </p>
                      </div>
                      <form action={desinscribir}>
                        <button type="submit" style={{ background: 'none', border: 'none', color: '#ba1a1a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          Desinscribir
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Eliminar */}
          <section style={{ background: '#ffdad6', borderRadius: 20, padding: 24 }}>
            <DeleteButton action={deleteWithId} />
          </section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Historial de pagos */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: 0 }}>Historial de Pagos</p>
              <Link href={`/pagos/nuevo?beneficiario=${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2085EE', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                <MdAdd size={16} /> Nuevo pago
              </Link>
            </div>
            {pagos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ color: '#717784', fontSize: 14, marginBottom: 12 }}>No hay pagos registrados</p>
                <Link href={`/pagos/nuevo?beneficiario=${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2085EE', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
                  Registrar primer pago <MdChevronRight size={16} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pagos.map((pago, i) => (
                  <div key={pago.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 10,
                    background: i % 2 === 0 ? '#f9f9ff' : 'transparent',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111c2d', fontSize: 13 }}>
                        {pago.meses_cubiertos && pago.meses_cubiertos.length > 1
                          ? `Trimestral: ${pago.meses_cubiertos.map((mc: string) => MESES[parseInt(mc.split('-')[1]) - 1].slice(0,3)).join(' · ')}`
                          : `${MESES[pago.periodo_mes - 1]} ${pago.periodo_anio}`
                        }
                      </div>
                      <div style={{ fontSize: 11.5, color: '#717784', marginTop: 2 }}>
                        {pago.concepto} · {pago.metodo_pago} · Comp. #{String(pago.numero_comprobante).padStart(6, '0')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif', fontWeight: 700, color: '#2085EE', fontSize: 14 }}>
                        ${Number(pago.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                      <Link href={`/pagos/${pago.id}/comprobante`} style={{ fontSize: 12, color: '#2085EE', textDecoration: 'none', fontWeight: 600 }}>
                        Ver comp.
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Estado de Cuenta */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: '0 0 16px' }}>Estado de Cuenta</p>
            <EstadoCuentaView estado={estadoCuenta} />
          </section>

          {/* Historial de Rama */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#717784', margin: 0 }}>Historial de Rama</p>
              <Link href={`/protagonistas/${id}/paso-de-rama`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2085EE', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                <MdAdd size={16} /> Paso de rama
              </Link>
            </div>
            {historialRama.length === 0 ? (
              <p style={{ color: '#717784', fontSize: 13, textAlign: 'center', padding: '16px 0', margin: 0 }}>Sin cambios de rama registrados</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {historialRama.map((h) => {
                  const ramaAntChip = RAMA_CHIP[h.rama_anterior as Rama] ?? { bg: '#f0f3ff', fg: '#717784', dot: '#c0c6d5' }
                  const ramaNuevaChip = RAMA_CHIP[h.rama_nueva as Rama] ?? { bg: '#f0f3ff', fg: '#717784', dot: '#c0c6d5' }
                  return (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 12px', background: '#f0f3ff', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: ramaAntChip.bg, color: ramaAntChip.fg, padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700 }}>
                          {h.rama_anterior}
                        </span>
                        <MdChevronRight size={14} style={{ color: '#c0c6d5' }} />
                        <span style={{ background: ramaNuevaChip.bg, color: ramaNuevaChip.fg, padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700 }}>
                          {h.rama_nueva}
                        </span>
                        {h.notas && <span style={{ fontSize: 11.5, color: '#717784' }}>{h.notas}</span>}
                      </div>
                      <span style={{ fontSize: 11.5, color: '#717784', whiteSpace: 'nowrap', marginLeft: 8 }}>
                        {new Date(h.fecha).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Documentación */}
          <DocumentosSection protagonistaId={id} documentos={documentos} />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#717784' }}>{label}</dt>
      <dd style={{ fontSize: 13.5, color: '#111c2d', marginTop: 2 }}>{value}</dd>
    </div>
  )
}

function buildWhatsappLink(
  protagonista: { nombre: string; apellido: string; telefono?: string; telefono_contacto?: string },
  cp: { tipo: string; meses_cubiertos: string[]; monto: number },
  vto: string,
) {
  const rawPhone = protagonista.telefono_contacto || protagonista.telefono
  if (!rawPhone) return null

  const digits = rawPhone.replace(/\D/g, '')
  const phone = digits.startsWith('54') ? digits : `54${digits.replace(/^0/, '')}`

  const meses = cp.meses_cubiertos
    .map((m: string) => MESES[parseInt(m.split('-')[1]) - 1])
    .join(', ')

  const mensaje =
    `Hola! Te contactamos del *Grupo Scout 565*. ` +
    `Queremos avisarte que ${protagonista.nombre} ${protagonista.apellido} tiene una cuota *vencida*: ` +
    `cuota ${cp.tipo} (${meses}) por *$${Number(cp.monto).toLocaleString('es-AR')}*, ` +
    `con fecha de vencimiento ${vto}. ` +
    `Por favor regularizá la situación a la brevedad. ¡Gracias!`

  return `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`
}
