import { RESOURCES_ES } from "./resourcesEs";
import { RESOURCES_EN } from "./resourcesEn";
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
