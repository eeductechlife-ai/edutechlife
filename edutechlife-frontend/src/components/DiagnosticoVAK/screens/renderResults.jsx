import { motion } from "framer-motion";
import { Eye, RotateCcw, Rocket } from "lucide-react";
import { STYLE_INSIGHTS } from "../vakStyles";
import ResultFeedback from "../components/ResultFeedback";

const ORDER = ["visual", "auditivo", "kinestesico"];

function MixBar({ scores, reduceMotion }) {
  return (
    <div
      className="flex h-6 rounded-full overflow-hidden bg-[#E2E8F0]"
      role="img"
      aria-label={ORDER.map(
        (s) => `${STYLE_INSIGHTS[s].label} ${scores[s] || 0}%`,
      ).join(", ")}
    >
      {ORDER.filter((s) => (scores[s] || 0) > 0).map((s, i) => (
        <motion.div
          key={s}
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${scores[s]}%` }}
          transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
          style={{ background: STYLE_INSIGHTS[s].fill }}
        />
      ))}
    </div>
  );
}

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
  if (!diagnosis || !diagnosis.styleDetails) {
    return (
      <div className="p-10 text-center text-[#004B63]/70">
        {t("vak.ui.no_results_available")}
      </div>
    );
  }

  const scores = diagnosis.scores || {};
  const main = STYLE_INSIGHTS[diagnosis.predominantStyle];
  const second = diagnosis.secondaryStyle
    ? STYLE_INSIGHTS[diagnosis.secondaryStyle]
    : null;

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4 space-y-6">
      <div className="text-center">
        <p className="!m-0 text-sm font-bold uppercase tracking-wider text-[#0B7285]">
          {t("vak.ui.result_title")}
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#004B63] mt-1 mb-2">
          {t("vak.ui.result_hello", { name: diagnosis.studentName })}
        </h1>
        <p className="!m-0 text-lg text-[#004B63]">
          {second
            ? t("vak.ui.result_mix_mixed", {
                first: main.label,
                second: second.label,
              })
            : t("vak.ui.result_mix_single", { style: main.verb })}
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-[#B2D8E5] p-5 shadow-sm">
        <MixBar scores={scores} reduceMotion={reduceMotion} />
        <ul className="mt-4 grid grid-cols-3 gap-2 p-0 list-none">
          {ORDER.map((s) => {
            const info = STYLE_INSIGHTS[s];
            return (
              <li
                key={s}
                className="rounded-2xl text-center p-3"
                style={{ background: `${info.fill}1F` }}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {info.emoji}
                </span>
                <p
                  className="!m-0 mt-1 text-2xl font-black tabular-nums"
                  style={{ color: info.ink }}
                >
                  {scores[s] || 0}%
                </p>
                <p className="!m-0 text-sm font-semibold text-[#1E293B]">
                  {info.label}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-3">
        <section className="rounded-2xl bg-white border border-[#B2D8E5] p-4">
          <h2 className="!m-0 text-sm font-bold uppercase tracking-wider text-[#0B7285]">
            {t("vak.ui.result_superpower")}
          </h2>
          <p className="!m-0 mt-1 text-lg font-semibold text-[#004B63]">
            {main.superpower}
          </p>
        </section>
        <section className="rounded-2xl bg-white border border-[#B2D8E5] p-4">
          <h2 className="!m-0 text-sm font-bold uppercase tracking-wider text-[#0B7285]">
            {t("vak.ui.result_tips")}
          </h2>
          <ul className="!m-0 mt-2 pl-5 list-disc space-y-1.5 text-base text-[#1E293B]">
            {(second
              ? [...main.tips.slice(0, 1), ...second.tips.slice(0, 1)]
              : main.tips
            ).map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-4">
          <h2 className="!m-0 text-sm font-bold uppercase tracking-wider text-[#9A3412]">
            {t("vak.ui.result_challenge")}
          </h2>
          <p className="!m-0 mt-1 text-base font-semibold text-[#7C2D12]">
            {main.challenge}
          </p>
        </section>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onPractice}
          className="w-full min-h-[60px] rounded-2xl bg-[#004B63] text-white text-lg font-bold shadow-lg hover:bg-[#003B4F] flex items-center justify-center gap-2 transition-colors"
        >
          <Rocket size={22} strokeWidth={2.5} aria-hidden="true" />
          {t("vak.ui.result_cta_practice")}
        </button>
        <p className="!m-0 text-center text-xs text-[#004B63]/65">
          {t("vak.ui.result_saved_note")}
        </p>

        <div className="rounded-2xl border border-[#B2D8E5] bg-[#F0FDFF] p-4">
          <h2 className="!m-0 text-base font-bold text-[#004B63]">
            {t("vak.ui.result_family_title")}
          </h2>
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
            className="mt-1 w-full rounded-xl border-2 border-[#B2D8E5] bg-white px-4 py-2.5 text-base text-[#004B63] focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/40 focus:border-[#4DA8C4]"
          />
          <p className="!m-0 mt-1.5 text-xs text-[#004B63]/70">
            {t("vak.ui.result_family_name_hint")}
          </p>
          <button
            type="button"
            onClick={onViewDocument}
            className="mt-3 w-full min-h-[48px] rounded-xl border-2 border-[#004B63] text-[#004B63] text-sm font-bold flex items-center justify-center gap-2"
          >
            <Eye size={18} strokeWidth={2.5} aria-hidden="true" />
            {t("vak.ui.result_cta_report")}
          </button>
        </div>

        <ResultFeedback t={t} dominantStyle={diagnosis.predominantStyle} />

        <button
          type="button"
          onClick={onReset}
          className="w-full min-h-[44px] text-sm font-semibold text-[#004B63]/70 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} strokeWidth={2.5} aria-hidden="true" />
          {t("vak.ui.result_retry")}
        </button>
      </div>

      <p className="!m-0 text-center text-xs text-[#004B63]/65 leading-relaxed">
        {t("vak.ui.result_note")}
      </p>
    </div>
  );
}
