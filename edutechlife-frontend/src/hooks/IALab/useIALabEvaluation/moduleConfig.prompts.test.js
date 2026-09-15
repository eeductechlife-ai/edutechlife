import { describe, it, expect } from "vitest";
import { MODULE_CONFIG } from "./moduleConfig.js";
import { STEP_EXERCISE_KEYS } from "../../../components/IALab/IALabEvaluationModal/components/stepExerciseResolvers.js";

describe("fallbackExercises — completos por módulo", () => {
  for (const m of [1, 2, 3, 4, 5]) {
    it(`módulo ${m}: contiene todas las claves canónicas y arrays no vacíos`, () => {
      const ex = MODULE_CONFIG[m].fallbackExercises("es");
      for (const key of STEP_EXERCISE_KEYS[m]) {
        expect(ex).toHaveProperty(key);
        const value = ex[key];
        if (Array.isArray(value)) {
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });
  }
});

describe("generateUserPrompt — pide información suficiente para responder", () => {
  for (const m of [2, 3, 4]) {
    it(`módulo ${m}: exige contexto suficiente / sin ambigüedad`, () => {
      const prompt = MODULE_CONFIG[m].generateUserPrompt("es");
      expect(prompt).toMatch(/suficiente|sin ambigüedad/i);
    });
  }
});
