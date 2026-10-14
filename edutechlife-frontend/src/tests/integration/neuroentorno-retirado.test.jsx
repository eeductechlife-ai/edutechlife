import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Footer from "../../components/Footer";

// La página /neuroentorno se retiró (decisión del CEO, 2026-10-13): el
// diagnóstico VAK vive en /vak y IngenIA en /ingenia. Estas pruebas evitan que
// vuelvan referencias a la ruta retirada.

// Vitest se ejecuta desde edutechlife-frontend (npm run test:smoke).
const read = (rel) => readFileSync(resolve(process.cwd(), rel), "utf-8");

vi.mock("../../utils/iconMapping.jsx", () => ({
  Icon: ({ name }) => <svg data-icon={name} />,
}));

describe("NeuroEntorno retirado: redirecciones y mapa del sitio", () => {
  it("vercel.json redirige /neuroentorno a /vak con 301", () => {
    const config = JSON.parse(read("vercel.json"));
    const redirect = config.redirects.find((r) => r.source === "/neuroentorno");
    expect(redirect).toBeDefined();
    expect(redirect.destination).toBe("/vak");
    expect(redirect.statusCode).toBe(301);
  });

  it("vercel.json ya no reescribe /neuroentorno a index.html", () => {
    const config = JSON.parse(read("vercel.json"));
    const rewrite = config.rewrites.find((r) => r.source === "/neuroentorno");
    expect(rewrite).toBeUndefined();
  });

  it("sitemap.xml, generate-sitemap y prerender no listan /neuroentorno", () => {
    expect(read("public/sitemap.xml")).not.toMatch(/\/neuroentorno/);
    expect(read("scripts/generate-sitemap.mjs")).not.toMatch(/\/neuroentorno/);
    expect(read("scripts/prerender.mjs")).not.toMatch(/\/neuroentorno/);
  });
});

describe("Pie de página: enlace IngenIA", () => {
  const originalLocation = window.location;
  const assign = vi.fn();

  beforeEach(() => {
    assign.mockClear();
    delete window.location;
    window.location = { ...originalLocation, assign };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("al pulsar IngenIA navega a /ingenia (no a la vista retirada)", () => {
    render(<Footer />);
    fireEvent.click(screen.getByRole("button", { name: "footer.ingenia" }));
    expect(assign).toHaveBeenCalledWith("/ingenia");
  });
});
