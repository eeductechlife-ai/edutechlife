import { RESOURCES_ES } from "./resourcesEs";
import { RESOURCES_EN } from "./resourcesEn";
import { RESOURCES_PT } from "./resourcesPt";
import { resolveLocalized } from "../../../../utils/localeUtils";
import {
  RESOURCE_TYPE_CONFIG,
  getResourceColor,
  getResourceIcon,
} from "./resourceTypeConfig";
import {
  getResourcesForTopic,
  getResourceTypesForTopic,
  countResourcesByType,
  getResourceDuration,
  formatDuration,
  formatFileSize,
} from "./helpers";

export {
  RESOURCES_ES,
  RESOURCES_EN,
  RESOURCES_PT,
  RESOURCE_TYPE_CONFIG,
  getResourceColor,
  getResourceIcon,
  getResourcesForTopic,
  getResourceTypesForTopic,
  countResourcesByType,
  getResourceDuration,
  formatDuration,
  formatFileSize,
};

export const moduleResources = RESOURCES_ES;
export default moduleResources;
