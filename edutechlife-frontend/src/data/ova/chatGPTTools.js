import * as esData from "./chatGPTTools.es.js";
import * as enData from "./chatGPTTools.en.js";
import * as ptData from "./chatGPTTools.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { tools, quizScenarios, learningObjectives } = data;

export const moduleContext =
  "Explorar las herramientas de ChatGPT (búsqueda web, archivos, imágenes, Canvas y voz) para elegir la adecuada y comprobar lo que entrega.";
