import { useState, useEffect, useMemo } from "react";
import { buildSubjectList } from "./practicarHub/practicarConfig";
import { gradeTopics } from "./practicarHub/materialPrompts";
import { gradeBand } from "./flashcardSystem/gradeBand";
import {
  peekHandoff,
  clearHandoff,
  HANDOFF_FLASHCARDS_TOPIC,
} from "./practicarHub/practicarHandoff";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateFlashcards,
  detectThemeFromTopic,
} from "../../services/flashcardAI";
import { useTranslation } from "../../i18n/I18nProvider";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_GLOW = "#EF476F";

export default function GenerateFlashcards({ onGenerated, darkMode = false }) {
  const { t } = useTranslation();
  const [topic, setTopic] = useState(
    () => peekHandoff(HANDOFF_FLASHCARDS_TOPIC) || "",
  );
  useEffect(() => clearHandoff(HANDOFF_FLASHCARDS_TOPIC), []);
  const { gradeLevel, studentAge, subjectsWithGrades } = useIngenIAKids();
  const grade = gradeBand(gradeLevel, studentAge);
  // Ready-made topics from the kid's own grade (MEN DBA), weakest subjects
  // first, so nobody is stuck in front of an empty box.
  const ideas = useMemo(() => {
    if (!gradeLevel) return [];
    const subjects = buildSubjectList(subjectsWithGrades || []);
    const ordered = [
      ...subjects.filter((s) => s.weak),
      ...subjects.filter((s) => !s.weak),
    ];
    return ordered
      .map((s) => ({ emoji: s.emoji, text: gradeTopics(s.id, gradeLevel)[0] }))
      .filter((x) => x.text)
      .slice(0, 3);
  }, [gradeLevel, subjectsWithGrades]);
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
            {gradeLevel
              ? `La IA crea 10 tarjetas para tu grado ${gradeLevel}°`
              : "La IA crea 10 tarjetas para tu nivel"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Topic input + generate button */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder={t("kid.flashcards.topic_placeholder")}
            disabled={generating}
            className="flex-1 min-w-0 px-4 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm focus:outline-none transition-all disabled:opacity-50"
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
            className="px-4 py-3 sm:py-2.5 text-white rounded-xl font-bold text-sm shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            style={{ background: PRACTICE_GRADIENT }}
          >
            {generating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t("kid.flashcards.generating")}
              </>
            ) : (
              <>{t("kid.flashcards.generate_btn")}</>
            )}
          </motion.button>
        </div>
        {ideas.length > 0 && !topic.trim() && !generating && (
          <div className="space-y-1.5">
            <p
              className="text-[11px] font-black uppercase tracking-wide"
              style={{ color: textSecondary }}
            >
              💡 Ideas para ti
            </p>
            <div className="flex flex-col gap-1.5">
              {ideas.map((idea) => (
                <button
                  key={idea.text}
                  type="button"
                  onClick={() => setTopic(idea.text)}
                  className="w-full min-h-[40px] !flex items-center !justify-start gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textPrimary,
                  }}
                >
                  <span aria-hidden="true">{idea.emoji}</span>
                  <span className="truncate">{idea.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
                grade: gradeLevel ? `${gradeLevel}°` : grade,
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
