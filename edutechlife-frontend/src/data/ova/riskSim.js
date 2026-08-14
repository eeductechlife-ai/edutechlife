import * as esData from "./riskSim.es.js";
import * as enData from "./riskSim.en.js";
import * as ptData from "./riskSim.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { gameData, accordionData, mitigations, learningObjectives } =
  data;

export const moduleContext =
  "Identificar y mitigar sesgos en sistemas de IA mediante simulación interactiva de casos reales.";
