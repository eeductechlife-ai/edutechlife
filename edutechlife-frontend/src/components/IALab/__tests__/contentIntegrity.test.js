import { describe, it, expect } from "vitest";
import { CONTENT_ES } from "../constants/moduleContent/contentEs.js";
import { CONTENT_EN } from "../constants/moduleContent/contentEn.js";
import { CONTENT_PT } from "../constants/moduleContent/contentPt.js";
import { RESOURCES_ES } from "../constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../constants/moduleResources/resourcesEn.js";
import { RESOURCES_PT } from "../constants/moduleResources/resourcesPt.js";

const CASES = [
  ["es", CONTENT_ES, RESOURCES_ES],
  ["en", CONTENT_EN, RESOURCES_EN],
  ["pt", CONTENT_PT, RESOURCES_PT],
];

describe("Integridad de contenido — temas, accordion y recursos", () => {
  for (const [locale, content, resources] of CASES) {
    for (const m of [1, 2, 3, 4, 5]) {
      const mod = content[m];
      const topics = mod?.overviewData?.topics || [];

      it(`${locale} M${m}: accordionContent coincide con los temas`, () => {
        const keys = Object.keys(mod?.accordionContent || {}).sort();
        const expected = topics.map((_, i) => String(i + 1)).sort();
        expect(keys).toEqual(expected);
      });

      it(`${locale} M${m}: cada tema tiene su grupo de recursos con el conteo correcto`, () => {
        const problems = [];
        for (const t of topics) {
          const group = resources[t.title];
          if (!group) {
            problems.push(`sin grupo: ${t.title}`);
          } else if ((group.resources?.length || 0) !== (t.resources || 0)) {
            problems.push(
              `"${t.title}" topics.resources=${t.resources} catalogo=${group.resources?.length || 0}`,
            );
          }
        }
        expect(problems).toEqual([]);
      });
    }
  }
});
