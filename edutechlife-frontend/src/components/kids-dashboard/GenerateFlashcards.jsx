import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateFlashcards,
  detectThemeFromTopic,
} from "../../services/flashcardAI";
import { useTranslation } from "../../i18n/I18nProvider";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_GLOW = "#EF476F";

const GRADE_COLORS = {
  "1-3": {
    active: "linear-gradient(135deg, #F97316, #FB923C)",
    glow: "#F97316",
  },
  "4-6": { active: PRACTICE_GRADIENT, glow: PRACTICE_GLOW },
  "7-9": {
    active: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
    glow: "#8B5CF6",
  },
  "10-12": {
    active: "linear-gradient(135deg, #059669, #34D399)",
    glow: "#059669",
  },
};

export default function GenerateFlashcards({ onGenerated, darkMode = false }) {
  const { t } = useTranslation();
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("4-6");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const grades = [
    { value: "1-3", label: t("kid.flashcards.grade_label_1_3"), emoji: "🌱" },
    { value: "4-6", label: t("kid.flashcards.grade_label_4_6"), emoji: "📚" },
    { value: "7-9", label: t("kid.flashcards.grade_label_7_9"), emoji: "🔬" },
    {
      value: "10-12",
      label: t("kid.flashcards.grade_label_10_12"),
      emoji: "🎓",
    },
  ];

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

  const cardBg = darkMode ? "#1E293B" : "#ffffff";
  const borderStyle = darkMode
    ? "rgba(239,71,111,0.18)"
    : "rgba(239,71,111,0.15)";
  const bgTint = darkMode ? "rgba(239,71,111,0.06)" : "rgba(239,71,111,0.04)";
  const textPrimary = darkMode ? "#F1F5F9" : "#004B63";
  const textSecondary = darkMode ? "#94A3B8" : "#64748B";
  const inputBg = darkMode ? "#151F32" : "#F8FAFC";
  const inputBorder = darkMode ? "rgba(42,58,84,0.8)" : "#E2E8F0";
  const inputFocusBorder = "#FF6B9D";
  const gradeInactiveBg = darkMode ? "rgba(42,58,84,0.5)" : "#F8FAFC";
  const gradeInactiveBorder = darkMode ? "rgba(42,58,84,0.9)" : "#E2E8F0";

  return (
    <div
      className="p-5 rounded-2xl shadow-sm"
      style={{ background: bgTint, border: `1px solid ${borderStyle}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
          style={{
            background: PRACTICE_GRADIENT,
            boxShadow: `0 4px 12px ${PRACTICE_GLOW}35`,
          }}
        >
          🤖
        </span>
        <div>
          <p
            className="text-sm font-black leading-tight"
            style={{ color: textPrimary }}
          >
            {t("kid.flashcards.generate_title")}
          </p>
          <p className="text-[11px]" style={{ color: textSecondary }}>
            La IA genera 10 tarjetas para tu grado
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Grade selector */}
        <div>
          <label
            className="block text-[11px] font-bold uppercase tracking-wider mb-2"
            style={{ color: textSecondary }}
          >
            {t("kid.flashcards.select_grade")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {grades.map((g) => {
              const isActive = grade === g.value;
              const colors = GRADE_COLORS[g.value];
              return (
                <motion.button
                  key={g.value}
                  onClick={() => setGrade(g.value)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                  style={
                    isActive
                      ? {
                          background: colors.active,
                          color: "#fff",
                          boxShadow: `0 4px 12px ${colors.glow}35`,
                          border: "1px solid transparent",
                        }
                      : {
                          background: gradeInactiveBg,
                          border: `1px solid ${gradeInactiveBorder}`,
                          color: textSecondary,
                        }
                  }
                >
                  <span>{g.emoji}</span>
                  <span>{g.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Topic input + generate button */}
        <div className="flex gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder={t("kid.flashcards.topic_placeholder")}
            disabled={generating}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all disabled:opacity-50"
            style={{
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              color: textPrimary,
            }}
            onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
            onBlur={(e) => (e.target.style.borderColor = inputBorder)}
          />
          <motion.button
            onClick={handleGenerate}
            disabled={!topic.trim() || generating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 text-white rounded-xl font-bold text-sm shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ background: PRACTICE_GRADIENT }}
          >
            {generating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t("kid.flashcards.generating")}
              </>
            ) : (
              <>✨ {t("kid.flashcards.generate_btn")}</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Generating skeleton */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{
                    background: darkMode ? "rgba(42,58,84,0.4)" : "#F8FAFC",
                    border: `1px solid ${gradeInactiveBorder}`,
                  }}
                >
                  <div
                    className="h-2.5 w-10 rounded animate-pulse mb-2"
                    style={{ background: darkMode ? "#2A3A54" : "#E2E8F0" }}
                  />
                  <div
                    className="h-3 w-full rounded animate-pulse mb-1"
                    style={{ background: darkMode ? "#2A3A54" : "#E2E8F0" }}
                  />
                  <div
                    className="h-3 w-3/4 rounded animate-pulse"
                    style={{ background: darkMode ? "#2A3A54" : "#E2E8F0" }}
                  />
                </div>
              ))}
            </div>
            <p
              className="text-[11px] mt-2 text-center"
              style={{ color: textSecondary }}
            >
              {t("kid.flashcards.generating_for", {
                grade: grades.find((g) => g.value === grade)?.label,
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center justify-between p-3 rounded-xl"
            style={{
              background: "rgba(239,71,111,0.08)",
              border: "1px solid rgba(239,71,111,0.25)",
            }}
          >
            <p className="text-sm text-[#EF476F] flex-1 mr-2">{error}</p>
            <motion.button
              onClick={handleGenerate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 text-white rounded-lg text-xs font-bold flex-shrink-0"
              style={{ background: PRACTICE_GRADIENT }}
            >
              {t("kid.flashcards.retry")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
