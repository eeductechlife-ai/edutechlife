#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src', 'i18n');

const LOCALES = ['es', 'en', 'pt'];
const paths = {};
for (const loc of LOCALES) {
  paths[loc] = join(SRC_DIR, `${loc}.json`);
}

let exitCode = 0;

for (const loc of LOCALES) {
  if (!existsSync(paths[loc])) {
    console.error(`❌ Missing: ${paths[loc]}`);
    process.exit(1);
  }
}

const data = {};
for (const loc of LOCALES) {
  data[loc] = JSON.parse(readFileSync(paths[loc], 'utf-8'));
}

const keySets = {};
for (const loc of LOCALES) {
  keySets[loc] = new Set(Object.keys(data[loc]));
}

// es es el idioma base: toda clave de es debe existir en en y pt.
// También verificamos en<->es y pt<->es para detectar claves extra.
const base = 'es';
for (const loc of LOCALES) {
  if (loc === base) continue;
  for (const key of keySets[base]) {
    if (!keySets[loc].has(key)) {
      console.error(`MISSING in ${loc}.json: ${key}`);
      exitCode = 1;
    }
  }
  for (const key of keySets[loc]) {
    if (!keySets[base].has(key)) {
      console.error(`MISSING in es.json: ${key} (presente solo en ${loc}.json)`);
      exitCode = 1;
    }
  }
}

if (exitCode === 0) {
  const total = keySets.es.size;
  console.log(`✅ All ${total} keys match across es.json, en.json and pt.json`);
} else {
  console.error(`\n❌ Key mismatch detected. Run again after fixing.`);
}

process.exit(exitCode);
