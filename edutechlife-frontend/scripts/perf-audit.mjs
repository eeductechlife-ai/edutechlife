#!/usr/bin/env node

/**
 * Performance Audit Script
 *
 * Comprehensive performance measurement:
 * - Bundle size analysis
 * - Lighthouse scores (lab metrics)
 * - Core Web Vitals thresholds
 * - Comparison to baselines
 *
 * Usage:
 *   npm run perf:audit
 *   npm run perf:audit -- --compare baseline.json
 *   npm run perf:audit -- --output perf-report.json
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Parse CLI arguments
const args = process.argv.slice(2);
const compareFile = args.includes('--compare') ? args[args.indexOf('--compare') + 1] : null;
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : 'perf-baseline.json';

// CWV thresholds (milliseconds for time metrics, unitless for CLS)
const THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  inp: { good: 200, needsImprovement: 500 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  speedIndex: { good: 3000, needsImprovement: 5800 },
};

console.log('\n🎯 EdutechLife Performance Audit\n');
console.log('='.repeat(60));

// 1. Bundle Size Analysis
console.log('\n📦 Bundle Size Analysis');
console.log('-'.repeat(60));

async function analyzeBundleSize() {
  if (!fs.existsSync(DIST)) {
    console.error('❌ dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const assets = path.join(DIST, 'assets');
  if (!fs.existsSync(assets)) {
    console.error('❌ dist/assets/ not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(assets);
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  const chunks = {};

  for (const file of files) {
    const fp = path.join(assets, file);
    const size = fs.statSync(fp).size;
    totalSize += size;

    if (file.endsWith('.js')) {
      jsSize += size;
      chunks[file] = size;
    } else if (file.endsWith('.css')) {
      cssSize += size;
    }
  }

  // Sort chunks by size (largest first)
  const sorted = Object.entries(chunks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.log(`\n📊 Total Bundle Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  JS:  ${(jsSize / 1024 / 1024).toFixed(2)} MB (${((jsSize / totalSize) * 100).toFixed(1)}%)`);
  console.log(`  CSS: ${(cssSize / 1024).toFixed(1)} KB (${((cssSize / totalSize) * 100).toFixed(1)}%)`);

  console.log(`\n🔝 Top 10 Largest Chunks:`);
  sorted.forEach(([file, size], i) => {
    const sizeKb = size / 1024;
    const icon = sizeKb > 600 ? '⚠️ ' : '✓ ';
    console.log(`  ${icon}${i + 1}. ${file.substring(0, 40).padEnd(40)} ${sizeKb.toFixed(1)} KB`);
  });

  return { totalSize, jsSize, cssSize, chunks };
}

// 2. Check Lighthouse (requires dist to be built)
async function runLighthouse() {
  console.log('\n💡 Running Lighthouse Audit (Lab Metrics)');
  console.log('-'.repeat(60));

  // Check if lhci is installed
  try {
    await execAsync('which lhci', { shell: '/bin/bash' });
  } catch {
    console.warn(
      '⚠️  Lighthouse CI not installed. Install with: npm install -g @lhci/cli'
    );
    return null;
  }

  try {
    // Start preview server
    console.log('  Starting preview server on http://localhost:4173...');
    const { spawn } = await import('child_process');
    const server = spawn('npm', ['run', 'preview'], {
      cwd: ROOT,
      stdio: 'pipe'
    });

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('  Running Lighthouse on 3 key pages...');
    try {
      const { stdout } = await execAsync('lhci autorun', {
        cwd: ROOT,
        timeout: 60000,
        stdio: 'pipe'
      });

      // Parse results
      const resultsFile = path.join(ROOT, '.lighthouseci', 'results-0.json');
      if (fs.existsSync(resultsFile)) {
        const result = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        const { categories, audits } = result.lhr || {};

        if (categories) {
          console.log('\n  📈 Lighthouse Scores:');
          Object.entries(categories).forEach(([name, cat]) => {
            const score = Math.round(cat.score * 100);
            const icon = score >= 90 ? '✅' : score >= 70 ? '⚠️ ' : '❌';
            console.log(`    ${icon} ${name.padEnd(20)} ${score}/100`);
          });
        }

        if (audits) {
          console.log('\n  ⚡ Core Web Vitals (Lab):');
          const cwv = {
            LCP: audits['largest-contentful-paint']?.numericValue,
            INP: audits['interaction-to-next-paint']?.numericValue,
            CLS: audits['cumulative-layout-shift']?.numericValue,
            FCP: audits['first-contentful-paint']?.numericValue,
            SI: audits['speed-index']?.numericValue,
          };

          Object.entries(cwv).forEach(([metric, value]) => {
            if (value !== undefined) {
              const unit = metric === 'CLS' ? '' : ' ms';
              const threshold = THRESHOLDS[metric.toLowerCase()];
              let status = '✅';
              if (threshold && value > threshold.good) {
                status = value <= threshold.needsImprovement ? '⚠️ ' : '❌';
              }
              console.log(`    ${status} ${metric.padEnd(4)} ${value.toFixed(metric === 'CLS' ? 3 : 0)}${unit}`);
            }
          });
        }

        return result.lhr;
      }
    } finally {
      server.kill();
    }
  } catch (error) {
    if (process.env.DEBUG) {
      console.error('Lighthouse error:', error.message);
    }
    console.warn('⚠️  Lighthouse audit skipped (requires preview server)');
    return null;
  }
}

// 3. Load baseline for comparison
function loadBaseline(file) {
  if (!file || !fs.existsSync(file)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// 4. Compare metrics
function compareMetrics(current, baseline) {
  if (!baseline) return null;

  console.log('\n📊 Comparison to Baseline');
  console.log('-'.repeat(60));

  const comparisons = {};

  // Compare bundle size
  if (baseline.bundleSize && current.bundleSize) {
    const delta = current.bundleSize.totalSize - baseline.bundleSize.totalSize;
    const percent = (delta / baseline.bundleSize.totalSize) * 100;
    const icon = delta > 0 ? '📈' : '📉';
    console.log(`\n  ${icon} Bundle Size: ${delta > 0 ? '+' : ''}${(delta / 1024 / 1024).toFixed(2)} MB (${percent.toFixed(1)}%)`);
    comparisons.bundleSize = { delta, percent };
  }

  return comparisons;
}

// Main execution
async function main() {
  try {
    // 1. Bundle analysis
    const bundleMetrics = await analyzeBundleSize();

    // 2. Lighthouse (optional, if preview available)
    const lighthouseMetrics = await runLighthouse();

    // 3. Build report
    const report = {
      timestamp: new Date().toISOString(),
      bundleSize: bundleMetrics,
      lighthouse: lighthouseMetrics || { skipped: true },
    };

    // 4. Compare to baseline
    const baseline = compareFile ? loadBaseline(compareFile) : null;
    if (baseline) {
      report.comparison = compareMetrics(report, baseline);
    }

    // 5. Save report
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n✅ Report saved to: ${outputFile}`);

    // 6. Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 Performance Summary\n');

    const bundleStatus = bundleMetrics.jsSize > 7.5 * 1024 * 1024 ? '❌ Over budget' : '✅ Within budget';
    console.log(`  Bundle Size: ${bundleStatus}`);
    console.log(`  Largest Chunk: ${(Math.max(...Object.values(bundleMetrics.chunks)) / 1024).toFixed(1)} KB`);

    if (lighthouseMetrics?.categories?.performance) {
      const perfScore = Math.round(lighthouseMetrics.categories.performance.score * 100);
      const perfStatus = perfScore >= 90 ? '✅ Excellent' : perfScore >= 70 ? '⚠️ Acceptable' : '❌ Needs Work';
      console.log(`  Performance Score: ${perfStatus} (${perfScore}/100)`);
    }

    console.log('\n🎯 Next Steps:');
    console.log('  1. Review bundle-stats.html for optimization opportunities');
    console.log('  2. Monitor lighthouse.report for detailed metrics');
    console.log('  3. Compare baselines over time: npm run perf:audit -- --compare perf-baseline.json\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Audit failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
