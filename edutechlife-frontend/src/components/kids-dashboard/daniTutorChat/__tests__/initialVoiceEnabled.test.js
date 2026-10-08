import { describe, it, expect } from "vitest";
import { initialVoiceEnabled } from "../useDaniChat";

const store = (value) => ({ getItem: () => value });

describe("initialVoiceEnabled: la voz de Dani es opcional", () => {
  it("sin preferencia guardada arranca apagada (antes arrancaba encendida)", () => {
    expect(initialVoiceEnabled(store(null))).toBe(false);
  });

  it("respeta quien la activó", () => {
    expect(initialVoiceEnabled(store("true"))).toBe(true);
  });

  it("respeta quien la apagó", () => {
    expect(initialVoiceEnabled(store("false"))).toBe(false);
  });

  it("si el almacenamiento falla queda apagada", () => {
    const broken = {
      getItem: () => {
        throw new Error("bloqueado");
      },
    };
    expect(initialVoiceEnabled(broken)).toBe(false);
  });

  it("usa el almacenamiento del navegador por defecto", () => {
    localStorage.removeItem("edutechlife_dani_voice");
    expect(initialVoiceEnabled()).toBe(false);
    localStorage.setItem("edutechlife_dani_voice", "true");
    expect(initialVoiceEnabled()).toBe(true);
    localStorage.removeItem("edutechlife_dani_voice");
  });
});
