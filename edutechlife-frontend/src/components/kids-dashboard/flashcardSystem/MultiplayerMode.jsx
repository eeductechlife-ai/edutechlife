import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateMultiplayerScore,
  getMultiplayerWinner,
} from "./multiplayerFlashcards";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

const COLORS = {
  primary: "#004B63",
  accent: "#4DA8C4",
  teal: "#66CCCC",
  gold: "#FFD166",
  pink: "#FF6B9D",
  muted: "#64748B",
  bg: "#F1F5F9",
};

const PHASES = { SETUP: "setup", PLAYING: "playing", RESULTS: "results" };

const PlayerBadge = ({ name, score, active, color, darkMode }) => (
  <motion.div
    animate={{
      scale: active ? 1.05 : 0.95,
      opacity: active ? 1 : 0.6,
    }}
    className={`flex-1 p-3 rounded-2xl text-center transition-shadow ${
      active ? "shadow-lg ring-2" : "shadow-sm"
    } ${darkMode ? "bg-slate-700" : "bg-white"}`}
    style={{
      ringColor: active ? color : "transparent",
      borderColor: active ? color : "transparent",
    }}
  >
    <p
      className="text-xs font-semibold mb-1"
      style={{ color: darkMode ? "#CBD5E1" : COLORS.muted }}
    >
      {name}
    </p>
    <p className="text-2xl font-black" style={{ color }}>
      {score}
    </p>
  </motion.div>
);

const SetupScreen = ({ onStart, darkMode }) => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[${COLORS.accent}] ${
    darkMode
      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center">
        <span className="text-5xl block mb-3">🆚</span>
        <h3
          className="text-xl font-black"
          style={{ color: darkMode ? "#F1F5F9" : COLORS.primary }}
        >
          Modo Multijugador
        </h3>
        <p
          className="text-sm mt-1"
          style={{ color: darkMode ? "#94A3B8" : COLORS.muted }}
        >
          Juega por turnos en el mismo dispositivo
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label
            className="text-xs font-bold mb-1 block"
            style={{ color: COLORS.accent }}
          >
            Jugador 1
          </label>
          <input
            type="text"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Nombre del jugador 1"
            className={inputClass}
            maxLength={20}
          />
        </div>
        <div>
          <label
            className="text-xs font-bold mb-1 block"
            style={{ color: COLORS.pink }}
          >
            Jugador 2
          </label>
          <input
            type="text"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Nombre del jugador 2"
            className={inputClass}
            maxLength={20}
          />
        </div>
      </div>

      <motion.button
        onClick={() =>
          onStart(p1.trim() || "Jugador 1", p2.trim() || "Jugador 2")
        }
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 rounded-2xl text-white font-black text-base shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.teal})`,
        }}
      >
        Empezar partida
      </motion.button>
    </motion.div>
  );
};

const ResultsScreen = ({
  p1Name,
  p2Name,
  score1,
  score2,
  totalCards,
  onPlayAgain,
  onExit,
  darkMode,
}) => {
  const winner = getMultiplayerWinner(score1, score2);
  const winnerName = winner === 1 ? p1Name : winner === 2 ? p2Name : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-md mx-auto text-center"
    >
      <motion.span
        className="text-6xl block"
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {winner === 0 ? "🤝" : "🏆"}
      </motion.span>

      <h3
        className="text-xl font-black"
        style={{ color: darkMode ? "#F1F5F9" : COLORS.primary }}
      >
        {winner === 0 ? "¡Empate!" : `¡${winnerName} gana!`}
      </h3>

      <div className="flex gap-3">
        <PlayerBadge
          name={p1Name}
          score={score1}
          active={winner === 1}
          color={COLORS.accent}
          darkMode={darkMode}
        />
        <PlayerBadge
          name={p2Name}
          score={score2}
          active={winner === 2}
          color={COLORS.pink}
          darkMode={darkMode}
        />
      </div>

      <p
        className="text-sm"
        style={{ color: darkMode ? "#94A3B8" : COLORS.muted }}
      >
        {totalCards} tarjetas jugadas
      </p>

      <div className="flex gap-3">
        <motion.button
          onClick={onPlayAgain}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm shadow-md"
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.teal})`,
          }}
        >
          Jugar de nuevo
        </motion.button>
        <motion.button
          onClick={onExit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm border ${
            darkMode
              ? "border-slate-600 text-slate-300"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Salir
        </motion.button>
      </div>
    </motion.div>
  );
};

