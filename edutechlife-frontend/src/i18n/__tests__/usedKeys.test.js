import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// t() devuelve la clave cuando no existe, así que un componente con una clave
// que falta muestra "ingenia.notifications" a un lector de pantalla (y el
// patrón t("clave") || "texto" nunca usa su texto de respaldo). Este test falla
// en cuanto un componente use una clave que no esté en es, en y pt.
const SRC = path.resolve(__dirname, "..", "..");
const SKIP_DIRS = new Set([
  "__tests__",
  "node_modules",
  "i18n",
  "test-utils",
  "tests",
]);
const KEY_CALL = /\bt\(\s*["'`]([a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+)["'`]/g;

const load = (lang) =>
  JSON.parse(fs.readFileSync(path.join(SRC, "i18n", `${lang}.json`), "utf8"));

const usedKeys = () => {
  const used = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
      } else if (
        /\.(jsx?|tsx?)$/.test(entry.name) &&
        !/\.test\./.test(entry.name)
      ) {
        const source = fs.readFileSync(full, "utf8");
        for (const match of source.matchAll(KEY_CALL)) {
          if (!used.has(match[1])) used.set(match[1], path.relative(SRC, full));
        }
      }
    }
  };
  walk(SRC);
  return used;
};

describe("claves de traducción usadas en los componentes", () => {
  const used = usedKeys();

  it.each(["es", "en", "pt"])("todas existen en %s.json", (lang) => {
    const dictionary = load(lang);
    const missing = [...used]
      .filter(([key]) => !(key in dictionary))
      .map(([key, file]) => `${key}  (${file})`);
    expect(missing).toEqual([]);
  });

  it("encuentra claves (el escaneo no está roto)", () => {
    expect(used.size).toBeGreaterThan(200);
  });
});
