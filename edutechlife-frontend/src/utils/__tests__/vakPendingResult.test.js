import { describe, test, expect, beforeEach } from "vitest";
import {
  savePendingVakResult,
  readPendingVakResult,
  clearPendingVakResult,
} from "../vakPendingResult";

const KEY = "edutechlife_vak_pending";
const result = {
  scores: { visual: 20, auditivo: 30, kinestesico: 50 },
  predominantStyle: "kinestesico",
  secondaryStyle: null,
  // Estos campos NO deben guardarse:
  studentName: "Mateo",
  studentAge: "12",
  answers: [{ text: "x" }],
};

describe("pending VAK result", () => {
  beforeEach(() => localStorage.clear());

  test("keeps only the styles and percentages, never a name or the answers", () => {
    expect(savePendingVakResult(result)).toBe(true);
    const raw = localStorage.getItem(KEY);
    expect(raw).not.toMatch(/Mateo|answers|studentAge|"12"/);
    const read = readPendingVakResult();
    expect(read).toMatchObject({
      scores: { visual: 20, auditivo: 30, kinestesico: 50 },
      predominantStyle: "kinestesico",
      secondaryStyle: null,
    });
  });

  test("expires after 30 days and cleans itself up", () => {
    savePendingVakResult(result);
    const later = Date.now() + 31 * 24 * 60 * 60 * 1000;
    expect(readPendingVakResult(later)).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  test("ignores and removes a corrupted record", () => {
    localStorage.setItem(KEY, "{not json");
    expect(readPendingVakResult()).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();

    localStorage.setItem(
      KEY,
      JSON.stringify({
        predominantStyle: "hacker",
        scores: {},
        savedAt: Date.now(),
      }),
    );
    expect(readPendingVakResult()).toBeNull();
  });

  test("refuses to save an invalid result", () => {
    expect(
      savePendingVakResult({
        scores: { visual: 500, auditivo: 0, kinestesico: 0 },
        predominantStyle: "visual",
      }),
    ).toBe(false);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  test("can be cleared", () => {
    savePendingVakResult(result);
    clearPendingVakResult();
    expect(readPendingVakResult()).toBeNull();
  });
});
