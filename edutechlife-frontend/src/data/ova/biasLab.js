import * as esData from "./biasLab.es.jsx";
import * as enData from "./biasLab.en.jsx";

const locale =
  typeof window !== "undefined" && typeof localStorage !== "undefined"
    ? localStorage.getItem("edutechlife_locale") || "es"
    : "es";

const data = locale === "en" ? enData : esData;

export const contentData = data.contentData;
export const gameData = data.gameData;
export const learningObjectives = data.learningObjectives;

export const moduleContext =
  "Comprender los fundamentos éticos de la IA, identificar sesgos algorítmicos y aplicar principios de uso responsable.";
