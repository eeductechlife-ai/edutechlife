/**
 * Revisión humana de alertas de crisis.
 * Ninguna alerta de nivel alto llega al padre sin que el CEO la apruebe.
 * La alerta queda en crisis_alert_reviews; el CEO recibe un correo con dos
 * enlaces de un solo uso (aprobar / rechazar). Solo al aprobar se envía el
 * correo al padre.
 */

const crypto = require('crypto');
const supabase = require('../db/supabase');
const logger = require('../utils/logger');
const { sendEmail, sendCrisisAlert, logCrisisIncident } = require('./emailService');

const VIGENCIA_MS = 72 * 60 * 60 * 1000;
const BASE_URL = 'https://edutechlife.co';
const ACCIONES = { aprobar: 'approved', rechazar: 'rejected' };

const escapeHtml = (valor) =>
  String(valor ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

function construirCorreoCEO({ id, parentEmail, studentAge, detectedContent, crisisLevel, token }) {
  const enlace = (accion) =>
    `${BASE_URL}/api/crisis-reviews/decidir?token=${encodeURIComponent(token)}&accion=${accion}`;
  const subject = `[Revisión] Alerta de crisis IngenIA (${crisisLevel}) — ${id}`;
  const html = `
    <p>Se detectó una alerta de crisis en IngenIA. No se ha enviado nada al padre.</p>
    <p><strong>Edad del estudiante:</strong> ${escapeHtml(studentAge)}</p>
    <p><strong>Correo del padre:</strong> ${escapeHtml(parentEmail)}</p>
    <p><strong>Contenido detectado:</strong></p>
    <blockquote>${escapeHtml(detectedContent)}</blockquote>
    <p><a href="${enlace('aprobar')}">Aprobar y enviar al padre</a></p>
    <p><a href="${enlace('rechazar')}">Rechazar (no enviar)</a></p>
    <p>Los enlaces son de un solo uso y vencen en 72 horas.</p>
  `;
  const text = [
    'Se detectó una alerta de crisis en IngenIA. No se ha enviado nada al padre.',
    `Edad del estudiante: ${studentAge}`,
    `Correo del padre: ${parentEmail}`,
    `Contenido detectado: ${detectedContent}`,
    `Aprobar y enviar: ${enlace('aprobar')}`,
    `Rechazar: ${enlace('rechazar')}`,
  ].join('\n');
  return { subject, html, text };
}

/**
 * Retiene una alerta de nivel alto y pide la aprobación del CEO.
 * Si CEO_REVIEW_EMAIL no está configurado, la alerta queda retenida sin enviarse.
 */
async function retenerAlertaCrisis({ studentId, parentEmail, studentAge, detectedContent, crisisLevel }) {
  const token = crypto.randomBytes(32).toString('hex');
  const { data, error } = await supabase
    .from('crisis_alert_reviews')
    .insert([{
      student_id: studentId,
      parent_email: parentEmail,
      student_age: studentAge,
      detected_content: detectedContent,
      crisis_level: crisisLevel,
      token_hash: hashToken(token),
      status: 'pending',
      expires_at: new Date(Date.now() + VIGENCIA_MS).toISOString(),
    }])
    .select('id')
    .single();

  if (error) {
    logger.error('[CrisisReview] No se pudo retener la alerta', { error: error.message });
    return { success: false, error: error.message };
  }

  const ceo = process.env.CEO_REVIEW_EMAIL;
  if (!ceo) {
    logger.error('[CrisisReview] CEO_REVIEW_EMAIL no configurado: alerta retenida sin aviso al CEO', { id: data.id });
    return { success: true, id: data.id, notificadoCEO: false };
  }

  const correo = construirCorreoCEO({ id: data.id, parentEmail, studentAge, detectedContent, crisisLevel, token });
  const envio = await sendEmail(ceo, correo.subject, correo.html, correo.text);
  if (!envio.success) {
    logger.error('[CrisisReview] Falló el correo al CEO', { id: data.id });
  }
  return { success: true, id: data.id, notificadoCEO: Boolean(envio.success) };
}

/**
 * Aplica la decisión del CEO. Usa una actualización condicionada a status='pending'
 * para que un enlace solo se pueda usar una vez.
 * @returns {Promise<{ok: boolean, motivo?: string, estado?: string}>}
 */
async function decidirAlertaCrisis(token, accion) {
  const nuevoEstado = ACCIONES[accion];
  if (!token || !nuevoEstado) return { ok: false, motivo: 'invalido' };

  const { data: revision } = await supabase
    .from('crisis_alert_reviews')
    .select('*')
    .eq('token_hash', hashToken(token))
    .maybeSingle();

  if (!revision) return { ok: false, motivo: 'no_encontrada' };
  if (revision.status !== 'pending') return { ok: false, motivo: 'ya_decidida' };
  if (new Date(revision.expires_at) < new Date()) return { ok: false, motivo: 'vencida' };

  const { data: reclamada, error } = await supabase
    .from('crisis_alert_reviews')
    .update({ status: nuevoEstado, decided_at: new Date().toISOString() })
    .eq('id', revision.id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle();

  if (error || !reclamada) return { ok: false, motivo: 'ya_decidida' };

  if (nuevoEstado === 'rejected') return { ok: true, estado: nuevoEstado };

  const envio = await sendCrisisAlert(
    revision.parent_email,
    'Estudiante',
    revision.student_age,
    revision.detected_content,
    revision.crisis_level,
  );
  await logCrisisIncident(
    supabase,
    revision.student_id,
    revision.student_age,
    revision.detected_content,
    revision.crisis_level,
    revision.parent_email,
  );
  if (!envio.success) {
    return { ok: false, motivo: 'envio_fallido', estado: nuevoEstado };
  }
  return { ok: true, estado: nuevoEstado };
}

module.exports = { retenerAlertaCrisis, decidirAlertaCrisis, construirCorreoCEO, hashToken };
