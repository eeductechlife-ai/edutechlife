import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";
import { useTranslation } from "../../i18n/I18nProvider";

const readLocalExamScores = () => {
  try {
    return JSON.parse(localStorage.getItem("ialab_completed_exams") || "{}");
  } catch {
    return {};
  }
};

const ActionCard = memo(
  ({
    icon,
    label,
    weightKey,
    onClick,
    completed,
    score,
    remainingAttempts,
    t,
  }) => {
    const prefersReducedMotion = useReducedMotion();
    const isApproved = completed && score !== undefined && score >= 80;
    const isFailed = completed && score !== undefined && score < 80;
    return (
      <motion.button
        data-testid={`action-card-${icon}`}
        onClick={onClick}
        whileHover={prefersReducedMotion ? {} : { y: -1 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
        title={weightKey ? t(weightKey) : ""}
        className="theme-prompt-card group w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-150 shadow-sm cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40"
      >
        <span
          className={`mt-1 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center ${
            isApproved
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : isFailed
                ? "bg-red-100 dark:bg-red-900/30"
                : "theme-chip"
          }`}
        >
          <Icon
            name={icon}
            className={`text-sm ${
              isApproved
                ? "text-emerald-600 dark:text-emerald-400"
                : isFailed
                  ? "text-red-500 dark:text-red-400"
                  : "text-[var(--theme-chip-text)]"
            }`}
          />
        </span>
        <div className="flex-1 min-w-0">
          <span
            className={`font-semibold text-[15px] block leading-snug ${
              isApproved
                ? "text-emerald-700 dark:text-emerald-400"
                : isFailed
                  ? "text-red-600 dark:text-red-400"
                  : "theme-text"
            }`}
          >
            {label}
          </span>
          <span
            className={`text-[13px] leading-snug ${
              isApproved
                ? "text-emerald-600 dark:text-emerald-400"
                : isFailed
                  ? "text-red-500 dark:text-red-400"
                  : "theme-text-muted"
            }`}
          >
            {isApproved
              ? `${score}% — ${t("ialab.module_actions.status_passed")}`
              : isFailed
                ? `${score}% — ${t("ialab.module_actions.status_failed")}`
                : t("ialab.module_actions.status_pending")}
          </span>
          {!completed && remainingAttempts !== undefined && (
            <span className="text-[12px] text-amber-600 dark:text-amber-400 block">
              {t("ialab.module_actions.attempts_left", {
                remaining: remainingAttempts,
              })}
            </span>
          )}
        </div>
        {(isApproved || isFailed) && (
          <span
            className={`flex-shrink-0 text-[13px] font-bold ${isApproved ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
          >
            {score}%
          </span>
        )}
      </motion.button>
    );
  },
);

const ModuleActions = ({
  onAction,
  activeMod,
  challengeScores,
  completedExams,
  moduleProgress,
  isForumOpen,
  onToggleForum,
}) => {
  const { t } = useTranslation();
  const [localExamScores, setLocalExamScores] = useState(readLocalExamScores);
  const [examAttempts, setExamAttempts] = useState(3);
  const [challengeAttempts, setChallengeAttempts] = useState(3);
  const effectiveExamScore =
    completedExams?.[activeMod] ?? localExamScores[activeMod];

  const refreshAttempts = useCallback(() => {
    const store = useIALabStore.getState();
    setExamAttempts(store.getExamRemainingAttempts(activeMod));
    setChallengeAttempts(store.getChallengeRemainingAttempts(activeMod));
  }, [activeMod]);

  useEffect(() => {
    refreshAttempts();
    const handler = () => setLocalExamScores(readLocalExamScores());
    window.addEventListener("ialab:examCompleted", handler);
    window.addEventListener("ialab:attemptsUpdated", refreshAttempts);
    return () => {
      window.removeEventListener("ialab:examCompleted", handler);
      window.removeEventListener("ialab:attemptsUpdated", refreshAttempts);
    };
  }, [refreshAttempts]);

  const handleCommunity = useCallback(() => {
    onToggleForum?.();
    // Scroll to forum after it renders
    setTimeout(() => {
      document
        .getElementById("forum-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }, [onToggleForum]);

  const handleChallenge = useCallback(() => {
    if (challengeScores?.[activeMod]) {
      onAction?.("SHOW_CHALLENGE_RESULT");
    } else {
      onAction?.("OPEN_CHALLENGE");
    }
  }, [challengeScores, activeMod, onAction]);

  const handleExam = useCallback(() => {
    if (effectiveExamScore !== undefined) {
      onAction?.("SHOW_EXAM_RESULT");
    } else {
      onAction?.("OPEN_QUIZ");
    }
  }, [effectiveExamScore, onAction]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-[15px] font-bold theme-text">
          {t("ialab.module_actions.title")}
        </h4>
        <p className="text-[15px] theme-text-muted leading-[1.65]">
          {t("ialab.module_actions.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionCard
          icon="fa-comments"
          label={t("ialab.module_actions.community")}
          weightKey="ialab.module_actions.weight_community"
          onClick={handleCommunity}
          completed={moduleProgress?.[activeMod]?.community}
          score={100}
          t={t}
        />
        <ActionCard
          icon="fa-rocket"
          label={t("ialab.module_actions.challenge")}
          weightKey="ialab.module_actions.weight_challenge"
          onClick={handleChallenge}
          completed={!!challengeScores?.[activeMod]}
          score={challengeScores?.[activeMod]}
          remainingAttempts={
            !challengeScores?.[activeMod] ? challengeAttempts : undefined
          }
          t={t}
        />
        <ActionCard
          icon="fa-clipboard-check"
          label={t("ialab.module_actions.exam")}
          weightKey="ialab.module_actions.weight_exam"
          onClick={handleExam}
          completed={effectiveExamScore !== undefined}
          score={effectiveExamScore}
          remainingAttempts={
            effectiveExamScore === undefined ? examAttempts : undefined
          }
          t={t}
        />
      </div>
    </div>
  );
};

ActionCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  weightKey: PropTypes.string,
  onClick: PropTypes.func,
  completed: PropTypes.bool,
  score: PropTypes.number,
  remainingAttempts: PropTypes.number,
  color: PropTypes.string,
  t: PropTypes.func,
};

export default React.memo(ModuleActions);
