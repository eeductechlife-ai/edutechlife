/**
 * Copia los prompts de los agentes desde el frontend (fuente de verdad) al
 * backend, que los usa en /api/agents/*. Una prueba (agentSync.test.js) falla si
 * alguna copia quedó vieja.
 *
 * Uso: npm run sync:agents
 */
import { createServer } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NICO_BACKEND_FILE,
  AUTOMATION_BACKEND_FILE,
  renderNicoBackendFile,
  renderAutomationBackendFile,
} from "./agentFiles.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(here, "..");

async function loadModules(files) {
  const vite = await createServer({
    root: frontendRoot,
    logLevel: "error",
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const out = {};
    for (const [key, file] of Object.entries(files)) {
      out[key] = await vite.ssrLoadModule(resolve(frontendRoot, file));
    }
    return out;
  } finally {
    await vite.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mods = await loadModules({
    nico: "src/components/Nico/nicoPrompts.js",
    automation: "src/utils/automationPlan.js",
  });
  const writes = [
    [NICO_BACKEND_FILE, renderNicoBackendFile(mods.nico.PROMPT_NICO_SOPORTE)],
    [
      AUTOMATION_BACKEND_FILE,
      renderAutomationBackendFile({
        systemPrompt: mods.automation.SYSTEM_PROMPT,
        aviso: mods.automation.PLAN_AVISO,
        maxTokens: mods.automation.PLAN_MAX_TOKENS,
      }),
    ],
  ];
  for (const [file, content] of writes) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    console.log(`Sincronizado: ${file}`);
  }
}

export { loadModules };
