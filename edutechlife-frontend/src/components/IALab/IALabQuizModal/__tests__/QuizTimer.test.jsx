import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QuizTimer } from '../components/QuizTimer';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const defaultProps = {
  timeElapsed: 30,
  suggestedTime: 600,
  currentQuestion: 0,
  totalQuestions: 10,
  isTimerRunning: true,
  showSecurityMessage: false,
  securityMessage: '',
  practiceMode: false,
  onTogglePractice: vi.fn(),
  onClose: vi.fn(),
  formatTime,
};

describe('QuizTimer', () => {
  test('renders exit button', () => {
    render(<QuizTimer {...defaultProps} />);
    expect(screen.getByText('ialab.quiz.exit')).toBeInTheDocument();
  });

  test('calls onClose when exit clicked', () => {
    const onClose = vi.fn();
    render(<QuizTimer {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('ialab.quiz.exit'));
    expect(onClose).toHaveBeenCalled();
  });

  test('shows remaining time in timer', () => {
    render(<QuizTimer {...defaultProps} timeElapsed={30} suggestedTime={600} />);
    expect(screen.getByText(formatTime(570))).toBeInTheDocument();
  });

  test('shows time warning when elapsed > 80% of suggested', () => {
    render(<QuizTimer {...defaultProps} timeElapsed={500} suggestedTime={600} />);
    const timer = screen.getByRole('timer');
    expect(timer.classList.contains('bg-red-50')).toBe(true);
  });

  test('no time warning when elapsed <= 80%', () => {
    render(<QuizTimer {...defaultProps} timeElapsed={30} suggestedTime={600} />);
    const timer = screen.getByRole('timer');
    expect(timer.classList.contains('bg-red-50')).toBe(false);
  });

  test('shows practice mode checkbox', () => {
    render(<QuizTimer {...defaultProps} />);
    expect(screen.getByText('ialab.quiz.practice')).toBeInTheDocument();
  });

  test('practice checkbox reflects practiceMode prop', () => {
    const { rerender } = render(<QuizTimer {...defaultProps} practiceMode={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<QuizTimer {...defaultProps} practiceMode={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onTogglePractice when checkbox toggled', () => {
    const onTogglePractice = vi.fn();
    render(<QuizTimer {...defaultProps} onTogglePractice={onTogglePractice} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onTogglePractice).toHaveBeenCalled();
  });

  test('shows question count', () => {
    render(<QuizTimer {...defaultProps} currentQuestion={2} totalQuestions={10} />);
    expect(screen.getByText('ialab.quiz.question_count')).toBeInTheDocument();
  });

  test('shows security message when showSecurityMessage is true', () => {
    render(<QuizTimer {...defaultProps} showSecurityMessage={true} securityMessage="No se permite captura de pantalla" />);
    expect(screen.getByText('No se permite captura de pantalla')).toBeInTheDocument();
  });

  test('hides security message when showSecurityMessage is false', () => {
    render(<QuizTimer {...defaultProps} showSecurityMessage={false} securityMessage="test" />);
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  test('hides timer when isTimerRunning is false', () => {
    render(<QuizTimer {...defaultProps} isTimerRunning={false} />);
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  test('shows timer when isTimerRunning is true', () => {
    render(<QuizTimer {...defaultProps} isTimerRunning={true} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });
});
