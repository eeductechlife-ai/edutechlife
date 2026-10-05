import { describe, test, expect } from "vitest";
import { withShuffledOptions } from "../stableShuffle";

const base = {
  id: 1,
  options: ["A", "B", "C"],
  correct: 1,
};

describe("withShuffledOptions", () => {
  test("keeps the same set of options and the correct answer text", () => {
    const q = withShuffledOptions(base, 3);
    expect([...q.options].sort()).toEqual(["A", "B", "C"]);
    expect(q.options[q.correct]).toBe(base.options[base.correct]);
  });

  test("does not leave the correct answer always in the same position", () => {
    const positions = [1, 2, 3, 4, 5, 6].map(
      (seed) => withShuffledOptions(base, seed).correct,
    );
    expect(new Set(positions).size).toBeGreaterThan(1);
    expect(positions).not.toEqual([1, 1, 1, 1, 1, 1]);
  });

  test("returns the question untouched when it has no numeric correct", () => {
    const question = { options: ["A", "B"], correctAnswer: "x" };
    expect(withShuffledOptions(question, 2)).toBe(question);
  });
});
