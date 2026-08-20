/**
 * Mapeo módulo → tema visual inmersivo.
 *
 * Cada módulo educativo adopta el look & feel de la herramienta real
 * que enseña, para que el estudiante se familiarice con la interfaz
 * antes de usar la herramienta en producción.
 *
 * Módulo 1 → default    (Edutechlife, fundamentos genéricos)
 * Módulo 2 → chatgpt    (ChatGPT: verde signature, Söhne/Inter)
 * Módulo 3 → gemini     (Gemini: azul Google, Google Sans, gradiente)
 * Módulo 4 → notebooklm (NotebookLM: azul profundo + amber podcast)
 * Módulo 5 → ethics     (Editorial serio: rojo + amber)
 *
 * Cualquier ID no reconocido cae en 'default' — nunca romper la UI.
 */

export const THEME_NAMES = /** @type {const} */ ([
  "default",
  "chatgpt",
  "gemini",
  "notebooklm",
]);

// El módulo 5 (Ética) usa el tema `default`: el rojo se reserva para
// estados de error del sistema (perder actividad, validación fallida),
// no para pintar UI base.
const MODULE_TO_THEME = {
  1: "default",
  2: "chatgpt",
  3: "gemini",
  4: "notebooklm",
  5: "default",
};

/**
 * Devuelve el nombre de tema para un módulo dado.
 * @param {number|string|null|undefined} moduleId
 * @returns {"default"|"chatgpt"|"gemini"|"notebooklm"}
 */
export function mapModuleToTheme(moduleId) {
  const id = Number(moduleId);
  if (!Number.isFinite(id)) return "default";
  return MODULE_TO_THEME[id] || "default";
}

/**
 * Metadata legible por tema (para tooltips, banners informativos
 * "Interfaz educativa inspirada en X", telemetría, etc.).
 */
export const THEME_META = {
  default: {
    label: "Edutechlife",
    inspiredBy: null,
    tagline: "Fundamentos de IA generativa",
  },
  chatgpt: {
    label: "ChatGPT",
    inspiredBy: "OpenAI ChatGPT",
    tagline: "Diseño inspirado en ChatGPT para que domines la herramienta real",
  },
  gemini: {
    label: "Gemini",
    inspiredBy: "Google Gemini",
    tagline: "Diseño inspirado en Gemini para que domines la herramienta real",
  },
  notebooklm: {
    label: "NotebookLM",
    inspiredBy: "Google NotebookLM",
    tagline: "Diseño inspirado en NotebookLM para que domines la herramienta real",
  },
};
