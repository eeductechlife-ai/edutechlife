import { describe, it, expect } from "vitest";
import { serializarJsonLd } from "../jsonLd.js";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe("serializarJsonLd", () => {
  it("no deja que un texto cierre la etiqueta <script>", () => {
    const salida = serializarJsonLd({
      name: "</script><script>alert(1)</script>",
    });
    expect(salida).not.toContain("<");
    expect(salida).not.toContain("</script>");
  });

  it("el resultado se lee de vuelta igual que el original", () => {
    const original = {
      "@context": "https://schema.org",
      name: "IngenIA <b>ñandú</b> & más",
      lista: [1, "dos", { tres: true }],
    };
    expect(JSON.parse(serializarJsonLd(original))).toEqual(original);
  });

  it("escapa los separadores de línea Unicode", () => {
    const texto = `a${LS}b${PS}c`;
    const salida = serializarJsonLd({ texto });
    expect(salida.includes(LS)).toBe(false);
    expect(salida.includes(PS)).toBe(false);
    expect(JSON.parse(salida).texto).toBe(texto);
  });

  it("deja igual el JSON que no tiene caracteres especiales", () => {
    const o = {
      "@type": "Organization",
      name: "Edutechlife",
      url: "https://edutechlife.co",
    };
    expect(serializarJsonLd(o)).toBe(JSON.stringify(o));
  });
});
