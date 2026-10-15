// Sin dependencias de build: la prueba de sincronía importa este archivo.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export const NICO_BACKEND_FILE = resolve(
  here,
  "../../edutechlife-backend/src/agents/nico/prompt.generated.js",
);

/** Archivo del backend: una constante JSON, generada, sin edición a mano. */
export function renderNicoBackendFile(prompt) {
  return (
    "// GENERADO por edutechlife-frontend/scripts/sync-nico-agent.mjs. No editar a mano.\n" +
    `const NICO_SYSTEM_PROMPT = ${JSON.stringify(prompt)};\n\n` +
    "module.exports = { NICO_SYSTEM_PROMPT };\n"
  );
}
