import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    xp: 0,
    streak: 0,
    badges: [],
    courseProgress: 0,
    courseCompleted: false,
    activeMod: 1,
    visitedModules: [],
    completedModules: [],
    moduleProgress: {
      1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
      2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
      3: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
      4: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
      5: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    },
    completedExams: {},
    challengeScores: {},
    completedVideos: [],
    completedInfographics: [],
    completedActivities: [],
    lessonProgress: {},
  });
});

describe('progressSlice — calculateModuleScore', () => {
  test('returns 0 for unvisited module (no moduleProgress entry)', () => {
    expect(useIALabStore.getState().calculateModuleScore(99)).toBe(0);
  });

  test('returns 0 for initial module state', () => {
    expect(useIALabStore.getState().calculateModuleScore(1)).toBe(0);
  });

  test('scores exam only when examEarned is set', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'exam', true, 85);
    expect(useIALabStore.getState().calculateModuleScore(1)).toBeGreaterThan(0);
  });
});

describe('progressSlice — updateModuleActivity', () => {
  test('marks exam complete and stores score', () => {
    const store = useIALabStore.getState();
    const result = store.updateModuleActivity(1, 'exam', true, 90);
    const mod = useIALabStore.getState().moduleProgress[1];
    expect(mod.exam).toBe(true);
    expect(mod.currentScore).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  test('marks challenge complete and stores score', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'challenge', true, 85);
    const mod = useIALabStore.getState().moduleProgress[1];
    expect(mod.challenge).toBe(true);
  });

  test('marks resources completed', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'resourcesCompleted', true);
    const mod = useIALabStore.getState().moduleProgress[1];
    expect(mod.resourcesCompleted).toBe(true);
  });

  test('marks community completed', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'community', true);
    const mod = useIALabStore.getState().moduleProgress[1];
    expect(mod.community).toBe(true);
  });

  test('dispatches ialab:moduleCompleted only when the module crosses 80%', () => {
    const onCompleted = vi.fn();
    window.addEventListener('ialab:moduleCompleted', onCompleted);

    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'exam', true, 50);
    expect(onCompleted).not.toHaveBeenCalled();

    store.updateModuleActivity(1, 'challenge', true, 90);
    store.updateModuleActivity(1, 'resourcesCompleted', true);
    store.updateModuleActivity(1, 'community', true);
    store.updateModuleActivity(1, 'exam', true, 95);

    expect(onCompleted).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { moduleId: 1 } }),
    );

    window.removeEventListener('ialab:moduleCompleted', onCompleted);
  });
});

describe('progressSlice — markResourceAsViewed', () => {
  test('increments viewed resources', () => {
    const store = useIALabStore.getState();
    store.markResourceAsViewed(1, 'video_1');
    const mod = useIALabStore.getState().moduleProgress[1];
    expect(mod.viewedResources).toBeDefined();
    expect(mod.viewedResources).toContain('video_1');
  });

  test('does not duplicate viewed resources', () => {
    const store = useIALabStore.getState();
    store.markResourceAsViewed(1, 'video_1');
    store.markResourceAsViewed(1, 'video_1');
    const mod = useIALabStore.getState().moduleProgress[1];
    const matches = mod.viewedResources.filter(r => r === 'video_1');
    expect(matches).toHaveLength(1);
  });
});

describe('progressSlice — course progress', () => {
  test('setCourseProgress updates global progress', () => {
    useIALabStore.getState().setCourseProgress(50);
    expect(useIALabStore.getState().courseProgress).toBe(50);
  });

  test('setIsLoadingProgress toggles loading state', () => {
    useIALabStore.getState().setIsLoadingProgress(false);
    expect(useIALabStore.getState().isLoadingProgress).toBe(false);
  });
});

describe('progressSlice — isEvaluationLocked', () => {
  test('module 1 is never locked', () => {
    expect(useIALabStore.getState().isEvaluationLocked(1)).toBe(false);
  });

  test('module N is locked when module N-1 is not completed', () => {
    useIALabStore.setState({ completedModules: [] });
    expect(useIALabStore.getState().isEvaluationLocked(2)).toBe(true);
  });

  test('module N unlocks once module N-1 is completed', () => {
    useIALabStore.setState({ completedModules: [1] });
    expect(useIALabStore.getState().isEvaluationLocked(2)).toBe(false);
  });

  test('admin role bypasses the lock', () => {
    useIALabStore.setState({ completedModules: [], userRole: 'admin' });
    expect(useIALabStore.getState().isEvaluationLocked(2)).toBe(false);
  });
});
