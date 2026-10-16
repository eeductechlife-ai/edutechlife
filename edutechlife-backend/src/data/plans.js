const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'usd',
    description: 'Para empezar a explorar',
    features: [
      '1 curso de IALab',
      'Chat Nico básico',
      'Acceso a contenido gratuito',
    ],
  },
  // Plan Pro (USD 299): retirado de la venta (decisión del CEO, 2026-10-15). Queda
  // oculto para que las suscripciones existentes sigan resolviendo su plan.
  {
    id: 'pro',
    name: 'Pro',
    price: 29900,
    currency: 'usd',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    description: 'Acceso completo a la plataforma',
    features: [
      'Todos los cursos IALab',
      'Nico + MAX ilimitado',
      'IngenIA completo',
      'Certificados descargables',
      'Soporte prioritario',
    ],
    unlisted: true,
  },
  // ── IngenIA: precios oficiales en COP (aprobados por el CEO el 2026-10-13) ──
  // Deben coincidir con edutechlife-frontend/src/config/preciosIngenia.js
  // (lo verifica src/__tests__/data/precios-sync.test.js).
  // `price` va en la unidad mínima de Stripe: centavos de COP ($49.900 = 4990000).
  // `priceEnv` nombra la variable con el ID del precio en Stripe; si falta, el
  // checkout se niega (nunca se cobra un precio distinto al publicado).
  {
    id: 'smartboard_premium', // id histórico del plan Base: lo usan PremiumGate y las suscripciones existentes
    name: 'IngenIA Base',
    price: 4990000,
    currency: 'cop',
    interval: 'month',
    priceEnv: 'STRIPE_PRICE_INGENIA_MENSUAL',
    unlisted: true,
    description: 'Para que tu hijo aprenda a su manera, y tú lo veas avanzar',
    features: [
      'Tutor Dani ilimitado con IA',
      'Misiones y Diagnóstico VAK',
      'Panel para padres',
      'Reporte semanal de progreso a tu correo',
      '7 días de prueba sin tarjeta',
    ],
  },
  {
    id: 'ingenia_base_anual',
    name: 'IngenIA Base anual',
    price: 44900000,
    currency: 'cop',
    interval: 'year',
    priceEnv: 'STRIPE_PRICE_INGENIA_ANUAL',
    unlisted: true,
  },
  {
    id: 'ingenia_segundo_hijo',
    name: 'IngenIA segundo hijo',
    price: 2490000,
    currency: 'cop',
    interval: 'month',
    priceEnv: 'STRIPE_PRICE_INGENIA_SEGUNDO_HIJO',
    unlisted: true,
  },
  {
    id: 'ingenia_fundador',
    name: 'IngenIA Fundador',
    price: 3990000,
    currency: 'cop',
    interval: 'month',
    priceEnv: 'STRIPE_PRICE_INGENIA_FUNDADOR',
    // Primeras 50 familias o hasta esta fecha (lo que ocurra primero). El cupo
    // de 50 se controla a mano: al llenarse, quitar la variable de entorno.
    availableUntil: '2026-11-03',
    unlisted: true,
  },
  {
    id: 'ingenia_acompanamiento',
    name: 'IngenIA Personalizado · Acompañamiento',
    price: 14900000, // "desde": precio base del plan
    currency: 'cop',
    interval: 'month',
    priceEnv: 'STRIPE_PRICE_INGENIA_ACOMPANAMIENTO',
    unlisted: true,
  },
  {
    id: 'ingenia_intensivo',
    name: 'IngenIA Personalizado · Intensivo',
    price: 24900000,
    currency: 'cop',
    interval: 'month',
    priceEnv: 'STRIPE_PRICE_INGENIA_INTENSIVO',
    unlisted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    currency: 'usd',
    isCustom: true,
    unlisted: true,
    description: 'Para instituciones educativas',
    features: [
      'Todo lo de IngenIA Base',
      'API dedicada',
      'Onboarding personalizado',
      'Reportes avanzados',
      'SLA garantizado',
    ],
  },
];

const INGENIA_PLAN_IDS = new Set(
  PLANS.filter((p) => p.id === 'smartboard_premium' || p.id.startsWith('ingenia_')).map((p) => p.id),
);

// El ID de precio se lee en cada llamada para que un cambio de variable de
// entorno no exija tocar código.
function getPlanById(id) {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) return null;
  if (!plan.priceEnv) return plan;
  return { ...plan, priceId: process.env[plan.priceEnv] || null };
}

// Planes que muestra /planes (los demás se compran desde la landing o por asesor).
function getPublicPlans() {
  return PLANS.filter((p) => !p.unlisted).map(({ priceId, priceEnv, ...plan }) => {
    if (plan.isCustom) return plan;
    return { ...plan, priceId: undefined };
  });
}

module.exports = { PLANS, INGENIA_PLAN_IDS, getPlanById, getPublicPlans };
