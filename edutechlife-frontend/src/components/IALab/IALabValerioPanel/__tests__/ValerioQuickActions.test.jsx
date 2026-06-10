import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ValerioQuickActions from '../ValerioQuickActions';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultActions = [
  { id: 'help', icon: 'fa-question-circle', label: 'Ayuda' },
  { id: 'explain', icon: 'fa-lightbulb', label: 'Explicar' },
  { id: 'examples', icon: 'fa-code', label: 'Ejemplos' },
  { id: 'summary', icon: 'fa-list', label: 'Resumen' },
];

const defaultProps = {
  quickActions: defaultActions,
  onAction: vi.fn(),
  disabled: false,
};

describe('ValerioQuickActions', () => {
  test('renders title', () => {
    render(<ValerioQuickActions {...defaultProps} />);
    expect(screen.getByText('ialab.valerio.quick_actions_title')).toBeInTheDocument();
  });

  test('renders all action buttons', () => {
    render(<ValerioQuickActions {...defaultProps} />);
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByText('Explicar')).toBeInTheDocument();
    expect(screen.getByText('Ejemplos')).toBeInTheDocument();
    expect(screen.getByText('Resumen')).toBeInTheDocument();
  });

  test('calls onAction with action object when clicked', () => {
    const onAction = vi.fn();
    render(<ValerioQuickActions {...defaultProps} onAction={onAction} />);
    fireEvent.click(screen.getByText('Explicar'));
    expect(onAction).toHaveBeenCalledWith(defaultActions[1]);
  });

  test('disables all buttons when disabled prop is true', () => {
    render(<ValerioQuickActions {...defaultProps} disabled={true} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  test('buttons are enabled when disabled prop is false', () => {
    render(<ValerioQuickActions {...defaultProps} disabled={false} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).not.toBeDisabled();
    });
  });

  test('renders correct number of action buttons', () => {
    render(<ValerioQuickActions {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
  });

  test('renders empty grid when no actions provided', () => {
    render(<ValerioQuickActions {...defaultProps} quickActions={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('does not call onAction when disabled and clicked', () => {
    const onAction = vi.fn();
    render(<ValerioQuickActions {...defaultProps} onAction={onAction} disabled={true} />);
    fireEvent.click(screen.getByText('Ayuda'));
    expect(onAction).not.toHaveBeenCalled();
  });
});
