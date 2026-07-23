import { describe, it, expect } from 'vitest';

describe('Health route', () => {
  it('exports a router function', async () => {
    const mod = await import('./health.js');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
