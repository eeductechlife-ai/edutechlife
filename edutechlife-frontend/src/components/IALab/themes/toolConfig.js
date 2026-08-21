/**
 * toolConfig — Fuente única de verdad del chrome visual de cada herramienta.
 *
 * Cada módulo del curso simula la herramienta real que enseña:
 *   Módulo 2 → chatgpt    (ChatGPT: rail oscuro #171717, verde #10a37f, Inter)
 *   Módulo 3 → gemini     (Gemini: blanco Material, azul Google, gradiente 3 colores)
 *   Módulo 4 → notebooklm (NotebookLM: azul profundo + amber Studio)
 *
 * Aquí viven SOLO valores visuales. La lógica de negocio (locks, progreso,
 * evaluación) no depende de este archivo. Los componentes consumen estos
 * valores vía CSS custom properties (themes.css) o importándolos directo.
 */

export const TOOL_CHROME_CONFIG = {
  chatgpt: {
    label: "ChatGPT",
    /* Banner del módulo */
    headerBg: "linear-gradient(135deg, #343541 0%, #2f2f2f 100%)",
    badgeBg: "rgba(16,163,127,0.15)",
    badgeColor: "#10a37f",
    badgeBorder: "rgba(16,163,127,0.4)",
    progressBarColor: "#10a37f",
    /* Rail de conversaciones (sidebar simulada) */
    railBg: "#171717",
    railHeaderBg: "#171717",
    railHover: "#2f2f2f",
    railActiveBg: "#2f2f2f",
    railText: "#ececec",
    railTextMuted: "#9b9ba3",
    railBorder: "rgba(255,255,255,0.08)",
    railNewChatBg: "#2f2f2f",
    railNewChatText: "#ffffff",
    /* Composer */
    composerBg: "#ffffff",
    composerBorder: "#d9d9e3",
    composerPlaceholder: "#9b9ba3",
    sendBg: "#10a37f",
    sendHover: "#0d8b6c",
    /* Superficies del hilo */
    chipBg: "#ececec",
    chipText: "#0d0d0d",
    msgUserBg: "#ececec",
    msgUserText: "#0d0d0d",
    msgAssistantBg: "#ffffff",
    msgAssistantText: "#0d0d0d",
    promptCardBg: "#ffffff",
    promptCardBorder: "#d9d9e3",
    promptCardHoverBg: "#f7f7f8",
    subtle: "#f7f7f8",
  },
  gemini: {
    label: "Gemini",
    /* Banner del módulo */
    headerBg: "linear-gradient(135deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)",
    badgeBg: "rgba(255,255,255,0.2)",
    badgeColor: "#ffffff",
    badgeBorder: "rgba(255,255,255,0.4)",
    progressBarColor: "#ffffff",
    /* Panel de sesiones */
    railBg: "#ffffff",
    railHeaderBg: "#ffffff",
    railHover: "#f1f3f4",
    railActiveBg: "#e8f0fe",
    railText: "#1f1f1f",
    railTextMuted: "#5f6368",
    railBorder: "#e8eaed",
    railNewChatBg: "#f1f3f4",
    railNewChatText: "#1f1f1f",
    /* Composer */
    composerBg: "#ffffff",
    composerBorder: "#dadce0",
    composerPlaceholder: "#5f6368",
    sendBg: "linear-gradient(135deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)",
    sendHover: "linear-gradient(135deg, #3b78e7 0%, #8f63c4 50%, #cf5863 100%)",
    /* Superficies */
    primary: "#1a73e8",
    primaryGradient:
      "linear-gradient(135deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)",
    chipBg: "#f1f3f4",
    chipText: "#1f1f1f",
    msgUserBg: "transparent",
    msgUserText: "#1f1f1f",
    msgAssistantBg: "#ffffff",
    msgAssistantText: "#1f1f1f",
    promptCardBg: "#ffffff",
    promptCardBorder: "#e0e7f5",
    promptCardHoverBg: "#f8f9ff",
    subtle: "#f8f9ff",
  },
  notebooklm: {
    label: "NotebookLM",
    /* Banner del módulo */
    headerBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #1d4ed8 100%)",
    badgeBg: "rgba(245,158,11,0.15)",
    badgeColor: "#fbbf24",
    badgeBorder: "rgba(245,158,11,0.4)",
    progressBarColor: "#fbbf24",
    /* Panel de fuentes */
    railBg: "#f8f9fd",
    railHeaderBg: "#f8f9fd",
    railHover: "#e8f0fe",
    railActiveBg: "#e8f0fe",
    railText: "#202124",
    railTextMuted: "#5f6368",
    railBorder: "#dce3f5",
    railNewChatBg: "#1e40af",
    railNewChatText: "#ffffff",
    /* Composer del notebook */
    composerBg: "#ffffff",
    composerBorder: "#dadce0",
    composerPlaceholder: "#5f6368",
    sendBg: "#1e40af",
    sendHover: "#1e3a8a",
    /* Superficies */
    primary: "#1e40af",
    amber: "#f59e0b",
    amberSoft: "#fbbf24",
    chipBg: "#e8f0fe",
    chipText: "#1e40af",
    msgUserBg: "transparent",
    msgUserText: "#202124",
    msgAssistantBg: "#ffffff",
    msgAssistantText: "#202124",
    promptCardBg: "#ffffff",
    promptCardBorder: "#dce3f5",
    promptCardHoverBg: "#f1f5ff",
    subtle: "#eef2fb",
  },
};

/**
 * Devuelve el chrome config para un nombre de tema.
 * Cualquier tema desconocido cae en null (sin chrome inmersivo).
 * @param {string} theme
 */
export function toolChromeFor(theme) {
  return TOOL_CHROME_CONFIG[theme] || null;
}

/**
 * Íconos SVG auténticos de marca para acciones clave.
 * Solo path-data: los componentes SVG viven en workspace/toolbits.jsx.
 */
export const TOOL_BRAND_ICONS = {
  /* Flecha de enviar estilo ChatGPT (trazo circular, feather) */
  sendArrow: "M12 19V5m-7 7 7-7 7 7",
  /* Destello Gemini (sparkles 4 puntas) */
  sparkles:
    "M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8M8.4 15.6l-2.8 2.8",
  /* Cuaderno NotebookLM */
  notebook:
    "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M8 8h8M8 12h5",
  mic: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z m5 9a5 5 0 0 1-10 0",
  paperclip:
    "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",
};
