import { memo, useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GenerateFlashcards from "../GenerateFlashcards";
import { useFlashcardDeck } from "./useFlashcardDeck";
import QuizCard from "./components/QuizCard";
import FlashcardResults from "./components/FlashcardResults";
import FlashcardImporter from "./components/FlashcardImporter";
import DeckCard from "./components/DeckCard";
import DeckEditor from "./components/DeckEditor";
import ScannerTab from "./components/ScannerTab";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useCompetencyTracking } from "../../../hooks/useCompetencyTracking";
import { useTranslation } from "../../../i18n/I18nProvider";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

const LEARNING_PATH = (t) => [
  { tab: "flashcards", label: t("kid.flashcards.tab_flashcards"), icon: "🎴" },
  { tab: "oral", label: t("kid.flashcards.tab_oral"), icon: "🗣️" },
  { tab: "examenes", label: t("kid.flashcards.tab_exam"), icon: "📝" },
];

const FlashcardSystem = memo(({ onTabChange }) => {
  const { t } = useTranslation();
  const { activeStudyDeck, setActiveStudyDeck, setDocumentForDani } =
    useSmartBoardKids();
  const { trackActivity } = useCompetencyTracking();

  const [createTab, setCreateTab] = useState("text"); // "text" | "scan"
  const [lastScanSummary, setLastScanSummary] = useState(null);
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
    startStudyDue,
    dueToday,
    handleResult,
    startMultiplayer,
  } = useFlashcardDeck();

  // Track competency mastery when a quiz session completes
  useEffect(() => {
    if (done) {
      track(EVENTS.FLASHCARD_SESSION_COMPLETED, {
        deck_title: deck?.title,
        correct,
        incorrect,
        rate,
        total_cards: correct + incorrect,
      });
      if (deck?.metadata?.subject) {
        trackActivity({ subject: deck.metadata.subject, score: rate / 100 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleScanGenerated = useCallback(
    (title, cards, metadata) => {
      if (metadata?.summary) setLastScanSummary(metadata.summary);
      handleGenerateFlashcards(title, cards, metadata);
    },
    [handleGenerateFlashcards],
  );

  const activateDeck = useCallback(
    (deckId) => {
      const d = decks.find((x) => x.id === deckId);
      if (!d) return;
      setActiveStudyDeck({
        deckId: d.id,
        title: d.title,
        cards: d.cards,
        topic: d.title,
      });
    },
    [decks, setActiveStudyDeck],
  );

  if (mode === "quiz" && deck) {
    if (done) {
      const handleTalkToDani = () => {
        if (deck) {
          // Set activeStudyDeck so OralExamSimulator picks up the deck automatically
          setActiveStudyDeck?.({
            deckId: deck.id,
            title: deck.title,
            cards: deck.cards,
            topic: deck.title,
          });
          // Also set documentForDani for Dani's awareness of the session results
          setDocumentForDani?.({
            title: deck.title,
            subject: deck.title,
            summary: `El estudiante acaba de estudiar el mazo "${deck.title}" con ${correct + incorrect} tarjetas y obtuvo ${rate}% de aciertos.`,
            tutoringQuestions:
              deck.cards
                ?.slice(0, 3)
                .map((c) => c.front || c.question || c.term)
                .filter(Boolean) || [],
            improvements:
              rate < 80
                ? [`${deck.title}: reforzar conceptos con menos del 80%`]
                : [],
          });
        }
        // Navigate to the oral (Habla con Dani) tab — next step in the learning path
        onTabChange?.("oral");
      };

      return (
        <FlashcardResults
          rate={rate}
          correct={correct}
          incorrect={incorrect}
          onRestart={() => startStudy(currentDeckId)}
          onBack={() => setMode("decks")}
          onTalkToDani={handleTalkToDani}
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
              ✕ {t("common.close")}
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
              deck.metadata?.grade ? GRADE_LABELS(t)[deck.metadata.grade] : ""
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
      <DeckEditor
        deck={deck}
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        deckDescription={deckDescription}
        setDeckDescription={setDeckDescription}
        createDeck={createDeck}
        frontText={frontText}
        setFrontText={setFrontText}
        backText={backText}
        setBackText={setBackText}
        addCard={addCard}
        onClose={() => {
          setMode("decks");
          setCurrentDeckId(null);
        }}
      />
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
          {t("kid.flashcards.my_decks_title")}
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
            {t("kid.flashcards.new_deck_btn")}
          </motion.button>
        )}
      </div>

      {/* Active deck + learning path */}
      {activeStudyDeck && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white"
        >
          <p className="text-xs font-semibold text-white/70 mb-1">
            {t("kid.flashcards.active_deck")}
          </p>
          <p className="font-black text-base mb-3">{activeStudyDeck.title}</p>
          <div className="flex items-center gap-1">
            {LEARNING_PATH(t).map((step, i) => (
              <div key={step.tab} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => onTabChange?.(step.tab)}
                  className="flex-1 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-center text-xs font-semibold"
                >
                  {step.icon} {step.label}
                </button>
                {i < LEARNING_PATH.length - 1 && (
                  <span className="text-white/50 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create tab switcher */}
      <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-xl">
        {[
          { id: "text", label: t("kid.flashcards.write_topic") },
          { id: "scan", label: t("kid.flashcards.scan_pdf") },
        ].map((tb) => (
          <button
            key={tb.id}
            onClick={() => setCreateTab(tb.id)}
            className={`flex-1 py-3 sm:py-2 rounded-lg text-sm font-semibold transition-all ${
              createTab === tb.id
                ? "bg-white text-[#004B63] shadow-sm"
                : "text-[#64748B]"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Dani scan-context banner */}
      {lastScanSummary && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 flex flex-col sm:flex-row sm:items-start gap-3"
        >
          <span className="text-2xl flex-shrink-0">🤖</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#004B63] truncate">
              {t("kid.flashcards.dani_read", { title: lastScanSummary.title })}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              {t("kid.flashcards.dani_ask")}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0 w-full sm:w-auto">
            <motion.button
              onClick={() => {
                setDocumentForDani?.({
                  title: lastScanSummary.title,
                  subject: "general",
                  summary: lastScanSummary.overview || "",
                  strengths: lastScanSummary.learningPoints || [],
                  improvements: (lastScanSummary.keyConcepts || [])
                    .slice(0, 3)
                    .map((kc) => kc.term),
                  score: 75,
                  difficulty: lastScanSummary.difficulty || "intermedio",
                  tutoringQuestions: (lastScanSummary.keyConcepts || [])
                    .slice(0, 4)
                    .map((kc) => `¿Qué entiendes por "${kc.term}"?`),
                });
                window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
                setLastScanSummary(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 bg-[#4DA8C4] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {t("kid.flashcards.dani_talk_yes")}
            </motion.button>
            <button
              onClick={() => setLastScanSummary(null)}
              className="text-[10px] text-[#64748B] text-center hover:text-[#004B63]"
            >
              {t("kid.flashcards.dismiss")}
            </button>
          </div>
        </motion.div>
      )}

      {createTab === "text" ? (
        <GenerateFlashcards onGenerated={handleGenerateFlashcards} />
      ) : (
        <ScannerTab onGenerated={handleScanGenerated} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map((d, i) => (
          <div key={d.id} className="space-y-2">
            <DeckCard
              deck={d}
              index={i}
              onStudy={startStudy}
              onStudyDue={startStudyDue}
              dueCount={dueToday[d.id] ?? 0}
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
            {/* Activate for learning path */}
            <motion.button
              onClick={() => activateDeck(d.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                activeStudyDeck?.deckId === d.id
                  ? "bg-[#004B63] text-white border-[#004B63]"
                  : "bg-white text-[#4DA8C4] border-[#4DA8C4]/40 hover:border-[#4DA8C4]"
              }`}
            >
              {activeStudyDeck?.deckId === d.id
                ? t("kid.flashcards.deck_active_status")
                : t("kid.flashcards.deck_activate")}
            </motion.button>
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <span className="text-6xl mb-4 block">📚</span>
          <p className="text-[#64748B]">{t("kid.flashcards.no_decks")}</p>
          <p className="text-sm text-[#64748B] mt-2">
            {t("kid.flashcards.no_decks_hint")}
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
