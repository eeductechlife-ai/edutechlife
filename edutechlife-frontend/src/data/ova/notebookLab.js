import * as esData from "./notebookLab.es.js";
import * as enData from "./notebookLab.en.js";
import * as ptData from "./notebookLab.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { contentScreens, questionsData, learningObjectives } = data;

export const moduleContext =
  "Aprender a usar NotebookLM para crear cuadernos de investigación basados en fuentes propias con respuestas fundamentadas.";
