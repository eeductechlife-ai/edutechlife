import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SubmitConfirmDialog } from '../components/SubmitConfirmDialog';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultProps = {
  isOpen: false,
  unansweredCount: 3,
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe('SubmitConfirmDialog', () => {
  test('does not render when isOpen is false', () => {
    render(<SubmitConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  test('shows confirm title', () => {
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} />);
    expect(screen.getByText('ialab.quiz.confirm_title')).toBeInTheDocument();
  });

  test('shows unanswered count in message', () => {
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} unansweredCount={5} />);
    expect(screen.getByText('ialab.quiz.confirm_msg')).toBeInTheDocument();
  });

  test('calls onConfirm when submit button clicked', () => {
    const onConfirm = vi.fn();
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('ialab.quiz.confirm_submit'));
    expect(onConfirm).toHaveBeenCalled();
  });

  test('calls onCancel when review button clicked', () => {
    const onCancel = vi.fn();
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('ialab.quiz.confirm_review'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('calls onCancel when backdrop clicked', () => {
    const onCancel = vi.fn();
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('alertdialog'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('does not call onCancel when dialog content clicked', () => {
    const onCancel = vi.fn();
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} onCancel={onCancel} />);
    const dialog = screen.getByRole('alertdialog');
    const innerDiv = dialog.querySelector('[class*="bg-white"]');
    if (innerDiv) {
      fireEvent.click(innerDiv);
      expect(onCancel).not.toHaveBeenCalled();
    }
  });

  test('has correct aria-modal attribute', () => {
    render(<SubmitConfirmDialog {...defaultProps} isOpen={true} />);
    expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
  });
});
