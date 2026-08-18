#!/usr/bin/env node

/**
 * UI/UX Audit Script
 * Valida design system consistency, responsive design, y componentes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

console.log('\n🎨 UI/UX AUDIT - EdutechLife PRO\n');

let issues = 0;
let warnings = 0;

// 1. Validar color palette consistency
console.log('📋 Validando paleta de colores...');
const cssFiles = findFiles(srcDir, /\.css$/);
const hasColorTokens = cssFiles.some(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return content.includes('--color-') || content.includes('--primary') || content.includes('--secondary');
});

if (!hasColorTokens) {
  console.log('  ⚠️  No se encontraron tokens de color CSS. Define --color-* variables');
  warnings++;
}

// 2. Validar dark mode
console.log('📋 Validando dark mode support...');
const hasDarkMode = cssFiles.some(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return content.includes('@media (prefers-color-scheme: dark)') ||
         content.includes('[data-theme="dark"]');
});

if (!hasDarkMode) {
  console.log('  ⚠️  Dark mode no está implementado');
  warnings++;
}

// 3. Validar responsive design
console.log('📋 Validando responsive design...');
const componentFiles = findFiles(path.join(srcDir, 'components'), /\.jsx$/).slice(0, 20);
let responsiveCount = 0;

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('sm:') || content.includes('md:') || content.includes('lg:') ||
      content.includes('@media') || content.includes('matchMedia')) {
    responsiveCount++;
  }
});

const responsivePercent = Math.round((responsiveCount / componentFiles.length) * 100);
console.log(`  ✓ ${responsivePercent}% de componentes tienen breakpoints (${responsiveCount}/${componentFiles.length})`);

if (responsivePercent < 80) {
  console.log('  ⚠️  Less than 80% components are responsive');
  warnings++;
}

// 4. Validar accesibilidad básica
console.log('📋 Validando accesibilidad...');
let a11yCount = 0;

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('aria-') || content.includes('role=') ||
      content.includes('alt=') || content.includes('aria-label')) {
    a11yCount++;
  }
});

const a11yPercent = Math.round((a11yCount / componentFiles.length) * 100);
console.log(`  ✓ ${a11yPercent}% de componentes tienen atributos a11y (${a11yCount}/${componentFiles.length})`);

if (a11yPercent < 70) {
  console.log('  ⚠️  Menos del 70% de componentes tienen atributos de accesibilidad');
  warnings++;
}

// 5. Validar imágenes optimizadas
console.log('📋 Validando optimización de imágenes...');
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  const imageFiles = findFiles(publicDir, /\.(png|jpg|jpeg|gif)$/);
  const webpFiles = findFiles(publicDir, /\.webp$/);

  console.log(`  ✓ Imágenes PNG/JPG: ${imageFiles.length}`);
  console.log(`  ✓ Imágenes WebP: ${webpFiles.length}`);

  if (webpFiles.length === 0 && imageFiles.length > 0) {
    console.log('  ⚠️  No hay imágenes WebP. Considera optimizar a WebP');
    warnings++;
  }
}

// 6. Validar animaciones
console.log('📋 Validando animaciones...');
const animationFiles = cssFiles.filter(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return content.includes('animation') || content.includes('@keyframes');
});

console.log(`  ✓ Archivos CSS con animaciones: ${animationFiles.length}`);

// 7. Validar Tailwind consistency
console.log('📋 Validando consistencia de Tailwind...');
let tailwindCount = 0;

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const tailwindMatches = content.match(/className="[^"]*(?:p|m|w|h|text|bg|border|rounded|flex|grid)-[^"]*"/g) || [];
  if (tailwindMatches.length > 0) {
    tailwindCount++;
  }
});

console.log(`  ✓ ${tailwindCount}/${componentFiles.length} componentes usan Tailwind`);

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN UI/UX AUDIT\n');
console.log(`  ✓ Responsive Design:     ${responsivePercent}%`);
console.log(`  ✓ Accesibilidad:         ${a11yPercent}%`);
console.log(`  ✓ Dark Mode:             ${hasDarkMode ? 'Sí' : 'No'}`);
console.log(`  ✓ Color Tokens:          ${hasColorTokens ? 'Sí' : 'No'}`);
console.log(`  ℹ️  Issues:                ${issues}`);
console.log(`  ⚠️  Warnings:             ${warnings}`);
console.log('');

if (warnings > 0) {
  console.log('🎯 Recomendaciones:');
  console.log('  1. Implementar dark mode en todos componentes');
  console.log('  2. Optimizar imágenes a WebP/AVIF');
  console.log('  3. Aumentar cobertura de accesibilidad a 90%+');
  console.log('  4. Validar con axe DevTools');
}

process.exit(issues > 0 ? 1 : 0);

/**
 * Helper: Buscar archivos recursivamente
 */
function findFiles(dir, pattern) {
  const files = [];

  function walk(current) {
    if (!fs.existsSync(current)) return;

    const items = fs.readdirSync(current);
    for (const item of items) {
      if (item.startsWith('.')) continue;

      const full = path.join(current, item);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      } else if (pattern.test(item)) {
        files.push(full);
      }
    }
  }

  walk(dir);
  return files;
}
