import { describe, it, expect } from "vitest";
import { CONTENT_ES } from "../constants/moduleContent/contentEs.js";
import {
  BLOOM_LEVELS,
  MODULE_BLOOM,
  MODULE_CASE_STUDY,
  getBloomForModule,
  getCourseBloomCoverage,
} from "../constants/bloomAlignment.js";

const MODULE_IDS = [1, 2, 3, 4, 5];

describe("Alineación Bloom (Fase 3 — pedagogía)", () => {
  it("cubre los 5 módulos", () => {
    MODULE_IDS.forEach((id) => expect(MODULE_BLOOM[id]).toBeDefined());
  });

  it("tiene un nivel Bloom por cada tema real del módulo", () => {
    MODULE_IDS.forEach((id) => {
      const topics = CONTENT_ES[id].overviewData.topics;
      expect(MODULE_BLOOM[id]).toHaveLength(topics.length);
    });
  });

  it("solo usa niveles válidos y con verbo coherente", () => {
    MODULE_IDS.forEach((id) => {
      MODULE_BLOOM[id].forEach((entry) => {
        expect(BLOOM_LEVELS).toContain(entry.level);
        expect(typeof entry.verb).toBe("string");
        expect(entry.verb.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("el curso completo cubre los 6 niveles de Bloom", () => {
    expect(getCourseBloomCoverage()).toEqual(
      expect.arrayContaining(BLOOM_LEVELS),
    );
    expect(getCourseBloomCoverage()).toHaveLength(BLOOM_LEVELS.length);
  });

  it("los módulos con 3+ temas cubren al menos 3 niveles distintos", () => {
    MODULE_IDS.forEach((id) => {
      const topics = CONTENT_ES[id].overviewData.topics;
      if (topics.length < 3) return;
      const levels = new Set(getBloomForModule(id).map((e) => e.level));
      expect(levels.size).toBeGreaterThanOrEqual(3);
    });
  });

  it("cada módulo tiene un caso aplicado con industria distinta", () => {
    const industries = MODULE_IDS.map((id) => {
      const caseStudy = MODULE_CASE_STUDY[id];
      expect(caseStudy).toBeDefined();
      expect(caseStudy.industry?.trim().length).toBeGreaterThan(0);
      expect(caseStudy.title?.trim().length).toBeGreaterThan(0);
      expect(caseStudy.scenario?.trim().length).toBeGreaterThan(0);
      expect(caseStudy.prompt?.trim().length).toBeGreaterThan(0);
      expect(caseStudy.outcome?.trim().length).toBeGreaterThan(0);
      return caseStudy.industry;
    });
    expect(new Set(industries).size).toBe(MODULE_IDS.length);
  });
});
