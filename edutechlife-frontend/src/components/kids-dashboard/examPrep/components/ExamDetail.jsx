import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { analyzeDocumentText } from "../../../../utils/api";
import { extractDocumentText } from "../../../../utils/documentParser";
import { daysLeft, badgeCls, badgeEmj, sbj, gdCls } from "../examUtils";
import { useTranslation } from "../../../../i18n/I18nProvider";

const StudyPlanCard = memo(({ material }) => {
  const { t } = useTranslation();
  if (!material) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-[#4DA8C4]/5 to-[#66CCCC]/10 border border-[#4DA8C4]/20 space-y-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h4 className="text-sm font-bold text-[#004B63]">
          {t("kid.exam.study_plan_title")}
        </h4>
        <span className="text-[10px] text-[#64748B] ml-auto">
          {material.fileName}
        </span>
      </div>
      {material.strengths?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-[#66CCCC] uppercase tracking-wider mb-1">
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
          <p className="text-[10px] font-semibold text-[#FF6B9D] uppercase tracking-wider mb-1">
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
          <p className="text-[10px] font-semibold text-[#4DA8C4] uppercase tracking-wider mb-1">
            {t("kid.exam.guide_questions")}
          </p>
          <ul className="space-y-1">
            {material.tutoringQuestions.slice(0, 3).map((q, i) => (
              <li
                key={i}
                className="text-xs text-[#64748B] flex items-start gap-2"
              >
                <span className="text-[#4DA8C4]">•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
});

const MaterialUploader = memo(({ examId, onMaterialUploaded }) => {
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
      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${drag ? "border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4DA8C4]/50"}`}
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
              className="w-5 h-5 border-2 border-[#4DA8C4] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-[#64748B]">
              {t("kid.exam.analyzing_material")}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">📄</span>
            <span className="text-sm text-[#64748B]">
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
  }) => {
    const { t } = useTranslation();
    const d = daysLeft(exam.date);
    const p = Math.min(exam.studyProgress || 0, 100);
    const si = sbj(exam.subject);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
      >
        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={onBack}
              whileHover={{ x: -3 }}
              className="text-white/80 hover:text-white text-sm"
            >
              {t("kid.exam.back")}
            </motion.button>
            <motion.button
              onClick={() => onDelete(exam.id)}
              whileHover={{ scale: 1.1 }}
              className="text-white/60 hover:text-red-300 text-lg"
            >
              ×
            </motion.button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{si?.i || "📚"}</span>
            <div>
              <h3 className="font-bold text-lg">{exam.name}</h3>
              <p className="text-white/70 text-sm">
                {si ? t(`kid.exam.subject_${exam.subject}`) : exam.subject} •{" "}
                {t("kid.exam.meta_short", { grade: exam.desiredGrade })}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
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
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-[#004B63]">
                {t("kid.exam.study_progress")}
              </span>
              <span className="font-black text-[#4DA8C4]">{p}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              {t("kid.exam.meta_short", { grade: exam.desiredGrade })}
            </p>
          </div>
          {tips.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/20">
              <h4 className="text-sm font-bold text-[#004B63] mb-2">
                {t("kid.exam.study_tips")}
              </h4>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-xs text-[#64748B] flex items-start gap-2"
                  >
                    <span className="text-[#4DA8C4] mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {materials?.length > 0 &&
            materials.map((m, i) => <StudyPlanCard key={i} material={m} />)}
          <MaterialUploader
            examId={exam.id}
            onMaterialUploaded={onUploadMaterial}
          />
          <motion.button
            onClick={onAskDani}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${gdCls} w-full py-3 flex items-center justify-center gap-2`}
          >
            {t("kid.exam.ask_dani")}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

ExamDetail.displayName = "ExamDetail";
export default ExamDetail;
