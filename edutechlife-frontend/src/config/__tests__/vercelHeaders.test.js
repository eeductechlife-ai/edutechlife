import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Vitest corre desde la raíz del frontend.
const config = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf8"),
);

const headersFor = (source) =>
  Object.fromEntries(
    (config.headers.find((h) => h.source === source)?.headers || []).map(
      (h) => [h.key, h.value],
    ),
  );

describe("vercel.json: cabeceras de producción", () => {
  const all = headersFor("/(.*)");

  it("el CSP de producción no permite localhost (era un resto de desarrollo)", () => {
    const csp = all["Content-Security-Policy"];
    expect(csp).toBeTruthy();
    expect(csp).not.toMatch(/localhost/);
    expect(csp).not.toMatch(/127\.0\.0\.1/);
  });

  it("el CSP sigue permitiendo el backend y Supabase", () => {
    const csp = all["Content-Security-Policy"];
    expect(csp).toContain("https://edutechlife-backend.onrender.com");
    expect(csp).toContain("https://*.supabase.co");
  });

  it("conserva las demás cabeceras de seguridad", () => {
    expect(all["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(all["Permissions-Policy"]).toMatch(/camera=\(\)/);
    expect(all["Content-Security-Policy"]).toMatch(/script-src 'self'/);
  });

  it("las pantallas con sesión de /ingenia no se indexan", () => {
    const ingenia = headersFor("/ingenia(.*)");
    expect(ingenia["X-Robots-Tag"]).toMatch(/noindex/);
  });

  it("el resto del sitio sigue indexable (sin X-Robots-Tag general)", () => {
    expect(all["X-Robots-Tag"]).toBeUndefined();
  });
});
