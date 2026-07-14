import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HabeasDataModal from "../screens/HabeasDataModal";

describe("HabeasDataModal", () => {
  it("renders as an accessible dialog", () => {
    render(<HabeasDataModal onClose={vi.fn()} onAccept={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "habeas-data-title");
  });

  it("shows the habeas data title (via i18n key)", () => {
    render(<HabeasDataModal onClose={vi.fn()} onAccept={vi.fn()} />);
    expect(screen.getByText("vak.ui.habeas_data_title")).toBeInTheDocument();
  });

  it("calls onAccept when the accept action is triggered", () => {
    const onAccept = vi.fn();
    render(<HabeasDataModal onClose={vi.fn()} onAccept={onAccept} />);
    fireEvent.click(screen.getByText("vak.ui.accept_and_continue"));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <HabeasDataModal onClose={onClose} onAccept={vi.fn()} />,
    );
    // El backdrop es el contenedor exterior con el onClick
    fireEvent.click(container.firstChild);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not close when the inner panel is clicked (stopPropagation)", () => {
    const onClose = vi.fn();
    render(<HabeasDataModal onClose={onClose} onAccept={vi.fn()} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
