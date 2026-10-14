const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getWompiConfig,
  createWompiCheckout,
  verifyEventChecksum,
  getActivationFromEvent,
} = require('../services/wompi');
const { updateSupabaseUserSubscription } = require('../services/stripe');

const router = Router();

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
 * y, si la transacción quedó APROBADA por el monto exacto del plan, lo activa.
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
    await updateSupabaseUserSubscription(activation.userId, {
      planId: activation.planId,
      subscriptionId: `wompi_${activation.transactionId}`,
      status: 'active',
    });
    console.log('Wompi: plan activado', activation.planId, activation.userId);
  }

  res.json({ received: true });
});

module.exports = router;
