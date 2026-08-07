import * as esData from "./biasLab.es.jsx";
import * as enData from "./biasLab.en.jsx";
import * as ptData from "./biasLab.pt.jsx";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const contentData = data.contentData;
export const gameData = data.gameData;
export const learningObjectives = data.learningObjectives;

export const moduleContext =
  "Comprender los fundamentos éticos de la IA, identificar sesgos algorítmicos y aplicar principios de uso responsable.";
