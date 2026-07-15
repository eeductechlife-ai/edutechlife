import { lazy } from "react";

export const LeadCaptureForm = lazy(() => import("./LeadCaptureForm"));
export const AppointmentScheduler = lazy(
  () => import("./AppointmentScheduler"),
);

export const SPEECH_SAFETY_TIMEOUT = 12000;

export const CHAT_CONFIG = {
  MIN_MESSAGES_BEFORE_ASK: 3,
  MAX_MESSAGES_BEFORE_FORCE: 8,
  INTEREST_THRESHOLD: 0.7,
  DEFAULT_DURATION: 30,
  DEFAULT_MODALITY: "videollamada",
  REMINDER_HOURS: 24,
  MAX_CONVERSATION_LENGTH: 25,
  STREAM_UPDATE_INTERVAL: 80,
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  VOICE_ID: "nico_premium",
};
