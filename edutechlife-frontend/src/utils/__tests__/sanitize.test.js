import { describe, it, expect } from "vitest";
import { safeReturnTo } from "../sanitize";

describe("safeReturnTo", () => {
  it("mantiene rutas internas válidas", () => {
    expect(safeReturnTo("/ialab")).toBe("/ialab");
    expect(safeReturnTo("/smartboard")).toBe("/smartboard");
    expect(safeReturnTo("/ialab/2")).toBe("/ialab/2");
  });

  it("rechaza destinos de eco de autenticación (bucle login)", () => {
    expect(safeReturnTo("/login")).toBe("/ialab");
    expect(safeReturnTo("/sign-up/ialab")).toBe("/ialab");
    expect(safeReturnTo("/sign-up/smartboard")).toBe("/ialab");
    expect(safeReturnTo("/auth/callback")).toBe("/ialab");
    expect(safeReturnTo("/reset-password")).toBe("/ialab");
  });

  it("rechaza open redirects", () => {
    expect(safeReturnTo("https://evil.com")).toBe("/ialab");
    expect(safeReturnTo("//evil.com")).toBe("/ialab");
    expect(safeReturnTo("http://localhost:3001/steal")).toBe("/ialab");
  });

  it("rechaza no-rutas y vacíos", () => {
    expect(safeReturnTo(null)).toBe("/ialab");
    expect(safeReturnTo(undefined)).toBe("/ialab");
    expect(safeReturnTo("")).toBe("/ialab");
    expect(safeReturnTo("ialab")).toBe("/ialab");
  });

  it("respeta el fallback entregado por el caller", () => {
    expect(safeReturnTo("/login", "/smartboard")).toBe("/smartboard");
    expect(safeReturnTo("/ialab", "/smartboard")).toBe("/ialab");
  });
});
