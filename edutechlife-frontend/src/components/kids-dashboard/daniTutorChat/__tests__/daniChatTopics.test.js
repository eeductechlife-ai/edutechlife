import { describe, test, expect, vi } from "vitest";
import { trackTopicFromMessage } from "../daniChatTopics";

describe("trackTopicFromMessage", () => {
  test("calls extractTopic with the user message text", () => {
    const extractTopic = vi.fn(() => null);
    const trackTopic = vi.fn();

    trackTopicFromMessage(
      { text: "necesito ayuda con matemáticas" },
      extractTopic,
      trackTopic,
    );

    expect(extractTopic).toHaveBeenCalledWith("necesito ayuda con matemáticas");
  });

  test("calls trackAcademicTopic when a subject is extracted", () => {
    const extractTopic = vi.fn(() => ({ topic: "Matemáticas", icon: "📐" }));
    const trackTopic = vi.fn();

    trackTopicFromMessage({ text: "ecuaciones" }, extractTopic, trackTopic);

    expect(trackTopic).toHaveBeenCalledWith("Matemáticas");
  });

  test("does not call trackTopic when extractTopic returns null", () => {
    const extractTopic = vi.fn(() => null);
    const trackTopic = vi.fn();

    trackTopicFromMessage({ text: "hola" }, extractTopic, trackTopic);

    expect(trackTopic).not.toHaveBeenCalled();
  });

  test("passes the full topic object from extractTopic", () => {
    const extractTopic = vi.fn(() => ({
      topic: "Ciencias",
      icon: "🔬",
      description: "Biología",
    }));
    const trackTopic = vi.fn();

    trackTopicFromMessage({ text: "célula" }, extractTopic, trackTopic);

    expect(trackTopic).toHaveBeenCalledWith("Ciencias");
  });
});
