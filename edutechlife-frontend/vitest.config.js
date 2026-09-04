import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // src/lib/supabase.js throws at import time when these are absent, which
    // takes down any suite that transitively imports a Supabase-backed
    // component. CI has no .env, so tests get their own dummy credentials —
    // they only need to satisfy the guard, nothing here talks to the network.
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    css: true,
    pool: 'threads',
    testTimeout: 30000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      thresholds: {
        statements: 55,
        branches: 42,
        functions: 55,
        lines: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
