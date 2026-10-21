const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { whatsappCodigoLimiter } = require('../../middleware/rateLimiter');
const logger = require('../../utils/logger');
const prefs = require('../../services/whatsappPadresPrefs');

const router = Router();

function responderError(res, e, mensajePorDefecto) {
  if (e instanceof prefs.ErrorPreferencias) {
    return res.status(e.status).json({ error: e.message, motivo: e.motivo });
  }
  logger.error('[whatsapp-prefs] error inesperado', { error: e.message });
  return res.status(500).json({ error: mensajePorDefecto });
}

/** Estado actual: si los avisos están disponibles y qué tiene configurado el padre. */
router.get('/padre/whatsapp', requireAuth, async (req, res) => {
  try {
    res.json(await prefs.obtenerPreferencias(req.userId));
  } catch (e) {
    responderError(res, e, 'No se pudo cargar la configuración');
  }
});

/** Paso 1: acepta y da su número; se le envía un código por WhatsApp. */
router.post('/padre/whatsapp/codigo', requireAuth, whatsappCodigoLimiter, async (req, res) => {
  try {
    const { telefono, acepta, version } = req.body || {};
    res.status(201).json(await prefs.solicitarCodigo(req.userId, { telefono, acepta, version }));
  } catch (e) {
    responderError(res, e, 'No se pudo enviar el código');
  }
});

/** Paso 2: escribe el código; si es correcto, los avisos quedan activos. */
router.post('/padre/whatsapp/confirmar', requireAuth, async (req, res) => {
  try {
    const { codigo } = req.body || {};
    res.json({ preferencias: await prefs.confirmarCodigo(req.userId, { codigo }) });
  } catch (e) {
    responderError(res, e, 'No se pudo confirmar el código');
  }
});

/** Cambia qué avisos recibe. */
router.put('/padre/whatsapp', requireAuth, async (req, res) => {
  try {
    const { avisoConexion, informeSemanal } = req.body || {};
    res.json({ preferencias: await prefs.cambiarAvisos(req.userId, { avisoConexion, informeSemanal }) });
  } catch (e) {
    responderError(res, e, 'No se pudo guardar la configuración');
  }
});

/** Darse de baja. */
router.delete('/padre/whatsapp', requireAuth, async (req, res) => {
  try {
    res.json({ preferencias: await prefs.darDeBaja(req.userId) });
  } catch (e) {
    responderError(res, e, 'No se pudo dar de baja');
  }
});

module.exports = router;
