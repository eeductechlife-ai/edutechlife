import { describe, it, expect } from "vitest";
import {
  hasAny,
  buildStep1Requirements,
  buildStep2Requirements,
  buildStep3Requirements,
} from "./requirements.js";

const t = (k) => k;

describe("hasAny", () => {
  it("detecta palabras clave sin distinguir mayúsculas", () => {
    expect(hasAny("Ahorra TIEMPO al equipo", ["tiempo"])).toBe(true);
    expect(hasAny("nada relevante", ["tiempo"])).toBe(false);
  });
  it("tolera valores vacíos/undefined", () => {
    expect(hasAny(undefined, ["x"])).toBe(false);
  });
});

describe("buildStep1Requirements", () => {
  it("marca caso y justificación por longitud", () => {
    const r = buildStep1Requirements({
      selectedCase: "marketing",
      taskDescription: "x".repeat(20),
      t,
    });
    expect(r.map((x) => [x.id, x.met])).toEqual([
      ["case", true],
      ["justify", true],
      ["criteria", false],
      ["predictive", false],
    ]);
  });
  it("detecta criterios y predicción por palabras clave", () => {
    const r = buildStep1Requirements({
      selectedCase: "dev",
      taskDescription:
        "Es automatizable, tiene alto impacto y permite predecir la demanda futura",
      t,
    });
    expect(r.find((x) => x.id === "criteria").met).toBe(true);
    expect(r.find((x) => x.id === "predictive").met).toBe(true);
  });
});

describe("buildStep2Requirements", () => {
  it("exige rol, tono, reglas, conocimiento y capacidades", () => {
    const r = buildStep2Requirements({
      gptRole: "Analista",
      tone: "professional",
      rules: "citar fuentes siempre",
      knowledge: ["faq"],
      capabilities: ["web"],
      t,
    });
    expect(r.every((x) => x.met)).toBe(true);
  });
  it("marca incompleto lo que falta", () => {
    const r = buildStep2Requirements({
      gptRole: "",
      tone: "",
      rules: "",
      knowledge: [],
      capabilities: [],
      t,
    });
    expect(r.every((x) => x.met)).toBe(false);
  });
});

describe("buildStep3Requirements", () => {
  it("nombre, datos y retorno", () => {
    const r = buildStep3Requirements({
      functionName: "obtenerCliente",
      selectedFields: ["id"],
      returnValue: "un objeto JSON",
      t,
    });
    expect(r.map((x) => x.met)).toEqual([true, true, true]);
  });
});
