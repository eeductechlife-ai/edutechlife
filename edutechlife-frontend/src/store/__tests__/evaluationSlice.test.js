import { useIALabStore } from '../ialabStore';

beforeEach(() => {
  useIALabStore.setState({
    showExamModal: false,
    quizAnswers: {},
    quizScore: null,
    quizPassed: false,
    quizResult: null,
    showScoreResult: false,
    dailyAttemptsCount: 0,
    lastAttemptDate: null,
    quizAttempts: [],
    showPremiumEvaluationModal: false,
    currentQuestion: 0,
    currentPage: 1,
    evalAnswers: {},
    evalSubmitted: false,
    evalScore: 0,
    isStartingChallenge: false,
    isButtonDisabled: false,
    isChallengeCompleted: false,
    challengeScore: 0,
  });
});

describe('evaluationSlice — quiz modal', () => {
  test('showExamModal initializes as false', () => {
    expect(useIALabStore.getState().showExamModal).toBe(false);
  });

  test('setShowExamModal toggles state', () => {
    useIALabStore.getState().setShowExamModal(true);
    expect(useIALabStore.getState().showExamModal).toBe(true);
  });
});

describe('evaluationSlice — quizAnswers', () => {
  test('initializes empty', () => {
    expect(useIALabStore.getState().quizAnswers).toEqual({});
  });

  test('setQuizAnswers sets value directly', () => {
    useIALabStore.getState().setQuizAnswers({ q1: 'A' });
    expect(useIALabStore.getState().quizAnswers).toEqual({ q1: 'A' });
  });

  test('setQuizAnswers accepts updater function', () => {
    useIALabStore.getState().setQuizAnswers({ q1: 'A' });
    useIALabStore.getState().setQuizAnswers(prev => ({ ...prev, q2: 'B' }));
    expect(useIALabStore.getState().quizAnswers).toEqual({ q1: 'A', q2: 'B' });
  });
});

describe('evaluationSlice — quiz score/result', () => {
  test('quizScore initializes as null', () => {
    expect(useIALabStore.getState().quizScore).toBeNull();
  });

  test('setQuizScore updates value', () => {
    useIALabStore.getState().setQuizScore(85);
    expect(useIALabStore.getState().quizScore).toBe(85);
  });

  test('quizPassed initializes as false', () => {
    expect(useIALabStore.getState().quizPassed).toBe(false);
  });

  test('setQuizPassed toggles state', () => {
    useIALabStore.getState().setQuizPassed(true);
    expect(useIALabStore.getState().quizPassed).toBe(true);
  });

  test('quizResult initializes as null', () => {
    expect(useIALabStore.getState().quizResult).toBeNull();
  });

  test('setQuizResult updates value', () => {
    useIALabStore.getState().setQuizResult({ passed: true, score: 90 });
    expect(useIALabStore.getState().quizResult).toEqual({ passed: true, score: 90 });
  });

  test('showScoreResult initializes as false', () => {
    expect(useIALabStore.getState().showScoreResult).toBe(false);
  });

  test('setShowScoreResult toggles state', () => {
    useIALabStore.getState().setShowScoreResult(true);
    expect(useIALabStore.getState().showScoreResult).toBe(true);
  });
});

describe('evaluationSlice — attempts', () => {
  test('dailyAttemptsCount initializes at 0', () => {
    expect(useIALabStore.getState().dailyAttemptsCount).toBe(0);
  });

  test('setDailyAttemptsCount updates value', () => {
    useIALabStore.getState().setDailyAttemptsCount(2);
    expect(useIALabStore.getState().dailyAttemptsCount).toBe(2);
  });

  test('lastAttemptDate initializes as null', () => {
    expect(useIALabStore.getState().lastAttemptDate).toBeNull();
  });

  test('setLastAttemptDate updates value', () => {
    const date = '2026-05-31';
    useIALabStore.getState().setLastAttemptDate(date);
    expect(useIALabStore.getState().lastAttemptDate).toBe(date);
  });

  test('quizAttempts initializes empty', () => {
    expect(useIALabStore.getState().quizAttempts).toEqual([]);
  });

  test('setQuizAttempts updates value', () => {
    const attempts = [{ score: 80, date: '2026-05-31' }];
    useIALabStore.getState().setQuizAttempts(attempts);
    expect(useIALabStore.getState().quizAttempts).toEqual(attempts);
  });
});

