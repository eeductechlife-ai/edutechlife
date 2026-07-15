import { calcModuleScore } from "../../utils/ialab";
import { WEIGHTS } from "../../constants/ialab";

export const formatTimeAgo = (date, t) => {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffMin < 1) return t ? t("activity.time.now") : "Ahora mismo";
  if (diffMin < 60)
    return t
      ? t("activity.time.minutes", { min: diffMin })
      : `Hace ${diffMin} min`;
  if (diffHrs < 24)
    return t
      ? t("activity.time.hours", { hours: diffHrs })
      : `Hace ${diffHrs}h`;
  if (diffDays < 7)
    return t
      ? t("activity.time.days", { days: diffDays })
      : `Hace ${diffDays}d`;
  return then.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const calculateModuleScore = (
  moduleId,
  config,
  completedVideos,
  completedInfographics,
  completedExams,
  challengeScores,
  completedModules,
) => {
  const moduleVideos = (completedVideos || []).filter((v) =>
    v.startsWith(`m${moduleId}`),
  ).length;
  const moduleInfographics = (completedInfographics || []).filter((i) =>
    i.startsWith(`i${moduleId}`),
  ).length;
  const totalResources = config.videos + config.infographics;
  const exam = completedExams?.[moduleId] || 0;
  const challenge = challengeScores?.[moduleId] || 0;
  return calcModuleScore({
    exam: exam >= 80,
    examEarned: (exam / 100) * WEIGHTS.exam,
    challenge: challenge >= 80,
    challengeEarned: (challenge / 100) * WEIGHTS.challenge,
    resourcesCompleted:
      totalResources > 0 &&
      (moduleVideos + moduleInfographics) / totalResources >= 0.8,
    community: (completedModules || []).includes(moduleId),
  });
};
