import { memo, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GenerateFlashcards from "../GenerateFlashcards";
import { useFlashcardDeck } from "./useFlashcardDeck";
import QuizCard from "./components/QuizCard";
import FlashcardResults from "./components/FlashcardResults";
import FlashcardImporter from "./components/FlashcardImporter";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  generateFlashcards,
  detectThemeFromTopic,
} from "../../../services/flashcardAI";
import { generateStudySummary } from "../../../services/documentSummaryAI";

const LEARNING_PATH = (t) => [
  { tab: "flashcards", label: t("kid.flashcards.tab_flashcards"), icon: "🎴" },
  { tab: "oral", label: t("kid.flashcards.tab_oral"), icon: "🗣️" },
  { tab: "examenes", label: t("kid.flashcards.tab_exam"), icon: "📝" },
];

const DeckCard = memo(({ deck, onStudy, onEdit, onDelete, index }) => {
  const { t } = useTranslation();
  const themeColor = deck.metadata?.theme?.color || "#4DA8C4";
  const themeIcon = deck.metadata?.theme?.icon || "📚";
  const gradeLabel = deck.metadata?.grade
    ? {
        "1-3": t("kid.flashcards.grade_1_3"),
        "4-6": t("kid.flashcards.grade_4_6"),
        "7-9": t("kid.flashcards.grade_7_9"),
        "10-12": t("kid.flashcards.grade_10_12"),
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
          {t("kid.flashcards.cards_count", { count: deck.cards.length })}
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
          <span>
            {t("kid.flashcards.studied_count", {
              count: deck.stats.totalStudied,
            })}
          </span>
          <span>
            {t("kid.flashcards.correct_count", { count: deck.stats.correct })}
          </span>
          <span>
            {t("kid.flashcards.streak_count", {
              count: deck.stats.streak || 0,
            })}
          </span>
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
          {t("kid.flashcards.study")}
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

const GRADE_LABELS = (t) => ({
  "1-3": t("kid.flashcards.grade_1_3"),
  "4-6": t("kid.flashcards.grade_4_6"),
  "7-9": t("kid.flashcards.grade_7_9"),
  "10-12": t("kid.flashcards.grade_10_12"),
});

// Scanner tab — scan PDF/image → extract text → generate cards + summary
const ScannerTab = memo(({ onGenerated }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("7-9");
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useCallback((node) => {
    if (node) node._ref = node;
  }, []);

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    setFile(f);
    setError("");
    setSummary(null);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }, []);

  const processAndGenerate = useCallback(async () => {
    if (!file && !topic.trim()) return;
    setProcessing(true);
    setError("");
    setSummary(null);

    try {
      let text = topic.trim();
      if (file) {
        setStage(t("kid.flashcards.scan_stage_reading"));
        const { extractDocumentText } =
          await import("../../../utils/documentParser");
        text = await extractDocumentText(file);
      }

      setStage(t("kid.flashcards.scan_stage_summary"));
      const sum = await generateStudySummary(text, {
        subject: "general",
        ageKey:
          grade.split("-")[0] === "1"
            ? "6-8"
            : grade.split("-")[0] <= "6"
              ? "9-11"
              : grade.split("-")[0] <= "9"
                ? "12-14"
                : "15-17",
      });
      setSummary(sum);

      setStage(t("kid.flashcards.scan_stage_cards"));
      const useTopic = sum?.title || file?.name || topic.slice(0, 50);
      const cards = await generateFlashcards(useTopic, grade);
      const theme = detectThemeFromTopic(useTopic);
      onGenerated(useTopic, cards, { grade, theme, summary: sum });
      setStage("");
    } catch (e) {
      const msg =
        e?.message && e.message !== "AbortError"
          ? e.message
          : t("kid.flashcards.scan_error");
      setError(msg);
    } finally {
      setProcessing(false);
      setStage("");
    }
  }, [file, topic, grade, onGenerated, t]);

  const GRADES = [
    { v: "1-3", l: t("kid.flashcards.scan_grade_1_3") },
    { v: "4-6", l: t("kid.flashcards.scan_grade_4_6") },
    { v: "7-9", l: t("kid.flashcards.scan_grade_7_9") },
    { v: "10-12", l: t("kid.flashcards.scan_grade_10_12") },
  ];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#EF476F]/5 to-[#FF6B9D]/5 border border-[#EF476F]/20 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📷</span>
        <div>
          <h4 className="font-bold text-[#004B63]">
            {t("kid.flashcards.scan_title")}
          </h4>
          <p className="text-xs text-[#64748B]">
            {t("kid.flashcards.scan_subtitle")}
          </p>
        </div>
      </div>

      {/* File drop */}
      <label className="block">
        <input
          type="file"
          accept="image/*,application/pdf,.txt,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="doc"
              className="w-full max-h-36 object-contain rounded-xl border border-[#E2E8F0]"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow text-red-400 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : file ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E2E8F0] cursor-pointer">
            <span className="text-2xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#004B63] truncate">
                {file.name}
              </p>
              <p className="text-xs text-[#64748B]">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
              }}
              className="text-red-400 text-xs px-2"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#EF476F]/30 rounded-xl p-6 text-center cursor-pointer hover:border-[#EF476F]/60 transition-colors">
            <span className="text-3xl block mb-1">📎</span>
            <p className="text-sm font-semibold text-[#004B63]">
              {t("kid.flashcards.scan_upload")}
            </p>
            <p className="text-xs text-[#64748B]">JPG, PNG, PDF, TXT</p>
          </div>
        )}
      </label>

      {/* Or text */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span>{t("kid.flashcards.scan_or_text")}</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder={t("kid.flashcards.scan_topic_placeholder")}
        rows={3}
        className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm resize-none focus:outline-none focus:border-[#EF476F]/60"
      />

      {/* Grade selector */}
      <div className="flex gap-2 flex-wrap">
        {GRADES.map((g) => (
          <button
            key={g.v}
            onClick={() => setGrade(g.v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              grade === g.v
                ? "bg-[#EF476F] text-white shadow-md"
                : "bg-white border border-[#E2E8F0] text-[#64748B]"
            }`}
          >
            {g.l}
          </button>
        ))}
      </div>

      {stage && (
        <div className="flex items-center gap-2 text-sm text-[#EF476F]">
          <motion.span
            className="inline-block w-4 h-4 border-2 border-[#EF476F] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          />
          {stage}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Summary preview */}
      {(summary?.overview || summary?.learningPoints?.length > 0) && (
        <div className="p-3 rounded-xl bg-white border border-[#4DA8C4]/30 space-y-2">
          <p className="text-xs font-bold text-[#004B63]">
            📋 {summary.title || t("kid.flashcards.scan_summary_generated")}
          </p>
          {summary.overview && (
            <p className="text-xs text-[#374151]">{summary.overview}</p>
          )}
          {summary.learningPoints?.length > 0 && (
            <ul className="space-y-1">
              {summary.learningPoints.slice(0, 4).map((p, i) => (
                <li key={i} className="text-xs text-[#374151] flex gap-1.5">
                  <span className="text-[#4DA8C4]">•</span>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <motion.button
        onClick={processAndGenerate}
        disabled={processing || (!file && !topic.trim())}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl font-bold text-white text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #EF476F, #FF6B9D)" }}
      >
        {processing
          ? t("kid.flashcards.scan_processing")
          : t("kid.flashcards.scan_generate")}
      </motion.button>
    </div>
  );
});
ScannerTab.displayName = "ScannerTab";

const FlashcardSystem = memo(({ onTabChange }) => {
  const { t } = useTranslation();
  const { activeStudyDeck, setActiveStudyDeck, setDocumentForDani } =
    useSmartBoardKids();
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
    handleResult,
    startMultiplayer,
  } = useFlashcardDeck();

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#004B63]">
            {deck
              ? t("kid.flashcards.edit_deck")
              : t("kid.flashcards.new_deck")}
          </h3>
          <button
            onClick={() => {
              setMode("decks");
              setCurrentDeckId(null);
            }}
            className="text-sm text-[#64748B] hover:text-[#004B63]"
          >
            ✕ {t("common.close")}
          </button>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              {t("kid.flashcards.deck_name")}
            </label>
            <input
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              placeholder={t("kid.flashcards.deck_name_placeholder")}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#004B63] mb-1 block">
              {t("kid.flashcards.deck_description")}
            </label>
            <input
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              placeholder={t("kid.flashcards.deck_description_placeholder")}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
            />
          </div>
          <motion.button
            onClick={createDeck}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
          >
            {deck
              ? t("kid.flashcards.save_changes")
              : t("kid.flashcards.create_deck")}
          </motion.button>
        </div>
        {deck && (
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="font-bold text-[#004B63]">
              {t("kid.flashcards.cards_label", { count: deck.cards.length })}
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
                {t("kid.flashcards.add_card")}
              </h5>
              <input
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder={t("kid.flashcards.card_front_placeholder")}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <input
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder={t("kid.flashcards.card_back_placeholder")}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-[#004B63] text-sm focus:outline-none focus:border-[#4DA8C4]"
              />
              <motion.button
                onClick={addCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-xl font-bold text-sm"
              >
                {t("kid.flashcards.add_card_btn")}
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
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
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
          className="p-4 rounded-2xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 flex items-start gap-3"
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
          <div className="flex flex-col gap-1.5 flex-shrink-0">
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
