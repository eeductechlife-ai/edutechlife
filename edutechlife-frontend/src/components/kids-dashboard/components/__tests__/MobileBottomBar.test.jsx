import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MobileBottomBar from "../MobileBottomBar";
import { contrastRatio } from "../../../../utils/contrast";

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
    const active = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-current") === "page");
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

  it("never shows lock badges in the main navigation", () => {
    // Every category opens; premium features are gated inside the section.
    for (const tier of ["free", "premium"]) {
      const { container, unmount } = renderBar({ subscriptionTier: tier });
      expect(container.querySelectorAll("svg.lucide-lock")).toHaveLength(0);
      unmount();
    }
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

describe("MobileBottomBar: contraste de las etiquetas inactivas", () => {
  beforeEach(() => {
    // Teclado cerrado: la barra solo se oculta cuando el teclado la tapa.
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

  const inactiveLabel = (props) => {
    renderBar(props);
    const buttons = screen.getAllByRole("button");
    const inactive = buttons.find(
      (b) => b.getAttribute("aria-current") !== "page",
    );
    // La etiqueta es un span con su propio color (si no, hereda el gris global).
    const label = inactive.querySelector("span:last-child");
    expect(inactive.style.color).toBe(label.style.color);
    return label.style.color;
  };

  it("en tema claro usa un gris opaco con contraste ≥ 4,5:1 sobre blanco", () => {
    const color = inactiveLabel({ darkMode: false });
    expect(color).toBe("rgb(71, 85, 105)"); // #475569
    expect(contrastRatio("#475569", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("en tema oscuro usa un gris claro con contraste ≥ 4,5:1 sobre #151F32", () => {
    const color = inactiveLabel({ darkMode: true });
    expect(color).toBe("rgb(203, 213, 225)"); // #CBD5E1
    expect(contrastRatio("#CBD5E1", "#151F32")).toBeGreaterThanOrEqual(4.5);
  });
});
