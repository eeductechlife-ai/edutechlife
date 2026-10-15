import { motion } from "framer-motion";
import {
  ChevronDown,
  Eye,
  RotateCcw,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { STYLE_INSIGHTS } from "../vakStyles";
import { buildVakReport } from "../vakReport";
import ResultFeedback from "../components/ResultFeedback";
import {
  MixDonut,
  NumberedList,
  StyleMixCards,
} from "../components/ReportBlocks";

const PARENT_TIPS_VISIBLE = 3;

export default function renderResults({
  t,
  diagnosis,
  parentName,
  setParentName,
  onViewDocument,
  onReset,
  onPractice,
  reduceMotion,
}) {
  const report = diagnosis?.styleDetails ? buildVakReport(diagnosis) : null;
  if (!report) {
    return (
      <div className="p-10 text-center text-[#004B63]/70">
        {t("vak.ui.no_results_available")}
      </div>
    );
  }

  const main = STYLE_INSIGHTS[report.main];
  const second = report.second ? STYLE_INSIGHTS[report.second] : null;
  const accent = main.fill;
  const ink = main.ink;
  const rise = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="max-w-2xl mx-auto sm:p-2 space-y-5">
      {/* ---------- portada ---------- */}
      <motion.section
        {...rise(0)}
        className="relative overflow-hidden rounded-[28px] bg-[#072F46] px-5 py-6 sm:px-8 sm:py-8 text-white shadow-[0_24px_60px_-28px_rgba(7,47,70,0.75)]"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#199DB9]/25 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full"
          style={{ background: `${accent}26` }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col-reverse items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="!m-0 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7FD3E3]">
              {t("vak.ui.result_title")}
            </p>
            <h1 className="!m-0 !mt-2 text-2xl sm:text-3xl font-extrabold leading-tight text-white">
              {t("vak.ui.result_hello", { name: diagnosis.studentName })}
            </h1>
            <p className="!m-0 !mt-2 text-base sm:text-lg text-white/80 leading-snug">
              {second
                ? t("vak.ui.result_mix_mixed", {
                    first: main.label,
                    second: second.label,
                  })
                : t("vak.ui.result_mix_single", { style: main.verb })}
            </p>
            <span
              className="mt-4 inline-block rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#072F46]"
              style={{ background: accent }}
            >
              {report.profileLabel}
            </span>
          </div>
          <MixDonut report={report} size={156} reduceMotion={reduceMotion} />
        </div>
      </motion.section>

      {/* ---------- mezcla ---------- */}
      <motion.div {...rise(0.08)}>
        <StyleMixCards report={report} reduceMotion={reduceMotion} t={t} />
      </motion.div>

      {/* ---------- superpoder y reto ---------- */}
      <motion.div {...rise(0.16)} className="grid gap-3 sm:grid-cols-2">
        <section
          className="rounded-3xl p-5"
          style={{ background: `${accent}1F` }}
        >
          <h2
            className="!m-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: ink }}
          >
            <Sparkles size={15} strokeWidth={2.5} aria-hidden="true" />
            {t("vak.ui.result_superpower")}
          </h2>
          <p className="!m-0 !mt-2 text-lg font-bold leading-snug text-[#072F46]">
            {main.superpower}
          </p>
        </section>
        <section className="rounded-3xl border border-[#B6E3EC] bg-[#F0FAFC] p-5">
          <h2 className="!m-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0E7490]">
            <Target size={15} strokeWidth={2.5} aria-hidden="true" />
            {t("vak.ui.result_challenge")}
          </h2>
          <p className="!m-0 !mt-2 text-base font-semibold leading-snug text-[#0F3B4F]">
            {main.challenge}
          </p>
        </section>
      </motion.div>

      {/* ---------- trucos ---------- */}
      <motion.section
        {...rise(0.24)}
        className="rounded-3xl border border-[#E2E8F0] bg-white p-5"
      >
        <h2 className="!m-0 !mb-3 text-base font-extrabold text-[#072F46]">
          {t("vak.ui.result_tips")}
        </h2>
        <NumberedList items={report.tips} accent={accent} ink={ink} />
      </motion.section>

      {/* ---------- acción principal ---------- */}
      <div>
        <button
          type="button"
          onClick={onPractice}
          className="group w-full min-h-[60px] rounded-2xl bg-[#072F46] text-white text-lg font-bold shadow-[0_14px_30px_-14px_rgba(7,47,70,0.8)] hover:bg-[#0B3A55] flex items-center justify-center gap-2 transition-colors"
        >
          <Rocket
            size={22}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-y-0.5"
          />
          {t("vak.ui.result_cta_practice")}
        </button>
        <p className="!m-0 !mt-2 text-center text-xs text-[#004B63]/65">
          {t("vak.ui.result_saved_note")}
        </p>
      </div>

      {/* ---------- para la familia ---------- */}
      <section className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
        <h2 className="!m-0 !mb-3 text-base font-extrabold text-[#072F46]">
          {t("vak.ui.pdf_parent_tips")}
        </h2>
        <NumberedList
          items={report.parentTips.slice(0, PARENT_TIPS_VISIBLE)}
          accent={accent}
          ink={ink}
        />
        {report.parentTips.length > PARENT_TIPS_VISIBLE && (
          <details className="group mt-2.5">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-sm font-bold text-[#0E7490] [&::-webkit-details-marker]:hidden">
              {t("vak.ui.result_family_tips_more")}
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform group-open:rotate-180"
              />
            </summary>
            <NumberedList
              items={report.parentTips.slice(PARENT_TIPS_VISIBLE)}
              start={PARENT_TIPS_VISIBLE + 1}
              accent={accent}
              ink={ink}
              className="!mt-1"
            />
          </details>
        )}

        <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_1px_0_rgba(7,47,70,0.04)] border border-[#E2E8F0]">
          <h3 className="!m-0 text-base font-bold text-[#072F46]">
            {t("vak.ui.result_family_title")}
          </h3>
          <label
            htmlFor="vak-parent-name"
            className="block mt-2 text-sm text-[#004B63]/85"
          >
            {t("vak.ui.result_family_name_label")}
          </label>
          <input
            id="vak-parent-name"
            type="text"
            value={parentName}
            maxLength={60}
            autoComplete="off"
            onChange={(e) => setParentName(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-[#D5E3EA] bg-white px-4 py-2.5 text-base text-[#004B63] focus:outline-none focus:ring-2 focus:ring-[#199DB9]/30 focus:border-[#199DB9]"
          />
          <p className="!m-0 !mt-1.5 text-xs text-[#004B63]/70">
            {t("vak.ui.result_family_name_hint")}
          </p>
          <button
            type="button"
            onClick={onViewDocument}
            className="mt-3 w-full min-h-[48px] rounded-xl border-2 border-[#072F46] text-[#072F46] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#072F46] hover:text-white transition-colors"
          >
            <Eye size={18} strokeWidth={2.5} aria-hidden="true" />
            {t("vak.ui.result_cta_report")}
          </button>
        </div>
      </section>

      <ResultFeedback t={t} dominantStyle={diagnosis.predominantStyle} />

      <button
        type="button"
        onClick={onReset}
        className="w-full min-h-[44px] text-sm font-semibold text-[#004B63]/70 flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} strokeWidth={2.5} aria-hidden="true" />
        {t("vak.ui.result_retry")}
      </button>

      <p className="!m-0 text-center text-xs text-[#004B63]/65 leading-relaxed">
        {t("vak.ui.result_note")}
      </p>
    </div>
  );
}
