import { describe, it, expect, vi, beforeEach } from "vitest";

describe("warmBackend", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("no hace nada en desarrollo", async () => {
    const fetchSpy = vi.fn(() => Promise.resolve({}));
    vi.stubGlobal("fetch", fetchSpy);
    const { warmBackend } = await import("../warmBackend");
    warmBackend();
    expect(fetchSpy).not.toHaveBeenCalled(); // vitest corre con DEV=true
  });

  it("no lanza si fetch falla", async () => {
    vi.stubEnv("DEV", false);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    const { warmBackend } = await import("../warmBackend");
    expect(() => warmBackend()).not.toThrow();
  });

  it("avisa una sola vez por sesión", async () => {
    vi.stubEnv("DEV", false);
    const fetchSpy = vi.fn(() => Promise.resolve({}));
    vi.stubGlobal("fetch", fetchSpy);
    const { warmBackend } = await import("../warmBackend");
    warmBackend();
    warmBackend();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toMatch(/\/api\/health$/);
  });
});
