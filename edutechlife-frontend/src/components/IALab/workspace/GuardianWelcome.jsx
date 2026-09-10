/**
 * GuardianWelcome — Módulo 5 (Guardián Digital).
 * Identidad IALab original: petroleum #004b63 + teal #259eb5, escudo como ícono central.
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const SHIELD_PATH = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const SHIELD_CHECK_PATH = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4";

const SUGGEST_CARDS = [
  {
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    label: "Objetivos del módulo",
    desc: "Metas y competencias del Módulo 5",
    section: "objetivos",
    bg: "rgba(0,75,99,0.08)",
    color: "#004b63",
  },
  {
    icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
    label: "Contenido del módulo",
    desc: "Videos, PDFs y recursos interactivos",
    section: "contenido",
    bg: "rgba(37,158,181,0.08)",
    color: "#259eb5",
  },
  {
    icon: SHIELD_CHECK_PATH,
    label: "Principios éticos",
    desc: "Guías de uso responsable de la IA",
    section: "actividades",
    bg: "rgba(0,75,99,0.08)",
    color: "#004b63",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
    label: "Práctica guiada",
    desc: "Casos prácticos de ética en IA",
    section: "practica",
    bg: "rgba(37,158,181,0.08)",
    color: "#259eb5",
  },
];

export default function GuardianWelcome({ topics = [], description, onSelectSection, onSelectTopic }) {
  return (
    <motion.div
      key="guardian-welcome"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl pt-8 pb-4"
    >
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg, #003d52 0%, #004b63 50%, #259eb5 100%)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={SHIELD_PATH} />
          </svg>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold leading-tight"
          style={{
            background: "linear-gradient(135deg, #003d52 0%, #004b63 50%, #259eb5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ¿Qué protegemos hoy?
        </h2>
        <p className="text-sm theme-text-muted max-w-sm">
          Módulo 5 · Guardián Digital — explora el uso ético e inteligente de la IA
        </p>
      </div>

      {/* Burbuja de bienvenida */}
      <div className="w-full mb-6 flex gap-3">
        <div
          className="flex-shrink-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: "linear-gradient(135deg, #003d52, #004b63, #259eb5)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={SHIELD_PATH} />
          </svg>
        </div>
        <div className="flex-1 space-y-2.5">
          <p className="text-sm font-semibold theme-text leading-snug">
            Cada vez que usas IA, estás tomando decisiones éticas — aunque no lo sepas.
          </p>
          {description ? (
            <p className="text-sm theme-text-muted leading-relaxed">
              {description.split(". ").filter(Boolean).slice(0, 3).join(". ").trim().replace(/\.$/, "") + "."}
            </p>
          ) : (
            <>
              <p className="text-sm theme-text-muted leading-relaxed">
                ¿Los datos que subes están protegidos? ¿El resultado es justo para todos? ¿Sabes quién es responsable si algo sale mal?
              </p>
              <p className="text-sm font-semibold theme-text leading-snug">
                Este módulo es tu entrenamiento para convertirte en guardián de la IA.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGEST_CARDS.map(({ icon, label, desc, section, bg, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (section === "contenido") onSelectTopic(0);
              else onSelectSection(section);
            }}
            className="theme-prompt-card flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#259eb5]/40"
          >
            <span
              className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: bg }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold theme-text leading-snug">{label}</p>
              <p className="text-xs theme-text-muted mt-0.5 leading-snug">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

GuardianWelcome.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  description: PropTypes.string,
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};
