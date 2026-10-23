// Catálogo de planes. Los montos están en centavos de COP (4990000 = $49.900) y
// se cobran con Wompi. `unlisted` oculta el plan de las vistas públicas; sigue
// resolviéndose por id para el checkout y para las suscripciones existentes.
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
  {
    id: 'smartboard_premium', // id histórico del plan Base: lo usan PremiumGate y las suscripciones existentes
    name: 'IngenIA Base',
    price: 4990000,
    currency: 'cop',
    interval: 'month',
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
    unlisted: true,
  },
  {
    id: 'ingenia_segundo_hijo',
    name: 'IngenIA segundo hijo',
    price: 2490000,
    currency: 'cop',
    interval: 'month',
    unlisted: true,
  },
  {
    id: 'ingenia_fundador',
    name: 'IngenIA Fundador',
    price: 3990000,
    currency: 'cop',
    interval: 'month',
    // Primeras 50 familias o hasta esta fecha (lo que ocurra primero). El cupo
    // de 50 se controla a mano.
    availableUntil: '2026-11-03',
    unlisted: true,
  },
  {
    id: 'ingenia_acompanamiento',
    name: 'IngenIA Personalizado · Acompañamiento',
    price: 14900000, // "desde": precio base del plan
    currency: 'cop',
    interval: 'month',
    // Lleva valoración gratis antes del cobro: solo se cobra con /link-cobro.
    requiereValoracion: true,
    unlisted: true,
  },
  {
    id: 'ingenia_intensivo',
    name: 'IngenIA Personalizado · Intensivo',
    price: 24900000,
    currency: 'cop',
    interval: 'month',
    // Lleva valoración gratis antes del cobro: solo se cobra con /link-cobro.
    requiereValoracion: true,
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

function getPlanById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

module.exports = { PLANS, INGENIA_PLAN_IDS, getPlanById };
