import { describe, test, expect } from "vitest";
import {
  createUserMessage,
  createAssistantMessage,
  createStreamingPlaceholder,
  buildErrorContent,
} from "../nicoMessageCache";

describe("createUserMessage", () => {
  test("creates a user message with content and timestamp", () => {
    const msg = createUserMessage("Hola");
    expect(msg.role).toBe("user");
    expect(msg.content).toBe("Hola");
    expect(msg.timestamp).toBeDefined();
    expect(() => new Date(msg.timestamp)).not.toThrow();
  });

  test("preserves the exact content string", () => {
    const msg = createUserMessage("¿Qué servicios ofrecen?");
    expect(msg.content).toBe("¿Qué servicios ofrecen?");
  });
});

describe("createAssistantMessage", () => {
  test("creates an assistant message with content and timestamp", () => {
    const msg = createAssistantMessage("Respuesta del asistente");
    expect(msg.role).toBe("assistant");
    expect(msg.content).toBe("Respuesta del asistente");
    expect(msg.timestamp).toBeDefined();
    expect(() => new Date(msg.timestamp)).not.toThrow();
  });

  test("merges extra properties into the message", () => {
    const msg = createAssistantMessage("Con opciones", {
      hasOptions: true,
      options: ["Opción A", "Opción B"],
    });
    expect(msg.hasOptions).toBe(true);
    expect(msg.options).toEqual(["Opción A", "Opción B"]);
  });

  test("does not add extra props when empty object is passed", () => {
    const msg = createAssistantMessage("Simple", {});
    expect(msg.role).toBe("assistant");
    expect(msg.content).toBe("Simple");
    expect(msg.isProactive).toBeUndefined();
  });
});

describe("createStreamingPlaceholder", () => {
  test("creates a placeholder with empty content and streaming flag", () => {
    const msg = createStreamingPlaceholder();
    expect(msg.role).toBe("assistant");
    expect(msg.content).toBe("");
    expect(msg.isStreaming).toBe(true);
    expect(msg.timestamp).toBeDefined();
    expect(() => new Date(msg.timestamp)).not.toThrow();
  });
});

describe("buildErrorContent", () => {
  test("returns timeout message when isTimeout is true", () => {
    const msg = buildErrorContent(true);
    expect(msg).toContain("tardando mucho");
    expect(msg).toContain("VAK");
    expect(msg).toContain("STEM");
    expect(msg).toContain("tutorías");
    expect(msg).toContain("bienestar");
  });

  test("returns connection error message when isTimeout is false", () => {
    const msg = buildErrorContent(false);
    expect(msg).toContain("problema de conexion");
    expect(msg).toContain("VAK");
    expect(msg).toContain("STEM");
    expect(msg).toContain("bienestar");
  });
});
