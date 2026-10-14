const crypto = require('crypto');
const { getPlanById } = require('../data/plans');

// Wompi (Bancolombia): pasarela local para cobrar en Colombia con tarjeta, PSE,
// Nequi y Bancolombia. Este módulo arma el Web Checkout firmado y verifica los
// eventos que Wompi envía. Sin las variables WOMPI_* no hace nada: el cobro
// sigue apagado hasta que el CEO cargue las llaves en Render.
//
// Web Checkout es un pago único: no renueva solo. Antes de ofrecer planes
// mensuales por Wompi hace falta guardar la fecha de vencimiento del plan o
// cobrar con fuentes de pago (docs/pagos/WOMPI.md).

const CHECKOUT_URL = 'https://checkout.wompi.co/p/';
const REF_SEPARATOR = '__';

function getWompiConfig() {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!publicKey || !integritySecret || !eventsSecret) return null;
  return {
    publicKey,
    integritySecret,
    eventsSecret,
    sandbox: publicKey.startsWith('pub_test_'),
  };
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Firma de integridad: SHA256(referencia + monto en centavos + moneda + secreto).
function integritySignature({ reference, amountInCents, currency }, integritySecret) {
  return sha256(`${reference}${amountInCents}${currency}${integritySecret}`);
}

// La referencia lleva el plan y el usuario para saber qué activar al llegar
// el evento. Los ids de plan usan "_" sencillo y los de usuario son UUID.
function buildReference(planId, userId, now = Date.now()) {
  return [planId, userId, now].join(REF_SEPARATOR);
}

function parseReference(reference) {
  const parts = String(reference || '').split(REF_SEPARATOR);
  if (parts.length !== 3 || !parts[0] || !parts[1]) return null;
  return { planId: parts[0], userId: parts[1] };
}

function createWompiCheckout({ planId, userId, email, redirectUrl }) {
  const config = getWompiConfig();
  if (!config) return { url: null, error: 'Wompi no configurado' };

  const plan = getPlanById(planId);
  if (!plan) return { url: null, error: 'Plan no válido' };
  if (plan.isCustom || plan.price === 0) return { url: null, error: 'Este plan no requiere pago' };
  // Wompi solo cobra en COP; los planes viejos en USD no se ofrecen por aquí.
  if (plan.currency !== 'cop') return { url: null, error: 'Plan no disponible en pesos' };
  if (plan.availableUntil && Date.now() > Date.parse(`${plan.availableUntil}T23:59:59-05:00`)) {
    return { url: null, error: 'Esta oferta ya no está disponible' };
  }

  const currency = 'COP';
  // plans.js guarda el precio en centavos de COP, la misma unidad que pide Wompi.
  const amountInCents = plan.price;
  const reference = buildReference(plan.id, userId);
  const signature = integritySignature({ reference, amountInCents, currency }, config.integritySecret);

  const params = new URLSearchParams({
    'public-key': config.publicKey,
    currency,
    'amount-in-cents': String(amountInCents),
    reference,
    'signature:integrity': signature,
    'redirect-url': redirectUrl || `${process.env.FRONTEND_URL || 'http://localhost:5174'}/ingenia?checkout=wompi`,
  });
  if (email) params.set('customer-data:email', email);

  return { url: `${CHECKOUT_URL}?${params.toString()}`, reference };
}

function readPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

// Checksum del evento: SHA256(valores de signature.properties tomados de
// event.data, en orden + timestamp + secreto de eventos).
function verifyEventChecksum(event, eventsSecret) {
  const signature = event?.signature;
  if (!signature || !Array.isArray(signature.properties) || !signature.checksum) return false;
  if (event.timestamp == null || !event.data) return false;

  const values = signature.properties.map((p) => readPath(event.data, p));
  if (values.some((v) => v === undefined)) return false;

  const expected = sha256(`${values.join('')}${event.timestamp}${eventsSecret}`);
  const given = String(signature.checksum).toLowerCase();
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

// Traduce un evento ya verificado a la activación que corresponde, o null.
function getActivationFromEvent(event) {
  if (event?.event !== 'transaction.updated') return null;
  const tx = event.data?.transaction;
  if (!tx || tx.status !== 'APPROVED') return null;

  const ref = parseReference(tx.reference);
  if (!ref) return null;

  // Solo se activa si el monto cobrado es exactamente el precio del plan.
  const plan = getPlanById(ref.planId);
  if (!plan || plan.price !== tx.amount_in_cents || tx.currency !== 'COP') return null;

  return { userId: ref.userId, planId: plan.id, transactionId: tx.id };
}

module.exports = {
  getWompiConfig,
  integritySignature,
  buildReference,
  parseReference,
  createWompiCheckout,
  verifyEventChecksum,
  getActivationFromEvent,
};
