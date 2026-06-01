import { useIALabStore } from '../../ialabStore';
import { describe, test, expect, beforeEach } from 'vitest';

const freshState = () => ({
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  startDate: new Date().toISOString(),
  lessonProgress: {},
  moduleProgress: {
    1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
    2: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    3: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    4: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
    5: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: false },
  },
  completedModules: [],
  badges: [],
  badgesDates: {},
  courseProgress: 0,
  visitedModules: [],
  completedExams: {},
  challengeScores: {},
  completedVideos: [],
  completedInfographics: [],
  completedActivities: [],
  forumPostCount: 0,
  forumCommentCount: 0,
  checkpointAnswers: {},
  lastVisitedLesson: null,
});

describe('Integration: progress flow (gamification + lesson + progress)', () => {
  beforeEach(() => {
    useIALabStore.setState(freshState());
  });

  test('markLessonComplete adds XP and tracks streak', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');
    const state = useIALabStore.getState();
    expect(state.lessonProgress[1]['lesson_1']).toBe('completed');
    expect(state.xp).toBe(50);
    expect(state.streak).toBe(1);
  });

  test('markLessonComplete awards streak_3 badge at 3-day streak', () => {
    const today = new Date().toISOString();
    useIALabStore.setState({ streak: 3, lastActivityDate: today });
    useIALabStore.getState().markLessonComplete(1, 'streak_test');
    const state = useIALabStore.getState();
    expect(state.badges).toContain('streak_3');
  });

  test('updateModuleActivity with exam unlocks next module', () => {
    const store = useIALabStore.getState();
    store.updateModuleActivity(1, 'exam', true, 90);
    store.updateModuleActivity(1, 'challenge', true, 85);
    store.updateModuleActivity(1, 'resourcesCompleted', true);

    const state = useIALabStore.getState();
    expect(state.moduleProgress[1].exam).toBe(true);
    expect(state.moduleProgress[1].challenge).toBe(true);
    expect(state.moduleProgress[1].resourcesCompleted).toBe(true);
    expect(state.moduleProgress[2].isUnlocked).toBe(true);
    expect(state.xp).toBeGreaterThan(0);
  });
});
