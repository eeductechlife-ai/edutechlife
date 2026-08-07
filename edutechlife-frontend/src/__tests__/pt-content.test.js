import { describe, it, expect } from "vitest";
import {
  getModuleLessons,
  getModuleObjective,
} from "@/components/IALab/constants/moduleContent/selectors";
import { getResourcesForTopic } from "@/components/IALab/constants/moduleResources";
import { CONTENT_ES } from "@/components/IALab/constants/moduleContent/contentEs";
import { CONTENT_PT } from "@/components/IALab/constants/moduleContent/contentPt";

describe("PT content selectors", () => {
  it("resolves PT content for module 2", () => {
    const lessons = getModuleLessons(2, "pt");
    expect(lessons.length).toBe(3);
    const obj = getModuleObjective(2, "pt");
    expect(typeof obj).toBe("string");
    expect(obj.length).toBeGreaterThan(20);
  });
  it("PT content is real Portuguese, not a Spanish copy", () => {
    expect(CONTENT_PT[2].objective).not.toBe(CONTENT_ES[2].objective);
  });
  it("falls back to ES for unknown locale", () => {
    const lessons = getModuleLessons(2, "xx");
    expect(lessons.length).toBe(3);
  });
  it("resources resolve without throwing for pt", () => {
    const r = getResourcesForTopic("Tema 1", "pt");
    expect(r === null || typeof r === "object").toBe(true);
  });
});
