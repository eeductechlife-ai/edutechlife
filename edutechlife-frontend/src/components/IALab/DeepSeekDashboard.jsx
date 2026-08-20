import { memo } from "react";
import { Icon } from "../../utils/iconMapping.jsx";
import {
  FORUM_COMPONENTS,
  FORUM_TYPOGRAPHY,
  FORUM_EFFECTS,
  cn,
} from "../forum/forumDesignSystem";

const DeepSeekDashboard = memo(
  ({ deepSeekData, t, copyToClipboard, handleNewGeneration }) => {
    return (
      <div className="mt-8 space-y-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-lg">
                <Icon name="fa-brain" className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 font-sans">
                  {t("ialab.synthesizer.dashboard_title")}
                </h3>
                <p className="text-slate-600 font-sans">
                  {t("ialab.synthesizer.dashboard_desc")}
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 rounded-full border border-[var(--theme-emphasis)]/20">
              <span className="text-sm font-bold text-[var(--theme-emphasis)] font-sans">
                {t("ialab.synthesizer.live")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 mb-1 font-sans">
                {t("ialab.synthesizer.model")}
              </div>
              <div className="font-bold text-slate-800 font-sans">
                deepseek-chat
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 mb-1 font-sans">
                {t("ialab.synthesizer.temperature")}
              </div>
              <div className="font-bold text-slate-800 font-sans">0.7</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 mb-1 font-sans">
                {t("ialab.synthesizer.tokens")}
              </div>
              <div className="font-bold text-slate-800 font-sans">
                ~{Math.round(deepSeekData.prompt_maestro.length / 4)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100">
              <div className="text-sm text-slate-500 mb-1 font-sans">
                {t("ialab.synthesizer.quality")}
              </div>
              <div className="font-bold text-green-600 font-sans">Premium</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 hover:-translate-y-1 hover:shadow transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="fa-user-tie" className="text-[var(--theme-emphasis)]" />
              <span className="text-xs font-black text-[var(--theme-emphasis)] tracking-widest uppercase font-sans">
                {t("ialab.synthesizer.rol")}
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed font-sans">
              {deepSeekData.rol}
            </p>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[var(--theme-emphasis)]/5 rounded-full blur-sm"></div>
          </div>
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 hover:-translate-y-1 hover:shadow transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="fa-target" className="text-[var(--theme-primary)]" />
              <span className="text-xs font-black text-[var(--theme-primary)] tracking-widest uppercase font-sans">
                {t("ialab.synthesizer.task")}
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed font-sans">
              {deepSeekData.tarea}
            </p>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[var(--theme-primary)]/5 rounded-full blur-sm"></div>
          </div>
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 hover:-translate-y-1 hover:shadow transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="fa-file-alt" className="text-[var(--theme-emphasis)]" />
              <span className="text-xs font-black text-[var(--theme-emphasis)] tracking-widest uppercase font-sans">
                {t("ialab.synthesizer.format")}
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed font-sans">
              {deepSeekData.formato}
            </p>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[var(--theme-emphasis)]/5 rounded-full blur-sm"></div>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] p-8 relative shadow-2xl overflow-hidden mb-8 animate-in zoom-in duration-400">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="fa-terminal" className="text-slate-600" />
                <span className="text-sm font-bold text-slate-300 font-sans">
                  {t("ialab.synthesizer.terminal_header")}
                </span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(deepSeekData.prompt_maestro)}
              className="absolute top-6 right-6 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 font-sans"
              aria-label={t("ialab.synthesizer.copy_aria")}
            >
              <Icon name="fa-copy" className="text-sm" />{" "}
              {t("ialab.synthesizer.copy")}
            </button>
          </div>
          <div className="font-mono font-medium leading-relaxed text-lg text-slate-200 whitespace-pre-wrap bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            {deepSeekData.prompt_maestro}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-600 font-sans">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Icon name="fa-code" className="text-xs" />
                <span>{t("ialab.synthesizer.prompt_engineering")}</span>
              </span>
              <span className="flex items-center gap-1">
                <Icon name="fa-brain" className="text-xs" />
                <span>{t("ialab.synthesizer.deepseek_ai")}</span>
              </span>
            </div>
            <div className="text-xs">
              {t("ialab.synthesizer.word_char_count", {
                words: deepSeekData.prompt_maestro.split(" ").length,
                chars: deepSeekData.prompt_maestro.length,
              })}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-[var(--theme-emphasis)] rounded-r-3xl rounded-l-md p-8 shadow-sm relative mb-8 overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <Icon
            name="fa-lightbulb"
            className="absolute right-4 bottom-4 text-[var(--theme-emphasis)]/10 opacity-20 w-32 h-32"
          />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center">
              <Icon name="fa-lightbulb" className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--theme-emphasis)] font-sans">
                {t("ialab.synthesizer.technical_analysis")}
              </h4>
              <p className="text-sm text-[var(--theme-emphasis)] font-sans">
                {t("ialab.synthesizer.technical_analysis_desc")}
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-slate-700 font-medium leading-relaxed mb-6 font-sans">
              {deepSeekData.analisis_tecnico}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white border border-[var(--theme-emphasis)]/20 text-[var(--theme-emphasis)] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                {t("ialab.synthesizer.structure_rtf")}
              </span>
              <span className="bg-white border border-[var(--theme-primary)]/20 text-[var(--theme-primary)] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                {t("ialab.synthesizer.specificity")}
              </span>
              <span className="bg-white border border-[var(--theme-emphasis)]/20 text-[var(--theme-emphasis)] px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                {t("ialab.synthesizer.clarity")}
              </span>
              <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black shadow-sm font-sans">
                {t("ialab.synthesizer.context")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="fa-info-circle" className="text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-700 font-sans">
                  {t("ialab.synthesizer.generated_with")}
                </p>
                <p className="text-xs text-slate-500 font-sans">
                  {t("ialab.synthesizer.model_label")}: deepseek-chat •{" "}
                  {t("ialab.synthesizer.temperature_label")}: 0.7 •{" "}
                  {t("ialab.synthesizer.response_format_label")}: JSON
                </p>
              </div>
            </div>
            <button
              onClick={handleNewGeneration}
              className="px-4 py-2 text-sm font-medium text-[var(--theme-emphasis)] bg-[var(--theme-emphasis)]/10 hover:bg-[var(--theme-emphasis)]/20 rounded-lg transition-colors font-sans"
            >
              <Icon name="fa-rotate-right" className="mr-2" />{" "}
              {t("ialab.synthesizer.generate_new")}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

DeepSeekDashboard.displayName = "DeepSeekDashboard";

export default DeepSeekDashboard;
