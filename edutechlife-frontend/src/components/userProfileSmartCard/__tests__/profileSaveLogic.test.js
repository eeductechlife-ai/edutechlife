import { describe, it, expect } from "vitest";
import { shouldDisableSave, normalizePhone } from "../profileSaveLogic";

describe("shouldDisableSave", () => {
  it("enables save when not saving", () => {
    expect(shouldDisableSave({ isSaving: false })).toBe(false);
  });

  it("disables save while saving", () => {
    expect(shouldDisableSave({ isSaving: true })).toBe(true);
  });

  it("does NOT disable save because of a phone error — phone errors are warnings", () => {
    // The name must be savable even when the phone is invalid/empty.
    expect(
      shouldDisableSave({
        isSaving: false,
        phoneError: "error",
        hasPhoneValue: true,
      }),
    ).toBe(false);
  });
});

describe("normalizePhone", () => {
  it("keeps only digits", () => {
    expect(normalizePhone("+57 300 123 4567")).toBe("573001234567");
  });

  it("returns empty string for empty input", () => {
    expect(normalizePhone("")).toBe("");
    expect(normalizePhone(null)).toBe("");
    expect(normalizePhone(undefined)).toBe("");
  });
});
