import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useChallengeEngine } from "./useChallengeEngine";
import ChallengeSetup from "./ChallengeSetup";
import ChallengePlay from "./ChallengePlay";
import ChallengeResults from "./ChallengeResults";
import ExamPrep from "../examPrep/ExamPrep";

const EXPLORE_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

const MODE_TABS = [
  { id: "retos", label: "Retos", emoji: "⚡" },
  { id: "examenes", label: "Examen", emoji: "📝" },
];

const ChallengeEngine = memo(({ onTabChange }) => {
  const { darkMode } = useIngenIAKids();
  const engine = useChallengeEngine();
  const [activeMode, setActiveMode] = useState("retos");

  const handleModeChange = (modeId) => {
    setActiveMode(modeId);
    // Reset challenge state when switching back to retos
    if (modeId === "retos" && engine.phase !== "setup") {
      engine.resetChallenge?.();
    }
  };

  return (
    <div data-typo="intended" className="space-y-5 max-w-2xl mx-auto">
      {/* Mode switch: retos vs formal exam — hidden mid-challenge to avoid accidental exits */}
      {engine.phase !== "playing" && (
        <div
          className={`flex p-1 rounded-2xl ${darkMode ? "bg-[#1E293B]" : "bg-[#EEF2F6]"}`}
          role="tablist"
          aria-label="Tipo de práctica"
        >
          {MODE_TABS.map((tab) => {
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleModeChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? "text-white shadow-md"
                    : darkMode
                      ? "text-[#94A3B8]"
                      : "text-[#64748B]"
                }`}
                style={active ? { background: EXPLORE_GRADIENT } : {}}
              >
                <span aria-hidden="true">{tab.emoji}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content — Retos mode */}
      {activeMode === "retos" && (
        <AnimatePresence mode="wait">
          {engine.phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <ChallengeSetup
                subject={engine.subject}
                setSubject={engine.setSubject}
                difficulty={engine.difficulty}
                setDifficulty={engine.setDifficulty}
                onStart={engine.startChallenge}
                loading={engine.loading}
                error={engine.error}
                darkMode={darkMode}
                subjects={engine.CHALLENGE_SUBJECTS}
                difficulties={engine.DIFFICULTIES}
              />
            </motion.div>
          )}

          {engine.phase === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <ChallengePlay
                question={engine.questions[engine.currentIndex]}
                currentIndex={engine.currentIndex}
                total={engine.questions.length}
                onAnswer={engine.submitAnswer}
                lastAnswer={
                  engine.answers.length > 0
                    ? engine.answers[engine.answers.length - 1]
                    : null
                }
                darkMode={darkMode}
                subject={engine.subject}
                timeLimit={engine.timeLimit}
                onExit={engine.resetChallenge}
              />
            </motion.div>
          )}

          {engine.phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChallengeResults
                score={engine.score}
                answers={engine.answers}
                questions={engine.questions}
                difficulty={engine.difficulty}
                subject={engine.subject}
                onRetry={engine.resetChallenge}
                onEasier={() => {
                  engine.setDifficulty(engine.DIFFICULTIES[0]);
                  engine.resetChallenge();
                }}
                onTabChange={onTabChange}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Content — Exam mode */}
      {activeMode === "examenes" && (
        <motion.div
          key="examenes"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <ExamPrep onTabChange={onTabChange} dm={darkMode} />
        </motion.div>
      )}
    </div>
  );
});

ChallengeEngine.displayName = "ChallengeEngine";
export default ChallengeEngine;
