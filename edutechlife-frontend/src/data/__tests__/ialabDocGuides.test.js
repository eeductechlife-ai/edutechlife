import { describe, test, expect } from "vitest";
import { DOC_GUIDES, getDocGuide } from "../ialabDocGuides";
import { RESOURCES_ES } from "../../components/IALab/constants/moduleResources/resourcesEs.js";

const pdfIds = Object.values(RESOURCES_ES)
  .flatMap((topic) => topic.resources || [])
  .filter((r) => r.type === "pdf")
  .map((r) => r.id);

describe("ialabDocGuides", () => {
  test("every pdf resource has a reading guide in es", () => {
    pdfIds.forEach((id) => {
      expect(getDocGuide(id, "es"), `falta guía para ${id}`).toBeTruthy();
    });
  });

  test("guides exist for es, en and pt", () => {
    ["es", "en", "pt"].forEach((lang) => {
      expect(Object.keys(DOC_GUIDES[lang]).length).toBe(pdfIds.length);
    });
  });

  test("each guide has summary and 3 guiding questions", () => {
    ["es", "en", "pt"].forEach((lang) => {
      Object.entries(DOC_GUIDES[lang]).forEach(([id, guide]) => {
        expect(guide.summary.length, `${lang}:${id}`).toBeGreaterThan(20);
        expect(guide.before.length, `${lang}:${id}`).toBe(3);
        guide.before.forEach((q) => expect(q.length).toBeGreaterThan(5));
      });
    });
  });
});
