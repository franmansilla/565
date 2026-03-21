import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'onboarding@resend.dev'
const NOMBRE_GRUPO = 'Grupo Scout 565'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface DatosCuota {
  tipo: string
  meses_cubiertos: string[]
  monto: number
  fecha_vencimiento: string
}

interface DatosProtagonista {
  nombre: string
  apellido: string
  email?: string | null
  mail_contacto?: string | null
}

function resolverEmail(protagonista: DatosProtagonista): string | null {
  return protagonista.mail_contacto || protagonista.email || null
}

function formatearMeses(meses_cubiertos: string[]): string {
  return meses_cubiertos
    .map((m) => MESES[parseInt(m.split('-')[1]) - 1])
    .join(', ')
}

function formatearFecha(fecha: string): string {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function formatearMonto(monto: number): string {
  return `$${monto.toLocaleString('es-AR')}`
}

export async function enviarAvisoCuota(
  protagonista: DatosProtagonista,
  cuota: DatosCuota,
): Promise<boolean> {
  const email = resolverEmail(protagonista)
  if (!email) return false

  const meses = formatearMeses(cuota.meses_cubiertos)
  const tipo = cuota.tipo === 'trimestral' ? 'trimestral' : 'mensual'
  const vto = formatearFecha(cuota.fecha_vencimiento)
  const monto = formatearMonto(cuota.monto)
  const nombre = `${protagonista.nombre} ${protagonista.apellido}`

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Recordatorio de cuota - ${nombre} - ${NOMBRE_GRUPO}`,
    html: `
      <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e40af;">Recordatorio de cuota — ${NOMBRE_GRUPO}</h2>
        <p>Hola,</p>
        <p>Te recordamos que <strong>${nombre}</strong> tiene una cuota pendiente de pago:</p>
        <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
          <tr style="background:#f1f5f9;">
            <td style="padding:8px 12px; font-weight:600;">Tipo</td>
            <td style="padding:8px 12px; text-transform:capitalize;">${tipo}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; font-weight:600;">Meses</td>
            <td style="padding:8px 12px;">${meses}</td>
          </tr>
          <tr style="background:#f1f5f9;">
            <td style="padding:8px 12px; font-weight:600;">Monto</td>
            <td style="padding:8px 12px;">${monto}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; font-weight:600;">Vencimiento</td>
            <td style="padding:8px 12px;">${vto}</td>
          </tr>
        </table>
        <p>Por favor regularizá el pago antes de la fecha de vencimiento.</p>
        <p>Saludos,<br/><strong>${NOMBRE_GRUPO}</strong></p>
      </div>
    `,
  })

  return !error
}

export async function enviarVencimientoCuota(
  protagonista: DatosProtagonista,
  cuota: DatosCuota,
): Promise<boolean> {
  const email = resolverEmail(protagonista)
  if (!email) return false

  const meses = formatearMeses(cuota.meses_cubiertos)
  const tipo = cuota.tipo === 'trimestral' ? 'trimestral' : 'mensual'
  const vto = formatearFecha(cuota.fecha_vencimiento)
  const monto = formatearMonto(cuota.monto)
  const nombre = `${protagonista.nombre} ${protagonista.apellido}`

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `⚠️ Cuota vencida - ${nombre} - ${NOMBRE_GRUPO}`,
    html: `
      <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #dc2626;">Cuota vencida — ${NOMBRE_GRUPO}</h2>
        <p>Hola,</p>
        <p>Te informamos que <strong>${nombre}</strong> tiene una cuota <strong style="color:#dc2626;">vencida</strong>:</p>
        <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
          <tr style="background:#fef2f2;">
            <td style="padding:8px 12px; font-weight:600;">Tipo</td>
            <td style="padding:8px 12px; text-transform:capitalize;">${tipo}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; font-weight:600;">Meses</td>
            <td style="padding:8px 12px;">${meses}</td>
          </tr>
          <tr style="background:#fef2f2;">
            <td style="padding:8px 12px; font-weight:600;">Monto</td>
            <td style="padding:8px 12px;">${monto}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; font-weight:600;">Venció el</td>
            <td style="padding:8px 12px; color:#dc2626; font-weight:600;">${vto}</td>
          </tr>
        </table>
        <p>Por favor regularizá la situación a la brevedad.</p>
        <p>Saludos,<br/><strong>${NOMBRE_GRUPO}</strong></p>
      </div>
    `,
  })

  return !error
}
