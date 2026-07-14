export const transformProgressData = (data) => {
  const completedVideos = [];
  const completedModules = [];
  const completedExams = {};
  const completedInfographics = [];
  const completedActivities = [];
  const challengeScores = {};
  const completedCommunity = [];
  let gamification = null;

  const resourcesPerModule = {};

  data?.forEach((record) => {
    if (!record.is_completed) return;

    switch (record.activity_type) {
      case "video":
        completedVideos.push(record.resource_id);
        break;
      case "module":
        if (record.resource_id) {
          const moduleId = parseInt(
            record.resource_id.replace("module_", ""),
            10,
          );
          if (!isNaN(moduleId)) completedModules.push(moduleId);
        }
        break;
      case "exam": {
        const examScore = record.score;
        if (examScore !== null && examScore !== undefined) {
          const mId = Number(
            record.module_id || record.resource_id?.replace("exam_", ""),
          );
          if (!isNaN(mId)) completedExams[mId] = examScore;
        } else if (record.module_id) {
          completedExams[record.module_id] = 100;
        }
        break;
      }
      case "infographic":
        completedInfographics.push(record.resource_id);
        break;
      case "activity":
        completedActivities.push(record.resource_id);
        break;
      case "challenge":
        if (
          record.module_id &&
          record.score !== null &&
          record.score !== undefined
        ) {
          challengeScores[record.module_id] = record.score;
        }
        break;
      case "community_comment":
        if (record.module_id) {
          completedCommunity.push(record.module_id);
        }
        break;
      case "gamification":
        if (record.gamification_data) {
          gamification = record.gamification_data;
        }
        break;
      default:
        if (record.module_id && record.resource_id) {
          if (!resourcesPerModule[record.module_id])
            resourcesPerModule[record.module_id] = { viewed: 0, total: 8 };
          resourcesPerModule[record.module_id].viewed++;
        }
        break;
    }

    if (
      record.activity_type === null &&
      record.resource_id === null &&
      record.module_id
    ) {
      if (!resourcesPerModule[record.module_id]) {
        resourcesPerModule[record.module_id] = { viewed: 0, total: 8 };
      }
      const mod = resourcesPerModule[record.module_id];
      mod.total = record.total_resources || mod.total || 8;
      mod.viewed = Math.max(mod.viewed, record.resources_viewed || 0);
    }
  });

  Object.entries(resourcesPerModule).forEach(([modId, info]) => {
    if (info.viewed <= 0) return;
    const nid = parseInt(modId, 10);
    if (isNaN(nid)) return;
    const existingCount =
      completedVideos.filter((v) => String(v).startsWith(`m${nid}`)).length +
      completedInfographics.filter((i) => String(i).startsWith(`i${nid}`))
        .length;
    const needed = info.viewed - existingCount;
    for (let i = 0; i < needed; i++) {
      completedVideos.push(`m${nid}_viewed_${i}`);
    }
  });

  return {
    success: true,
    error: null,
    data: {
      completedVideos,
      completedModules: [...new Set(completedModules)],
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      completedCommunity,
      gamification,
      recordCount: data?.length || 0,
    },
  };
};

export const mergeProgress = (localData, remoteData) => {
  if (!remoteData) return localData;
  if (!localData) return remoteData;

  const mergeArrays = (local, remote) => {
    const merged = new Set([...local, ...remote]);
    return Array.from(merged);
  };

  const mergeExams = (local, remote) => {
    const merged = { ...remote };
    for (const [modId, score] of Object.entries(local || {})) {
      if (score > (merged[modId] || 0)) {
        merged[modId] = score;
      }
    }
    return merged;
  };

  const mergeChallengeScores = (local, remote) => {
    return { ...local, ...remote };
  };

  const mergeGamification = (local, remote) => {
    if (!remote) return local || null;
    if (!local) return remote;
    return {
      xp: Math.max(local.xp || 0, remote.xp || 0),
      streak: Math.max(local.streak || 0, remote.streak || 0),
      lastActivityDate:
        [local.lastActivityDate, remote.lastActivityDate]
          .filter(Boolean)
          .sort()
          .pop() || null,
      badges: [...new Set([...(local.badges || []), ...(remote.badges || [])])],
      lessonProgress: {
        ...(remote.lessonProgress || {}),
        ...(local.lessonProgress || {}),
      },
      checkpointAnswers: {
        ...(remote.checkpointAnswers || {}),
        ...(local.checkpointAnswers || {}),
      },
      forumPostCount: Math.max(
        local.forumPostCount || 0,
        remote.forumPostCount || 0,
      ),
      forumCommentCount: Math.max(
        local.forumCommentCount || 0,
        remote.forumCommentCount || 0,
      ),
      startDate: remote.startDate || local.startDate || null,
    };
  };

  return {
    completedVideos: mergeArrays(
      localData.completedVideos || [],
      remoteData.completedVideos || [],
    ),
    completedModules: mergeArrays(
      localData.completedModules || [],
      remoteData.completedModules || [],
    ),
    completedExams: mergeExams(
      localData.completedExams || {},
      remoteData.completedExams || {},
    ),
    completedInfographics: mergeArrays(
      localData.completedInfographics || [],
      remoteData.completedInfographics || [],
    ),
    completedActivities: mergeArrays(
      localData.completedActivities || [],
      remoteData.completedActivities || [],
    ),
    challengeScores: mergeChallengeScores(
      localData.challengeScores || {},
      remoteData.challengeScores || {},
    ),
    completedCommunity: mergeArrays(
      localData.completedCommunity || [],
      remoteData.completedCommunity || [],
    ),
    gamification: mergeGamification(
      localData.gamification,
      remoteData.gamification,
    ),
  };
};
