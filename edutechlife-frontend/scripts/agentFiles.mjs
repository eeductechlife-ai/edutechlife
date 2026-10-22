// Sin dependencias de build: las pruebas de sincronía importan este archivo.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const backendSrc = resolve(here, "../../edutechlife-backend/src/agents");

export const NICO_BACKEND_FILE = resolve(backendSrc, "nico/prompt.generated.js");
export const AUTOMATION_BACKEND_FILE = resolve(
  backendSrc,
  "automation/prompt.generated.js",
);

const HEADER =
  "// GENERADO por edutechlife-frontend/scripts/sync-agents.mjs. No editar a mano.\n";

/** Archivo del backend para Nico: una constante JSON, generada. */
export function renderNicoBackendFile(prompt) {
  return (
    HEADER +
    `const NICO_SYSTEM_PROMPT = ${JSON.stringify(prompt)};\n\n` +
    "module.exports = { NICO_SYSTEM_PROMPT };\n"
  );
}

/** Archivo del backend para el Arquitecto de automatización. */
export function renderAutomationBackendFile({ systemPrompt, aviso, maxTokens }) {
  return (
    HEADER +
    `const AUTOMATION_SYSTEM_PROMPT = ${JSON.stringify(systemPrompt)};\n` +
    `const PLAN_AVISO = ${JSON.stringify(aviso)};\n` +
    `const PLAN_MAX_TOKENS = ${Number(maxTokens)};\n\n` +
    "module.exports = { AUTOMATION_SYSTEM_PROMPT, PLAN_AVISO, PLAN_MAX_TOKENS };\n"
  );
}
