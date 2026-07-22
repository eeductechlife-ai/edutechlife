import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContactModal from "../../components/ContactModal";

vi.mock("../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../lib/analytics", () => ({
  track: vi.fn(),
}));

vi.mock("../../hooks/useFocusTrap", () => ({
  default: () => ({ current: null }),
}));

vi.mock("../../hooks/useBodyScrollLock", () => ({
  default: () => {},
}));

vi.mock("../../utils/iconMapping", () => ({
  Icon: () => <span data-testid="mock-icon" />,
}));

describe("ContactModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ContactModal isOpen={false} onClose={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders modal content when open", () => {
    render(<ContactModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText("contact.title")).toBeTruthy();
  });

  it("calls onClose when aria-label close button clicked", () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText("Cerrar");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector(".absolute.inset-0");
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when footer close button clicked", () => {
    const onClose = vi.fn();
    render(<ContactModal isOpen={true} onClose={onClose} />);
    const footerCloseBtns = screen.getAllByText("common.close");
    fireEvent.click(footerCloseBtns[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
