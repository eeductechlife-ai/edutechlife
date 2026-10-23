/**
 * ClaudeRail — Barra lateral estilo Claude para el Módulo 5.
 * Disposición de la barra de Claude: fila superior de íconos, "Nuevo" arriba,
 * filas de navegación compactas con íconos finos, grupo de temas con título
 * pequeño y gris, y pie con la cuenta del curso.
 */
import PropTypes from "prop-types";
import ClaudeLogo from "./ClaudeLogo";
import { ConversationItem } from "./toolbits";

const CHAT_GLYPH = "M21 12a8 8 0 0 1-8 8H4l1.5-2.5A8 8 0 1 1 21 12Z";
const PANEL_GLYPH = "M3 4h18v16H3zM9 4v16";
const NEW_GLYPH = [
  "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  "M12 8v8M8 12h8",
];

// Íconos de la barra de Claude: trazo fino (1.5) y bordes redondeados.
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

const Icon = ({ paths, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
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
};

export default function ClaudeRail({
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
  const rowBase =
    "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[14px] text-[var(--theme-rail-text)] transition-colors hover:bg-[var(--theme-rail-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40";

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[var(--theme-rail-bg)] px-2 pb-2 text-[var(--theme-rail-text)]"
      data-testid="claude-rail"
    >
      {/* Fila superior: logo y botón de panel */}
      <div className="flex h-11 items-center justify-between px-2">
        <ClaudeLogo size={20} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de navegación"
            className="hidden rounded-md p-1 text-[var(--theme-rail-muted)] hover:bg-[var(--theme-rail-hover)] lg:flex"
          >
            <Icon paths={[PANEL_GLYPH]} size={18} />
          </button>
        )}
      </div>

      {/* Nuevo → Inicio del módulo */}
      <button
        type="button"
        onClick={onNewChat}
        aria-current={viewSection === null ? "true" : undefined}
        className={`${rowBase} ${viewSection === null ? "bg-[var(--theme-rail-active)]" : ""}`}
      >
        <Icon paths={NEW_GLYPH} />
        {newChatLabel}
      </button>

      {/* Secciones del módulo */}
      <nav className="mt-1 flex flex-col gap-0.5" data-tour="tour-tabs-rail">
        {sections.map(({ id, label, glyph }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectSection(id)}
            aria-current={viewSection === id ? "true" : undefined}
            data-tour={`tour-section-${id}`}
            className={`${rowBase} ${viewSection === id ? "bg-[var(--theme-rail-active)]" : ""}`}
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
          <p className="px-2 pb-1 text-[12px] text-[var(--theme-rail-muted)]">
            {topicsLabel}
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
      <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--theme-rail-border)] px-2 pt-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)] text-[12px] font-semibold text-white">
          E
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">Edutechlife</p>
          <p className="truncate text-[11px] text-[var(--theme-rail-muted)]">
            {tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

ClaudeRail.propTypes = {
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

ClaudeRail.defaultProps = {
  topics: [],
  sequenceByIndex: new Map(),
};
