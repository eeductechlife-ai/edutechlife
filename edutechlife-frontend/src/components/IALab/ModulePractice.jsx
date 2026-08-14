import React from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

const PracticeCard = ({ icon, label, description, onClick }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className="relative w-full flex items-center gap-4 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-left cursor-pointer group hover:shadow-md hover:border-corporate/30 dark:hover:border-corporate/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
    >
      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-corporate/0 via-corporate/60 to-petroleum/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-corporate to-petroleum group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
        <Icon name={icon} className="text-white text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-petroleum block truncate">
          {label}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {description}
        </span>
      </div>
      <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-corporate group-hover:border-corporate/30 transition-all duration-200">
        <Icon name="fa-arrow-right" className="w-3.5 h-3.5" />
      </div>
    </motion.button>
  );
};

const MODULE_TOOL_CONFIG = {
  1: {
    labelKey: "ialab.practice.tool_prompts",
    descKey: "ialab.practice.tool_prompts_desc",
    icon: "fa-wand-sparkles",
  },
  2: {
    labelKey: "ialab.practice.tool_interaction",
    descKey: "ialab.practice.tool_interaction_desc",
    icon: "fa-wand-magic-sparkles",
  },
  3: {
    labelKey: "ialab.practice.tool_gemini_research",
    descKey: "ialab.practice.tool_gemini_research_desc",
    icon: "fa-search",
  },
  4: {
    labelKey: "ialab.practice.tool_podcast",
    descKey: "ialab.practice.tool_podcast_desc",
    icon: "fa-microphone",
  },
  5: {
    labelKey: "ialab.practice.tool_ethics",
    descKey: "ialab.practice.tool_ethics_desc",
    icon: "fa-balance-scale",
  },
};

const ModulePractice = ({ onAction, activeMod }) => {
  const { t } = useTranslation();
  const toolCfg = MODULE_TOOL_CONFIG[activeMod] || MODULE_TOOL_CONFIG[1];

  const tools = [
    {
      icon: toolCfg.icon,
      label: t(toolCfg.labelKey),
      description: t(toolCfg.descKey),
      action: "OPEN_TOOL_PROMPTS",
    },
    {
      icon: "fa-chalkboard-user",
      label: t("ialab.practice.tool_tutoring"),
      description: t("ialab.practice.tool_tutoring_desc"),
      action: "OPEN_TUTORING",
    },
  ];

  const handleClick = (action) => {
    onAction?.(action);
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5 md:p-8 mt-5">
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-corporate/6 to-petroleum/4 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tr from-corporate/4 to-petroleum/4 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-corporate via-petroleum to-petroleum-dark rounded-t-2xl" />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-md shadow-corporate/15 flex-shrink-0">
          <Icon name="fa-flask" className="text-white text-base" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-petroleum uppercase tracking-wider font-display dark:text-petroleum">
            {t("ialab.practice.title")}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t("ialab.practice.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <PracticeCard
            key={tool.action}
            icon={tool.icon}
            label={tool.label}
            description={tool.description}
            onClick={() => handleClick(tool.action)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-petroleum/10 bg-petroleum/[0.03] dark:bg-slate-700/40 dark:border-slate-600/60 p-4">
        <Icon
          name="fa-lightbulb"
          className="w-5 h-5 text-corporate mt-0.5 flex-shrink-0"
          aria-hidden="true"
        />
        <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
          {t("ialab.practice.flashcards_hint")}
        </p>
      </div>
    </div>
  );
};

PracticeCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

ModulePractice.propTypes = {
  onAction: PropTypes.func,
  activeMod: PropTypes.number,
};

export default ModulePractice;
