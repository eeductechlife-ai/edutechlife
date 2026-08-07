#!/usr/bin/env node

/**
 * Performance Validation Script
 * Compares bundle metrics before/after Phase 3 optimizations
 *
 * Usage: node scripts/validate-performance.js
 */

const fs = require('fs');
const path = require('path');

const DIST_PATH = path.join(__dirname, '../edutechlife-frontend/dist/assets');

// Target metrics (Phase 3 goals)
const TARGETS = {
  mainBundleGzipped: 150, // KB
  totalBundleGzipped: 300, // KB
  lcpTarget: 2500, // ms
};

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(2);
}

function analyzeBundle() {
  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ dist/assets directory not found. Run: npm run build');
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_PATH);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  const jsSize = jsFiles.reduce((sum, f) => sum + getFileSize(path.join(DIST_PATH, f)), 0);
  const cssSize = cssFiles.reduce((sum, f) => sum + getFileSize(path.join(DIST_PATH, f)), 0);
  const totalSize = jsSize + cssSize;

  console.log('\n📊 BUNDLE ANALYSIS (Phase 3)\n');
  console.log(`JS Files:  ${formatKB(jsSize)} KB (${jsFiles.length} chunks)`);
  console.log(`CSS Files: ${formatKB(cssSize)} KB (${cssFiles.length} files)`);
  console.log(`Total:     ${formatKB(totalSize)} KB`);

  // Estimate gzip (roughly 30% of original)
  const jsGzipped = jsSize * 0.30;
  const cssGzipped = cssSize * 0.15;
  const totalGzipped = jsGzipped + cssGzipped;

  console.log(`\n📦 ESTIMATED GZIPPED SIZE:\n`);
  console.log(`JS (gzipped):  ${formatKB(jsGzipped)} KB`);
  console.log(`CSS (gzipped): ${formatKB(cssGzipped)} KB`);
  console.log(`Total:         ${formatKB(totalGzipped)} KB`);

  // Largest chunks
  console.log('\n🔍 LARGEST CHUNKS:\n');
  const chunks = jsFiles
    .map(f => ({
      name: f,
      size: getFileSize(path.join(DIST_PATH, f)),
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  chunks.forEach(({ name, size }) => {
    console.log(`  ${formatKB(size)} KB  ${name}`);
  });

  // Validation
  console.log('\n✅ VALIDATION:\n');
  const checks = [
    {
      name: 'Main bundle (gzipped) < 150 KB',
      passed: jsGzipped < TARGETS.mainBundleGzipped,
      actual: formatKB(jsGzipped),
    },
    {
      name: 'Total bundle (gzipped) < 300 KB',
      passed: totalGzipped < TARGETS.totalBundleGzipped,
      actual: formatKB(totalGzipped),
    },
    {
      name: 'Number of chunks < 20',
      passed: jsFiles.length < 20,
      actual: jsFiles.length,
    },
  ];

  let allPassed = true;
  checks.forEach(({ name, passed, actual }) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name} (${actual})`);
    if (!passed) allPassed = false;
  });

  console.log(`\n${allPassed ? '✅ All metrics pass!' : '⚠️  Some metrics need attention'}\n`);
  console.log('📖 See PERFORMANCE_SUMMARY.md for detailed breakdown\n');

  return allPassed ? 0 : 1;
}

// Run analysis
process.exit(analyzeBundle());
