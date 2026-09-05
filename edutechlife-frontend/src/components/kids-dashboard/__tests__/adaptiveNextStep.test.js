import { describe, it, expect } from "vitest";
import { getNextStep, NEXT_STEP_MODES } from "../adaptiveNextStep";

describe("getNextStep — MASTERED → PRACTICE → TRANSFER (§54–57)", () => {
  it("recovers when the score is low, regardless of feeling", () => {
    const step = getNextStep({ score: 40, feedback: "ok" });
    expect(step.mode).toBe(NEXT_STEP_MODES.RECOVERY);
    expect(step.tab).toBe("oral");
    expect(step.why).toContain("40%");
  });

  it("recovers when the student felt it was hard, even with a decent score", () => {
    const step = getNextStep({ score: 75, feedback: "hard" });
    expect(step.mode).toBe(NEXT_STEP_MODES.RECOVERY);
  });

  it("offers transfer (level up) only on high score AND easy feeling", () => {
    const step = getNextStep({ score: 90, feedback: "easy" });
    expect(step.mode).toBe(NEXT_STEP_MODES.TRANSFER);
    expect(step.tab).toBe("examenes");
  });

  it("stays in practice for a good-but-not-easy result", () => {
    const step = getNextStep({ score: 85, feedback: "ok" });
    expect(step.mode).toBe(NEXT_STEP_MODES.PRACTICE);
    expect(step.tab).toBeNull();
  });

  it("does not jump to transfer at high score when no easy feedback", () => {
    const step = getNextStep({ score: 95, feedback: null });
    expect(step.mode).toBe(NEXT_STEP_MODES.PRACTICE);
  });

  it("clamps out-of-range scores and defaults safely", () => {
    expect(getNextStep({ score: 250, feedback: "easy" }).why).toContain("100%");
    expect(getNextStep().mode).toBe(NEXT_STEP_MODES.RECOVERY); // score 0
  });

  it("always returns an actionable step with title, why and cta", () => {
    for (const f of ["easy", "ok", "hard", null]) {
      for (const sc of [10, 55, 70, 88, 100]) {
        const step = getNextStep({ score: sc, feedback: f });
        expect(step.title).toBeTruthy();
        expect(step.why).toBeTruthy();
        expect(step.cta).toBeTruthy();
        expect(step.emoji).toBeTruthy();
      }
    }
  });
});
