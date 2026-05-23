import { ls, memoize, clearMemoCache, calcModuleScore, calcGlobalProgress } from '../ialab';
import { WEIGHTS } from '@/constants/ialab';

beforeEach(() => {
  localStorage.clear();
  clearMemoCache();
});

describe('ls', () => {
  test('get returns fallback for missing key', () => {
    expect(ls.get('nonexistent', 42)).toBe(42);
    expect(ls.get('nonexistent')).toBe(null);
  });

  test('get returns parsed stored value after flush', async () => {
    ls.set('key1', { a: 1 });
    await new Promise(process.nextTick);
    expect(ls.get('key1')).toEqual({ a: 1 });
  });

  test('read-after-write returns pending value without flush', () => {
    ls.set('key', 'val');
    expect(ls.get('key')).toBe('val');
  });

  test('set overwrites pending value before flush', () => {
    ls.set('key', 'first');
    ls.set('key', 'second');
    expect(ls.get('key')).toBe('second');
  });

  test('batch set flushes all keys to localStorage', async () => {
    ls.set('a', 1);
    ls.set('b', 2);
    await new Promise(process.nextTick);
    expect(JSON.parse(localStorage.getItem('a'))).toBe(1);
    expect(JSON.parse(localStorage.getItem('b'))).toBe(2);
  });

  test('remove deletes key from localStorage', async () => {
    ls.set('key', 'val');
    await new Promise(process.nextTick);
    ls.remove('key');
    expect(localStorage.getItem('key')).toBe(null);
  });

  test('remove clears pending value before flush', () => {
    ls.set('key', 'pending');
    ls.remove('key');
    expect(ls.get('key')).toBe(null);
  });

  test('get returns fallback on JSON parse error', () => {
    localStorage.setItem('bad', 'not-json{');
    expect(ls.get('bad', 'fallback')).toBe('fallback');
  });

  test('multiple independent sets work correctly', async () => {
    ls.set('x', 10);
    ls.set('y', 20);
    await new Promise(process.nextTick);

    expect(ls.get('x')).toBe(10);
    expect(ls.get('y')).toBe(20);

    ls.set('x', 99);
    await new Promise(process.nextTick);
    expect(ls.get('x')).toBe(99);
    expect(ls.get('y')).toBe(20);
  });
});

describe('memoize', () => {
  test('returns value from factory function', () => {
    const fn = vi.fn(() => 42);
    expect(memoize('a', fn)).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('returns cached value within TTL without calling factory', () => {
    const fn = vi.fn(() => Math.random());
    const first = memoize('b', fn);
    const second = memoize('b', fn);
    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('recomputes after TTL expires', async () => {
    const fn = vi.fn(() => Math.random());
    const first = memoize('c', fn, 50);
    await new Promise(r => setTimeout(r, 60));
    const second = memoize('c', fn, 50);
    expect(second).not.toBe(first);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('different keys do not interfere', () => {
    const fa = vi.fn(() => 'a');
    const fb = vi.fn(() => 'b');
    expect(memoize('k1', fa)).toBe('a');
    expect(memoize('k2', fb)).toBe('b');
    expect(memoize('k1', fa)).toBe('a');
    expect(fa).toHaveBeenCalledTimes(1);
    expect(fb).toHaveBeenCalledTimes(1);
  });

  test('clearMemoCache clears all cached values', () => {
    const fn = vi.fn(() => 1);
    memoize('x', fn);
    expect(memoize('x', fn)).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);

    clearMemoCache();
    expect(memoize('x', fn)).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('calcModuleScore', () => {
  test('returns 0 for null/undefined', () => {
    expect(calcModuleScore(null)).toBe(0);
    expect(calcModuleScore(undefined)).toBe(0);
  });

  test('returns 0 for all-false progress', () => {
    const mod = { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(0);
  });

  test('returns exam weight when exam is true', () => {
    const mod = { exam: true, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(WEIGHTS.exam);
  });

  test('returns challenge weight when challenge is true', () => {
    const mod = { exam: false, challenge: true, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(WEIGHTS.challenge);
  });

  test('returns resources weight when resourcesCompleted is true', () => {
    const mod = { exam: false, challenge: false, resourcesCompleted: true, community: false, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(WEIGHTS.resources);
  });

  test('returns community weight when community is true', () => {
    const mod = { exam: false, challenge: false, resourcesCompleted: false, community: true, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(WEIGHTS.community);
  });

  test('returns 100 when all are true', () => {
    const mod = { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(100);
  });

  test('uses examEarned/challengeEarned when present (partial scores)', () => {
    const mod = { exam: false, challenge: false, resourcesCompleted: true, community: true, examEarned: 17.5, challengeEarned: 15, currentScore: 0, isUnlocked: true };
    expect(calcModuleScore(mod)).toBe(17.5 + 15 + WEIGHTS.resources + WEIGHTS.community);
  });

  test('caps score at 100', () => {
    const mod = { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 0, isUnlocked: true, examEarned: 100, challengeEarned: 100 };
    expect(calcModuleScore(mod)).toBe(100);
  });

  test('rounds to one decimal place', () => {
    const mod = { exam: false, challenge: false, resourcesCompleted: true, community: false, examEarned: 20.55, currentScore: 0, isUnlocked: true };
    const score = calcModuleScore(mod);
    const decimalPlaces = score.toString().includes('.') ? score.toString().split('.')[1].length : 0;
    expect(decimalPlaces).toBeLessThanOrEqual(1);
  });
});

describe('calcGlobalProgress', () => {
  const emptyModule = { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true };
  const fullModule = { exam: true, challenge: true, resourcesCompleted: true, community: true, currentScore: 100, isUnlocked: true };

  test('returns 0 when no modules have progress', () => {
    expect(calcGlobalProgress({})).toBe(0);
  });

  test('returns 20 when one module is 100% complete', () => {
    const progress = { 1: fullModule, 2: emptyModule, 3: emptyModule, 4: emptyModule, 5: emptyModule };
    expect(calcGlobalProgress(progress)).toBe(20);
  });

  test('returns 100 when all 5 modules are 100% complete', () => {
    const progress = { 1: fullModule, 2: fullModule, 3: fullModule, 4: fullModule, 5: fullModule };
    expect(calcGlobalProgress(progress)).toBe(100);
  });

  test('calculates partial progress correctly', () => {
    const halfModule = { exam: false, challenge: false, resourcesCompleted: true, community: false, currentScore: 0, isUnlocked: true };
    const expectedScore = calcModuleScore(halfModule);
    const expectedContribution = (expectedScore / 100) * 20;
    const progress = { 1: halfModule };
    expect(calcGlobalProgress(progress)).toBe(Math.round(expectedContribution));
  });

  test('ignores undefined module entries', () => {
    const progress = { 1: fullModule, 3: fullModule };
    expect(calcGlobalProgress(progress)).toBe(40);
  });
});
