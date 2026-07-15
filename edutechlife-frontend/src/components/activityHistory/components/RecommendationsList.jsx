import React from "react";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

const colorMap = {
  high: {
    text: "text-rose-700",
    bg: "bg-rose-100",
    icon: "text-rose-600",
    iconBg: "from-rose-50 to-rose-100",
    border: "border-rose-200/60",
    hoverBorder: "hover:border-rose-300/50",
    btnText: "text-rose-600",
    btnBg: "bg-rose-50",
    btnBorder: "border-rose-200",
    btnHover: "hover:bg-rose-100",
  },
  medium: {
    text: "text-amber-700",
    bg: "bg-amber-100",
    icon: "text-amber-600",
    iconBg: "from-amber-50 to-amber-100",
    border: "border-amber-200/40",
    hoverBorder: "hover:border-amber-300/50",
    btnText: "text-amber-600",
    btnBg: "bg-amber-50",
    btnBorder: "border-amber-200",
    btnHover: "hover:bg-amber-100",
  },
  low: {
    text: "text-sky-700",
    bg: "bg-sky-100",
    icon: "text-sky-600",
    iconBg: "from-sky-50 to-sky-100",
    border: "border-sky-200/40",
    hoverBorder: "hover:border-sky-300/50",
    btnText: "text-sky-600",
    btnBg: "bg-sky-50",
    btnBorder: "border-sky-200",
    btnHover: "hover:bg-sky-100",
  },
};

const RecommendationSection = ({
  recs,
  colorKey,
  sectionLabel,
  icon,
  delayStep,
}) => {
  const c = colorMap[colorKey];
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3 px-0.5">
        <div
          className={`w-4 h-4 rounded ${c.bg} flex items-center justify-center`}
        >
          <Icon name={icon} className={`text-[8px] ${c.icon}`} />
        </div>
        <p
          className={`text-[10px] font-bold ${c.text} uppercase tracking-[0.15em]`}
        >
          {sectionLabel}
        </p>
        <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent" />
      </div>
      <div className="space-y-2">
        {recs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * delayStep, duration: 0.2 }}
            className={`group bg-white rounded-xl border ${c.border} shadow-sm p-4 hover:shadow-md ${c.hoverBorder} hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <Icon name={rec.icon} className={`text-sm ${c.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{rec.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {rec.text}
                </p>
              </div>
            </div>
            {rec.action && (
              <div className="mt-3 flex justify-end">
                <button
                  className={`px-4 py-1.5 text-[11px] font-semibold ${c.btnText} ${c.btnBg} border ${c.btnBorder} rounded-lg ${c.btnHover} transition-colors active:scale-95`}
                >
                  <Icon name="fa-arrow-right" className="text-[9px] mr-1" />
                  {rec.action.label}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const RecommendationsList = ({ personalizedRecs, t }) => {
  const { high, medium, low } = personalizedRecs;
  if (high.length === 0 && medium.length === 0 && low.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-5 shadow-inner">
          <Icon name="fa-check-circle" className="text-emerald-500 text-3xl" />
        </div>
        <p className="text-base font-bold text-slate-700 font-montserrat">
          {t("activity.recommendations.all_caught_up_title")}
        </p>
        <p className="text-xs text-slate-400 text-center mt-1.5 max-w-xs leading-relaxed">
          {t("activity.recommendations.all_caught_up_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {high.length > 0 && (
        <RecommendationSection
          recs={high}
          colorKey="high"
          sectionLabel={t("activity.recommendations.section_high")}
          icon="fa-flag"
          delayStep={0.06}
        />
      )}
      {medium.length > 0 && (
        <RecommendationSection
          recs={medium}
          colorKey="medium"
          sectionLabel={t("activity.recommendations.section_medium")}
          icon="fa-list"
          delayStep={0.04}
        />
      )}
      {low.length > 0 && (
        <RecommendationSection
          recs={low}
          colorKey="low"
          sectionLabel={t("activity.recommendations.section_low")}
          icon="fa-lightbulb"
          delayStep={0.03}
        />
      )}
    </div>
  );
};
