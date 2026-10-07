import { describe, it, expect } from "vitest";
import { refersToMissingVisual, keepSelfContained } from "../questionValidity";

const q = (question, options = ["A", "B", "C", "D"]) => ({
  question,
  options,
  correct: 0,
});

describe("refersToMissingVisual", () => {
  it("descarta la pregunta de la auditoría: la gráfica no existe", () => {
    expect(
      refersToMissingVisual(
        q(
          "La gráfica de dispersión muestra una tendencia lineal decreciente. ¿Qué correlación indica?",
        ),
      ),
    ).toBe(true);
  });

  it("descarta «según la tabla», «observa la figura» y «la imagen de arriba»", () => {
    expect(
      refersToMissingVisual(q("Según la tabla, ¿cuál es el mayor valor?")),
    ).toBe(true);
    expect(
      refersToMissingVisual(q("Observa la figura y calcula el área.")),
    ).toBe(true);
    expect(
      refersToMissingVisual(q("¿Qué animal aparece en la imagen de arriba?")),
    ).toBe(true);
  });

  it("no depende de las tildes", () => {
    expect(refersToMissingVisual(q("El grafico muestra ventas por mes."))).toBe(
      true,
    );
  });

  it("conserva preguntas que no mandan a mirar nada", () => {
    expect(refersToMissingVisual(q("¿Cuánto es 7 × 8?"))).toBe(false);
    expect(
      refersToMissingVisual(
        q("Para memorizar la tabla de multiplicar del 7, ¿qué ayuda más?"),
      ),
    ).toBe(false);
    expect(refersToMissingVisual(q("¿Qué es un mapa conceptual?"))).toBe(false);
  });

  it("conserva una tabla escrita dentro del texto (se dibuja en pantalla)", () => {
    const text =
      "Según la tabla: | x | y | |---|---| | 1 | 2 | | 2 | 4 | ¿cuál es y cuando x vale 3?";
    expect(refersToMissingVisual(q(text))).toBe(false);
  });

  it("revisa también las opciones", () => {
    expect(
      refersToMissingVisual(
        q("¿Cuál es la respuesta?", ["Mira la figura A", "2", "3", "4"]),
      ),
    ).toBe(true);
  });

  it("tolera preguntas vacías o mal formadas", () => {
    expect(refersToMissingVisual(null)).toBe(false);
    expect(refersToMissingVisual({})).toBe(false);
  });
});

describe("keepSelfContained", () => {
  it("devuelve las preguntas buenas y sus índices originales", () => {
    const list = [q("¿2+2?"), q("Según la gráfica, ¿cuánto sube?"), q("¿3+3?")];
    const { questions, indexes } = keepSelfContained(list);
    expect(questions).toHaveLength(2);
    expect(indexes).toEqual([0, 2]);
  });

  it("tolera una lista nula", () => {
    expect(keepSelfContained(null)).toEqual({ questions: [], indexes: [] });
  });
});
