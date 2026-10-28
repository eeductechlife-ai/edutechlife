import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// edutechlife.co responde 308 a https://www.edutechlife.co. Cualquier URL
// canónica, og:url, hreflang, sitemap o robots que apunte al dominio sin www
// le indica a Google una URL que redirige, y diluye la autoridad de la página.
// Esta prueba evita que vuelva a aparecer el dominio sin www en esos archivos.

// Vitest se ejecuta desde edutechlife-frontend (npm run test:smoke).
const read = (rel) => readFileSync(resolve(process.cwd(), rel), "utf-8");

// Coincide con "https://edutechlife.co" pero no con "https://www.edutechlife.co".
const DOMINIO_SIN_WWW = /https:\/\/edutechlife\.co(?![\w-])/g;

const ARCHIVOS = [
  "src/components/SEO.jsx",
  "src/components/JsonLd.jsx",
  "scripts/generate-sitemap.mjs",
  "public/robots.txt",
  "public/sitemap.xml",
  "index.html",
];

describe("dominio canónico con www", () => {
  it.each(ARCHIVOS)("%s no usa https://edutechlife.co sin www", (rel) => {
    const coincidencias = read(rel).match(DOMINIO_SIN_WWW) || [];
    expect(coincidencias).toEqual([]);
  });

  it("SEO.jsx usa https://www.edutechlife.co como base", () => {
    expect(read("src/components/SEO.jsx")).toContain(
      'const SITE_URL = "https://www.edutechlife.co";',
    );
  });

  it("el sitemap publicado tiene 16 URLs, todas con www", () => {
    const xml = read("public/sitemap.xml");
    const locs = xml.match(/<loc>[^<]+<\/loc>/g) || [];
    expect(locs).toHaveLength(16);
    locs.forEach((loc) =>
      expect(loc).toMatch(/<loc>https:\/\/www\.edutechlife\.co/),
    );
  });
});
