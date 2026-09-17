/**
 * NotebookLMWelcome — dashboard 3 columnas idéntico a Google NotebookLM.
 * Módulo 4: Alquimista Digital.
 *   Fuentes  → temas reales del módulo (navegables)
 *   Chat     → bienvenida + chips + input decorativo (texto exacto del ref)
 *   Studio   → tiles exactos del ref NotebookLM, mapeados a secciones del módulo
 */
import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

/* ── Iconos SVG ─────────────────────────────────────────────── */
const ICONS = {
  plus:      "M12 5v14m-7-7h14",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  file:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2zM14 2v6h6",
  check:     "M20 6 9 17l-5-5",
  bolt:      "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  target:    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  graduation:"M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  wand:      "M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5",
  bookmark:  "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  globe:     "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-2.76 4-2.76 16 0 20M2 12h20M12 2c2.76 4 2.76 16 0 20",
  lines:     "M4 6h16M4 12h16M4 18h16",
  chevronR:  "M9 18l6-6-6-6",
  send:      "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  clock:     "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  sparks:    "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z",
  note:      "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  music:     "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  slides:    "M2 3h20v14H2zM8 21h8M12 17v4",
  video:     "M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z",
  mindmap:   "M12 3v9m0 0l-4-4m4 4l4-4M12 12v9M3 12h9m0 0l-4 4m4-4l-4-4M12 12h9m0 0l-4 4m4-4l-4-4",
  report:    "M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zM3 3h18v18H3z",
  cards:     "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm4 8h8M12 8v8",
  quiz:      "M8 9h8M8 13h5M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z",
  infograph: "M3 3v18h18M7 16l4-4 4 4 4-8",
  table:     "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  ai:        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z",
};

/* ── Tiles del Studio — elementos reales del módulo (100% funcionales) ── */
const STUDIO_TILES = [
  { key: "desafio",     labelKey: "ialab.workspace.studio.challenge", icon: ICONS.bolt,       bg: "#f3e8fd", color: "#7c4dff", action: "OPEN_CHALLENGE" },
  { key: "reto",        labelKey: "ialab.workspace.studio.exam",      icon: ICONS.target,     bg: "#fce8e6", color: "#d93025", action: "OPEN_QUIZ" },
  { key: "comunidad",   labelKey: "ialab.workspace.studio.community", icon: ICONS.users,      bg: "#e6f4ea", color: "#188038", section: "actividades", action: "OPEN_COMMUNITY" },
  { key: "tutoria",     labelKey: "ialab.workspace.studio.tutoring",  icon: ICONS.graduation, bg: "#e8f0fe", color: "#1a73e8", action: "OPEN_TUTORING" },
  { key: "herramienta", labelKey: "ialab.workspace.studio.tool",      icon: ICONS.wand,       bg: "#fff8e1", color: "#f9ab00", action: "OPEN_TOOL_PROMPTS" },
  { key: "objetivo",    labelKey: "ialab.workspace.studio.objective", icon: ICONS.report,     bg: "#e8f0fe", color: "#1a73e8", section: "objetivos" },
  { key: "guardado",    labelKey: "ialab.workspace.studio.saved",     icon: ICONS.bookmark,   bg: "#fce8e6", color: "#d93025", section: "guardados" },
];

