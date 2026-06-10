import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ValerioConversationArea from '../ValerioConversationArea';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultProps = {
  conversation: [],
  isProcessing: false,
  moduleTitle: 'Ingeniería de Prompts',
};

describe('ValerioConversationArea', () => {
  test('renders empty state when no messages', () => {
    render(<ValerioConversationArea {...defaultProps} />);
    expect(screen.getByText('ialab.valerio.empty_title')).toBeInTheDocument();
    expect(screen.getByText('ialab.valerio.empty_description')).toBeInTheDocument();
  });

  test('renders user message bubble', () => {
    const messages = [
      { id: '1', type: 'user', content: 'Hola Valerio', timestamp: '2024-01-01T10:00:00' },
    ];
    render(<ValerioConversationArea {...defaultProps} conversation={messages} />);
    expect(screen.getByText('Hola Valerio')).toBeInTheDocument();
    expect(screen.getAllByText('ialab.valerio.message_you').length).toBe(2);
  });

  test('renders Valerio message bubble', () => {
    const messages = [
      { id: '1', type: 'valerio', content: '¡Hola! ¿En qué puedo ayudarte?', timestamp: '2024-01-01T10:00:00' },
    ];
    render(<ValerioConversationArea {...defaultProps} conversation={messages} />);
    expect(screen.getByText('¡Hola! ¿En qué puedo ayudarte?')).toBeInTheDocument();
    expect(screen.getByText('ialab.valerio.message_valerio')).toBeInTheDocument();
  });

  test('conversation has aria-live polite for screen readers', () => {
    render(<ValerioConversationArea {...defaultProps} />);
    const el = screen.getByLabelText('ialab.valerio.conversation_aria');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  test('renders multiple messages in order', () => {
    const messages = [
      { id: '1', type: 'valerio', content: 'Primero', timestamp: '2024-01-01T10:00:00' },
      { id: '2', type: 'user', content: 'Segundo', timestamp: '2024-01-01T10:01:00' },
      { id: '3', type: 'valerio', content: 'Tercero', timestamp: '2024-01-01T10:02:00' },
    ];
    const { container } = render(<ValerioConversationArea {...defaultProps} conversation={messages} />);
    const texts = container.querySelectorAll('[class*="max-w-\\[80\\%\\]"]');
    expect(texts.length).toBe(3);
  });

  test('shows thinking indicator when processing', () => {
    const messages = [
      { id: '1', type: 'user', content: 'Pregunta', timestamp: '2024-01-01T10:00:00' },
    ];
    render(<ValerioConversationArea {...defaultProps} conversation={messages} isProcessing={true} />);
    const dots = document.querySelectorAll('.animate-pulse');
    expect(dots.length).toBe(3);
  });

  test('hides thinking indicator when not processing', () => {
    const messages = [
      { id: '1', type: 'user', content: 'Pregunta', timestamp: '2024-01-01T10:00:00' },
    ];
    render(<ValerioConversationArea {...defaultProps} conversation={messages} isProcessing={false} />);
    const dots = document.querySelectorAll('.animate-pulse');
    expect(dots.length).toBe(0);
  });

  test('handles multiline message content', () => {
    const messages = [
      { id: '1', type: 'valerio', content: 'Línea 1\nLínea 2\nLínea 3', timestamp: '2024-01-01T10:00:00' },
    ];
    render(<ValerioConversationArea {...defaultProps} conversation={messages} />);
    expect(screen.getByText('Línea 1')).toBeInTheDocument();
    expect(screen.getByText('Línea 2')).toBeInTheDocument();
    expect(screen.getByText('Línea 3')).toBeInTheDocument();
  });
});
