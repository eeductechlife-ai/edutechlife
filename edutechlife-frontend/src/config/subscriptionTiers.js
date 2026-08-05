/**
 * Subscription Tiers Configuration
 * Simplified 3-tier system for SmartBoard Kids
 * Designed for students 8-16 and parents
 */

export const SUBSCRIPTION_TIERS = {
  free: {
    id: "free",
    name: "Gratis",
    price: 0,
    priceDisplay: "Gratis",
    description: "Perfecto para comenzar tu viaje educativo",
    badge: "🎓",
    color: "#64748B",
    features: [
      {
        name: "Acceso a Inicio",
        description: "Dashboard principal con contenido educativo",
        included: true,
      },
      {
        name: "Diagnóstico VAK",
        description: "Descubre tu estilo de aprendizaje único",
        included: true,
      },
      {
        name: "3 Misiones/mes",
        description: "Desafíos diarios personalizados",
        included: true,
      },
      {
        name: "Dani (limitado)",
        description: "10 mensajes por día con tu tutor IA",
        included: true,
      },
      {
        name: "Puntos y Streaks",
        description: "Sistema de gamificación",
        included: true,
      },
      {
        name: "Dani Ilimitado",
        description: "Chat sin límite con tutor IA",
        included: false,
      },
      {
        name: "Podcast Educativo",
        description: "Contenido premium de audio",
        included: false,
      },
      {
        name: "Panel para Padres",
        description: "Seguimiento de progreso",
        included: false,
      },
    ],
    cta: "Comenzar Gratis",
    recommended: false,
  },

  premium: {
    id: "premium",
    name: "Premium",
    price: 4.99,
    priceDisplay: "$4.99/mes",
    description: "Aprendizaje sin límites con Dani",
    badge: "⭐",
    color: "#3B82F6",
    features: [
      {
        name: "Todo en Gratis",
        description: "Todas las características de Gratis",
        included: true,
      },
      {
        name: "Dani Ilimitado",
        description: "Chat sin límite con tu tutor IA",
        included: true,
      },
      {
        name: "Misiones Diarias",
        description: "Desafíos personalizados cada día",
        included: true,
      },
      {
        name: "Podcast Educativo",
        description: "Contenido premium de STEM y desarrollo personal",
        included: true,
      },
      {
        name: "Sin Publicidad",
        description: "Experiencia limpia y enfocada",
        included: true,
      },
      {
        name: "Prioridad de Soporte",
        description: "Respuestas rápidas a tus preguntas",
        included: true,
      },
      {
        name: "Panel para Padres",
        description: "Seguimiento detallado (solo Plus)",
        included: false,
      },
      {
        name: "Reportes Mensuales",
        description: "Análisis de progreso académico",
        included: false,
      },
    ],
    cta: "Suscribirse",
    recommended: true,
  },

  plus: {
    id: "plus",
    name: "Premium Plus",
    price: 9.99,
    priceDisplay: "$9.99/mes",
    description: "Para padres y educadores que quieren seguimiento completo",
    badge: "👑",
    color: "#F59E0B",
    features: [
      {
        name: "Todo en Premium",
        description: "Todas las características de Premium",
        included: true,
      },
      {
        name: "Panel para Padres",
        description: "Seguimiento en tiempo real del progreso",
        included: true,
      },
      {
        name: "Reportes Mensuales",
        description: "PDF con análisis académico detallado",
        included: true,
      },
      {
        name: "Alertas Personalizadas",
        description: "Notificaciones de hitos y logros",
        included: true,
      },
      {
        name: "Acceso para Educadores",
        description: "Integración con aulas (si disponible)",
        included: true,
      },
      {
        name: "Chat Prioritario",
        description: "Soporte prioritario en español",
        included: true,
      },
      {
        name: "Múltiples Estudiantes",
        description: "Gestionar hasta 3 hijos/as",
        included: true,
      },
      {
        name: "Exportar Datos",
        description: "Descargar progreso y reportes",
        included: true,
      },
    ],
    cta: "Suscribirse Ahora",
    recommended: false,
  },
};

export const TIER_LIMITS = {
  free: {
    dani_messages_per_day: 10,
    missions_per_month: 3,
    can_access_podcast: false,
    can_access_parent_dashboard: false,
    max_students_for_parent: 1,
  },
  premium: {
    dani_messages_per_day: Infinity,
    missions_per_month: Infinity,
    can_access_podcast: true,
    can_access_parent_dashboard: false,
    max_students_for_parent: 1,
  },
  plus: {
    dani_messages_per_day: Infinity,
    missions_per_month: Infinity,
    can_access_podcast: true,
    can_access_parent_dashboard: true,
    max_students_for_parent: 3,
  },
};

export const TIER_ORDER = ["free", "premium", "plus"];

export function getTierDisplayName(tierId) {
  const tier = SUBSCRIPTION_TIERS[tierId];
  return tier ? tier.name : "Desconocido";
}

export function getTierFeatures(tierId) {
  const tier = SUBSCRIPTION_TIERS[tierId];
  return tier ? tier.features : [];
}

export function hasFeature(tierId, featureName) {
  const features = getTierFeatures(tierId);
  const feature = features.find((f) => f.name === featureName);
  return feature ? feature.included : false;
}

export function canAccessDani(tierId) {
  return SUBSCRIPTION_TIERS[tierId]?.price >= 0;
}

export function canAccessPodcast(tierId) {
  return TIER_LIMITS[tierId]?.can_access_podcast || false;
}

export function canAccessParentDashboard(tierId) {
  return TIER_LIMITS[tierId]?.can_access_parent_dashboard || false;
}

export function getDailyDaniLimit(tierId) {
  return TIER_LIMITS[tierId]?.dani_messages_per_day || 0;
}
