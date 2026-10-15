import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Nada en el prompt de Max puede afirmar una experiencia que no existe.
const src = fs.readFileSync(
  path.resolve(__dirname, "../maxPrompts.js"),
  "utf8",
);

describe("prompt de Max", () => {
  it("no afirma años de experiencia inventados", () => {
    expect(src).not.toMatch(/\d+\+?\s*años de experiencia/i);
    expect(src).not.toMatch(/\d+\+?\s*years of experience/i);
  });
});
