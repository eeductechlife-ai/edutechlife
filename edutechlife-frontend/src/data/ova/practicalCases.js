import * as esData from "./practicalCases.es.js";
import * as enData from "./practicalCases.en.js";
import * as ptData from "./practicalCases.pt.js";
import { resolveLocalized } from "../../utils/localeUtils";

const data = resolveLocalized({ es: esData, en: enData, pt: ptData }) || esData;

export const { challenges, learningObjectives } = data;

export const moduleContext =
  "Aplicar herramientas de IA a casos de uso profesional reales para desarrollar habilidades prácticas de productividad.";
