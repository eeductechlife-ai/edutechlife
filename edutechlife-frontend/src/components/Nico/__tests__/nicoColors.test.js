import { describe, test, expect } from "vitest";
import { COLORS } from "../nicoColors";

describe("nicoColors", () => {
  test("exposes the brand palette keys", () => {
    expect(Object.keys(COLORS)).toEqual(
      expect.arrayContaining([
        "NAVY",
        "PETROLEUM",
        "CORPORATE",
        "MINT",
        "SOFT_BLUE",
      ]),
    );
  });

  test("every value is a valid hex color", () => {
    Object.values(COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
