import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { PROMPT_NICO_SOPORTE } from "../nicoPrompts";
import {
  SYSTEM_PROMPT,
  PLAN_AVISO,
  PLAN_MAX_TOKENS,
} from "../../../utils/automationPlan";
import {
  NICO_BACKEND_FILE,
  AUTOMATION_BACKEND_FILE,
  renderNicoBackendFile,
  renderAutomationBackendFile,
} from "../../../../scripts/agentFiles.mjs";

// El backend sirve los prompts desde copias generadas. Si cambió aquí y no se
// regeneró la copia, el servidor respondería con reglas o precios viejos.
const HINT = "(ejecuta npm run sync:agents si falla)";

describe("prompts de agentes en el backend", () => {
  it(`Nico coincide con el frontend ${HINT}`, () => {
    expect(existsSync(NICO_BACKEND_FILE)).toBe(true);
    expect(readFileSync(NICO_BACKEND_FILE, "utf8")).toBe(
      renderNicoBackendFile(PROMPT_NICO_SOPORTE),
    );
  });

  it(`Arquitecto de automatización coincide con el frontend ${HINT}`, () => {
    expect(existsSync(AUTOMATION_BACKEND_FILE)).toBe(true);
    expect(readFileSync(AUTOMATION_BACKEND_FILE, "utf8")).toBe(
      renderAutomationBackendFile({
        systemPrompt: SYSTEM_PROMPT,
        aviso: PLAN_AVISO,
        maxTokens: PLAN_MAX_TOKENS,
      }),
    );
  });
});

describe("modo del agente Nico", () => {
  it("está apagado por defecto", async () => {
    const { nicoUsesServerAgent } = await import("../nicoAgentMode");
    expect(nicoUsesServerAgent()).toBe(false);
  });
});
