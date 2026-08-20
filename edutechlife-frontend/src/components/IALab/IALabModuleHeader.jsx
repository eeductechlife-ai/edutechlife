import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useIALabProgressContext } from "../../context/IALabContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { useIALabTheme } from "./themes/ThemeProvider";
import LevelBadge from "./LevelBadge";

const progressToLevel = (progress = 0) => {
  if (progress <= 0) return 0;
  if (progress < 25) return 1;
  if (progress < 50) return 2;
  if (progress < 75) return 3;
  return 4;
};

/* ─── SVG logos auténticos de cada herramienta ─────────────────────────── */

/** OpenAI / ChatGPT — forma de flor/estrella hexagonal de OpenAI */
const ChatGPTLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="no-theme-stroke"
    aria-hidden="true"
  >
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.019-1.165a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.687 8.105V12.63a.79.79 0 0 0-.4-.879zm2.01-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.679 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681l-.004 5.574zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5-.005-2.999z" />
  </svg>
);

/** Google Gemini — la estrella de 4 puntas con gradiente icónico */
const GeminiLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    className="no-theme-stroke"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gemini-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="50%" stopColor="#9b72cb" />
        <stop offset="100%" stopColor="#d96570" />
      </linearGradient>
    </defs>
    {/* Estrella de 4 puntas: forma icónica de Gemini */}
    <path
      d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
      fill="url(#gemini-logo-grad)"
    />
  </svg>
);

/** Google NotebookLM — cuaderno con líneas y marcador azul */
const NotebookLMLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    className="no-theme-stroke"
    aria-hidden="true"
  >
    {/* Tapa exterior del cuaderno */}
    <rect x="3" y="2" width="15" height="20" rx="2" fill="#1e40af" />
    {/* Espiral/lomo lateral */}
    <rect x="2" y="2" width="3" height="20" rx="1" fill="#1e3a8a" />
    {/* Líneas de texto */}
    <line
      x1="8"
      y1="8"
      x2="16"
      y2="8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="11"
      x2="16"
      y2="11"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="14"
      x2="13"
      y2="14"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Marcador/resaltador amber — característica de NotebookLM */}
    <rect x="14" y="12" width="7" height="10" rx="1" fill="#f59e0b" />
    <rect x="15" y="10" width="5" height="3" rx="1" fill="#fbbf24" />
    <line
      x1="16.5"
      y1="15"
      x2="16.5"
      y2="20"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    <line
      x1="18.5"
      y1="15"
      x2="18.5"
      y2="20"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

/* ─── Configuración visual por herramienta ───────────────────────────────── */
const TOOL_CONFIG = {
  chatgpt: {
    headerBg: "linear-gradient(135deg, #343541 0%, #2f2f2f 100%)",
    badgeBg: "rgba(16,163,127,0.15)",
    badgeColor: "#10a37f",
    badgeBorder: "rgba(16,163,127,0.4)",
    badgeLabel: "ChatGPT",
    Logo: ChatGPTLogo,
    progressBarColor: "#10a37f",
  },
  gemini: {
    headerBg: "linear-gradient(135deg, #4285f4 0%, #9b72cb 55%, #d96570 100%)",
    badgeBg: "rgba(255,255,255,0.18)",
    badgeColor: "#ffffff",
    badgeBorder: "rgba(255,255,255,0.4)",
    badgeLabel: "Gemini",
    Logo: GeminiLogo,
    progressBarColor: "#ffffff",
  },
  notebooklm: {
    headerBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #1d4ed8 100%)",
    badgeBg: "rgba(245,158,11,0.18)",
    badgeColor: "#fbbf24",
    badgeBorder: "rgba(245,158,11,0.45)",
    badgeLabel: "NotebookLM",
    Logo: NotebookLMLogo,
    progressBarColor: "#fbbf24",
  },
  default: {
    headerBg: null,
    badgeBg: null,
    badgeColor: null,
    badgeBorder: null,
    badgeLabel: null,
    Logo: null,
    progressBarColor: "#ffffff",
  },
};

/* ─── Componente ─────────────────────────────────────────────────────────── */
const IALabModuleHeader = () => {
  const { t } = useTranslation();
  const { activeMod, modules, courseProgress } = useIALabProgressContext();
  const { theme } = useIALabTheme();
  const curr = modules.find((m) => m.id === activeMod) || modules[0];
  const moduleProgress = Math.round(curr?.progress ?? 0);
  const level = progressToLevel(curr?.progress ?? courseProgress);
  const tool = TOOL_CONFIG[theme] || TOOL_CONFIG.default;
  const { Logo } = tool;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl shadow-md border theme-border overflow-hidden"
      style={{ background: "var(--theme-surface)" }}
    >
      {/* Banner principal */}
      <div
        className={
          !tool.headerBg
            ? "theme-bg-emphasis py-3 px-4 md:py-3.5 md:px-4 lg:py-4 lg:px-5"
            : "py-3 px-4 md:py-3.5 md:px-4 lg:py-4 lg:px-5"
        }
        style={tool.headerBg ? { background: tool.headerBg } : undefined}
      >
        <div className="flex items-center gap-2.5">
          {/* Número de módulo */}
          <div className="w-10 h-10 md:w-11 md:h-11 bg-white/15 rounded-full flex flex-col items-center justify-center shadow-inner flex-shrink-0">
            <div className="text-base md:text-lg font-bold text-white leading-none">
              {activeMod}
            </div>
            <div className="text-[8px] font-semibold text-white/70 uppercase tracking-wide leading-none mt-0.5">
              {t("ialab.module_header.module")}
            </div>
          </div>

          {/* Título */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight font-montserrat truncate">
              {curr?.title}
            </h1>
          </div>

          {/* Badge de herramienta con logo SVG auténtico */}
          {tool.badgeLabel && Logo && (
            <div
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border backdrop-blur-sm"
              style={{
                background: tool.badgeBg,
                color: tool.badgeColor,
                borderColor: tool.badgeBorder,
              }}
            >
              <Logo />
              <span>{tool.badgeLabel}</span>
            </div>
          )}

          <LevelBadge
            level={level}
            size="sm"
            compact
            showStars
            className="flex-shrink-0"
          />
        </div>

        {/* Barra de progreso */}
        <div className="mt-2 md:mt-2.5">
          <div className="w-full h-1 md:h-1.5 bg-white/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: tool.progressBarColor }}
              initial={{ width: 0 }}
              animate={{ width: `${moduleProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

IALabModuleHeader.propTypes = {
  onAction: PropTypes.func,
};

export default IALabModuleHeader;
