import { describe, it, expect, vi, afterEach } from "vitest";
import {
  SYSTEM_PROMPT,
  PLAN_AVISO,
  requestAutomationPlan,
} from "./automationPlan";

describe("prompt del arquitecto", () => {
  it("mantiene las reglas de honestidad (sin cifras inventadas, ROI como rango)", () => {
    expect(SYSTEM_PROMPT).toMatch(/No inventes cifras/);
    expect(SYSTEM_PROMPT).toMatch(/rango/);
    expect(SYSTEM_PROMPT).toContain(PLAN_AVISO);
  });
});

describe("requestAutomationPlan", () => {
  afterEach(() => vi.restoreAllMocks());

  it("manda el formulario al servidor y devuelve el plan", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ plan: "# Plan" }), { status: 200 }),
      );
    const plan = await requestAutomationPlan(
      { empresa: "Acme" },
      { nombre: "Asistente" },
    );
    expect(plan).toBe("# Plan");
    expect(fetchMock.mock.calls[0][0]).toMatch(
      /\/api\/agents\/automation\/plan$/,
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      formData: { empresa: "Acme" },
      selectedArchitecture: { nombre: "Asistente" },
    });
  });

  it("muestra el error real del servidor", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "Generaste varios planes seguidos." }),
        { status: 429 },
      ),
    );
    await expect(requestAutomationPlan({ empresa: "Acme" })).rejects.toThrow(
      "varios planes",
    );
  });
});
