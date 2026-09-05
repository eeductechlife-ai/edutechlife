import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
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
  const { darkMode } = useSmartBoardKids();
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
    <div className="space-y-6">
      {/* Section header banner with mode tabs */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: EXPLORE_GRADIENT }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <span className="text-2xl">
                {activeMode === "retos" ? "⚡" : "📝"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white drop-shadow-sm">
                {activeMode === "retos" ? "Retos Inteligentes" : "Modo Examen"}
              </h3>
              <p className="text-xs text-white/80">
                {activeMode === "retos"
                  ? "Pon a prueba lo que sabes y gana XP"
                  : "Simulacros, materiales y práctica formal"}
              </p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2">
            {MODE_TABS.map((tab) => {
              const active = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleModeChange(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-white text-[#7B2FF7] shadow-md"
                      : "bg-white/15 text-white/80 hover:bg-white/25"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%,-30%)",
          }}
        />
      </div>

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
              {/* Switch to exam mode inline */}
              <button
                type="button"
                onClick={() => setActiveMode("examenes")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                  darkMode
                    ? "border-[#334155] text-[#64748B] hover:text-white hover:border-[#475569]"
                    : "border-[#E2E8F0] text-[#94A3B8] hover:text-[#1E293B] hover:border-[#CBD5E1]"
                }`}
              >
                📝 Prefieres simular un examen formal →
              </button>
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
