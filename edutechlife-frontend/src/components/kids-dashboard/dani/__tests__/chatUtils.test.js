import { describe, test, expect, vi } from "vitest";
import {
  inferMoodFromText,
  getRelativeTime,
  extractTopic,
  SUBJECT_KEYWORDS,
  scrollMessagesToBottom,
} from "../chatUtils";

describe("inferMoodFromText", () => {
  test("detects crisis language with high confidence", () => {
    const result = inferMoodFromText("ya no quiero vivir, quiero morir");
    expect(result).toEqual({ mood: "CRISIS_ALERT", confidence: 0.95 });
  });

  test("detects sadness", () => {
    const result = inferMoodFromText("me siento muy triste y cansado hoy");
    expect(result.mood).toBe("triste");
  });

  test("detects happiness", () => {
    const result = inferMoodFromText("estoy feliz, logré terminar mi tarea");
    expect(result.mood).toBe("feliz");
  });

  test("detects anger", () => {
    const result = inferMoodFromText("estoy muy enojado con esto");
    expect(result.mood).toBe("enojado");
  });

  test("detects anxiety", () => {
    const result = inferMoodFromText("tengo miedo y estoy muy nervioso");
    expect(result.mood).toBe("ansioso");
  });

  test("detects confusion", () => {
    const result = inferMoodFromText("no entiendo nada, es muy complicado");
    expect(result.mood).toBe("confundido");
  });

  test("returns null when no mood keywords match", () => {
    expect(inferMoodFromText("quiero repasar la lección de mañana")).toBeNull();
  });

  test("crisis detection takes priority over other keywords", () => {
    // Contains both sad and crisis language; crisis must win.
    const result = inferMoodFromText("estoy muy triste, no quiero vivir más");
    expect(result.mood).toBe("CRISIS_ALERT");
  });
});

describe("getRelativeTime", () => {
  test('returns "ahora" for timestamps under a minute old', () => {
    const now = new Date();
    expect(getRelativeTime(now.toISOString())).toBe("ahora");
  });

  test("returns minutes for timestamps under an hour old", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000);
    expect(getRelativeTime(fiveMinAgo.toISOString())).toBe("hace 5 min");
  });

  test("returns hours for timestamps under a day old", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000);
    expect(getRelativeTime(threeHoursAgo.toISOString())).toBe("hace 3h");
  });

  test("returns clock time for timestamps a day or more old", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600000);
    const result = getRelativeTime(twoDaysAgo.toISOString());
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("extractTopic", () => {
  test("detects math topic from keyword", () => {
    expect(
      extractTopic("tengo dudas con las ecuaciones de matemáticas"),
    ).toEqual(expect.objectContaining({ topic: "Matemáticas", icon: "📐" }));
  });

  test("detects language/lenguaje topic from keyword", () => {
    expect(extractTopic("necesito ayuda con gramática")).toEqual(
      expect.objectContaining({ topic: "Lenguaje", icon: "📖" }),
    );
  });

  test("detects science topic from keyword", () => {
    expect(extractTopic("quiero entender la célula y la biología")).toEqual(
      expect.objectContaining({ topic: "Ciencias" }),
    );
  });

  test("returns null when no subject keyword matches", () => {
    expect(extractTopic("hola Dani, cómo estás")).toBeNull();
  });

  test("every subject in SUBJECT_KEYWORDS is discoverable by its own keywords", () => {
    SUBJECT_KEYWORDS.forEach((subject) => {
      const found = extractTopic(subject.keywords[0]);
      expect(found?.topic).toBe(subject.topic);
    });
  });
});

describe("scrollMessagesToBottom", () => {
  test("scrolls the container to its scrollHeight with smooth behavior", () => {
    const scrollTo = vi.fn();
    scrollMessagesToBottom({ scrollHeight: 500, scrollTo });
    expect(scrollTo).toHaveBeenCalledWith({
      top: 500,
      behavior: "smooth",
    });
  });

  test("does nothing when container is null", () => {
    expect(() => scrollMessagesToBottom(null)).not.toThrow();
  });

  test("does nothing when container is undefined", () => {
    expect(() => scrollMessagesToBottom(undefined)).not.toThrow();
  });

  test("does nothing when container has no scrollTo method", () => {
    expect(() =>
      scrollMessagesToBottom({ scrollHeight: 100 }),
    ).not.toThrow();
  });

  test("never calls scrollIntoView on the container", () => {
    const scrollIntoView = vi.fn();
    const scrollTo = vi.fn();
    scrollMessagesToBottom({ scrollHeight: 200, scrollTo, scrollIntoView });
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});
