import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { NavigationBar } from '../components/NavigationBar';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultProps = {
  currentQuestion: 0,
  totalQuestions: 10,
  hasAnsweredCurrent: false,
  isSubmitting: false,
  answeredCount: 0,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onSubmit: vi.fn(),
};

describe('NavigationBar', () => {
  test('renders prev button disabled on first question', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={0} />);
    const prevBtn = screen.getByText('ialab.quiz.previous').closest('button');
    expect(prevBtn).toBeDisabled();
  });

  test('prev button enabled after first question', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={3} />);
    const prevBtn = screen.getByText('ialab.quiz.previous').closest('button');
    expect(prevBtn).not.toBeDisabled();
  });

  test('calls onPrev when prev button clicked', () => {
    const onPrev = vi.fn();
    render(<NavigationBar {...defaultProps} currentQuestion={3} onPrev={onPrev} />);
    fireEvent.click(screen.getByText('ialab.quiz.previous').closest('button'));
    expect(onPrev).toHaveBeenCalled();
  });

  test('shows next button for non-last question', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={0} totalQuestions={10} />);
    expect(screen.getByText('ialab.quiz.next')).toBeInTheDocument();
  });

  test('next button disabled when current question unanswered', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={0} hasAnsweredCurrent={false} />);
    const nextBtn = screen.getByText('ialab.quiz.next').closest('button');
    expect(nextBtn).toBeDisabled();
  });

  test('next button enabled when current question answered', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={0} hasAnsweredCurrent={true} />);
    const nextBtn = screen.getByText('ialab.quiz.next').closest('button');
    expect(nextBtn).not.toBeDisabled();
  });

  test('calls onNext when next clicked', () => {
    const onNext = vi.fn();
    render(<NavigationBar {...defaultProps} currentQuestion={0} hasAnsweredCurrent={true} onNext={onNext} />);
    fireEvent.click(screen.getByText('ialab.quiz.next').closest('button'));
    expect(onNext).toHaveBeenCalled();
  });

  test('shows submit button on last question', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={9} totalQuestions={10} />);
    expect(screen.getByText('ialab.quiz.submit')).toBeInTheDocument();
    expect(screen.queryByText('ialab.quiz.next')).not.toBeInTheDocument();
  });

  test('submit button disabled when isSubmitting', () => {
    render(<NavigationBar {...defaultProps} currentQuestion={9} totalQuestions={10} isSubmitting={true} />);
    const submitBtn = screen.getByText('ialab.quiz.submitting').closest('button');
    expect(submitBtn).toBeDisabled();
  });

  test('calls onSubmit when submit clicked', () => {
    const onSubmit = vi.fn();
    render(<NavigationBar {...defaultProps} currentQuestion={9} totalQuestions={10} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('ialab.quiz.submit').closest('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  test('shows answered count', () => {
    render(<NavigationBar {...defaultProps} answeredCount={7} totalQuestions={10} />);
    expect(screen.getByText('ialab.quiz.answered_count')).toBeInTheDocument();
  });
});
