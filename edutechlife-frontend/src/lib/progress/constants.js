// Fuente única con el cliente: antes esta copia fijaba 8 recursos por módulo
// igual que `constants/ialab.js`, y ambas estaban desalineadas del catálogo.
import { MODULE_RESOURCE_COUNTS } from "../../constants/ialab.js";

export const TABLE_NAME = "user_progress";

export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  LOCKED: "locked",
};

export const MODULE_TYPES = {
  PROMPTS: "prompts",
  CHAT_GPT: "chatgpt",
  GEMINI: "gemini",
  NOTEBOOK_LM: "notebook_lm",
  FINAL_EXAM: "final_exam",
};

export const SCORING = {
  EXAM_WEIGHT: 35,
  CHALLENGE_WEIGHT: 30,
  RESOURCES_WEIGHT: 30,
  COMMUNITY_WEIGHT: 5,
  PASS_THRESHOLD: 80,
  TOTAL_MODULES: 5,
  PROGRESS_PER_MODULE: 20,
  TOTAL_POSSIBLE: 100,
};

export const countModuleResources = (moduleId) => {
  return MODULE_RESOURCE_COUNTS[moduleId] || MODULE_RESOURCE_COUNTS[1];
};
