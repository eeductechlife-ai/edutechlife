import { describe, test, expect } from "vitest";
import { compressPhoto, readHomeworkPhoto, photoPrefill } from "../daniPhoto";

describe("daniPhoto", () => {
  test("rejects files that are not images", async () => {
    const pdf = new File(["x"], "tarea.pdf", { type: "application/pdf" });
    await expect(compressPhoto(pdf)).rejects.toThrow("no parece una foto");
  });

  test("rejects oversized photos before reading them", async () => {
    const big = new File(["x"], "foto.jpg", { type: "image/jpeg" });
    Object.defineProperty(big, "size", { value: 25 * 1024 * 1024 });
    await expect(compressPhoto(big)).rejects.toThrow("muy pesada");
  });

  test("requires a session token", async () => {
    const img = new File(["x"], "foto.jpg", { type: "image/jpeg" });
    await expect(readHomeworkPhoto(img, {})).rejects.toThrow("sesión");
  });

  test("prefill keeps the transcribed text and asks for help", () => {
    const msg = photoPrefill("1. Resuelve 3/4 + 1/2");
    expect(msg).toContain("1. Resuelve 3/4 + 1/2");
    expect(msg).toContain("¿Me ayudas");
  });
});
