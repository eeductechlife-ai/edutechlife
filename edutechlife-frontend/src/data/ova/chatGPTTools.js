import * as esData from "./chatGPTTools.es.js";
import * as enData from "./chatGPTTools.en.js";
import * as ptData from "./chatGPTTools.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { tools, quizScenarios, learningObjectives } = data;

export const moduleContext =
  "Explorar las herramientas del ecosistema ChatGPT — búsqueda web, intérprete de código, DALL-E, Canvas y memoria — para potenciar el aprendizaje y la productividad.";
