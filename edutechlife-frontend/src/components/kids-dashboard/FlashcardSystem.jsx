import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import GenerateFlashcards from "./GenerateFlashcards";
const STORAGE_KEY = "edutechlife_flashcards";
const id = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const QuizCard = memo(
  ({
    card,
    flipped,
    onFlip,
    onResult,
    idx,
    total,
    themeColor,
    themeIcon,
    gradeLabel,
  }) => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-[#64748B]">
        {idx + 1} / {total}
      </p>
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px", maxWidth: "700px" }}
        onClick={onFlip}
      >
        <motion.div
          className="relative w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 shadow-lg p-8 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor || "#E2E8F0",
              minHeight: "420px",
            }}
          >
            <div className="flex flex-col items-center relative">
              {gradeLabel && (
                <span
                  className="absolute top-0 right-0 px-2 py-1 rounded-lg text-xs font-bold bg-opacity-10 text-white"
                  style={{ backgroundColor: themeColor, color: themeColor }}
                >
                  {gradeLabel}
                </span>
              )}
              <span className="text-5xl mb-6 mt-2">{themeIcon || "📚"}</span>
              <span
                className="text-xs font-semibold mb-3 block"
                style={{ color: themeColor || "#4DA8C4" }}
              >
                PALABRA CLAVE
              </span>
              <p className="text-3xl font-bold text-[#004B63] text-center">
                {card.front}
              </p>
            </div>
            <p className="text-xs text-[#64748B] text-center">
              Toca para ver la respuesta
            </p>
          </div>

          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 shadow-lg p-8 overflow-y-auto"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: themeColor || "#4DA8C4",
              minHeight: "420px",
              maxHeight: "500px",
            }}
          >
            <div className="space-y-6">
              <div>
                <span
                  className="text-sm font-bold block mb-3"
                  style={{ color: themeColor || "#66CCCC" }}
                >
                  📖 DEFINICIÓN
                </span>
                <p className="text-base font-semibold text-[#004B63] leading-relaxed">
                  {card.back}
                </p>
              </div>

              {card.example && (
                <div
                  className="border-t pt-4"
                  style={{ borderColor: themeColor + "30" }}
                >
                  <span
                    className="text-sm font-bold block mb-3"
                    style={{ color: themeColor || "#66CCCC" }}
                  >
                    💡 EJEMPLO
                  </span>
                  <p className="text-base text-[#404B5C] leading-relaxed">
                    {card.example}
                  </p>
                </div>
              )}

              {card.relatedTerms && card.relatedTerms.length > 0 && (
                <div
                  className="border-t pt-4"
                  style={{ borderColor: themeColor + "30" }}
                >
                  <span
                    className="text-sm font-bold block mb-3"
                    style={{ color: themeColor || "#66CCCC" }}
                  >
                    🔗 TÉRMINOS RELACIONADOS
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {card.relatedTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 rounded-lg text-sm font-semibold bg-opacity-20 text-white"
                        style={{
                          backgroundColor: themeColor,
                          color: themeColor,
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        {flipped && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-4"
          >
            <motion.button
              onClick={() => onResult(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border-2 border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50"
            >
              ❌ No Entendido
            </motion.button>
            <motion.button
              onClick={() => onResult(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-white rounded-xl font-bold text-sm shadow-md"
              style={{
                backgroundImage: `linear-gradient(to right, ${themeColor || "#4DA8C4"}, ${themeColor || "#66CCCC"}40)`,
              }}
            >
              ✅ Entendido
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ),
);
QuizCard.displayName = "QuizCard";

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

const FlashcardSystem = memo(() => {
  useSmartBoardKids();
  const [mode, setMode] = useState("decks");
  const [decks, setDecks] = useState([]);
  const [currentDeckId, setCurrentDeckId] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [mpCurrentPlayer, setMpCurrentPlayer] = useState(1);
  const [qIdx, setQIdx] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState("");

  useEffect(() => {
    setDecks(load());
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    } catch {}
  }, [decks]);

  const deck = useMemo(
    () => decks.find((d) => d.id === currentDeckId) || null,
    [decks, currentDeckId],
  );
  const saveDecks = useCallback((fn) => setDecks((prev) => fn(prev)), []);

  const createDeck = useCallback(() => {
    const title = deckTitle.trim();
    if (!title) return;
    saveDecks((prev) => [
      ...prev,
      {
        id: id(),
        title,
        description: deckDescription.trim(),
        cards: [],
        createdAt: new Date().toISOString(),
        stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 },
        metadata: {},
      },
    ]);
    setDeckTitle("");
    setDeckDescription("");
  }, [deckTitle, deckDescription, saveDecks]);

  const handleGenerateFlashcards = useCallback(
    (title, cards, metadata) => {
      if (!cards || cards.length === 0) return;
      saveDecks((prev) => [
        ...prev,
        {
          id: id(),
          title,
          description: `Mazo generado con IA - ${metadata.theme?.name || "General"}`,
          cards: cards.map((card) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            example: card.example,
            relatedTerms: card.relatedTerms,
          })),
          createdAt: new Date().toISOString(),
          stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 },
          metadata: metadata || {},
        },
      ]);
      setMode("decks");
    },
    [saveDecks],
  );

  const addCard = useCallback(() => {
    const front = frontText.trim(),
      back = backText.trim();
    if (!front || !back || !currentDeckId) return;
    saveDecks((prev) =>
      prev.map((d) =>
        d.id === currentDeckId
          ? { ...d, cards: [...d.cards, { id: id(), front, back }] }
          : d,
      ),
    );
    setFrontText("");
    setBackText("");
  }, [frontText, backText, currentDeckId, saveDecks]);

  const deleteDeck = useCallback(
    (id) => {
      saveDecks((prev) => prev.filter((d) => d.id !== id));
      if (currentDeckId === id) setCurrentDeckId(null);
    },
    [currentDeckId, saveDecks],
  );

  const startStudy = useCallback(
    (id) => {
      const d = decks.find((x) => x.id === id);
      if (!d || d.cards.length === 0) return;
      setCurrentDeckId(id);
      setCardIdx(0);
      setFlipped(false);
      setCorrect(0);
      setIncorrect(0);
      setDone(false);
      setMode("quiz");
    },
    [decks],
  );

  const handleResult = useCallback(
    (known) => {
      if (multiplayerMode) {
        if (mpCurrentPlayer === 1)
          setScore1((prev) => (known ? prev + 1 : prev));
        else setScore2((prev) => (known ? prev + 1 : prev));
        setMpCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      }
      if (known) setCorrect((prev) => prev + 1);
      else setIncorrect((prev) => prev + 1);
      const d = decks.find((x) => x.id === currentDeckId);
      if (!d) return;
      if (cardIdx + 1 >= d.cards.length) {
        setDone(true);
        saveDecks((prev) =>
          prev.map((x) =>
            x.id === currentDeckId
              ? {
                  ...x,
                  stats: {
                    totalStudied: (x.stats?.totalStudied || 0) + d.cards.length,
                    correct: (x.stats?.correct || 0) + (known ? 1 : 0),
                    incorrect: (x.stats?.incorrect || 0) + (known ? 0 : 1),
                    streak: known ? (x.stats?.streak || 0) + 1 : 0,
                  },
                }
              : x,
          ),
        );
      } else {
        setCardIdx((prev) => prev + 1);
        setFlipped(false);
      }
    },
    [
      currentDeckId,
      cardIdx,
      decks,
      saveDecks,
      multiplayerMode,
      mpCurrentPlayer,
    ],
  );

  const rate = useMemo(() => {
    const t = correct + incorrect;
    return t > 0 ? Math.round((correct / t) * 100) : 0;
  }, [correct, incorrect]);

  if (mode === "quiz" && deck) {
    if (done)
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-md text-center"
          >
            <span className="text-5xl block mb-4">🎉</span>
            <h3 className="text-lg font-bold text-[#004B63] mb-2">
              ¡Estudio completado!
            </h3>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-4">
              <div className="p-3 rounded-xl bg-[#66CCCC]/10">
                <p className="text-2xl font-black text-[#004B63]">{rate}%</p>
                <p className="text-xs text-[#64748B]">Correctas</p>
              </div>
              <div className="p-3 rounded-xl bg-[#4DA8C4]/10">
                <p className="text-2xl font-black text-[#004B63]">
                  {correct + incorrect}
                </p>
                <p className="text-xs text-[#64748B]">Revisadas</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              <motion.button
                onClick={() => startStudy(currentDeckId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
              >
                🔄 Estudiar de nuevo
              </motion.button>
              <motion.button
                onClick={() => setMode("decks")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm"
              >
                Volver
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );

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
                ? {
                    "1-3": "6-8 años",
                    "4-6": "9-11 años",
                    "7-9": "12-14 años",
                    "10-12": "15-16+",
                  }[deck.metadata.grade]
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

  if (mode === "editor")
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
        <motion.div
          onClick={() => {
            setDeckTitle("");
            setDeckDescription("");
            setCurrentDeckId(null);
            setMode("editor");
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(77, 168, 196, 0.15)",
          }}
          className="p-5 rounded-2xl border-2 border-dashed border-[#E2E8F0]/50 bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:border-[#4DA8C4]/50 transition-all"
        >
          <span className="text-3xl mb-2">➕</span>
          <p className="font-semibold text-[#004B63]">Crear nuevo mazo</p>
          <p className="text-xs text-[#64748B] mt-1">
            Agrega tarjetas de estudio
          </p>
        </motion.div>
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

      {/* Share/Import + Multiplayer */}
      {decks.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const deck = decks[0];
                const code =
                  deck.shareCode ||
                  Math.random().toString(36).substring(2, 8).toUpperCase();
                if (!deck.shareCode) {
                  const updated = { ...deck, shareCode: code };
                  saveDecks((prev) =>
                    prev.map((d) => (d.id === deck.id ? updated : d)),
                  );
                }
                navigator.clipboard.writeText(code);
                setShareMessage("¡Código copiado!");
                setTimeout(() => setShareMessage(""), 2000);
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold"
            >
              📤 Compartir mazo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowImport(true)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD166] to-[#FFB300] text-white text-sm font-bold"
            >
              📥 Importar mazo
            </motion.button>
          </div>
          {shareMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center text-[#4DA8C4] font-semibold"
            >
              {shareMessage}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (decks.length > 0) {
                setMultiplayerMode(true);
                setCurrentDeckId(decks[0].id);
                setMode("quiz");
                setScore1(0);
                setScore2(0);
                setMpCurrentPlayer(1);
                setQIdx(0);
                setPlayerAnswer("");
              }
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            👥 Modo 2 Jugadores
          </motion.button>
        </div>
      )}

      {/* Import dialog */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImport(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="p-6 rounded-2xl max-w-sm w-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#004B63] mb-4">
                Importar mazo
              </h3>
              <input
                value={importCode}
                onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                placeholder="Ej: F3K7M9"
                maxLength={6}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-center text-lg font-bold tracking-widest mb-4 bg-[#F8FAFC] text-[#004B63]"
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImport(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#64748B]"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const allDecks = [
                      ...JSON.parse(
                        localStorage.getItem("edutechlife_flashcards") || "[]",
                      ),
                      ...JSON.parse(
                        localStorage.getItem("edutechlife_shared_decks") ||
                          "[]",
                      ),
                    ];
                    const found = allDecks.find(
                      (d) => d.shareCode === importCode,
                    );
                    if (found) {
                      const imported = JSON.parse(
                        localStorage.getItem("edutechlife_shared_decks") ||
                          "[]",
                      );
                      if (!imported.some((d) => d.shareCode === importCode)) {
                        imported.push({
                          ...found,
                          id: `${found.id}_imported_${Date.now()}`,
                        });
                        localStorage.setItem(
                          "edutechlife_shared_decks",
                          JSON.stringify(imported),
                        );
                      }
                      setShowImport(false);
                      setImportCode("");
                    }
                  }}
                  disabled={importCode.length < 4}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold disabled:opacity-50"
                >
                  Importar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FlashcardSystem.displayName = "FlashcardSystem";

export { FlashcardSystem };
export default FlashcardSystem;
