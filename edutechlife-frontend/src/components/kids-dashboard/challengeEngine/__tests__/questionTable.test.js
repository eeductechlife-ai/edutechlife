import { describe, it, expect } from "vitest";
import { splitQuestionTable, questionToSpeech } from "../questionTable";

const FLAT =
  "La tabla muestra libros leídos: | Libros | Estudiantes | |---|---| | 1 | 5 | | 3 | 7 | ¿Cuántos leyeron 3 libros?";

describe("splitQuestionTable", () => {
  it("returns plain text untouched", () => {
    expect(splitQuestionTable("¿Cuánto es 2 + 2?")).toEqual({
      before: "¿Cuánto es 2 + 2?",
      table: null,
      after: "",
    });
  });

  it("parses a table flattened onto one line", () => {
    const r = splitQuestionTable(FLAT);
    expect(r.before).toBe("La tabla muestra libros leídos:");
    expect(r.table.header).toEqual(["Libros", "Estudiantes"]);
    expect(r.table.rows).toEqual([
      ["1", "5"],
      ["3", "7"],
    ]);
    expect(r.after).toBe("¿Cuántos leyeron 3 libros?");
  });

  it("parses a multi-line table", () => {
    const r = splitQuestionTable(
      "Mira:\n| A | B |\n|---|---|\n| x | y |\n¿Qué es x?",
    );
    expect(r.table.header).toEqual(["A", "B"]);
    expect(r.table.rows).toEqual([["x", "y"]]);
    expect(r.after).toBe("¿Qué es x?");
  });

  it("reads table rows aloud without pipes", () => {
    const spoken = questionToSpeech(FLAT);
    expect(spoken).not.toContain("|");
    expect(spoken).toContain("Libros 3, Estudiantes 7");
  });
});
