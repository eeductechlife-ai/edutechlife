import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const challengesDir = path.resolve(here, "..");
const i18nDir = path.resolve(here, "../../../../i18n");

const readJson = (name) =>
  JSON.parse(fs.readFileSync(path.join(i18nDir, name), "utf8"));

const LOCALES = {
  es: readJson("es.json"),
  en: readJson("en.json"),
  pt: readJson("pt.json"),
};

const MODULE_DIRS = ["module2", "module3", "module4", "module5"];

const collectKeysFromDir = (dir) => {
  const full = path.join(challengesDir, dir);
  const keys = new Set();
  for (const file of fs.readdirSync(full)) {
    if (!/\.(jsx?|tsx?)$/.test(file)) continue;
    const src = fs.readFileSync(path.join(full, file), "utf8");
    for (const m of src.matchAll(
      /["'`](ialab\.challenge\.m[0-9]\.[a-zA-Z0-9_.]+)["'`]/g,
    )) {
      keys.add(m[1]);
    }
  }
  return keys;
};

describe("i18n — claves de los desafíos presentes en todos los idiomas", () => {
  for (const dir of MODULE_DIRS) {
    it(`${dir}: no usa claves ausentes en es/en/pt`, () => {
      const keys = [...collectKeysFromDir(dir)];
      const missing = {};
      for (const [locale, dict] of Object.entries(LOCALES)) {
        const absent = keys.filter((k) => !(k in dict));
        if (absent.length) missing[locale] = absent;
      }
      expect(missing).toEqual({});
    });
  }
});
