import { describe, it, expect } from "vitest";
import { MODULE_CONFIG } from "../useIALabEvaluation/moduleConfig.js";

// El pedido del desafío del Módulo 5 se califica por sus cinco partes, no por su longitud.
const evaluate = (ej2) =>
  MODULE_CONFIG[5].localEvaluate({ ej1: "", ej2, ej3: "" });

describe("desafío del Módulo 5: calificación local del pedido", () => {
  it("un pedido largo pero vago saca menos que uno corto con las cinco partes", () => {
    const vague =
      "Necesito que me ayudes con una propuesta muy buena y completa que quede excelente y que convenza a todos los interesados de manera clara y profesional en todo momento posible";
    const complete =
      "Objetivo: proponer una alianza. Audiencia: la rectoría del colegio. Formato: documento de 2 páginas. Tono cercano. Sin prometer fechas.";
    expect(evaluate(complete).nota_ej2).toBeGreaterThan(
      evaluate(vague).nota_ej2,
    );
    expect(evaluate(complete).nota_ej2).toBe(100);
  });

  it("dice qué partes faltan", () => {
    const result = evaluate("Escribe una propuesta para la rectoría.");
    expect(result.feedback_ej2).toMatch(/formato/);
    expect(result.feedback_ej2).toMatch(/tono/);
  });

  it('la palabra "sin" sola no cuenta como límite', () => {
    const result = evaluate(
      "Haz una propuesta sin nada especial, de dos páginas, tono formal, para la rectoría, para qué sirve la alianza.",
    );
    expect(result.feedback_ej2).toMatch(/límites/);
  });

  it("sin resultado pegado la nota no supera 70", () => {
    const pedido =
      "Objetivo: proponer una alianza. Audiencia: la rectoría. Formato: documento de 2 páginas. Tono cercano. Sin prometer fechas.";
    const sinResultado = JSON.stringify({
      pedido,
      resultado: "",
      revision: [true, true, true],
    });
    const result = evaluate(sinResultado);
    expect(result.nota_ej2).toBeLessThanOrEqual(70);
    expect(result.feedback_ej2).toMatch(/Pega el resultado/);
  });

  it("con resultado pegado y revisado, el pedido completo llega a 100", () => {
    const pedido =
      "Objetivo: proponer una alianza. Audiencia: la rectoría. Formato: documento de 2 páginas. Tono cercano. Sin prometer fechas.";
    const resultado = Array.from({ length: 25 }, (_, i) => `palabra${i}`).join(
      " ",
    );
    const completo = JSON.stringify({
      pedido,
      resultado,
      revision: [true, true, true],
    });
    expect(evaluate(completo).nota_ej2).toBe(100);
  });

  it("los pedidos en texto plano (formato anterior) se califican igual", () => {
    const pedido =
      "Objetivo: proponer una alianza. Audiencia: la rectoría. Formato: documento de 2 páginas. Tono cercano. Sin prometer fechas.";
    expect(evaluate(pedido).nota_ej2).toBe(100);
  });

  it("un pedido vacío vale cero", () => {
    expect(evaluate("").nota_ej2).toBe(0);
  });
});
