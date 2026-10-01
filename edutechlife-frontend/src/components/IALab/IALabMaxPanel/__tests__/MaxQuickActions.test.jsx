import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import MaxQuickActions from "../MaxQuickActions";

vi.mock("../../../../utils/iconMapping", () => ({
  Icon: ({ name }) => <span data-testid="icon" data-icon={name} />,
}));

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (k) => k, locale: "es" }),
}));

const defaultActions = [
  { id: "help", icon: "fa-question-circle", label: "Ayuda" },
  { id: "explain", icon: "fa-lightbulb", label: "Explicar" },
  { id: "examples", icon: "fa-code", label: "Ejemplos" },
  { id: "summary", icon: "fa-list", label: "Resumen" },
];

const defaultProps = {
  quickActions: defaultActions,
  onAction: vi.fn(),
  disabled: false,
};

const actionButtons = () => screen.getAllByTestId("quick-action-btn");

describe("MaxQuickActions", () => {
  test("renders title", () => {
    render(<MaxQuickActions {...defaultProps} />);
    expect(
      screen.getByText("ialab.max.quick_actions_title"),
    ).toBeInTheDocument();
  });

  test("renders all action buttons", () => {
    render(<MaxQuickActions {...defaultProps} />);
    expect(screen.getByText("Ayuda")).toBeInTheDocument();
    expect(screen.getByText("Explicar")).toBeInTheDocument();
    expect(screen.getByText("Ejemplos")).toBeInTheDocument();
    expect(screen.getByText("Resumen")).toBeInTheDocument();
  });

  test("calls onAction with action object when clicked", () => {
    const onAction = vi.fn();
    render(<MaxQuickActions {...defaultProps} onAction={onAction} />);
    fireEvent.click(screen.getByText("Explicar"));
    expect(onAction).toHaveBeenCalledWith(defaultActions[1]);
  });

  test("disables all action buttons when disabled prop is true", () => {
    render(<MaxQuickActions {...defaultProps} disabled={true} />);
    actionButtons().forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  test("action buttons are enabled when disabled prop is false", () => {
    render(<MaxQuickActions {...defaultProps} disabled={false} />);
    actionButtons().forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });

  test("renders correct number of action buttons", () => {
    render(<MaxQuickActions {...defaultProps} />);
    expect(actionButtons().length).toBe(4);
  });

  test("renders no action buttons when no actions provided", () => {
    render(<MaxQuickActions {...defaultProps} quickActions={[]} />);
    expect(screen.queryAllByTestId("quick-action-btn")).toHaveLength(0);
  });

  test("does not call onAction when disabled and clicked", () => {
    const onAction = vi.fn();
    render(
      <MaxQuickActions {...defaultProps} onAction={onAction} disabled={true} />,
    );
    fireEvent.click(screen.getByText("Ayuda"));
    expect(onAction).not.toHaveBeenCalled();
  });

  test("starts collapsed showing the compact row", () => {
    render(<MaxQuickActions {...defaultProps} />);
    expect(screen.getByTestId("quick-actions-row")).toBeInTheDocument();
    expect(screen.queryByTestId("quick-actions-grid")).not.toBeInTheDocument();
  });

  test("toggles to the full grid when the toggle is clicked", () => {
    render(<MaxQuickActions {...defaultProps} />);
    const toggle = screen.getByTestId("quick-actions-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByTestId("quick-actions-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("quick-actions-row")).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
