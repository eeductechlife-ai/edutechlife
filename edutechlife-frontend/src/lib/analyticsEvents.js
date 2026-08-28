/**
 * SmartBoard 3.0 — Catálogo central de eventos de analítica (punto 43/44 del brief).
 *
 * Separa dos dominios:
 *   LEARNING  — cómo aprende el estudiante (diagnóstico, misiones, competencias, plan).
 *   PRODUCT   — cómo se usa el producto (registro, perfil, Dani, reportes, suscripción).
 *
 * Fuente única de nombres de evento para evitar strings sueltos y typos.
 * Consumir siempre vía estos constantes: track(EVENTS.MISSION_COMPLETED, {...}).
 */

export const LEARNING_EVENTS = {
  DIAGNOSTIC_STARTED: "diagnostic_started",
  DIAGNOSTIC_COMPLETED: "diagnostic_completed",
  MISSION_STARTED: "mission_started",
  MISSION_COMPLETED: "mission_completed",
  ACTIVITY_STARTED: "activity_started",
  ACTIVITY_COMPLETED: "activity_completed",
  COMPETENCY_UPDATED: "competency_updated",
  PLAN_GENERATED: "plan_generated",
  BADGE_UNLOCKED: "badge_unlocked",
  ALERT_GENERATED: "alert_generated",
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  VAK_COMPLETED: "vak_completed",
  EXAM_COMPLETED: "exam_completed",
  FLASHCARD_SESSION_COMPLETED: "flashcard_session_completed",
  GRADE_SCANNED: "grade_scanned",
};

export const PRODUCT_EVENTS = {
  USER_REGISTERED: "user_registered",
  PROFILE_COMPLETED: "profile_completed",
  DANI_OPENED: "dani_opened",
  DANI_MESSAGE_SENT: "dani_message_sent",
  DANI_CHAT_STARTED: "dani_chat_started",
  PARENT_REPORT_VIEWED: "parent_report_viewed",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
};

export const EVENTS = { ...LEARNING_EVENTS, ...PRODUCT_EVENTS };

export default EVENTS;
