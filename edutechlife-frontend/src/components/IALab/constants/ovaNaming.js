import { OVA_REGISTRY } from "./ovaRegistry";

export { OVA_REGISTRY };
export const MODULE_PRINCIPLES = {
  1: {
    role: {
      es: "El Artesano Digital",
      en: "The Digital Artisan",
      pt: "O Artesão Digital",
    },
    principle: "Precisión",
    principleLine: "Una instrucción precisa transforma el resultado",
  },
  2: {
    role: {
      es: "El Arquitecto de Automatización",
      en: "The Automation Architect",
      pt: "O Arquiteto de Automação",
    },
    principle: "Estructura",
    principleLine: "Lo que se diseña bien se automatiza mejor",
  },
  3: {
    role: {
      es: "El Detective de Datos",
      en: "The Data Detective",
      pt: "O Detetive de Dados",
    },
    principle: "Evidencia",
    principleLine: "Solo lo verificado es conocimiento",
  },
  4: {
    role: {
      es: "El Alquimista del Conocimiento",
      en: "The Knowledge Alchemist",
      pt: "O Alquimista do Conhecimento",
    },
    principle: "Síntesis",
    principleLine: "Todo documento puede transmutarse en conocimiento",
  },
  5: {
    role: {
      es: "El Director de Orquesta",
      en: "The Conductor",
      pt: "O Maestro",
    },
    principle: "Criterio",
    principleLine: "Delegar no es desentenderse",
  },
};

export const METHODOLOGY_PRINCIPLES = [
  {
    id: "vak",
    name: { es: "Brújula VAK", en: "VAK Compass", pt: "Bússola VAK" },
    principle: "Personalización",
  },
  {
    id: "steam",
    name: { es: "Enfoque STEAM", en: "STEAM Approach", pt: "Abordagem STEAM" },
    principle: "Integración",
  },
  {
    id: "abr",
    name: { es: "Método Reto", en: "Challenge Method", pt: "Método Desafio" },
    principle: "Aplicación",
  },
  {
    id: "neuro",
    name: {
      es: "Diseño Neurocognitivo",
      en: "Neurocognitive Design",
      pt: "Design Neurocognitivo",
    },
    principle: "Retención",
  },
  {
    id: "max",
    name: {
      es: "Acompañamiento MAX",
      en: "MAX Companionship",
      pt: "Acompanhamento MAX",
    },
    principle: "Acompañamiento",
  },
  {
    id: "gamification",
    name: {
      es: "Motor de Progreso",
      en: "Progress Engine",
      pt: "Motor de Progresso",
    },
    principle: "Motivación",
  },
  {
    id: "edutechlife",
    name: {
      es: "Ruta Edutechlife",
      en: "Edutechlife Path",
      pt: "Rota Edutechlife",
    },
    principle: "Progresión",
  },
];

export function getOvaByCode(code) {
  return OVA_REGISTRY.find((o) => o.code === code) || null;
}
export function getOvaByResourceId(resourceId) {
  return OVA_REGISTRY.find((o) => o.resourceId === resourceId) || null;
}
// «reserve»: OVA fuera de los temas por la regla 1 video + 1 PDF + 1 OVA; conserva id y componente.
export function getActiveOvas() {
  return OVA_REGISTRY.filter((o) => o.status === "active");
}
