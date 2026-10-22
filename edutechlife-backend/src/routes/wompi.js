const { Router } = require('express');
const logger = require('../utils/logger');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const { cobroLinkLimiter } = require('../middleware/rateLimiter');
const {
  getWompiConfig,
  createWompiCheckout,
  planDisponible,
  verifyEventChecksum,
  getActivationFromEvent,
} = require('../services/wompi');
const { activatePaidPeriod } = require('../services/paidPlans');
const { getPlanById } = require('../data/plans');
const { findAuthUserByEmail } = require('./auth/helpers');
const { sendEmail } = require('../services/emailService');
const { buildCobroEmail } = require('../services/wompiCobroEmail');

const router = Router();

// Planes de pago en COP que el admin puede mandar para cobrar después de la
// valoración gratuita (ids del catálogo en src/data/plans.js).
const PLANES_LINK_COBRO = ['smartboard_premium', 'ingenia_fundador', 'ingenia_acompanamiento', 'ingenia_intensivo'];
// Nombres cortos que usa el equipo, traducidos a los ids del catálogo.
const ALIAS_PLAN_COBRO = new Map([
  ['base', 'smartboard_premium'],
  ['fundador', 'ingenia_fundador'],
  ['acompanamiento', 'ingenia_acompanamiento'],
  ['intensivo', 'ingenia_intensivo'],
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/payments/wompi/checkout
 * Devuelve la URL del Web Checkout de Wompi para un plan en COP.
 * Responde 503 mientras no estén las llaves de Wompi.
 */
router.post('/checkout', requireAuth, (req, res) => {
  if (!getWompiConfig()) {
    return res.status(503).json({ error: 'Wompi no configurado' });
  }

  const { planId, redirectUrl } = req.body || {};
  if (!planId || typeof planId !== 'string') {
    return res.status(400).json({ error: 'Plan requerido' });
  }

  const result = createWompiCheckout({
    planId,
    userId: req.userId,
    email: req.body.email,
    redirectUrl,
  });
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
});

/**
 * POST /api/payments/wompi/events
 * URL de eventos que se registra en el panel de Wompi. Verifica el checksum
 * y, si la transacción quedó APROBADA por el monto exacto del plan, activa o
 * extiende el plan un mes o un año (según el plan).
 */
router.post('/events', async (req, res) => {
  const config = getWompiConfig();
  if (!config) return res.status(200).json({ received: true });

  const event = req.body;
  if (!verifyEventChecksum(event, config.eventsSecret)) {
    return res.status(401).json({ error: 'Firma inválida' });
  }

  const activation = getActivationFromEvent(event);
  if (activation) {
    const result = await activatePaidPeriod({
      userId: activation.userId,
      planId: activation.planId,
      paymentId: `wompi_${activation.transactionId}`,
    });
    if (result.error) {
      // 500 para que Wompi reintente: el pago está aprobado y el plan no quedó activo.
      logger.error('Wompi: no se pudo activar el plan', activation.planId, result.error);
      return res.status(500).json({ error: 'No se pudo activar el plan' });
    }
    if (result.paidUntil) {
      logger.info('Wompi: plan activo', { paidUntil: result.paidUntil, planId: activation.planId, userId: activation.userId });
    }
  }

  res.json({ received: true });
});

/**
 * POST /api/payments/wompi/link-cobro (solo admin)
 * Body: { email, planId }. Para quien ya tuvo la valoración gratuita: genera el
 * enlace de Wompi con el id de Auth del usuario registrado (así el evento
 * activa su plan), lo devuelve al admin y lo envía por correo. No se guarda.
 */
router.post('/link-cobro', requireAdmin, cobroLinkLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const pedido = typeof req.body?.planId === 'string' ? req.body.planId.trim() : '';
  const planId = ALIAS_PLAN_COBRO.get(pedido) || pedido;

  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Correo requerido' });
  if (!PLANES_LINK_COBRO.includes(planId)) {
    return res.status(400).json({ error: 'Plan no válido para cobro en COP' });
  }
  const plan = getPlanById(planId);
  if (!plan || plan.currency !== 'cop' || !plan.price) {
    return res.status(400).json({ error: 'Plan no válido para cobro en COP' });
  }
  if (!getWompiConfig()) return res.status(503).json({ error: 'Wompi no configurado' });
  if (!planDisponible(planId)) return res.status(400).json({ error: 'Esta oferta ya no está disponible' });

  let usuario;
  try {
    usuario = await findAuthUserByEmail(email);
  } catch (err) {
    logger.error('[wompi/link-cobro] no se pudo buscar el usuario:', err.message);
    return res.status(500).json({ error: 'No se pudo buscar el usuario' });
  }
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const checkout = createWompiCheckout({ planId, userId: usuario.id, email: usuario.email });
  if (checkout.error) return res.status(400).json({ error: checkout.error });

  const correo = buildCobroEmail(checkout.url);
  const envio = await sendEmail(usuario.email, correo.subject, correo.html, correo.text);
  const emailEnviado = envio?.success === true;
  logger.info('[wompi/link-cobro] enlace generado', { planId, userId: usuario.id, emailEnviado });

  res.json({ url: checkout.url, planId, emailEnviado, correo: usuario.email });
});

module.exports = router;
