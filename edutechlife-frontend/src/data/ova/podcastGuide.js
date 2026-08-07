import * as esData from "./podcastGuide.es.jsx";
import * as enData from "./podcastGuide.en.jsx";
import * as ptData from "./podcastGuide.pt.jsx";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const MODULE_DATA = data.MODULE_DATA;
export const FINAL_CHALLENGE = data.FINAL_CHALLENGE;
export const learningObjectives = data.learningObjectives;

export const moduleContext =
  "Transformar documentos en podcasts educativos con NotebookLM, seleccionando fuentes y configurando Audio Overviews.";
