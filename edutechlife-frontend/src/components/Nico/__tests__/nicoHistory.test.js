import { describe, it, expect } from "vitest";
import { buildNicoHistory } from "../nicoHistory";

const u = (content) => ({ role: "user", content });
const a = (content, extra = {}) => ({ role: "assistant", content, ...extra });

describe("buildNicoHistory", () => {
  it("empieza en el primer mensaje del usuario, sin saludos previos del asistente", () => {
    const h = buildNicoHistory([
      a("¡Hola! Soy Nico."),
      u("¿cuánto cuesta?"),
      a("Depende del plan."),
    ]);
    expect(h[0]).toEqual({ role: "user", content: "¿cuánto cuesta?" });
    expect(h).toHaveLength(2);
  });

  it("conserva solo los últimos turnos", () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      i % 2 ? a(`r${i}`) : u(`q${i}`),
    );
    const h = buildNicoHistory(many, { limit: 10 });
    expect(h).toHaveLength(10);
    expect(h.at(-1).content).toBe("r29");
  });

  it("recorta cada turno para que el costo no crezca sin control", () => {
    const h = buildNicoHistory([u("x".repeat(5000))], { maxChars: 100 });
    expect(h[0].content).toHaveLength(100);
  });

  it("omite el placeholder de streaming y los textos vacíos", () => {
    const h = buildNicoHistory([
      u("hola"),
      a("", { isStreaming: true }),
      a("   "),
      a("listo"),
    ]);
    expect(h.map((m) => m.content)).toEqual(["hola", "listo"]);
  });

  it("no revienta con datos inesperados", () => {
    expect(buildNicoHistory(undefined)).toEqual([]);
    expect(
      buildNicoHistory([
        null,
        { role: "system", content: "x" },
        { content: 5 },
      ]),
    ).toEqual([]);
  });
});
