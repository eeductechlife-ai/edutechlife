/**
 * ToolWorkspace — Chrome inmersivo por herramienta (100% presentacional).
 *
 * Envuelve las secciones del módulo (hijos) en el patrón de la herramienta
 * real que enseña el módulo:
 *   - chatgpt     → rail oscuro de conversaciones + hilo + composer flecha
 *   - gemini      → panel de sesiones claro + chips + composer gradiente
 *   - notebooklm  → panel de fuentes azul pálido + hilo + composer
 *
 * Sin lógica de negocio: los hijos se montan exactamente igual; los items
 * del rail solo navegan entre paneles existentes (viewSection). El composer
 * es decorativo (readOnly + botón deshabilitado) y el chip de transparencia
 * (THEME_META.tagline) explica que es una interfaz educativa.
 */
import { useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { toolChromeFor } from "../themes/toolConfig";
import { THEME_META } from "../themes/themeMap";
import { TOOL_LOGOS } from "../IALabModuleHeader";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getModuleOverviewData } from "../constants/moduleContent/selectors";
import { ConversationItem, PromptCard, SendCircle } from "./toolbits";

const CHAT_GLYPH = "M21 12a8 8 0 0 1-8 8H4l1.5-2.5A8 8 0 1 1 21 12Z";
const PLUS_GLYPH = "M12 5v14m-7-7h14";

const TOOL_TITLE_KEY = {
  chatgpt: "ialab.workspace.chatgpt.new_chat",
  gemini: "ialab.workspace.gemini.new_session",
  notebooklm: "ialab.workspace.notebooklm.new_notebook",
};

export default function ToolWorkspace({
  theme,
  activeMod,
  viewSection,
  onNewChat,
  onSelectTopic,
  children,
}) {
  const { t, locale } = useTranslation();
  const cfg = toolChromeFor(theme);
  const meta = THEME_META[theme] || { label: "IA", tagline: "" };
  const Logo = TOOL_LOGOS[theme] || null;
  const [railOpen, setRailOpen] = useState(false);

  if (!cfg) return children;

  const topics = getModuleOverviewData(activeMod, locale)?.topics || [];
  const newChatLabel = t(TOOL_TITLE_KEY[theme] || TOOL_TITLE_KEY.chatgpt);

  const rail = (
    <div
      className="theme-bg-rail theme-border-rail flex h-full w-full flex-col overflow-hidden border"
      data-testid="tool-workspace-rail"
    >
      {/* Cabecera de la herramienta */}
      <div
        className="theme-border-rail flex items-center gap-2.5 border-b px-4 py-3.5"
        data-testid="tool-workspace-brand"
      >
        {Logo && <Logo />}
        <span className="theme-text-rail text-sm font-bold">{cfg.label}</span>
        <span className="theme-chip ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold opacity-80">
          {t("ialab.workspace.simulated")}
        </span>
      </div>

      {/* Nuevo chat / sesión */}
      <button
        type="button"
        onClick={onNewChat}
        className={`theme-rail-hover theme-text-rail mx-3 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current/40 ${
          viewSection === null ? "theme-rail-active" : ""
        }`}
        aria-current={viewSection === null ? "true" : undefined}
      >
        <svg
          className="h-4 w-4"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d={PLUS_GLYPH} />
        </svg>
        {newChatLabel}
      </button>

      {/* Conversaciones / tópicos del módulo */}
      <div className="mt-3 flex-1 overflow-y-auto px-3 pb-3">
        <p className="theme-text-rail-muted px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide">
          {t("ialab.workspace.topics_label")}
        </p>
        <div
          className="flex flex-col gap-0.5"
          data-testid="tool-workspace-topics"
        >
          {topics.map((topic, i) => (
            <ConversationItem
              key={`${topic.title}-${i}`}
              title={topic.title}
              subtitle={topic.duration}
              icon={CHAT_GLYPH}
              active={viewSection === "contenido"}
              onClick={() => onSelectTopic(i)}
            />
          ))}
        </div>
      </div>

      {/* Chip de transparencia */}
      <div className="theme-border-rail border-t p-3">
        <p className="theme-text-rail-muted text-[10.5px] leading-relaxed">
          {meta.tagline}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full gap-5" data-testid={`tool-workspace-${theme}`}>
      {/* Rail desktop */}
      <aside
        aria-label={t("ialab.workspace.rail_label")}
        className="lg:sticky lg:top-8 hidden max-h-[calc(100dvh-11rem)] w-72 flex-shrink-0 self-start lg:block"
      >
        <div className="h-full overflow-hidden rounded-2xl shadow-lg">
          {rail}
        </div>
      </aside>

      {/* Rail móvil (drawer) */}
      <AnimatePresence>
        {railOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setRailOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="h-full w-72 max-w-[85vw]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t("ialab.workspace.rail_label")}
            >
              {rail}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hilo + composer */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <button
          type="button"
          onClick={() => setRailOpen(true)}
          className="theme-composer theme-text-muted flex w-max items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors lg:hidden"
        >
          <span aria-hidden="true">☰</span>
          {newChatLabel}
        </button>
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-5">{children}</div>
        </div>
        <PromptCard
          title={meta.tagline}
          subtitle={t("ialab.workspace.simulated_note")}
          icon="sparkles"
          onClick={undefined}
        />
        <div
          className="sticky bottom-4 z-30"
          data-testid="tool-workspace-composer"
        >
          <div className="theme-composer theme-text mx-auto w-full max-w-3xl rounded-2xl border shadow-xl">
            <label className="sr-only" htmlFor="tool-workspace-input">
              {t("ialab.workspace.composer_label")}
            </label>
            <div className="flex items-end gap-2 p-2 pl-4">
              <input
                id="tool-workspace-input"
                type="text"
                readOnly
                placeholder={`${t("ialab.workspace.composer_placeholder")} ${cfg.label}…`}
                className="w-full bg-transparent py-2 text-sm outline-none disabled:cursor-not-allowed"
              />
              <SendCircle
                iconName={theme === "gemini" ? "sparkles" : "sendArrow"}
                label={t("ialab.workspace.composer_send")}
                disabled
              />
            </div>
            <p className="theme-text-muted border-t border-inherit px-4 pb-2.5 pt-2 text-[10.5px] leading-relaxed">
              {t("ialab.workspace.composer_hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ToolWorkspace.propTypes = {
  theme: PropTypes.oneOf(["default", "chatgpt", "gemini", "notebooklm"])
    .isRequired,
  activeMod: PropTypes.number.isRequired,
  viewSection: PropTypes.string,
  onNewChat: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
