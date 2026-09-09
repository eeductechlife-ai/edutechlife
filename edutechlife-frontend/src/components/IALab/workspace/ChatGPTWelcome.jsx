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
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#10a37f" aria-hidden="true">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.019-1.165a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.687 8.105V12.63a.79.79 0 0 0-.4-.879zm2.01-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.679 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681l-.004 5.574zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5-.005-2.999z" />
        </svg>
        <h2 className="text-2xl md:text-3xl font-bold theme-text">¿Por dónde empezamos?</h2>
        <p className="text-sm theme-text-muted max-w-sm">
          Módulo 2 · Arquitecto Digital — explora el contenido del módulo o inicia una actividad
        </p>
      </div>

      {/* Mensaje introductorio — estilo mensaje ChatGPT */}
      <div className="w-full mb-6 flex gap-3">
        <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center" style={{ background: "#10a37f" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.019-1.165a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.687 8.105V12.63a.79.79 0 0 0-.4-.879zm2.01-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.679 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681l-.004 5.574zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5-.005-2.999z" />
          </svg>
        </div>
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
