import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  Monitor,
  Play,
  CheckCircle,
  Check,
  ChevronRight,
  Pencil,
  Target,
  BarChart3,
  FileText,
} from "lucide-react";
import { OVAIntro, OVAValerioBar } from "./shared";
import {
  CONTENT_TYPES,
  GOALS,
  DOC_COUNTS,
  SOURCE_TIPS,
  GOAL_TIPS,
  DOC_TIPS,
  ESTIMATED_TIME,
  IDEAL_SOURCES,
  FORMATS,
  CHECKLIST_ITEMS,
} from "../../data/ova/podcastStudio";

const getRecommendations = (contentType, goal, docCount) => {
  const sourceTip = SOURCE_TIPS[contentType] || SOURCE_TIPS.mixto;
  const goalTip = GOAL_TIPS[goal] || GOAL_TIPS.explorar;
  const docTip = DOC_TIPS[docCount] || DOC_TIPS.medio;
  const estimatedTime = ESTIMATED_TIME[docCount] || ESTIMATED_TIME.medio;
  const idealSources = IDEAL_SOURCES[docCount] || IDEAL_SOURCES.medio;
  const formats = FORMATS[contentType] || FORMATS.mixto;

  return { sourceTip, goalTip, docTip, estimatedTime, idealSources, formats };
};

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`h-2 rounded-full transition-all duration-500 ${i < current ? "w-8 bg-corporate" : i === current ? "w-8 bg-petroleum" : "w-2 bg-slate-200 dark:bg-slate-600"}`}
      />
    ))}
  </div>
);

StepIndicator.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number,
};

