import { renderHook, act } from "@testing-library/react";
import { useToolChrome, TOOL_CHROME_THEMES } from "../useToolChrome";

const STORAGE_KEY = "ialab-tool-chrome";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useToolChrome", () => {
  test("activa el chrome por defecto solo en temas de herramienta", () => {
    const gemini = renderHook(() => useToolChrome("gemini"));
    const chatgpt = renderHook(() => useToolChrome("chatgpt"));
    const notebooklm = renderHook(() => useToolChrome("notebooklm"));
    const neutral = renderHook(() => useToolChrome("default"));

    expect(gemini.result.current.enabled).toBe(true);
    expect(chatgpt.result.current.enabled).toBe(true);
    expect(notebooklm.result.current.enabled).toBe(true);
    expect(neutral.result.current.enabled).toBe(false);
  });

  test("supported es true solo para temas de herramienta", () => {
    const { result } = renderHook(() => useToolChrome("default"));
    expect(result.current.supported).toBe(false);
    expect(TOOL_CHROME_THEMES).toContain("chatgpt");
  });

  test("lee estado persistido por tema", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chatgpt: false }));
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(false);
  });

  test("el toggle persiste y actualiza el estado", () => {
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.enabled).toBe(false);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(stored.chatgpt).toBe(false);

    const fresh = renderHook(() => useToolChrome("chatgpt"));
    expect(fresh.result.current.enabled).toBe(false);
  });

  test("el tema no afeta al estado de otro tema", () => {
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(false);

    const gemini = renderHook(() => useToolChrome("gemini"));
    expect(gemini.result.current.enabled).toBe(true);
  });

  test("soporta valores legacy on/off", () => {
    localStorage.setItem(STORAGE_KEY, "off");
    const { result } = renderHook(() => useToolChrome("chatgpt"));
    expect(result.current.enabled).toBe(false);

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
