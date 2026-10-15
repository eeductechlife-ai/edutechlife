import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../../../utils/speech", () => ({ prefetchValentina: vi.fn() }));

import useValeriaConversation from "../useDiagnosticoVAK/useValeriaConversation";
import { prefetchValentina } from "../../../utils/speech";

const q = (n) => ({
  context: `Situación ${n}.`,
  text: "¿Qué haces?",
  options: [
    { text: "Mirar", type: "visual" },
    { text: "Escuchar", type: "auditivo" },
    { text: "Hacer", type: "kinestesico" },
  ],
});
const QUESTIONS = Array.from({ length: 12 }, (_, i) => q(i + 1));

const setup = (overrides = {}) => {
  const fns = {
    readQuestionWithOptions: vi.fn(),
    speakAsValentina: vi.fn(),
    stopSpeaking: vi.fn(),
    handleAnswer: vi.fn(),
    handleMoodSelect: vi.fn(),
    setValeriaEnabled: vi.fn(),
  };
  const base = {
    phase: "test",
    currentQuestion: 0,
    ageQuestions: QUESTIONS,
    valeriaEnabled: true,
    studentName: "Sofía",
    studentAge: "8",
    studentMood: "happy",
    diagnosis: null,
    isValentinaSpeaking: false,
    ...fns,
    ...overrides,
  };
  const hook = renderHook((props) => useValeriaConversation(props), {
    initialProps: base,
  });
  const go = (patch) => hook.rerender({ ...base, ...patch });
  return { ...hook, fns, go, base };
};

const lastCtx = (fn) => fn.mock.calls.at(-1)[2];

describe("useValeriaConversation", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("saluda en la primera y lo muestra en pantalla", () => {
    const { result, fns } = setup();
    expect(lastCtx(fns.readQuestionWithOptions)).toMatchObject({
      index: 0,
      mode: "forward",
    });
    expect(result.current.valeriaLine).toMatch(/^¡Hola, Sofía! Soy Valeria\./);
  });

  it("deja lista la siguiente pregunta para responder sin espera", () => {
    setup();
    expect(prefetchValentina).toHaveBeenCalledWith(
      expect.stringContaining("Situación 2."),
      8,
    );
  });

  it("al volver atrás lo dice y ofrece cambiar la respuesta", () => {
    const { fns, go } = setup();
    go({ currentQuestion: 1 });
    go({ currentQuestion: 0 });
    expect(lastCtx(fns.readQuestionWithOptions).mode).toBe("back");
  });

  it("con la voz apagada no habla, pero el globo sigue en pantalla", () => {
    const { result, fns, go } = setup({ valeriaEnabled: false });
    expect(fns.readQuestionWithOptions).not.toHaveBeenCalled();
    expect(result.current.valeriaLine).toMatch(/Hola, Sofía/);
    // Si activa la voz en esa pregunta, solo la lee (sin repetir el saludo).
    go({ valeriaEnabled: true });
    expect(lastCtx(fns.readQuestionWithOptions).mode).toBe("plain");
  });

  it("tras tres respuestas muy rápidas, pide calma una sola vez", () => {
    const { result, fns, go } = setup();
    for (let i = 0; i < 3; i++) {
      act(() => result.current.answer(QUESTIONS[i].options[0]));
      go({ currentQuestion: i + 1 });
    }
    expect(fns.handleAnswer).toHaveBeenCalledTimes(3);
    expect(lastCtx(fns.readQuestionWithOptions).slowDown).toBe(true);
    expect(result.current.valeriaLine).toMatch(/^¡Vas rapidísimo!/);

    for (let i = 3; i < 6; i++) {
      act(() => result.current.answer(QUESTIONS[i].options[0]));
      go({ currentQuestion: i + 1 });
    }
    expect(lastCtx(fns.readQuestionWithOptions).slowDown).toBe(false);
  });

  it("si se queda quieto, ofrece ayuda una vez por pregunta", () => {
    const { result, fns } = setup();
    act(() => vi.advanceTimersByTime(20000));
    expect(fns.speakAsValentina).toHaveBeenCalledWith(
      expect.stringMatching(/^Tómate tu tiempo, Sofía/),
    );
    expect(result.current.valeriaLine).toMatch(/^Tómate tu tiempo/);
    act(() => vi.advanceTimersByTime(60000));
    expect(fns.speakAsValentina).toHaveBeenCalledTimes(1);
  });

  it("no interrumpe mientras Valeria está hablando", () => {
    const { fns } = setup({ isValentinaSpeaking: true });
    act(() => vi.advanceTimersByTime(60000));
    expect(fns.speakAsValentina).not.toHaveBeenCalled();
  });

  it("responde en voz alta a cómo se siente (los más pequeños)", () => {
    const { result, fns } = setup({ phase: "calibration" });
    act(() => result.current.selectMood("sad"));
    expect(fns.handleMoodSelect).toHaveBeenCalledWith("sad");
    expect(fns.speakAsValentina).toHaveBeenCalledWith(
      expect.stringMatching(/adulto de confianza/),
    );
  });

  it("a un adolescente no le habla al escoger el ánimo", () => {
    const { result, fns } = setup({ phase: "calibration", studentAge: "14" });
    act(() => result.current.selectMood("happy"));
    expect(fns.speakAsValentina).not.toHaveBeenCalled();
  });
});
