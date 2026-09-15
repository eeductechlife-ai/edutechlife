/**
 * SmartBoard 3.0 — Catálogo central de eventos de analítica.
 *
 * Los nombres de los eventos coinciden exactamente con el spec del Documento Maestro
 * Técnico-Funcional (sección 20 — Analítica de producto).
 *
 * Fuente única de nombres de evento para evitar strings sueltos y typos.
 * Consumir siempre vía estos constantes: track(EVENTS.MISSION_COMPLETED, {...}).
 */

export const LEARNING_EVENTS = {
  // Spec §20 — Learning funnel
  DIAGNOSTIC_COMPLETED: "diagnostic_completed",
  CONTENT_COMPLETED: "content_completed",    // spec name (replaces activity_completed)
  MISSION_COMPLETED: "mission_completed",
  PLAN_COMPLETED: "plan_completed",          // spec name (replaces plan_generated)
  WARNING_GENERATED: "warning_generated",    // spec name (replaces alert_generated)

  // Additional internal events (not in spec §20 but operationally needed)
  DIAGNOSTIC_STARTED: "diagnostic_started",
  MISSION_STARTED: "mission_started",
  CONTENT_STARTED: "content_started",
  COMPETENCY_UPDATED: "competency_updated",
  PLAN_GENERATED: "plan_generated",          // kept for backward compatibility
  BADGE_UNLOCKED: "badge_unlocked",
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  VAK_COMPLETED: "vak_completed",
  EXAM_COMPLETED: "exam_completed",
  FLASHCARD_SESSION_COMPLETED: "flashcard_session_completed",
  GRADE_SCANNED: "grade_scanned",
  RECOMMENDATION_SEEN: "recommendation_seen",
};

export const PRODUCT_EVENTS = {
  // Spec §20 — Product/activation funnel
  SIGNUP_COMPLETED: "signup_completed",      // spec name (replaces user_registered)
  CONSENT_COMPLETED: "consent_completed",
  PROFILE_COMPLETED: "profile_completed",
  DANI_MESSAGE: "dani_message",              // spec name (replaces dani_message_sent)
  PARENT_LOGIN: "parent_login",
  PARENT_INSIGHT_VIEWED: "parent_insight_viewed", // spec name (replaces parent_report_viewed)

  // Additional internal events
  USER_REGISTERED: "user_registered",        // kept for backward compatibility
  DANI_OPENED: "dani_opened",
  DANI_MESSAGE_SENT: "dani_message_sent",    // kept for backward compatibility
  DANI_CHAT_STARTED: "dani_chat_started",
  PARENT_REPORT_VIEWED: "parent_report_viewed", // kept for backward compatibility
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  FIRST_ACTIVITY_COMPLETED: "first_activity_completed",
  RETENTION_DAY_1: "retention_day_1",
  RETENTION_DAY_7: "retention_day_7",
  FEATURE_ADOPTED: "feature_adopted",
};

export const EVENTS = { ...LEARNING_EVENTS, ...PRODUCT_EVENTS };

export default EVENTS;
