import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExamPrep from "./useExamPrep";
import ExamForm from "./components/ExamForm";
import ExamList from "./components/ExamList";
import ExamDetail from "./components/ExamDetail";
import DeckQuiz from "./components/DeckQuiz";
import { PRACTICE_GRADIENT, PRACTICE_GLOW } from "./examUtils";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";

const ExamPrep = memo(({ onTabChange, dm = false }) => {
  const { t } = useTranslation();
  const { activeStudyDeck } = useSmartBoardKids();
  const [showDeckQuiz, setShowDeckQuiz] = useState(false);
  const {
    mode,
    setMode,
    detailId,
    setDetailId,
    name,
    setName,
    subject,
    setSubject,
    date,
    setDate,
    grade,
    setGrade,
    addExam,
    deleteExam,
    handleUploadMaterial,
    sorted,
    detailExam,
    tips,
    detailMaterials,
    setDocumentForDani,
  } = useExamPrep();

  const cardBg = dm ? "#1A2744" : "#ffffff";
  const cardBorder = dm ? "#243152" : "#F1F5F9";
  const textPrimary = dm ? "#E2F0FF" : "#1E293B";
  const textSecondary = dm ? "#94A3B8" : "#64748B";

  return (
    <div className="space-y-5">
      {/* Active deck quick quiz banner */}
      {activeStudyDeck && !showDeckQuiz && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl text-white space-y-3"
          style={{
            background: PRACTICE_GRADIENT,
            boxShadow: `0 8px 24px ${PRACTICE_GLOW}30`,
          }}
        >
          <div>
            <p className="text-xs text-white/70 mb-0.5">
              {t("kid.flashcards.active_deck")}
            </p>
            <p className="font-bold text-base">{activeStudyDeck.title}</p>
            <p className="text-xs text-white/75">
              {t("kid.exam.cards_ready", {
                count: activeStudyDeck.cards.length,
              })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onTabChange?.("oral")}
              className="flex-1 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              🗣️ {t("oral.talk_with_dani") || "Hablar con Dani sobre esto"}
            </button>
            <motion.button
              onClick={() => setShowDeckQuiz(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              📝 {t("kid.exam.take_deck_exam")}
            </motion.button>
          </div>
        </motion.div>
      )}

      {showDeckQuiz && activeStudyDeck ? (
        <DeckQuiz
          deck={activeStudyDeck}
          onFinish={() => setShowDeckQuiz(false)}
          onTabChange={onTabChange}
        />
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
              📝 {t("kid.exam.title")}
            </h3>
            {mode === "form" ? (
              <motion.button
                onClick={() => setMode("list")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 text-sm rounded-xl transition-colors"
                style={{
                  border: `1px solid ${cardBorder}`,
                  color: textSecondary,
                  background: dm ? "rgba(42,58,84,0.3)" : "#F8FAFC",
                }}
              >
                {t("kid.exam.cancel")}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  setMode("form");
                  setDetailId(null);
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 8px 20px ${PRACTICE_GLOW}30`,
                }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-1.5 text-sm rounded-xl text-white font-semibold shadow-md"
                style={{ background: PRACTICE_GRADIENT }}
              >
                + {t("kid.exam.new")}
              </motion.button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === "form" && (
              <ExamForm
                key="form"
                n={name}
                sN={setName}
                s={subject}
                sS={setSubject}
                d={date}
                sD={setDate}
                g={grade}
                sG={setGrade}
                onAdd={addExam}
                dm={dm}
              />
            )}

            {mode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExamList
                  exams={sorted}
                  onView={(e) => {
                    setDetailId(e.id);
                    setMode("detail");
                  }}
                  onDelete={deleteExam}
                  dm={dm}
                />
              </motion.div>
            )}

            {mode === "detail" && detailExam && (
              <ExamDetail
                key="detail"
                e={detailExam}
                tips={tips}
                materials={detailMaterials}
                onDelete={deleteExam}
                onBack={() => {
                  setMode("list");
                  setDetailId(null);
                }}
                onAskDani={() => {
                  setDocumentForDani({
                    type: "exam_prep",
                    exam: detailExam,
                    tips,
                    materials: detailMaterials,
                  });
                  document.getElementById("openDaniChat")?.click();
                }}
                onUploadMaterial={handleUploadMaterial}
                dm={dm}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
});

ExamPrep.displayName = "ExamPrep";
export { ExamPrep };
export default ExamPrep;
