export const TOTAL_QUESTIONS = 12;
export const PASSING_SCORE = 80;
export const MAX_ATTEMPTS = 3;
export const ATTEMPT_COOLDOWN_MS = 12 * 60 * 60 * 1000;
export const SUGGESTED_TIME_MINUTES = 20;
export const SUGGESTED_TIME_SECONDS = SUGGESTED_TIME_MINUTES * 60;

export const MAX_SECURITY_WARNINGS = 3;
export const SECURITY_WARNING_MESSAGES = [
  "Advertencia: No cambies de ventana durante el examen",
  "Segunda advertencia: El sistema detectó que abriste otra ventana",
  "Última advertencia: Si vuelves a cambiar de ventana, el examen se cerrará automáticamente",
];
export const SECURITY_VIOLATION_PENALTY = 1;
export const SCREENSHOT_OVERLAY_DURATION = 5000;
export const SECURITY_MESSAGE_DURATION = 3000;
export const SECURITY_LOG_PREFIX = "exam_security_logs";
