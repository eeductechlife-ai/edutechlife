import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Regresión de las afirmaciones públicas (CEO, 2026-10-13). Fuente de verdad:
// docs/agentes/marketing/HECHOS-VERIFICADOS.md. Si una de estas frases vuelve,
// el test falla: o se verifica con soporte y se actualiza el documento, o se quita.
//
// Testimonios de IngenIA: el CEO decidió mantenerlos (2026-10-13), no se vigilan aquí.
// Excepción deliberada: las claves pricing.* (planes y precios) quedan fuera;
// los planes los decide el CEO (#83) y sus pendientes van en el PR, no aquí.
const SRC = path.resolve(__dirname, "..");
const load = (lang) =>
  JSON.parse(fs.readFileSync(path.join(SRC, `${lang}.json`), "utf8"));

const PROHIBIDAS = [
  [
    /2[.,]500\+?\s*(familias|niños|crianzas|kids|families|crianças|famílias)|\+2[.,]500/i,
    "2.500 niños/familias",
  ],
  [
    /200\+?\s*docentes|200\+?\s*teachers|200\+?\s*professores|200\+?\s*educators/i,
    "200 docentes",
  ],
  [
    /Soporte (prioritario )?24\/7|24\/7 Support|Suporte (prioritário )?24\/7/i,
    "soporte 24/7",
  ],
  [
    /Operador(es)? oficial|official operators?|Operadores oficiais/i,
    "operador oficial",
  ],
  [
    /Maestro de Maestros|Master of Masters|Mestre dos Mestres/i,
    "maestro de maestros",
  ],
  [
    /(éxito|success|mejora|improvement|efectividad|satisf|padres|parents)[^.]{0,30}\b(90|94|98|95) ?%|\b(90|94|98|95) ?%[^.]{0,30}(éxito|success|mejora|improvement|efectividad|satisf|padres|parents)/i,
    "porcentaje de éxito sin verificar",
  ],
  [
    /Confían en nosotros|Confiado por|Trusted by|Confiam em nós/i,
    "confianza sin verificar",
  ],
  [/Certificados Globalmente|Globally Certified/i, "certificación global"],
  [
    /IBM y Coursera|IBM and Coursera|IBM e Coursera|Coursera e IBM|IBM\/Coursera/i,
    "IBM/Coursera sin contexto SenaTIC",
  ],
  [
    /(más de|more than|mais de) 10 (años|years|anos)|10\+ (años|years)|\b10 años de experiencia/i,
    "10 años sin verificar",
  ],
  [/4[.,]200 estudiantes|4,200 students/i, "4.200 estudiantes"],
  [/\+?12[.,]000\b/, "12.000 sin verificar"],
  [
    /Mejora académica|Academic improvement|Melhora acadêmica/i,
    "mejora académica sin medición",
  ],
];

describe("afirmaciones públicas verificadas (HECHOS-VERIFICADOS)", () => {
  for (const lang of ["es", "en", "pt"]) {
    const data = load(lang);

    it(`${lang}: la portada de IngenIA muestra +1.000 estudiantes (decisión del CEO, 2026-10-13)`, () => {
      expect(data["ingenia.landing_stat_students_value"]).toBe("+1.000");
    });
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        !key.startsWith("pricing.") && typeof value === "string",
    );

    it(`${lang}: no hay cifras ni frases retiradas`, () => {
      const hallazgos = [];
      for (const [key, value] of entries) {
        for (const [re, motivo] of PROHIBIDAS) {
          if (re.test(value)) hallazgos.push(`${key} → ${motivo}`);
        }
      }
      expect(hallazgos).toEqual([]);
    });

    it(`${lang}: el 6.000 de estudiantes siempre dice que es del proyecto SenaTIC`, () => {
      const sinContexto = entries
        .filter(([, value]) => /6[.,]000/.test(value) && !/SenaTIC/.test(value))
        .map(([key]) => key);
      expect(sinContexto).toEqual([]);
    });
  }
});
