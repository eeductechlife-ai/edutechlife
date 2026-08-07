import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { createSpeechQueue } from "../valerioSpeechQueue";

const defaultOpts = (overrides = {}) => ({
  speak: vi.fn(),
  prefetch: vi.fn(),
  reveal: vi.fn(),
  onSpeak: vi.fn(),
  onIdle: vi.fn(),
  onFinalize: vi.fn(),
  isStreamDone: () => false,
  ...overrides,
});

const runSpeak = (opts) => {
  let startCb = null;
  let endCb = null;
  opts.speak.mockImplementation((text, onEnd, onStart) => {
    endCb = onEnd;
    startCb = onStart;
  });
  return {
    start: () => startCb?.(),
    end: () => endCb?.(),
    get text() {
      return opts.speak.mock.calls[opts.speak.mock.calls.length - 1]?.[0];
    },
  };
};

describe("valerioSpeechQueue — voz primero, texto después", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("empieza a hablar con la primera frase al encolar", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    queue.push(["Frase uno.", "Frase dos."]);
    expect(opts.speak).toHaveBeenCalledTimes(1);
    expect(opts.speak).toHaveBeenCalledWith(
      "Frase uno.",
      expect.any(Function),
      expect.any(Function),
    );
  });

  test("NO revela el texto antes de que la voz empiece", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    expect(opts.reveal).not.toHaveBeenCalled();
    s.start();
    expect(opts.reveal).toHaveBeenCalledTimes(1);
    expect(opts.reveal).toHaveBeenCalledWith("Frase uno.");
  });

  test("avanza a la siguiente frase solo cuando termina el audio", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push(["Frase uno.", "Frase dos."]);
    s.start();
    s.end();
    expect(opts.speak).toHaveBeenCalledTimes(2);
    expect(s.text).toBe("Frase dos.");
  });

  test("encolar mientras suena una frase no arranca una segunda voz", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    s.start();
    queue.push("Frase dos.");
    queue.push("Frase tres.");
    expect(opts.speak).toHaveBeenCalledTimes(1);
  });

  test("el watchdog revela la frase actual pero NO adelanta la cola ni pisa la voz", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push(["Frase uno.", "Frase dos."]);
    vi.advanceTimersByTime(12000);
    expect(opts.reveal).toHaveBeenCalledTimes(1);
    expect(opts.reveal).toHaveBeenCalledWith("Frase uno.");
    expect(opts.speak).toHaveBeenCalledTimes(1);
    s.end();
    expect(opts.speak).toHaveBeenCalledTimes(2);
    expect(s.text).toBe("Frase dos.");
  });

  test("si la voz arranca después del watchdog, no duplica el texto", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    vi.advanceTimersByTime(12000);
    s.start();
    expect(opts.reveal).toHaveBeenCalledTimes(1);
  });

  test("precarga la siguiente frase cuando la actual empieza a sonar", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push(["Frase uno.", "Frase dos."]);
    s.start();
    expect(opts.prefetch).toHaveBeenCalledWith("Frase dos.");
  });

  test("finaliza la respuesta cuando la cola se drena con el stream completo", () => {
    const opts = defaultOpts({ isStreamDone: () => true });
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    s.start();
    s.end();
    expect(opts.onFinalize).toHaveBeenCalledTimes(1);
  });

  test("con el stream incompleto, al drenar queda idle en vez de finalizar", () => {
    const opts = defaultOpts({ isStreamDone: () => false });
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    s.start();
    s.end();
    expect(opts.onIdle).toHaveBeenCalledTimes(1);
    expect(opts.onFinalize).not.toHaveBeenCalled();
  });

  test("el anti-audio-muerto fuerza el avance y el onEnd viejo no interfiere", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push(["Frase uno.", "Frase dos.", "Frase tres."]);
    vi.advanceTimersByTime(25000);
    expect(opts.speak).toHaveBeenCalledTimes(2);
    expect(s.text).toBe("Frase dos.");
    s.end();
    expect(opts.speak).toHaveBeenCalledTimes(3);
    expect(s.text).toBe("Frase tres.");
  });

  test("reset cancela llamadas pendientes y deja la cola vacía", () => {
    const opts = defaultOpts();
    const queue = createSpeechQueue(opts);
    const s = runSpeak(opts);
    queue.push("Frase uno.");
    queue.reset();
    s.start();
    s.end();
    expect(opts.speak).toHaveBeenCalledTimes(1);
    expect(opts.reveal).not.toHaveBeenCalled();
  });
});
