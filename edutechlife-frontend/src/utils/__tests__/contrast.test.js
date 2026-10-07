import { describe, it, expect } from "vitest";
import { contrastRatio, readableTextOn } from "../contrast";
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
