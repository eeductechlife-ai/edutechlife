import { describe, it, expect } from "vitest";
import { analyzeCompetence } from "../competencyAnalytics.js";

describe("analyzeCompetence (Fase 6 — analítica por competencia)", () => {
  it("devuelve un resultado vacío coherente sin módulos", () => {
    const result = analyzeCompetence([]);
    expect(result.overall.average).toBe(0);
    expect(result.overall.level).toBe("explorer");
    expect(result.distribution).toEqual({ explorer: 0, creator: 0, expert: 0 });
    expect(result.strongest).toBeNull();
    expect(result.weakest).toBeNull();
  });

  it("calcula el promedio y el nivel global", () => {
    const result = analyzeCompetence([
      { id: 1, score: 90 },
      { id: 2, score: 70 },
      { id: 3, score: 80 },
    ]);
    expect(result.overall.average).toBe(80);
    expect(result.overall.level).toBe("expert");
  });

  it("asigna nivel por módulo y su distribución", () => {
    const result = analyzeCompetence([
      { id: 1, score: 40 }, // explorer
      { id: 2, score: 65 }, // creator
      { id: 3, score: 85 }, // expert
      { id: 4, score: 95 }, // expert
    ]);
    expect(result.modules.map((m) => m.level)).toEqual([
      "explorer",
      "creator",
      "expert",
      "expert",
    ]);
    expect(result.distribution).toEqual({ explorer: 1, creator: 1, expert: 2 });
  });

  it("identifica el módulo más fuerte y el más débil", () => {
    const result = analyzeCompetence([
      { id: 1, score: 55 },
      { id: 2, score: 88 },
      { id: 3, score: 30 },
    ]);
    expect(result.strongest).toMatchObject({ id: 2, score: 88 });
    expect(result.weakest).toMatchObject({ id: 3, score: 30 });
  });

  it("sanea puntajes no numéricos o fuera de rango", () => {
    const result = analyzeCompetence([
      { id: 1, score: NaN },
      { id: 2, score: 150 },
      { id: 3, score: -20 },
      { id: 4, score: undefined },
    ]);
    expect(result.modules.map((m) => m.score)).toEqual([0, 100, 0, 0]);
  });
});
