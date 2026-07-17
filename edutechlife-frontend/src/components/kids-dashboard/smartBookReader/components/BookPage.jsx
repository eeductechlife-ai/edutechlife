import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "#4DA8C4",
  "#66CCCC",
  "#FFD166",
  "#FF6B9D",
  "#B2D8E5",
  "#004B63",
];

export const ConceptChip = memo(({ label, i }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.05 }}
    className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border"
    style={{
      backgroundColor: `${COLORS[i % COLORS.length]}15`,
      borderColor: `${COLORS[i % COLORS.length]}30`,
      color: COLORS[i % COLORS.length],
    }}
  >
    {label}
  </motion.span>
));
ConceptChip.displayName = "CC";

export const SectionBlock = memo(({ section, i, dark }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className={`rounded-xl border overflow-hidden ${dark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-3 text-left font-bold text-sm ${
          dark
            ? "text-white hover:bg-[#334155]/50"
            : "text-[#004B63] hover:bg-[#F8FAFC]"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          >
            {i + 1}
          </span>
          {section.titulo}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p
              className={`px-3 pb-3 text-sm leading-relaxed ${dark ? "text-[#CBD5E1]" : "text-[#64748B]"}`}
            >
              {section.contenido}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
SectionBlock.displayName = "Sec";

export const BookDisplay = memo(({ book, dark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl border overflow-hidden backdrop-blur-xl ${dark ? "bg-[#0F172A]/90 border-[#334155]" : "bg-white/90 border-[#E2E8F0] shadow-sm"}`}
  >
    <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-5 text-white">
      <h3 className="font-bold text-lg mb-1">{book.title}</h3>
      <p className="text-white/70 text-xs">
        {new Date(book.createdAt).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
    <div className="p-4 space-y-4">
      <div>
        <h4
          className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          Resumen
        </h4>
        <p
          className={`text-sm leading-relaxed ${dark ? "text-[#CBD5E1]" : "text-[#475569]"}`}
        >
          {book.summary}
        </p>
      </div>
      {book.keyConcepts?.length > 0 && (
        <div>
          <h4
            className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Conceptos Clave
          </h4>
          <div className="flex flex-wrap gap-2">
            {book.keyConcepts.map((c, i) => (
              <ConceptChip key={i} label={c} i={i} />
            ))}
          </div>
        </div>
      )}
      {book.sections?.length > 0 && (
        <div>
          <h4
            className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Secciones
          </h4>
          <div className="space-y-2">
            {book.sections.map((s, i) => (
              <SectionBlock key={i} section={s} i={i} dark={dark} />
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
));
BookDisplay.displayName = "BD";
