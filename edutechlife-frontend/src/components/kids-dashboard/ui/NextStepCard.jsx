import { memo } from "react";
import { motion } from "framer-motion";
import { getNextStep, MODE_STYLE } from "../adaptiveNextStep";

/**
 * NextStepCard — shared, actionable "what to do next" card for any activity
 * result. Renders the recovery / practice / transfer step from adaptiveNextStep
 * (§54–57) with a consistent SmartBoard look. Used by OralExam and Flashcards;
 * reusable by any future activity.
 *
 * @param {number} score      0–100 activity grade
 * @param {'easy'|'ok'|'hard'|null} feedback  student self-report
 * @param {boolean} dark
 * @param {Record<string,string>} [ctaOverrides]  per-mode CTA label overrides
 * @param {(step)=>void} onAction  called with the resolved step on click
 */
const NextStepCard = memo(function NextStepCard({
  score,
  feedback,
  dark = false,
  ctaOverrides,
  onAction,
  className = "",
}) {
  const step = getNextStep({ score, feedback });
  const style = MODE_STYLE[step.mode] || MODE_STYLE.practice;
  const cta = (ctaOverrides && ctaOverrides[step.mode]) || step.cta;

  const surface = dark
    ? "bg-[#1E293B] border-[#334155]"
    : "bg-white border-[#E2E8F0] shadow-sm";
  const titleColor = dark ? "text-[#E2F0FF]" : "text-[#004B63]";
  const whyColor = dark ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 border text-left ${surface} ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: style.grad }}
          aria-hidden="true"
        >
          {step.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${titleColor}`}>{step.title}</p>
          <p className={`text-xs mt-0.5 ${whyColor}`}>{step.why}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAction?.(step)}
        className="w-full mt-3 py-2.5 rounded-xl font-bold text-sm text-white"
        style={{ background: style.grad }}
      >
        {cta} →
      </motion.button>
    </motion.div>
  );
});

export default NextStepCard;
