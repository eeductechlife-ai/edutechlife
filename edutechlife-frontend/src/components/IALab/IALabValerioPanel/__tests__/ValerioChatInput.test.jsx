import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ValerioChatInput from '../ValerioChatInput';

vi.mock('../../../../utils/iconMapping', () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock('../ValerioClearConfirm', () => ({
  default: ({ onConfirm, onCancel }) => (
    <div data-testid="clear-confirm">
      <button onClick={onConfirm} data-testid="confirm-clear">Confirm</button>
      <button onClick={onCancel} data-testid="cancel-clear">Cancel</button>
    </div>
  ),
}));

vi.mock('../../../../i18n/I18nProvider', () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultProps = {
  userInput: '',
  onInputChange: vi.fn(),
  onKeyDown: vi.fn(),
  onSend: vi.fn(),
  onClear: vi.fn(),
  onVoiceToggle: vi.fn(),
  isProcessing: false,
  isListening: false,
  speechSupported: true,
  speechError: null,
  showClearConfirm: false,
  onConfirmClear: vi.fn(),
  onCancelClear: vi.fn(),
  conversationLength: 0,
  moduleTitle: 'Test Module',
};

describe('ValerioChatInput', () => {
  test('renders textarea input', () => {
    render(<ValerioChatInput {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('disables send button when input is empty', () => {
    render(<ValerioChatInput {...defaultProps} userInput="" />);
    const sendBtn = screen.getByLabelText(/ialab\.valerio\.send_aria/);
    expect(sendBtn).toBeDisabled();
  });

  test('enables send button with input', () => {
    render(<ValerioChatInput {...defaultProps} userInput="hola" />);
    const sendBtn = screen.getByLabelText(/ialab\.valerio\.send_aria/);
    expect(sendBtn).not.toBeDisabled();
  });

  test('calls onSend when send button clicked', () => {
    const onSend = vi.fn();
    render(<ValerioChatInput {...defaultProps} userInput="hola" onSend={onSend} />);
    fireEvent.click(screen.getByLabelText(/ialab\.valerio\.send_aria/));
    expect(onSend).toHaveBeenCalled();
  });

  test('shows spinner when processing', () => {
    render(<ValerioChatInput {...defaultProps} isProcessing={true} userInput="hola" />);
    const sendArea = screen.getByLabelText(/ialab\.valerio\.send_aria/);
    expect(sendArea.querySelector('.animate-spin')).toBeTruthy();
  });

  test('disables send during processing', () => {
    render(<ValerioChatInput {...defaultProps} isProcessing={true} userInput="hola" />);
    expect(screen.getByLabelText(/ialab\.valerio\.send_aria/)).toBeDisabled();
  });

  test('shows voice button when speech is supported', () => {
    render(<ValerioChatInput {...defaultProps} speechSupported={true} />);
    expect(screen.getByLabelText(/ialab\.valerio\.voice_start_aria/)).toBeInTheDocument();
  });

  test('shows microphone-slash when listening', () => {
    render(<ValerioChatInput {...defaultProps} isListening={true} />);
    expect(screen.getByLabelText(/ialab\.valerio\.voice_stop_aria/)).toBeInTheDocument();
  });

  test('hides voice button when speech not supported', () => {
    render(<ValerioChatInput {...defaultProps} speechSupported={false} />);
    expect(screen.queryByLabelText(/ialab\.valerio\.voice_start_aria/)).not.toBeInTheDocument();
  });

  test('shows speech error', () => {
    render(<ValerioChatInput {...defaultProps} speechError="Mic not available" />);
    expect(screen.getByText('Mic not available')).toBeInTheDocument();
  });

  test('clear button disabled with empty conversation', () => {
    render(<ValerioChatInput {...defaultProps} conversationLength={0} />);
    const clearBtn = screen.getByText(/ialab\.valerio\.clear_button/).closest('button');
    expect(clearBtn).toBeDisabled();
  });

  test('clear button enabled with conversation', () => {
    render(<ValerioChatInput {...defaultProps} conversationLength={3} />);
    const clearBtn = screen.getByText(/ialab\.valerio\.clear_button/).closest('button');
    expect(clearBtn).not.toBeDisabled();
  });

  test('calls onClear on clear button click', () => {
    const onClear = vi.fn();
    render(<ValerioChatInput {...defaultProps} conversationLength={3} onClear={onClear} />);
    fireEvent.click(screen.getByText(/ialab\.valerio\.clear_button/).closest('button'));
    expect(onClear).toHaveBeenCalled();
  });

  test('shows clear confirm dialog when showClearConfirm is true', () => {
    render(<ValerioChatInput {...defaultProps} showClearConfirm={true} />);
    expect(screen.getByTestId('clear-confirm')).toBeInTheDocument();
  });
});
