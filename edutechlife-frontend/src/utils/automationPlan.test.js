import { describe, it, expect } from "vitest";
import { buildPlanRequest, PLAN_MAX_TOKENS } from "./automationPlan";

const form = {
  empresa: "Acme",
  industria: "educacion",
  empleados: 50,
  procesos: ["a", "b"],
  objetivos: "x",
  presupuesto: "medio",
  tiempo: "3-6 meses",
};

describe("buildPlanRequest", () => {
  it("usa el formato de mensajes y >= 2000 tokens (el legacy daba 500 y recortaba)", () => {
    const { messages, options } = buildPlanRequest(form, { nombre: "Arq" });
    expect(Array.isArray(messages)).toBe(true);
    expect(messages[0].role).toBe("system");
    expect(messages[1].content).toContain("Acme");
    expect(options.maxTokens).toBeGreaterThanOrEqual(2000);
    expect(PLAN_MAX_TOKENS).toBe(2000);
  });
});
