const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test-setup.js'],
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      thresholds: {
        statements: 67,
        branches: 50,
        functions: 65,
        lines: 69,
      },
    },
    pool: 'forks',
    testTimeout: 10000,
  },
});
