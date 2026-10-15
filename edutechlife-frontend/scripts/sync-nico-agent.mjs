/**
 * Copia el prompt de Nico desde el frontend (fuente: nicoPrompts.js, precios en
 * config/preciosIngenia.js) al backend, que lo usa en /api/agents/nico/stream.
 *
 * Uso: npm run sync:nico-agent
 * Una prueba (nicoAgentSync.test.js) falla si la copia del backend quedó vieja.
 */
import { createServer } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NICO_BACKEND_FILE, renderNicoBackendFile } from "./nicoAgentFile.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(here, "..");
export const NICO_PROMPT_SOURCE = resolve(
  frontendRoot,
  "src/components/Nico/nicoPrompts.js",
);
export async function loadNicoPrompt() {
  const vite = await createServer({
    root: frontendRoot,
    logLevel: "error",
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const mod = await vite.ssrLoadModule(NICO_PROMPT_SOURCE);
    return mod.PROMPT_NICO_SOPORTE;
  } finally {
    await vite.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const prompt = await loadNicoPrompt();
  mkdirSync(dirname(NICO_BACKEND_FILE), { recursive: true });
  writeFileSync(NICO_BACKEND_FILE, renderNicoBackendFile(prompt));
  console.log(`Prompt de Nico sincronizado en ${NICO_BACKEND_FILE}`);
}
