import { describe, it, expect } from "vitest";
import {
  contrastRatio,
  readableTextOn,
  ensureContrast,
  tinted,
} from "../contrast";
import { SUBJECT_CATALOG } from "../../config/subjectCatalog";

describe("contrastRatio", () => {
  it("blanco sobre negro es 21:1 y un color consigo mismo 1:1", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 0);
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(1, 5);
  });
  it("acepta hex de 3 dígitos y devuelve null si no es hex", () => {
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 0);
    expect(contrastRatio("rojo", "#000")).toBeNull();
    expect(contrastRatio(undefined, "#000")).toBeNull();
  });
});

describe("readableTextOn", () => {
  it("deja el texto blanco cuando el fondo es oscuro", () => {
    expect(readableTextOn("#00303F")).toBe("#FFFFFF");
    expect(readableTextOn("#7B2FF7")).toBe("#FFFFFF");
  });

  it("pasa a texto oscuro sobre amarillos y celestes claros", () => {
    expect(readableTextOn("#E9A800")).toBe("#00303F");
    expect(readableTextOn("#FFD166")).toBe("#00303F");
    expect(readableTextOn("#06D6A0")).toBe("#00303F");
  });

  it("en tonos medios donde ni blanco ni petróleo llegan, usa casi negro", () => {
    expect(readableTextOn("#EF476F")).toBe("#111827");
  });

  it("con un fondo que no es hex mantiene el blanco", () => {
    expect(readableTextOn("linear-gradient(red, blue)")).toBe("#FFFFFF");
    expect(readableTextOn(undefined)).toBe("#FFFFFF");
  });

  it("todos los colores del catálogo de materias quedan con texto a 4,5:1 o más", () => {
    for (const subject of SUBJECT_CATALOG) {
      const text = readableTextOn(subject.color);
      expect(
        contrastRatio(text, subject.color),
        `${subject.id} ${subject.color}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("ensureContrast", () => {
  it("deja el color como está si ya se lee", () => {
    expect(ensureContrast("#1E293B", "#FFFFFF")).toBe("#1E293B");
  });

  it("oscurece el ámbar, el verde y el naranja de marca hasta 4,5:1 sobre blanco", () => {
    for (const c of [
      "#F59E0B",
      "#10B981",
      "#FB8500",
      "#EF476F",
      "#EF4444",
      "#118AB2",
    ]) {
      const fixed = ensureContrast(c, "#FFFFFF");
      expect(fixed, c).not.toBe(c);
      expect(contrastRatio(fixed, "#FFFFFF"), c).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("mantiene la tonalidad: el ámbar sigue siendo ámbar (más rojo que azul)", () => {
    const fixed = ensureContrast("#F59E0B", "#FFFFFF");
    const [r, , b] = [1, 3, 5].map((i) => parseInt(fixed.slice(i, i + 2), 16));
    expect(r).toBeGreaterThan(b);
  });

  it("cuenta el fondo teñido de la etiqueta, no solo el blanco", () => {
    const tint = "#FFFBEB";
    const fixed = ensureContrast("#F59E0B", tint);
    expect(contrastRatio(fixed, tint)).toBeGreaterThanOrEqual(4.5);
  });

  it("sobre fondo oscuro aclara en lugar de oscurecer", () => {
    const fixed = ensureContrast("#64748B", "#0F172A");
    expect(contrastRatio(fixed, "#0F172A")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#64748B", "#0F172A")).toBeLessThan(4.5);
  });

  it("con un color que no es hex devuelve el mismo valor", () => {
    expect(ensureContrast("rojo")).toBe("rojo");
    expect(ensureContrast(undefined)).toBeUndefined();
  });
});

describe("tinted", () => {
  it("el 12,5 % del ámbar sobre blanco es un crema claro", () => {
    expect(tinted("#F59E0B", 0.125)).toBe("#fef3e1");
  });
  it("sin alfa da el fondo y con alfa 1 el color", () => {
    expect(tinted("#336699", 0)).toBe("#ffffff");
    expect(tinted("#336699", 1)).toBe("#336699");
  });
  it("con un color que no es hex devuelve la base", () => {
    expect(tinted("x", 0.5, "#000000")).toBe("#000000");
  });
  it("permite calcular el texto legible sobre una etiqueta con tinte", () => {
    const bg = tinted("#F59E0B", 0.125);
    const text = ensureContrast("#F59E0B", bg);
    expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
