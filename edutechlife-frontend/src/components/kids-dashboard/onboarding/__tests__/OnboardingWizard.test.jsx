import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingWizard from "../OnboardingWizard";

const ctx = {
  hasSeenWelcome: true,
  onboardingComplete: false,
  onboardingStep: 0,
  setOnboardingComplete: vi.fn(),
  setOnboardingStep: vi.fn(),
  vakCompleted: false,
  hasUploadedSchedule: false,
  hasGrades: false,
  studentAge: null,
  gradeLevel: null,
  setGradeLevel: vi.fn(),
  setStudentAge: vi.fn(),
  setCountryCode: vi.fn(),
  setSchoolName: vi.fn(),
  updateDaniMemory: vi.fn(),
};

vi.mock("../../../../context/IngenIAKidsContext", () => ({
  useIngenIAKids: () => ctx,
}));
vi.mock("../../../../lib/analytics", () => ({ track: vi.fn() }));
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
  };
});

const chooseAge = (value) =>
  fireEvent.change(screen.getByLabelText(/Cuántos años tienes/), {
    target: { value },
  });
const chooseGrade = (n) => fireEvent.click(screen.getByText(`${n}°`));

describe("OnboardingWizard: paso de edad y grado", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ctx.studentAge = null;
    ctx.gradeLevel = null;
  });

  it("pide la edad con lista cerrada 8–16", () => {
    render(<OnboardingWizard />);
    const options = [
      ...screen
        .getByLabelText(/Cuántos años tienes/)
        .querySelectorAll("option"),
    ]
      .map((o) => o.value)
      .filter(Boolean);
    expect(options).toEqual([
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ]);
  });

  it("solo ofrece grados de 3.º a 11.º", () => {
    render(<OnboardingWizard />);
    expect(screen.queryByText("1°")).toBeNull();
    expect(screen.queryByText("2°")).toBeNull();
    expect(screen.getByText("3°")).toBeTruthy();
    expect(screen.getByText("11°")).toBeTruthy();
  });

  it("no deja continuar sin edad", () => {
    render(<OnboardingWizard />);
    chooseGrade(6);
    const cta = screen.getByRole("button", { name: "Elige tu edad" });
    expect(cta.disabled).toBe(true);
  });

  it("avisa y no deja continuar con 12 años en 9.º", () => {
    render(<OnboardingWizard />);
    chooseAge("12");
    chooseGrade(9);
    expect(screen.getByRole("alert").textContent).toContain(
      "A los 12 años lo habitual es 6.º o 7.º",
    );
    fireEvent.click(screen.getByText(/Selecciona tu grado/));
    expect(ctx.setGradeLevel).not.toHaveBeenCalled();
    expect(ctx.setStudentAge).not.toHaveBeenCalled();
  });

  it("con una pareja válida guarda edad y grado en la app", () => {
    render(<OnboardingWizard />);
    chooseAge("12");
    chooseGrade(7);
    fireEvent.click(screen.getByText(/Soy de 7°/));
    expect(ctx.setStudentAge).toHaveBeenCalledWith(12);
    expect(ctx.setGradeLevel).toHaveBeenCalledWith(7);
  });
});
