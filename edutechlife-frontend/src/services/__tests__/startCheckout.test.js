import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { startCheckout } from "../checkoutClient";

const json = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

describe("startCheckout", () => {
  beforeEach(() => {
    sessionStorage.setItem("auth_token", "tok");
  });
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("usa Wompi cuando el backend lo tiene configurado", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        json(200, { url: "https://checkout.wompi.co/p/?x=1" }),
      );
    const res = await startCheckout("smartboard_premium");
    expect(res.url).toContain("checkout.wompi.co");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain(
      "/api/payments/wompi/checkout",
    );
  });

  it("muestra el error del backend si Wompi no está configurado (503)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      json(503, { error: "Wompi no configurado" }),
    );
    await expect(startCheckout("smartboard_premium")).rejects.toThrow(
      "Wompi no configurado",
    );
  });

  it("sin sesión no llama a ninguna pasarela", async () => {
    sessionStorage.clear();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await expect(startCheckout("smartboard_premium")).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
