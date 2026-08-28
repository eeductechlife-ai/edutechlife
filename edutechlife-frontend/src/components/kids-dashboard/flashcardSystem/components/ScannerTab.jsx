import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import {
  generateFlashcards,
  detectThemeFromTopic,
} from "../../../../services/flashcardAI";
import { generateStudySummary } from "../../../../services/documentSummaryAI";

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
          await import("../../../../utils/documentParser");
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
export default ScannerTab;
