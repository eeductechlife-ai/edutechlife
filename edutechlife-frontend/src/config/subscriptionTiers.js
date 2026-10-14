/**
 * Subscription Tiers Configuration
 * Simplified 3-tier system for IngenIA Kids
 * Designed for students 6-16 and parents
 */

import { PRECIOS_INGENIA, formatCOP } from "./preciosIngenia";

// Precios en COP desde la fuente única (C-005).
const P = PRECIOS_INGENIA;

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
    name: "Base",
    price: P.base.mensual,
    priceDisplay: `${formatCOP(P.base.mensual)}/mes`,
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
        description: "Seguimiento y reporte semanal a padres",
        included: true,
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
    name: "Personalizado",
    price: P.acompanamiento.mensualDesde,
    priceDisplay: `desde ${formatCOP(P.acompanamiento.mensualDesde)}/mes`,
    description: "Plan Base con acompañamiento de un coach docente",
    badge: "👑",
    color: "#F59E0B",
    features: [
      {
        name: "Todo en Base",
        description: "Todas las características del plan Base",
        included: true,
      },
      {
        name: "Valoración inicial",
        description: "45 min con revisión del boletín y plan a la medida",
        included: true,
      },
      {
        name: "Coach docente",
        description: `${P.acompanamiento.sesionesMes} sesiones al mes de 45 min (Intensivo: ${P.intensivo.sesionesMes} por ${formatCOP(P.intensivo.mensual)}/mes)`,
        included: true,
      },
      {
        name: "Seguimiento al colegio",
        description: "Con autorización del padre",
        included: true,
      },
      {
        name: "Reporte Mensual",
        description: "Con llamada de 15 min",
        included: true,
      },
    ],
    cta: "Solicitar valoración",
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
    can_access_parent_dashboard: true,
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
