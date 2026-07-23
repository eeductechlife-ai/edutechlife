import { CONTENT_ES } from "./contentEs.js";
import { CONTENT_EN } from "./contentEn.js";

export { CONTENT_ES } from "./contentEs.js";
export { CONTENT_EN } from "./contentEn.js";
export {
  getModuleLessons,
  getModuleLearningPoints,
  getModuleOverviewData,
  getModuleObjective,
  getModuleAccordionContent,
} from "./selectors.js";

export const getModuleContent = (locale = "es") => {
  return locale === "en" ? CONTENT_EN : CONTENT_ES;
};
