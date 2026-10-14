#!/usr/bin/env node
/**
 * build-optimized.mjs — Paralleliza prerender + sitemap mientras Vite construye
 * Reduces total build time by ~1-2 min al ejecutar tareas concurrentemente
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runBuild() {
  console.log('[build] Starting optimized build...');

  const startTime = Date.now();

  // Paso 1: Vite build (produce dist/)
  console.log('[build] Step 1: vite build');
  try {
    execSync('vite build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  } catch (err) {
    console.error('[build] ✗ Vite build failed');
    process.exit(1);
  }

  // Paso 2: Paralelizar prerender + sitemap (ambos leen dist/)
  console.log('[build] Step 2: parallelizing prerender + sitemap');
  try {
    await Promise.all([
      execAsync('node scripts/prerender.mjs'),
      execAsync('node scripts/generate-sitemap.mjs'),
    ]);
  } catch (err) {
    console.error('[build] ✗ Prerender or sitemap failed');
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[build] ✓ Complete in ${elapsed}s`);
}

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    try {
      execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

runBuild().catch((err) => {
  console.error(err);
  process.exit(1);
});
