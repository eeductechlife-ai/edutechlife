import { describe, test, expect } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RESOURCES_ES } from "../constants/moduleResources/resourcesEs.js";
import { RESOURCES_EN } from "../constants/moduleResources/resourcesEn.js";
import { RESOURCES_PT } from "../constants/moduleResources/resourcesPt.js";

// Los assets locales viven en public/ (la raíz de la app). Esta prueba es la guardia
// que falta: un PDF o imagen borrado o mal nombrado debe romper la suite, no al estudiante.
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "../../../../public");

const CATALOGS = { es: RESOURCES_ES, en: RESOURCES_EN, pt: RESOURCES_PT };

// Cuenta páginas de un PDF sin dependencias: las páginas de Chrome y pypdf son objetos /Type /Page.
const countPdfPages = (file) => {
  const bytes = readFileSync(file);
  return (bytes.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) || []).length;
};

const localResources = (catalog) =>
  Object.entries(catalog).flatMap(([topic, group]) =>
    (group.resources || [])
      .filter((r) => typeof r.url === "string" && r.url.startsWith("/"))
      .map((r) => ({ topic, ...r })),
  );

describe("assets locales de los recursos del curso", () => {
  for (const [lang, catalog] of Object.entries(CATALOGS)) {
    test(`${lang}: cada url local existe en public/ y no está vacía`, () => {
      const missing = [];
      const empty = [];
      for (const r of localResources(catalog)) {
        const file = join(PUBLIC, r.url);
        if (!existsSync(file)) missing.push(`${r.id} → ${r.url}`);
        else if (statSync(file).size === 0) empty.push(`${r.id} → ${r.url}`);
      }
      expect(missing, `archivos faltantes en ${lang}`).toEqual([]);
      expect(empty, `archivos vacíos en ${lang}`).toEqual([]);
    });

    test(`${lang}: las páginas declaradas coinciden con el PDF real`, () => {
      const mismatches = [];
      for (const r of localResources(catalog)) {
        if (!r.url.toLowerCase().endsWith(".pdf")) continue;
        const file = join(PUBLIC, r.url);
        if (!existsSync(file)) continue;
        const real = countPdfPages(file);
        if (typeof r.pages !== "number") {
          mismatches.push(`${r.id}: falta el campo pages (real ${real})`);
        } else if (r.pages !== real) {
          mismatches.push(`${r.id}: declara ${r.pages}, real ${real}`);
        }
      }
      expect(mismatches, `páginas incorrectas en ${lang}`).toEqual([]);
    });
  }
});
