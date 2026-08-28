import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useChallengeEngine } from "./useChallengeEngine";
import ChallengeSetup from "./ChallengeSetup";
import ChallengePlay from "./ChallengePlay";
import ChallengeResults from "./ChallengeResults";

const ChallengeEngine = memo(({ onTabChange }) => {
  const { darkMode } = useSmartBoardKids();
  const engine = useChallengeEngine();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          🎯
        </span>
        <div>
          <h2
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
          >
            Retos Inteligentes
          </h2>
          <p
            className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Pon a prueba lo que sabes y gana XP
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {engine.phase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
              onTabChange={onTabChange}
              darkMode={darkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ChallengeEngine.displayName = "ChallengeEngine";
export default ChallengeEngine;
