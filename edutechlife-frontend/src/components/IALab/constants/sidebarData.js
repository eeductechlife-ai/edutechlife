import { modules, modules_en, modules_pt } from "../../../data/ialab";

const SECTION_DATA_ES = {
  videos: {
    id: "videos",
    title: "Videos del Módulo",
    items: [
      {
        id: "video-1",
        title: "Introducción al tema",
        duration: "12:30",
        completed: false,
      },
      {
        id: "video-2",
        title: "Conceptos Avanzados",
        duration: "15:45",
        completed: false,
      },
      {
        id: "video-3",
        title: "Ejemplo Práctico",
        duration: "8:20",
        completed: false,
      },
      { id: "video-4", title: "Resumen", duration: "5:10", completed: false },
    ],
  },
  recursos: {
    id: "recursos",
    title: "Recursos Adicionales",
    items: [
      { id: "recurso-1", title: "Cheat Sheet", type: "pdf", completed: false },
      {
        id: "recurso-2",
        title: "Ejemplos Prácticos",
        type: "code",
        completed: false,
      },
      {
        id: "recurso-3",
        title: "Plantillas Premium",
        type: "doc",
        completed: false,
      },
      {
        id: "recurso-4",
        title: "Casos de Estudio",
        type: "pdf",
        completed: false,
      },
    ],
  },
};

const SECTION_DATA_EN = {
  videos: {
    id: "videos",
    title: "Module Videos",
    items: [
      {
        id: "video-1",
        title: "Introduction to the Topic",
        duration: "12:30",
        completed: false,
      },
      {
        id: "video-2",
        title: "Advanced Concepts",
        duration: "15:45",
        completed: false,
      },
      {
        id: "video-3",
        title: "Practical Example",
        duration: "8:20",
        completed: false,
      },
      { id: "video-4", title: "Summary", duration: "5:10", completed: false },
    ],
  },
  recursos: {
    id: "recursos",
    title: "Additional Resources",
    items: [
      { id: "recurso-1", title: "Cheat Sheet", type: "pdf", completed: false },
      {
        id: "recurso-2",
        title: "Practical Examples",
        type: "code",
        completed: false,
      },
      {
        id: "recurso-3",
        title: "Premium Templates",
        type: "doc",
        completed: false,
      },
      { id: "recurso-4", title: "Case Studies", type: "pdf", completed: false },
    ],
  },
};

const deriveModuleData = (source) =>
  source.map((m) => ({
    id: m.id,
    title: m.title,
    level: m.level,
    progress: 0,
    locked: true,
  }));

const MODULE_DATA_ES = deriveModuleData(modules);
const MODULE_DATA_EN = deriveModuleData(modules_en);

export const COURSE_DATA = {
  duration: modules[0]?.duration || "2h",
  level: modules[0]?.level || "Intermedio",
  rating: "4.8",
  videos: modules.reduce((sum, m) => sum + (m.videos || 0), 0),
  proyectos: modules.reduce((sum, m) => sum + (m.projects || 0), 0),
};

const getData = (locale = "es") =>
  locale === "en"
    ? { section: SECTION_DATA_EN, module: MODULE_DATA_EN }
    : { section: SECTION_DATA_ES, module: MODULE_DATA_ES };

export const getSectionData = (locale) => getData(locale).section;
export const getModuleData = (locale) => getData(locale).module;

// Backward-compatible exports (Spanish)
export const SECTION_DATA = SECTION_DATA_ES;
export const MODULE_DATA = MODULE_DATA_ES;

const SECTION_DATA_PT = {
  videos: {
    id: "videos",
    title: "Vídeos do Módulo",
    items: [
      {
        id: "video-1",
        title: "Introdução ao tema",
        duration: "12:30",
        completed: false,
      },
      {
        id: "video-2",
        title: "Conceitos Avançados",
        duration: "15:45",
        completed: false,
      },
      {
        id: "video-3",
        title: "Exemplo Prático",
        duration: "8:20",
        completed: false,
      },
      { id: "video-4", title: "Resumo", duration: "5:10", completed: false },
    ],
  },
  recursos: {
    id: "recursos",
    title: "Recursos Adicionais",
    items: [
      { id: "recurso-1", title: "Cheat Sheet", type: "pdf", completed: false },
      {
        id: "recurso-2",
        title: "Exemplos Práticos",
        type: "code",
        completed: false,
      },
      {
        id: "recurso-3",
        title: "Modelos Premium",
        type: "doc",
        completed: false,
      },
      {
        id: "recurso-4",
        title: "Estudos de Caso",
        type: "pdf",
        completed: false,
      },
    ],
  },
};

const MODULE_DATA_PT = deriveModuleData(modules_pt);
