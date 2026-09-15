import { describe, it, expect } from "vitest";
import {
  questionWeight,
  calculateWeightedScore,
  pickRandomQuestions,
} from "../scoring";

const q = (id, difficulty, correctAnswer = "a") => ({
  id,
  difficulty,
  correctAnswer,
  options: [{ id: "a" }, { id: "b" }],
});

describe("questionWeight — peso por dificultad", () => {
  it("asigna pesos crecientes por dificultad (es/en/pt)", () => {
    expect(questionWeight(q("1", "fácil"))).toBe(1);
    expect(questionWeight(q("2", "medio"))).toBe(2);
    expect(questionWeight(q("3", "difícil"))).toBe(3);
    expect(questionWeight(q("4", "easy"))).toBe(1);
    expect(questionWeight(q("5", "medium"))).toBe(2);
    expect(questionWeight(q("6", "hard"))).toBe(3);
    expect(questionWeight(q("7", "médio"))).toBe(2);
  });

  it("usa peso 1 si la dificultad es desconocida", () => {
    expect(questionWeight(q("x", "experto"))).toBe(1);
    expect(questionWeight({})).toBe(1);
  });
});

describe("calculateWeightedScore", () => {
  const questions = [
    q("a", "fácil"), // 1
    q("b", "medio"), // 2
    q("c", "difícil"), // 3  → total 6
  ];

  it("pondera por dificultad: acertar la difícil vale más", () => {
    const r = calculateWeightedScore(questions, { a: "a", b: "a", c: "a" });
    expect(r.earned).toBe(6);
    expect(r.score).toBe(100);
    expect(r.passed).toBe(true);
  });

  it("fallar la difícil baja más la nota que fallar la fácil", () => {
    const missHard = calculateWeightedScore(questions, {
      a: "a",
      b: "a",
      c: "WRONG",
    });
    const missEasy = calculateWeightedScore(questions, {
      a: "WRONG",
      b: "a",
      c: "a",
    });
    expect(missHard.score).toBe(50); // 3/6
    expect(missEasy.score).toBe(83); // 5/6
    expect(missEasy.score).toBeGreaterThan(missHard.score);
  });

  it("devuelve contadores, fallos y aprobación (umbral 80)", () => {
    const r = calculateWeightedScore(questions, { a: "a", b: "a", c: "WRONG" });
    expect(r.correctCount).toBe(2);
    expect(r.failedQuestions).toEqual(["c"]);
    expect(r.passed).toBe(false);
    expect(r.neededToPass).toBe(3);
  });

  it("no revienta con banco vacío", () => {
    const r = calculateWeightedScore([], {});
    expect(r.score).toBe(0);
    expect(r.passed).toBe(false);
    expect(r.failedQuestions).toEqual([]);
  });
});

describe("pickRandomQuestions — ruleta", () => {
  const bank = Array.from({ length: 40 }, (_, i) => ({ id: `q${i}` }));

  it("elige exactamente N preguntas distintas del banco", () => {
    const picked = pickRandomQuestions(bank, 10);
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((q) => q.id)).size).toBe(10);
    picked.forEach((q) => expect(bank).toContainEqual(q));
  });

  it("devuelve todo el banco si tiene menos que N", () => {
    const small = [{ id: "a" }, { id: "b" }];
    expect(pickRandomQuestions(small, 10)).toHaveLength(2);
  });

  it("es determinista con un rng inyectado y no muta el banco", () => {
    const frozen = JSON.stringify(bank);
    const rng = () => 0.5;
    const a = pickRandomQuestions(bank, 10, rng);
    const b = pickRandomQuestions(bank, 10, rng);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    expect(JSON.stringify(bank)).toBe(frozen);
  });
});
