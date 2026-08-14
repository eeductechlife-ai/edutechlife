import * as esData from "./ethicalDilemmas.es.js";
import * as enData from "./ethicalDilemmas.en.js";
import * as ptData from "./ethicalDilemmas.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { dilemmas, accordionData, learningObjectives } = data;

export const moduleContext =
  "Analizar dilemas éticos en el uso de inteligencia artificial a través de casos prácticos interactivos.";
