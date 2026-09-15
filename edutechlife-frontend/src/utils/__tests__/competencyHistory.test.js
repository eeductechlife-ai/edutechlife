import { describe, it, expect } from "vitest";
import {
  MAX_HISTORY,
  parseHistory,
  recordSnapshot,
  buildTrend,
} from "../competencyHistory.js";

const snap = (date, average, scores) => ({
  date,
  average,
  scores,
});

describe("competencyHistory (Fase C — analítica histórica)", () => {
  it("parseHistory tolera datos inválidos", () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory("nope")).toEqual([]);
    expect(parseHistory('[{"date":"2026-01-01","average":80}]')).toHaveLength(1);
  });

  it("recordSnapshot añade una entrada nueva", () => {
    const history = recordSnapshot([], snap("2026-01-01", 70, [70, 70, 70, 70, 70]));
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ date: "2026-01-01", average: 70 });
  });

  it("no duplica la misma fecha con el mismo promedio", () => {
    const first = recordSnapshot([], snap("2026-01-01", 70, [70, 70, 70, 70, 70]));
    const second = recordSnapshot(first, snap("2026-01-01", 70, [70, 70, 70, 70, 70]));
    expect(second).toHaveLength(1);
  });

  it("actualiza la entrada del mismo día si el promedio cambia", () => {
    const first = recordSnapshot([], snap("2026-01-01", 70, [70, 70, 70, 70, 70]));
    const second = recordSnapshot(first, snap("2026-01-01", 85, [85, 85, 85, 85, 85]));
    expect(second).toHaveLength(1);
    expect(second[0].average).toBe(85);
  });

  it("limita el historial a MAX_HISTORY entradas", () => {
    let history = [];
    for (let i = 0; i < MAX_HISTORY + 10; i += 1) {
      history = recordSnapshot(history, snap(`2026-01-${String((i % 28) + 1).padStart(2, "0")}-${i}`, 50 + i, []));
    }
    expect(history.length).toBe(MAX_HISTORY);
  });

  it("buildTrend devuelve puntos en orden cronológico ascendente", () => {
    const history = [
      snap("2026-01-02", 80, []),
      snap("2026-01-01", 60, []),
    ];
    const trend = buildTrend(history);
    expect(trend.map((p) => p.average)).toEqual([60, 80]);
    expect(trend[0].date).toBe("2026-01-01");
  });
});
