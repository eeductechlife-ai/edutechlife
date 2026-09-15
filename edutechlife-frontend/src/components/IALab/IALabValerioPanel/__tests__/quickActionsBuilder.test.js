import { describe, it, expect } from "vitest";
import { buildValerioQuickActions } from "../quickActionsBuilder.js";

const baseCtx = {
  locale: "es",
  currentModule: { id: 2, title: "El Arquitecto de Automatización", challenge: "Construye un GPT" },
  lessonTitle: "El Andamio del Arquitecto",
  userLevel: 4,
};

describe("buildValerioQuickActions (Fase 5 — tutor)", () => {
  it("incluye acciones de explicación paso a paso y micro-plan", () => {
    const ids = buildValerioQuickActions(baseCtx).map((a) => a.id);
    expect(ids).toContain("explain_step_by_step");
    expect(ids).toContain("micro_plan");
  });

  it("cada acción tiene id, label, icon y prompt no vacíos", () => {
    buildValerioQuickActions(baseCtx).forEach((action) => {
      expect(action.id?.trim().length).toBeGreaterThan(0);
      expect(action.label?.trim().length).toBeGreaterThan(0);
      expect(action.icon?.trim().length).toBeGreaterThan(0);
      expect(action.prompt?.trim().length).toBeGreaterThan(0);
    });
  });

  it("el prompt paso a paso pide explícitamente pasos numerados", () => {
    const action = buildValerioQuickActions(baseCtx).find(
      (a) => a.id === "explain_step_by_step",
    );
    expect(action.prompt.toLowerCase()).toMatch(/paso|passo|step/);
  });

  it("el micro-plan menciona un plan corto y accionable", () => {
    const action = buildValerioQuickActions(baseCtx).find(
      (a) => a.id === "micro_plan",
    );
    expect(action.prompt.toLowerCase()).toMatch(/plan/);
  });

  it("genera prompts en el idioma solicitado", () => {
    const en = buildValerioQuickActions({ ...baseCtx, locale: "en" }).find(
      (a) => a.id === "explain_step_by_step",
    );
    const pt = buildValerioQuickActions({ ...baseCtx, locale: "pt" }).find(
      (a) => a.id === "explain_step_by_step",
    );
    expect(en.prompt.toLowerCase()).toMatch(/step/);
    expect(pt.prompt.toLowerCase()).toMatch(/passo/);
  });

  it("localiza la palabra de nivel en el micro-plan", () => {
    const es = buildValerioQuickActions({ ...baseCtx, locale: "es" }).find(
      (a) => a.id === "micro_plan",
    );
    const pt = buildValerioQuickActions({ ...baseCtx, locale: "pt" }).find(
      (a) => a.id === "micro_plan",
    );
    const en = buildValerioQuickActions({ ...baseCtx, locale: "en" }).find(
      (a) => a.id === "micro_plan",
    );
    expect(es.prompt).toMatch(/nivel (principiante|intermedio|avanzado)/);
    expect(pt.prompt).toMatch(/nível (iniciante|intermediário|avançado)/);
    expect(en.prompt).toMatch(/at (beginner|intermediate|advanced) level/);
  });
});
