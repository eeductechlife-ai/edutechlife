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
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
      className="theme-prompt-card group w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-150 shadow-sm cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
    >
      <span className="mt-1 flex-shrink-0 h-8 w-8 rounded-xl theme-chip flex items-center justify-center">
        <Icon name={icon} className="text-[var(--theme-chip-text)] text-sm" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[15px] theme-text leading-snug">
          {label}
        </p>
        <p className="text-[13px] theme-text-muted leading-snug mt-0.5 line-clamp-2">
          {description}
        </p>
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
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-[15px] font-bold theme-text">
          {t("ialab.practice.title")}
        </h4>
        <p className="text-[15px] theme-text-muted leading-[1.65]">
          {t("ialab.practice.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      <p className="text-[13px] theme-text-muted leading-[1.65]">
        {t("ialab.practice.flashcards_hint")}
      </p>
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
