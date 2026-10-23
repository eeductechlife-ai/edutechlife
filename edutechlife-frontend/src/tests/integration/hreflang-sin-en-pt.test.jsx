import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Producción responde 404 en /en/ y /pt/ (no hay rutas con prefijo de idioma;
// el idioma se guarda en localStorage). Un hreflang que apunta a una URL 404
// le confunde a Google la relación entre versiones. Solo se declara el español
// (y x-default), que es lo que existe.

// Vitest se ejecuta desde edutechlife-frontend (npm run test:smoke).
const read = (rel) => readFileSync(resolve(process.cwd(), rel), "utf-8");

describe("hreflang: solo versiones que existen", () => {
  it("SEO.jsx no declara hreflang en ni pt", () => {
    const src = read("src/components/SEO.jsx");
    expect(src).not.toMatch(/hrefLang="en"/);
    expect(src).not.toMatch(/hrefLang="pt"/);
  });

  it("SEO.jsx conserva hreflang es y x-default", () => {
    const src = read("src/components/SEO.jsx");
    expect(src).toMatch(/hrefLang="es"/);
    expect(src).toMatch(/hrefLang="x-default"/);
  });

  it("el generador del sitemap no emite hreflang en ni pt", () => {
    const src = read("scripts/generate-sitemap.mjs");
    expect(src).not.toMatch(/hreflang: 'en'/);
    expect(src).not.toMatch(/hreflang: 'pt'/);
    expect(src).not.toMatch(/\/en\$\{r\.loc\}|\/pt\$\{r\.loc\}/);
  });

  it("public/sitemap.xml no enlaza /en/ ni /pt/", () => {
    const xml = read("public/sitemap.xml");
    expect(xml).not.toMatch(/hreflang="en"/);
    expect(xml).not.toMatch(/hreflang="pt"/);
    expect(xml).not.toMatch(/\/(en|pt)\//);
  });
});
