import { useState, useEffect, memo, useCallback } from "react";
import PropTypes from "prop-types";
import confetti from "canvas-confetti";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabProgressContext } from "../../context/IALabContext";
import { useIALabStore } from "../../store/ialabStore";
import { useActivityTracker } from "../../hooks/useActivityTracker";
import { useTranslation } from "../../i18n/I18nProvider";
import { usePremiumStatus } from "../../hooks/usePremiumStatus";
import ScoreBreakdown from "./ScoreBreakdown";
import FeedbackPanel from "./FeedbackPanel";
import CompetenceRadar from "./CompetenceRadar";
import { getCompetenceLevel, computeRadarScores } from "./competenceLevel.js";

const IALabEvaluationResults = ({
  evaluation,
  onClose,
  activityType = "challenge",
  onRetry,
}) => {
  const { t } = useTranslation();
  const { activeMod } = useIALabProgressContext();
  const { trackActivity } = useActivityTracker();
  const { isPremium } = usePremiumStatus();
  const [gradeSaved, setGradeSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (activityType !== "challenge") return;
    const state = useIALabStore.getState();
    const current = state.getChallengeRemainingAttempts(activeMod);
    setRemainingAttempts(current);
  }, [activityType, activeMod]);

  const handleRetry = useCallback(() => {
    if (activityType !== "challenge") return;
    const state = useIALabStore.getState();
    if (!state.canAttemptChallengeRetry(activeMod)) {
      const nextTime = state.getNextAttemptTime(activeMod);
      if (nextTime && Date.now() < nextTime) {
        const hoursLeft = Math.ceil((nextTime - Date.now()) / 3600000);
        alert(
          t("ialab.challenge.notification_retry_wait", { hours: hoursLeft }),
        );
      }
      return;
    }
    const newVal = state.decrementChallengeAttempt(activeMod);
    setRemainingAttempts(newVal);
    if (onRetry) onRetry();
  }, [activityType, activeMod, onRetry, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGradeSaved(true);
      if (evaluation?.notaGlobal) {
        trackActivity({
          moduleId: activeMod,
          type: activityType,
          resourceId: `m${activeMod}_${activityType}`,
          title: `${activityType === "exam" ? t("ialab.module_actions.exam") : t("ialab.challenge.title_pending")} ${t("ialab.module_header.module")} ${activeMod}`,
          score: evaluation.notaGlobal,
          metadata: {
            nota_ej1: evaluation.nota_ej1,
            nota_ej2: evaluation.nota_ej2,
            nota_ej3: evaluation.nota_ej3,
            nota_ej4: evaluation.nota_ej4,
            feedback_ej1: evaluation.feedback_ej1,
            feedback_ej2: evaluation.feedback_ej2,
            feedback_ej3: evaluation.feedback_ej3,
            feedback_ej4: evaluation.feedback_ej4,
          },
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!evaluation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Icon
            name="fa-exclamation-triangle"
            className="text-red-500 text-3xl"
          />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {t("ialab.evaluation.results.no_results_title")}
        </h3>
        <p className="text-slate-500 text-center max-w-md mb-6">
          {t("ialab.evaluation.results.no_results_desc")}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
        >
          <Icon name="fa-arrow-left" className="mr-2" />
          {t("ialab.evaluation.results.back_to_start")}
        </button>
      </div>
    );
  }

  const isApproved = evaluation.notaGlobal >= 80;
  const scoreColor = isApproved ? "text-emerald-600" : "text-red-600";
  const scoreBgColor = isApproved
    ? "bg-emerald-50 border-emerald-200"
    : "bg-red-50 border-red-200";
  const scoreBarColor = isApproved
    ? "from-emerald-500 to-emerald-400"
    : "from-red-500 to-red-400";
  const competence = getCompetenceLevel(evaluation.notaGlobal);
  const radar = computeRadarScores(evaluation);

  useEffect(() => {
    if (isApproved && !celebrated) {
      setCelebrated(true);
      const duration = 1200;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ["#00BCD4", "#004B63", "#66CCCC"],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ["#00BCD4", "#004B63", "#66CCCC"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isApproved, celebrated]);

  const percentage = evaluation.notaGlobal;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto dark:bg-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
                <Icon name="fa-trophy" className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {t("ialab.evaluation.results.result_title", {
                    module: activeMod,
                  })}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("ialab.evaluation.results.result_subtitle")}
                </p>
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${gradeSaved ? "bg-emerald-50 border-emerald-200" : "bg-petroleum/5 border-petroleum/10"}`}
            >
              {gradeSaved ? (
                <>
                  <Icon name="fa-check-circle" className="text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">
                    {t("ialab.evaluation.results.grade_registered")}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-petroleum border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-petroleum font-medium">
                    {t("ialab.evaluation.results.registering_grade")}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-petroleum/10 to-corporate/10 rounded-xl p-5 border border-corporate/20 dark:from-petroleum/20 dark:to-corporate/20 dark:border-corporate/40">
            <div className="flex items-center gap-3">
              <Icon name="fa-chart-line" className="text-petroleum text-xl" />
              <div>
                <h3 className="text-lg font-bold text-petroleum mb-1">
                  {t("ialab.evaluation.results.score_weight_info", {
                    module: activeMod,
                  })}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {t("ialab.evaluation.results.score_weight_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de competencia */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`rounded-xl border p-4 flex items-center gap-3 ${isApproved ? "bg-emerald-50/60 border-emerald-200" : "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"}`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${isApproved ? "bg-emerald-500" : "bg-slate-400"}`}
            >
              <Icon
                name={
                  competence.key === "expert"
                    ? "fa-trophy"
                    : competence.key === "creator"
                      ? "fa-bolt"
                      : "fa-compass"
                }
                className="text-white text-lg"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                {t("ialab.evaluation.results.competence_label")}
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {t(`ialab.evaluation.results.level_${competence.key}`)}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${isApproved ? "bg-emerald-50/60" : "bg-slate-50"} border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 rounded-xl p-4`}
          >
            <Icon name="fa-chart-pie" className="text-corporate text-xl" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                {t("ialab.evaluation.results.competencies_label")}
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {radar.average >= 80
                  ? t("ialab.evaluation.results.competencies_high")
                  : radar.average >= 60
                    ? t("ialab.evaluation.results.competencies_mid")
                    : t("ialab.evaluation.results.competencies_low")}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex space-x-1">
                {["overview", "feedback"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === tab
                        ? "bg-white text-petroleum border-b-2 border-corporate dark:bg-slate-800 dark:text-petroleum"
                        : "text-slate-600 hover:text-petroleum hover:bg-slate-50 dark:text-slate-400 dark:hover:text-petroleum dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon
                      name={
                        tab === "overview" ? "fa-chart-bar" : "fa-comment-dots"
                      }
                      className="mr-2"
                    />
                    {tab === "overview"
                      ? t("ialab.evaluation.results.tab_overview")
                      : t("ialab.evaluation.results.tab_feedback")}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" && (
              <ScoreBreakdown
                evaluation={evaluation}
                isApproved={isApproved}
                scoreBarColor={scoreBarColor}
                circumference={circumference}
                strokeDashoffset={strokeDashoffset}
                t={t}
              />
            )}

            {activeTab === "feedback" && (
              <FeedbackPanel evaluation={evaluation} t={t} />
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                {t("ialab.evaluation.results.stats_title")}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-500">
                      {t("ialab.evaluation.results.global_score")}
                    </span>
                    <span className={`text-lg font-bold ${scoreColor}`}>
                      {evaluation.notaGlobal}/100
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${scoreBarColor}`}
                      style={{ width: `${evaluation.notaGlobal}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    {t("ialab.evaluation.results.exercise_scores")}
                  </h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((n) => {
                      const nota = evaluation[`nota_ej${n}`];
                      if (nota === undefined || nota === null) return null;
                      return (
                        <div key={n}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-500">
                              {t(`ialab.evaluation.results.exercise_${n}`)}
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                nota >= 80
                                  ? "text-emerald-600"
                                  : nota >= 60
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {nota}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                nota >= 80
                                  ? "bg-emerald-500"
                                  : nota >= 60
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${nota}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`rounded-xl p-4 border ${scoreBgColor}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      name={isApproved ? "fa-trophy" : "fa-certificate"}
                      className={
                        isApproved ? "text-emerald-500" : "text-petroleum"
                      }
                    />
                    <h4
                      className={`font-semibold ${isApproved ? "text-emerald-700" : "text-petroleum"}`}
                    >
                      {isApproved
                        ? t("ialab.evaluation.results.challenge_passed")
                        : t("ialab.evaluation.results.challenge_failed")}
                    </h4>
                  </div>
                  <p
                    className={`text-sm ${isApproved ? "text-emerald-600" : "text-slate-600"}`}
                  >
                    {isApproved
                      ? t("ialab.evaluation.results.mastery_message")
                      : t("ialab.evaluation.results.need_80_retry")}
                  </p>
                </div>

                {isApproved && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-600 mb-1">
                      {t("ialab.evaluation.results.competencies_title")}
                    </h4>
                    <CompetenceRadar scores={radar.scores} />
                  </div>
                )}

                {isApproved && isPremium && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="rounded-xl p-4 border border-corporate/30 bg-corporate/5 dark:bg-corporate/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          name="fa-award"
                          className="text-corporate text-sm"
                        />
                        <h4 className="text-sm font-semibold text-petroleum dark:text-white">
                          {t(
                            "ialab.evaluation.results.certificate_final_kicker",
                          )}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {t("ialab.evaluation.results.certificate_final_desc")}
                      </p>
                    </div>
                  </div>
                )}

                {!isApproved && (
                  <div className="rounded-xl p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        name="fa-book-open"
                        className="text-amber-500 text-sm"
                      />
                      <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        {t("ialab.evaluation.results.review_recommended")}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      {t("ialab.evaluation.results.review_recommended_desc", {
                        module: activeMod,
                      })}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-slate-800">
                      {remainingAttempts}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t("ialab.evaluation.results.remaining_attempts")}
                    </div>
                  </div>
                  {isApproved && (
                    <div className="text-center bg-slate-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-slate-800">
                        80%+
                      </div>
                      <div className="text-xs text-slate-500">
                        {t("ialab.evaluation.results.passed_status")}
                      </div>
                    </div>
                  )}
                </div>
                {!isApproved && remainingAttempts > 0 && (
                  <button
                    onClick={handleRetry}
                    className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white font-bold text-sm hover:shadow-lg hover:shadow-petroleum/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Icon name="fa-rocket" className="text-base" />
                    {t("ialab.evaluation.results.retry_challenge")}
                  </button>
                )}
                {!isApproved && remainingAttempts <= 0 && (
                  <p className="text-xs text-center text-slate-600 mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    {t("ialab.evaluation.results.no_attempts_left")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

IALabEvaluationResults.propTypes = {
  evaluation: PropTypes.object,
  onClose: PropTypes.func,
  activityType: PropTypes.string,
  onRetry: PropTypes.func,
};

export default memo(IALabEvaluationResults);