const START_CARDS = [
  { icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", labelKey: "ialab.workspace.nlm.card_objectives", descKey: "ialab.workspace.nlm.card_objectives_desc", bg: "#e8f0fe", color: "#1a73e8", section: "objetivos" },
  { icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", labelKey: "ialab.workspace.nlm.card_content", descKey: "ialab.workspace.nlm.card_content_desc", bg: "#e6f4ea", color: "#188038", section: "contenido" },
  { icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z", labelKey: "ialab.workspace.nlm.card_retos", descKey: "ialab.workspace.nlm.card_retos_desc", bg: "#fce8e6", color: "#d93025", section: "actividades" },
  { icon: "M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3zm0 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2z", labelKey: "ialab.workspace.nlm.card_challenge", descKey: "ialab.workspace.nlm.card_challenge_desc", bg: "#f3e8fd", color: "#7c4dff", section: "practica" },
];

/* ── Componente SVG reutilizable ────────────────────────────── */
function SvgIcon({ path, size = 16, color, strokeWidth = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || "currentColor"} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
SvgIcon.propTypes = { path: PropTypes.string.isRequired, size: PropTypes.number, color: PropTypes.string, strokeWidth: PropTypes.number };

/* ── Componente principal ───────────────────────────────────── */
const MOBILE_TABS = [
  { id: "fuentes", labelKey: "ialab.workspace.nlm.tab_sources" },
  { id: "chat",    labelKey: "ialab.workspace.nlm.tab_chat"    },
  { id: "studio",  labelKey: "ialab.workspace.nlm.tab_studio"  },
];

export default function NotebookLMWelcome({ topics = [], sequenceByIndex, onSelectSection, onSelectTopic, onAction, onHome }) {
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = useState("chat");

  return (
    <motion.div
      key="notebooklm-welcome"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full rounded-2xl overflow-hidden border shadow-sm"
      style={{ minHeight: "calc(100dvh - 14rem)", background: "#fff", borderColor: "#e0e0e6" }}
    >
      {/* ── Mobile Tab Bar ── visible only < md ────────────── */}
      <div className="lg:hidden flex border-b" style={{ borderColor: "#e0e0e6" }}>
        {MOBILE_TABS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            className="flex-1 py-3 text-[13px] font-medium text-center relative transition-colors"
            style={{ color: mobileTab === id ? "#1a73e8" : "#5f6368" }}
          >
            {t(labelKey)}
            {mobileTab === id && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-t" style={{ background: "#1a73e8" }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex h-full" style={{ minHeight: "inherit" }}>

        {/* ══ FUENTES ══════════════════════════════════════════ */}
        <div className={`flex-col flex-shrink-0 border-r ${mobileTab === "fuentes" ? "flex w-full" : "hidden lg:flex"} lg:w-[260px]`} style={{ borderColor: "#e0e0e6" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#e0e0e6" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>{t("ialab.workspace.nlm.tab_sources")}</span>
            <button type="button" className="p-1 rounded hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label={t("ialab.workspace.collapse_panel")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
              </svg>
            </button>
          </div>

          {/* Inicio (vuelve a la pantalla de bienvenida del módulo) */}
          <div className="px-3 pt-3 pb-2">
            <button
              type="button"
              onClick={() => onHome?.()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm font-medium hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#dadce0", color: "#3c4043" }}
            >
              <SvgIcon path={ICONS.plus} size={15} color="#3c4043" />
              {t("ialab.workspace.home")}
            </button>
          </div>

          {/* Buscador */}
          <div className="px-3 pb-3">
            <p className="text-[10.5px] font-medium mb-2 px-1" style={{ color: "#5f6368" }}>{t("ialab.workspace.nlm.search_web")}</p>
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#dadce0", color: "#3c4043" }}>
                <SvgIcon path={ICONS.globe} size={13} color="#5f6368" strokeWidth={1.5} />
                {t("ialab.workspace.nlm.chip_web")}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#dadce0", color: "#3c4043" }}>
                <SvgIcon path={ICONS.sparks} size={13} color="#5f6368" strokeWidth={1.5} />
                {t("ialab.workspace.nlm.chip_fast")}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button type="button" className="ml-auto p-1.5 rounded-full hover:bg-gray-100 transition-colors" style={{ color: "#5f6368" }} aria-label={t("ialab.workspace.search")}>
                <SvgIcon path={ICONS.search} size={18} color="#5f6368" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Temas del módulo */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {topics.length > 0 ? (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-wider px-1 pb-1.5 pt-1" style={{ color: "#9aa0a6" }}>
                  {t("ialab.workspace.topics_label")}
                </p>
                <div className="flex flex-col gap-0.5">
                  {topics.map((topic, i) => {
                    const completed = Boolean(
                      sequenceByIndex?.get?.(i)?.isCompleted,
                    );
                    return (
                      <button
                        key={`topic-${i}`}
                        type="button"
                        onClick={() => onSelectTopic(i)}
                        data-testid={
                          completed ? `nlm-topic-completed-${i}` : undefined
                        }
                        className="flex items-start gap-2.5 px-2 py-2 rounded-xl text-left transition-colors group hover:bg-[#f8f9fa]"
                      >
                        <div
                          className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                          style={{ background: completed ? "#e6f4ea" : "#e8f0fe" }}
                        >
                          <SvgIcon
                            path={ICONS.file}
                            size={14}
                            color={completed ? "#188038" : "#1a73e8"}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[12.5px] font-medium leading-snug group-hover:text-[#1a73e8] transition-colors"
                            style={{ color: completed ? "#188038" : "#3c4043" }}
                          >
                            {topic.title}
                          </p>
                          {topic.duration && (
                            <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: "#9aa0a6" }}>
                              <SvgIcon path={ICONS.clock} size={10} color="#9aa0a6" strokeWidth={1.5} />
                              {topic.duration}
                            </p>
                          )}
                        </div>
                        {completed && (
                          <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
                            <SvgIcon path={ICONS.check} size={14} color="#188038" strokeWidth={2.4} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full px-4">
                <SvgIcon path={ICONS.file} size={40} color="#bdc1c6" strokeWidth={1.25} />
                <p className="text-[13px] font-semibold mt-3 mb-1" style={{ color: "#3c4043" }}>{t("ialab.workspace.nlm.empty_title")}</p>
                <p className="text-[11.5px] leading-snug mb-3" style={{ color: "#5f6368" }}>
                  {t("ialab.workspace.nlm.empty_desc")}
                </p>
                <p className="text-[11.5px]" style={{ color: "#5f6368" }}>
                  <button type="button" onClick={() => onSelectTopic(0)} className="text-[#1a73e8] hover:underline font-medium">
                    {t("ialab.workspace.nlm.empty_cta")}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ══ CHAT ════════════════════════════════════════════ */}
        <div className={`flex-col flex-1 min-w-0 ${mobileTab === "chat" ? "flex" : "hidden lg:flex"}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#e0e0e6" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>{t("ialab.workspace.nlm.tab_chat")}</span>
            <div className="flex items-center gap-1">
              <button type="button" className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label={t("ialab.workspace.filters")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label={t("ialab.workspace.more_options")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Intro del módulo — estilo NotebookLM */}
          <div className="flex-1 overflow-y-auto px-6 py-8" style={{ fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif" }}>

            {/* Identidad del módulo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f0fe" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a73e8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t("ialab.workspace.nlm.module_label", { n: 4 })}</p>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#202124", lineHeight: 1.3 }}>{t("ialab.workspace.nlm.brand")}</h2>
                <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>{t("ialab.workspace.nlm.sub")}</p>
              </div>
            </div>

            {/* Mensaje intro — avatar NotebookLM + texto, estilo nuevo chat */}
            <div className="w-full mb-6 flex gap-3">
              <div
                className="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center"
                style={{ background: "#1a73e8" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", fontSize: 14, fontWeight: 600, color: "#202124", marginBottom: 6 }}>
                  {t("ialab.workspace.nlm.intro_title")}
                </p>
                <p style={{ fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", fontSize: 14, color: "#3c4043", lineHeight: 1.7 }}>
                  {t("ialab.workspace.nlm.intro_desc")}
                </p>
              </div>
            </div>

            {/* ¿Por dónde empezar? */}
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              {t("ialab.workspace.nlm.start_where")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {START_CARDS.map(({ icon, labelKey, descKey, bg, color, section }) => (
                <button
                  key={labelKey}
                  type="button"
                  onClick={() => section === "contenido" ? onSelectTopic(0) : onSelectSection(section)}
                  className="group flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:shadow-sm hover:-translate-y-0.5 bg-white"
                  style={{ borderColor: "#e0e0e6" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: bg }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }} className="group-hover:text-[#1a73e8] transition-colors">{t(labelKey)}</p>
                    <p style={{ fontSize: 12, color: "#5f6368", lineHeight: 1.5, marginTop: 2 }}>{t(descKey)}</p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ══ STUDIO ══════════════════════════════════════════ */}
        <div className={`flex-col flex-shrink-0 border-l ${mobileTab === "studio" ? "flex w-full" : "hidden lg:flex"} lg:w-[260px]`} style={{ borderColor: "#e0e0e6" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#e0e0e6" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>{t("ialab.workspace.nlm.tab_studio")}</span>
            <button type="button" className="p-1 rounded hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label={t("ialab.workspace.collapse_panel")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>
              </svg>
            </button>
          </div>

          {/* Tiles del Studio */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="grid grid-cols-3 gap-2">
              {STUDIO_TILES.map(({ key, icon, labelKey, bg, color, section, action }) => (
                <button
                  key={key}
                  type="button"
                  data-testid={`studio-tile-${key}`}
                  onClick={() => {
                    if (section) onSelectSection?.(section);
                    if (action) onAction?.(action);
                  }}
                  className="flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
                  style={{ borderColor: "#e0e0e6", background: "#fff" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <SvgIcon path={icon} size={17} color={color} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-start justify-between w-full gap-0.5">
                    <span className="text-[10px] font-medium leading-tight" style={{ color: "#3c4043" }}>
                      {t(labelKey)}
                    </span>
                    <SvgIcon path={ICONS.chevronR} size={10} color="#9aa0a6" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer del Studio */}
          <div className="px-4 py-4 border-t" style={{ borderColor: "#e0e0e6" }}>
            <div className="flex flex-col items-center text-center mb-4">
              <SvgIcon path={ICONS.sparks} size={22} color="#bdc1c6" />
              <p className="font-semibold mt-2" style={{ fontSize: 12, color: "#3c4043" }}>
                {t("ialab.workspace.nlm.studio_empty_title")}
              </p>
              <p className="mt-1 leading-snug" style={{ fontSize: 11, color: "#5f6368" }}>
                {t("ialab.workspace.nlm.studio_empty_desc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectSection("actividades")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium transition-colors hover:opacity-90"
              style={{ background: "#202124" }}
            >
              <SvgIcon path={ICONS.note} size={16} color="white" />
              {t("ialab.workspace.nlm.activities")}
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}

NotebookLMWelcome.propTypes = {
  topics:          PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, duration: PropTypes.string })),
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic:   PropTypes.func.isRequired,
  onHome:          PropTypes.func,
};
