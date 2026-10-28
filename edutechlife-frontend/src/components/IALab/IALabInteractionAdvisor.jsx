import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import { cn } from "../forum/forumDesignSystem";
import { VoiceReader } from "./IALabInteractionAdvisorParts";
import {
  getSuggestions,
  findRecommendation,
  getToolColor,
} from "./IALabInteractionAdvisorExtras";

const IALabInteractionAdvisor = ({ className = "", ...rest }) => {
  const { t } = useTranslation();
  const suggestions = useMemo(() => getSuggestions(t), [t]);
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = useCallback(
    (e) => {
      setInput(e.target.value);
      if (recommendation) setShowResult(false);
    },
    [recommendation],
  );

  const handleRecommend = () => {
    if (input.trim().length < 3) return;
    const result = findRecommendation(input);
    setRecommendation(result);
    setShowResult(true);
  };

  const handleSuggestion = (text) => {
    setInput(text);
    const result = findRecommendation(text);
    setRecommendation(result);
    setShowResult(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRecommend();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative z-10 bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-slate-200/60 overflow-hidden space-y-6",
        className,
      )}
      {...rest}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--theme-emphasis)] via-[var(--theme-emphasis)]-dark to-[var(--theme-primary)] rounded-t-2xl" />

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--theme-emphasis)] group-hover:text-[var(--theme-primary)] transition-colors duration-300">
              {t("ialab.interaction_advisor.title")}
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-1">
            {t("ialab.interaction_advisor.subtitle")}
          </p>
          {!isOpen && (
            <div className="mt-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl shadow-sm hover:from-[var(--theme-emphasis)]-dark hover:to-[var(--theme-primary)]-dark hover:shadow group-hover:scale-105 transition-all duration-300 cursor-pointer">
                <Icon
                  name="fa-wand-magic-sparkles"
                  className="w-4 h-4 text-white"
                />
                <span className="text-sm font-bold text-white tracking-wide">
                  {t("ialab.interaction_advisor.open_btn")}
                </span>
                <Icon
                  name="fa-chevron-right"
                  className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </div>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? "bg-[var(--theme-emphasis)]/10 rotate-180" : "bg-[var(--theme-primary)]/15 group-hover:scale-110"}`}
        >
          <Icon
            name="fa-chevron-down"
            className={`w-4 h-4 ${isOpen ? "text-[var(--theme-emphasis)]" : "text-[var(--theme-primary)]"} transition-colors`}
          />
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F7FA] p-5 rounded-xl border border-[var(--theme-primary)]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon
                  name="fa-wand-magic-sparkles"
                  className="w-5 h-5 text-[var(--theme-primary)]"
                />
                <h3 className="font-bold text-[var(--theme-emphasis)] text-sm">
                  {t("ialab.interaction_advisor.question")}
                </h3>
              </div>
              {input.length >= 3 && (
                <VoiceReader
                  text={`Describe tu tarea y te recomendaré la mejor herramienta de ChatGPT. Escribe: ${input || "tu tarea"}`}
                />
              )}
            </div>
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("ialab.interaction_advisor.input_placeholder")}
                aria-label={t("ialab.interaction_advisor.question")}
                className="w-full min-h-[80px] p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30 focus:border-[var(--theme-primary)] resize-none transition-all"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-medium">
                {input.length}/500
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleRecommend}
                disabled={input.trim().length < 3}
                className="px-6 py-2.5 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold rounded-xl hover:from-[var(--theme-emphasis)]-dark hover:to-[var(--theme-primary)]-dark transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="fa-wand-magic-sparkles" className="w-4 h-4" />{" "}
                {t("ialab.interaction_advisor.recommend_btn")}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {t("ialab.interaction_advisor.quick_categories")}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-[#E0F7FA] border border-slate-200 hover:border-[var(--theme-primary)]/30 rounded-lg text-xs font-medium text-slate-600 hover:text-[var(--theme-emphasis)] transition-all"
                >
                  <Icon
                    name={s.icon}
                    className="w-3.5 h-3.5 text-[var(--theme-primary)]"
                  />{" "}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {showResult && recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-slate-100 pt-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[var(--theme-emphasis)] text-sm flex items-center gap-2">
                  <Icon
                    name="fa-circle-check"
                    className="w-4 h-4 text-emerald-500"
                  />{" "}
                  {t("ialab.interaction_advisor.recommended_tool")}
                </h3>
                <VoiceReader
                  text={`Te recomiendo usar ${recommendation.tool.title}. ${recommendation.reason}. El modelo recomendado es ${recommendation.model} en modo ${recommendation.mode}.`}
                />
              </div>

              <div className="bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-emphasis)]-dark p-5 rounded-xl text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Icon
                      name={recommendation.tool.icon}
                      className="w-5 h-5 text-[var(--theme-primary)]"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">
                      {recommendation.tool.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-${getToolColor(recommendation.tool.color)}-500/20 text-${getToolColor(recommendation.tool.color)}-300`}
                    >
                      {recommendation.model} · {recommendation.mode}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-3">
                  {recommendation.reason}
                </p>
              </div>

              <div className="bg-[#F0FDFF] p-4 rounded-xl border border-[var(--theme-primary)]/10">
                <h4 className="font-bold text-[var(--theme-emphasis)] text-xs mb-2 flex items-center gap-1.5">
                  <Icon name="fa-lightbulb" className="w-3.5 h-3.5" />{" "}
                  {t("ialab.interaction_advisor.suggested_prompt")}
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <code className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                    {recommendation.prompt}
                  </code>
                </div>
                <p className="text-[10px] text-slate-600 mt-1 italic">
                  {t("ialab.interaction_advisor.customize_prompt")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 text-xs mb-2 flex items-center gap-1.5">
                    <Icon name="fa-circle-check" className="w-3.5 h-3.5" />{" "}
                    {t("ialab.interaction_advisor.tips")}
                  </h4>
                  <ul className="space-y-1">
                    {recommendation.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-slate-700"
                      >
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{" "}
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-amber-800 text-xs mb-2 flex items-center gap-1.5">
                    <Icon name="fa-arrows-rotate" className="w-3.5 h-3.5" />{" "}
                    {t("ialab.interaction_advisor.alternatives")}
                  </h4>
                  <ul className="space-y-1">
                    {recommendation.alternatives.map((alt, i) => (
                      <li key={i} className="text-xs text-slate-700">
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {showResult && !recommendation && input.trim().length >= 3 && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
              <Icon
                name="fa-circle-info"
                className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
              />
              <div>
                <p className="font-bold text-amber-800 text-sm">
                  {t("ialab.interaction_advisor.no_recommendation_title")}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  {t("ialab.interaction_advisor.no_recommendation_desc")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

VoiceReader.propTypes = {
  text: PropTypes.string,
};

export default IALabInteractionAdvisor;
