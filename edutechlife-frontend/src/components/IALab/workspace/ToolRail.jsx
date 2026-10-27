/**
 * ToolRail — Barra lateral de ChatGPT (módulo 2) y Gemini (módulo 3).
 * Recrea la disposición de cada herramienta real: encabezado con marca y
 * botones de icono, navegación con íconos finos, grupo de temas
 * ("Recientes" en ChatGPT, "Todo" en Gemini) y pie con la cuenta del curso.
 */
import { useId } from "react";
import PropTypes from "prop-types";
import { ConversationItem } from "./toolbits";

const CHAT_GLYPH = "M21 12a8 8 0 0 1-8 8H4l1.5-2.5A8 8 0 1 1 21 12Z";
const SEARCH_GLYPH = [
  "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  "M21 21l-4.3-4.3",
];
// Logo oficial de ChatGPT (mismo trazo que ChatGPTWelcome)
const CHATGPT_LOGO =
  "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.019-1.165a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.687 8.105V12.63a.79.79 0 0 0-.4-.879zm2.01-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.679 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681l-.004 5.574zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5-.005-2.999z";
// Logo de Gemini: estrella de cuatro puntas con el degradado de la marca.
const GEMINI_LOGO =
  "M12 0c0 6.627-5.373 12-12 12 6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z";
// Logo de NotebookLM: arcos apilados en azul (aproximación de la marca).
const NOTEBOOKLM_LOGO =
  "M11.999 3.201C5.372 3.201 0 8.528 0 15.101V20.8h2.212v-.568c0-2.666 2.178-4.827 4.866-4.827 2.688 0 4.866 2.16 4.866 4.827v.568h2.212v-.568c0-3.877-3.17-7.019-7.078-7.019A7.075 7.075 0 0 0 2.992 14.5a7.355 7.355 0 0 1 6.568-4.016c4.057 0 7.347 3.264 7.347 7.287V20.8h2.212V17.77c0-5.235-4.28-9.481-9.56-9.481a9.563 9.563 0 0 0-6.217 2.28A9.795 9.795 0 0 1 12 5.393c5.406 0 9.788 4.346 9.788 9.707V20.8H24V15.1c-.001-6.573-5.373-11.9-12.001-11.9Z";
const PANEL_GLYPH = "M3 4h18v16H3zM9 4v16";
const NEW_GLYPH = [
  "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  "M12 8v8M8 12h8",
];

