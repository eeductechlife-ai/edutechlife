import { renderHook } from '@testing-library/react';
import usePersonalizedRecommendations from '../usePersonalizedRecommendations';

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: vi.fn(),
}));

import { useIALabStore } from '../../../store/ialabStore';

function setupStore(overrides = {}) {
  const defaults = {
    streak: 3,
    lastActivityDate: new Date().toISOString(),
    badges: [],
    getLevel: () => 2,
    getLevelProgress: () => 50,
    getXpForNextLevel: () => 500,
    getTotalPoints: () => 1200,
    moduleProgress: {},
    getDaysSinceStart: () => 10,
    completedModules: [],
    completedVideos: [],
    completedExams: {},
    completedInfographics: [],
    challengeScores: {},
    courseProgress: 50,
    getWeeklyXP: () => 200,
    getDetailedRecommendations: () => [],
    forumPostCount: 0,
    lessonProgress: {},
  };
  const state = { ...defaults, ...overrides };
  useIALabStore.mockImplementation((selector) => selector(state));
}

function result(overrides = {}) {
  setupStore(overrides);
  return renderHook(() => usePersonalizedRecommendations()).result;
}

describe('usePersonalizedRecommendations', () => {
  test('returns high, medium, low categories', () => {
    const r = result();
    expect(r.current).toHaveProperty('high');
    expect(r.current).toHaveProperty('medium');
    expect(r.current).toHaveProperty('low');
  });

  test('returns empty arrays when no issues', () => {
    setupStore({
      completedVideos: ['m1v1', 'm1v2', 'm2v1', 'm2v2', 'm3v1', 'm3v2', 'm4v1', 'm4v2', 'm5v1'],
      completedInfographics: ['i1g1', 'i1g2', 'i1g3', 'i2g1', 'i2g2', 'i2g3', 'i3g1', 'i3g2', 'i3g3', 'i4g1', 'i4g2', 'i4g3', 'i5g1', 'i5g2'],
      completedExams: { 1: 95, 2: 90, 3: 85, 4: 88, 5: 92 },
      challengeScores: { 1: 100, 2: 95, 3: 90, 4: 85, 5: 88 },
      completedModules: [1, 2, 3, 4, 5],
      courseProgress: 100,
      streak: 7,
      lastActivityDate: new Date().toISOString(),
      lessonProgress: { 1: { l1: 'completed', l2: 'completed' } },
      forumPostCount: 3,
      badges: ['first_lesson', 'five_lessons', 'streak_3', 'first_module'],
    });

    const r = renderHook(() => usePersonalizedRecommendations()).result;
    expect(r.current.high).toHaveLength(0);
  });

  describe('module score recommendations', () => {
    test('adds recommendation for modules below 80%', () => {
      const r = result({
        completedExams: { 1: 0 },
        challengeScores: { 1: 0 },
      });

      const moduleRecs = r.current.high.filter(rec => rec.type === 'module_score');
      expect(moduleRecs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exam recommendations', () => {
    test('adds high-urgency exam recommendation when fewer than 2 exams passed', () => {
      const r = result({ completedExams: {} });
      expect(r.current.high.some(rec => rec.type === 'exams')).toBe(true);
    });

    test('does not add exam recommendation when 2+ exams passed', () => {
      const r = result({ completedExams: { 1: 90, 2: 85 } });
      expect(r.current.high.some(rec => rec.type === 'exams')).toBe(false);
    });
  });

  describe('challenge recommendations', () => {
    test('adds medium-urgency challenge recommendation when fewer than 2 challenges completed', () => {
      const r = result({ challengeScores: {} });
      const rec = r.current.medium.find(rec => rec.type === 'challenges');
      expect(rec).toBeTruthy();
    });

    test('does not add challenge recommendation when 2+ challenges completed', () => {
      const r = result({ challengeScores: { 1: 90, 2: 85 } });
      expect(r.current.medium.some(rec => rec.type === 'challenges')).toBe(false);
    });
  });

  describe('pace recommendations', () => {
    test('adds pace recommendation when lessonsPerDay < 0.8 and > 5 days since start', () => {
      const r = result({
        getDaysSinceStart: () => 10,
        lessonProgress: { 1: { l1: 'completed' } },
      });
      expect(r.current.medium.some(rec => rec.type === 'pace')).toBe(true);
    });

    test('does not add pace recommendation when studying fast enough', () => {
      const r = result({
        getDaysSinceStart: () => 10,
        lessonProgress: {
          1: { l1: 'completed', l2: 'completed', l3: 'completed' },
          2: { l1: 'completed', l2: 'completed', l3: 'completed' },
          3: { l1: 'completed', l2: 'completed', l3: 'completed' },
          4: { l1: 'completed', l2: 'completed' },
        },
      });
      expect(r.current.medium.some(rec => rec.type === 'pace')).toBe(false);
    });
  });

  describe('streak recommendations', () => {
    test('adds streak recommendation when streak is 0 and last activity was days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
      const r = result({ streak: 0, lastActivityDate: threeDaysAgo });
      expect(r.current.high.some(rec => rec.type === 'streak')).toBe(true);
    });

    test('does not add streak recommendation when streak is active', () => {
      const r = result({ streak: 5, lastActivityDate: new Date().toISOString() });
      expect(r.current.high.some(rec => rec.type === 'streak')).toBe(false);
    });
  });

  describe('progress recommendations', () => {
    test('adds progress recommendation when courseProgress < 30', () => {
      const r = result({ courseProgress: 20 });
      expect(r.current.medium.some(rec => rec.type === 'progress')).toBe(true);
    });

    test('does not add progress recommendation when courseProgress >= 30', () => {
      const r = result({ courseProgress: 50 });
      expect(r.current.medium.some(rec => rec.type === 'progress')).toBe(false);
    });
  });

  describe('community recommendations', () => {
    test('adds community recommendation when forumPostCount is 0 and modules completed', () => {
      const r = result({ forumPostCount: 0, completedModules: [1] });
      expect(r.current.low.some(rec => rec.type === 'community')).toBe(true);
    });

    test('does not add community recommendation when user has posted', () => {
      const r = result({ forumPostCount: 3, completedModules: [1] });
      expect(r.current.low.some(rec => rec.type === 'community')).toBe(false);
    });

    test('does not add community recommendation when no modules completed', () => {
      const r = result({ forumPostCount: 0, completedModules: [] });
      expect(r.current.low.some(rec => rec.type === 'community')).toBe(false);
    });
  });

  describe('badge recommendations', () => {
    test('adds badge recommendation when next badge is available', () => {
      const r = result({
        streaks: 3,
        lessonProgress: { 1: { l1: 'completed' } },
        badges: [],
      });
      expect(r.current.low.some(rec => rec.type === 'badge')).toBe(true);
    });
  });

  describe('calculateModuleScore scoring', () => {
    function getModuleScores() {
      const r = renderHook(() => usePersonalizedRecommendations()).result;
      return [...r.current.high, ...r.current.medium, ...r.current.low]
        .filter(rec => rec.type === 'module_score');
    }

    test('module with 0 resources, 0 exam, 0 challenge, not completed scores 0', () => {
      setupStore({
        completedVideos: [],
        completedInfographics: [],
        completedExams: { 1: 0 },
        challengeScores: { 1: 0 },
        completedModules: [],
        getDetailedRecommendations: () => [],
        courseProgress: 100,
        streak: 7,
        lessonProgress: {},
        forumPostCount: 3,
        badges: ['first_lesson', 'five_lessons', 'streak_3', 'first_module'],
      });
      const recs = getModuleScores();
      expect(recs.some(r => r.moduleId === 1)).toBe(true);
    });

    test('module with 80%+ resources but 0 exam/challenge scores 30 (below 80 threshold)', () => {
      setupStore({
        completedVideos: ['m1v1', 'm1v2'],
        completedInfographics: ['i1g1', 'i1g2'],
        completedExams: { 1: 0, 2: 95, 3: 90, 4: 85, 5: 92 },
        challengeScores: { 1: 0, 2: 90, 3: 85, 4: 88, 5: 92 },
        completedModules: [2, 3, 4, 5],
        courseProgress: 80,
        streak: 7,
        lessonProgress: {},
        forumPostCount: 3,
        badges: ['first_lesson', 'five_lessons', 'streak_3', 'first_module'],
      });
      const recs = getModuleScores();
      expect(recs.some(r => r.moduleId === 1)).toBe(true);
    });

    test('module with all resources, exam 95, challenge 100, completed scores 100 (no recommendation)', () => {
      setupStore({
        completedVideos: ['m1v1', 'm1v2'],
        completedInfographics: ['i1g1', 'i1g2', 'i1g3'],
        completedExams: { 1: 95 },
        challengeScores: { 1: 100 },
        completedModules: [1],
        courseProgress: 100,
        streak: 7,
        lessonProgress: {},
        forumPostCount: 3,
        badges: ['first_lesson', 'five_lessons', 'streak_3', 'first_module'],
      });
      const recs = getModuleScores();
      expect(recs.some(r => r.moduleId === 1)).toBe(false);
    });
  });
});
