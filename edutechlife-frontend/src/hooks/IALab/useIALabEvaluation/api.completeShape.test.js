import { describe, it, expect } from "vitest";
import { completeExercisesShape } from "./api.js";

describe("completeExercisesShape", () => {
  it("rellena las claves ausentes desde el fallback", () => {
    const fallback = { casoUso: "A", gptConfig: "B", functionCallSpec: "C" };
    const result = completeExercisesShape({ casoUso: "custom" }, fallback);
    expect(result).toEqual({
      casoUso: "custom",
      gptConfig: "B",
      functionCallSpec: "C",
    });
  });

  it("no sobrescribe valores ya presentes", () => {
    const fallback = { a: "fallback", b: "fallback" };
    const result = completeExercisesShape({ a: "mine", b: "" }, fallback);
    expect(result.a).toBe("mine");
    expect(result.b).toBe("");
  });

  it("rellena valores null o undefined con el fallback", () => {
    const result = completeExercisesShape({ a: null, b: undefined }, { a: "A", b: "B" });
    expect(result).toEqual({ a: "A", b: "B" });
  });

  it("devuelve tal cual si no es objeto", () => {
    expect(completeExercisesShape(null, { a: 1 })).toBeNull();
    expect(completeExercisesShape("x", { a: 1 })).toBe("x");
  });

  it("sin fallback no altera el objeto", () => {
    expect(completeExercisesShape({ a: 1 })).toEqual({ a: 1 });
  });
});
