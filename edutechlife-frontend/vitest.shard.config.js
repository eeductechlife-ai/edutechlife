import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vitest.config.js';

// Used only by the fork-pool sharded CI runs.
// Excludes src/tests/a11y/** because axe-core accumulates >5 GB per fork
// when 6+ tests share a single forked Node.js process.
// The a11y suite is covered by the Smoke Test job (thread pool, shared heap).
export default mergeConfig(base, defineConfig({
  test: {
    exclude: ['src/tests/a11y/**'],
  },
}));
