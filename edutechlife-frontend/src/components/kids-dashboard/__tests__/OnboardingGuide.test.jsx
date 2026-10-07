import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingGuide from "../OnboardingGuide";

const ctx = {
  onboardingComplete: false,
  hasSeenWelcome: false,
  setHasSeenWelcome: vi.fn(),
  setOnboardingComplete: vi.fn(),
  studentAge: 10,
};

vi.mock("../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ctx,
}));
vi.mock("../../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../dani/DaniCharacter", () => ({
  default: () => <span data-testid="dani" />,
}));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, initial, animate, exit, transition, ...rest }) =>
            React.createElement(tag, rest, children),
      },
    ),
    AnimatePresence: ({ children }) => children,
    useReducedMotion: () => false,
  };
});

describe("OnboardingGuide (welcome for a new student)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(ctx, { onboardingComplete: false, hasSeenWelcome: false });
  });

  it("renders nothing once the student has already been through it", () => {
    ctx.onboardingComplete = true;
    const { container } = render(<OnboardingGuide />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is an accessible dialog with a title", () => {
    render(<OnboardingGuide />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("¡Bienvenido/a a IngenIA!");
  });

  it("never grows taller than the screen: the content scrolls, actions stay put", () => {
    render(<OnboardingGuide />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/max-h-full/);
    expect(dialog.className).toMatch(/flex-col/);
    expect(dialog.querySelector(".overflow-y-auto")).toBeInTheDocument();
    // The two actions live outside the scrolling area.
    const start = screen.getByRole("button", { name: /Descubrir mi estilo/ });
    expect(dialog.querySelector(".overflow-y-auto")).not.toContainElement(
      start,
    );
  });

  it("gives the close button a real touch target", () => {
    render(<OnboardingGuide />);
    expect(screen.getByRole("button", { name: "Cerrar" }).className).toMatch(
      /w-11 h-11/,
    );
  });

  it("starts the ADN from the main action", () => {
    const onTabChange = vi.fn();
    render(<OnboardingGuide onTabChange={onTabChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Descubrir mi estilo/ }),
    );
    expect(ctx.setHasSeenWelcome).toHaveBeenCalledWith(true);
    expect(onTabChange).toHaveBeenCalledWith("vak");
  });

  it("lets the student explore first, close with the X, or press Escape", () => {
    render(<OnboardingGuide />);
    fireEvent.click(screen.getByRole("button", { name: "Explorar primero" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(ctx.setOnboardingComplete).toHaveBeenCalledTimes(3);
    expect(ctx.setOnboardingComplete).toHaveBeenCalledWith(true);
  });

  it("puts the keyboard focus on the main action", () => {
    render(<OnboardingGuide />);
    expect(
      screen.getByRole("button", { name: /Descubrir mi estilo/ }),
    ).toHaveFocus();
  });
});
