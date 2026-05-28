#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src', 'i18n');

const esPath = join(SRC_DIR, 'es.json');
const enPath = join(SRC_DIR, 'en.json');

let exitCode = 0;

if (!existsSync(esPath)) {
  console.error(`❌ Missing: ${esPath}`);
  process.exit(1);
}
if (!existsSync(enPath)) {
  console.error(`❌ Missing: ${enPath}`);
  process.exit(1);
}

const es = JSON.parse(readFileSync(esPath, 'utf-8'));
const en = JSON.parse(readFileSync(enPath, 'utf-8'));

const esKeys = new Set(Object.keys(es));
const enKeys = new Set(Object.keys(en));

// Check es keys missing in en
for (const key of esKeys) {
  if (!enKeys.has(key)) {
    console.error(`MISSING in en.json: ${key}`);
    exitCode = 1;
  }
}

// Check en keys missing in es
for (const key of enKeys) {
  if (!esKeys.has(key)) {
    console.error(`MISSING in es.json: ${key}`);
    exitCode = 1;
  }
}

if (exitCode === 0) {
  const total = esKeys.size;
  console.log(`✅ All ${total} keys match between es.json and en.json`);
} else {
  console.error(`\n❌ Key mismatch detected. Run again after fixing.`);
}

process.exit(exitCode);
