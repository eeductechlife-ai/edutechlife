const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { createCheckoutSession, handleWebhookEvent } = require('../services/stripe');
const { getPublicPlans } = require('../data/plans');

const router = Router();

/**
 * @swagger
 * /api/stripe/plans:
 *   get:
 *     summary: Obtener lista de planes de suscripción
 *     tags: [Stripe]
 *     responses:
 *       200:
 *         description: Lista de planes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       interval:
 *                         type: string
 */
router.get('/plans', (req, res) => {
  res.json({ plans: getPublicPlans() });
});

/**
 * @swagger
 * /api/stripe/create-checkout-session:
 *   post:
 *     summary: Crear sesión de checkout de Stripe
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *               successUrl:
 *                 type: string
 *               cancelUrl:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión de checkout creada
 *       400:
 *         description: Plan requerido
 *       500:
 *         description: Error del servidor
 */
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan requerido' });
    }

    const result = await createCheckoutSession({
      planId,
      userId: req.userId,
      email: req.body.email,
      successUrl,
      cancelUrl,
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/stripe/webhook:
 *   post:
 *     summary: Webhook de Stripe para eventos de pago
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento recibido
 *       401:
 *         description: Firma inválida
 */
async function webhookHandler(req, res) {
  const stripe = (() => {
    if (!process.env.STRIPE_SECRET_KEY) return null;
    return require('stripe')(process.env.STRIPE_SECRET_KEY);
  })();

  if (!stripe) {
    res.status(200).json({ received: true });
    return;
  }

  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(401).send('Webhook signature verification failed');
    return;
  }

  try {
    const result = await handleWebhookEvent(event);
    if (result) {
      console.log('Stripe webhook processed:', event.type, result.userId);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  res.json({ received: true });
}

module.exports = router;
module.exports.webhookHandler = webhookHandler;
