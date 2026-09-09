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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toolChromeFor } from "../themes/toolConfig";
import { THEME_META } from "../themes/themeMap";
import { TOOL_LOGOS } from "../IALabModuleHeader";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getModuleOverviewData } from "../constants/moduleContent/selectors";
import { ConversationItem } from "./toolbits";
import NotebookLMWelcome from "./NotebookLMWelcome";
import GeminiWelcome from "./GeminiWelcome";
import ChatGPTWelcome from "./ChatGPTWelcome";

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
  selectedTopicIndex,
  onNewChat,
  onSelectTopic,
  onSelectSection,
  children,
}) {
  const { t, locale } = useTranslation();
  const cfg = toolChromeFor(theme);
  const meta = THEME_META[theme] || { label: "IA", tagline: "" };
  const Logo = TOOL_LOGOS[theme] || null;
  const [railOpen, setRailOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const overview = getModuleOverviewData(activeMod, locale);
  const topics = overview?.topics || [];

  if (!cfg) return children;
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
        className={`theme-rail-hover theme-text-rail mx-2 mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current/40 ${
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

      {/* Navegación del rail */}
      <div className="mt-2 flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
        {/* Secciones primero — estilo ChatGPT sidebar items */}
        {[
          {
            id: "objetivos",
            label: t("ialab.tab_objectives") || "Objetivos",
            glyph:
              "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
          },
          {
            id: "actividades",
            label: t("ialab.tab_activities") || "Actividades",
            glyph: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
          },
          {
            id: "practica",
            label: t("ialab.tab_practice") || "Práctica",
            glyph:
              "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
          },
          {
            id: "guardados",
            label: t("ialab.tab_bookmarks") || "Guardados",
            glyph: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
          },
        ].map(({ id, label, glyph }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectSection(id)}
            aria-current={viewSection === id ? "true" : undefined}
            className={`theme-rail-hover theme-text-rail w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current/40 ${
              viewSection === id ? "theme-rail-active" : ""
            }`}
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={glyph} />
            </svg>
            {label}
          </button>
        ))}

        {/* Divisor */}
        {topics.length > 0 && (
          <div className="my-1 mx-2 h-px bg-current opacity-10" />
        )}

        {/* Temas del módulo */}
        {topics.length > 0 && (
          <div
            className="flex flex-col gap-0.5"
            data-testid="tool-workspace-topics"
          >
            <p className="theme-text-rail-muted px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide">
              {t("ialab.workspace.topics_label")}
            </p>
            {topics.map((topic, i) => (
              <ConversationItem
                key={`${topic.title}-${i}`}
                title={topic.title}
                subtitle={topic.duration}
                icon={CHAT_GLYPH}
                active={viewSection === "contenido" && selectedTopicIndex === i}
                onClick={() => onSelectTopic(i)}
              />
            ))}
          </div>
        )}
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
      {/* Rail desktop — oculto en notebooklm y gemini-welcome (tienen nav propia) */}
      {theme !== "notebooklm" && !(theme === "gemini" && viewSection === null) && (
        <aside
          aria-label={t("ialab.workspace.rail_label")}
          className="lg:sticky lg:top-8 hidden max-h-[calc(100dvh-11rem)] w-72 flex-shrink-0 self-start lg:block"
        >
          <div className="h-full overflow-hidden rounded-2xl shadow-lg">
            {rail}
          </div>
        </aside>
      )}

      {/* Rail móvil (drawer) — oculto en notebooklm y gemini-welcome */}
      {theme !== "notebooklm" && !(theme === "gemini" && viewSection === null) && (
        <AnimatePresence>
          {railOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setRailOpen(false)}
            >
              <motion.div
                initial={{ x: shouldReduceMotion ? 0 : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: shouldReduceMotion ? 0 : "-100%" }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 34 }
                }
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
      )}

      {/* Hilo + composer */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {theme !== "notebooklm" && !(theme === "gemini" && viewSection === null) && (
          <button
            type="button"
            onClick={() => setRailOpen(true)}
            className="theme-composer theme-text-muted flex w-max items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors lg:hidden"
          >
            <span aria-hidden="true">☰</span>
            {newChatLabel}
          </button>
        )}

        {/* Pantalla de bienvenida estilo Gemini — solo cuando no hay sección activa */}
        {theme === "gemini" && viewSection === null && (
          <GeminiWelcome
            topics={topics}
            description={overview?.description}
            onSelectSection={onSelectSection}
            onSelectTopic={onSelectTopic}
          />
        )}

        {/* Pantalla de bienvenida estilo NotebookLM — solo cuando no hay sección activa */}
        {theme === "notebooklm" && viewSection === null && (
          <NotebookLMWelcome
            topics={topics}
            onSelectSection={onSelectSection}
            onSelectTopic={onSelectTopic}
          />
        )}

        {/* Pantalla de bienvenida estilo ChatGPT — solo cuando no hay sección activa */}
        {theme === "chatgpt" && viewSection === null && (
          <ChatGPTWelcome
            topics={topics}
            onSelectSection={onSelectSection}
            onSelectTopic={onSelectTopic}
          />
        )}

        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-5">{children}</div>
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
  selectedTopicIndex: PropTypes.number,
  onNewChat: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
  onSelectSection: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
