import { TABLE_NAME, countModuleResources } from "./constants";
import { coreFactory } from "./core";

const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

const buildModuleBreakdown = (progressData, numericModuleId) => {
  const summary =
    progressData?.find(
      (p) => p.activity_type === null && p.resource_id === null,
    ) || {};
  const resourcesViewed = summary.resources_viewed || 0;
  const totalResources =
    summary.total_resources || countModuleResources(numericModuleId);

  const examProgress = progressData?.find((p) => p.activity_type === "exam");
  const challengeProgress = progressData?.find(
    (p) => p.activity_type === "challenge",
  );
  const communityProgress = progressData?.find(
    (p) => p.activity_type === "community_comment",
  );

  const examScore = examProgress?.score || 0;
  const examPassed = examScore >= 80;
  const challengeScore = challengeProgress?.score || 0;
  const challengePassed = challengeScore >= 80;

  const examEarned = Math.round((examScore / 100) * 35 * 10) / 10;
  const challengeEarned = Math.round((challengeScore / 100) * 30 * 10) / 10;
  const resourcesPct =
    totalResources > 0 && resourcesViewed / totalResources >= 0.8 ? 30 : 0;
  const communityEarned = communityProgress?.community_comment ? 5 : 0;

  const earned = examEarned + challengeEarned + resourcesPct + communityEarned;

  return {
    moduleId: numericModuleId,
    exam: {
      passed: examPassed,
      score: examScore,
      weight: 35,
      earned: examEarned,
    },
    challenge: {
      passed: challengePassed,
      score: challengeScore,
      weight: 30,
      earned: challengeEarned,
    },
    resources: {
      viewed: resourcesViewed,
      total: totalResources,
      weight: 30,
      earned: resourcesPct,
    },
    community: {
      commented: !!communityProgress?.community_comment,
      weight: 5,
      earned: communityEarned,
    },
    moduleScore: Math.min(100, Math.round(earned)),
    moduleProgressPct: Math.min(20, Math.round((earned / 100) * 20 * 10) / 10),
  };
};

export const scoringFactory = (db) => ({
  getFullUserProgress: async (userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const { getAllProgress } = coreFactory(db);
      const allProgress = await getAllProgress(actualUserId);
      if (!allProgress || allProgress.length === 0)
        return {
          allProgress: [],
          moduleBreakdowns: {},
          globalProgress: 0,
          lastProgress: null,
        };

      const moduleBreakdowns = {};
      let totalProgress = 0;

      for (let mod = 1; mod <= 5; mod++) {
        const progressData = allProgress.filter((p) => p.module_id === mod);
        const breakdown = buildModuleBreakdown(progressData, mod);
        moduleBreakdowns[mod] = breakdown;
        totalProgress += breakdown.moduleProgressPct;
      }

      const lastProgress =
        allProgress
          .filter((p) => p.activity_type === null && p.resource_id === null)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0] ||
        null;

      return {
        allProgress,
        moduleBreakdowns,
        globalProgress: Math.min(100, Math.round(totalProgress)),
        lastProgress,
      };
    } catch (err) {
      console.error("Error getting full user progress:", err);
      return null;
    }
  },

  getModuleBreakdown: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        console.error("[PROGRESS] moduleId inv\u00e1lido:", moduleId);
        return null;
      }

      const { data: progressData, error } = await db
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId);

      if (error) throw error;

      return buildModuleBreakdown(progressData, numericModuleId);
    } catch (err) {
      console.error("Error getting module breakdown:", err);
      return null;
    }
  },

  calculateGlobalProgressFromDB: async (userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return 0;

      let totalProgress = 0;
      const { getModuleBreakdown } = scoringFactory(db);
      for (let mod = 1; mod <= 5; mod++) {
        const breakdown = await getModuleBreakdown(mod, actualUserId);
        if (breakdown) {
          totalProgress += breakdown.moduleProgressPct || 0;
        }
      }

      return Math.min(100, Math.round(totalProgress));
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("Error calculating global progress:", msg);
      return 0;
    }
  },
});
