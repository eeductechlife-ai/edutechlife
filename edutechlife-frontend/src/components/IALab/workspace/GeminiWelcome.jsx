/**
 * GeminiWelcome — Pantalla de bienvenida estilo Google Gemini para Módulo 3.
 * Clona el layout de Gemini: sidebar izquierdo + área principal con gradiente.
 * Todo el contenido viene del módulo configurado — sin alterar funcionalidad.
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const GeminiDiamond = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M14 2C14 8.627 8.627 14 2 14C8.627 14 14 19.373 14 26C14 19.373 19.373 14 26 14C19.373 14 14 8.627 14 2Z"
      fill="url(#gem-g)"
    />
    <defs>
      <linearGradient id="gem-g" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="40%" stopColor="#9b59b6" />
        <stop offset="70%" stopColor="#ea4335" />
        <stop offset="100%" stopColor="#fbbc04" />
      </linearGradient>
    </defs>
  </svg>
);

const NAV_ITEMS = [
  {
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    label: "Objetivos",
    section: "objetivos",
  },
  {
    icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
    label: "Actividades",
    section: "actividades",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
    label: "Práctica",
    section: "practica",
  },
  {
    icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
    label: "Guardados",
    section: "guardados",
  },
];

const SUGGEST_CARDS = [
  {
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    label: "Explorar el módulo",
    desc: "Objetivos, temas y recursos de Gemini",
    section: "objetivos",
    bg: "rgba(66,133,244,0.08)",
    color: "#4285f4",
  },
  {
    icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
    label: "Contenido del módulo",
    desc: "Videos, PDFs y recursos de Gemini AI",
    section: "contenido",
    bg: "rgba(52,168,83,0.08)",
    color: "#34a853",
  },
  {
    icon: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    label: "Deep Research",
    desc: "Investigación multimodal con Gemini",
    section: "actividades",
    bg: "rgba(251,188,4,0.1)",
    color: "#f9ab00",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
    label: "Práctica guiada",
    desc: "Ejercicios paso a paso con Gemini",
    section: "practica",
    bg: "rgba(234,67,53,0.08)",
    color: "#ea4335",
  },
];

export default function GeminiWelcome({ topics = [], description, onSelectSection, onSelectTopic }) {
  return (
    <motion.div
      key="gemini-welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex w-full min-h-[600px] rounded-2xl overflow-hidden"
      style={{ background: "#fff" }}
    >
      {/* ── Left sidebar ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r overflow-y-auto"
        style={{ width: 260, borderColor: "#e8eaed", background: "#fff" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-3">
          <GeminiDiamond size={24} />
          <span style={{ fontFamily: "'Google Sans',sans-serif", fontSize: 20, fontWeight: 400, color: "#202124" }}>
            Gemini
          </span>
          <button
            type="button"
            className="ml-auto flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-[#f1f3f4]"
            title="Editar"
            onClick={() => onSelectSection("actividades")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Nueva conversación */}
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => onSelectSection("actividades")}
            className="flex items-center gap-2.5 w-full rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#f1f3f4]"
            style={{ color: "#202124", fontFamily: "'Google Sans Text',sans-serif" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva conversación
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-3 space-y-0.5">
          {NAV_ITEMS.map(({ icon, label, section }) => (
            <button
              key={label}
              type="button"
              onClick={() => section && onSelectSection(section)}
              className="flex items-center gap-3 w-full rounded-full px-4 py-2.5 text-[14px] transition-colors hover:bg-[#f1f3f4]"
              style={{ color: "#3c4043", fontFamily: "'Google Sans Text',sans-serif" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
              {label}
            </button>
          ))}
        </nav>

        {/* Recientes — module topics */}
        {topics.length > 0 && (
          <div className="mt-4 px-3 flex-1">
            <div className="px-4 pb-1">
              <span style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 13, fontWeight: 500, color: "#3c4043" }}>
                Recientes
              </span>
            </div>
            <div className="space-y-0.5 mt-1">
              {topics.slice(0, 5).map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectTopic(i)}
                  className="flex items-center gap-2.5 w-full rounded-full px-4 py-2 text-[13px] text-left transition-colors hover:bg-[#f1f3f4] truncate"
                  style={{ color: "#3c4043", fontFamily: "'Google Sans Text',sans-serif" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                    <path d="M21 12a8 8 0 0 1-8 8H4l1.5-2.5A8 8 0 1 1 21 12Z" />
                  </svg>
                  <span className="truncate">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-4" />
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col min-w-0"
        style={{ background: "linear-gradient(160deg, #eaf4fb 0%, #f0f6ff 30%, #fafcff 65%, #eaf4fb 100%)" }}
      >
        {/* Center content */}
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
          {/* Gemini logo large */}
          <div className="mb-5">
            <GeminiDiamond size={44} />
          </div>

          {/* Main heading */}
          <h1
            className="text-3xl md:text-4xl font-light mb-3 leading-tight"
            style={{
              fontFamily: "'Google Sans Display','Google Sans',sans-serif",
              background: "linear-gradient(135deg,#4285f4 0%,#9b59b6 50%,#ea4335 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ¿Qué investigamos hoy?
          </h1>
          <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 14, color: "#5f6368", marginBottom: 20 }}>
            explora el contenido del módulo o inicia una actividad con Gemini
          </p>

          {/* Mensaje intro — avatar Gemini + texto, estilo nuevo chat */}
          <div className="w-full mb-7 flex gap-3 max-w-2xl text-left">
            <div
              className="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#4285f4 0%,#9b59b6 50%,#ea4335 100%)" }}
            >
              <GeminiDiamond size={14} />
            </div>
            <div className="flex-1 space-y-2">
              <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 14, fontWeight: 600, color: "#202124" }}>
                Bienvenido al laboratorio de investigación multimodal.
              </p>
              {description ? (
                <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 14, color: "#5f6368", lineHeight: 1.65 }}>
                  {description.split(". ").filter(Boolean).slice(0, 3).join(". ").trim().replace(/\.$/, "") + "."}
                </p>
              ) : (
                <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 14, color: "#5f6368", lineHeight: 1.65 }}>
                  Con Gemini aprenderás a buscar, sintetizar y crear en múltiples formatos. Texto, imagen, código y audio — todo desde una sola conversación.
                </p>
              )}
            </div>
          </div>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
            {SUGGEST_CARDS.map(({ icon, label, desc, section, bg, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (section === "contenido") onSelectTopic(0);
                  else onSelectSection(section);
                }}
                className="flex items-start gap-3 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none"
                style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid #e8eaed", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <span
                  className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 14, fontWeight: 500, color: "#202124" }} className="leading-snug">
                    {label}
                  </p>
                  <p style={{ fontFamily: "'Google Sans Text',sans-serif", fontSize: 12, color: "#5f6368" }} className="mt-0.5 leading-snug">
                    {desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

GeminiWelcome.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  description: PropTypes.string,
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};
