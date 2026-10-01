import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import MaxChatInput from "../MaxChatInput";

vi.mock("../../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../MaxClearConfirm", () => ({
  default: ({ onConfirm, onCancel }) => (
    <div data-testid="clear-confirm">
      <button onClick={onConfirm} data-testid="confirm-clear">
        Confirm
      </button>
      <button onClick={onCancel} data-testid="cancel-clear">
        Cancel
      </button>
    </div>
  ),
}));

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

const defaultProps = {
  userInput: "",
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
  moduleTitle: "Test Module",
};

describe("MaxChatInput", () => {
  test("renders textarea input", () => {
    render(<MaxChatInput {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("disables send button when input is empty", () => {
    render(<MaxChatInput {...defaultProps} userInput="" />);
    const sendBtn = screen.getByLabelText(/ialab\.max\.send_aria/);
    expect(sendBtn).toBeDisabled();
  });

  test("enables send button with input", () => {
    render(<MaxChatInput {...defaultProps} userInput="hola" />);
    const sendBtn = screen.getByLabelText(/ialab\.max\.send_aria/);
    expect(sendBtn).not.toBeDisabled();
  });

  test("calls onSend when send button clicked", () => {
    const onSend = vi.fn();
    render(<MaxChatInput {...defaultProps} userInput="hola" onSend={onSend} />);
    fireEvent.click(screen.getByLabelText(/ialab\.max\.send_aria/));
    expect(onSend).toHaveBeenCalled();
  });

  test("shows spinner when processing", () => {
    render(
      <MaxChatInput {...defaultProps} isProcessing={true} userInput="hola" />,
    );
    const sendArea = screen.getByLabelText(/ialab\.max\.send_aria/);
    expect(sendArea.querySelector(".animate-spin")).toBeTruthy();
  });

  test("disables send during processing", () => {
    render(
      <MaxChatInput {...defaultProps} isProcessing={true} userInput="hola" />,
    );
    expect(screen.getByLabelText(/ialab\.max\.send_aria/)).toBeDisabled();
  });

  test("shows voice button when speech is supported", () => {
    render(<MaxChatInput {...defaultProps} speechSupported={true} />);
    expect(
      screen.getByLabelText(/ialab\.max\.voice_start_aria/),
    ).toBeInTheDocument();
  });

  test("shows microphone-slash when listening", () => {
    render(<MaxChatInput {...defaultProps} isListening={true} />);
    expect(
      screen.getByLabelText(/ialab\.max\.voice_stop_aria/),
    ).toBeInTheDocument();
  });

  test("hides voice button when speech not supported", () => {
    render(<MaxChatInput {...defaultProps} speechSupported={false} />);
    expect(
      screen.queryByLabelText(/ialab\.max\.voice_start_aria/),
    ).not.toBeInTheDocument();
  });

  test("shows speech error", () => {
    render(<MaxChatInput {...defaultProps} speechError="Mic not available" />);
    expect(screen.getByText("Mic not available")).toBeInTheDocument();
  });

  test("clear button disabled with empty conversation", () => {
    render(<MaxChatInput {...defaultProps} conversationLength={0} />);
    const clearBtn = screen
      .getByText(/ialab\.max\.clear_button/)
      .closest("button");
    expect(clearBtn).toBeDisabled();
  });

  test("clear button enabled with conversation", () => {
    render(<MaxChatInput {...defaultProps} conversationLength={3} />);
    const clearBtn = screen
      .getByText(/ialab\.max\.clear_button/)
      .closest("button");
    expect(clearBtn).not.toBeDisabled();
  });

  test("calls onClear on clear button click", () => {
    const onClear = vi.fn();
    render(
      <MaxChatInput
        {...defaultProps}
        conversationLength={3}
        onClear={onClear}
      />,
    );
    fireEvent.click(
      screen.getByText(/ialab\.max\.clear_button/).closest("button"),
    );
    expect(onClear).toHaveBeenCalled();
  });

  test("shows clear confirm dialog when showClearConfirm is true", () => {
    render(<MaxChatInput {...defaultProps} showClearConfirm={true} />);
    expect(screen.getByTestId("clear-confirm")).toBeInTheDocument();
  });
});
