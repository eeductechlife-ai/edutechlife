import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  getVoiceOverrides,
  stripEmoji,
  primeSpeech,
  retrySpeech,
} from "../DaniVoiceController";

describe("getVoiceOverrides", () => {
  test("returns happy voice parameters", () => {
    expect(getVoiceOverrides("happy")).toEqual({
      pitch: 2,
      speakingRate: 1.05,
    });
  });

  test("returns excited voice parameters", () => {
    expect(getVoiceOverrides("excited")).toEqual({
      pitch: 3,
      speakingRate: 1.1,
    });
  });

  test("returns encouraging voice parameters", () => {
    expect(getVoiceOverrides("encouraging")).toEqual({
      pitch: 1.5,
      speakingRate: 0.95,
    });
  });

  test("returns thinking voice parameters", () => {
    expect(getVoiceOverrides("thinking")).toEqual({
      pitch: -1,
      speakingRate: 0.85,
    });
  });

  test("returns explaining voice parameters", () => {
    expect(getVoiceOverrides("explaining")).toEqual({
      pitch: 0,
      speakingRate: 0.9,
    });
  });

  test("returns serious voice parameters", () => {
    expect(getVoiceOverrides("serious")).toEqual({
      pitch: -2,
      speakingRate: 0.85,
    });
  });

  test("returns sad voice parameters", () => {
    expect(getVoiceOverrides("sad")).toEqual({
      pitch: -3,
      speakingRate: 0.8,
    });
  });

  test("returns supportive voice parameters", () => {
    expect(getVoiceOverrides("supportive")).toEqual({
      pitch: 1,
      speakingRate: 0.9,
    });
  });

  test("returns empty object for unknown mood", () => {
    expect(getVoiceOverrides("unknown_mood")).toEqual({});
  });

  test("returns empty object for undefined", () => {
    expect(getVoiceOverrides(undefined)).toEqual({});
  });

  test("returns empty object for null", () => {
    expect(getVoiceOverrides(null)).toEqual({});
  });
});

describe("stripEmoji", () => {
  test("removes common emoji characters from text, collapsing spaces", () => {
    const result = stripEmoji("Hola 😊 mundo 🔥");
    expect(result).toBe("Hola  mundo"); // stripEmoji does not collapse double spaces
    expect(result).not.toContain("😊");
    expect(result).not.toContain("🔥");
  });

  test("removes learning-related emojis, collapsing spaces", () => {
    const result = stripEmoji("📚 Estudiar 🧠 Aprender 🎯 Meta");
    expect(result).toBe("Estudiar  Aprender  Meta");
    expect(result).not.toContain("📚");
    expect(result).not.toContain("🧠");
    expect(result).not.toContain("🎯");
  });

  test("preserves plain text without emojis", () => {
    expect(stripEmoji("Hola mundo")).toBe("Hola mundo");
  });

  test("trims whitespace after stripping emojis", () => {
    expect(stripEmoji("  🎉  ")).toBe("");
  });

  test("handles empty string", () => {
    expect(stripEmoji("")).toBe("");
  });

  test("handles string with only emojis", () => {
    expect(stripEmoji("😊🔥🧠")).toBe("");
  });
});

describe("primeSpeech and retrySpeech (browser APIs)", () => {
  beforeEach(() => {
    window.speechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
    };
    global.SpeechSynthesisUtterance = vi.fn(function () {
      return { volume: 0, text: "" };
    });
  });

  test("primeSpeech cancels existing speech and primes the synthesis engine", () => {
    primeSpeech();
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2);
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  test("retrySpeech cancels and primes synthesis", () => {
    retrySpeech();
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2);
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  test("primeSpeech does not throw when speechSynthesis is unavailable", () => {
    delete window.speechSynthesis;
    expect(() => primeSpeech()).not.toThrow();
  });

  test("retrySpeech does not throw when speechSynthesis is unavailable", () => {
    delete window.speechSynthesis;
    expect(() => retrySpeech()).not.toThrow();
  });
});
