import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { advanceMessagePhase, tryInsertProactiveMessage } from "../nicoPhaseManager";

vi.mock("../nicoConversation", () => ({
  getConversationPhase: vi.fn(),
  shouldInsertProactiveMessage: vi.fn(),
  getProactiveMessageByContext: vi.fn(),
}));

vi.mock("../../../utils/speech", () => ({
  speakTextConversational: vi.fn(),
}));

import {
  getConversationPhase,
  shouldInsertProactiveMessage,
  getProactiveMessageByContext,
} from "../nicoConversation";
import { speakTextConversational } from "../../../utils/speech";

describe("advanceMessagePhase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("increments count and sets the conversation phase via getConversationPhase", () => {
    getConversationPhase.mockReturnValue("proactive");
    const setUserMessageCount = vi.fn();
    const setConversationPhase = vi.fn();

    const result = advanceMessagePhase(4, setUserMessageCount, setConversationPhase);

    expect(setUserMessageCount).toHaveBeenCalledWith(expect.any(Function));
    expect(getConversationPhase).toHaveBeenCalledWith(5);
    expect(setConversationPhase).toHaveBeenCalledWith("proactive");
    expect(result).toBe("proactive");
  });

  test("calls getConversationPhase with userMessageCount + 1", () => {
    getConversationPhase.mockReturnValue("reactive");
    const setUserMessageCount = vi.fn();

    advanceMessagePhase(1, setUserMessageCount, vi.fn());

    expect(getConversationPhase).toHaveBeenCalledWith(2);
  });

  test("returns the phase returned by getConversationPhase", () => {
    getConversationPhase.mockReturnValue("something_else");
    const result = advanceMessagePhase(3, vi.fn(), vi.fn());
    expect(result).toBe("something_else");
  });
});

describe("tryInsertProactiveMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("inserts proactive message when conditions are met", () => {
    shouldInsertProactiveMessage.mockReturnValue(true);
    getProactiveMessageByContext.mockReturnValue("¿Te gustaría conocer más?");

    const setMessages = vi.fn();
    const setLastProactiveIndex = vi.fn();

    tryInsertProactiveMessage({
      currentPhase: "proactive",
      userMessageCount: 6,
      lastProactiveIndex: 2,
      userContext: { detectedTopics: [], userName: null },
      audioEnabled: false,
      setMessages,
      setLastProactiveIndex,
      setAudioPermissionError: vi.fn(),
    });

    expect(shouldInsertProactiveMessage).toHaveBeenCalledWith("proactive", 7, 2);

    vi.advanceTimersByTime(500);

    expect(getProactiveMessageByContext).toHaveBeenCalledWith("proactive", [], null);

    const updaterFn = setMessages.mock.calls[0][0];
    const result = updaterFn([{ role: "user", content: "Hola" }]);
    expect(result).toEqual([
      { role: "user", content: "Hola" },
      expect.objectContaining({
        role: "assistant",
        content: "¿Te gustaría conocer más?",
        isProactive: true,
      }),
    ]);

    expect(setLastProactiveIndex).toHaveBeenCalledWith(7);
  });

  test("does not insert message when shouldInsertProactiveMessage returns false", () => {
    shouldInsertProactiveMessage.mockReturnValue(false);

    const setMessages = vi.fn();

    tryInsertProactiveMessage({
      currentPhase: "reactive",
      userMessageCount: 2,
      lastProactiveIndex: null,
      userContext: { detectedTopics: [], userName: null },
      audioEnabled: false,
      setMessages,
      setLastProactiveIndex: vi.fn(),
      setAudioPermissionError: vi.fn(),
    });

    vi.advanceTimersByTime(500);

    expect(shouldInsertProactiveMessage).toHaveBeenCalled();
    expect(getProactiveMessageByContext).not.toHaveBeenCalled();
    expect(setMessages).not.toHaveBeenCalled();
  });

  test("speaks the proactive message when audio is enabled", () => {
    shouldInsertProactiveMessage.mockReturnValue(true);
    getProactiveMessageByContext.mockReturnValue("¡Hola! Te tengo una pregunta.");

    const setAudioPermissionError = vi.fn();

    tryInsertProactiveMessage({
      currentPhase: "proactive",
      userMessageCount: 6,
      lastProactiveIndex: 2,
      userContext: { detectedTopics: [], userName: null },
      audioEnabled: true,
      setMessages: vi.fn(),
      setLastProactiveIndex: vi.fn(),
      setAudioPermissionError,
    });

    vi.advanceTimersByTime(500);

    expect(speakTextConversational).toHaveBeenCalledWith(
      "¡Hola! Te tengo una pregunta.",
      "nico_premium",
      {},
      undefined,
      setAudioPermissionError,
    );
  });

  test("does not speak when audio is disabled", () => {
    shouldInsertProactiveMessage.mockReturnValue(true);
    getProactiveMessageByContext.mockReturnValue("Mensaje proactivo");

    tryInsertProactiveMessage({
      currentPhase: "proactive",
      userMessageCount: 6,
      lastProactiveIndex: 2,
      userContext: { detectedTopics: [], userName: "Ana" },
      audioEnabled: false,
      setMessages: vi.fn(),
      setLastProactiveIndex: vi.fn(),
      setAudioPermissionError: vi.fn(),
    });

    vi.advanceTimersByTime(500);

    expect(speakTextConversational).not.toHaveBeenCalled();
  });
});
