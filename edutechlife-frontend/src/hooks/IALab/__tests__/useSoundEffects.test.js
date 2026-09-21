import { renderHook, act } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { useSoundEffects } from "../useSoundEffects";

// Cada ruta /sounds/*.mp3 declarada en el hook debe existir en public/.
// Sin esto, un asset ausente se convierte en un 404 silencioso por logro
// (le pasó a achievement.mp3: se referenciaba desde el inicio y nunca existió).
const here = path.dirname(fileURLToPath(import.meta.url));
const hookSource = readFileSync(
  path.resolve(here, "../useSoundEffects.js"),
  "utf8",
);
const declaredSoundSrcs = [...hookSource.matchAll(/'(\/sounds\/[^']+)'/g)].map(
  (match) => match[1],
);
const publicDir = path.resolve(here, "../../../../public");

describe("useSoundEffects assets en public/", () => {
  test("el hook declara rutas de sonido", () => {
    expect(declaredSoundSrcs.length).toBeGreaterThan(0);
  });

  it.each(declaredSoundSrcs)("existe public%s", (src) => {
    expect(existsSync(path.join(publicDir, src))).toBe(true);
  });
});

describe("useSoundEffects", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "Audio", {
      value: vi.fn(function () {
        return {
          play: vi.fn().mockResolvedValue(undefined),
          pause: vi.fn(),
          volume: 1,
          currentTime: 0,
        };
      }),
      configurable: true,
      writable: true,
    });
  });

  test("returns playSound function", () => {
    const { result } = renderHook(() => useSoundEffects());
    expect(typeof result.current.playSound).toBe("function");
  });

  test("playSound does nothing for unknown sound", () => {
    const { result } = renderHook(() => useSoundEffects());
    expect(() => {
      act(() => {
        result.current.playSound("unknown_sound");
      });
    }).not.toThrow();
  });

  test("playSound creates Audio with correct src", () => {
    const { result } = renderHook(() => useSoundEffects());
    act(() => {
      result.current.playSound("achievement");
    });
    expect(globalThis.Audio).toHaveBeenCalledWith("/sounds/achievement.mp3");
  });

  test("playSound supports all sound types", () => {
    const srcMap = {
      achievement: "/sounds/achievement.mp3",
      streak: "/sounds/streak.mp3",
      levelUp: "/sounds/level-up.mp3",
      quizCorrect: "/sounds/correct.mp3",
      quizWrong: "/sounds/wrong.mp3",
    };
    const { result } = renderHook(() => useSoundEffects());
    Object.entries(srcMap).forEach(([name, expectedSrc]) => {
      vi.clearAllMocks();
      act(() => {
        result.current.playSound(name);
      });
      expect(globalThis.Audio).toHaveBeenCalledWith(expectedSrc);
    });
  });

  test("handles Audio constructor throwing", () => {
    Object.defineProperty(globalThis, "Audio", {
      value: vi.fn(function () {
        throw new Error("Audio not available");
      }),
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useSoundEffects());
    expect(() => {
      act(() => {
        result.current.playSound("achievement");
      });
    }).not.toThrow();
  });

  test("handles play() promise rejection", () => {
    const { result } = renderHook(() => useSoundEffects());
    act(() => {
      result.current.playSound("achievement");
    });
  });
});
