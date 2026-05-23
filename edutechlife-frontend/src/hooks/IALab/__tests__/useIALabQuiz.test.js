import { renderHook, act } from '@testing-library/react';
import { useIALabQuiz } from '../useIALabQuiz';

const mockState = {
  context: {
    activeMod: 1,
    updateModuleActivity: vi.fn(),
    markExamComplete: vi.fn(),
    user: { id: 'user-1' },
  },
  storeState: {
    activeMod: 1,
    user: { id: 'user-1' },
    quizAnswers: {},
    setQuizAnswers: vi.fn(),
    quizScore: null,
    setQuizScore: vi.fn(),
    quizPassed: false,
    setQuizPassed: vi.fn(),
    quizResult: null,
    setQuizResult: vi.fn(),
    showScoreResult: false,
    setShowScoreResult: vi.fn(),
    dailyAttemptsCount: 0,
    setDailyAttemptsCount: vi.fn(),
    lastAttemptDate: null,
    setLastAttemptDate: vi.fn(),
    quizAttempts: [],
    setQuizAttempts: vi.fn(),
    timeElapsed: 0,
    setTimeElapsed: vi.fn(),
    isTimerRunning: false,
    setIsTimerRunning: vi.fn(),
    showTimeWarning: false,
    setShowTimeWarning: vi.fn(),
    showExamModal: false,
    setShowExamModal: vi.fn(),
    currentQuestion: 0,
    setCurrentQuestion: vi.fn(),
    securityWarningCount: 0,
    setSecurityWarningCount: vi.fn(),
    securityViolations: 0,
    setSecurityViolations: vi.fn(),
    screenshotProtectionActive: false,
    setScreenshotProtectionActive: vi.fn(),
    showSecurityStatus: false,
    setShowSecurityStatus: vi.fn(),
    showSecurityMessage: false,
    setShowSecurityMessage: vi.fn(),
    securityMessage: '',
    setSecurityMessage: vi.fn(),
    attemptsPenalized: 0,
    setAttemptsPenalized: vi.fn(),
    storageGet: vi.fn(),
    storageGetInt: vi.fn(),
    storageSet: vi.fn(),
    storageRemove: vi.fn(),
  },
};

vi.mock('../../../context/IALabContext', () => ({
  useIALabContext: () => mockState.context,
  useIALabProgressContext: () => mockState.context,
  useIALabUIContext: () => mockState.context,
}));

vi.mock('../../../store/ialabStore', () => ({
  useIALabStore: Object.assign(
    (selector) => selector ? selector(mockState.storeState) : mockState.storeState,
    { getState: () => mockState.storeState }
  ),
}));

function mockSetQuizAnswers() {
  mockState.storeState.setQuizAnswers.mockImplementation((updater) => {
    if (typeof updater === 'function') {
      mockState.storeState.quizAnswers = updater(mockState.storeState.quizAnswers);
    } else {
      mockState.storeState.quizAnswers = updater;
    }
  });
}

function mockSetQuizAttempts() {
  mockState.storeState.setQuizAttempts.mockImplementation((updater) => {
    if (typeof updater === 'function') {
      mockState.storeState.quizAttempts = updater(mockState.storeState.quizAttempts);
    } else {
      mockState.storeState.quizAttempts = updater;
    }
  });
}