describe('evaluationSlice — premium modal', () => {
  test('showPremiumEvaluationModal initializes as false', () => {
    expect(useIALabStore.getState().showPremiumEvaluationModal).toBe(false);
  });

  test('setShowPremiumEvaluationModal toggles state', () => {
    useIALabStore.getState().setShowPremiumEvaluationModal(true);
    expect(useIALabStore.getState().showPremiumEvaluationModal).toBe(true);
  });
});

describe('evaluationSlice — current question/page', () => {
  test('currentQuestion initializes at 0', () => {
    expect(useIALabStore.getState().currentQuestion).toBe(0);
  });

  test('setCurrentQuestion updates value', () => {
    useIALabStore.getState().setCurrentQuestion(3);
    expect(useIALabStore.getState().currentQuestion).toBe(3);
  });

  test('currentPage initializes at 1', () => {
    expect(useIALabStore.getState().currentPage).toBe(1);
  });

  test('setCurrentPage updates value', () => {
    useIALabStore.getState().setCurrentPage(2);
    expect(useIALabStore.getState().currentPage).toBe(2);
  });
});

describe('evaluationSlice — eval state', () => {
  test('evalAnswers initializes empty', () => {
    expect(useIALabStore.getState().evalAnswers).toEqual({});
  });

  test('setEvalAnswers updates value', () => {
    useIALabStore.getState().setEvalAnswers({ step1: 'done' });
    expect(useIALabStore.getState().evalAnswers).toEqual({ step1: 'done' });
  });

  test('evalSubmitted initializes as false', () => {
    expect(useIALabStore.getState().evalSubmitted).toBe(false);
  });

  test('setEvalSubmitted toggles state', () => {
    useIALabStore.getState().setEvalSubmitted(true);
    expect(useIALabStore.getState().evalSubmitted).toBe(true);
  });

  test('evalScore initializes at 0', () => {
    expect(useIALabStore.getState().evalScore).toBe(0);
  });

  test('setEvalScore updates value', () => {
    useIALabStore.getState().setEvalScore(95);
    expect(useIALabStore.getState().evalScore).toBe(95);
  });
});

describe('evaluationSlice — challenge state', () => {
  test('isStartingChallenge initializes as false', () => {
    expect(useIALabStore.getState().isStartingChallenge).toBe(false);
  });

  test('setIsStartingChallenge toggles state', () => {
    useIALabStore.getState().setIsStartingChallenge(true);
    expect(useIALabStore.getState().isStartingChallenge).toBe(true);
  });

  test('isButtonDisabled initializes as false', () => {
    expect(useIALabStore.getState().isButtonDisabled).toBe(false);
  });

  test('setIsButtonDisabled toggles state', () => {
    useIALabStore.getState().setIsButtonDisabled(true);
    expect(useIALabStore.getState().isButtonDisabled).toBe(true);
  });

  test('isChallengeCompleted initializes as false', () => {
    expect(useIALabStore.getState().isChallengeCompleted).toBe(false);
  });

  test('setIsChallengeCompleted toggles state', () => {
    useIALabStore.getState().setIsChallengeCompleted(true);
    expect(useIALabStore.getState().isChallengeCompleted).toBe(true);
  });

  test('challengeScore initializes at 0', () => {
    expect(useIALabStore.getState().challengeScore).toBe(0);
  });

  test('setChallengeScore updates value', () => {
    useIALabStore.getState().setChallengeScore(100);
    expect(useIALabStore.getState().challengeScore).toBe(100);
  });
});

describe('evaluationSlice — getLatestQuizAttempt', () => {
  test('returns null when no attempts', () => {
    expect(useIALabStore.getState().getLatestQuizAttempt()).toBeNull();
  });

  test('returns the last attempt', () => {
    const store = useIALabStore.getState();
    store.setQuizAttempts([{ score: 70 }, { score: 90 }]);
    expect(store.getLatestQuizAttempt()).toEqual({ score: 90 });
  });
});
