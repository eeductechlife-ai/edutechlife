/**
 * Avisos push del padre o acudiente en su celular (IngenIA).
 *
 * GET  /api/notifications/push/public-key  Público. Devuelve VAPID_PUBLIC_KEY.
 * POST /api/notifications/push/subscribe   Padre autenticado con un hijo
 *                                          vinculado. Guarda la suscripción.
 *
 * Se monta antes de /api/notifications (que exige sesión para todo).
 */

const { Router } = require('express');
const supabase = require('../db/supabase');
const { requireAuth } = require('../middleware/auth');
const { configuracionVapid, TABLA } = require('../services/webPush');
const logger = require('../utils/logger');

const router = Router();

const RE_P256DH = /^[A-Za-z0-9_-]{20,200}$/;
const RE_AUTH = /^[A-Za-z0-9_-]{10,100}$/;
const MAX_ENDPOINT = 2048;

/** Valida la suscripción del navegador. Devuelve la versión limpia o null. */
function validarSuscripcion(entrada) {
  const endpoint = entrada?.endpoint;
  const p256dh = entrada?.keys?.p256dh;
  const auth = entrada?.keys?.auth;
  if (typeof endpoint !== 'string' || endpoint.length > MAX_ENDPOINT) return null;
  if (typeof p256dh !== 'string' || !RE_P256DH.test(p256dh)) return null;
  if (typeof auth !== 'string' || !RE_AUTH.test(auth)) return null;
  try {
    if (new URL(endpoint).protocol !== 'https:') return null;
  } catch {
    return null;
  }
  return { endpoint, keys: { p256dh, auth } };
}

async function esPadreConHijoActivo(userId) {
  const { data, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('parent_user_id', userId)
    .eq('is_active', true)
    .limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

/**
 * GET /api/notifications/push/public-key
 * @swagger
 * /api/notifications/push/public-key:
 *   get:
 *     summary: Clave pública VAPID para suscribirse a avisos push
 *     tags: [Notifications]
 *     responses:
 *       200: { description: Clave pública }
 *       503: { description: Push no configurado en el servidor }
 */
router.get('/public-key', (req, res) => {
  const cfg = configuracionVapid();
  if (!cfg) {
    return res.status(503).json({ error: 'Los avisos push no están configurados en el servidor.' });
  }
  res.json({ publicKey: cfg.publicKey });
});

/**
 * POST /api/notifications/push/subscribe
 * Body: { subscription: { endpoint, keys: { p256dh, auth } } }
 * Repetir la misma suscripción no crea duplicados (clave user_id + endpoint).
 */
router.post('/subscribe', requireAuth, async (req, res) => {
  try {
    const suscripcion = validarSuscripcion(req.body?.subscription);
    if (!suscripcion) {
      return res.status(400).json({ error: 'Suscripción push inválida.' });
    }

    if (!(await esPadreConHijoActivo(req.userId))) {
      return res.status(403).json({ error: 'Solo los padres con un hijo vinculado pueden activar estos avisos.' });
    }

    const { error } = await supabase.from(TABLA).upsert(
      {
        user_id: req.userId,
        subscription: suscripcion,
        user_agent: String(req.headers['user-agent'] || '').slice(0, 255),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,endpoint' },
    );
    if (error) throw error;

    res.status(200).json({ ok: true });
  } catch (e) {
    logger.error('[push-padre] no se pudo guardar la suscripción', { error: e.message });
    res.status(500).json({ error: 'No se pudo guardar la suscripción. Intenta de nuevo.' });
  }
});

module.exports = router;
