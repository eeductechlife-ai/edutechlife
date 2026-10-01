import { describe, test, expect } from "vitest";
import { calculateDiagnosis } from "../useDiagnosticoVAK/calculations";
import { getQuestionsByAge } from "../../../data/vakQuestions";

const answer = (type, index = 0) => ({ index, text: `t-${type}`, type });

const base = (answers, questions = getQuestionsByAge(12)) =>
  calculateDiagnosis({
    answers,
    studentName: "Ana",
    studentAge: "12",
    studentMood: "happy",
    parentName: "",
    date: "30/9/2026",
    elapsedTime: 120,
    ageQuestions: questions,
  });

// Pseudo-random generator so the fairness check is repeatable.
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe("calculateDiagnosis", () => {
  test("reports percentages per style, the total and the main style", () => {
    const answers = [
      ...Array(10)
        .fill(0)
        .map(() => answer("kinestesico")),
      ...Array(6)
        .fill(0)
        .map(() => answer("visual")),
      ...Array(4)
        .fill(0)
        .map(() => answer("auditivo")),
    ];
    const r = base(answers);
    expect(r.total).toBe(20);
    expect(r.counts).toEqual({ visual: 6, auditivo: 4, kinestesico: 10 });
    expect(r.scores).toEqual({ visual: 30, auditivo: 20, kinestesico: 50 });
    expect(r.predominantStyle).toBe("kinestesico");
    expect(r.percentage).toBe(50);
    expect(r.isMixed).toBe(false);
    expect(r.secondaryStyle).toBeNull();
  });

  test("flags a mixed profile when the top two are within one answer", () => {
    // 3 / 3 / 4 out of 10, the case that used to read as "KINESTÉSICO 40 %".
    const answers = [
      ...Array(4)
        .fill(0)
        .map(() => answer("kinestesico")),
      ...Array(3)
        .fill(0)
        .map(() => answer("visual")),
      ...Array(3)
        .fill(0)
        .map(() => answer("auditivo")),
    ];
    const r = base(answers, Array(10).fill({}));
    expect(r.predominantStyle).toBe("kinestesico");
    expect(r.isMixed).toBe(true);
    expect(["visual", "auditivo"]).toContain(r.secondaryStyle);
  });

  test("does not carry any contact data", () => {
    const r = base([answer("visual")]);
    expect(r).not.toHaveProperty("studentEmail");
    expect(r).not.toHaveProperty("studentPhone");
    expect(r).not.toHaveProperty("parentEmail");
    expect(r).not.toHaveProperty("parentPhone");
  });

  test.each([8, 12, 15])(
    "random answers land close to one third per style (age %i)",
    (age) => {
      const questions = getQuestionsByAge(age);
      const rand = mulberry32(age);
      const runs = 6000;
      const wins = { visual: 0, auditivo: 0, kinestesico: 0 };
      for (let i = 0; i < runs; i++) {
        const answers = questions.map((q, idx) => {
          const opt = q.options[Math.floor(rand() * q.options.length)];
          return answer(opt.type, idx);
        });
        wins[base(answers, questions).predominantStyle] += 1;
      }
      Object.values(wins).forEach((n) => {
        const share = (n / runs) * 100;
        expect(share).toBeGreaterThan(30);
        expect(share).toBeLessThan(37);
      });
    },
  );
});
