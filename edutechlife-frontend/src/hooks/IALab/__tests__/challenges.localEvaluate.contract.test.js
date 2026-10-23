import { describe, it, expect } from "vitest";
import { MODULE_CONFIG } from "../useIALabEvaluation/moduleConfig.js";

const longText = (n) => "x ".repeat(Math.max(1, Math.floor(n / 2))).trim();

// Respuestas "buenas" en el formato exacto que espera cada localEvaluate.
const GOOD = {
  1: {
    ej1: JSON.stringify({
      rol: "Experto",
      contexto: "Empresa",
      tarea: "Crear campaña",
    }),
    ej2: longText(300),
    ej3: longText(400),
  },
  2: { ej1: longText(220), ej2: longText(260), ej3: longText(260) },
  3: {
    ej1: longText(220),
    ej2: longText(220),
    ej3: longText(260),
    ej4: longText(420),
  },
  4: {
    ej1: JSON.stringify({
      documents: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }],
    }),
    ej2: JSON.stringify({
      table: {},
      synthesis: "síntesis integradora de varios conceptos",
    }),
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
      answers: {
        t1: "review",
        t2: "delegate",
        t3: "never",
        t4: "review",
        t5: "delegate",
        t6: "never",
      },
    }),
    ej2: "Escribo un pedido para Claude con objetivo: una propuesta de dos páginas para un colegio, audiencia: la rectoría, formato: documento con portada, tono formal y cercano, y restricciones: no prometer resultados garantizados ni usar cifras sin verificar en la fuente original del proyecto.",
    ej3: "Protocolo: no compartimos datos personales ni confidenciales de los clientes con la herramienta; anonimizamos antes de subir. Verificamos cada cifra y cita en la fuente original antes de usar el resultado. La responsable revisa y firma la decisión final, y declaramos cuándo y cómo usamos IA en cada entrega.",
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
