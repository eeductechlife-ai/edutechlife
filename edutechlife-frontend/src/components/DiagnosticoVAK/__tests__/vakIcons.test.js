import { describe, test, expect } from "vitest";
import { SVG_ICONS } from "../vakIcons";

describe("SVG_ICONS", () => {
  const expectedKeys = [
    "user",
    "users",
    "lightbulb",
    "checkCircle",
    "lock",
    "star",
  ];

  test("exports exactly the expected set of icon keys", () => {
    expect(Object.keys(SVG_ICONS).sort()).toEqual([...expectedKeys].sort());
  });

  test.each(expectedKeys)("%s is a well-formed inline <svg> markup string", (key) => {
    const markup = SVG_ICONS[key];
    expect(typeof markup).toBe("string");
    expect(markup.trim().startsWith("<svg")).toBe(true);
    expect(markup.trim().endsWith("</svg>")).toBe(true);
    expect(markup).toContain("viewBox=\"0 0 24 24\"");
  });

  test("each icon markup parses into a single valid <svg> element", () => {
    Object.values(SVG_ICONS).forEach((markup) => {
      const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
      expect(doc.querySelector("parsererror")).toBeNull();
      expect(doc.querySelector("svg")).not.toBeNull();
    });
  });

  test("star icon uses fill=currentColor while the others use fill=none", () => {
    expect(SVG_ICONS.star).toContain('fill="currentColor"');
    ["user", "users", "lightbulb", "checkCircle", "lock"].forEach((key) => {
      expect(SVG_ICONS[key]).toContain('fill="none"');
    });
  });
});
