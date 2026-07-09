import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping";
import {
  generateFlashcards,
  detectThemeFromTopic,
} from "../../services/flashcardAI";

export default function GenerateFlashcards({ onGenerated }) {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("4-6");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const cards = await generateFlashcards(topic, grade);
      const theme = detectThemeFromTopic(topic);
      onGenerated(topic.trim(), cards, { grade, theme });
      setTopic("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const grades = [
    {
      value: "1-3",
      label: "1-3 (6-8 años)",
      color: "from-pink-400 to-rose-400",
    },
    {
      value: "4-6",
      label: "4-6 (9-11 años)",
      color: "from-blue-400 to-cyan-400",
    },
    {
      value: "7-9",
      label: "7-9 (12-14 años)",
      color: "from-purple-400 to-indigo-400",
    },
    {
      value: "10-12",
      label: "10-12 (15-16+)",
      color: "from-emerald-400 to-teal-400",
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#004B63]/5 to-[#4DA8C4]/5 border border-[#4DA8C4]/20 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="fa-brain" className="w-5 h-5 text-[#4DA8C4]" />
        <h4 className="font-bold text-[#004B63]">
          Generar Mazo Inteligente con IA
        </h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[#004B63] mb-2">
            Selecciona el grado del estudiante:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {grades.map((g) => (
              <motion.button
                key={g.value}
                onClick={() => setGrade(g.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  grade === g.value
                    ? `bg-gradient-to-r ${g.color} text-white shadow-md`
                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]"
                }`}
              >
                {g.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Ej: Fotosíntesis, Verbos en inglés, Tabla periódica..."
            disabled={generating}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#004B63] placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 bg-white disabled:opacity-50"
          />
          <motion.button
            onClick={handleGenerate}
            disabled={!topic.trim() || generating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <Icon name="fa-spinner" className="w-4 h-4 animate-spin" />
                Generando...
              </span>
            ) : (
              <span className="flex items-center gap-2">✨ Generar Mazo</span>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/80 border border-[#E2E8F0]"
                >
                  <div className="h-3 w-16 bg-[#E2E8F0] rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-[#E2E8F0] rounded animate-pulse mb-1" />
                  <div className="h-4 w-3/4 bg-[#E2E8F0] rounded animate-pulse" />
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Generando 10 flashcards adaptadas para{" "}
              {grades.find((g) => g.value === grade)?.label}...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200"
          >
            <div className="flex items-center gap-2 text-sm text-red-600">
              <Icon name="fa-circle-exclamation" className="w-4 h-4 shrink-0" />
              {error}
            </div>
            <motion.button
              onClick={handleGenerate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
            >
              Reintentar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
