import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callDaniOrchestrator } from "../api";

function sseResponse(status, events) {
  const body =
    events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("") +
    "data: [DONE]\n\n";
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(body));
      controller.close();
    },
  });
  return new Response(stream, {
    status,
    headers: { "Content-Type": "text/event-stream" },
  });
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("callDaniOrchestrator — fallback a /api/smartboard/chat/stream", () => {
  beforeEach(() => {
    sessionStorage.setItem("auth_token", "test-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("usa /api/smartboard/dani/chat cuando la ruta existe", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        sseResponse(200, [{ chunk: "Hola" }, { chunk: ", soy Dani" }]),
      );
    vi.stubGlobal("fetch", fetchMock);

    const chunks = [];
    await callDaniOrchestrator(
      { message: "hola", studentId: "s1", history: [] },
      { token: "test-token" },
      (c) => chunks.push(c),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/smartboard/dani/chat");
    expect(chunks.join("")).toBe("Hola, soy Dani");
  });

  it("hace fallback a /chat/stream cuando /dani/chat responde 404, convirtiendo el payload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(404, {
          error: "Ruta no encontrada: POST /api/smartboard/dani/chat",
        }),
      )
      .mockResolvedValueOnce(sseResponse(200, [{ chunk: "Respuesta legacy" }]));
    vi.stubGlobal("fetch", fetchMock);

    const chunks = [];
    const history = [{ role: "user", content: "pregunta anterior" }];
    await callDaniOrchestrator(
      {
        message: "nueva pregunta",
        studentId: "s1",
        history,
        documentContext: "contexto del doc",
      },
      { token: "test-token" },
      (c) => chunks.push(c),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [primaryUrl, primaryOpts] = fetchMock.mock.calls[0];
    const [legacyUrl, legacyOpts] = fetchMock.mock.calls[1];

    expect(primaryUrl).toContain("/api/smartboard/dani/chat");
    expect(legacyUrl).toContain("/api/smartboard/chat/stream");

    const legacyBody = JSON.parse(legacyOpts.body);
    expect(legacyBody.messages).toEqual([
      { role: "user", content: "pregunta anterior" },
      { role: "user", content: "nueva pregunta" },
    ]);
    expect(legacyBody.context).toBe("contexto del doc");
    expect(legacyOpts.headers.Authorization).toBe("Bearer test-token");

    expect(chunks.join("")).toBe("Respuesta legacy");
  });

  it("propaga el error si /dani/chat responde 500, sin hacer fallback", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(500, { error: "Error interno del servidor" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      callDaniOrchestrator(
        { message: "hola", studentId: "s1", history: [] },
        { token: "test-token" },
      ),
    ).rejects.toThrow(
      "API responded with status 500: Error interno del servidor",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rechaza sin token", async () => {
    sessionStorage.clear();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(callDaniOrchestrator({ message: "hola" })).rejects.toThrow(
      "No auth token available",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
