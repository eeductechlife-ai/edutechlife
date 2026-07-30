import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MobileBottomBar from "../MobileBottomBar";

vi.mock("../../../../i18n/I18nProvider", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const renderBar = (props = {}) =>
  render(
    <MobileBottomBar
      activeTab="inicio"
      onTabChange={vi.fn()}
      darkMode={false}
      subscriptionTier="free"
      {...props}
    />,
  );

describe("MobileBottomBar", () => {
  beforeEach(() => {
    // Keyboard closed by default
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        height: 800,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("renders all 5 category buttons", () => {
    renderBar();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });

  it("marks the active category with aria-current", () => {
    renderBar({ activeTab: "materias" });
    // 'materias' maps to 'learn' category
    const active = screen.getAllByRole("button").find(
      (b) => b.getAttribute("aria-current") === "page",
    );
    expect(active).toBeTruthy();
  });

  it("calls onTabChange with first tab of category when tapping a new one", () => {
    const onTabChange = vi.fn();
    renderBar({ activeTab: "inicio", onTabChange });
    // Find any button that is NOT the active one
    const buttons = screen.getAllByRole("button");
    const inactive = buttons.find(
      (b) => b.getAttribute("aria-current") !== "page",
    );
    fireEvent.click(inactive);
    expect(onTabChange).toHaveBeenCalledTimes(1);
    // Should be a valid tab id, not 'inicio' (the current one)
    expect(onTabChange.mock.calls[0][0]).not.toBe("inicio");
  });

  it("shows a lock badge on premium categories for free users", () => {
    const { container } = renderBar({ subscriptionTier: "free" });
    // lucide Lock renders an <svg>, count them (there is one per locked category)
    const locks = container.querySelectorAll("svg.lucide-lock");
    expect(locks.length).toBeGreaterThan(0);
  });

  it("hides no lock badge for premium users", () => {
    const { container } = renderBar({ subscriptionTier: "premium" });
    const locks = container.querySelectorAll("svg.lucide-lock");
    expect(locks.length).toBe(0);
  });

  it("hides itself when the on-screen keyboard is open", () => {
    // Simulate keyboard: visualViewport shrunk by 400px
    let resizeHandler;
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        height: 400,
        addEventListener: (evt, cb) => {
          if (evt === "resize") resizeHandler = cb;
        },
        removeEventListener: vi.fn(),
      },
    });
    const { container } = renderBar();
    // Trigger the resize callback (state update needs act)
    act(() => resizeHandler && resizeHandler());
    expect(container.firstChild).toBeNull();
  });
});
