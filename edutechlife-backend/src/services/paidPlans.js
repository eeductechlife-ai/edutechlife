const supabase = require('../db/supabase');
const { getPlanById, INGENIA_PLAN_IDS } = require('../data/plans');
const { getWompiConfig } = require('./wompi');

// Planes pagados por periodo (Wompi cobra una vez por periodo, no renueva
// solo). Cada pago aprobado extiende el plan un mes o un año y el backend
// apaga cada hora los que vencieron. Columnas de la migración 104.

function addInterval(date, interval) {
  const next = new Date(date.getTime());
  const day = next.getUTCDate();
  next.setUTCDate(1);
  if (interval === 'year') next.setUTCFullYear(next.getUTCFullYear() + 1);
  else next.setUTCMonth(next.getUTCMonth() + 1);
  // 31 de enero + 1 mes = 28/29 de febrero, no 3 de marzo.
  const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  next.setUTCDate(Math.min(day, lastDay));
  return next;
}

// Si aún le quedan días pagados, el nuevo periodo empieza al final de ellos.
function nextPaidUntil(currentPaidUntil, interval, now = new Date()) {
  const current = currentPaidUntil ? new Date(currentPaidUntil) : null;
  const start = current && current > now ? current : now;
  return addInterval(start, interval).toISOString();
}

/**
 * Activa o extiende un plan por un pago único aprobado.
 * `paymentId` evita extender dos veces si la pasarela reenvía el mismo evento.
 * Devuelve { paidUntil } o { duplicate: true }; nunca lanza.
 */
async function activatePaidPeriod({ userId, planId, paymentId, now = new Date() }) {
  const plan = getPlanById(planId);
  if (!userId || !plan) return { error: 'datos incompletos' };
  const interval = plan.interval || 'month';

  try {
    if (INGENIA_PLAN_IDS.has(plan.id)) {
      const { data: student, error: readErr } = await supabase
        .from('students')
        .select('premium_until, premium_payment_id')
        .eq('auth_id', userId)
        .maybeSingle();
      if (readErr || !student) return { error: readErr?.message || 'estudiante no encontrado' };
      if (student.premium_payment_id === paymentId) return { duplicate: true };

      const paidUntil = nextPaidUntil(student.premium_until, interval, now);
      const { error } = await supabase
        .from('students')
        .update({ subscription_tier: 'premium', premium_until: paidUntil, premium_payment_id: paymentId })
        .eq('auth_id', userId);
      if (error) return { error: error.message };
      return { paidUntil };
    }

    const { data: user, error: readErr } = await supabase
      .from('users')
      .select('plan_paid_until, subscription_id')
      .eq('id', userId)
      .maybeSingle();
    if (readErr || !user) return { error: readErr?.message || 'usuario no encontrado' };
    if (user.subscription_id === paymentId) return { duplicate: true };

    const paidUntil = nextPaidUntil(user.plan_paid_until, interval, now);
    const { error } = await supabase
      .from('users')
      .update({
        plan: plan.id,
        subscription_id: paymentId,
        subscription_status: 'active',
        plan_paid_until: paidUntil,
      })
      .eq('id', userId);
    if (error) return { error: error.message };
    return { paidUntil };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Apaga los planes cuyo periodo pagado ya terminó. Las filas sin fecha
 * (Stripe, colegios) no se tocan. Devuelve cuántas filas cambió.
 */
async function expirePaidPlans(now = new Date()) {
  const iso = now.toISOString();
  const result = { students: 0, users: 0 };
  try {
    const { data: students, error: sErr } = await supabase
      .from('students')
      .update({ subscription_tier: 'free' })
      .eq('subscription_tier', 'premium')
      .lt('premium_until', iso)
      .select('id');
    if (sErr) console.error('Vencimiento de planes (students):', sErr.message);
    else result.students = students?.length || 0;

    const { data: users, error: uErr } = await supabase
      .from('users')
      .update({ plan: 'free', subscription_status: 'expired' })
      .neq('plan', 'free')
      .lt('plan_paid_until', iso)
      .select('id');
    if (uErr) console.error('Vencimiento de planes (users):', uErr.message);
    else result.users = users?.length || 0;
  } catch (err) {
    console.error('Vencimiento de planes falló:', err.message);
  }
  return result;
}

const HOUR_MS = 60 * 60 * 1000;

// Corre al arrancar y cada hora. Solo se enciende con las tres llaves de Wompi:
// sin ellas no hay planes con fecha que vencer (y la 104 puede no estar).
function startPaidPlanExpiry() {
  if (!getWompiConfig()) return null;
  expirePaidPlans();
  const timer = setInterval(expirePaidPlans, HOUR_MS);
  timer.unref();
  return timer;
}

module.exports = { addInterval, nextPaidUntil, activatePaidPeriod, expirePaidPlans, startPaidPlanExpiry };