export default function OVAPodcastStudio({ onComplete }) {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [step, setStep] = useState("intro");
  const [contentType, setContentType] = useState(null);
  const [goal, setGoal] = useState(null);
  const [docCount, setDocCount] = useState(null);
  const [checked, setChecked] = useState({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const checklistComplete = checkedCount === CHECKLIST_ITEMS.length;

  useEffect(() => {
    if (
      step === "checklist" &&
      checklistComplete &&
      !certCompletedRef.current
    ) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  }, [step, checklistComplete, onComplete]);

  const totalQuestions = 3;
  const currentQuestion = contentType ? (goal ? 2 : 1) : 0;

  const handleStart = () => {
    setContentType(null);
    setGoal(null);
    setDocCount(null);
    setChecked({});
    setStep("questions");
  };

  const handleAnswer = (type, value) => {
    if (type === "contentType") setContentType(value);
    if (type === "goal") setGoal(value);
    if (type === "docCount") {
      setDocCount(value);
      setStep("plan");
    }
  };

  const toggleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getValerioText = () => {
    if (step === "questions") return t("ova.podcaststudio.questions_voice");
    if (step === "plan") {
      const cType = CONTENT_TYPES.find((t) => t.id === contentType);
      const g = GOALS.find((t) => t.id === goal);
      const dCount = DOC_COUNTS.find((t) => t.id === docCount);
      return t("ova.podcaststudio.plan_voice", {
        cTypeLabel: cType?.label,
        gLabel: g?.label,
        dCountLabel: dCount?.label,
      });
    }
    if (step === "checklist") return t("ova.podcaststudio.checklist_voice");
    return "";
  };

  if (step === "intro") {
    return (
      <OVAIntro
        icon="fa-brain"
        badge={t("ova.podcaststudio.badge_assistant")}
        title={t("ova.podcaststudio.title")}
        description={t("ova.podcaststudio.subtitle")}
        onStart={handleStart}
        startLabel={t("ova.podcaststudio.start_btn")}
      />
    );
  }

  if (step === "questions") {
    const showType = !contentType;
    const showGoal = contentType && !goal;
    const showCount = contentType && goal && !docCount;

    return (
      <>
        <div className="ialab-animate-fade-in px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-petroleum dark:text-slate-100 font-semibold text-sm mb-4">
              <Monitor className="w-4 h-4 text-corporate" />
              <span>{t("ova.podcaststudio.badge_project")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-petroleum dark:text-slate-100 mb-2">
              {t("ova.podcaststudio.questions_title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {t("ova.podcaststudio.questions_desc")}
            </p>
          </div>

          <StepIndicator current={currentQuestion} total={totalQuestions} />

          <div className="max-w-3xl mx-auto space-y-8">
            {showType && (
              <div>
                <h3 className="text-lg font-bold text-petroleum dark:text-slate-100 mb-4 text-center">
                  {t("ova.podcaststudio.q_content_type")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CONTENT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleAnswer("contentType", t.id)}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-corporate hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="text-3xl mb-2">{t.icon}</div>
                      <div className="font-bold text-sm text-petroleum dark:text-slate-100 group-hover:text-corporate transition-colors">
                        {t.label}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showGoal && (
              <div>
                <h3 className="text-lg font-bold text-petroleum dark:text-slate-100 mb-4 text-center">
                  {t("ova.podcaststudio.q_goal")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleAnswer("goal", g.id)}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-corporate hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="text-3xl mb-2">{g.icon}</div>
                      <div className="font-bold text-sm text-petroleum dark:text-slate-100 group-hover:text-corporate transition-colors">
                        {g.label}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                        {g.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showCount && (
              <div>
                <h3 className="text-lg font-bold text-petroleum dark:text-slate-100 mb-4 text-center">
                  {t("ova.podcaststudio.q_doc_count")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DOC_COUNTS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleAnswer("docCount", d.id)}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border-2 border-slate-200 dark:border-slate-600 hover:border-corporate hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="text-3xl mb-2">{d.icon}</div>
                      <div className="font-bold text-sm text-petroleum dark:text-slate-100 group-hover:text-corporate transition-colors">
                        {d.label}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                        {d.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </>
    );
  }

  if (step === "plan") {
    const recs = getRecommendations(contentType, goal, docCount);
    const cType = CONTENT_TYPES.find((t) => t.id === contentType);
    const g = GOALS.find((t) => t.id === goal);
    const dCount = DOC_COUNTS.find((t) => t.id === docCount);

    return (
      <>
        <div className="ialab-animate-fade-in px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-4">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t("ova.podcaststudio.badge_plan")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-petroleum dark:text-slate-100 mb-2">
              {t("ova.podcaststudio.plan_title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {t("ova.podcaststudio.plan_desc")}
            </p>
          </div>

          <StepIndicator current={2} total={3} />

          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-4 py-2 bg-cyan-50 text-petroleum dark:text-slate-100 rounded-xl text-sm font-semibold border border-cyan-200">
                {cType?.icon} {cType?.label}
              </span>
              <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-petroleum dark:text-slate-100 rounded-xl text-sm font-semibold border border-purple-200">
                {g?.icon} {g?.label}
              </span>
              <span className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-petroleum dark:text-slate-100 rounded-xl text-sm font-semibold border border-amber-200">
                {dCount?.icon} {dCount?.label}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm">
              <h3 className="font-bold text-petroleum dark:text-slate-100 mb-4 flex items-center gap-2">
                <Pencil className="w-[18px] h-[18px] text-corporate" />
                {t("ova.podcaststudio.plan_summary")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t("ova.podcaststudio.sources_label")}
                  </div>
                  <div className="text-lg font-bold text-petroleum dark:text-slate-100">
                    {recs.idealSources}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t("ova.podcaststudio.format_label")} {recs.formats}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t("ova.podcaststudio.time_label")}
                  </div>
                  <div className="text-lg font-bold text-petroleum dark:text-slate-100">
                    {recs.estimatedTime}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t("ova.podcaststudio.time_sublabel")}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t("ova.podcaststudio.focus_label")}
                  </div>
                  <div className="text-lg font-bold text-petroleum dark:text-slate-100">
                    {g?.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {g?.desc}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <FileText
                      size={18}
                      className="flex-shrink-0 mt-0.5 text-blue-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                        {t("ova.podcaststudio.tip_sources")}
                      </div>
                      <p className="text-sm text-blue-900 leading-relaxed">
                        {recs.sourceTip}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Target
                      size={18}
                      className="flex-shrink-0 mt-0.5 text-purple-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
                        {t("ova.podcaststudio.tip_goal")}
                      </div>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        {recs.goalTip}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <BarChart3
                      size={18}
                      className="flex-shrink-0 mt-0.5 text-amber-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                        {t("ova.podcaststudio.tip_docs")}
                      </div>
                      <p className="text-sm text-amber-900 leading-relaxed">
                        {recs.docTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep("checklist")}
              className="px-8 py-3 bg-gradient-to-r from-corporate to-petroleum text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              {t("ova.podcaststudio.go_checklist")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </>
    );
  }

  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <>
      <div className="ialab-animate-fade-in px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-petroleum dark:text-slate-100 font-semibold text-sm mb-4">
            <Monitor className="w-4 h-4 text-corporate" />
            <span>{t("ova.podcaststudio.badge_checklist")}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-petroleum dark:text-slate-100 mb-2">
            {t("ova.podcaststudio.checklist_title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {t("ova.podcaststudio.checklist_desc")}
          </p>
        </div>

        <StepIndicator current={3} total={3} />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-petroleum dark:text-slate-100">
                {t("ova.podcaststudio.progress_label")}
              </span>
              <span className="text-sm font-bold text-corporate">
                {checkedCount}/{CHECKLIST_ITEMS.length}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-corporate to-petroleum h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {CHECKLIST_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  checked[item.id]
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-corporate"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    checked[item.id]
                      ? "bg-emerald-500"
                      : "bg-slate-100 dark:bg-slate-700/50 border-2 border-slate-300"
                  }`}
                >
                  {checked[item.id] && <Check className="w-4 h-4 text-white" />}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${checked[item.id] ? "text-emerald-700 dark:text-emerald-300 line-through" : "text-slate-700 dark:text-slate-200"}`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {checkedCount === CHECKLIST_ITEMS.length && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center mb-6 ialab-animate-fade-in">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                {t("ova.podcaststudio.completed_title")}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                {t("ova.podcaststudio.completed_desc")}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-petroleum dark:text-slate-100 border-2 border-slate-200 dark:border-slate-600 hover:border-corporate rounded-xl font-semibold transition-all inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t("ova.podcaststudio.restart_btn")}
            </button>
          </div>
        </div>
      </div>
      <OVAValerioBar text={getValerioText()} />
    </>
  );
}
