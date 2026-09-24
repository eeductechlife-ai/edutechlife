import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callDeepseekSmartboard } from "../api";

function mockFetchResponse(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

describe("callDeepseekSmartboard — fallback a /api/ingenia/chat", () => {
  beforeEach(() => {
    sessionStorage.setItem("auth_token", "test-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("usa /api/ingenia/ai si la ruta existe", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockFetchResponse(200, { result: '{"ok":true}' }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await callDeepseekSmartboard(
      [{ role: "user", content: "hola" }],
      { isJson: true },
    );

    expect(result).toEqual({ ok: true });
    const firstUrl = fetchMock.mock.calls[0][0];
    expect(firstUrl).toContain("/api/ingenia/ai");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("hace fallback a /api/ingenia/chat cuando /ai responde 404", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        mockFetchResponse(404, {
          error: "Ruta no encontrada: POST /api/ingenia/ai",
        }),
      )
      .mockResolvedValueOnce(
        mockFetchResponse(200, { result: "gracias por preguntar" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callDeepseekSmartboard([
      { role: "user", content: "hola" },
    ]);

    expect(result).toBe("gracias por preguntar");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/ingenia/ai");
    expect(fetchMock.mock.calls[1][0]).toContain("/api/ingenia/chat");
  });

  it("parsea JSON aunque el fallback lo envuelva en prosa", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        mockFetchResponse(404, {
          error: "Ruta no encontrada: POST /api/ingenia/ai",
        }),
      )
      .mockResolvedValueOnce(
        mockFetchResponse(200, {
          result: '¡Claro! Aquí tienes:\n```json\n{"weeks":[{"week":1}]}\n```',
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callDeepseekSmartboard(
      [{ role: "user", content: "genera plan" }],
      { isJson: true },
    );

    expect(result).toEqual({ weeks: [{ week: 1 }] });
  });

  it("propaga el error si ambos endpoints fallan con 404", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockFetchResponse(404, { error: "Ruta no encontrada" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      callDeepseekSmartboard([{ role: "user", content: "hola" }]),
    ).rejects.toThrow(
      "El servidor no reconoce los endpoints de IA del IngenIA.",
    );
  });

  it("propaga error 500 sin hacer fallback", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockFetchResponse(500, { error: "Error interno del servidor" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      callDeepseekSmartboard([{ role: "user", content: "hola" }]),
    ).rejects.toMatchObject({
      message: "El servidor está ocupado. Intenta de nuevo en un momento.",
      status: 500,
      detail: "Error interno del servidor",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
