import * as esData from "./ecosystemGuide.es.js";
import * as enData from "./ecosystemGuide.en.js";
import * as ptData from "./ecosystemGuide.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { infographicData, learningObjectives } = data;

export const moduleContext =
  "Comprender cómo responde ChatGPT, sus formas de responder y sus herramientas para pedir una tarea del día a día y obtener una respuesta útil.";
