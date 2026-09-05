import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  retrySpeech,
  toggleVoice,
  handleMicClick,
  processStreamChunkVoice,
  speakRemainingText,
  clearVoiceQueue,
} from "../daniChatVoice";

vi.mock("../../../../utils/speech", () => ({
  speakTextConversational: vi.fn(),
  iniciarReconocimiento: vi.fn(),
  stopRecognition: vi.fn(),
}));

vi.mock("../DaniVoiceController", () => ({
  getVoiceOverrides: vi.fn(() => ({ pitch: 1, speakingRate: 0.9 })),
  stripEmoji: vi.fn((text) =>
    text.replace(/[😊🔥🧠🎉💙📚💭🌟📅💬🎯🤔📖🔬🌍🎨💻🤖⭐💎📰✨]/gu, "").trim(),
  ),
}));

import {
  speakTextConversational,
  iniciarReconocimiento,
  stopRecognition,
} from "../../../../utils/speech";

describe("retrySpeech", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.speechSynthesis = { cancel: vi.fn(), speak: vi.fn() };
    global.SpeechSynthesisUtterance = vi.fn().mockImplementation(function () {
      return { volume: 0 };
    });
  });

  test("unblocks voice and primes speech synthesis", () => {
    const setVoiceBlocked = vi.fn();
    const speechPrimed = { current: false };

    retrySpeech({ setVoiceBlocked, speechPrimed });

    expect(setVoiceBlocked).toHaveBeenCalledWith(false);
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2);
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    expect(speechPrimed.current).toBe(true);
  });
});

describe("toggleVoice", () => {
  test("stops current speech and toggles voice enabled", () => {
    const stopSpeech = vi.fn();
    const setVoiceEnabled = vi.fn();
    const setVoiceBlocked = vi.fn();

    toggleVoice({
      isSpeaking: true,
      stopSpeech,
      setVoiceEnabled,
      setVoiceBlocked,
    });

    expect(stopSpeech).toHaveBeenCalled();
    expect(setVoiceEnabled).toHaveBeenCalledWith(expect.any(Function));
    expect(setVoiceBlocked).toHaveBeenCalledWith(false);
  });

  test("does not stop speech if not speaking", () => {
    const stopSpeech = vi.fn();
    const setVoiceEnabled = vi.fn();

    toggleVoice({
      isSpeaking: false,
      stopSpeech,
      setVoiceEnabled,
      setVoiceBlocked: vi.fn(),
    });

    expect(stopSpeech).not.toHaveBeenCalled();
  });
});

describe("handleMicClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("stops recognition when already listening", () => {
    handleMicClick({
      isListening: true,
      setInputText: vi.fn(),
      handleSendMessage: vi.fn(),
      setIsListening: vi.fn(),
    });

    expect(stopRecognition).toHaveBeenCalled();
    expect(iniciarReconocimiento).not.toHaveBeenCalled();
  });

  test("starts recognition when not listening", () => {
    const setInputText = vi.fn();
    const handleSendMessage = vi.fn();
    const setIsListening = vi.fn();

    handleMicClick({
      isListening: false,
      setInputText,
      handleSendMessage,
      setIsListening,
    });

    expect(stopRecognition).not.toHaveBeenCalled();
    expect(iniciarReconocimiento).toHaveBeenCalledWith(
      setInputText,
      expect.any(Function),
      setIsListening,
    );
  });

  test("sends message when recognition finalizes with non-empty text", () => {
    const setInputText = vi.fn();
    const handleSendMessage = vi.fn();
    const setIsListening = vi.fn();

    handleMicClick({
      isListening: false,
      setInputText,
      handleSendMessage,
      setIsListening,
    });

    const onFinalize = iniciarReconocimiento.mock.calls[0][1];
    onFinalize("  hola mundo  ");
    expect(handleSendMessage).toHaveBeenCalledWith("  hola mundo  ");
  });

  test("does not send message when final text is empty after trim", () => {
    const handleSendMessage = vi.fn();

    handleMicClick({
      isListening: false,
      setInputText: vi.fn(),
      handleSendMessage,
      setIsListening: vi.fn(),
    });

    const onFinalize = iniciarReconocimiento.mock.calls[0][1];
    onFinalize("   ");
    expect(handleSendMessage).not.toHaveBeenCalled();
  });
});

