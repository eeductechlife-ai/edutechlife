import { renderHook, act } from "@testing-library/react";
import { useToolChrome, TOOL_CHROME_THEMES } from "../useToolChrome";

const STORAGE_KEY = "ialab-tool-chrome";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useToolChrome", () => {
  test("activa el chrome en temas de herramienta y en el tema default", () => {
    const gemini = renderHook(() => useToolChrome("gemini"));
    const chatgpt = renderHook(() => useToolChrome("chatgpt"));
    const notebooklm = renderHook(() => useToolChrome("notebooklm"));
    const neutral = renderHook(() => useToolChrome("default"));

    expect(gemini.result.current.enabled).toBe(true);
    expect(chatgpt.result.current.enabled).toBe(true);
    expect(notebooklm.result.current.enabled).toBe(true);
    // Módulos 1 y 5 usan el tema `default` con el chrome inmersivo activo.
    expect(neutral.result.current.enabled).toBe(true);
  });

  test("supported es false para todos los temas (sin toggle a vista clásica)", () => {
    const { result } = renderHook(() => useToolChrome("default"));
    expect(result.current.supported).toBe(false);
    expect(TOOL_CHROME_THEMES).toHaveLength(0);
  });

  test("ignora cualquier preferencia clásica persistida y queda en simulada", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chatgpt: false }));
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(true);
  });

  test("toggle ya no cambia el estado (no-op forzado a simulada)", () => {
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(true);

    act(() => {
      result.current.toggle();
    });
    // FORCE_CHROME_ON gana sobre cualquier valor guardado por el toggle.
    expect(result.current.enabled).toBe(true);
  });

  test("soporta valores legacy on/off sin salir de la vista simulada", () => {
    localStorage.setItem(STORAGE_KEY, "off");
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(true);

    localStorage.setItem(STORAGE_KEY, "on");
    const second = renderHook(() => useToolChrome("default"));
    expect(second.result.current.enabled).toBe(true);
  });

  test("tolera localStorage corrupto", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{{{");
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(true);
  });
});
