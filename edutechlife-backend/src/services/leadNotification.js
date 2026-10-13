/**
 * Aviso por correo de un lead nuevo al equipo de Edutechlife.
 *
 * Archivo aparte de emailTemplates.js a propósito. Usa el envío de
 * emailService (Resend). Destinatarios: LEADS_NOTIFY_EMAIL (uno o varios,
 * separados por coma).
 */

const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');

const escapar = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const CAMPOS = [
  ['Nombre', 'nombre'],
  ['Correo', 'email'],
  ['Teléfono / WhatsApp', 'telefono'],
  ['Ciudad', 'ciudad'],
  ['Perfil', 'perfil'],
  ['Producto de interés', 'producto_interes'],
  ['Mensaje', 'mensaje'],
  ['Formulario', 'fuente'],
  ['Página', 'pagina'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['Referrer', 'referrer'],
];

function construirAvisoLead(lead) {
  const valores = new Map(Object.entries(lead));
  const presentes = CAMPOS.filter(([, k]) => valores.get(k)).map(([label, k]) => [label, valores.get(k)]);
  const filas = presentes
    .map(
      ([label, valor]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6B7280">${label}</td>` +
        `<td style="padding:4px 0;color:#004B63">${escapar(valor)}</td></tr>`
    )
    .join('');
  const consentimiento = `Autorizó el tratamiento de sus datos (Ley 1581 de 2012) el ${lead.autorizacion_fecha}.`;
  return {
    // Sin datos personales: emailService escribe el asunto en los logs.
    subject: `Nuevo lead (${lead.perfil}) desde ${lead.fuente}`,
    html:
      '<div style="font-family:Arial,sans-serif;font-size:14px">' +
      '<h2 style="color:#004B63">Nuevo lead en edutechlife.co</h2>' +
      '<p>Respóndele pronto: los primeros minutos cuentan.</p>' +
      `<table>${filas}</table>` +
      `<p style="color:#6B7280;font-size:12px">${escapar(consentimiento)}</p></div>`,
    text: `Nuevo lead en edutechlife.co\n\n${presentes
      .map(([label, valor]) => `${label}: ${valor}`)
      .join('\n')}\n\n${consentimiento}`,
  };
}

async function notifyNewLead(lead) {
  const to = (process.env.LEADS_NOTIFY_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) {
    logger.warn('[leads] LEADS_NOTIFY_EMAIL no está configurado: no se envió el aviso');
    return { success: false, skipped: 'sin_destinatario' };
  }
  // Sin Resend, emailService imprime el HTML completo en consola, y con los
  // datos personales del lead eso no puede quedar en los logs de Render.
  if (!process.env.RESEND_API_KEY) {
    logger.warn('[leads] RESEND_API_KEY no está configurado: no se envió el aviso');
    return { success: false, skipped: 'sin_resend' };
  }
  const { subject, html, text } = construirAvisoLead(lead);
  const result = await sendEmail(to, subject, html, text);
  if (!result.success) logger.error('[leads] no se pudo enviar el aviso', { error: result.error });
  return result;
}

module.exports = { notifyNewLead, construirAvisoLead };
