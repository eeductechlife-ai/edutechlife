const { getPlanById } = require('../data/plans');
const supabase = require('../db/supabase');

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Planes de SmartBoard (menores 6–16): su estado vive en `students`, no en
// `users`. Mantiene los datos de IALab (adultos) y SmartBoard (niños) separados.
const SMARTBOARD_PLAN_IDS = new Set(['smartboard_premium']);

/**
 * Persiste el estado de suscripción en Supabase, en la tabla correcta según el
 * público del plan. Es el destino canónico tras migrar auth de Clerk a Supabase
 * (de aquí lee el frontend el plan/tier del usuario).
 *
 * - Planes IALab (adultos)   → `users` (columnas plan/subscription_*), key: id
 * - Planes SmartBoard (niños) → `students` (subscription_tier), key: auth_id
 *
 * Nunca lanza: un fallo aquí no debe impedir devolver 200 a Stripe (evitar
 * reintentos innecesarios del webhook). `userId` es el UUID de auth.users.
 */
async function updateSupabaseUserSubscription(userId, { planId, subscriptionId, status }) {
  if (!userId) return;
  const active = status === 'active';
  try {
    if (SMARTBOARD_PLAN_IDS.has(planId)) {
      const { error } = await supabase
        .from('students')
        .update({ subscription_tier: active ? 'premium' : 'free' })
        .eq('auth_id', userId);
      if (error) console.error('Supabase students subscription update failed:', error.message);
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        plan: active ? planId : 'free',
        subscription_id: subscriptionId,
        subscription_status: status,
      })
      .eq('id', userId);
    if (error) console.error('Supabase users subscription update failed:', error.message);
  } catch (err) {
    console.error('Supabase subscription update threw:', err.message);
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

      await updateSupabaseUserSubscription(userId, {
        planId,
        subscriptionId,
        status: 'active',
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
        await updateSupabaseUserSubscription(userId, {
          planId,
          subscriptionId: subscription.id,
          status,
        });
      }

      return { userId, planId, subscriptionId: subscription.id, status };
    }

    default:
      return null;
  }
}

module.exports = { createCheckoutSession, handleWebhookEvent, getStripe };
