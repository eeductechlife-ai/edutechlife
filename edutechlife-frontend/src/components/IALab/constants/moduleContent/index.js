import { CONTENT_ES } from "./contentEs.js";
import { CONTENT_EN } from "./contentEn.js";
import { CONTENT_PT } from "./contentPt.js";
import { resolveLocalized } from "../../../../utils/localeUtils";

export { CONTENT_ES } from "./contentEs.js";
export { CONTENT_EN } from "./contentEn.js";
export { CONTENT_PT } from "./contentPt.js";
export {
  getModuleLessons,
  getModuleLearningPoints,
  getModuleOverviewData,
  getModuleObjective,
  getModuleAccordionContent,
} from "./selectors.js";

export const getModuleContent = (locale = "es") => {
  return (
    resolveLocalized(
      { es: CONTENT_ES, en: CONTENT_EN, pt: CONTENT_PT },
      locale,
    ) || CONTENT_ES
  );
};
