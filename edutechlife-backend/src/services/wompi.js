// Pasarela Wompi (Colombia). Detrás de PAGOS_WOMPI: apagada por defecto.
// Este módulo solo tiene lógica pura (firmas, montos y disponibilidad). No hace
// llamadas a Wompi, no guarda datos de tarjeta y no toca la base de datos.
const crypto = require('crypto');
const { getPlanById } = require('../data/plans');

// Fundador vence el 3-nov-2026 inclusive, en hora de Colombia (UTC-5).
const ZONA_COLOMBIA = '-05:00';

function isPagosWompiEnabled(env = process.env) {
  return env.PAGOS_WOMPI === 'true';
}

// TODO(verificar): la fórmula de la firma de integridad (guía "Widget & Checkout
// Web", paso 3, docs.wompi.co) no se pudo leer (HTTP 403) durante la implementación.
// Se implementa SHA256 simple de referencia + centavos + moneda + secreto de integridad.
// El CEO debe confirmarla con una transacción en sandbox antes de encender PAGOS_WOMPI.
function firmaIntegridad({ referencia, montoEnCentavos, moneda, secretoIntegridad }) {
  if (!secretoIntegridad) {
    throw new Error('Falta el secreto de integridad de Wompi');
  }
  return crypto
    .createHash('sha256')
    .update(`${referencia}${montoEnCentavos}${moneda}${secretoIntegridad}`)
    .digest('hex');
}

function valorPorRuta(objeto, ruta) {
  return ruta.split('.').reduce((acc, clave) => (acc == null ? undefined : Reflect.get(acc, clave)), objeto);
}

// Checksum de un evento (documentación de eventos de Wompi): SHA256 de los valores
// de signature.properties (leídos de data, en orden) + timestamp + secreto de eventos.
// Cualquier dato faltante invalida el evento; la comparación es en tiempo constante.
function verificarChecksumEvento(evento, secretoEventos) {
  const firmados = evento?.signature?.properties;
  const recibido = evento?.signature?.checksum;
  if (!secretoEventos || !evento?.data || !Array.isArray(firmados) || !recibido) return false;
  if (evento.timestamp == null) return false;

  const valores = firmados.map((ruta) => valorPorRuta(evento.data, ruta));
  if (valores.some((v) => v === undefined || v === null)) return false;

  const base = valores.join('') + String(evento.timestamp) + secretoEventos;
  const esperado = Buffer.from(crypto.createHash('sha256').update(base).digest('hex'));
  const obtenido = Buffer.from(String(recibido).toLowerCase());
  return esperado.length === obtenido.length && crypto.timingSafeEqual(esperado, obtenido);
}

// Un plan con availableUntil deja de venderse después de esa fecha (inclusive).
// El cupo de 50 familias del Fundador se controla quitando su variable de precio.
function planDisponible(planId, ahora = new Date()) {
  const plan = getPlanById(planId);
  if (!plan) return false;
  if (!plan.availableUntil) return true;
  return ahora.getTime() <= Date.parse(`${plan.availableUntil}T23:59:59${ZONA_COLOMBIA}`);
}

// Monto a cobrar en centavos de COP, tomado del catálogo y nunca del cliente.
// Solo aplica a planes IngenIA en COP con precio fijo.
function montoPlanEnCentavos(planId) {
  const plan = getPlanById(planId);
  if (!plan || plan.currency !== 'cop' || plan.isCustom || !plan.price) return null;
  return plan.price;
}

module.exports = {
  isPagosWompiEnabled,
  firmaIntegridad,
  verificarChecksumEvento,
  planDisponible,
  montoPlanEnCentavos,
};
