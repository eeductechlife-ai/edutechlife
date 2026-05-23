import { renderHook, act, waitFor } from '@testing-library/react';
import { useIALabProgress } from '../useIALabProgress';

const mockContextValues = () => ({
  user: { id: 'test-user-123' },
  isLoaded: true,
  activeMod: 1,
  completedModules: [],
  setCompletedModules: vi.fn(),
  visitedModules: [1],
  setVisitedModules: vi.fn((fn) => {
    if (typeof fn === 'function') {
      const prev = [1];
      return fn(prev);
    }
    return fn;
  }),
  isLoadingProgress: false,
  setIsLoadingProgress: vi.fn(),
  courseProgress: 0,
  setCourseProgress: vi.fn(),
  currentLessonIndex: 0,
  setCurrentLessonIndex: vi.fn(),
  modules: [{ id: 1, title: 'Módulo 1' }, { id: 2, title: 'Módulo 2' }],
  updateModuleActivity: vi.fn(),
});

const mockProgressService = () => ({
  getAllProgress: vi.fn().mockResolvedValue([]),
  getFullUserProgress: vi.fn().mockResolvedValue({
    allProgress: [],
    moduleBreakdowns: {},
    globalProgress: 0,
    lastProgress: null,
  }),
  calculateGlobalProgressFromDB: vi.fn().mockResolvedValue(0),
  getModuleBreakdown: vi.fn().mockResolvedValue({
    exam: { passed: false, score: 0 },
    challenge: { score: 0 },
    resources: { earned: 0 },
    community: { commented: false },
  }),
  getUserLastProgress: vi.fn().mockResolvedValue(null),
  saveProgress: vi.fn().mockResolvedValue({ success: true, data: {} }),
  saveLastLesson: vi.fn().mockResolvedValue({ success: true }),
  saveResourceViewed: vi.fn().mockResolvedValue({ success: true, viewedCount: 1 }),
  saveExamProgress: vi.fn().mockResolvedValue({ success: true }),
  saveChallengeProgress: vi.fn().mockResolvedValue({ success: true }),
  saveCommunityProgress: vi.fn().mockResolvedValue({ success: true }),
});

let mockContext;
let mockService;
let mockStoreGetState;
let mockCacheData;
let mockSupabaseLoading = false;

vi.mock('../../../context/IALabContext', () => ({
  useIALabContext: () => mockContext,
  useIALabProgressContext: () => mockContext,
  useIALabUIContext: () => mockContext,
}));

vi.mock('../../useSupabase', () => ({
  useSupabase: () => ({
    supabase: {},
    isLoading: mockSupabaseLoading,
  }),
}));

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: Object.assign(
    (selector) => selector ? selector(mockStoreGetState) : mockStoreGetState,
    { getState: () => mockStoreGetState }
  ),
}));

vi.mock('../../../lib/progress', () => ({
  setSupabaseClient: vi.fn(),
  createProgressService: () => mockService,
  PROGRESS_STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    LOCKED: 'locked',
  },
  countModuleResources: vi.fn(() => 6),
}));

