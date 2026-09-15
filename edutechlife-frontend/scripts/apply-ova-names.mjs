import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { getActiveOvas } from "../src/components/IALab/constants/ovaNaming.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = {
  es: "src/components/IALab/constants/moduleResources/resourcesEs.js",
  en: "src/components/IALab/constants/moduleResources/resourcesEn.js",
  pt: "src/components/IALab/constants/moduleResources/resourcesPt.js",
};

let changed = 0;
for (const [locale, rel] of Object.entries(FILES)) {
  const path = resolve(ROOT, rel);
  let src = readFileSync(path, "utf8");
  for (const ova of getActiveOvas()) {
    const re = new RegExp(`(id:\\s*"${ova.resourceId}"[\\s\\S]*?title:\\s*")([^"]*)(")`, "m");
    if (!re.test(src)) {
      console.warn(`[skip] ${locale} ${ova.resourceId} no encontrado`);
      continue;
    }
    src = src.replace(re, `$1${ova.name[locale]}$3`);
    changed += 1;
  }
  writeFileSync(path, src);
}
console.log(`OK — ${changed} títulos actualizados`);
