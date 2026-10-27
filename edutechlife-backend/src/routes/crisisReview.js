/**
 * Enlaces del correo al CEO para aprobar o rechazar una alerta de crisis.
 * No requiere sesión: la autorización es el token de un solo uso del correo.
 * El GET solo muestra una confirmación (no cambia nada) para que los
 * escáneres de correo no decidan por el CEO. El POST aplica la decisión.
 */

const express = require('express');
const { decidirAlertaCrisis } = require('../services/crisisReviewService');
const logger = require('../utils/logger');

const router = express.Router();
const formulario = express.urlencoded({ extended: false, limit: '4kb' });

const escapeHtml = (valor) =>
  String(valor ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

const pagina = (cuerpo) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Revisión de alerta — IngenIA</title>
<style>body{font-family:system-ui,sans-serif;max-width:480px;margin:48px auto;padding:0 16px;color:#072F46}
button{font-size:16px;padding:12px 18px;border-radius:8px;border:0;cursor:pointer;margin-right:8px}
.aprobar{background:#199DB9;color:#fff}.rechazar{background:#eee;color:#072F46}</style></head>
<body>${cuerpo}</body></html>`;

const MENSAJES = {
  invalido: 'El enlace no es válido.',
  no_encontrada: 'No encontramos esta revisión.',
  ya_decidida: 'Esta alerta ya fue decidida. El enlace solo se usa una vez.',
  vencida: 'Este enlace venció. Revisa la alerta desde el panel.',
  envio_fallido: 'Se aprobó la alerta, pero el correo al padre no se pudo enviar. Revisa los registros.',
};

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('X-Robots-Tag', 'noindex');
  next();
});

router.get('/decidir', (req, res) => {
  const token = String(req.query.token || '');
  const accion = String(req.query.accion || '');
  if (!/^[a-f0-9]{64}$/.test(token) || !['aprobar', 'rechazar'].includes(accion)) {
    return res.status(400).type('html').send(pagina(`<p>${MENSAJES.invalido}</p>`));
  }
  const etiqueta = accion === 'aprobar' ? 'Aprobar y enviar al padre' : 'Rechazar (no enviar)';
  return res.type('html').send(pagina(`
    <h1>Revisión de alerta</h1>
    <p>Confirma tu decisión. Solo al aprobar se envía el correo al padre.</p>
    <form method="post" action="/api/crisis-reviews/decidir">
      <input type="hidden" name="token" value="${escapeHtml(token)}">
      <input type="hidden" name="accion" value="${escapeHtml(accion)}">
      <button class="${accion === 'aprobar' ? 'aprobar' : 'rechazar'}" type="submit">${escapeHtml(etiqueta)}</button>
    </form>`));
});

router.post('/decidir', formulario, async (req, res) => {
  const token = String(req.body?.token || '');
  const accion = String(req.body?.accion || '');
  try {
    const resultado = await decidirAlertaCrisis(token, accion);
    if (resultado.ok) {
      const texto = resultado.estado === 'approved'
        ? 'Alerta aprobada. El correo al padre se envió.'
        : 'Alerta rechazada. No se envió nada al padre.';
      return res.type('html').send(pagina(`<h1>Listo</h1><p>${texto}</p>`));
    }
    return res.status(resultado.motivo === 'envio_fallido' ? 502 : 409)
      .type('html')
      .send(pagina(`<p>${MENSAJES[resultado.motivo] || MENSAJES.invalido}</p>`));
  } catch (e) {
    logger.error('[CrisisReview] Error al decidir', { error: e.message });
    return res.status(500).type('html').send(pagina('<p>No se pudo registrar la decisión. Intenta de nuevo.</p>'));
  }
});

module.exports = router;
