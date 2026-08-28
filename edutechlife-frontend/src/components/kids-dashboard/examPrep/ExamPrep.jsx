import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExamPrep from "./useExamPrep";
import ExamForm from "./components/ExamForm";
import ExamList from "./components/ExamList";
import ExamDetail from "./components/ExamDetail";
import DeckQuiz from "./components/DeckQuiz";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";

const ExamPrep = memo(({ onTabChange }) => {
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

  return (
    <div className="space-y-6">
      {/* Active deck quick quiz */}
      {activeStudyDeck && !showDeckQuiz && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white space-y-3"
        >
          <div>
            <p className="text-xs text-white/70 mb-1">
              {t("kid.flashcards.active_deck")}
            </p>
            <p className="font-bold">{activeStudyDeck.title}</p>
            <p className="text-xs text-white/70">
              {t("kid.exam.cards_ready", {
                count: activeStudyDeck.cards.length,
              })}
            </p>
          </div>
          {/* Sincronización: navegación a Dani sobre el mismo tema */}
          <button
            onClick={() => onTabChange?.("oral")}
            className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-all"
          >
            🗣️ Hablar con Dani sobre esto
          </button>
          <motion.button
            onClick={() => setShowDeckQuiz(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors"
          >
            {t("kid.exam.take_deck_exam")}
          </motion.button>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-[#004B63]">
              {t("kid.exam.title")}
            </h3>
            {mode === "form" ? (
              <motion.button
                onClick={() => setMode("list")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 text-sm rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
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
                  boxShadow: "0 8px 20px rgba(77,168,196,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-1.5 text-sm rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-semibold shadow-md"
              >
                {t("kid.exam.new")}
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
                  const btn = document.getElementById("openDaniChat");
                  if (btn) btn.click();
                }}
                onUploadMaterial={handleUploadMaterial}
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
