import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import MaxPanelHeader from "../MaxPanelHeader";

vi.mock("../../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../../../MaxAvatar", () => ({
  default: ({ state }) => <div data-testid="max-avatar" data-state={state} />,
}));

vi.mock("../../../../utils/speech", () => ({
  stopSpeech: vi.fn(),
}));

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es", setLocale: vi.fn() }),
}));

const defaultProps = {
  maxState: "idle",
  setMaxState: vi.fn(),
  currentModule: { id: 1, title: "Ingeniería de Prompts" },
  userLevel: 1,
  onClose: vi.fn(),
};

describe("MaxPanelHeader", () => {
  test("renders module title", () => {
    render(<MaxPanelHeader {...defaultProps} />);
    expect(screen.getByText(/ialab\.max\.module_label/)).toBeInTheDocument();
  });

  test("shows idle state indicator", () => {
    render(<MaxPanelHeader {...defaultProps} maxState="idle" />);
    expect(screen.getByText(/ialab\.max\.status_idle/)).toBeInTheDocument();
  });

  test("shows thinking state indicator", () => {
    render(<MaxPanelHeader {...defaultProps} maxState="thinking" />);
    expect(screen.getByText(/ialab\.max\.status_thinking/)).toBeInTheDocument();
  });

  test("shows speaking state", () => {
    render(<MaxPanelHeader {...defaultProps} maxState="speaking" />);
    expect(screen.getByText(/ialab\.max\.status_speaking/)).toBeInTheDocument();
  });

  test("renders close button", () => {
    render(<MaxPanelHeader {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /ialab\.max\.close_aria/ }),
    ).toBeInTheDocument();
  });

  test("shows level label", () => {
    render(<MaxPanelHeader {...defaultProps} userLevel={1} />);
    expect(screen.getByText(/ialab\.max\.level_label/)).toBeInTheDocument();
  });

  test("renders MaxAvatar with correct state", () => {
    render(<MaxPanelHeader {...defaultProps} maxState="speaking" />);
    const avatar = screen.getByTestId("max-avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("alt", "MAX");
    expect(screen.getByText(/ialab\.max\.status_speaking/)).toBeInTheDocument();
  });

  test("renders title", () => {
    render(<MaxPanelHeader {...defaultProps} />);
    expect(screen.getByText(/ialab\.max\.title/)).toBeInTheDocument();
  });
});
