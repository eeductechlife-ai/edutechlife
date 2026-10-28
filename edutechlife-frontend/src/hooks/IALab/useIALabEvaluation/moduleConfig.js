import { MODULE_CONFIG_PART1 } from "./moduleConfig.part1";
import { MODULE_CONFIG_PART2 } from "./moduleConfig.part2";
import { MODULE_CONFIG_PART3 } from "./moduleConfig.part3";
import { MODULE_CONFIG_PART4 } from "./moduleConfig.part4";

const MODULE_CONFIG = {
  ...MODULE_CONFIG_PART1,
  ...MODULE_CONFIG_PART2,
  ...MODULE_CONFIG_PART3,
  ...MODULE_CONFIG_PART4,
};

export { MODULE_CONFIG };
