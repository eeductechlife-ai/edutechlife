import { describe, test, expect, vi } from "vitest";
import {
  getMoodSupportPrompt,
  getCrisisUserMessage,
  isEmotionalBannerNeeded,
  isCrisisAlert,
  recordMoodIfNeeded,
} from "../daniChatMood";

describe("getMoodSupportPrompt", () => {
  test("returns a prompt for triste mood with sufficient confidence", () => {
    const result = getMoodSupportPrompt(
      { mood: "triste", confidence: 0.8 },
      "me siento muy mal hoy",
    );
    expect(result).toContain("APOYO EMOCIONAL");
    expect(result).toContain("triste");
    expect(result).toContain("me siento muy mal hoy");
  });

  test("returns a prompt for enojado mood", () => {
    const result = getMoodSupportPrompt(
      { mood: "enojado", confidence: 0.75 },
      "estoy molesto",
    );
    expect(result).toContain("APOYO EMOCIONAL");
    expect(result).toContain("enojado");
  });

  test("returns a prompt for ansioso mood", () => {
    const result = getMoodSupportPrompt(
      { mood: "ansioso", confidence: 0.7 },
      "tengo nervios",
    );
    expect(result).toContain("APOYO EMOCIONAL");
    expect(result).toContain("ansioso");
  });

  test("returns null when confidence is below 0.7", () => {
    expect(
      getMoodSupportPrompt({ mood: "triste", confidence: 0.6 }, "texto"),
    ).toBeNull();
  });

  test("returns null for unsupported mood", () => {
    expect(
      getMoodSupportPrompt({ mood: "feliz", confidence: 0.9 }, "texto"),
    ).toBeNull();
  });

  test("returns null when mood is null", () => {
    expect(getMoodSupportPrompt(null, "texto")).toBeNull();
  });

  test("truncates user message to 100 characters", () => {
    const longMsg = "a".repeat(200);
    const result = getMoodSupportPrompt(
      { mood: "triste", confidence: 0.8 },
      longMsg,
    );
    expect(result).toContain("a".repeat(100));
    expect(result).not.toContain("a".repeat(101));
  });
});

describe("getCrisisUserMessage", () => {
  test("returns crisis alert for CRISIS_ALERT with high confidence", () => {
    const result = getCrisisUserMessage({
      mood: "CRISIS_ALERT",
      confidence: 0.95,
    });
    expect(result).toContain("ALERTA DE CRISIS");
    expect(result).toContain("Línea 106");
    expect(result).toContain("Línea 123");
    expect(result).toContain("Línea 141");
  });

  test("returns null for non-crisis mood", () => {
    expect(
      getCrisisUserMessage({ mood: "triste", confidence: 0.95 }),
    ).toBeNull();
  });

  test("returns null when confidence is below 0.9", () => {
    expect(
      getCrisisUserMessage({ mood: "CRISIS_ALERT", confidence: 0.85 }),
    ).toBeNull();
  });

  test("returns null when mood is null", () => {
    expect(getCrisisUserMessage(null)).toBeNull();
  });
});

describe("isEmotionalBannerNeeded", () => {
  test("returns true for triste with at least 0.7 confidence", () => {
    expect(
      isEmotionalBannerNeeded({ mood: "triste", confidence: 0.7 }),
    ).toBe(true);
  });

  test("returns true for enojado", () => {
    expect(
      isEmotionalBannerNeeded({ mood: "enojado", confidence: 0.8 }),
    ).toBe(true);
  });

  test("returns true for ansioso", () => {
    expect(
      isEmotionalBannerNeeded({ mood: "ansioso", confidence: 0.9 }),
    ).toBe(true);
  });

  test("returns false for low confidence", () => {
    expect(
      isEmotionalBannerNeeded({ mood: "triste", confidence: 0.6 }),
    ).toBe(false);
  });

  test("returns false for non-emotional moods", () => {
    expect(
      isEmotionalBannerNeeded({ mood: "feliz", confidence: 0.9 }),
    ).toBe(false);
    expect(
      isEmotionalBannerNeeded({ mood: "CRISIS_ALERT", confidence: 0.99 }),
    ).toBe(false);
  });

  test("returns false when mood is null", () => {
    expect(isEmotionalBannerNeeded(null)).toBeNull();
  });
});

describe("isCrisisAlert", () => {
  test("returns true for CRISIS_ALERT with at least 0.9 confidence", () => {
    expect(
      isCrisisAlert({ mood: "CRISIS_ALERT", confidence: 0.9 }),
    ).toBe(true);
  });

  test("returns false when confidence is below 0.9", () => {
    expect(
      isCrisisAlert({ mood: "CRISIS_ALERT", confidence: 0.89 }),
    ).toBe(false);
  });

  test("returns false for non-crisis mood", () => {
    expect(isCrisisAlert({ mood: "triste", confidence: 0.95 })).toBe(false);
  });

  test("returns falsy (null) when mood is null", () => {
    expect(isCrisisAlert(null)).toBeNull();
  });
});

describe("recordMoodIfNeeded", () => {
  test("calls recordMoodInference with mood, confidence, and truncated message", () => {
    const recordMood = vi.fn();
    recordMoodIfNeeded(
      { mood: "triste", confidence: 0.8 },
      "me siento muy triste hoy",
      recordMood,
    );
    expect(recordMood).toHaveBeenCalledWith(
      "triste",
      0.8,
      "me siento muy triste hoy",
    );
  });

  test("does not call recordMoodInference when mood is null", () => {
    const recordMood = vi.fn();
    recordMoodIfNeeded(null, "texto", recordMood);
    expect(recordMood).not.toHaveBeenCalled();
  });

  test("truncates user message to 100 characters", () => {
    const recordMood = vi.fn();
    const longMsg = "a".repeat(200);
    recordMoodIfNeeded({ mood: "feliz", confidence: 0.9 }, longMsg, recordMood);
    expect(recordMood).toHaveBeenCalledWith("feliz", 0.9, "a".repeat(100));
  });
});
