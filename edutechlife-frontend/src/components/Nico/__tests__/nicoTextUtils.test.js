import { describe, test, expect, vi, afterEach } from "vitest";
import {
  removeEmojis,
  removeGreetingMulletilla,
  shouldAskForName,
  useNameInResponse,
} from "../nicoTextUtils";

describe("removeEmojis", () => {
  test("returns empty string for falsy input", () => {
    expect(removeEmojis("")).toBe("");
    expect(removeEmojis(null)).toBe("");
    expect(removeEmojis(undefined)).toBe("");
  });

  test("strips bold markdown", () => {
    expect(removeEmojis("esto es **importante**")).toBe("esto es importante");
  });

  test("strips italic markdown", () => {
    expect(removeEmojis("esto es *clave*")).toBe("esto es clave");
  });

  test("strips markdown headings", () => {
    expect(removeEmojis("## Titulo")).toBe("Titulo");
  });

  test("strips markdown links to their text", () => {
    expect(removeEmojis("mira [aquí](https://x.com)")).toBe("mira aquí");
  });

  test("strips inline code backticks", () => {
    expect(removeEmojis("usa `npm run dev`")).toBe("usa npm run dev");
  });

  test("removes emoji characters", () => {
    expect(removeEmojis("Hola 👋 mundo 🌍")).toBe("Hola mundo");
  });

  test("collapses multiple spaces and trims", () => {
    expect(removeEmojis("hola    mundo   ")).toBe("hola mundo");
  });

  test("preserves plain text unchanged", () => {
    expect(removeEmojis("Texto simple sin formato")).toBe(
      "Texto simple sin formato",
    );
  });
});

describe("removeGreetingMulletilla", () => {
  test("returns input unchanged when falsy", () => {
    expect(removeGreetingMulletilla("")).toBe("");
    expect(removeGreetingMulletilla(null)).toBeNull();
  });

  test('removes "Hola soy Nico," presentation prefix', () => {
    expect(removeGreetingMulletilla("Hola soy Nico, te ayudo con eso")).toBe(
      "Te ayudo con eso",
    );
  });

  test('removes "Soy Nico de EdutechLife," prefix', () => {
    expect(
      removeGreetingMulletilla(
        "Soy Nico de EdutechLife, encantado de ayudarte",
      ),
    ).toBe("Encantado de ayudarte");
  });

  test('does not strip a generic "hola" that is not the Nico muletilla', () => {
    expect(removeGreetingMulletilla("Hola, cuéntame más")).toBe(
      "Hola, cuéntame más",
    );
  });

  test("capitalizes the first letter of the cleaned result", () => {
    const result = removeGreetingMulletilla("soy nico, buenos días");
    expect(result[0]).toBe(result[0].toUpperCase());
  });

  test("returns original when stripping would leave too little text", () => {
    // "Soy Nico, ok" -> "ok" (< 3 chars after trim) should fall back to original.
    const input = "Soy Nico, ok";
    expect(removeGreetingMulletilla(input)).toBe(input);
  });
});

describe("shouldAskForName", () => {
  test("asks after 2+ messages when no name and never asked", () => {
    expect(shouldAskForName({ messagesSinceStart: 2 })).toBe(true);
  });

  test("does not ask before 2 messages", () => {
    expect(shouldAskForName({ messagesSinceStart: 1 })).toBe(false);
  });

  test("does not ask when a name is already known", () => {
    expect(
      shouldAskForName({ messagesSinceStart: 5, userName: "Carlos" }),
    ).toBe(false);
  });

  test("does not ask again if already asked once", () => {
    expect(
      shouldAskForName({ messagesSinceStart: 5, nameAskedOnce: true }),
    ).toBe(false);
  });

  test("does not ask when the user declined to give a name", () => {
    expect(
      shouldAskForName({ messagesSinceStart: 5, dontWantName: true }),
    ).toBe(false);
  });
});

describe("useNameInResponse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns the response unchanged when there is no name", () => {
    const result = useNameInResponse("Claro que sí", { nameUsageCounter: 4 });
    expect(result).toEqual({ response: "Claro que sí", newCounter: 4 });
  });

  test("does not inject the name while counter is below 3", () => {
    const result = useNameInResponse("Perfecto", {
      userName: "Ana",
      nameUsageCounter: 2,
    });
    expect(result).toEqual({ response: "Perfecto", newCounter: 2 });
  });

  test("resets the counter when it exceeds 4", () => {
    const result = useNameInResponse("Genial", {
      userName: "Ana",
      nameUsageCounter: 5,
    });
    expect(result).toEqual({ response: "Genial", newCounter: 0 });
  });

  test("injects the name when in range and random favors it", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9); // > 0.5 -> inject
    const result = useNameInResponse("Excelente pregunta", {
      userName: "Ana",
      nameUsageCounter: 3,
    });
    expect(result.response).toMatch(/Ana/);
    expect(result.newCounter).toBe(4);
  });

  test("skips the name when in range but random does not favor it", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1); // <= 0.5 -> skip but still count
    const result = useNameInResponse("Excelente pregunta", {
      userName: "Ana",
      nameUsageCounter: 3,
    });
    expect(result.response).toBe("Excelente pregunta");
    expect(result.newCounter).toBe(4);
  });
});
