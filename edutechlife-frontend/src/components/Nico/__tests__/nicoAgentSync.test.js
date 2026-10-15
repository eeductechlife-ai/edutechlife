import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { PROMPT_NICO_SOPORTE } from "../nicoPrompts";
import {
  NICO_BACKEND_FILE,
  renderNicoBackendFile,
} from "../../../../scripts/nicoAgentFile.mjs";

// El backend sirve el prompt de Nico desde una copia generada. Si cambió el
// prompt aquí y no se regeneró la copia, Nico del servidor respondería con
// precios o reglas viejas.
describe("prompt de Nico en el backend", () => {
  it("coincide con el prompt del frontend (ejecuta npm run sync:nico-agent si falla)", () => {
    expect(existsSync(NICO_BACKEND_FILE)).toBe(true);
    expect(readFileSync(NICO_BACKEND_FILE, "utf8")).toBe(
      renderNicoBackendFile(PROMPT_NICO_SOPORTE),
    );
  });
});

describe("modo del agente Nico", () => {
  it("está apagado por defecto", async () => {
    const { nicoUsesServerAgent } = await import("../nicoAgentMode");
    expect(nicoUsesServerAgent()).toBe(false);
  });
});
