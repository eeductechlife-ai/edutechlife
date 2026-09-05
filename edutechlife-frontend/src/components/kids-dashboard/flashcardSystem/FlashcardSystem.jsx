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
import MultiplayerMode from "./MultiplayerMode";
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

// Practice category theme
const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_COLOR = "#FF6B9D";
const PRACTICE_GLOW = "#EF476F";

const FlashcardSystem = memo(({ onTabChange, darkMode = false }) => {
  const { t } = useTranslation();
  const { activeStudyDeck, setActiveStudyDeck, setDocumentForDani } =
    useSmartBoardKids();
  const { trackActivity } = useCompetencyTracking();

  const [createTab, setCreateTab] = useState("text"); // "text" | "scan"
  const [lastScanSummary, setLastScanSummary] = useState(null);
  const [multiplayerActive, setMultiplayerActive] = useState(false);
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

  // Multiplayer local mode — pick first deck with cards if none selected
  if (multiplayerActive) {
    const mpDeck = deck || decks.find((d) => d.cards?.length > 0);
    return (
      <MultiplayerMode
        cards={mpDeck?.cards || []}
        deckTitle={mpDeck?.title || ""}
        darkMode={false}
        onExit={() => setMultiplayerActive(false)}
      />
    );
  }

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
          darkMode={darkMode}
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
            <h3
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#004B63]"}`}
            >
              📖 {deck.title}
            </h3>
            <motion.button
              onClick={() => setMode("decks")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`text-sm ${darkMode ? "text-[#94A3B8] hover:text-white" : "text-[#64748B] hover:text-[#004B63]"}`}
            >
              ✕ {t("common.close")}
            </motion.button>
          </div>
          <div
            className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-[#2A3A54]" : "bg-[#E2E8F0]"}`}
          >
            <motion.div
              className="h-full"
              style={{ background: PRACTICE_GRADIENT }}
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
                ? ({
                    "1-3": t("kid.flashcards.grade_1_3"),
                    "4-6": t("kid.flashcards.grade_4_6"),
                    "7-9": t("kid.flashcards.grade_7_9"),
                    "10-12": t("kid.flashcards.grade_10_12"),
                  }[deck.metadata.grade] ?? "")
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

  const textPrimary = darkMode ? "text-white" : "text-[#004B63]";
  const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
  const cardBg = darkMode ? "bg-[#1E293B]" : "bg-white";
  const borderColor = darkMode ? "border-[#2A3A54]/60" : "border-[#E2E8F0]";
  const tabBarBg = darkMode ? "bg-[#151F32]" : "bg-[#F1F5F9]";
  const tabActiveBg = darkMode ? "bg-[#1E293B]" : "bg-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0"
            style={{
              background: PRACTICE_GRADIENT,
              boxShadow: `0 4px 14px ${PRACTICE_GLOW}40`,
            }}
          >
            🎴
          </span>
          <div>
            <h3 className={`text-lg font-black leading-tight ${textPrimary}`}>
              {t("kid.flashcards.my_decks_title")}
            </h3>
            <p className={`text-xs ${textSecondary}`}>
              Repasa con tarjetas inteligentes
            </p>
          </div>
        </div>
        {decks.length > 0 && (
          <div className="flex gap-2">
            <motion.button
              onClick={() => setMultiplayerActive(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 text-white rounded-xl font-bold text-xs shadow-md"
              style={{ background: PRACTICE_GRADIENT }}
            >
              🆚 Multijugador
            </motion.button>
            <motion.button
              onClick={() => {
                setDeckTitle("");
                setDeckDescription("");
                setCurrentDeckId(null);
                setMode("editor");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-2 rounded-xl font-bold text-xs border ${darkMode ? "bg-[#1E293B] border-[#2A3A54] text-white" : "bg-white border-[#E2E8F0] text-[#004B63]"} shadow-sm`}
            >
              + {t("kid.flashcards.new_deck_btn")}
            </motion.button>
          </div>
        )}
      </div>

      {/* Active deck + learning path */}
      {activeStudyDeck && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl text-white"
          style={{
            background: PRACTICE_GRADIENT,
            boxShadow: `0 8px 24px ${PRACTICE_GLOW}30`,
          }}
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
                {i < LEARNING_PATH(t).length - 1 && (
                  <span className="text-white/50 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create tab switcher */}
      <div className={`flex gap-2 p-1 rounded-xl ${tabBarBg}`}>
        {[
          { id: "text", label: t("kid.flashcards.write_topic") },
          { id: "scan", label: t("kid.flashcards.scan_pdf") },
        ].map((tb) => (
          <button
            key={tb.id}
            onClick={() => setCreateTab(tb.id)}
            className={`flex-1 py-3 sm:py-2 rounded-lg text-sm font-semibold transition-all ${
              createTab === tb.id ? `${tabActiveBg} shadow-sm` : ""
            } ${createTab === tb.id ? textPrimary : textSecondary}`}
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
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-start gap-3 ${darkMode ? "border-[#FF6B9D]/20 bg-[#FF6B9D]/5" : "border-[#FF6B9D]/20 bg-[#FF6B9D]/5"}`}
        >
          <span className="text-2xl flex-shrink-0">🤖</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate ${textPrimary}`}>
              {t("kid.flashcards.dani_read", { title: lastScanSummary.title })}
            </p>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>
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
              className="px-3 py-1.5 text-white rounded-xl text-xs font-bold shadow-sm"
              style={{ background: PRACTICE_GRADIENT }}
            >
              {t("kid.flashcards.dani_talk_yes")}
            </motion.button>
            <button
              onClick={() => setLastScanSummary(null)}
              className={`text-[10px] text-center ${textSecondary}`}
            >
              {t("kid.flashcards.dismiss")}
            </button>
          </div>
        </motion.div>
      )}

      {createTab === "text" ? (
        <GenerateFlashcards
          onGenerated={handleGenerateFlashcards}
          darkMode={darkMode}
        />
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
              darkMode={darkMode}
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
                  ? "text-white border-transparent"
                  : darkMode
                    ? `${cardBg} text-[#FF6B9D] border-[#FF6B9D]/30 hover:border-[#FF6B9D]/60`
                    : "bg-white text-[#EF476F] border-[#EF476F]/30 hover:border-[#EF476F]/60"
              }`}
              style={
                activeStudyDeck?.deckId === d.id
                  ? { background: PRACTICE_GRADIENT }
                  : {}
              }
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
          className={`text-center py-12 rounded-2xl border ${cardBg} ${borderColor}`}
        >
          <span className="text-5xl mb-4 block">🎴</span>
          <p className={`font-bold ${textPrimary}`}>
            {t("kid.flashcards.no_decks")}
          </p>
          <p className={`text-sm mt-2 ${textSecondary}`}>
            {t("kid.flashcards.no_decks_hint")}
          </p>
        </motion.div>
      )}

      {decks.length > 0 && (
        <FlashcardImporter
          decks={decks}
          saveDecks={saveDecks}
          onStartMultiplayer={startMultiplayer}
          darkMode={darkMode}
        />
      )}
    </motion.div>
  );
});

FlashcardSystem.displayName = "FlashcardSystem";

export default FlashcardSystem;
