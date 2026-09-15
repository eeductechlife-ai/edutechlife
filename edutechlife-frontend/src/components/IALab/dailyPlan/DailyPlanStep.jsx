import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

const URGENCY_ICON = {
  high: "fa-bolt",
  medium: "fa-star",
  low: "fa-circle-info",
};

const URGENCY_LABEL_KEY = {
  high: "ialab.daily_plan.urgency_today",
  medium: "ialab.daily_plan.urgency_soon",
  low: "ialab.daily_plan.urgency_optional",
};

const DailyPlanStep = ({ t, item, index, onComplete, onAction }) => {
  const isChallenge = item.type === "challenge";
  const urgency = item.urgency || "low";

  const title = isChallenge ? t(item.titleKey) : item.title;
  const description = isChallenge
    ? t(item.descriptionKey)
    : item.description || item.text;
  const itemXp = isChallenge ? item.xpReward ?? item.xp : 0;
  const icon = item.icon || URGENCY_ICON[urgency];
  const urgencyLabel = t(URGENCY_LABEL_KEY[urgency]);

  const actionLabel = isChallenge
    ? t("ialab.daily_plan.done_btn") || "Hecho"
    : item.action?.label;

  const handleAction = () => {
    if (isChallenge) onComplete(item.id, itemXp);
    else onAction(item.rec || item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
      className="theme-surface theme-border border rounded-xl"
      data-testid="daily-plan-step"
    >
      <div className="p-3.5 flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
          <span className="w-5 h-5 rounded-full theme-bg-emphasis flex items-center justify-center text-white text-[10px] font-bold">
            {index + 1}
          </span>
          <div className="w-8 h-8 rounded-lg theme-chip flex items-center justify-center">
            <Icon name={icon} className="text-sm text-[var(--theme-emphasis)]" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-[14px] font-semibold theme-text leading-snug">
              {title}
            </h4>
            {actionLabel && (
              <button
                type="button"
                onClick={handleAction}
                className="flex-shrink-0 text-[12px] font-medium text-white theme-bg-emphasis px-2.5 py-1.5 min-h-[36px] rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
              >
                <Icon
                  name={isChallenge ? "fa-check" : "fa-arrow-right"}
                  className="text-[9px]"
                />
                {actionLabel}
              </button>
            )}
          </div>

          <p className="text-[12px] theme-text-muted leading-relaxed line-clamp-2">
            {description}
          </p>

          {isChallenge && itemXp > 0 ? (
            <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 theme-chip px-2 py-0.5 rounded-md">
              <Icon name="fa-star" className="text-[9px] text-amber-500" />+
              {itemXp} XP
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium theme-text-muted theme-chip px-2 py-0.5 rounded-md">
              <Icon name={URGENCY_ICON[urgency]} className="text-[9px]" />
              {urgencyLabel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

DailyPlanStep.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default DailyPlanStep;
