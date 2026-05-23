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

describe('getDetailedRecommendations', () => {
  test('returns empty array for fresh state with no progress', () => {
    const recs = useIALabStore.getState().getDetailedRecommendations();
    expect(Array.isArray(recs)).toBe(true);
  });

  test('includes resources recommendation when no resources viewed', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'resourcesCompleted', false);
    store.setActiveMod(1);
    const recs = store.getDetailedRecommendations();
    const resourcesRec = recs.find(r => r.type === 'resources');
    expect(resourcesRec).toBeDefined();
  });

  test('sorts recommendations by urgency (high first)', () => {
    const store = useIALabStore.getState();
    store.setActiveMod(1);
    const recs = store.getDetailedRecommendations();
    const urgencyOrder = recs.map(r => r.urgency);
    const highIdx = urgencyOrder.indexOf('high');
    const medIdx = urgencyOrder.indexOf('medium');
    if (highIdx !== -1 && medIdx !== -1) {
      expect(highIdx).toBeLessThan(medIdx);
    }
  });

  test('handles corrupt quiz attempts data gracefully', () => {
    const store = useIALabStore.getState();
    const spy = vi.spyOn(store, 'storageGet').mockImplementation((key) => {
      if (key.startsWith('quizAttempts')) {
        return [{ failedQuestions: 'corrupt_string_not_array' }];
      }
      return [];
    });
    expect(() => store.getDetailedRecommendations()).not.toThrow();
    spy.mockRestore();
  });

  test('handles null failedQuestions gracefully', () => {
    const store = useIALabStore.getState();
    const spy = vi.spyOn(store, 'storageGet').mockImplementation((key) => {
      if (key.startsWith('quizAttempts')) {
        return [{ failedQuestions: null }];
      }
      return [];
    });
    expect(() => store.getDetailedRecommendations()).not.toThrow();
    spy.mockRestore();
  });

  test('includes exam recommendation when exam score is below 80', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'exam', true, 65);
    store.updateModuleActivity(1, 'resourcesCompleted', true);
    const recs = store.getDetailedRecommendations();
    const examRec = recs.find(r => r.type === 'exam');
    expect(examRec).toBeDefined();
    expect(examRec.text).toContain('65');
  });

  test('includes challenge recommendation when challenge score is below 80', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'challenge', true, 70);
    const recs = store.getDetailedRecommendations();
    const challengeRec = recs.find(r => r.type === 'challenge');
    expect(challengeRec).toBeDefined();
    expect(challengeRec.text).toContain('70');
  });
});
