import { describe, it, expect } from "vitest";
import {
  AGE_OPTIONS,
  GRADE_OPTIONS,
  expectedGradeRange,
  validateAgeGrade,
  challengeGrade,
  ageGroupFor,
  effectiveGrade,
} from "../studentLevel";

describe("listas cerradas", () => {
  it("edades 8–16 y grados 3.º–11.º", () => {
    expect(AGE_OPTIONS[0]).toBe(8);
    expect(AGE_OPTIONS.at(-1)).toBe(16);
    expect(GRADE_OPTIONS[0]).toBe(3);
    expect(GRADE_OPTIONS.at(-1)).toBe(11);
  });
});

describe("expectedGradeRange", () => {
  it("a los 12 años lo habitual es 6.º o 7.º", () => {
    expect(expectedGradeRange(12)).toEqual({ min: 6, max: 7 });
  });
  it("no sale de 1–11", () => {
    expect(expectedGradeRange(5)).toEqual({ min: 1, max: 1 });
    expect(expectedGradeRange(20)).toEqual({ min: 11, max: 11 });
  });
  it("sin edad válida no hay rango", () => {
    expect(expectedGradeRange(null)).toBeNull();
    expect(expectedGradeRange("abc")).toBeNull();
  });
});

describe("validateAgeGrade", () => {
  it("acepta parejas habituales y con un grado de margen", () => {
    expect(validateAgeGrade(12, 6).ok).toBe(true);
    expect(validateAgeGrade(12, 7).ok).toBe(true);
    expect(validateAgeGrade(12, 5).ok).toBe(true);
    expect(validateAgeGrade(12, 8).ok).toBe(true);
    expect(validateAgeGrade(8, 3).ok).toBe(true);
    expect(validateAgeGrade(16, 11).ok).toBe(true);
  });

  it("rechaza 12 años en 9.º (el caso de la auditoría) con un mensaje claro", () => {
    const r = validateAgeGrade(12, 9);
    expect(r.ok).toBe(false);
    expect(r.field).toBe("pair");
    expect(r.message).toBe(
      "A los 12 años lo habitual es 6.º o 7.º. Revisa la edad o el grado.",
    );
  });

  it("rechaza edades y grados fuera de rango o mal escritos", () => {
    expect(validateAgeGrade(7, 3)).toMatchObject({ ok: false, field: "age" });
    expect(validateAgeGrade(17, 11)).toMatchObject({ ok: false, field: "age" });
    expect(validateAgeGrade("", 6)).toMatchObject({ ok: false, field: "age" });
    expect(validateAgeGrade(12, 2)).toMatchObject({
      ok: false,
      field: "grade",
    });
    expect(validateAgeGrade(12, 12)).toMatchObject({
      ok: false,
      field: "grade",
    });
    expect(validateAgeGrade(12, "6B")).toMatchObject({
      ok: false,
      field: "grade",
    });
  });
});

describe("challengeGrade", () => {
  it("usa el grado del perfil cuando cuadra con la edad", () => {
    expect(challengeGrade({ grade: 7, age: 12, difficulty: "medium" })).toBe(7);
    expect(challengeGrade({ grade: 7, age: 12, difficulty: "hard" })).toBe(7);
  });

  it("«Fácil» baja un grado", () => {
    expect(challengeGrade({ grade: 7, age: 12, difficulty: "easy" })).toBe(6);
  });

  it("si el grado no cuadra con la edad manda la edad (12 años, 9.º)", () => {
    expect(challengeGrade({ grade: 9, age: 12, difficulty: "medium" })).toBe(7);
    expect(challengeGrade({ grade: 9, age: 12, difficulty: "easy" })).toBe(6);
  });

  it("sin grado se deduce de la edad; sin nada, 5.º", () => {
    expect(challengeGrade({ grade: null, age: 12, difficulty: "medium" })).toBe(
      7,
    );
    expect(
      challengeGrade({ grade: null, age: null, difficulty: "medium" }),
    ).toBe(5);
  });

  it("nunca baja de 1.º", () => {
    expect(
      challengeGrade({ grade: 1, age: 8, difficulty: "easy" }),
    ).toBeGreaterThanOrEqual(1);
  });
});

describe("ageGroupFor", () => {
  it("separa early (hasta 8), middle (9–12) y senior (13+)", () => {
    expect(ageGroupFor(8)).toBe("early");
    expect(ageGroupFor(9)).toBe("middle");
    expect(ageGroupFor(12)).toBe("middle");
    expect(ageGroupFor(13)).toBe("senior");
  });

  it("sin edad registrada no se trata como un niño de 8 años", () => {
    expect(ageGroupFor(null)).toBe("middle");
    expect(ageGroupFor(undefined)).toBe("middle");
    expect(ageGroupFor("")).toBe("middle");
    expect(ageGroupFor(0)).toBe("middle");
  });
});

describe("effectiveGrade", () => {
  it("respeta el grado del perfil si cuadra con la edad", () => {
    expect(effectiveGrade(7, 12)).toBe(7);
    expect(effectiveGrade("8", 12)).toBe(8);
  });
  it("si no cuadra manda la edad (12 años en 9.º → 7.º)", () => {
    expect(effectiveGrade(9, 12)).toBe(7);
  });
  it("sin grado se deduce de la edad; sin ninguno es null", () => {
    expect(effectiveGrade(null, 12)).toBe(7);
    expect(effectiveGrade(null, null)).toBeNull();
    expect(effectiveGrade(6, null)).toBe(6);
  });
});
