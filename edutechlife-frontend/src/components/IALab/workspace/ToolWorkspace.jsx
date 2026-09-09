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

        {/* Pantalla de bienvenida estilo Gemini — solo cuando no hay sección activa */}
        {theme === "gemini" && viewSection === null && (
          <motion.div
            key="gemini-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="mx-auto w-full max-w-3xl pt-8 pb-4"
          >
            {/* Logo Gemini + heading */}
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              {Logo ? (
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg,#4285f4,#9b72cb,#d96570)",
                  }}
                />
              )}
              <h2
                className="text-2xl md:text-3xl font-bold theme-text"
                style={{ fontFamily: "var(--theme-font)" }}
              >
                ¿Qué investigamos hoy?
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                <span className="theme-chip inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Módulo 3 · Detective de Datos
                </span>
                <span className="text-xs theme-text-muted leading-snug">
                  explora el contenido del módulo o inicia una actividad con
                  Gemini
                </span>
              </div>
            </div>

            {/* Tarjetas de sugerencia — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
                  label: "Explorar el módulo",
                  desc: "Objetivos, temas y recursos del Módulo 3",
                  section: "objetivos",
                },
                {
                  icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
                  label: "Contenido del módulo",
                  desc: "Videos, PDFs y recursos interactivos",
                  section: "contenido",
                },
                {
                  icon: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
                  label: "Deep Research",
                  desc: "Investigación multimodal con Gemini",
                  section: "actividades",
                },
                {
                  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
                  label: "Práctica guiada",
                  desc: "Ejercicios paso a paso con Gemini",
                  section: "practica",
                },
              ].map(({ icon, label, desc, section }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (section === "contenido") onSelectTopic(0);
                    else onSelectSection(section);
                  }}
                  className="theme-prompt-card group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285f4]/40"
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
        )}

        {/* Pantalla de bienvenida estilo NotebookLM — solo cuando no hay sección activa */}
        {theme === "notebooklm" && viewSection === null && (
          <motion.div
            key="notebooklm-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="mx-auto w-full max-w-3xl pt-8 pb-4"
          >
            {/* Logo NotebookLM + heading */}
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              {Logo ? (
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1e40af] flex items-center justify-center" />
              )}
              <h2
                className="text-2xl md:text-3xl font-bold theme-text"
                style={{ fontFamily: "var(--theme-font)" }}
              >
                Vamos a empezar con tu cuaderno...
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                <span className="theme-chip inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Módulo 4 · Alquimista de Documentos
                </span>
                <span className="text-xs theme-text-muted leading-snug">
                  explora el contenido del módulo o crea algo nuevo con
                  NotebookLM
                </span>
              </div>
            </div>

            {/* Tarjetas de sugerencia — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
                  label: "Explorar el módulo",
                  desc: "Objetivos, temas y recursos del Módulo 4",
                  section: "objetivos",
                },
                {
                  icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
                  label: "Contenido del módulo",
                  desc: "Videos, PDFs y recursos interactivos",
                  section: "contenido",
                },
                {
                  icon: "M12 2a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2zm0 2v1H9V4h3zM8 9h8M8 13h6",
                  label: "Añadir fuentes",
                  desc: "Sube documentos y organiza tu cuaderno",
                  section: "actividades",
                },
                {
                  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
                  label: "Práctica guiada",
                  desc: "Ejercicios paso a paso con NotebookLM",
                  section: "practica",
                },
              ].map(({ icon, label, desc, section }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (section === "contenido") onSelectTopic(0);
                    else onSelectSection(section);
                  }}
                  className="theme-prompt-card group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e40af]/40"
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
        )}

        {/* Pantalla de bienvenida estilo ChatGPT — solo cuando no hay sección activa */}
        {theme === "chatgpt" && viewSection === null && (
          <motion.div
            key="chatgpt-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="mx-auto w-full max-w-3xl pt-8 pb-4"
          >
            {/* Logo + heading */}
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              {Logo ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Logo />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#10a37f] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 41 41"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M37.5 20.5c0 9.39-7.61 17-17 17s-17-7.61-17-17 7.61-17 17-17 17 7.61 17 17Z"
                      fill="#10a37f"
                    />
                    <path
                      d="M20.5 10.5v20M10.5 20.5h20"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
              <h2
                className="text-2xl md:text-3xl font-bold theme-text"
                style={{ fontFamily: "var(--theme-font)" }}
              >
                ¿Por dónde empezamos?
              </h2>
              <span className="text-xs theme-text-muted">
                explora el contenido del módulo o inicia una actividad
              </span>
            </div>

            {/* Tarjetas de sugerencia — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
                  label: "Explorar el módulo",
                  desc: "Objetivos, temas y recursos del Módulo 2",
                  section: "objetivos",
                },
                {
                  icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
                  label: "Contenido del módulo",
                  desc: "Videos, PDFs y recursos interactivos",
                  section: "contenido",
                },
                {
                  icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
                  label: "Actividades y retos",
                  desc: "Desafíos prácticos y ejercicios de ChatGPT",
                  section: "actividades",
                },
                {
                  icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
                  label: "Práctica guiada",
                  desc: "Ejercicios paso a paso con ChatGPT",
                  section: "practica",
                },
              ].map(({ icon, label, desc, section }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (section === "contenido") onSelectTopic(0);
                    else onSelectSection(section);
                  }}
                  className="theme-prompt-card group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]/40"
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
