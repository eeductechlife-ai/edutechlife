import { describe, it, expect } from "vitest";
import {
  getVakStyles,
  getPricingPlans,
  getTestimonials,
  getBeneficios,
  getTranquilidad,
  getPasos,
  getFaqItems,
  getPaymentMethods,
  getGuarantee,
} from "../IngenIALandingData";

const getters = {
  getVakStyles,
  getPricingPlans,
  getTestimonials,
  getBeneficios,
  getTranquilidad,
  getPasos,
  getFaqItems,
  getPaymentMethods,
  getGuarantee,
};

describe("portada de IngenIA: datos por idioma", () => {
  for (const locale of ["es", "en", "pt"]) {
    it(`${locale}: ningún bloque rompe (en pt faltaba FAQ_ITEMS_PT y daba ReferenceError)`, () => {
      for (const [name, fn] of Object.entries(getters)) {
        expect(() => fn(locale), `${name}(${locale})`).not.toThrow();
        expect(fn(locale), `${name}(${locale})`).toBeTruthy();
      }
    });
  }

  it("pt muestra preguntas frecuentes (por ahora en inglés) en lugar de romper", () => {
    const faq = getFaqItems("pt");
    expect(Array.isArray(faq)).toBe(true);
    expect(faq.length).toBeGreaterThan(0);
    expect(faq[0]).toHaveProperty("q");
    expect(faq[0]).toHaveProperty("a");
  });
});
