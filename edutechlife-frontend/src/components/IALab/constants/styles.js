/* Paletas de herramienta derivadas de la fuente única de verdad
   (themes/toolConfig.js) para no duplicar valores. */
import { TOOL_CHROME_CONFIG } from "../themes/toolConfig";

export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 transition-all";

export const GLASS_CARD =
  "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-corporate/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)]";

export const GLASS_LIGHT = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md";

export const GRADIENT_SUBTLE =
  "bg-gradient-to-br from-petroleum/10 to-corporate/10";

export const GRADIENT_PRIMARY = "bg-gradient-to-r from-petroleum to-corporate";

export const GRADIENT_PRIMARY_BR =
  "bg-gradient-to-br from-petroleum to-corporate";

export const GRADIENT_BUTTON =
  "bg-gradient-to-r from-corporate to-petroleum-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all";

export const GRADIENT_SUCCESS =
  "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all";

export const PROGRESS_BAR_FILL =
  "h-full bg-gradient-to-r from-petroleum to-corporate rounded-full";

export const MODAL_CONTAINER =
  "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden";

export const STICKY_HEADER =
  "sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm";

export const TOUCH_TARGET_MIN =
  "min-w-[44px] min-h-[44px] flex items-center justify-center";

export const CHATGPT_COLORS = (() => {
  const cfg = TOOL_CHROME_CONFIG.chatgpt;
  return {
    primary: cfg.sendBg,
    background: cfg.railBg,
    surface: cfg.subtle,
    text: "#ffffff",
    accent: cfg.sendBg,
    border: cfg.composerBorder,
  };
})();

export const CHATGPT_BUTTON_STYLES = {
  primary: "bg-[#10a37f] text-white hover:bg-[#0d0d0d] shadow-[#10a37f]/30",
  secondary:
    "bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-[#0d0d0d] dark:hover:border-slate-100",
  ghost:
    "text-slate-600 dark:text-slate-300 hover:text-[#0d0d0d] dark:hover:text-slate-100",
};

export const CHATGPT_CARD_STYLES = {
  container:
    "bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-600",
  header: "bg-[#0d0d0d] text-white rounded-2xl p-6 md:p-8 shadow-2xl",
  modal: "bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl",
};

export const GEMINI_COLORS = (() => {
  const cfg = TOOL_CHROME_CONFIG.gemini;
  return {
    primary: cfg.primary,
    background: "#ffffff",
    bgLight: cfg.subtle,
    researchTypes: {
      image: "#4285f4",
      factcheck: "#d96570",
      deep: "#1a73e8",
    },
  };
})();

export const NOTEBOOKLM_COLORS = (() => {
  const cfg = TOOL_CHROME_CONFIG.notebooklm;
  return {
    primary: cfg.primary,
    secondary: cfg.amberSoft,
    lightGray: "#f3f4f6",
    background: cfg.subtle,
    darkBackground: "#121212",
    confetti: ["#1e40af", "#fbbf24", "#f3f4f6"],
  };
})();
