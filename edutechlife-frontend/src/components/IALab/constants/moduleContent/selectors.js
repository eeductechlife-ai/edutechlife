/**
 * Selector functions - locale-aware
 */
import { CONTENT_ES } from "./contentEs.js";
import { CONTENT_EN } from "./contentEn.js";

const getContent = (locale = "es") => {
  return locale === "en" ? CONTENT_EN : CONTENT_ES;
};

export const getModuleContent = (moduleId, locale = "es") => {
  const content = getContent(locale);
  return content[moduleId] || null;
};

export const getModuleLessons = (moduleId, locale = "es") => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.lessons || [];
};

export const getModuleLearningPoints = (moduleId, locale = "es") => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.learningPoints || [];
};

export const getModuleOverviewData = (moduleId, locale = "es") => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.overviewData || null;
};

export const getModuleObjective = (moduleId, locale = "es") => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.objective || "";
};

export const getModuleAccordionContent = (moduleId, locale = "es") => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.accordionContent || {};
};
