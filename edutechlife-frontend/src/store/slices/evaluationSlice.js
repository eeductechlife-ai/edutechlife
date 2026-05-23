/**
 * evaluationSlice — Quiz/exam/evaluation transient state + challenge state
 *
 * Estado: showExamModal, quizAnswers, quizScore, quizPassed, quizResult,
 *         showScoreResult, dailyAttemptsCount, lastAttemptDate, quizAttempts,
 *         showPremiumEvaluationModal, currentQuestion, currentPage,
 *         evalAnswers, evalSubmitted, evalScore,
 *         isStartingChallenge, isButtonDisabled, isChallengeCompleted, challengeScore
 *
 * Nota: Estado puramente transaccional (en memoria). No tiene dependencias
 * externas ni cross-slice calls. Los datos persisten via localStorage
 * desde los hooks (useIALabQuiz).
 */
export const createEvaluationSlice = (set, get) => ({
  showExamModal: false,
  setShowExamModal: (v) => set({ showExamModal: v }),
  quizAnswers: {},
  setQuizAnswers: (v) => set((state) => ({ quizAnswers: typeof v === 'function' ? v(state.quizAnswers) : v })),
  quizScore: null,
  setQuizScore: (v) => set({ quizScore: v }),
  quizPassed: false,
  setQuizPassed: (v) => set({ quizPassed: v }),
  quizResult: null,
  setQuizResult: (v) => set({ quizResult: v }),
  showScoreResult: false,
  setShowScoreResult: (v) => set({ showScoreResult: v }),
  dailyAttemptsCount: 0,
  setDailyAttemptsCount: (v) => set({ dailyAttemptsCount: v }),
  lastAttemptDate: null,
  setLastAttemptDate: (v) => set({ lastAttemptDate: v }),
  quizAttempts: [],
  setQuizAttempts: (v) => set({ quizAttempts: v }),
  showPremiumEvaluationModal: false,
  setShowPremiumEvaluationModal: (v) => set({ showPremiumEvaluationModal: v }),

  currentQuestion: 0,
  setCurrentQuestion: (v) => set({ currentQuestion: v }),
  currentPage: 1,
  setCurrentPage: (v) => set({ currentPage: v }),

  evalAnswers: {},
  setEvalAnswers: (v) => set({ evalAnswers: v }),
  evalSubmitted: false,
  setEvalSubmitted: (v) => set({ evalSubmitted: v }),
  evalScore: 0,
  setEvalScore: (v) => set({ evalScore: v }),

  isStartingChallenge: false,
  setIsStartingChallenge: (v) => set({ isStartingChallenge: v }),
  isButtonDisabled: false,
  setIsButtonDisabled: (v) => set({ isButtonDisabled: v }),
  isChallengeCompleted: false,
  setIsChallengeCompleted: (v) => set({ isChallengeCompleted: v }),
  challengeScore: 0,
  setChallengeScore: (v) => set({ challengeScore: v }),

  getLatestQuizAttempt: () => {
    const attempts = get().quizAttempts;
    return attempts.length > 0 ? attempts[attempts.length - 1] : null;
  },
});
