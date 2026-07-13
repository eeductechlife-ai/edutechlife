import { describe, test, expect, vi } from "vitest";
import {
  MOOD_OPTIONS,
  buildResultsURL,
  getMoodLabel,
  getMoodFeedback,
  formatTime,
  validateEmail,
} from "../vakHelpers";

describe("MOOD_OPTIONS", () => {
  test("exports exactly three mood options with the expected shape", () => {
    expect(MOOD_OPTIONS).toHaveLength(3);
    MOOD_OPTIONS.forEach((option) => {
      expect(option).toEqual(
        expect.objectContaining({
          value: expect.any(String),
          label: expect.any(String),
          icon: expect.any(String),
          message: expect.any(String),
        }),
      );
    });
  });

  test("includes happy, neutral and sad values in order", () => {
    expect(MOOD_OPTIONS.map((o) => o.value)).toEqual([
      "happy",
      "neutral",
      "sad",
    ]);
  });
});

describe("buildResultsURL", () => {
  test("returns an empty string when diag is null", () => {
    expect(buildResultsURL(null)).toBe("");
  });

  test("returns an empty string when diag is undefined", () => {
    expect(buildResultsURL(undefined)).toBe("");
  });

  test("builds a QR code API url embedding the encoded results payload", () => {
    const diag = {
      studentName: "Ana",
      date: "2026-07-10",
      predominantStyle: "visual",
      percentage: 80,
    };

    const url = buildResultsURL(diag);

    expect(url).toMatch(
      /^https:\/\/api\.qrserver\.com\/v1\/create-qr-code\/\?size=150x150&data=/,
    );

    const encodedDataURL = url.split("data=")[1];
    const dataURL = decodeURIComponent(encodedDataURL);
    expect(dataURL).toMatch(
      /^https:\/\/edutechlife\.co\/diagnosis\/vak\/results\?payload=/,
    );

    const encodedPayload = dataURL.split("payload=")[1];
    const payload = JSON.parse(decodeURIComponent(encodedPayload));
    expect(payload).toEqual({
      studentName: "Ana",
      date: "2026-07-10",
      predominantStyle: "visual",
      percentage: 80,
    });
  });

  test("returns an empty string when JSON.stringify throws (circular reference)", () => {
    // Only the picked fields (studentName, date, predominantStyle, percentage)
    // are serialized, so the circular reference must live on one of those.
    const circularDate = {};
    circularDate.self = circularDate;

    const diag = { studentName: "Ana", date: circularDate };

    expect(buildResultsURL(diag)).toBe("");
  });
});

describe("getMoodLabel", () => {
  const t = vi.fn((key) => key);

  test("maps happy to the mood_good translation key", () => {
    expect(getMoodLabel("happy", t)).toBe("vak.ui.mood_good");
  });

  test("maps neutral to the mood_neutral translation key", () => {
    expect(getMoodLabel("neutral", t)).toBe("vak.ui.mood_neutral");
  });

  test("maps sad to the mood_bad translation key", () => {
    expect(getMoodLabel("sad", t)).toBe("vak.ui.mood_bad");
  });

  test("falls back to mood_neutral_fallback for an unknown mood value", () => {
    expect(getMoodLabel("angry", t)).toBe("vak.ui.mood_neutral_fallback");
  });

  test("falls back to mood_neutral_fallback for a null mood value", () => {
    expect(getMoodLabel(null, t)).toBe("vak.ui.mood_neutral_fallback");
  });
});

describe("getMoodFeedback", () => {
  const options = [
    { value: "happy", label: "Bien" },
    { value: "neutral", label: "Regular" },
    { value: "sad", label: "No muy bien" },
  ];

  test("returns the option matching the given mood value", () => {
    expect(getMoodFeedback("sad", options)).toEqual(options[2]);
  });

  test("returns the second option (index 1) as a fallback when no match is found", () => {
    expect(getMoodFeedback("unknown", options)).toEqual(options[1]);
  });

  test("returns the second option as a fallback for a null mood value", () => {
    expect(getMoodFeedback(null, options)).toEqual(options[1]);
  });
});

describe("formatTime", () => {
  test("formats zero seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  test("pads seconds below ten with a leading zero", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  test("does not pad seconds when already two digits", () => {
    expect(formatTime(599)).toBe("9:59");
  });

  test("handles durations longer than an hour by not wrapping minutes", () => {
    expect(formatTime(3661)).toBe("61:01");
  });

  test("formats a value under one minute", () => {
    expect(formatTime(45)).toBe("0:45");
  });
});

describe("validateEmail", () => {
  test("treats an empty string as valid (optional field)", () => {
    expect(validateEmail("")).toBe(true);
  });

  test("treats null as valid (optional field)", () => {
    expect(validateEmail(null)).toBe(true);
  });

  test("treats undefined as valid (optional field)", () => {
    expect(validateEmail(undefined)).toBe(true);
  });

  test("accepts a well-formed email address", () => {
    expect(validateEmail("ana@example.com")).toBe(true);
  });

  test("rejects an email missing the @ symbol", () => {
    expect(validateEmail("ana.example.com")).toBe(false);
  });

  test("rejects an email missing the domain", () => {
    expect(validateEmail("ana@")).toBe(false);
  });

  test("rejects an email with spaces", () => {
    expect(validateEmail("ana @example.com")).toBe(false);
  });

  test("rejects an email missing the top-level domain", () => {
    expect(validateEmail("ana@example")).toBe(false);
  });
});
