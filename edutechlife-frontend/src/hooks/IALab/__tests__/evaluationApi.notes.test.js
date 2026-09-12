import { evaluateAnswers } from "../useIALabEvaluation/api.js";

const makeResponse = (obj) => ({
  ok: true,
  json: async () => ({ result: JSON.stringify(obj) }),
});

const makeConfig = (totalSteps) => ({
  totalSteps,
  evaluateSystemPrompt: () => "system",
  evaluateUserPrompt: () => "user",
});

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("evaluateAnswers — número de ejercicios según los pasos del módulo", () => {
  test("módulo de 3 pasos: descarta una nota_ej4 fantasma y recalcula la global", async () => {
    fetch.mockResolvedValue(
      makeResponse({
        nota_ej1: 80,
        nota_ej2: 60,
        nota_ej3: 100,
        nota_ej4: 0,
        notaGlobal: 60,
        feedback_ej1: "a",
        feedback_ej2: "b",
        feedback_ej3: "c",
        feedback_ej4: "d",
      }),
    );

    const r = await evaluateAnswers({
      config: makeConfig(3),
      exercises: {},
      responses: {},
    });

    expect(r.nota_ej1).toBe(80);
    expect(r.nota_ej2).toBe(60);
    expect(r.nota_ej3).toBe(100);
    expect(r.nota_ej4).toBeUndefined();
    // (80 + 60 + 100) / 3 = 80 — no la 60 que devolvió la IA con un 4º en 0.
    expect(r.notaGlobal).toBe(80);
  });

  test("módulo de 4 pasos: conserva nota_ej4 y promedia sobre 4", async () => {
    fetch.mockResolvedValue(
      makeResponse({
        nota_ej1: 100,
        nota_ej2: 100,
        nota_ej3: 100,
        nota_ej4: 60,
      }),
    );

    const r = await evaluateAnswers({
      config: makeConfig(4),
      exercises: {},
      responses: {},
    });

    expect(r.nota_ej4).toBe(60);
    expect(r.notaGlobal).toBe(90);
  });

  test("notas faltantes se completan solo hasta los pasos del módulo", async () => {
    fetch.mockResolvedValue(
      makeResponse({ nota_ej1: 100, nota_ej2: 100, nota_ej3: 100 }),
    );

    const r = await evaluateAnswers({
      config: makeConfig(3),
      exercises: {},
      responses: {},
    });

    expect(r.nota_ej1).toBe(100);
    expect(r.nota_ej2).toBe(100);
    expect(r.nota_ej3).toBe(100);
    expect(r.nota_ej4).toBeUndefined();
    expect(r.notaGlobal).toBe(100);
  });
});
