import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vitest.config.js';

// Used only by the fork-pool sharded CI runs.
// pool=forks: each test file gets its own OS process — no heap accumulation.
// Excludes src/tests/a11y/** because axe-core accumulates >5 GB per fork.
// The a11y suite is covered by the Smoke Test job instead.
export default mergeConfig(base, defineConfig({
  test: {
    pool: 'forks',
    exclude: ['src/tests/a11y/**'],
  },
}));
