import { describe, it, expect } from "vitest";
import { MODULE_CONFIG } from "../useIALabEvaluation/moduleConfig.js";

const longText = (n) => "x ".repeat(Math.max(1, Math.floor(n / 2))).trim();

// Respuestas "buenas" en el formato exacto que espera cada localEvaluate.
const GOOD = {
  1: {
    ej1: JSON.stringify({ rol: "Experto", contexto: "Empresa", tarea: "Crear campaña" }),
    ej2: longText(300),
    ej3: longText(400),
  },
  2: { ej1: longText(220), ej2: longText(260), ej3: longText(260) },
  3: { ej1: longText(220), ej2: longText(220), ej3: longText(260), ej4: longText(420) },
  4: {
    ej1: JSON.stringify({
      documents: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }],
    }),
    ej2: JSON.stringify({ table: {}, synthesis: "síntesis integradora de varios conceptos" }),
    ej3: JSON.stringify({
      hook: "un gancho completo de prueba",
      evidencia: "evidencia de prueba suficiente",
      transicion: "transición bien redactada",
      cierre: "cierre claro del guión",
      quiz: [true, true],
    }),
  },
  5: {
    ej1: JSON.stringify({
      biases: [
        { index: 1, justification: "justificación amplia con evidencia del caso", pipeline: "data", severity: 1 },
        { index: 2, justification: "otra justificación extensa y razonada", pipeline: "model", severity: 2 },
      ],
    }),
    ej2: JSON.stringify({
      impact: { candidates: "afecta a muchos candidatos en el proceso", company: "la empresa pierde talento valioso", society: "se mantiene la desigualdad social" },
      rootCauses: {
        c1: { justification: "causa técnica ampliamente justificada en los datos", biasIndexes: [1] },
        c2: { justification: "causa humana explicada con detalle suficiente", biasIndexes: [2] },
      },
      severityMatrix: { a: 1, b: 2, c: 3, d: 1, e: 2, f: 3 },
    }),
    ej3: JSON.stringify({
      principles: [{ id: 1, relevance: "importante por la equidad del sistema" }],
      actions: [
        { biasIndex: 1, measure: "una medida de mitigación con detalle y plazo concreto", type: "mitigation", timeline: "2026" },
        { biasIndex: 2, measure: "otra acción de monitoreo con descripción amplia", type: "monitoring", timeline: "2026" },
      ],
    }),
  },
};

const STEP_COUNTS = { 1: 3, 2: 3, 3: 4, 4: 3, 5: 3 };

describe("Desafíos IALab — contrato localEvaluate por módulo", () => {
  for (const m of [1, 2, 3, 4, 5]) {
    it(`módulo ${m}: 1 buen intento se aprueba (>=80) sin errores`, () => {
      expect(MODULE_CONFIG[m].totalSteps).toBe(STEP_COUNTS[m]);
      const r = MODULE_CONFIG[m].localEvaluate(GOOD[m]);
      expect(r.notaGlobal).toBeGreaterThanOrEqual(80);
      expect(r.notaGlobal).toBeLessThanOrEqual(100);
    });

    it(`módulo ${m}: respuestas vacías no revientan y dan nota <=100`, () => {
      const r = MODULE_CONFIG[m].localEvaluate({});
      expect(typeof r.notaGlobal).toBe("number");
      expect(r.notaGlobal).toBeGreaterThanOrEqual(0);
      expect(r.notaGlobal).toBeLessThanOrEqual(100);
    });
  }

  it("expone generate/evaluate/fallback por módulo", () => {
    for (const m of [1, 2, 3, 4, 5]) {
      expect(typeof MODULE_CONFIG[m].generateSystemPrompt).toBe("function");
      expect(typeof MODULE_CONFIG[m].evaluateSystemPrompt).toBe("function");
      expect(typeof MODULE_CONFIG[m].fallbackExercises).toBe("function");
      expect(typeof MODULE_CONFIG[m].localEvaluate).toBe("function");
      expect(MODULE_CONFIG[m].name.es).toBeTruthy();
    }
  });
});
