import { describe, it, expect } from "vitest";
import {
  MAX_EVAL_HISTORY,
  parseEvaluationHistory,
  recordEvaluation,
  buildAxisAverages,
} from "../evaluationHistory.js";

describe("evaluationHistory (Fase C — historial real por eje)", () => {
  it("parseEvaluationHistory tolera datos inválidos", () => {
    expect(parseEvaluationHistory(null)).toEqual([]);
    expect(parseEvaluationHistory("nope")).toEqual([]);
    expect(parseEvaluationHistory('[{"moduleId":1,"date":"2026-01-01","axes":[80]}]')).toHaveLength(1);
  });

  it("recordEvaluation añade una entrada", () => {
    const h = recordEvaluation([], {
      moduleId: 2,
      date: "2026-01-01",
      axes: [70, 80, 90],
      global: 80,
    });
    expect(h).toHaveLength(1);
    expect(h[0]).toMatchObject({ moduleId: 2, global: 80 });
  });

  it("reemplaza la entrada del mismo módulo y día", () => {
    const first = recordEvaluation([], { moduleId: 2, date: "2026-01-01", axes: [70], global: 70 });
    const second = recordEvaluation(first, { moduleId: 2, date: "2026-01-01", axes: [90], global: 90 });
    expect(second).toHaveLength(1);
    expect(second[0].global).toBe(90);
  });

  it("guarda módulos distintos del mismo día por separado", () => {
    let h = recordEvaluation([], { moduleId: 1, date: "2026-01-01", axes: [70], global: 70 });
    h = recordEvaluation(h, { moduleId: 2, date: "2026-01-01", axes: [80], global: 80 });
    expect(h).toHaveLength(2);
  });

  it("limita a MAX_EVAL_HISTORY", () => {
    let h = [];
    for (let i = 0; i < MAX_EVAL_HISTORY + 5; i += 1) {
      h = recordEvaluation(h, { moduleId: i, date: "2026-01-01", axes: [50], global: 50 });
    }
    expect(h.length).toBe(MAX_EVAL_HISTORY);
  });

  it("buildAxisAverages promedia por eje ignorando nulos", () => {
    const history = [
      { moduleId: 1, date: "a", axes: [80, 60, null], global: 70 },
      { moduleId: 2, date: "b", axes: [100, 40], global: 70 },
    ];
    const { averages, samples } = buildAxisAverages(history);
    expect(averages[0]).toBe(90);
    expect(averages[1]).toBe(50);
    expect(averages[2]).toBe(null);
    expect(samples[0]).toBe(2);
    expect(samples[2]).toBe(0);
  });
});
