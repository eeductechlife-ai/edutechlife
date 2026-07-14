export * from "./metrics.js";
export * from "./standards.js";
export * from "./questions.js";
export * from "./config.js";
export * from "./processes.js";
export * from "./cases.js";

const getData = (locale) =>
  locale === "en"
    ? {
        metrics: METRICS_EN,
        standards: STANDARDS_EN,
        questions: QUESTIONS_EN,
        levels: LEVELS_EN,
        processToSolutions: PROCESS_TO_SOLUTIONS_EN,
        cases: CASES_EN,
        procesosOptions: PROCESOS_OPTIONS_EN,
        industrias: INDUSTRIAS_EN,
        arquitecturasPredefinidas: ARQUITECTURAS_PREDEFINIDAS_EN,
        sectorOptions: SECTOR_OPTIONS_EN,
      }
    : {
        metrics: METRICS_ES,
        standards: STANDARDS_ES,
        questions: QUESTIONS_ES,
        levels: LEVELS_ES,
        processToSolutions: PROCESS_TO_SOLUTIONS_ES,
        cases: CASES_ES,
        procesosOptions: PROCESOS_OPTIONS_ES,
        industrias: INDUSTRIAS_ES,
        arquitecturasPredefinidas: ARQUITECTURAS_PREDEFINIDAS,
        sectorOptions: SECTOR_OPTIONS_ES,
      };

export const getMetrics = (locale) => getData(locale).metrics;
export const getStandards = (locale) => getData(locale).standards;
export const getQuestions = (locale) => getData(locale).questions;
export const getLevels = (locale) => getData(locale).levels;
export const getProcessToSolutions = (locale) =>
  getData(locale).processToSolutions;
export const getCases = (locale) => getData(locale).cases;
export const getProcesosOptions = (locale) => getData(locale).procesosOptions;
export const getIndustrias = (locale) => getData(locale).industrias;
export const getArquitecturasPredefinidas = (locale) =>
  getData(locale).arquitecturasPredefinidas;
export const getSectorOptions = (locale) => getData(locale).sectorOptions;
export const getProcesoIcons = () => PROCESO_ICONS_MAP;
