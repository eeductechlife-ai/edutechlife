import { describe, it, expect } from "vitest";
import { normalizePlan, planFromAnalysis } from "../planModel";

describe("normalizePlan", () => {
  it("keeps valid weeks and resets nothing the kid already ticked", () => {
    const plan = normalizePlan({
      weeks: [
        {
          week: 1,
          title: "Arranque",
          activities: [
            {
              titulo: "Repasa fracciones",
              duracion: "15 min",
              tipo: "Visual",
              done: true,
            },
            { titulo: "" },
          ],
        },
      ],
      topActions: ["a", "b", "c", "d"],
    });
    expect(plan.weeks).toHaveLength(1);
    expect(plan.weeks[0].activities).toEqual([
      {
        titulo: "Repasa fracciones",
        duracion: "15 min",
        tipo: "visual",
        done: true,
      },
    ]);
    expect(plan.topActions).toHaveLength(3);
  });

  it("survives half-answered AI output instead of crashing the view", () => {
    expect(normalizePlan(null)).toBeNull();
    expect(normalizePlan({ weeks: [{ title: "sin actividades" }] })).toBeNull();
    const plan = normalizePlan({
      weeks: [{ activities: "no es lista" }, { activities: ["Lee 10 min"] }],
    });
    expect(plan.weeks).toHaveLength(1);
    expect(plan.weeks[0].week).toBe(1);
    expect(plan.weeks[0].activities[0]).toEqual({
      titulo: "Lee 10 min",
      done: false,
    });
  });
});

describe("planFromAnalysis", () => {
  it("turns the Notas analysis into a trackable plan", () => {
    const plan = planFromAnalysis({
      topActions: ["Repasa tablas"],
      weaknesses: [{ subject: "Matemáticas" }, { subject: "Inglés" }],
      studyPlan: [
        {
          week: 1,
          focus: "Matemáticas",
          activities: ["Tablas del 6", "Juego de fracciones"],
          daniTip: "¡Tú puedes!",
        },
        { week: 2, focus: "Inglés", activities: [] },
      ],
    });
    expect(plan.source).toBe("notas");
    expect(plan.weeks).toHaveLength(1);
    expect(plan.weeks[0].title).toBe("Enfócate en Matemáticas");
    expect(plan.weeks[0].danTip).toBe("¡Tú puedes!");
    expect(plan.weakSubjects).toEqual(["Matemáticas", "Inglés"]);
  });

  it("returns null when the analysis has no weekly plan", () => {
    expect(planFromAnalysis({ overall: "Bien" })).toBeNull();
  });
});
