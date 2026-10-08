import { describe, it, expect, beforeEach } from "vitest";
import { manifestForPath, applyManifestForPath } from "../appManifest.js";

describe("appManifest (app instalable según la sección)", () => {
  it("usa el manifest de IALab en sus rutas", () => {
    for (const p of [
      "/ialab",
      "/ialab/3",
      "/ialab-academic",
      "/ialab-pro",
      "/sign-up/ialab",
    ]) {
      expect(manifestForPath(p)).toBe("/manifest-ialab.json");
    }
  });

  it("usa el de IngenIA en el resto", () => {
    for (const p of [
      "/",
      "/ingenia",
      "/ingenia/padres",
      "/login",
      "/ialabs",
      "/sign-up/ingenia",
      "",
      undefined,
    ]) {
      expect(manifestForPath(p)).toBe("/manifest.json");
    }
  });

  describe("applyManifestForPath", () => {
    beforeEach(() => {
      document.head.innerHTML = '<link rel="manifest" href="/manifest.json" />';
    });

    it("cambia el href del <link rel=manifest>", () => {
      const link = document.querySelector('link[rel="manifest"]');
      applyManifestForPath("/ialab/2");
      expect(link.getAttribute("href")).toBe("/manifest-ialab.json");
      applyManifestForPath("/ingenia");
      expect(link.getAttribute("href")).toBe("/manifest.json");
    });

    it("no falla si no hay link", () => {
      document.head.innerHTML = "";
      expect(() => applyManifestForPath("/ialab")).not.toThrow();
    });
  });
});
