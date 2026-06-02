import { describe, it, expect, beforeEach } from 'vitest';

describe('IALab Store', () => {
  let useIALabStore;

  beforeEach(async () => {
    const mod = await import('../../../store/ialabStore');
    useIALabStore = mod.useIALabStore;
  });

  it('should have initial state with store interface', () => {
    const state = useIALabStore.getState();
    expect(state.streak).toBeDefined();
    expect(state.activeMod).toBeDefined();
    expect(typeof state.getLevel).toBe('function');
  });

  it('getBadgesSummary should be a function', () => {
    const state = useIALabStore.getState();
    expect(typeof state.getBadgesSummary).toBe('function');
  });

  it('getLevel should return valid level', () => {
    const level = useIALabStore.getState().getLevel();
    expect(typeof level).toBe('number');
    expect(level).toBeGreaterThanOrEqual(1);
  });

  it('should have streak as a number', () => {
    const state = useIALabStore.getState();
    expect(typeof state.streak).toBe('number');
    expect(state.streak).toBeGreaterThanOrEqual(0);
  });

  it('should have module progress tracking', () => {
    const state = useIALabStore.getState();
    expect(typeof state.courseProgress).toBe('number');
    expect(typeof state.calculateModuleScore).toBe('function');
  });
});
