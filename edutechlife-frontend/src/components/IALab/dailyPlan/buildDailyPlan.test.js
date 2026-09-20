import { describe, it, expect } from "vitest";
import { buildDailyPlan } from "./buildDailyPlan";

const CHALLENGES = [
  { id: "dc-1", titleKey: "t1", descriptionKey: "d1", xp: 50, icon: "fa-sun" },
  {
    id: "dc-2",
    titleKey: "t2",
    descriptionKey: "d2",
    xp: 75,
    icon: "fa-brain",
  },
];

describe("buildDailyPlan", () => {
  it("módulo nuevo: primer paso = empezar contenido", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: false } },
      completedChallenges: {},
      dailyChallenges: CHALLENGES,
    });
    expect(plan.current.id).toBe("start");
    expect(plan.current.type).toBe("content");
    expect(plan.total).toBeGreaterThan(0);
  });

  it("recursos completados y examen pendiente: primer paso = examen", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: true, exam: false } },
      completedChallenges: { "dc-1": true, "dc-2": true },
      dailyChallenges: CHALLENGES,
    });
    expect(plan.current.id).toBe("exam-2");
    expect(plan.current.type).toBe("exam");
  });

  it("racha en riesgo tiene prioridad (paso 1)", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: false } },
      atRisk: true,
      completedChallenges: {},
      dailyChallenges: CHALLENGES,
    });
    expect(plan.steps[0].type).toBe("streak");
    expect(plan.current.type).toBe("streak");
  });

  it("excluye retos diarios ya completados", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: true, exam: true } },
      completedChallenges: { "dc-1": true, "dc-2": true },
      dailyChallenges: CHALLENGES,
    });
    expect(plan.steps.find((s) => s.type === "challenge")).toBeUndefined();
  });

  it("incluye recomendaciones (máx 2) después del reto", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: true, exam: true } },
      recs: {
        high: [{ type: "exams", title: "Reto M1", action: { label: "Ir" } }],
        medium: [
          {
            type: "module_score",
            title: "M2",
            action: { label: "Ir", moduleId: 2 },
          },
        ],
      },
      completedChallenges: { "dc-1": true, "dc-2": true },
      dailyChallenges: CHALLENGES,
    });
    const recSteps = plan.steps.filter((s) => s.type === "recommendation");
    expect(recSteps.length).toBe(2);
    expect(plan.current.type).toBe("recommendation");
  });

  it("todo al día: cae a 'continuar'", () => {
    const plan = buildDailyPlan({
      activeMod: 2,
      moduleProgress: { 2: { resourcesCompleted: true, exam: true } },
      recs: { high: [], medium: [] },
      completedChallenges: { "dc-1": true, "dc-2": true },
      dailyChallenges: CHALLENGES,
    });
    expect(plan.current.id).toBe("continue");
    expect(plan.total).toBe(1);
  });
});
