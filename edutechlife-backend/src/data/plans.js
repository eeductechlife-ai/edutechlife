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
  {
    id: 'pro',
    name: 'Pro',
    price: 29900,
    currency: 'usd',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    description: 'Acceso completo a la plataforma',
    features: [
      'Todos los cursos IALab',
      'Nico + Valerio ilimitado',
      'SmartBoard completo',
      'Certificados descargables',
      'Soporte prioritario',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    currency: 'usd',
    isCustom: true,
    description: 'Para instituciones educativas',
    features: [
      'Todo lo de Pro',
      'API dedicada',
      'Onboarding personalizado',
      'Reportes avanzados',
      'SLA garantizado',
    ],
  },
];

function getPlanById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

function getPublicPlans() {
  return PLANS.map(({ priceId, ...plan }) => {
    if (plan.isCustom) return plan;
    return { ...plan, priceId: undefined };
  });
}

module.exports = { PLANS, getPlanById, getPublicPlans };
