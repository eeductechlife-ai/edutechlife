import { describe, it, expect } from "vitest";
import { getPageContext } from "../nicoContext";

describe("getPageContext", () => {
  it("maps the home page", () => {
    expect(getPageContext("/")).toContain("principal");
    expect(getPageContext("")).toContain("principal");
  });

  it("maps IALab, SmartBoard and VAK routes", () => {
    expect(getPageContext("/ialab")).toContain("IALab");
    expect(getPageContext("/ialab-academic")).toContain("Academic");
    expect(getPageContext("/smartboard")).toContain("SmartBoard");
    expect(getPageContext("/vak")).toContain("VAK");
  });

  it("maps sign-up, login and pricing routes", () => {
    expect(getPageContext("/sign-up/ialab")).toContain("registro");
    expect(getPageContext("/login")).toContain("sesión");
    expect(getPageContext("/planes")).toContain("precios");
    expect(getPageContext("/precios")).toContain("precios");
  });

  it("falls back gracefully for unknown routes", () => {
    expect(getPageContext("/ruta-desconocida")).toContain(
      "ruta-desconocida",
    );
  });
});