beforeEach(() => {
  mockContext = mockContextValues();
  mockService = mockProgressService();
  mockCacheData = null;
  mockSupabaseLoading = false;
  mockStoreGetState = {
    setProgressCache: vi.fn((data) => { mockCacheData = data; }),
    getProgressCache: vi.fn(() => mockCacheData),
    removeProgressCache: vi.fn(() => { mockCacheData = null; }),
    addXp: vi.fn(),
    courseProgress: 0,
    isChallengeCompleted: false,
    challengeScore: 0,
    quizPassed: false,
    quizScore: 0,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useIALabProgress', () => {
  test('returns all expected values and functions', () => {
    const { result } = renderHook(() => useIALabProgress());

    expect(result.current).toHaveProperty('isLoadingProgress');
    expect(result.current).toHaveProperty('progressError');
    expect(result.current).toHaveProperty('completedModules');
    expect(result.current).toHaveProperty('visitedModules');
    expect(result.current).toHaveProperty('courseProgress');
    expect(result.current).toHaveProperty('loadUserProgress');
    expect(result.current).toHaveProperty('saveModuleProgress');
    expect(result.current).toHaveProperty('saveCurrentLesson');
    expect(result.current).toHaveProperty('completeCurrentModule');
    expect(result.current).toHaveProperty('trackResourceViewed');
    expect(result.current).toHaveProperty('trackExamResult');
    expect(result.current).toHaveProperty('trackChallengeResult');
    expect(result.current).toHaveProperty('trackCommunityComment');
    expect(result.current).toHaveProperty('loadModuleBreakdown');
    expect(result.current).toHaveProperty('PROGRESS_STATUS');
    expect(result.current).toHaveProperty('isChallengeCompleted');
    expect(result.current).toHaveProperty('challengeScore');
    expect(result.current).toHaveProperty('quizPassed');
    expect(result.current).toHaveProperty('quizScore');
  });

  test('combines isLoadingProgress with supabase loading', () => {
    mockSupabaseLoading = true;

    const { result } = renderHook(() => useIALabProgress());
    expect(result.current.isLoadingProgress).toBe(true);
  });

  test('does not load progress when user is null', () => {
    mockContext.user = null;

    renderHook(() => useIALabProgress());

    expect(mockContext.setIsLoadingProgress).toHaveBeenCalledWith(false);
    expect(mockService.getAllProgress).not.toHaveBeenCalled();
  });

  test('does not load progress when isLoaded is false', () => {
    mockContext.isLoaded = false;

    renderHook(() => useIALabProgress());

    expect(mockContext.setIsLoadingProgress).not.toHaveBeenCalled();
    expect(mockService.getAllProgress).not.toHaveBeenCalled();
  });

  test('loads progress from cache immediately when available', async () => {
    mockCacheData = {
      courseProgress: 42,
      completedModules: [1],
      visitedModules: [1, 2],
      userId: 'test-user-123',
      timestamp: Date.now(),
    };

    renderHook(() => useIALabProgress());

    await waitFor(() => {
      expect(mockContext.setCourseProgress).toHaveBeenCalledWith(42);
    });
    expect(mockContext.setCompletedModules).toHaveBeenCalledWith([1]);
  });

  test('fetches progress from DB when no cache', async () => {
    mockService.getFullUserProgress.mockResolvedValue({
      allProgress: [
        { module_id: 1, is_completed: true, module_score: 90 },
        { module_id: 2, is_completed: false, module_score: 50 },
      ],
      moduleBreakdowns: {
        1: { moduleId: 1, exam: { passed: true, score: 90 }, challenge: { score: 0 }, resources: { earned: 0 }, community: { commented: false } },
        2: { moduleId: 2, exam: { passed: false, score: 50 }, challenge: { score: 0 }, resources: { earned: 0 }, community: { commented: false } },
      },
      globalProgress: 55,
      lastProgress: null,
    });

    renderHook(() => useIALabProgress());

    await waitFor(() => {
      expect(mockService.getFullUserProgress).toHaveBeenCalledWith('test-user-123');
    });

    await waitFor(() => {
      expect(mockContext.setCompletedModules).toHaveBeenCalled();
    });
    expect(mockContext.setCourseProgress).toHaveBeenCalledWith(55);
  });

  test('handles DB error gracefully with cache fallback', async () => {
    mockService.getAllProgress.mockRejectedValue(new Error('Network error'));

    renderHook(() => useIALabProgress());

    await waitFor(() => {
      expect(mockContext.setIsLoadingProgress).toHaveBeenCalledWith(false);
    });
  });

  test('sets empty state when DB returns no data', async () => {
    mockService.getAllProgress.mockResolvedValue([]);

    renderHook(() => useIALabProgress());

    await waitFor(() => {
      expect(mockContext.setCompletedModules).toHaveBeenCalledWith([]);
    });
    expect(mockContext.setVisitedModules).toHaveBeenCalled();
  });

  test('does not fetch when progressService is null', () => {
    mockService = null;

    const { result } = renderHook(() => useIALabProgress());

    expect(result.current.isLoadingProgress).toBe(false);
    expect(result.current.progressError).toBeNull();
  });

  test('saveModuleProgress returns error when no user', async () => {
    mockContext.user = null;
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveModuleProgress(1, 'completed');
    });

    expect(res).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  test('saveModuleProgress returns error when no progressService', async () => {
    mockService = null;
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveModuleProgress(1, 'completed');
    });

    expect(res).toEqual({ success: false, error: 'Servicio de progreso no disponible' });
  });

  test('saveModuleProgress calls progressService.saveProgress', async () => {
    mockService.saveProgress.mockResolvedValue({ success: true, data: { id: 1 } });

    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveModuleProgress(1, 'in_progress', { extra: 'data' });
    });

    expect(mockService.saveProgress).toHaveBeenCalledWith(1, 'in_progress', { extra: 'data' }, 'test-user-123');
    expect(res.success).toBe(true);
  });

  test('saveModuleProgress with COMPLETED status updates store state', async () => {
    mockService.saveProgress.mockResolvedValue({ success: true, data: {} });

    const { result } = renderHook(() => useIALabProgress());

    await act(async () => {
      return result.current.saveModuleProgress(1, 'completed');
    });

    expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'exam', true, 100);
    expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'challenge', true, 100);
    expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'resourcesCompleted', true);
    expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'community', true);
    expect(mockContext.setCompletedModules).toHaveBeenCalled();
  });

  test('saveModuleProgress marks module as visited', async () => {
    mockService.saveProgress.mockResolvedValue({ success: true, data: {} });

    const { result } = renderHook(() => useIALabProgress());

    await act(async () => {
      return result.current.saveModuleProgress(2, 'in_progress');
    });

    expect(mockContext.setVisitedModules).toHaveBeenCalled();
  });

  test('completeCurrentModule calls saveModuleProgress with COMPLETED', async () => {
    mockService.saveProgress.mockResolvedValue({ success: true, data: {} });

    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.completeCurrentModule();
    });

    expect(mockService.saveProgress).toHaveBeenCalledWith(
      1,
      'completed',
      expect.objectContaining({
        completed_at: expect.any(String),
        module_title: 'Módulo 1',
        challenge_completed: false,
        challenge_score: 0,
        quiz_passed: false,
        quiz_score: 0,
      }),
      'test-user-123'
    );
    expect(res.success).toBe(true);
  });

  test('completeCurrentModule returns error when no user', async () => {
    mockContext.user = null;
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.completeCurrentModule();
    });

    expect(res).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  test('completeCurrentModule includes challenge and quiz data', async () => {
    mockStoreGetState.isChallengeCompleted = true;
    mockStoreGetState.challengeScore = 95;
    mockStoreGetState.quizPassed = true;
    mockStoreGetState.quizScore = 88;
    mockService.saveProgress.mockResolvedValue({ success: true, data: {} });

    const { result } = renderHook(() => useIALabProgress());

    await act(async () => {
      return result.current.completeCurrentModule();
    });

    expect(mockService.saveProgress).toHaveBeenCalledWith(
      1,
      'completed',
      expect.objectContaining({
        challenge_completed: true,
        challenge_score: 95,
        quiz_passed: true,
        quiz_score: 88,
      }),
      'test-user-123'
    );
  });

  test('saveCurrentLesson calls progressService.saveLastLesson', async () => {
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveCurrentLesson();
    });

    expect(mockService.saveLastLesson).toHaveBeenCalledWith(1, 0, 'test-user-123');
    expect(res.success).toBe(true);
  });

  test('saveCurrentLesson returns error when no user', async () => {
    mockContext.user = null;
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveCurrentLesson();
    });

    expect(res).toEqual({ success: false, error: 'Usuario no autenticado' });
  });

  test('saveCurrentLesson returns error when no progressService', async () => {
    mockService = null;
    const { result } = renderHook(() => useIALabProgress());

    const res = await act(async () => {
      return result.current.saveCurrentLesson();
    });

    expect(res).toEqual({ success: false, error: 'Servicio de progreso no disponible' });
  });

  describe('trackResourceViewed', () => {
    test('calls progressService.saveResourceViewed', async () => {
      mockService.saveResourceViewed.mockResolvedValue({ success: true, viewedCount: 3 });

      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackResourceViewed(1, 'res-1', 'video');
      });

      expect(mockService.saveResourceViewed).toHaveBeenCalledWith(1, 'res-1', 'video', 6, 'test-user-123');
      expect(res.success).toBe(true);
    });

    test('marks resources as completed when viewedCount >= total', async () => {
      mockService.saveResourceViewed.mockResolvedValue({ success: true, viewedCount: 6 });

      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackResourceViewed(1, 'res-1', 'video');
      });

      expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'resourcesCompleted', true);
    });

    test('falls back to local completion on DB error', async () => {
      mockService.saveResourceViewed.mockResolvedValue({ success: false });

      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackResourceViewed(1, 'res-1', 'video');
      });

      expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'resourcesCompleted', true);
    });

    test('returns error when no user', async () => {
      mockContext.user = null;
      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackResourceViewed(1, 'res-1', 'video');
      });

      expect(res).toEqual({ success: false, error: 'Usuario no autenticado' });
    });

    test('returns error when no progressService', async () => {
      mockService = null;
      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackResourceViewed(1, 'res-1', 'video');
      });

      expect(res).toEqual({ success: false, error: 'Servicio no disponible' });
    });
  });

  describe('trackExamResult', () => {
    test('updates local state and calls DB', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackExamResult(1, 85, true);
      });

      expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'exam', true, 85);
      expect(mockService.saveExamProgress).toHaveBeenCalledWith(1, 85, true, 'test-user-123');
    });

    test('awards XP when score >= 80', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackExamResult(1, 85, true);
      });

      expect(mockStoreGetState.addXp).toHaveBeenCalledWith(100);
    });

    test('does not award XP when score < 80', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackExamResult(1, 70, false);
      });

      expect(mockStoreGetState.addXp).not.toHaveBeenCalled();
    });

    test('handles DB error with local fallback', async () => {
      mockService.saveExamProgress.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackExamResult(1, 85, true);
      });

      expect(res).toEqual({ success: true, local: true });
    });

    test('returns error when no user', async () => {
      mockContext.user = null;
      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackExamResult(1, 85, true);
      });

      expect(res).toEqual({ success: false, error: 'Usuario no autenticado' });
    });
  });

  describe('trackChallengeResult', () => {
    test('updates local state and calls DB', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackChallengeResult(1, 90);
      });

      expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'challenge', true, 90);
      expect(mockService.saveChallengeProgress).toHaveBeenCalledWith(1, 90, 'test-user-123');
    });

    test('awards XP when score >= 80', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackChallengeResult(1, 90);
      });

      expect(mockStoreGetState.addXp).toHaveBeenCalledWith(100);
    });

    test('does not award XP when score < 80', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackChallengeResult(1, 70);
      });

      expect(mockStoreGetState.addXp).not.toHaveBeenCalled();
    });

    test('handles DB error with local fallback', async () => {
      mockService.saveChallengeProgress.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackChallengeResult(1, 90);
      });

      expect(res).toEqual({ success: true, local: true });
    });
  });

  describe('trackCommunityComment', () => {
    test('updates local state and calls DB', async () => {
      const { result } = renderHook(() => useIALabProgress());

      await act(async () => {
        return result.current.trackCommunityComment(1);
      });

      expect(mockContext.updateModuleActivity).toHaveBeenCalledWith(1, 'community', true);
      expect(mockService.saveCommunityProgress).toHaveBeenCalledWith(1, 'test-user-123');
    });

    test('handles DB error with local fallback', async () => {
      mockService.saveCommunityProgress.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useIALabProgress());

      const res = await act(async () => {
        return result.current.trackCommunityComment(1);
      });

      expect(res).toEqual({ success: true, local: true });
    });
  });

  describe('loadModuleBreakdown', () => {
    test('calls progressService.getModuleBreakdown', async () => {
      const { result } = renderHook(() => useIALabProgress());

      const data = await act(async () => {
        return result.current.loadModuleBreakdown(1);
      });

      expect(mockService.getModuleBreakdown).toHaveBeenCalledWith(1, 'test-user-123');
    });

    test('returns null when no user', async () => {
      mockContext.user = null;
      const { result } = renderHook(() => useIALabProgress());

      const data = await act(async () => {
        return result.current.loadModuleBreakdown(1);
      });

      expect(data).toBeNull();
    });

    test('returns null when no progressService', async () => {
      mockService = null;
      const { result } = renderHook(() => useIALabProgress());

      const data = await act(async () => {
        return result.current.loadModuleBreakdown(1);
      });

      expect(data).toBeNull();
    });

    test('returns null on error', async () => {
      mockService.getModuleBreakdown.mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useIALabProgress());

      const data = await act(async () => {
        return result.current.loadModuleBreakdown(1);
      });

      expect(data).toBeNull();
    });
  });

  test('progressError is cleared on successful load', async () => {
    mockContext.setIsLoadingProgress = vi.fn();
    const { result } = renderHook(() => useIALabProgress());

    expect(result.current.progressError).toBeNull();
  });

  test('cache with expired timestamp is not used', async () => {
    mockCacheData = {
      courseProgress: 42,
      completedModules: [1],
      visitedModules: [1, 2],
      userId: 'test-user-123',
      timestamp: Date.now() - 7200000,
    };

    renderHook(() => useIALabProgress());

    await waitFor(() => {
      expect(mockStoreGetState.removeProgressCache).toHaveBeenCalled();
    });
    expect(mockContext.setCourseProgress).not.toHaveBeenCalledWith(42);
  });

  test('cache from different user is not used', async () => {
    mockCacheData = {
      courseProgress: 42,
      completedModules: [1],
      visitedModules: [1, 2],
      userId: 'different-user',
      timestamp: Date.now(),
    };

    renderHook(() => useIALabProgress());

    expect(mockContext.setCourseProgress).not.toHaveBeenCalledWith(42);
  });
});
