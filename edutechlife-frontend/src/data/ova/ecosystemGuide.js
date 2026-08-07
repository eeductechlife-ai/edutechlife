import * as esData from "./ecosystemGuide.es.js";
import * as enData from "./ecosystemGuide.en.js";
import * as ptData from "./ecosystemGuide.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { infographicData, learningObjectives, pricingSection } = data;

export const moduleContext =
  "Comprender la evolución, modos de operación y herramientas del ecosistema ChatGPT para optimizar su uso profesional.";
