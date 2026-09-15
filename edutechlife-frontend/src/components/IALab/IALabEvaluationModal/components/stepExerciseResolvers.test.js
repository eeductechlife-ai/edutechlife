import { describe, it, expect } from "vitest";
import { resolveDocuments, resolveStepExercise } from "./stepExerciseResolvers.js";

describe("resolveDocuments", () => {
  it("prefiere el objeto completo (exercises.documentos)", () => {
    const docs = [{ titulo: "a" }];
    expect(
      resolveDocuments({ exercises: { documentos: docs }, exercise: ["x"] }),
    ).toBe(docs);
  });

  it("usa exercises.conceptos del objeto completo", () => {
    const docs = [{ titulo: "c" }];
    expect(
      resolveDocuments({ exercises: { conceptos: docs }, exercise: ["x"] }),
    ).toBe(docs);
  });

  it("cae al slice cuando exercise es el array (módulos 3/4)", () => {
    const docs = [{ titulo: "a" }];
    expect(resolveDocuments({ exercises: {}, exercise: docs })).toBe(docs);
  });

  it("lee exercise.conceptos cuando exercise es objeto", () => {
    const docs = [{ titulo: "a" }];
    expect(
      resolveDocuments({ exercises: {}, exercise: { conceptos: docs } }),
    ).toBe(docs);
  });

  it("devuelve [] si no hay nada", () => {
    expect(resolveDocuments({})).toEqual([]);
    expect(resolveDocuments()).toEqual([]);
    expect(resolveDocuments({ exercises: {}, exercise: "texto" })).toEqual([]);
  });
});

describe("resolveStepExercise", () => {
  it("resuelve por clave canónica aunque el objeto venga en otro orden", () => {
    const exercises = { functionCallSpec: "c", casoUso: "a", gptConfig: "b" };
    expect(resolveStepExercise(exercises, 2, 1)).toBe("a");
    expect(resolveStepExercise(exercises, 2, 2)).toBe("b");
    expect(resolveStepExercise(exercises, 2, 3)).toBe("c");
  });

  it("cae al orden posicional si la clave canónica no existe", () => {
    const exercises = { foo: "1", bar: "2" };
    expect(resolveStepExercise(exercises, 2, 1)).toBe("1");
    expect(resolveStepExercise(exercises, 2, 2)).toBe("2");
  });

  it("devuelve el objeto completo si el paso excede las claves", () => {
    const exercises = { a: 1 };
    expect(resolveStepExercise(exercises, 2, 3)).toBe(exercises);
  });

  it("soporta los 5 módulos por su clave canónica", () => {
    expect(
      resolveStepExercise({ fuentes: ["f"], temaInvestigacion: "t" }, 3, 2),
    ).toEqual(["f"]);
    expect(
      resolveStepExercise({ guionTemplate: { x: 1 }, conceptos: [] }, 4, 3),
    ).toEqual({ x: 1 });
  });
});
