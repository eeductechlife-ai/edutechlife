import * as esData from "./podcastStudio.es.js";
import * as enData from "./podcastStudio.en.js";
import * as ptData from "./podcastStudio.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const {
  CONTENT_TYPES,
  GOALS,
  DOC_COUNTS,
  SOURCE_TIPS,
  GOAL_TIPS,
  DOC_TIPS,
  ESTIMATED_TIME,
  IDEAL_SOURCES,
  FORMATS,
  CHECKLIST_ITEMS,
  learningObjectives,
} = data;

export const moduleContext =
  "Planificar y crear podcasts educativos con IA, seleccionando fuentes de calidad y configurando parámetros óptimos.";
