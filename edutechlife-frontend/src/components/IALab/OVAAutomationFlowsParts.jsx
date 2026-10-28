import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  BrainCircuit,
  CheckCircle2,
  Zap,
  Grid3x3,
  ArrowRight,
} from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-text)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] theme-text">edutech</span>
      <span className="font-[400] theme-text-primary">life</span>
    </div>
  </div>
);

// M1: Framework del flujo ideal

export const AutomationFramework = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);
  const stages = [
    {
      k: "input",
      label: t("ova.automation.stage_input"),
      icon: <Zap className="w-5 h-5" />,
      color: "bg-blue-500",
      desc: t("ova.automation.stage_input_desc"),
      example: t("ova.automation.stage_input_example"),
    },
    {
      k: "orchestration",
      label: t("ova.automation.stage_orchestration"),
      icon: <Grid3x3 className="w-5 h-5" />,
      color: "bg-[var(--theme-primary)]",
      desc: t("ova.automation.stage_orchestration_desc"),
      example: t("ova.automation.stage_orchestration_example"),
    },
    {
      k: "output",
      label: t("ova.automation.stage_output"),
      icon: <ArrowRight className="w-5 h-5" />,
      color: "bg-emerald-500",
      desc: t("ova.automation.stage_output_desc"),
      example: t("ova.automation.stage_output_example"),
    },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t("ova.automation.framework_intro")}
      </p>
      <div className="space-y-3">
        {stages.map((s, idx) => (
          <button
            key={s.k}
            type="button"
            onClick={() => setExpanded(expanded === s.k ? null : s.k)}
            aria-expanded={expanded === s.k}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              expanded === s.k
                ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 dark:bg-slate-700 shadow-md"
                : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${s.color} text-white font-bold text-sm`}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-[900] theme-text dark:text-white text-sm leading-tight">
                  {s.label}
                </h5>
                {expanded === s.k && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {s.desc}
                    </p>
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono text-slate-700 dark:text-slate-200 italic">
                      "{s.example}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// M2/M3/M4: Vista de caso genérica

export const CaseView = ({ caseKey, icon, gradient, onComplete }) => {
  const { t } = useTranslation();
  const [analyzed, setAnalyzed] = useState(false);
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div
        className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border-2 border-white/40 shadow-md`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {icon}
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t(`ova.automation.${caseKey}_title`)}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t(`ova.automation.${caseKey}_scenario`)}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t("ova.automation.the_workflow")}
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] text-[10px] font-black flex items-center justify-center">
                {step}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t(`ova.automation.${caseKey}_step${step}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setAnalyzed(true);
          onComplete();
        }}
        disabled={analyzed}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--theme-text)] to-[var(--theme-primary)] text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 transition-all"
      >
        {analyzed
          ? t("ova.automation.analyzed")
          : t("ova.automation.analyze_workflow")}
      </button>

      {analyzed && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {t("ova.automation.workflow_understood")}
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
            {t(`ova.automation.${caseKey}_insight`)}
          </p>
        </div>
      )}
    </div>
  );
};
CaseView.propTypes = {
  caseKey: PropTypes.string.isRequired,
  icon: PropTypes.node,
  gradient: PropTypes.string,
  onComplete: PropTypes.func,
};

// M5: Diseña tu flujo

export const DesignYourFlow = ({ onCompleted }) => {
  const { t } = useTranslation();
  const [tools, setTools] = useState([]);
  const toolOptions = [
    { k: "web", label: t("ova.automation.tool_web"), icon: "🔍" },
    { k: "dalle", label: t("ova.automation.tool_dalle"), icon: "🎨" },
    { k: "canvas", label: t("ova.automation.tool_canvas"), icon: "📝" },
    { k: "gpt", label: t("ova.automation.tool_gpt"), icon: "🤖" },
    { k: "sheets", label: t("ova.automation.tool_sheets"), icon: "📊" },
  ];
  const toggleTool = (k) => {
    setTools((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
  };
  const handleSubmit = () => {
    try {
      const key = "ialab_automation_flows";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ tools, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(list.slice(-10)));
    } catch {
      /* silent */
    }
    onCompleted();
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-emphasis)] border-2 border-white/40 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            🏗️
          </div>
          <h4 className="text-white font-[900] text-lg tracking-tight leading-tight">
            {t("ova.automation.design_title")}
          </h4>
        </div>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {t("ova.automation.design_prompt")}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
          {t("ova.automation.select_tools")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {toolOptions.map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => toggleTool(opt.k)}
              aria-pressed={tools.includes(opt.k)}
              className={`p-2.5 rounded-lg border-2 transition-all text-xs font-bold text-center ${
                tools.includes(opt.k)
                  ? "border-[var(--theme-primary)] bg-blue-50 dark:bg-slate-700 theme-text dark:text-white"
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="text-lg mb-0.5">{opt.icon}</div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {tools.length > 0 && (
        <>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
              {t("ova.automation.your_flow")}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tools.map((t, i) => (
                <React.Fragment key={t}>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] text-xs font-black">
                    {toolOptions.find((x) => x.k === t)?.label}
                  </span>
                  {i < tools.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all"
          >
            {t("ova.automation.save_flow")}
          </button>
        </>
      )}
    </div>
  );
};
DesignYourFlow.propTypes = { onCompleted: PropTypes.func };

// M6: Conclusión

export const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <Zap className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black theme-text dark:text-white mb-2 uppercase tracking-tighter">
        {t("ova.automation.conclusion_title")}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-4 leading-relaxed">
        {t("ova.automation.conclusion_desc")}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        {t("ova.automation.conclusion_hint")}
      </p>
    </div>
  );
};
