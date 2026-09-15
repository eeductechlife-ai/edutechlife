import { describe, it, expect } from "vitest";
import { RESOURCES_ES } from "../constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../constants/moduleResources/resourcesEn.js";
import { RESOURCES_PT } from "../constants/moduleResources/resourcesPt.js";
import { getActiveOvas } from "../constants/ovaNaming.js";

const FILES = { es: RESOURCES_ES, en: RESOURCES_EN, pt: RESOURCES_PT };

function ovaTitle(locale, resourceId) {
  const groups = FILES[locale];
  for (const group of Object.values(groups)) {
    const r = (group.resources || []).find((x) => x.id === resourceId);
    if (r) return r.title;
  }
  return null;
}

describe("Títulos de OVA alineados al registro canónico", () => {
  for (const locale of ["es", "en", "pt"]) {
    for (const ova of getActiveOvas()) {
      it(`${locale}: ${ova.code} usa "${ova.name[locale]}"`, () => {
        expect(ovaTitle(locale, ova.resourceId)).toBe(ova.name[locale]);
      });
    }
  }
});
