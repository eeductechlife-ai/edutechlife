import { describe, it, expect } from "vitest";
import { MODULE_4 } from "../module4.js";

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

describe("MODULE_4 (examen / mi reto)", () => {
  it("tiene exactamente 10 preguntas", () => {
    expect(MODULE_4).toHaveLength(10);
  });

  it("tiene ids únicos y estructura válida", () => {
    const ids = MODULE_4.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of MODULE_4) {
      expect(q.question && q.question.trim().length).toBeGreaterThan(10);
      expect(q.options).toHaveLength(4);
      expect(q.options.map((o) => o.id)).toContain(q.correctAnswer);
      expect(q.topic).toBeTruthy();
      expect(q.source).toBeTruthy();
    }
  });

  it("evita que la opción correcta sea desproporcionadamente larga", () => {
    for (const q of MODULE_4) {
      const correct = q.options.find((o) => o.id === q.correctAnswer);
      const others = q.options.filter((o) => o.id !== q.correctAnswer);
      const shortest = Math.min(...others.map((o) => words(o.label)));
      const correctWords = words(correct.label);
      expect(correctWords, `longitud correcta muy larga en ${q.id}`).toBeLessThanOrEqual(
        shortest * 1.6 + 2,
      );
    }
  });
});
