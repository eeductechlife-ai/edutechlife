import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { analyzeDocumentText } from "../../../../utils/api";
import { extractDocumentText } from "../../../../utils/documentParser";
import {
  daysLeft,
  badgeCls,
  badgeEmj,
  sbj,
  PRACTICE_GRADIENT,
  PRACTICE_GLOW,
} from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const StudyPlanCard = memo(({ material, dm = false }) => {
  const { t } = useTranslation();
  if (!material) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl space-y-3"
      style={{
        background: "rgba(239,71,111,0.05)",
        border: "1px solid rgba(239,71,111,0.15)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h4
          className="text-sm font-bold"
          style={{ color: dm ? "#E2F0FF" : "#1E293B" }}
        >
          {t("kid.exam.study_plan_title")}
        </h4>
        <span className="text-[10px] ml-auto" style={{ color: "#94A3B8" }}>
          {material.fileName}
        </span>
      </div>
      {material.strengths?.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#22C55E" }}
          >
            {t("kid.exam.strengths")}
          </p>
          <div className="flex flex-wrap gap-1">
            {material.strengths.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full border border-green-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {material.improvements?.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#EF476F" }}
          >
            {t("kid.exam.improvements")}
          </p>
          <div className="flex flex-wrap gap-1">
            {material.improvements.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {material.tutoringQuestions?.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#FF6B9D" }}
          >
            {t("kid.exam.guide_questions")}
          </p>
          <ul className="space-y-1">
            {material.tutoringQuestions.slice(0, 3).map((q, i) => (
              <li
                key={i}
                className="text-xs flex items-start gap-2"
                style={{ color: dm ? "#94A3B8" : "#64748B" }}
              >
                <span style={{ color: "#EF476F" }}>•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
});

const MaterialUploader = memo(({ examId, onMaterialUploaded, dm = false }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback(
    async (file) => {
      setUploading(true);
      try {
        const text = await extractDocumentText(file);
        const analysis = await analyzeDocumentText(text, file.name, "General");
        onMaterialUploaded(examId, { fileName: file.name, ...analysis });
      } catch (e) {
        console.warn("Upload failed:", e);
      }
      setUploading(false);
    },
    [examId, onMaterialUploaded],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl p-4 text-center transition-all cursor-pointer"
      style={{
        border: drag
          ? "2px dashed #EF476F"
          : `2px dashed ${dm ? "#243152" : "#E2E8F0"}`,
        background: drag
          ? "rgba(239,71,111,0.06)"
          : dm
            ? "rgba(255,255,255,0.02)"
            : "#F8FAFC",
        transform: drag ? "scale(1.02)" : "scale(1)",
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
    >
      <input
        type="file"
        accept=".pdf,.txt,.png,.jpg,.jpeg"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) handleFile(f);
        }}
        className="hidden"
        id={`upload-${examId}`}
      />
      <label htmlFor={`upload-${examId}`} className="cursor-pointer block">
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="w-5 h-5 border-2 border-t-transparent rounded-full"
              style={{ borderColor: "#EF476F", borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span
              className="text-sm"
              style={{ color: dm ? "#94A3B8" : "#64748B" }}
            >
              {t("kid.exam.analyzing_material")}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">📄</span>
            <span
              className="text-sm"
              style={{ color: dm ? "#94A3B8" : "#64748B" }}
            >
              {t("kid.exam.upload_hint")}
            </span>
          </div>
        )}
      </label>
    </motion.div>
  );
});

const ExamDetail = memo(
  ({
    e: exam,
    tips,
    materials,
    onDelete,
    onBack,
    onAskDani,
    onUploadMaterial,
    dm = false,
  }) => {
    const { t } = useTranslation();
    const d = daysLeft(exam.date);
    const p = Math.min(exam.studyProgress || 0, 100);
    const si = sbj(exam.subject);

    const cardBg = dm ? "#1A2744" : "#ffffff";
    const cardBorder = dm ? "#243152" : "#E2E8F0";
    const textPrimary = dm ? "#E2F0FF" : "#1E293B";
    const textSecondary = dm ? "#94A3B8" : "#64748B";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        {/* Header banner — pink gradient */}
        <div
          className="p-5 text-white"
          style={{ background: PRACTICE_GRADIENT }}
        >
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={onBack}
              whileHover={{ x: -3 }}
              className="text-white/80 hover:text-white text-sm"
            >
              ← {t("kid.exam.back")}
            </motion.button>
            <motion.button
              onClick={() => onDelete(exam.id)}
              whileHover={{ scale: 1.1 }}
              className="text-white/60 hover:text-white text-lg"
            >
              ×
            </motion.button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{si?.i || "📚"}</span>
            <div>
              <h3 className="font-bold text-lg">{exam.name}</h3>
              <p className="text-white/75 text-sm">
                {si ? t(`kid.exam.subject_${exam.subject}`) : exam.subject} •{" "}
                {t("kid.exam.meta_short", { grade: exam.desiredGrade })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Days badge */}
          <div className="text-center">
            <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-lg font-black ${badgeCls(d)}`}
            >
              <span className="text-2xl">{badgeEmj(d)}</span>
              {d === 0
                ? t("kid.exam.exam_today")
                : d === 1
                  ? t("kid.exam.tomorrow")
                  : t("kid.exam.days_remaining", { count: d })}
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold" style={{ color: textPrimary }}>
                {t("kid.exam.study_progress")}
              </span>
              <span className="font-black" style={{ color: "#EF476F" }}>
                {p}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: "rgba(239,71,111,0.12)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: PRACTICE_GRADIENT }}
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>
              {t("kid.exam.meta_short", { grade: exam.desiredGrade })}
            </p>
          </div>

          {/* Study tips */}
          {tips.length > 0 && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(239,71,111,0.05)",
                border: "1px solid rgba(239,71,111,0.15)",
              }}
            >
              <h4
                className="text-sm font-bold mb-2"
                style={{ color: textPrimary }}
              >
                💡 {t("kid.exam.study_tips")}
              </h4>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-xs flex items-start gap-2"
                    style={{ color: textSecondary }}
                  >
                    <span style={{ color: "#EF476F" }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Uploaded materials */}
          {materials?.length > 0 &&
            materials.map((m, i) => (
              <StudyPlanCard key={i} material={m} dm={dm} />
            ))}

          {/* Upload zone */}
          <MaterialUploader
            examId={exam.id}
            onMaterialUploaded={onUploadMaterial}
            dm={dm}
          />

          {/* Ask Dani button */}
          <motion.button
            onClick={onAskDani}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 10px 28px ${PRACTICE_GLOW}35`,
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            style={{ background: PRACTICE_GRADIENT }}
          >
            🗣️ {t("kid.exam.ask_dani")}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

ExamDetail.displayName = "ExamDetail";
export default ExamDetail;
