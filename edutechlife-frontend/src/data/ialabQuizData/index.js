import { MODULE_1 } from "./module1";
import { MODULE_2 } from "./module2";
import { MODULE_3 } from "./module3";
import { MODULE_4 } from "./module4";
import { MODULE_5 } from "./module5";
import { MODULE_1_EN } from "./module1.en";
import { MODULE_2_EN } from "./module2.en";
import { MODULE_3_EN } from "./module3.en";
import { MODULE_4_EN } from "./module4.en";
import { MODULE_5_EN } from "./module5.en";
import { MODULE_1_PT } from "./module1.pt";
import { MODULE_2_PT } from "./module2.pt";
import { MODULE_3_PT } from "./module3.pt";
import { MODULE_4_PT } from "./module4.pt";
import { MODULE_5_PT } from "./module5.pt";

export const MODULE_EXAMS = {
  1: MODULE_1,
  2: MODULE_2,
  3: MODULE_3,
  4: MODULE_4,
  5: MODULE_5,
};

export const MODULE_EXAMS_EN = {
  1: MODULE_1_EN,
  2: MODULE_2_EN,
  3: MODULE_3_EN,
  4: MODULE_4_EN,
  5: MODULE_5_EN,
};

export const MODULE_EXAMS_PT = {
  1: MODULE_1_PT,
  2: MODULE_2_PT,
  3: MODULE_3_PT,
  4: MODULE_4_PT,
  5: MODULE_5_PT,
};

export function getModuleExams(locale) {
  if (locale && locale.startsWith("pt")) {
    return MODULE_EXAMS_PT;
  }
  if (locale && locale.startsWith("en")) {
    return MODULE_EXAMS_EN;
  }
  return MODULE_EXAMS;
}
