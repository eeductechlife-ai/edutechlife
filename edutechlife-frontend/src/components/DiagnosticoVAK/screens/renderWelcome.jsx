import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STYLE_INSIGHTS } from "../vakStyles";

const CHIPS = [
  { style: "visual", key: "vak.ui.chip_visual" },
  { style: "auditivo", key: "vak.ui.chip_auditory" },
  { style: "kinestesico", key: "vak.ui.chip_kinesthetic" },
];

export default function renderWelcome({
  t,
  startTest,
  resumeOffer,
  resumeProgress,
  discardProgress,
  questionsTotal,
}) {
  return (
    <div className="flex items-start justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl text-center"
      >
        <h1 className="text-3xl md:text-4xl font-black text-[#004B63] leading-tight mb-3">
          {t("vak.ui.hero_title")}
        </h1>
        <p className="text-base md:text-lg text-[#004B63]/75 mb-6">
          {t("vak.ui.hero_subtitle")}
        </p>

        <ul className="flex flex-wrap justify-center gap-3 mb-8 p-0 list-none">
          {CHIPS.map(({ style, key }) => {
            const info = STYLE_INSIGHTS[style];
            return (
              <li
                key={style}
                className="flex items-center gap-2 rounded-full bg-white border-2 px-4 py-2 text-base font-bold"
                style={{ borderColor: info.fill, color: info.ink }}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {info.emoji}
                </span>
                {t(key)}
              </li>
            );
          })}
        </ul>

        {resumeOffer && (
          <div
            className="mb-6 rounded-2xl border-2 border-[#4DA8C4] bg-[#F0FDFF] p-4 text-left"
            role="region"
            aria-label={t("vak.ui.resume_title")}
          >
            <p className="!m-0 font-bold text-[#004B63]">
              {t("vak.ui.resume_title")}
            </p>
            <p className="!m-0 mt-1 text-sm text-[#004B63]/80">
              {t("vak.ui.resume_body", {
                name: resumeOffer.studentName || "",
                current: Math.min(
                  (resumeOffer.currentQuestion || 0) + 1,
                  questionsTotal,
                ),
                total: questionsTotal,
              })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resumeProgress}
                className="min-h-[44px] px-5 rounded-xl bg-[#004B63] text-white text-sm font-bold"
              >
                {t("vak.ui.resume_continue")}
              </button>
              <button
                type="button"
                onClick={discardProgress}
                className="min-h-[44px] px-5 rounded-xl border-2 border-[#004B63] text-[#004B63] text-sm font-bold"
              >
                {t("vak.ui.resume_restart")}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={startTest}
          className="w-full min-h-[60px] rounded-2xl bg-[#004B63] text-white text-lg font-bold shadow-lg hover:bg-[#003B4F] flex items-center justify-center gap-2 transition-colors"
        >
          {t("vak.ui.start_diagnosis_btn")}
          <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <p className="mt-3 text-sm text-[#004B63]/70">
          {t("vak.ui.start_hint")}
        </p>

        <details className="mt-8 text-left rounded-2xl border border-[#B2D8E5] bg-white p-4">
          <summary className="cursor-pointer font-bold text-[#004B63] min-h-[32px]">
            {t("vak.ui.parents_link")}
          </summary>
          <div className="mt-3 space-y-3 text-sm text-[#004B63]/85 leading-relaxed">
            <p className="!m-0">{t("vak.ui.vak_intro")}</p>
            <p className="!m-0">{t("vak.ui.parents_note")}</p>
          </div>
        </details>

        <p className="mt-6 text-xs text-[#004B63]/60">
          {t("vak.ui.developed_by")} <strong>EdutechLife</strong>
        </p>
      </motion.div>
    </div>
  );
}