describe("processStreamChunkVoice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The queue uses module-level state (_sentenceQueue, _queueRunning).
    // Reset it before each test so prior test runs don't pollute results.
    clearVoiceQueue();
  });

  test("extracts a complete sentence from a chunk and speaks it", () => {
    const pendingSentenceRef = { current: "" };
    const isSpeakingRef = { current: false };

    processStreamChunkVoice("Hola mundo.", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef,
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(pendingSentenceRef.current).toBe("");
    expect(speakTextConversational).toHaveBeenCalledWith(
      "Hola mundo.",
      "dani",
      expect.any(Object),
      expect.any(Function),
      expect.any(Function),
    );
  });

  test("accumulates incomplete sentences in the ref", () => {
    const pendingSentenceRef = { current: "" };

    processStreamChunkVoice("Hola ", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(pendingSentenceRef.current).toBe("Hola ");
    expect(speakTextConversational).not.toHaveBeenCalled();
  });

  test("does not speak when voice is disabled", () => {
    const pendingSentenceRef = { current: "" };

    processStreamChunkVoice("Frase completa.", {
      pendingSentenceRef,
      voiceEnabled: false,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).not.toHaveBeenCalled();
  });

  test("queues sentence even when isSpeakingRef is already true", () => {
    // The queue does NOT gate on isSpeakingRef — it uses its own _queueRunning
    // flag. A sentence is enqueued and spoken immediately when the queue is idle.
    const pendingSentenceRef = { current: "" };

    processStreamChunkVoice("Frase completa.", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef: { current: true },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).toHaveBeenCalledTimes(1);
  });

  test("skips sentences shorter than 8 characters", () => {
    const pendingSentenceRef = { current: "" };

    processStreamChunkVoice("Corto.", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).not.toHaveBeenCalled();
  });

  test("processes multiple sentences from accumulated chunks", () => {
    const pendingSentenceRef = { current: "Primera oración." };
    const isSpeakingRef = { current: false };

    processStreamChunkVoice(" Segunda oración.", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef,
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    // First sentence is spoken; the second is extracted from the ref but
    // skipped because isSpeakingRef stays true (mock doesn't invoke the
    // on-end callback).
    expect(speakTextConversational).toHaveBeenCalledTimes(1);
    expect(speakTextConversational).toHaveBeenCalledWith(
      "Primera oración.",
      "dani",
      expect.any(Object),
      expect.any(Function),
      expect.any(Function),
    );
    expect(pendingSentenceRef.current).toBe("");
  });

  test("handles question marks and exclamations as sentence delimiters", () => {
    const pendingSentenceRef = { current: "" };
    const isSpeakingRef = { current: false };

    processStreamChunkVoice("¿Cómo estás? ¡Muy bien!", {
      pendingSentenceRef,
      voiceEnabled: true,
      isSpeakingRef,
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    // First sentence is spoken; second is skipped because isSpeakingRef is
    // still true from the first speakSentence call (mock doesn't invoke the
    // on-end callback).
    expect(speakTextConversational).toHaveBeenCalledTimes(1);
    expect(speakTextConversational.mock.calls[0][0]).toBe("¿Cómo estás?");
    expect(pendingSentenceRef.current).toBe("");
  });
});

describe("speakRemainingText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearVoiceQueue();
  });

  test("speaks remaining text when conditions are met", () => {
    speakRemainingText("Texto restante para leer.", {
      voiceEnabled: true,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).toHaveBeenCalledWith(
      "Texto restante para leer.",
      "dani",
      expect.any(Object),
      expect.any(Function),
      expect.any(Function),
    );
  });

  test("does not speak when remaining text is too short", () => {
    speakRemainingText("Corto.", {
      voiceEnabled: true,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).not.toHaveBeenCalled();
  });

  test("does not speak when voice is disabled", () => {
    speakRemainingText("Texto suficientemente largo.", {
      voiceEnabled: false,
      isSpeakingRef: { current: false },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).not.toHaveBeenCalled();
  });

  test("speaks regardless of isSpeakingRef (speakRemainingText does not check that flag)", () => {
    speakRemainingText("Texto suficientemente largo.", {
      voiceEnabled: true,
      isSpeakingRef: { current: true },
      daniMood: "happy",
      setIsSpeaking: vi.fn(),
      setVoiceBlocked: vi.fn(),
    });

    expect(speakTextConversational).toHaveBeenCalledTimes(1);
  });
});
