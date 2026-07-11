import { describe, test, expect } from "vitest";
import { COLORS } from "../chartColors";

describe("chartColors", () => {
  test("exports a non-empty array of hex colors", () => {
    expect(Array.isArray(COLORS)).toBe(true);
    expect(COLORS.length).toBeGreaterThan(0);
    COLORS.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  test("contains no duplicate colors", () => {
    expect(new Set(COLORS).size).toBe(COLORS.length);
  });
});
