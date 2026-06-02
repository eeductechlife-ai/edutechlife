import { useIALabStore } from '../ialabStore';
import { ALL_LESSONS } from '@/data/ialab';

const createFreshLessonState = () => ({
  lessonProgress: {},
  checkpointAnswers: {},
  lastVisitedLesson: null,
  moduleProgress: {
    1: { exam: false, challenge: false, resourcesCompleted: false, community: false, currentScore: 0, isUnlocked: true },
  },
  completedModules: [],
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  badges: [],
  badgesDates: {},
  forumPostCount: 0,
  forumCommentCount: 0,
  startDate: new Date().toISOString(),
});

beforeEach(() => {
  useIALabStore.setState(createFreshLessonState());
  localStorage.clear();
});

describe('lessonSlice — markLessonComplete', () => {
  test('marks lesson as completed', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');
    const progress = useIALabStore.getState().lessonProgress;
    expect(progress[1]['lesson_1']).toBe('completed');
  });

  test('adds xp on completion', () => {
    const store = useIALabStore.getState();
    const initialXp = store.xp;
    store.markLessonComplete(1, 'lesson_1');
    expect(useIALabStore.getState().xp).toBe(initialXp + 50);
  });

  test('does not duplicate if already completed', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');
    const xpAfterFirst = useIALabStore.getState().xp;
    store.markLessonComplete(1, 'lesson_1');
    expect(useIALabStore.getState().xp).toBe(xpAfterFirst);
  });

  test('creates module entry if missing', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(5, 'lesson_a');
    const progress = useIALabStore.getState().lessonProgress;
    expect(progress[5]['lesson_a']).toBe('completed');
  });
});

describe('lessonSlice — markLessonInProgress', () => {
  test('marks lesson as in-progress', () => {
    const store = useIALabStore.getState();
    store.markLessonInProgress(1, 'lesson_1');
    expect(useIALabStore.getState().lessonProgress[1]['lesson_1']).toBe('in-progress');
  });

  test('creates module entry if missing', () => {
    const store = useIALabStore.getState();
    store.markLessonInProgress(3, 'lesson_x');
    expect(useIALabStore.getState().lessonProgress[3]['lesson_x']).toBe('in-progress');
  });
});

describe('lessonSlice — checkpointAnswers', () => {
  test('records checkpoint answer', () => {
    const store = useIALabStore.getState();
    store.recordCheckpointAnswer(1, 'lesson_1', 2);
    expect(useIALabStore.getState().checkpointAnswers[1]['lesson_1']).toBe(2);
  });

  test('creates module entry if missing', () => {
    const store = useIALabStore.getState();
    store.recordCheckpointAnswer(2, 'check_1', 0);
    expect(useIALabStore.getState().checkpointAnswers[2]['check_1']).toBe(0);
  });

  test('overwrites previous answer', () => {
    const store = useIALabStore.getState();
    store.recordCheckpointAnswer(1, 'lesson_1', 2);
    store.recordCheckpointAnswer(1, 'lesson_1', 3);
    expect(useIALabStore.getState().checkpointAnswers[1]['lesson_1']).toBe(3);
  });
});

describe('lessonSlice — lastVisitedLesson', () => {
  test('initializes as null', () => {
    expect(useIALabStore.getState().lastVisitedLesson).toBeNull();
  });

  test('setLastVisitedLesson stores moduleId and lessonId', () => {
    useIALabStore.getState().setLastVisitedLesson(2, 'lesson_3');
    expect(useIALabStore.getState().lastVisitedLesson).toEqual({ moduleId: 2, lessonId: 'lesson_3' });
  });
});

describe('lessonSlice — getCompletedLessonCount', () => {
  test('returns 0 for module with no progress', () => {
    expect(useIALabStore.getState().getCompletedLessonCount(1)).toBe(0);
  });

  test('returns count of completed lessons', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');
    store.markLessonComplete(1, 'lesson_2');
    expect(store.getCompletedLessonCount(1)).toBe(2);
  });

  test('does not count in-progress lessons', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, 'lesson_1');
    store.markLessonInProgress(1, 'lesson_2');
    expect(store.getCompletedLessonCount(1)).toBe(1);
  });
});

