import * as esData from "./ecosystemGuide.es.js";
import * as enData from "./ecosystemGuide.en.js";

const getLocale = () => {
  try {
    return typeof window !== "undefined" && typeof localStorage !== "undefined"
      ? localStorage.getItem("edutechlife_locale") || "es"
      : "es";
  } catch {
    return "es";
  }
};

const data = getLocale() === "en" ? enData : esData;

export const { infographicData, learningObjectives, pricingSection } = data;

export const moduleContext =
  "Comprender la evolución, modos de operación y herramientas del ecosistema ChatGPT para optimizar su uso profesional.";
