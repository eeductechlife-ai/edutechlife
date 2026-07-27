import * as esData from "./notebookSim.es.js";
import * as enData from "./notebookSim.en.js";

const locale =
  typeof window !== "undefined" && typeof localStorage !== "undefined"
    ? localStorage.getItem("edutechlife_locale") || "es"
    : "es";

const data = locale === "en" ? enData : esData;

export const { contentScreens, questionsData, learningObjectives } = data;

export const moduleContext =
  "Simular el uso de NotebookLM para practicar la carga, análisis y síntesis de información con fuentes propias.";
