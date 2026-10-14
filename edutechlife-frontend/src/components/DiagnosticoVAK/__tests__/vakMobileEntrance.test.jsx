import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import DiagnosticoVAK from "../DiagnosticoVAK";

// Registra la prop `initial` de cada motion.* como data-initial para poder
// comprobar si un bloque arranca invisible (opacity 0) antes de animarse.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal();
  const React = await import("react");
  const MOTION_ONLY = ["initial", "animate", "exit", "transition"];
  const cache = new Map();
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        if (!cache.has(tag)) {
          cache.set(
            tag,
            React.forwardRef((props, ref) => {
              const domProps = { ...props };
              MOTION_ONLY.forEach((key) => delete domProps[key]);
              return React.createElement(tag, {
                ...domProps,
                ref,
                "data-initial": JSON.stringify(props.initial ?? null),
              });
            }),
          );
        }
        return cache.get(tag);
      },
    },
  );
  return { ...actual, motion };
});

vi.mock("react-router-dom", () => ({ useNavigate: () => vi.fn() }));
vi.mock("../../../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../ValeriaControls", () => ({ default: () => null }));
vi.mock("../vakComponents", () => ({
  Confetti: () => null,
  Celebration: () => null,
}));
vi.mock("../useDiagnosticoVAK", () => ({
  default: () => ({
    t: (key) => key,
    phase: "intro",
    setPhase: vi.fn(),
    studentName: "",
    setStudentName: vi.fn(),
    studentAge: "",
    setStudentAge: vi.fn(),
    studentMood: "",
    parentName: "",
    setParentName: vi.fn(),
    currentQuestion: 0,
    answers: [],
    diagnosis: null,
    error: null,
    setError: vi.fn(),
    pdfLoading: false,
    showConfetti: false,
    showCelebration: false,
    highContrast: false,
    valeriaEnabled: false,
    setValeriaEnabled: vi.fn(),
    valeriaVolume: 1,
    habeasDataAccepted: false,
    setHabeasDataAccepted: vi.fn(),
    showHabeasModal: false,
    setShowHabeasModal: vi.fn(),
    moodFeedbackText: "",
    showMoodFeedback: false,
    ageQuestions: [],
    isValentinaSpeaking: false,
    valeriaExpression: "neutral",
    resumeOffer: null,
    startTest: vi.fn(),
    submitCalibration: vi.fn(),
    handleAnswer: vi.fn(),
    goBack: vi.fn(),
    handleMoodSelect: vi.fn(),
    listenToQuestion: vi.fn(),
    resumeProgress: vi.fn(),
    discardProgress: vi.fn(),
    resetAll: vi.fn(),
    toggleHighContrast: vi.fn(),
    setHookVolume: vi.fn(),
    generatePDF: vi.fn(),
  }),
}));

const mockViewport = (isMobile) => {
  window.matchMedia = vi.fn((query) => ({
    matches: isMobile && query === "(max-width: 767px)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

// Bloques que arrancan invisibles (initial con opacity 0) y esperan una animación.
const hiddenAtStart = (container) =>
  [...container.querySelectorAll("[data-initial]")].filter((el) => {
    const initial = JSON.parse(el.getAttribute("data-initial"));
    return initial && initial.opacity === 0;
  }).length;

describe("VAK: entrada de la tarjeta en móvil", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("en móvil el contenido se muestra desde el inicio (sin opacity 0)", () => {
    mockViewport(true);
    const { container } = render(<DiagnosticoVAK />);
    expect(hiddenAtStart(container)).toBe(0);
    expect(container.querySelector("h1")).not.toBeNull();
  });

  it("en escritorio se conserva la animación de entrada", () => {
    mockViewport(false);
    const { container } = render(<DiagnosticoVAK />);
    expect(hiddenAtStart(container)).toBeGreaterThan(0);
  });
});
