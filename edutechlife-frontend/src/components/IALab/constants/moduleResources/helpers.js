import { RESOURCES_ES } from "./resourcesEs";
import { RESOURCES_EN } from "./resourcesEn";
import { RESOURCES_PT } from "./resourcesPt";
import { resolveLocalized } from "../../../../utils/localeUtils";

const RESOURCES_MAP = { es: RESOURCES_ES, en: RESOURCES_EN, pt: RESOURCES_PT };

const getResources = (locale = "es") => {
  return resolveLocalized(RESOURCES_MAP, locale) || RESOURCES_ES;
};

export const getResourcesForTopic = (topicTitle, locale = "es") => {
  const resources = getResources(locale);
  return resources[topicTitle] || null;
};

export const getResourceTypesForTopic = (topicTitle, locale = "es") => {
  const resources = getResources(locale);
  const topic = resources[topicTitle];
  if (!topic) return [];

  const types = new Set();
  topic.resources.forEach((resource) => types.add(resource.type));
  return Array.from(types);
};

export const countResourcesByType = (topicTitle, locale = "es") => {
  const resources = getResources(locale);
  const topic = resources[topicTitle];
  if (!topic) return {};

  const counts = {};
  topic.resources.forEach((resource) => {
    counts[resource.type] = (counts[resource.type] || 0) + 1;
  });
  return counts;
};

export const getResourceDuration = (resource) => {
  if (resource.duration) return resource.duration;
  if (resource.estimatedTime) return resource.estimatedTime;
  return null;
};

export const formatDuration = (duration) => {
  if (!duration) return null;
  return duration;
};

export const formatFileSize = (size) => {
  if (!size) return null;
  return size;
};
