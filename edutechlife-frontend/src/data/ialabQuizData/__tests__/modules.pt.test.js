import { describe, it, expect } from "vitest";
import { MODULE_1_PT } from "../module1.pt.js";
import { MODULE_2_PT } from "../module2.pt.js";
import { MODULE_3_PT } from "../module3.pt.js";
import { MODULE_4_PT } from "../module4.pt.js";
import { MODULE_5_PT } from "../module5.pt.js";

const modules = [
  MODULE_1_PT,
  MODULE_2_PT,
  MODULE_3_PT,
  MODULE_4_PT,
  MODULE_5_PT,
];
// Tamanho do banco por módulo (amplia-se para 40 conforme se traduz cada um).
const EXPECTED_COUNTS = [40, 40, 40, 40, 40];
const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

describe("Exámenes PT (checkpoints) módulos 1-5", () => {
  it("cada módulo tiene el tamaño de banco esperado", () => {
    modules.forEach((mod, i) => expect(mod).toHaveLength(EXPECTED_COUNTS[i]));
  });

  it("estrutura válida (ids únicos, 4 opções, correta presente, source)", () => {
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

  it("evita opções corretas desproporcionalmente longas", () => {
    for (const mod of modules) {
      for (const q of mod) {
        const correct = q.options.find((o) => o.id === q.correctAnswer);
        const others = q.options.filter((o) => o.id !== q.correctAnswer);
        const shortest = Math.min(...others.map((o) => words(o.label)));
        const correctWords = words(correct.label);
        expect(correctWords, `opção correta longa em ${q.id}`).toBeLessThanOrEqual(
          shortest * 1.6 + 2,
        );
      }
    }
  });
});
