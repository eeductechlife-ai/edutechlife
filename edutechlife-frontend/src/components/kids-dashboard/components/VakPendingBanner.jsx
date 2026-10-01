import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  readPendingVakResult,
  clearPendingVakResult,
} from "../../../utils/vakPendingResult";
import { STYLE_INSIGHTS } from "../../DiagnosticoVAK/vakStyles";

const describe = (pending) => {
  const main = STYLE_INSIGHTS[pending.predominantStyle].label;
  const second = pending.secondaryStyle
    ? STYLE_INSIGHTS[pending.secondaryStyle].label
    : null;
  return second ? `${main} y ${second}` : main;
};

// Si alguien hizo el ADN de Aprendizaje en el sitio antes de entrar, se ofrece
// traerlo para no repetir la actividad. Siempre se pregunta: en un equipo
// compartido el resultado podría ser de otra persona.
function VakPendingBanner({ vakResult, onImport, darkMode }) {
  const [pending, setPending] = useState(() => readPendingVakResult());

  if (vakResult || !pending) return null;

  const date = new Date(pending.savedAt).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
  });

  const accept = () => {
    onImport({
      scores: pending.scores,
      predominantStyle: pending.predominantStyle,
      secondaryStyle: pending.secondaryStyle,
      completedAt: new Date(),
    });
    clearPendingVakResult();
    setPending(null);
  };

  const dismiss = () => {
    clearPendingVakResult();
    setPending(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="ADN de Aprendizaje encontrado"
      className={`rounded-2xl border-2 p-4 ${
        darkMode
          ? "bg-[#1A2744] border-[#06D6A0]/60"
          : "bg-[#ECFDF5] border-[#06D6A0]"
      }`}
    >
      <p
        className={`!m-0 text-base font-black ${darkMode ? "text-white" : "text-[#064E3B]"}`}
      >
        🧬 Encontramos un ADN de Aprendizaje hecho en este equipo
      </p>
      <p
        className={`!m-0 mt-1 text-sm ${darkMode ? "text-[#CBD5E1]" : "text-[#065F46]"}`}
      >
        Salió {describe(pending)} el {date}. ¿Es tuyo? Si lo es, lo traemos y no
        tienes que repetirlo.
      </p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={accept}
          className="min-h-[48px] rounded-xl bg-[#047857] text-white text-sm font-black"
        >
          Sí, es mío
        </button>
        <button
          type="button"
          onClick={dismiss}
          className={`min-h-[48px] rounded-xl border-2 text-sm font-bold ${
            darkMode
              ? "border-[#475569] text-[#E2E8F0]"
              : "border-[#047857] text-[#047857]"
          }`}
        >
          No, lo haré yo
        </button>
      </div>
    </motion.section>
  );
}

export default memo(VakPendingBanner);
