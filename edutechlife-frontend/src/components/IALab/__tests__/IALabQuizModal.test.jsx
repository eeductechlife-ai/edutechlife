import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockSetQuizAnswer = vi.fn();
const mockSetCurrentQuestion = vi.fn();
const mockSetTimeElapsed = vi.fn();

vi.mock('@/utils/iconMapping', () => ({
  Icon: () => null,
}));

vi.mock('@/hooks/IALab/useIALabQuiz', () => ({
  useIALabQuiz: () => ({
    quizQuestions: [
      { id: 'q1', question: 'Sample Question 1?', topic: 'AI', difficulty: 'fácil', options: [{ id: 'a', label: 'Option A' }, { id: 'b', label: 'Option B' }, { id: 'c', label: 'Option C' }], correct: 'a' },
      { id: 'q2', question: 'Sample Question 2?', topic: 'AI', difficulty: 'medio', options: [{ id: 'a', label: 'Option A' }, { id: 'b', label: 'Option B' }, { id: 'c', label: 'Option C' }], correct: 'b' },
    ],
    TOTAL_QUESTIONS: 2,
    PASSING_SCORE: 60,
    SUGGESTED_TIME_SECONDS: 600,
    MAX_SECURITY_WARNINGS: 3,
    canAttemptQuiz: true,
    submitQuiz: vi.fn(),
    updateQuizAnswer: vi.fn(),
    openEvaluation: vi.fn(),
    closeEvaluationModal: vi.fn(),
    generateTopicFeedback: vi.fn(),
    formatTime: (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
    penalizeAttempt: vi.fn(),
  }),
}));

vi.mock('@/context/IALabContext', () => ({
  useIALabProgressContext: () => ({ activeMod: 1, markExamComplete: vi.fn() }),
}));

vi.mock('@/store/ialabStore', () => ({
  useIALabStore: (selector) => {
    const state = {
      userRole: 'user',
      quizAnswers: {},
      quizScore: null,
      quizPassed: null,
      quizResult: null,
      showScoreResult: false,
      currentQuestion: 0,
      timeElapsed: 0,
      isTimerRunning: true,
      securityWarningCount: 0,
      showSecurityMessage: false,
      securityMessage: '',
      setQuizAnswer: mockSetQuizAnswer,
      setCurrentQuestion: mockSetCurrentQuestion,
      setTimeElapsed: mockSetTimeElapsed,
    };
    return typeof selector === 'function' ? selector(state) : state;
  },
}));

vi.mock('@/hooks/useFocusTrap', () => ({
  default: () => ({ current: null }),
}));

vi.mock('@/hooks/IALab/useScreenshotProtection', () => ({
  default: () => ({ showOverlay: false }),
}));

vi.mock('@/context/NotificationContext', () => ({
  useNotification: () => ({ createNotification: vi.fn() }),
}));

vi.mock('@/i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

vi.mock('@/components/IALab/SecurityWarningModal', () => ({
  default: () => null,
}));

vi.mock('@/components/IALab/ScreenshotProtectionOverlay', () => ({
  default: () => null,
}));

vi.mock('../IALabQuizModal/hooks/useQuizSecurity', () => ({
  useQuizSecurity: () => ({
    securityAlert: null,
    setSecurityAlert: vi.fn(),
    printWarning: null,
    setPrintWarning: vi.fn(),
    showSecurityMessage: false,
    securityMessage: '',
    showOverlay: false,
    preventDefaultEvent: (e) => e.preventDefault(),
  }),
}));

import IALabQuizModal from '../IALabQuizModal';

describe('IALabQuizModal - Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders quiz questions when open', async () => {
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Sample Question 1?')).toBeInTheDocument();
    });
  });

  it('shows timer', () => {
    render(<IALabQuizModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<IALabQuizModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Sample Question 1?')).not.toBeInTheDocument();
  });
});