beforeEach(() => {
  Object.values(mockState.context).forEach((val) => {
    if (typeof val === 'function' && val.mockClear) val.mockClear();
  });
  Object.values(mockState.storeState).forEach((val) => {
    if (typeof val === 'function' && val.mockClear) val.mockClear();
  });
  mockState.storeState.activeMod = 1;
  mockState.storeState.user = { id: 'user-1' };
  mockState.storeState.quizAnswers = {};
  mockState.storeState.quizAttempts = [];
  mockState.storeState.storageGet.mockReturnValue(null);
  mockState.storeState.storageGetInt.mockReturnValue(3);
  mockState.storeState.storageSet.mockClear();
  mockState.context.activeMod = 1;
  mockState.context.user = { id: 'user-1' };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useIALabQuiz', () => {
  test('returns expected interface', () => {
    const { result } = renderHook(() => useIALabQuiz());

    expect(result.current.quizQuestions).toBeDefined();
    expect(result.current.TOTAL_QUESTIONS).toBe(8);
    expect(result.current.PASSING_SCORE).toBe(80);
    expect(result.current.SUGGESTED_TIME_SECONDS).toBe(1200);
    expect(result.current.canAttemptQuiz).toBeInstanceOf(Function);
    expect(result.current.submitQuiz).toBeInstanceOf(Function);
    expect(result.current.updateQuizAnswer).toBeInstanceOf(Function);
    expect(result.current.openEvaluation).toBeInstanceOf(Function);
    expect(result.current.closeEvaluationModal).toBeInstanceOf(Function);
    expect(result.current.generateTopicFeedback).toBeInstanceOf(Function);
    expect(result.current.formatTime).toBeInstanceOf(Function);
  });

  test('quizQuestions comes from MODULE_EXAMS for activeMod', () => {
    const { result } = renderHook(() => useIALabQuiz());

    expect(Array.isArray(result.current.quizQuestions)).toBe(true);
    expect(result.current.quizQuestions.length).toBe(8);
    expect(result.current.quizQuestions[0].id).toBe('m1q1');
  });

  test('formatTime formats correctly', () => {
    const { result } = renderHook(() => useIALabQuiz());

    expect(result.current.formatTime(0)).toBe('0:00');
    expect(result.current.formatTime(5)).toBe('0:05');
    expect(result.current.formatTime(65)).toBe('1:05');
    expect(result.current.formatTime(3661)).toBe('61:01');
  });

  describe('updateQuizAnswer', () => {
    test('updates a single answer', () => {
      mockSetQuizAnswers();
      const { result } = renderHook(() => useIALabQuiz());

      act(() => result.current.updateQuizAnswer('q1', 'a'));
      expect(mockState.storeState.setQuizAnswers).toHaveBeenCalled();
    });
  });

  describe('calculateQuizScore (via submitQuiz)', () => {
    test('returns correct score info', () => {
      mockState.storeState.quizAnswers = {
        m1q1: 'm1q1_b', m1q2: 'm1q2_b',
        m1q3: 'm1q3_b', m1q4: 'm1q4_b',
        m1q5: 'm1q5_b', m1q6: 'm1q6_b',
        m1q7: 'm1q7_a', m1q8: 'm1q8_b',
      };
      mockSetQuizAnswers();
      mockSetQuizAttempts();

      const { result } = renderHook(() => useIALabQuiz());

      act(() => { result.current.submitQuiz(); });

      expect(mockState.storeState.setQuizScore).toHaveBeenCalled();
      expect(mockState.storeState.setShowScoreResult).toHaveBeenCalledWith(true);
    });
  });

  describe('generateTopicFeedback', () => {
    test('returns feedback messages for failed questions', () => {
      const { result } = renderHook(() => useIALabQuiz());

      const feedback = result.current.generateTopicFeedback(['m1q1', 'm1q3']);

      expect(Array.isArray(feedback)).toBe(true);
      expect(feedback.length).toBeGreaterThanOrEqual(1);
      feedback.forEach(msg => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    });

    test('returns empty array when no failed questions', () => {
      const { result } = renderHook(() => useIALabQuiz());

      const feedback = result.current.generateTopicFeedback([]);
      expect(feedback).toEqual([]);
    });
  });

  describe('canAttemptQuiz', () => {
    test('returns true when attempts remain', () => {
      mockState.storeState.storageGetInt.mockReturnValue(3);
      mockState.storeState.storageGet.mockReturnValue(null);

      const { result } = renderHook(() => useIALabQuiz());

      expect(result.current.canAttemptQuiz()).toBe(true);
    });

    test('returns false when no attempts remain', () => {
      mockState.storeState.storageGetInt.mockReturnValue(0);

      const { result } = renderHook(() => useIALabQuiz());

      expect(result.current.canAttemptQuiz()).toBe(false);
    });

    test('returns false when cooldown active', () => {
      mockState.storeState.storageGetInt.mockReturnValue(2);
      mockState.storeState.storageGet.mockReturnValue(Date.now() + 3600000);

      const { result } = renderHook(() => useIALabQuiz());

      expect(result.current.canAttemptQuiz()).toBe(false);
    });

    test('returns true after cooldown expires', () => {
      mockState.storeState.storageGetInt.mockReturnValue(2);
      mockState.storeState.storageGet.mockReturnValue(Date.now() - 1000);

      const { result } = renderHook(() => useIALabQuiz());

      expect(result.current.canAttemptQuiz()).toBe(true);
    });
  });

  describe('openEvaluation', () => {
    test('opens modal when can attempt', () => {
      mockState.storeState.storageGetInt.mockReturnValue(3);
      mockState.storeState.storageGet.mockReturnValue(null);

      const { result } = renderHook(() => useIALabQuiz());

      let opened;
      act(() => { opened = result.current.openEvaluation(); });

      expect(opened).toBe(true);
      expect(mockState.storeState.setShowExamModal).toHaveBeenCalledWith(true);
    });

    test('returns false when cannot attempt and shows message', () => {
      mockState.storeState.storageGetInt.mockReturnValue(0);

      const { result } = renderHook(() => useIALabQuiz());

      let opened;
      act(() => { opened = result.current.openEvaluation(); });

      expect(opened).toBe(false);
    });
  });

  describe('closeEvaluationModal', () => {
    test('closes modal and resets', () => {
      const { result } = renderHook(() => useIALabQuiz());

      let closed;
      act(() => { closed = result.current.closeEvaluationModal(); });

      expect(closed).toBe(true);
      expect(mockState.storeState.setShowExamModal).toHaveBeenCalledWith(false);
    });
  });
});