describe('lessonSlice — getModuleLessons', () => {
  test('returns array with status for each lesson', () => {
    const lessons = useIALabStore.getState().getModuleLessons(1);
    expect(Array.isArray(lessons)).toBe(true);
    lessons.forEach(lesson => {
      expect(lesson).toHaveProperty('status');
    });
  });

  test('marks first lesson as available', () => {
    const lessons = useIALabStore.getState().getModuleLessons(1);
    if (lessons.length > 0) {
      expect(lessons[0].status).toBe('available');
    }
  });

  test('marks completed lessons correctly', () => {
    const store = useIALabStore.getState();
    store.markLessonComplete(1, ALL_LESSONS[1][0].id);
    const lessons = store.getModuleLessons(1);
    expect(lessons[0].status).toBe('completed');
  });

  test('returns empty array for invalid module', () => {
    expect(useIALabStore.getState().getModuleLessons(99)).toEqual([]);
  });
});

describe('lessonSlice — getNextUncompletedLesson', () => {
  test('returns first lesson when none completed', () => {
    const next = useIALabStore.getState().getNextUncompletedLesson(1);
    expect(next).not.toBeNull();
    expect(next.id).toBeDefined();
  });

  test('returns null when all completed', () => {
    const store = useIALabStore.getState();
    const lessons = ALL_LESSONS[1] || [];
    lessons.forEach(l => store.markLessonComplete(1, l.id));
    expect(store.getNextUncompletedLesson(1)).toBeNull();
  });

  test('returns next uncompleted lesson', () => {
    const store = useIALabStore.getState();
    const lessons = ALL_LESSONS[1] || [];
    if (lessons.length > 0) {
      store.markLessonComplete(1, lessons[0].id);
      const next = store.getNextUncompletedLesson(1);
      expect(next.id).toBe(lessons[1].id);
    }
  });
});

describe('lessonSlice — viewed resources (localStorage)', () => {
  beforeEach(() => {
    localStorage.removeItem('ialab_viewedResources');
  });

  test('getViewedResources returns empty array initially', () => {
    expect(useIALabStore.getState().getViewedResources()).toEqual([]);
  });

  test('addViewedResource adds id', () => {
    const store = useIALabStore.getState();
    store.addViewedResource('res_1');
    expect(store.getViewedResources()).toContain('res_1');
  });

  test('addViewedResource does not duplicate', () => {
    const store = useIALabStore.getState();
    store.addViewedResource('res_1');
    store.addViewedResource('res_1');
    expect(store.getViewedResources().filter(r => r === 'res_1')).toHaveLength(1);
  });

  test('addViewedResource appends multiple', () => {
    const store = useIALabStore.getState();
    store.addViewedResource('res_1');
    store.addViewedResource('res_2');
    expect(store.getViewedResources()).toEqual(['res_1', 'res_2']);
  });

  test('setViewedResources replaces all', () => {
    const store = useIALabStore.getState();
    store.setViewedResources(['a', 'b', 'c']);
    expect(store.getViewedResources()).toEqual(['a', 'b', 'c']);
  });

  test('setViewedResources with empty array', () => {
    const store = useIALabStore.getState();
    store.addViewedResource('res_1');
    store.setViewedResources([]);
    expect(store.getViewedResources()).toEqual([]);
  });
});

describe('lessonSlice — completed videos (localStorage)', () => {
  beforeEach(() => {
    localStorage.removeItem('ialab_completedVideos');
  });

  test('getCompletedVideos returns empty array initially', () => {
    expect(useIALabStore.getState().getCompletedVideos()).toEqual([]);
  });

  test('setCompletedVideos persists', () => {
    const store = useIALabStore.getState();
    store.setCompletedVideos(['vid_1']);
    expect(store.getCompletedVideos()).toEqual(['vid_1']);
  });

  test('markVideoComplete adds video', () => {
    const store = useIALabStore.getState();
    store.markVideoComplete('vid_1');
    expect(store.getCompletedVideos()).toContain('vid_1');
  });

  test('markVideoComplete does not duplicate', () => {
    const store = useIALabStore.getState();
    store.markVideoComplete('vid_1');
    store.markVideoComplete('vid_1');
    expect(store.getCompletedVideos().filter(v => v === 'vid_1')).toHaveLength(1);
  });
});

describe('lessonSlice — hasStartedCourse', () => {
  beforeEach(() => {
    useIALabStore.setState({ completedVideos: [] });
  });
  test('returns false initially', () => {
    expect(useIALabStore.getState().hasStartedCourse()).toBe(false);
  });

  test('returns true when module has exam', () => {
    useIALabStore.setState({
      moduleProgress: {
        1: { exam: true, challenge: false, resourcesCompleted: false, community: false, currentScore: 80, isUnlocked: true },
      },
    });
    expect(useIALabStore.getState().hasStartedCourse()).toBe(true);
  });
});
