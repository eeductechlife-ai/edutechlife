import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { extractDocumentText } from "../../utils/documentParser";
import { callDeepseek } from "../../utils/api";

const COLORS = [
  "#4DA8C4",
  "#66CCCC",
  "#FFD166",
  "#FF6B9D",
  "#B2D8E5",
  "#004B63",
];

const UploadZone = memo(({ onUpload, busy }) => {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const d = (e, val) => {
    e.preventDefault();
    setDrag(val);
  };
  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer backdrop-blur-xl ${
        drag
          ? "border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]"
          : "border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50"
      }`}
      onDragEnter={(e) => d(e, true)}
      onDragLeave={(e) => d(e, false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
      }}
      onClick={() => !busy && ref.current?.click()}
      whileHover={!busy ? { scale: 1.02 } : {}}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-2 shadow-lg">
        <span className="text-lg">📄</span>
      </div>
      <p className="text-sm font-semibold text-[#004B63] mb-0.5">
        Sube un archivo
      </p>
      <p className="text-xs text-[#64748B]">PDF o TXT</p>
    </motion.div>
  );
});
UploadZone.displayName = "UZ";

const StepBar = memo(({ step }) => {
  const steps = ["📖 Extrayendo", "🤖 Analizando", "📚 Organizando"];
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              i === step
                ? "bg-[#4DA8C4]/20 text-[#004B63]"
                : i < step
                  ? "bg-[#66CCCC]/20 text-[#66CCCC]"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
            }`}
            animate={i === step ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {s}
          </motion.span>
          {i < 2 && (
            <div
              className={`w-5 h-0.5 rounded ${i < step ? "bg-[#66CCCC]" : "bg-[#E2E8F0]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
});
StepBar.displayName = "SB";

const ConceptChip = memo(({ label, i }) => (
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

const SectionBlock = memo(({ section, i, dark }) => {
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

const BookDisplay = memo(({ book, dark }) => (
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

const HistoryItem = memo(({ book, i, dark, onSelect }) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.04 }}
    onClick={() => onSelect(book)}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-md ${
      dark
        ? "bg-[#1E293B] border-[#334155] hover:border-[#4DA8C4]/30"
        : "bg-white border-[#E2E8F0] hover:border-[#4DA8C4]/30"
    }`}
  >
    <h5
      className={`text-sm font-bold truncate ${dark ? "text-white" : "text-[#004B63]"}`}
    >
      {book.title}
    </h5>
    <p className={`text-xs mt-1 ${dark ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
      {new Date(book.createdAt).toLocaleDateString("es-ES")}
    </p>
    <div className="flex flex-wrap gap-1 mt-2">
      {book.keyConcepts?.slice(0, 3).map((c, j) => (
        <span
          key={j}
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `${COLORS[j % COLORS.length]}15`,
            color: COLORS[j % COLORS.length],
          }}
        >
          {c}
        </span>
      ))}
    </div>
  </motion.button>
));
HistoryItem.displayName = "HI";

const SmartBookReader = () => {
  const {
    darkMode,
    smartBookHistory: history,
    setSmartBookHistory: setHistory,
  } = useSmartBoardKids();
  const [mode, setMode] = useState("input");
  const [text, setText] = useState("");
  const [step, setStep] = useState(0);
  const [book, setBook] = useState(null);
  const [view, setView] = useState(null);
  const [error, setError] = useState(null);

  const process = useCallback(async (input) => {
    setMode("processing");
    setStep(0);
    setError(null);
    try {
      if (typeof input !== "string") {
        setStep(0);
        input = await extractDocumentText(input);
      }
      setStep(1);
      const messages = [
        {
          role: "system",
          content:
            'Eres un asistente educativo que analiza textos y los organiza en formato de "libro inteligente". Responde SIEMPRE en formato JSON válido.',
        },
        {
          role: "user",
          content: `Analiza el siguiente texto y organízalo en un "libro inteligente" con: título, resumen (2-3 oraciones), conceptos clave (array de strings), secciones (array de {titulo, contenido}).\n\nTexto:\n${input.substring(0, 4000)}`,
        },
      ];
      setStep(2);
      const r = await callDeepseek(messages, {
        temperature: 0.3,
        maxTokens: 1500,
        isJson: true,
      });
      const b = {
        id: Date.now(),
        title: r.title || "Libro Inteligente",
        summary: r.summary || "",
        keyConcepts: r.keyConcepts || [],
        sections: r.sections || [],
        createdAt: new Date().toISOString(),
      };
      setBook(b);
      setHistory((prev) => [b, ...prev].slice(-20));
      setMode("result");
    } catch (err) {
      setError(err.message || "Error al procesar");
      setMode("input");
    }
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
        >
          📖 SmartBook
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          Convierte cualquier texto en un libro inteligente organizado
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${darkMode ? "text-white" : "text-[#004B63]"}`}
              >
                Pega tu texto aquí
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe o pega el texto que quieres convertir en SmartBook..."
                rows={5}
                className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] ${
                  darkMode
                    ? "bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B]"
                    : "bg-white border-[#E2E8F0] text-[#334155] placeholder-[#94A3B8]"
                }`}
              />
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => process(text)}
                disabled={!text.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  text.trim()
                    ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white shadow-md hover:shadow-lg"
                    : darkMode
                      ? "bg-[#334155] text-[#64748B]"
                      : "bg-[#E2E8F0] text-[#94A3B8]"
                }`}
              >
                Analizar Texto
              </motion.button>
              <span
                className={`text-xs font-semibold ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
              >
                o
              </span>
              <div className="flex-1">
                <UploadZone onUpload={process} busy={false} />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}
          </motion.div>
        )}

        {mode === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-8 rounded-2xl border text-center backdrop-blur-xl ${darkMode ? "bg-[#0F172A]/90 border-[#334155]" : "bg-white/90 border-[#E2E8F0]"}`}
          >
            <StepBar step={step} />
            <div className="w-full max-w-xs h-2 bg-[#E2E8F0] rounded-full mx-auto overflow-hidden mt-4">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p
              className={`text-xs mt-3 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              {step === 0
                ? "Extrayendo texto..."
                : step === 1
                  ? "Analizando contenido..."
                  : "Organizando libro..."}
            </p>
          </motion.div>
        )}

        {mode === "result" && book && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookDisplay book={book} dark={darkMode} />
            <motion.button
              onClick={() => {
                setMode("input");
                setText("");
                setBook(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg"
            >
              Crear otro SmartBook
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setView(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <BookDisplay book={view} dark={false} />
              <button
                onClick={() => setView(null)}
                className="mt-2 w-full py-2 text-sm text-white/80 hover:text-white text-center"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h4
          className={`text-sm font-bold mb-3 ${darkMode ? "text-white" : "text-[#004B63]"}`}
        >
          📚 Historial ({history.length})
        </h4>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-5xl mb-3 block">📚</span>
            <p
              className={`text-sm font-semibold ${darkMode ? "text-white" : "text-[#004B63]"}`}
            >
              No hay libros inteligentes aún
            </p>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              Pega un texto o sube un archivo para crear tu primer SmartBook
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {history.map((b, i) => (
              <HistoryItem
                key={b.id}
                book={b}
                i={i}
                dark={darkMode}
                onSelect={setView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SmartBookReader.displayName = "SmartBookReader";
export { SmartBookReader };
export default SmartBookReader;
