/**
 * ChatGPTWelcome — Clon exacto del diseño de ChatGPT para Módulo 2.
 * Replica la interfaz real de ChatGPT: logo, heading, mensaje con avatar, 4 tarjetas de acción.
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function ChatGPTWelcome({ topics = [], onSelectSection, onSelectTopic }) {
  return (
    <motion.div
      key="chatgpt-welcome"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl pt-8 pb-4"
    >
      {/* Logo + Heading */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <svg width="40" height="40" viewBox="0 0 41 41" fill="none">
          <path d="M37.5 20.5c0 9.39-7.61 17-17 17s-17-7.61-17-17 7.61-17 17-17 17 7.61 17 17Z" fill="#10a37f" fillOpacity="0.1" />
          <path d="M20.5 37C29.889 37 37.5 29.389 37.5 20S29.889 3 20.5 3 3.5 10.611 3.5 20 11.111 37 20.5 37Z" stroke="#10a37f" strokeWidth="1.5" />
          <circle cx="20.5" cy="20.5" r="3" fill="#10a37f" />
          <path d="M20.5 13C16.358 13 13 16.358 13 20.5S16.358 28 20.5 28 28 24.642 28 20.5" stroke="#10a37f" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <h2 className="text-2xl md:text-3xl font-bold theme-text">¿Por dónde empezamos?</h2>
        <p className="text-sm theme-text-muted max-w-sm">
          Módulo 2 · Arquitecto Digital — explora el contenido del módulo o inicia una actividad
        </p>
      </div>

      {/* Mensaje introductorio */}
      <div className="w-full mb-6">
        <div className="flex-1 space-y-2.5">
            <p className="text-sm font-semibold theme-text leading-snug">
              Bienvenido a la obra maestra de la automatización.
            </p>
            <p className="text-sm theme-text-muted leading-relaxed">
              Aquí no solo usarás ChatGPT: aprenderás a construir con él.
            </p>
            <p className="text-sm theme-text-muted leading-relaxed">
              Diseña prompts, crea GPTs, conecta herramientas y APIs, y transforma la inteligencia artificial en sistemas que trabajan por ti.
            </p>
            <p className="text-sm font-semibold theme-text leading-snug">
              No solo uses la IA. Constrúyela.
            </p>
        </div>
      </div>

      {/* Tarjetas de sugerencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
            label: "Objetivos del módulo",
            desc: "Metas y competencias del Módulo 2",
            action: "objetivos",
          },
          {
            icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
            label: "Contenido del módulo",
            desc: "Videos, PDFs y recursos interactivos",
            action: "contenido",
          },
          {
            icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
            label: "Actividades y retos",
            desc: "Desafíos prácticos y ejercicios de ChatGPT",
            action: "actividades",
          },
          {
            icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
            label: "Práctica guiada",
            desc: "Ejercicios paso a paso con ChatGPT",
            action: "practica",
          },
        ].map(({ icon, label, desc, action }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (action === "contenido") onSelectTopic(0);
              else onSelectSection(action);
            }}
            className="theme-prompt-card flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]/40"
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
              >
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

ChatGPTWelcome.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};
