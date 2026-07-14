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

const resourceCounts = { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 };

export const countModuleResources = (moduleId) => {
  return resourceCounts[moduleId] || 8;
};
