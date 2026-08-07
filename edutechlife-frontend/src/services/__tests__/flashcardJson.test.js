import { describe, it, expect } from "vitest";
import { parseJsonResult } from "../../utils/api";
import { normalizeCards } from "../flashcard/generator";

describe("parseJsonResult — parser tolerante a JSON de IA", () => {
  it("parsea JSON limpio", () => {
    expect(parseJsonResult('[{"a":1}]')).toEqual([{ a: 1 }]);
  });

  it("parsea JSON con code fences", () => {
    const raw = '```json\n{"flashcards": []}\n```';
    expect(parseJsonResult(raw)).toEqual({ flashcards: [] });
  });

  it("repara comas finales", () => {
    const raw = '[{"a":1},{"b":2},]';
    expect(parseJsonResult(raw)).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("extrae JSON dentro de texto sobrante", () => {
    const raw = 'Aquí tienes: {"flashcards": [{"keyword": "x"}]} fin';
    expect(parseJsonResult(raw)).toEqual({
      flashcards: [{ keyword: "x" }],
    });
  });

  it("devuelve null para texto sin JSON", () => {
    expect(parseJsonResult("lo siento no pude")).toBeNull();
  });
});

describe("normalizeCards — acepta arrays y objetos contenedores", () => {
  const card = { keyword: "k", definition: "d", example: "e" };

  it("devuelve el array tal cual", () => {
    expect(normalizeCards([card])).toEqual([card]);
  });

  it("extrae array de objeto flashcards", () => {
    expect(normalizeCards({ flashcards: [card] })).toEqual([card]);
  });

  it("extrae array de objeto cards/result/data", () => {
    expect(normalizeCards({ cards: [card] })).toEqual([card]);
    expect(normalizeCards({ result: [card] })).toEqual([card]);
    expect(normalizeCards({ data: { items: [card] } })).toEqual([card]);
  });

  it("devuelve null sin array utilizable", () => {
    expect(normalizeCards({ error: "no" })).toBeNull();
    expect(normalizeCards(null)).toBeNull();
    expect(normalizeCards("texto")).toBeNull();
  });
});
