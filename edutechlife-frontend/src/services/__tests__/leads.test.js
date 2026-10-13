import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  captureAttribution,
  getAttribution,
  submitLead,
  LeadSubmitError,
} from "../leads";

const setUrl = (url) => window.history.replaceState({}, "", url);

describe("services/leads", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    setUrl("/");
  });

  it("guarda la primera visita con UTM y la conserva aunque lleguen otras", () => {
    setUrl("/vak?utm_source=instagram&utm_medium=bio&utm_campaign=vak-gratis");
    captureAttribution();
    setUrl("/conoce-ingenia?utm_source=facebook");
    captureAttribution();

    const first = JSON.parse(localStorage.getItem("edutechlife_first_touch"));
    expect(first).toMatchObject({
      utm_source: "instagram",
      utm_campaign: "vak-gratis",
    });
    // La sesión guarda la campaña más reciente de esta visita.
    expect(
      JSON.parse(sessionStorage.getItem("edutechlife_session_touch"))
        .utm_source,
    ).toBe("facebook");
  });

  it("sin UTM en la URL no guarda nada", () => {
    setUrl("/automation");
    captureAttribution();
    expect(localStorage.getItem("edutechlife_first_touch")).toBeNull();
  });

  it("getAttribution: página actual y UTM de la sesión o, si no hay, de la primera visita", () => {
    localStorage.setItem(
      "edutechlife_first_touch",
      JSON.stringify({ utm_source: "google_business", utm_medium: "organico" }),
    );
    setUrl("/automation");
    expect(getAttribution()).toMatchObject({
      pagina: "/automation",
      utm_source: "google_business",
      utm_medium: "organico",
    });
  });

  it("submitLead envía a /api/leads con atribución y devuelve true", async () => {
    setUrl("/vak?utm_source=tiktok");
    captureAttribution();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 201 }),
      );

    await expect(
      submitLead({
        nombre: "Ana",
        email: "ana@ejemplo.co",
        fuente: "contacto_header",
        autorizacion_datos: true,
      }),
    ).resolves.toBe(true);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/leads$/);
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      nombre: "Ana",
      fuente: "contacto_header",
      autorizacion_datos: true,
      pagina: "/vak",
      utm_source: "tiktok",
    });
  });

  it.each([
    [429, "limite"],
    [400, "invalido"],
    [500, "servidor"],
  ])("respuesta %i → LeadSubmitError con código %s", async (status, code) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "x" }), { status }),
    );
    const err = await submitLead({ nombre: "Ana" }).catch((e) => e);
    expect(err).toBeInstanceOf(LeadSubmitError);
    expect(err.code).toBe(code);
  });

  it("sin conexión → LeadSubmitError con código red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    const err = await submitLead({ nombre: "Ana" }).catch((e) => e);
    expect(err.code).toBe("red");
  });
});
