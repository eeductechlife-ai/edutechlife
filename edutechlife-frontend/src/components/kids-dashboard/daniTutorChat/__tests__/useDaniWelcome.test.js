import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useDaniWelcome, { pickWelcomeSuggestion } from "../useDaniWelcome";

const missions = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  title: `Misión ${i}`,
  completed: false,
}));

describe("pickWelcomeSuggestion: una sola sugerencia", () => {
  it("lo de hoy va primero", () => {
    expect(
      pickWelcomeSuggestion({
        todayEvents: [{ title: "Examen de Inglés" }],
        lowProgress: [{ name: "Matemáticas" }],
        pendingMissions: missions,
        hasVak: false,
      }),
    ).toBe(
      "Hoy tienes agendado: Examen de Inglés. ¿Cómo te sientes al respecto?",
    );
  });

  it("sin eventos sugiere la materia que necesita práctica", () => {
    expect(
      pickWelcomeSuggestion({
        lowProgress: [{ name: "Matemáticas" }],
        pendingMissions: missions,
        hasVak: false,
      }),
    ).toContain("Matemáticas necesita un poco más de práctica");
  });

  it("las misiones se cuentan, no se enumeran (antes salían 3 nombres y «y más»)", () => {
    const s = pickWelcomeSuggestion({ pendingMissions: missions });
    expect(s).toBe("Tienes 9 misiones pendientes. ¿Quieres empezar por una?");
    expect(s).not.toContain("Misión 0");
  });

  it("una misión en singular", () => {
    expect(pickWelcomeSuggestion({ pendingMissions: [missions[0]] })).toBe(
      "Tienes 1 misión pendiente. ¿La hacemos juntos?",
    );
  });

  it("el ADN solo se menciona al final y como invitación", () => {
    expect(pickWelcomeSuggestion({ hasVak: false })).toMatch(
      /ADN de Aprendizaje/,
    );
    expect(pickWelcomeSuggestion({ hasVak: true })).toBe("");
  });
});

describe("saludo de Dani", () => {
  const render = (over = {}) =>
    renderHook(() =>
      useDaniWelcome({
        streak: { current: 0 },
        vakResult: null,
        calendarEvents: [],
        activeTab: "inicio",
        t: (k) => k,
        missions,
        subjects: [{ name: "Matemáticas", progress: 30 }],
        documentForDani: null,
        studentAge: 13,
        ...over,
      }),
    ).result.current();

  it("no mezcla misiones, materias y ADN en el mismo saludo", () => {
    const greeting = render();
    expect(greeting).toContain("Matemáticas necesita un poco más de práctica");
    expect(greeting).not.toMatch(/misiones pendientes/);
    expect(greeting).not.toMatch(/ADN/);
    expect(greeting.match(/¿/g).length).toBeLessThanOrEqual(2);
  });
});
