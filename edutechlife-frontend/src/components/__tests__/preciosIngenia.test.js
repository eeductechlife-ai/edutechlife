import { describe, it, expect } from "vitest";
import {
  PRECIOS_INGENIA,
  formatCOP,
  resumenPreciosNico,
} from "../../config/preciosIngenia";
import { getPricingPlans, getFaqItems } from "../IngenIALandingData";
import { SUBSCRIPTION_TIERS } from "../../config/subscriptionTiers";
import { precios } from "../Nico/nicoKnowledge/intents/precios";
import { pagos } from "../Nico/nicoKnowledge/intents/pagos";
import { objeciones } from "../Nico/nicoKnowledge/intents/objeciones";
import { promociones } from "../Nico/nicoKnowledge/intents/promociones";
import { politicas } from "../Nico/nicoKnowledge/intents/politicas";
import { inscripcion } from "../Nico/nicoKnowledge/intents/inscripcion";
import { ventas } from "../Nico/nicoKnowledge/intents/ventas";
import trainingData from "../../data/nico-training-data.json";
import { TRAINING, PROMPT_NICO_SOPORTE } from "../Nico/nicoPrompts";

describe("precios de IngenIA: una sola fuente en COP (C-005)", () => {
  it("formatCOP usa el formato de pesos colombianos", () => {
    expect(formatCOP(49900)).toBe("$49.900");
    expect(formatCOP(449000)).toBe("$449.000");
    expect(formatCOP(0)).toBe("$0");
  });

  it("los montos son los aprobados por el CEO el 2026-10-13", () => {
    expect(PRECIOS_INGENIA.base).toMatchObject({
      mensual: 49900,
      anual: 449000,
      segundoHijo: 24900,
    });
    expect(PRECIOS_INGENIA.fundador.mensual).toBe(39900);
    expect(PRECIOS_INGENIA.acompanamiento.mensualDesde).toBe(149000);
    expect(PRECIOS_INGENIA.intensivo.mensual).toBe(249000);
    expect(PRECIOS_INGENIA.sesionPresencial).toBe(20000);
  });

  for (const locale of ["es", "en", "pt"]) {
    it(`${locale}: la landing muestra Base $49.900 y Personalizado desde $149.000, sin el Básico de $30.000`, () => {
      const planes = getPricingPlans(locale);
      const texto = JSON.stringify(planes);
      expect(planes.map((p) => p.price)).toEqual(["$49.900", "$149.000"]);
      expect(texto).not.toContain("$30.000");
      expect(texto).not.toContain("$50.000");
      expect(texto).toContain("$449.000");
      expect(texto).toContain("$24.900");
      expect(texto).toContain("$39.900");
      expect(texto).toContain("$249.000");
    });

    it(`${locale}: el plan Base no promete coach humano (C-011)`, () => {
      const base = getPricingPlans(locale)[0];
      expect(JSON.stringify(base).toLowerCase()).not.toMatch(/coach/);
    });
  }

  it("las FAQ de la landing ya no hablan de 'ambos planes' con prueba", () => {
    for (const locale of ["es", "en"]) {
      const faq = JSON.stringify(getFaqItems(locale)).toLowerCase();
      expect(faq).not.toContain("ambos planes");
      expect(faq).not.toContain("both plans");
    }
  });

  it("subscriptionTiers usa COP y no USD 4,99 / 9,99", () => {
    const texto = JSON.stringify(SUBSCRIPTION_TIERS);
    expect(texto).not.toMatch(/4\.99|9\.99/);
    expect(SUBSCRIPTION_TIERS.premium.price).toBe(49900);
    expect(SUBSCRIPTION_TIERS.premium.priceDisplay).toBe("$49.900/mes");
  });
});

describe("Nico solo menciona la oferta oficial (C-011)", () => {
  const intents = [
    ...precios,
    ...pagos,
    ...objeciones,
    ...promociones,
    ...politicas,
    ...inscripcion,
    ...ventas,
  ];
  const respuestas = intents.map((i) => i.response).join("\n");
  const textoNico = `${respuestas}\n${TRAINING.plans}\n${PROMPT_NICO_SOPORTE}\n${JSON.stringify(trainingData)}`;

  it("no promete becas, pronto pago, primera clase gratis ni precios para instituciones", () => {
    expect(respuestas.toLowerCase()).not.toMatch(
      /primera clase|pago anticipado|pronto pago|programa de becas|descuentos? (para|por) hermanos|instituciones desde/,
    );
    expect(precios.find((i) => i.id === "becas").response).toContain(
      "no manejamos becas",
    );
    expect(JSON.stringify(trainingData).toLowerCase()).not.toMatch(
      /primera clase|becas/,
    );
    expect(textoNico).not.toMatch(/\$199\.000|\$499\.000|\$30\.000|\$50\.000/);
  });

  it("los planes del prompt salen de la configuración compartida", () => {
    expect(TRAINING.plans).toContain(resumenPreciosNico());
    expect(TRAINING.plans).toContain("$49.900");
  });

  it("para colegios ofrece propuesta a la medida y contacto, sin precio", () => {
    const planes = precios.find((i) => i.id === "planes_disponibles");
    expect(planes.response).toContain("a la medida");
    expect(planes.response).toContain("$49.900");
  });
});