// Íconos de línea finos, en el mismo estilo de ChatGPT y Gemini.
const SECTION_ICONS = {
  objetivos: [
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    "M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z",
    "M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  ],
  actividades: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  practica: [
    "M20 20h-9",
    "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  ],
  guardados: ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
};

// Colores de cada herramienta (idénticos a la captura de referencia).
const STYLE = {
  chatgpt: {
    bg: "#f9f9f9",
    text: "#0d0d0d",
    muted: "#8f8f8f",
    hover: "#ececec",
    active: "#ececec",
    border: "#e5e5e5",
    radius: "rounded-xl",
    avatar: "#10a37f",
    wordmark: "ChatGPT",
    groupLabel: "Recientes",
    footerAction: "Ver progreso",
  },
  notebooklm: {
    bg: "#f8f9fa",
    text: "#1f1f1f",
    muted: "#5f6368",
    hover: "#e8eaed",
    active: "#e8f0fe",
    border: "#e0e3e8",
    radius: "rounded-lg",
    avatar: "#1a73e8",
    wordmark: "Gemini Notebook",
    groupLabel: "Fuentes",
    footerAction: null,
  },
  gemini: {
    bg: "#ffffff",
    text: "#1f1f1f",
    muted: "#5f6368",
    hover: "#f1f3f4",
    active: "#e8f0fe",
    border: "#e8eaed",
    radius: "rounded-full",
    avatar: "#4285f4",
    wordmark: "Gemini",
    groupLabel: "Todo",
    footerAction: null,
  },
};

const Icon = ({ paths, size = 18, strokeWidth = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

Icon.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default function ToolRail({
  variant,
  newChatLabel,
  topicsLabel,
  tagline,
  sections,
  viewSection,
  onNewChat,
  onSelectSection,
  topics,
  selectedTopicIndex,
  sequenceByIndex,
  onSelectTopic,
  onClose,
}) {
  const s = STYLE[variant];
  // Id único por instancia: el degradado de Gemini no se pinta si su id
  // apunta a una copia oculta del riel de escritorio.
  const gradId = `gemini-logo-grad-${useId().replace(/:/g, "")}`;
  const rowBase = `flex w-full items-center gap-3 px-3 py-2 text-left text-[14px] transition-colors focus:outline-none focus-visible:ring-2 ${s.radius}`;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden px-2 pb-2"
      style={{ background: s.bg, color: s.text }}
      data-testid={`${variant}-rail`}
    >
      {/* Encabezado: marca y botones de icono */}
      <div
        className="flex h-12 items-center gap-2 px-2"
        data-testid={`logo-${variant}`}
      >
        {variant === "chatgpt" && (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={s.text}
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path d={CHATGPT_LOGO} />
          </svg>
        )}
        {variant === "gemini" && (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <defs>
              <linearGradient
                id={gradId}
                x1="0"
                y1="0"
                x2="24"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#4285f4" />
                <stop offset="0.5" stopColor="#9b72cb" />
                <stop offset="1" stopColor="#d96570" />
              </linearGradient>
            </defs>
            <path d={GEMINI_LOGO} fill={`url(#${gradId})`} />
          </svg>
        )}
        {variant === "notebooklm" && (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#1a73e8"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path d={NOTEBOOKLM_LOGO} />
          </svg>
        )}
        <span className="text-[16px] font-semibold">{s.wordmark}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Buscar"
            className="rounded-md p-1.5"
            style={{ color: s.muted }}
          >
            <Icon paths={SEARCH_GLYPH} size={18} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel de navegación"
              className="hidden rounded-md p-1.5 lg:flex"
              style={{ color: s.muted }}
            >
              <Icon paths={[PANEL_GLYPH]} size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Nueva conversación → Inicio del módulo */}
      <button
        type="button"
        onClick={onNewChat}
        aria-current={viewSection === null ? "true" : undefined}
        className={`${rowBase} mt-1`}
        style={{
          background: viewSection === null ? s.active : "transparent",
        }}
      >
        <Icon paths={NEW_GLYPH} />
        {newChatLabel}
      </button>

      {/* Secciones del módulo */}
      <nav className="mt-0.5 flex flex-col gap-0.5" data-tour="tour-tabs-rail">
        {sections.map(({ id, label, glyph }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectSection(id)}
            aria-current={viewSection === id ? "true" : undefined}
            data-tour={`tour-section-${id}`}
            className={rowBase}
            style={{
              background: viewSection === id ? s.active : "transparent",
            }}
          >
            <Icon paths={SECTION_ICONS[id] || [glyph]} />
            {label}
          </button>
        ))}
      </nav>

      {/* Temas del módulo */}
      {topics.length > 0 && (
        <div
          className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto"
          data-testid="tool-workspace-topics"
          data-tour="tour-topics-list"
        >
          <p className="px-3 pb-1 text-[12px]" style={{ color: s.muted }}>
            {topicsLabel || s.groupLabel}
          </p>
          <div className="flex flex-col gap-0.5">
            {topics.map((topic, i) => (
              <ConversationItem
                key={`${topic.title}-${i}`}
                title={topic.title}
                subtitle={topic.duration}
                icon={CHAT_GLYPH}
                active={viewSection === "contenido" && selectedTopicIndex === i}
                completed={sequenceByIndex.get(i)?.isCompleted}
                locked={
                  sequenceByIndex.has(i)
                    ? !sequenceByIndex.get(i).isUnlocked
                    : false
                }
                onClick={() => onSelectTopic(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pie: cuenta del curso */}
      <div
        className="mt-auto flex items-center gap-2.5 border-t px-2 pt-3"
        style={{ borderColor: s.border }}
      >
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
          style={{ background: s.avatar }}
        >
          E
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">Edutechlife</p>
          <p className="truncate text-[11px]" style={{ color: s.muted }}>
            {tagline}
          </p>
        </div>
        {s.footerAction && (
          <span
            className="rounded-full border px-2.5 py-1 text-[12px] font-medium"
            style={{ borderColor: s.border }}
          >
            {s.footerAction}
          </span>
        )}
      </div>
    </div>
  );
}

ToolRail.propTypes = {
  variant: PropTypes.oneOf(["chatgpt", "gemini", "notebooklm"]).isRequired,
  newChatLabel: PropTypes.string.isRequired,
  topicsLabel: PropTypes.string,
  tagline: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      glyph: PropTypes.string.isRequired,
    }),
  ).isRequired,
  viewSection: PropTypes.string,
  onNewChat: PropTypes.func.isRequired,
  onSelectSection: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  selectedTopicIndex: PropTypes.number,
  sequenceByIndex: PropTypes.instanceOf(Map),
  onSelectTopic: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

ToolRail.defaultProps = {
  topics: [],
  sequenceByIndex: new Map(),
};
