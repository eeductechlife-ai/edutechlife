import { describe, it, expect } from "vitest";
import { MODULE_1_EN } from "../module1.en.js";
import { MODULE_2_EN } from "../module2.en.js";
import { MODULE_3_EN } from "../module3.en.js";
import { MODULE_4_EN } from "../module4.en.js";
import { MODULE_5_EN } from "../module5.en.js";

const modules = [
  MODULE_1_EN,
  MODULE_2_EN,
  MODULE_3_EN,
  MODULE_4_EN,
  MODULE_5_EN,
];
const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

describe("Exámenes EN (checkpoints) módulos 1-5", () => {
  it("cada módulo tiene exactamente 10 preguntas", () => {
    for (const mod of modules) expect(mod).toHaveLength(10);
  });

  it("estructura válida (ids únicos, 4 opciones, correcta presente, source)", () => {
    for (const mod of modules) {
      const ids = mod.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const q of mod) {
        expect(q.question && q.question.trim().length).toBeGreaterThan(10);
        expect(q.options).toHaveLength(4);
        expect(q.options.map((o) => o.id)).toContain(q.correctAnswer);
        expect(q.topic).toBeTruthy();
        expect(q.source).toBeTruthy();
      }
    }
  });

  it("evita opciones correctas desproporcionadamente largas", () => {
    for (const mod of modules) {
      for (const q of mod) {
        const correct = q.options.find((o) => o.id === q.correctAnswer);
        const others = q.options.filter((o) => o.id !== q.correctAnswer);
        const shortest = Math.min(...others.map((o) => words(o.label)));
        const correctWords = words(correct.label);
        expect(correctWords, `longitud correcta larga en ${q.id}`).toBeLessThanOrEqual(
          shortest * 1.6 + 2,
        );
      }
    }
  });
});
