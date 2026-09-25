import { describe, it, expect } from "vitest";
import {
  KIDS_QUESTIONS,
  TEEN_QUESTIONS,
  questionsFor,
  answerOrder,
  scoreVak,
} from "../vakQuestions";

// Argentine voseo slipped into the old bank ("recordás", "hacés"…);
// the platform speaks Colombian Spanish (tú).
const VOSEO =
  /\b(recordás|hacés|resolés|preferís|podés|mirás|leés|celebrás|organizás|necesitás|aprendés|subrayás|escuchás|participás|grabás|caminás|probás)\b/i;

describe("vak question banks", () => {
  it.each([
    ["6-9", KIDS_QUESTIONS],
    ["10-16", TEEN_QUESTIONS],
  ])(
    "%s: every situation has context, question and the three channels",
    (_, bank) => {
      bank.forEach((item) => {
        expect(item.contexto).toBeTruthy();
        expect(item.pregunta).toBeTruthy();
        ["v", "a", "k"].forEach((ch) => {
          expect(item.opciones[ch].texto).toBeTruthy();
          expect(item.opciones[ch].emoji).toBeTruthy();
        });
        const text = [
          item.contexto,
          item.pregunta,
          ...Object.values(item.opciones).map((x) => x.texto),
        ].join(" ");
        expect(text).not.toMatch(VOSEO);
      });
    },
  );

  it("gives young kids the short bank", () => {
    expect(questionsFor("early")).toBe(KIDS_QUESTIONS);
    expect(questionsFor("middle")).toBe(TEEN_QUESTIONS);
    expect(KIDS_QUESTIONS.length).toBeLessThan(TEEN_QUESTIONS.length);
  });

  it("never shows the same channel first on consecutive questions", () => {
    const firsts = [0, 1, 2].map((i) => answerOrder(i)[0]);
    expect(new Set(firsts).size).toBe(3);
  });
});

describe("scoreVak", () => {
  it("returns percentages and the predominant style", () => {
    const r = scoreVak([
      "visual",
      "kinestesico",
      "kinestesico",
      "kinestesico",
      "auditivo",
    ]);
    expect(r.scores).toEqual({ visual: 20, auditivo: 20, kinestesico: 60 });
    expect(r.predominantStyle).toBe("kinestesico");
    expect(r.secondaryStyle).toBeNull();
  });

  it("marks a close second style as secondary", () => {
    const r = scoreVak([
      "visual",
      "visual",
      "auditivo",
      "auditivo",
      "visual",
      "kinestesico",
      "auditivo",
      "visual",
      "auditivo",
      "visual",
    ]);
    expect(r.predominantStyle).toBe("visual");
    expect(r.secondaryStyle).toBe("auditivo");
  });
});
