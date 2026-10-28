import { describe, test, expect } from "vitest";
import { MODULE_QUESTIONS } from "../ialab";
import {
  MODULE_EXAMS,
  MODULE_EXAMS_EN,
  MODULE_EXAMS_PT,
} from "../ialabQuizData/index.js";

// La tabla MODULE_QUESTIONS alimenta el análisis de temas débiles. El modal califica
// con los bancos ialabQuizData, así que la clave de la tabla debe coincidir con la del banco.
const BANKS = { es: MODULE_EXAMS, en: MODULE_EXAMS_EN, pt: MODULE_EXAMS_PT };

describe("claves de MODULE_QUESTIONS frente a los bancos de quiz", () => {
  for (const [lang, bank] of Object.entries(BANKS)) {
    test(`idioma ${lang}: cada clave de la tabla coincide con el banco`, () => {
      const mismatches = [];
      for (const [mod, rows] of Object.entries(MODULE_QUESTIONS)) {
        const items = new Map((bank[mod] || []).map((q) => [q.id, q]));
        for (const row of rows) {
          const item = items.get(row.id);
          if (!item) {
            mismatches.push(`m${mod} ${row.id}: no existe en el banco ${lang}`);
            continue;
          }
          if (item.correctAnswer !== row.correctAnswer) {
            mismatches.push(
              `m${mod} ${row.id}: tabla ${row.correctAnswer} ≠ banco ${item.correctAnswer}`,
            );
          }
        }
      }
      expect(mismatches).toEqual([]);
    });
  }
});
