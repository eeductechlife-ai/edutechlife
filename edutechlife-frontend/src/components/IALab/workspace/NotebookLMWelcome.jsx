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

/* ── Iconos SVG ─────────────────────────────────────────────── */
const ICONS = {
  plus:      "M12 5v14m-7-7h14",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  file:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2zM14 2v6h6",
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

/* ── Tiles del Studio — etiquetas NLM mapeadas a secciones del módulo ── */
const STUDIO_TILES = [
  { icon: ICONS.music,     label: "Res. de audio",  bg: "#f3e8fd", color: "#7c4dff", active: true,  section: "actividades" },
  { icon: ICONS.slides,    label: "Presentación",   bg: "#f1f3f4", color: "#9aa0a6", active: false, section: null          },
  { icon: ICONS.video,     label: "Res. de vídeo",  bg: "#e6f4ea", color: "#188038", active: true,  section: "contenido"   },
  { icon: ICONS.mindmap,   label: "Mapa mental",    bg: "#fce8e6", color: "#d93025", active: true,  section: "practica"    },
  { icon: ICONS.report,    label: "Informes",       bg: "#fff8e1", color: "#f9ab00", active: true,  section: "objetivos"   },
  { icon: ICONS.cards,     label: "Tarjetas",       bg: "#fce8e6", color: "#d93025", active: true,  section: "guardados"   },
  { icon: ICONS.quiz,      label: "Cuestionario",   bg: "#e8f0fe", color: "#1a73e8", active: true,  section: "actividades" },
  { icon: ICONS.infograph, label: "Infografía",     bg: "#f1f3f4", color: "#9aa0a6", active: false, section: null          },
  { icon: ICONS.table,     label: "Tabla de datos", bg: "#e8f0fe", color: "#1a73e8", active: true,  section: "contenido"   },
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
  { id: "fuentes", label: "Fuentes" },
  { id: "chat",    label: "Chat"    },
  { id: "studio",  label: "Studio"  },
];

export default function NotebookLMWelcome({ topics = [], onSelectSection, onSelectTopic, onHome }) {
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
        {MOBILE_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            className="flex-1 py-3 text-[13px] font-medium text-center relative transition-colors"
            style={{ color: mobileTab === id ? "#1a73e8" : "#5f6368" }}
          >
            {label}
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
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>Fuentes</span>
            <button type="button" className="p-1 rounded hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label="Colapsar panel">
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
              Inicio
            </button>
          </div>

          {/* Buscador */}
          <div className="px-3 pb-3">
            <p className="text-[10.5px] font-medium mb-2 px-1" style={{ color: "#5f6368" }}>Buscar nuevas fuentes en la Web</p>
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#dadce0", color: "#3c4043" }}>
                <SvgIcon path={ICONS.globe} size={13} color="#5f6368" strokeWidth={1.5} />
                Web
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#dadce0", color: "#3c4043" }}>
                <SvgIcon path={ICONS.sparks} size={13} color="#5f6368" strokeWidth={1.5} />
                Fast Research
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button type="button" className="ml-auto p-1.5 rounded-full hover:bg-gray-100 transition-colors" style={{ color: "#5f6368" }} aria-label="Buscar">
                <SvgIcon path={ICONS.search} size={18} color="#5f6368" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Temas del módulo */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {topics.length > 0 ? (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-wider px-1 pb-1.5 pt-1" style={{ color: "#9aa0a6" }}>
                  TEMAS DEL MÓDULO
                </p>
                <div className="flex flex-col gap-0.5">
                  {topics.map((topic, i) => (
                    <button
                      key={`topic-${i}`}
                      type="button"
                      onClick={() => onSelectTopic(i)}
                      className="flex items-start gap-2.5 px-2 py-2 rounded-xl text-left transition-colors group hover:bg-[#f8f9fa]"
                    >
                      <div className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center mt-0.5" style={{ background: "#e8f0fe" }}>
                        <SvgIcon path={ICONS.file} size={14} color="#1a73e8" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-medium leading-snug group-hover:text-[#1a73e8] transition-colors" style={{ color: "#3c4043" }}>
                          {topic.title}
                        </p>
                        {topic.duration && (
                          <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: "#9aa0a6" }}>
                            <SvgIcon path={ICONS.clock} size={10} color="#9aa0a6" strokeWidth={1.5} />
                            {topic.duration}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full px-4">
                <SvgIcon path={ICONS.file} size={40} color="#bdc1c6" strokeWidth={1.25} />
                <p className="text-[13px] font-semibold mt-3 mb-1" style={{ color: "#3c4043" }}>Las fuentes guardadas aparecerán aquí</p>
                <p className="text-[11.5px] leading-snug mb-3" style={{ color: "#5f6368" }}>
                  Añade archivos, sitios web u otros elementos. A continuación, haz preguntas o crea contenido a partir de esas fuentes.
                </p>
                <p className="text-[11.5px]" style={{ color: "#5f6368" }}>
                  Suelta los archivos aquí o{" "}
                  <button type="button" onClick={() => onSelectTopic(0)} className="text-[#1a73e8] hover:underline font-medium">
                    añadir una fuente
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
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>Chat</span>
            <div className="flex items-center gap-1">
              <button type="button" className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label="Filtros">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>
              <button type="button" className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label="Más opciones">
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
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a73e8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Módulo 4</p>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#202124", lineHeight: 1.3 }}>Alquimista Digital</h2>
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
                  Bienvenido al taller de transformación documental.
                </p>
                <p style={{ fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", fontSize: 14, color: "#3c4043", lineHeight: 1.7 }}>
                  Convierte documentos en oro: podcasts que suenan a radio profesional, resúmenes que van al grano y respuestas que citan cada fuente sin inventar nada.
                </p>
              </div>
            </div>

            {/* ¿Por dónde empezar? */}
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5f6368", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
              ¿Por dónde empezar?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", label: "Objetivos",    desc: "Lo que aprenderás en este módulo",           bg: "#e8f0fe", color: "#1a73e8", section: "objetivos"   },
                { icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",                                                                label: "Contenido",  desc: "Explora los temas del módulo",               bg: "#e6f4ea", color: "#188038", section: "contenido"  },
                { icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",                                                                                                                    label: "Reto",       desc: "Pon a prueba lo que has aprendido",          bg: "#fce8e6", color: "#d93025", section: "actividades" },
                { icon: "M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3zm0 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",  label: "Desafío",    desc: "Herramientas de práctica avanzada",          bg: "#f3e8fd", color: "#7c4dff", section: "practica"    },
              ].map(({ icon, label, desc, bg, color, section }) => (
                <button
                  key={label}
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
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }} className="group-hover:text-[#1a73e8] transition-colors">{label}</p>
                    <p style={{ fontSize: 12, color: "#5f6368", lineHeight: 1.5, marginTop: 2 }}>{desc}</p>
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
            <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>Studio</span>
            <button type="button" className="p-1 rounded hover:bg-gray-100" style={{ color: "#5f6368" }} aria-label="Colapsar panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>
              </svg>
            </button>
          </div>

          {/* Tiles del Studio */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="grid grid-cols-3 gap-2">
              {STUDIO_TILES.map(({ icon, label, bg, color, active, section }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (!active) return;
                    if (section === "contenido") onSelectTopic(0);
                    else onSelectSection(section);
                  }}
                  disabled={!active}
                  className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                    active ? "hover:shadow-sm hover:-translate-y-0.5 cursor-pointer" : "opacity-40 cursor-default"
                  }`}
                  style={{ borderColor: "#e0e0e6", background: "#fff" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <SvgIcon path={icon} size={17} color={color} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-start justify-between w-full gap-0.5">
                    <span className="text-[10px] font-medium leading-tight" style={{ color: active ? "#3c4043" : "#9aa0a6" }}>
                      {label}
                    </span>
                    {active && <SvgIcon path={ICONS.chevronR} size={10} color="#9aa0a6" />}
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
                Los resultados de Studio se guardarán aquí.
              </p>
              <p className="mt-1 leading-snug" style={{ fontSize: 11, color: "#5f6368" }}>
                Después de añadir las fuentes, haz clic para añadir un resumen de audio, una guía de estudio o un mapa mental, entre otros.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectSection("actividades")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium transition-colors hover:opacity-90"
              style={{ background: "#202124" }}
            >
              <SvgIcon path={ICONS.note} size={16} color="white" />
              Actividades
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
