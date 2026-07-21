const { getPlanById } = require('../data/plans');

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

async function updateClerkUserMetadata(userId, metadata) {
  if (!process.env.CLERK_SECRET_KEY) return;
  try {
    const { createClerkClient } = require('@clerk/backend');
    const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await client.users.updateUser(userId, { publicMetadata: metadata });
  } catch (err) {
    console.error('Error updating Clerk user metadata:', err.message);
  }
}

async function createCheckoutSession({ planId, userId, email, successUrl, cancelUrl }) {
  const stripe = getStripe();
  if (!stripe) {
    return { url: null, error: 'Stripe no configurado' };
  }

  const plan = getPlanById(planId);
  if (!plan) {
    return { url: null, error: 'Plan no válido' };
  }

  if (plan.isCustom || plan.price === 0) {
    return { url: null, error: 'Este plan no requiere pago' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      customer_email: email,
      metadata: {
        userId,
        planId: plan.id,
      },
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5174'}/ialab?checkout=success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5174'}/planes?checkout=cancelled`,
      subscription_data: {
        metadata: {
          userId,
          planId: plan.id,
        },
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return { url: null, error: 'Error al crear sesión de pago' };
  }
}

async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const subscriptionId = session.subscription;

      if (!userId || !planId) {
        console.warn('Stripe webhook: missing userId or planId in metadata');
        return;
      }

      await updateClerkUserMetadata(userId, {
        plan: planId,
        subscriptionId,
        subscriptionStatus: 'active',
      });

      return { userId, planId, subscriptionId, status: 'active' };
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      const planId = subscription.metadata?.planId;
      const status = subscription.status;

      if (userId) {
        await updateClerkUserMetadata(userId, {
          plan: status === 'active' ? planId : 'free',
          subscriptionStatus: status,
        });
      }

      return { userId, planId, subscriptionId: subscription.id, status };
    }

    default:
      return null;
  }
}

module.exports = { createCheckoutSession, handleWebhookEvent, getStripe };
