import { motion } from "framer-motion";

const WELCOME_CONFIG = {
  1: {
    accentColor: "#b45309",
    accentRing: "focus-visible:ring-[#b45309]/40",
    iconPath:
      "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    iconBg: "linear-gradient(135deg,#92400e,#b45309,#f59e0b)",
    heading: "¿Qué forjamos hoy?",
    subtitle:
      "Módulo 1 · Artesano Digital — construye tus primeras instrucciones con precisión artesanal",
    cards: [
      {
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
        label: "Mi ruta de hoy",
        desc: "Tu plan de aprendizaje personalizado",
        action: "plan",
      },
      {
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
        label: "Contenido del módulo",
        desc: "Videos, PDFs y recursos interactivos",
        action: "contenido",
      },
      {
        icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
        label: "Primer prompt",
        desc: "Crea tu primera instrucción artesanal",
        action: "actividades",
      },
      {
        icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
        label: "Práctica guiada",
        desc: "Ejercicios paso a paso de prompts",
        action: "practica",
      },
    ],
  },
  5: {
    accentColor: "#1e40af",
    accentRing: "focus-visible:ring-[#1e40af]/40",
    iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    iconBg: "linear-gradient(135deg,#1e3a5f,#1e40af,#3b82f6)",
    heading: "¿Qué protegemos hoy?",
    subtitle:
      "Módulo 5 · Guardián Digital — explora el uso ético e inteligente de la IA",
    cards: [
      {
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
        label: "Mi ruta de hoy",
        desc: "Tu plan de aprendizaje personalizado",
        action: "plan",
      },
      {
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
        label: "Contenido del módulo",
        desc: "Videos, PDFs y recursos interactivos",
        action: "contenido",
      },
      {
        icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
        label: "Principios éticos",
        desc: "Guías de uso responsable de la IA",
        action: "actividades",
      },
      {
        icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
        label: "Práctica guiada",
        desc: "Casos prácticos de ética en IA",
        action: "practica",
      },
    ],
  },
};

export default function DefaultModuleWelcome({ activeMod, onSelectSection }) {
  const cfg = WELCOME_CONFIG[activeMod];
  if (!cfg) return null;

  const handleClick = (action) => {
    if (action === "plan") {
      document
        .querySelector("[data-tour='tour-ruta']")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      onSelectSection(action);
    }
  };

  return (
    <motion.div
      key={`default-welcome-${activeMod}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl pt-8 pb-4"
    >
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: cfg.iconBg }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={cfg.iconPath} />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold theme-text">
          {cfg.heading}
        </h2>
        <p className="text-sm theme-text-muted max-w-sm">{cfg.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cfg.cards.map(({ icon, label, desc, action }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleClick(action)}
            className={`theme-prompt-card group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 ${cfg.accentRing}`}
          >
            <span className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl theme-chip flex items-center justify-center">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={icon} />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold theme-text leading-snug">
                {label}
              </p>
              <p className="text-xs theme-text-muted mt-0.5 leading-snug">
                {desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
