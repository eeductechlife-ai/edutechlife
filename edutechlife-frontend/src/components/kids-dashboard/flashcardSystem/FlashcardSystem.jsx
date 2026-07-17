import { memo } from "react";
import { motion } from "framer-motion";
import GenerateFlashcards from "../GenerateFlashcards";
import { useFlashcardDeck } from "./useFlashcardDeck";
import QuizCard from "./components/QuizCard";
import FlashcardResults from "./components/FlashcardResults";
import FlashcardImporter from "./components/FlashcardImporter";

const DeckCard = memo(({ deck, onStudy, onEdit, onDelete, index }) => {
  const themeColor = deck.metadata?.theme?.color || "#4DA8C4";
  const themeIcon = deck.metadata?.theme?.icon || "📚";
  const gradeLabel = deck.metadata?.grade
    ? {
        "1-3": "6-8 años",
        "4-6": "9-11 años",
        "7-9": "12-14 años",
        "10-12": "15-16+",
      }[deck.metadata.grade]
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl bg-white border-2 shadow-sm hover:shadow-md transition-all"
      style={{ borderColor: themeColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{themeIcon}</span>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[#004B63] truncate">{deck.title}</h4>
            {deck.description && (
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {deck.description}
              </p>
            )}
          </div>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0"
          style={{ backgroundColor: themeColor + "20", color: themeColor }}
        >
          {deck.cards.length} tarjetas
        </span>
      </div>

      {gradeLabel && (
        <div className="mb-3">
          <span
            className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: themeColor }}
          >
            👤 {gradeLabel}
          </span>
        </div>
      )}

      {deck.stats?.totalStudied > 0 && (
        <div className="flex gap-3 mb-3 text-xs text-[#64748B]">
          <span>📊 {deck.stats.totalStudied} estudiadas</span>
          <span>✅ {deck.stats.correct} correctas</span>
          <span>🔥 {deck.stats.streak || 0} racha</span>
        </div>
      )}

      <div className="flex gap-2">
        <motion.button
          onClick={() => onStudy(deck.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-2 text-white rounded-xl font-bold text-sm shadow-md"
          style={{
            backgroundImage: `linear-gradient(135deg, ${themeColor}, ${themeColor}80)`,
          }}
        >
          📖 Estudiar
        </motion.button>
        <motion.button
          onClick={() => onEdit(deck.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm"
        >
          ✏️
        </motion.button>
        <motion.button
          onClick={() => onDelete(deck.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-white border border-red-200 text-red-400 rounded-xl text-sm"
        >
          🗑️
        </motion.button>
      </div>
    </motion.div>
  );
});
DeckCard.displayName = "DeckCard";

const GRADE_LABELS = {
  "1-3": "6-8 años",
  "4-6": "9-11 años",
  "7-9": "12-14 años",
  "10-12": "15-16+",
};

const FlashcardSystem = memo(() => {
  const {
    decks,
    mode,
    setMode,
    currentDeckId,
    setCurrentDeckId,
    deckTitle,
    setDeckTitle,
    deckDescription,
    setDeckDescription,
    frontText,
    setFrontText,
    backText,
    setBackText,
    cardIdx,
    setCardIdx,
    flipped,
    setFlipped,
    correct,
    setCorrect,
    incorrect,
    setIncorrect,
    done,
    setDone,
    multiplayerMode,
    score1,
    score2,
    mpCurrentPlayer,
    deck,
    rate,
    saveDecks,
    createDeck,
    handleGenerateFlashcards,
    addCard,
    deleteDeck,
    startStudy,
    handleResult,
    startMultiplayer,
  } = useFlashcardDeck();

  if (mode === "quiz" && deck) {
    if (done) {
      return (
        <FlashcardResults
          rate={rate}
          correct={correct}
          incorrect={incorrect}
          onRestart={() => startStudy(currentDeckId)}
          onBack={() => setMode("decks")}
        />
      );
    }

    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#004B63]">
              📖 {deck.title}
            </h3>
            <motion.button
              onClick={() => setMode("decks")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm text-[#64748B] hover:text-[#004B63]"
            >
              ✕ Cerrar
            </motion.button>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              initial={{ width: 0 }}
              animate={{
                width: `${((cardIdx + 1) / deck.cards.length) * 100}%`,
              }}
            />
          </div>
          <QuizCard
            card={deck.cards[cardIdx]}
            flipped={flipped}
            onFlip={() => setFlipped((prev) => !prev)}
            onResult={handleResult}
            idx={cardIdx}
            total={deck.cards.length}
            themeColor={deck.metadata?.theme?.color}
            themeIcon={deck.metadata?.theme?.icon}
            gradeLabel={
              deck.metadata?.grade
                ? GRADE_LABELS[deck.metadata.grade]
                : ""
            }
          />
        </motion.div>
        {multiplayerMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-4 right-4 z-50 flex gap-3"
          >
            <div
              className={`p-3 rounded-xl shadow-lg text-center ${mpCurrentPlayer === 1 ? "ring-2 ring-[#4DA8C4] bg-white" : "bg-white/80"}`}
            >
              <p className="text-[10px] font-semibold text-[#64748B]">J1</p>
              <p className="text-lg font-black text-[#004B63]">{score1}</p>
            </div>
            <div
              className={`p-3 rounded-xl shadow-lg text-center ${mpCurrentPlayer === 2 ? "ring-2 ring-[#FF6B9D] bg-white" : "bg-white/80"}`}
            >
              <p className="text-[10px] font-semibold text-[#64748B]">J2</p>
              <p className="text-lg font-black text-[#004B63]">{score2}</p>
            </div>
          </motion.div>
        )}
      </>
    );
  }

  if (mode === "editor") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#004B63]">
            {deck ? "✏️ Editar mazo" : "🆕 Nuevo mazo"}
          </h3>
          <button
            onClick={() => {
              setMode("decks");
              setCurrentDeckId(null);
            }}
            className="text-sm text-[#64748B] hover:text-[#004B63]"
          >
            ✕ Cerrar
          </button>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              Nombre del mazo
            </label>
            <input
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              placeholder="Ej: Vocabulario Inglés"
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              Descripción
            </label>
            <input
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              placeholder="Ej: Palabras básicas para el examen"
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <motion.button
            onClick={createDeck}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
          >
            {deck ? "💾 Guardar cambios" : "➕ Crear mazo"}
          </motion.button>
        </div>
        {deck && (
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="font-bold text-[#004B63]">
              Tarjetas ({deck.cards.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {deck.cards.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <p className="text-sm font-semibold text-[#004B63]">
                    {c.front}
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">{c.back}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <h5 className="text-sm font-semibold text-[#004B63]">
                Agregar tarjeta
              </h5>
              <input
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="Frente (pregunta)"
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <input
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder="Reverso (respuesta)"
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <motion.button
                onClick={addCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-xl font-bold text-sm"
              >
                ➕ Agregar tarjeta
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#004B63]">
          🎴 Mis Mazos de Estudio
        </h3>
        {decks.length > 0 && (
          <motion.button
            onClick={() => {
              setDeckTitle("");
              setDeckDescription("");
              setCurrentDeckId(null);
              setMode("editor");
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
          >
            + Nuevo mazo
          </motion.button>
        )}
      </div>

      <GenerateFlashcards onGenerated={handleGenerateFlashcards} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map((d, i) => (
          <DeckCard
            key={d.id}
            deck={d}
            index={i}
            onStudy={startStudy}
            onEdit={(id) => {
              setCurrentDeckId(id);
              const d2 = decks.find((x) => x.id === id);
              if (d2) {
                setDeckTitle(d2.title);
                setDeckDescription(d2.description || "");
              }
              setMode("editor");
            }}
            onDelete={deleteDeck}
          />
        ))}
      </div>

      {decks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <span className="text-6xl mb-4 block">📚</span>
          <p className="text-[#64748B]">Aún no tienes mazos de estudio</p>
          <p className="text-sm text-[#64748B] mt-2">
            ¡Crea tu primer mazo para empezar a estudiar!
          </p>
        </motion.div>
      )}

      {decks.length > 0 && (
        <FlashcardImporter
          decks={decks}
          saveDecks={saveDecks}
          onStartMultiplayer={startMultiplayer}
        />
      )}
    </motion.div>
  );
});

FlashcardSystem.displayName = "FlashcardSystem";

export default FlashcardSystem;
