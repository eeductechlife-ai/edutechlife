import * as esData from "./notebookSim.es.js";
import * as enData from "./notebookSim.en.js";
import * as ptData from "./notebookSim.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { contentScreens, questionsData, learningObjectives } = data;

export const moduleContext =
  "Simular el uso de NotebookLM para practicar la carga, análisis y síntesis de información con fuentes propias.";
