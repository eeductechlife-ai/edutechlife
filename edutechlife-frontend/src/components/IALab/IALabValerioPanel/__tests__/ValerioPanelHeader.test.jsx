import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ValerioPanelHeader from '../ValerioPanelHeader';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../ValerioAvatar', () => ({
  default: ({ state }) => <div data-testid="valerio-avatar" data-state={state} />,
}));

vi.mock('../../../../utils/speech', () => ({
  stopSpeech: vi.fn(),
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k, locale: 'es', setLocale: vi.fn() }),
}));

const defaultProps = {
  valerioState: 'idle',
  setValerioState: vi.fn(),
  currentModule: { id: 1, title: 'Ingeniería de Prompts' },
  userLevel: 1,
  onClose: vi.fn(),
};

describe('ValerioPanelHeader', () => {
  test('renders module title', () => {
    render(<ValerioPanelHeader {...defaultProps} />);
    expect(screen.getByText(/ialab\.valerio\.module_label/)).toBeInTheDocument();
  });

  test('shows idle state indicator', () => {
    render(<ValerioPanelHeader {...defaultProps} valerioState="idle" />);
    expect(screen.getByText(/ialab\.valerio\.status_idle/)).toBeInTheDocument();
  });

  test('shows thinking state indicator', () => {
    render(<ValerioPanelHeader {...defaultProps} valerioState="thinking" />);
    expect(screen.getByText(/ialab\.valerio\.status_thinking/)).toBeInTheDocument();
  });

  test('shows speaking state', () => {
    render(<ValerioPanelHeader {...defaultProps} valerioState="speaking" />);
    expect(screen.getByText(/ialab\.valerio\.status_speaking/)).toBeInTheDocument();
  });

  test('renders close button', () => {
    render(<ValerioPanelHeader {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('shows level label', () => {
    render(<ValerioPanelHeader {...defaultProps} userLevel={1} />);
    expect(screen.getByText(/ialab\.valerio\.level_label/)).toBeInTheDocument();
  });

  test('renders ValerioAvatar with correct state', () => {
    render(<ValerioPanelHeader {...defaultProps} valerioState="speaking" />);
    const avatar = screen.getByTestId('valerio-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt', 'Valerio');
    expect(screen.getByText(/ialab\.valerio\.status_speaking/)).toBeInTheDocument();
  });

  test('renders title', () => {
    render(<ValerioPanelHeader {...defaultProps} />);
    expect(screen.getByText(/ialab\.valerio\.title/)).toBeInTheDocument();
  });
});
