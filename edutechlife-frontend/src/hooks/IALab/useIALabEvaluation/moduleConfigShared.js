// Utilidades compartidas por las partes de MODULE_CONFIG.
import {
  getClaudeTasks,
  normalizeClaudeLocale,
} from "../../../data/ova/claudeModule";
import { parseBriefEvidence } from "../../../data/ova/claudeBriefEvidence";

export const CLAUDE_TASK_COUNT = getClaudeTasks("es").length;
export const parseClaudeAnswers = (raw) => {
  try {
    return JSON.parse(raw || "{}").answers || {};
  } catch {
    return {};
  }
};
export const countClaudeCorrect = (answers) =>
  getClaudeTasks("es").filter((t) => answers[t.id] === t.answer).length;

export { getClaudeTasks, normalizeClaudeLocale, parseBriefEvidence };
