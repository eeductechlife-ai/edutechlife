import { describe, it, expect } from "vitest";
import {
  getQuestionsByAge,
  getVakMode,
  QUESTIONS_BY_GROUP,
} from "../vakQuestions";

const STYLES = ["auditivo", "kinestesico", "visual"];

describe("site question bank", () => {
  it.each(Object.entries(QUESTIONS_BY_GROUP))(
    "%s: every question has three options, one per style",
    (_, bank) => {
      expect(bank.length).toBeGreaterThanOrEqual(12);
      bank.forEach((q) => {
        expect(q.context).toEqual(expect.any(String));
        expect(q.text).toEqual(expect.any(String));
        expect(q.options).toHaveLength(3);
        expect(q.options.map((o) => o.type).sort()).toEqual(STYLES);
        q.options.forEach((o) => expect(o.emoji).toBeTruthy());
      });
    },
  );

  it.each(Object.entries(QUESTIONS_BY_GROUP))(
    "%s: no style is always listed first",
    (_, bank) => {
      const firsts = new Set(bank.map((q) => q.options[0].type));
      expect(firsts.size).toBe(3);
    },
  );

  it("uses the child bank up to 8 years and the teen bank from 9", () => {
    expect(getQuestionsByAge(8)).toBe(QUESTIONS_BY_GROUP.kids);
    expect(getQuestionsByAge(9)).toBe(QUESTIONS_BY_GROUP.teen);
    expect(getQuestionsByAge(16)).toBe(QUESTIONS_BY_GROUP.teen);
  });

  it("splits the experience into explorer (up to 11) and pro (12 and up)", () => {
    expect(getVakMode(8)).toBe("explorer");
    expect(getVakMode(11)).toBe("explorer");
    expect(getVakMode(12)).toBe("pro");
    expect(getVakMode(16)).toBe("pro");
  });
});
