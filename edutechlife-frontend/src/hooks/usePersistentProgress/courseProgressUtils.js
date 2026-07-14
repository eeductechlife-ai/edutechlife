import { calcModuleScore, calcGlobalProgress } from "../../utils/ialab";
import { WEIGHTS } from "../../constants/ialab";
import { MODULE_THRESHOLD, TOTAL_RESOURCES } from "./courseModuleConfig";

const buildModuleProgress = (
  moduleId,
  completedVideos,
  completedExams,
  completedInfographics,
  challengeScores,
  completedCommunity,
) => {
  const moduleVideos = completedVideos.filter((v) =>
    v.startsWith(`m${moduleId}`),
  );
  const moduleInfographics = completedInfographics.filter((i) =>
    i.startsWith(`i${moduleId}`),
  );
  const resourcesCompleted = moduleVideos.length + moduleInfographics.length;
  const examScore = completedExams[moduleId] || 0;
  const challengeScore = challengeScores?.[moduleId] || 0;

  return {
    exam: examScore >= MODULE_THRESHOLD,
    examEarned: (examScore / 100) * WEIGHTS.exam,
    challenge: challengeScore >= MODULE_THRESHOLD,
    challengeEarned: (challengeScore / 100) * WEIGHTS.challenge,
    resourcesCompleted: resourcesCompleted >= TOTAL_RESOURCES,
    community: completedCommunity?.includes(moduleId) || false,
  };
};

const calculateModuleProgressInternal = (
  moduleId,
  completedVideos,
  completedExams,
  completedInfographics,
  completedActivities,
  challengeScores,
  completedCommunity = [],
) => {
  const mod = buildModuleProgress(
    moduleId,
    completedVideos,
    completedExams,
    completedInfographics,
    challengeScores,
    completedCommunity,
  );
  return calcModuleScore(mod);
};

const calculateGlobalProgressInternal = (
  completedModules,
  completedVideos,
  completedExams,
  completedInfographics,
  completedActivities,
  challengeScores,
  completedCommunity = [],
) => {
  const scores = {};
  for (let i = 1; i <= 5; i++) {
    scores[i] = calculateModuleProgressInternal(
      i,
      completedVideos,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      completedCommunity,
    );
  }
  return calcGlobalProgress(scores);
};

export {
  buildModuleProgress,
  calculateModuleProgressInternal,
  calculateGlobalProgressInternal,
};