const MultiplayerMode = memo(({ cards, deckTitle, onExit, darkMode }) => {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [p1Name, setP1Name] = useState("Jugador 1");
  const [p2Name, setP2Name] = useState("Jugador 2");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentCard = cards?.[cardIdx];
  const isLastCard = cardIdx >= (cards?.length || 0) - 1;
  const playerColor = currentPlayer === 1 ? COLORS.accent : COLORS.pink;
  const playerName = currentPlayer === 1 ? p1Name : p2Name;

  const handleStart = useCallback((name1, name2) => {
    setP1Name(name1);
    setP2Name(name2);
    setPhase(PHASES.PLAYING);
    setCurrentPlayer(1);
    setScore1(0);
    setScore2(0);
    setCardIdx(0);
    setFlipped(false);
  }, []);

  const handleAnswer = useCallback(
    (known) => {
      const result = updateMultiplayerScore(
        known,
        currentPlayer,
        score1,
        score2,
      );
      setScore1(result.score1);
      setScore2(result.score2);

      if (isLastCard && result.nextPlayer === 1) {
        // Both players answered the last card
        const winner = getMultiplayerWinner(result.score1, result.score2);
        track(EVENTS.ACTIVITY_COMPLETED, {
          type: "multiplayer_flashcard",
          deck: deckTitle,
          winner: winner === 1 ? p1Name : winner === 2 ? p2Name : "tie",
          score1: result.score1,
          score2: result.score2,
          total_cards: cards?.length || 0,
        });
        setPhase(PHASES.RESULTS);
        return;
      }

      setCurrentPlayer(result.nextPlayer);
      setFlipped(false);
      if (result.nextPlayer === 1) {
        setCardIdx((i) => i + 1);
      }
    },
    [
      currentPlayer,
      score1,
      score2,
      isLastCard,
      deckTitle,
      p1Name,
      p2Name,
      cards,
    ],
  );

  const handlePlayAgain = useCallback(() => {
    handleStart(p1Name, p2Name);
  }, [handleStart, p1Name, p2Name]);

  if (!cards?.length) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl block mb-3">📭</span>
        <p style={{ color: darkMode ? "#94A3B8" : COLORS.muted }}>
          No hay tarjetas en este mazo
        </p>
        <motion.button
          onClick={onExit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-6 py-2 rounded-xl text-sm font-bold"
          style={{ color: COLORS.accent }}
        >
          Volver
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-bold"
          style={{ color: darkMode ? "#F1F5F9" : COLORS.primary }}
        >
          🆚 Multijugador
        </h3>
        <motion.button
          onClick={onExit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm"
          style={{ color: darkMode ? "#94A3B8" : COLORS.muted }}
        >
          ✕ Salir
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {phase === PHASES.SETUP && (
          <SetupScreen key="setup" onStart={handleStart} darkMode={darkMode} />
        )}

        {phase === PHASES.PLAYING && currentCard && (
          <motion.div
            key={`play-${cardIdx}-${currentPlayer}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
          >
            {/* Scoreboard */}
            <div className="flex gap-3">
              <PlayerBadge
                name={p1Name}
                score={score1}
                active={currentPlayer === 1}
                color={COLORS.accent}
                darkMode={darkMode}
              />
              <PlayerBadge
                name={p2Name}
                score={score2}
                active={currentPlayer === 2}
                color={COLORS.pink}
                darkMode={darkMode}
              />
            </div>

            {/* Turn indicator */}
            <motion.div
              className="text-center py-2 rounded-xl font-bold text-sm text-white"
              style={{ backgroundColor: playerColor }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.5 }}
            >
              Turno de {playerName} — Tarjeta {cardIdx + 1}/{cards.length}
            </motion.div>

            {/* Progress bar */}
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                darkMode ? "bg-slate-700" : "bg-slate-200"
              }`}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.teal})`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${((cardIdx + 1) / cards.length) * 100}%`,
                }}
              />
            </div>

            {/* Card */}
            <motion.div
              onClick={() => setFlipped((f) => !f)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative cursor-pointer rounded-2xl p-6 min-h-[180px] flex items-center justify-center shadow-lg border ${
                darkMode
                  ? "bg-slate-800 border-slate-600"
                  : "bg-white border-slate-100"
              }`}
              style={{ perspective: 600 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={flipped ? "back" : "front"}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-center w-full"
                >
                  <p
                    className="text-[10px] font-semibold mb-2"
                    style={{ color: darkMode ? "#64748B" : COLORS.muted }}
                  >
                    {flipped ? "RESPUESTA" : "PREGUNTA"}
                  </p>
                  <p
                    className="text-base sm:text-lg font-bold leading-relaxed"
                    style={{
                      color: darkMode ? "#E2E8F0" : COLORS.primary,
                    }}
                  >
                    {flipped
                      ? currentCard.back ||
                        currentCard.answer ||
                        currentCard.definition ||
                        ""
                      : currentCard.front ||
                        currentCard.question ||
                        currentCard.term ||
                        ""}
                  </p>
                  {!flipped && (
                    <p
                      className="text-xs mt-3"
                      style={{ color: darkMode ? "#475569" : "#CBD5E1" }}
                    >
                      Toca para voltear
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Answer buttons — only visible when flipped */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3"
                >
                  <motion.button
                    onClick={() => handleAnswer(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.accent})`,
                    }}
                  >
                    ✓ La sé
                  </motion.button>
                  <motion.button
                    onClick={() => handleAnswer(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.pink}, #FF8FAF)`,
                    }}
                  >
                    ✗ No la sé
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === PHASES.RESULTS && (
          <ResultsScreen
            key="results"
            p1Name={p1Name}
            p2Name={p2Name}
            score1={score1}
            score2={score2}
            totalCards={cards.length}
            onPlayAgain={handlePlayAgain}
            onExit={onExit}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

MultiplayerMode.displayName = "MultiplayerMode";

export default MultiplayerMode;
