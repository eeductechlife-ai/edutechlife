import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "../useSupabase";
import { setupConnectionListener } from "../../services/progressSync";
import {
  MODULE_CONFIG,
  MODULE_THRESHOLD,
  TOTAL_RESOURCES,
} from "./courseModuleConfig";
import { STORAGE_KEYS } from "./storageKeys";
import { calculateModuleProgressInternal } from "./courseProgressUtils";
import useLocalProgress from "./useLocalProgress";
import useSyncProgress from "./useSyncProgress";
import { INITIAL_STATE } from "./constants";
import {
  applyProgressData,
  computeGlobalProgress,
  mergeLocalWithRemote,
} from "./localCache";
import { syncActivity, loadRemoteProgress } from "./supabaseSync";

const REMOTE_PROGRESS_TIMEOUT_MS = 6000;

const withRemoteTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((resolve) =>
      setTimeout(() => resolve(null), REMOTE_PROGRESS_TIMEOUT_MS),
    ),
  ]);

export const usePersistentProgress = () => {
  const {
    supabase,
    isLoading: supabaseLoading,
    isUsingJWT,
    userId,
    isSignedIn,
  } = useSupabase();

  // Gated on the Supabase session. This used to require a Clerk session, which
  // no longer exists, so it was never true and no progress ever reached Supabase.
  const isUserReady = isSignedIn && userId;

  const [completedVideos, setCompletedVideos] = useState(
    INITIAL_STATE.completedVideos,
  );
  const [completedModules, setCompletedModules] = useState(
    INITIAL_STATE.completedModules,
  );
  const [completedExams, setCompletedExams] = useState(
    INITIAL_STATE.completedExams,
  );
  const [completedInfographics, setCompletedInfographics] = useState(
    INITIAL_STATE.completedInfographics,
  );
  const [completedActivities, setCompletedActivities] = useState(
    INITIAL_STATE.completedActivities,
  );
  const [challengeScores, setChallengeScores] = useState(
    INITIAL_STATE.challengeScores,
  );
  const [completedCommunity, setCompletedCommunity] = useState(
    INITIAL_STATE.completedCommunity,
  );
  const [gamification, setGamification] = useState(INITIAL_STATE.gamification);
  const [courseProgress, setCourseProgress] = useState(
    INITIAL_STATE.courseProgress,
  );
  const [isLoading, setIsLoading] = useState(INITIAL_STATE.isLoading);
  const [syncStatus, setSyncStatus] = useState(INITIAL_STATE.syncStatus);

  const connectionCleanupRef = useRef(null);

  const {
    saveToLocalStorage,
    loadFromLocalStorage,
    recordActivity,
    recordLastTopic,
  } = useLocalProgress();
  const { syncToSupabase, syncGamification } = useSyncProgress(
    userId,
    supabase,
    setSyncStatus,
    setGamification,
  );

  const setters = {
    setCompletedVideos,
    setCompletedModules,
    setCompletedExams,
    setCompletedInfographics,
    setCompletedActivities,
    setChallengeScores,
    setCompletedCommunity,
    setGamification,
  };

  const updateProgress = useCallback(
    async (updates, immediate = false) => {
      const newData = {
        completedVideos: updates.completedVideos ?? completedVideos,
        completedModules: updates.completedModules ?? completedModules,
        completedExams: updates.completedExams ?? completedExams,
        completedInfographics:
          updates.completedInfographics ?? completedInfographics,
        completedActivities: updates.completedActivities ?? completedActivities,
        challengeScores: updates.challengeScores ?? challengeScores,
        completedCommunity: updates.completedCommunity ?? completedCommunity,
      };

      if (updates.completedVideos) setCompletedVideos(updates.completedVideos);
      if (updates.completedModules)
        setCompletedModules(updates.completedModules);
      if (updates.completedExams) setCompletedExams(updates.completedExams);
      if (updates.completedInfographics)
        setCompletedInfographics(updates.completedInfographics);
      if (updates.completedActivities)
        setCompletedActivities(updates.completedActivities);
      if (updates.challengeScores) setChallengeScores(updates.challengeScores);
      if (updates.completedCommunity)
        setCompletedCommunity(updates.completedCommunity);

      const progress = computeGlobalProgress(newData);
      setCourseProgress(progress);

      saveToLocalStorage(newData);
      syncToSupabase(newData, immediate);

      return progress;
    },
    [
      completedVideos,
      completedModules,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      completedCommunity,
      saveToLocalStorage,
      syncToSupabase,
    ],
  );

  const markVideoComplete = useCallback(
    async (videoId) => {
      const videoKey = `m${videoId}`;
      if (!completedVideos.includes(videoKey)) {
        const newVideos = [...completedVideos, videoKey];
        recordActivity();
        const progress = await updateProgress({ completedVideos: newVideos });

        syncActivity(supabase, userId, {
          activityType: "video",
          resourceId: videoKey,
          moduleId: videoId,
          isCompleted: true,
        });

        return progress;
      }
      return courseProgress;
    },
    [
      completedVideos,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markModuleComplete = useCallback(
    async (moduleId) => {
      if (!completedModules.includes(moduleId)) {
        const newModules = [...completedModules, moduleId];
        recordActivity();
        const progress = await updateProgress({ completedModules: newModules });

        syncActivity(supabase, userId, {
          activityType: "module",
          resourceId: `module_${moduleId}`,
          moduleId: moduleId,
          isCompleted: true,
        });

        return progress;
      }
      return courseProgress;
    },
    [
      completedModules,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markExamComplete = useCallback(
    async (moduleId, score) => {
      const examScore = score || completedExams[moduleId];

      if (examScore) {
        const newExams = { ...completedExams, [moduleId]: examScore };
        recordActivity();
        const progress = await updateProgress({ completedExams: newExams });

        syncActivity(supabase, userId, {
          activityType: "exam",
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true,
          score: examScore,
        });

        return progress;
      } else if (!examScore) {
      }
      return courseProgress;
    },
    [
      completedExams,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markInfographicComplete = useCallback(
    async (infographicId) => {
      const infographicKey = `i${infographicId}`;
      if (!completedInfographics.includes(infographicKey)) {
        const newInfographics = [...completedInfographics, infographicKey];
        recordActivity();
        const progress = await updateProgress({
          completedInfographics: newInfographics,
        });

        syncActivity(supabase, userId, {
          activityType: "infographic",
          resourceId: infographicKey,
          moduleId: infographicId,
          isCompleted: true,
        });

        return progress;
      }
      return courseProgress;
    },
    [
      completedInfographics,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markActivityComplete = useCallback(
    async (activityId) => {
      const activityKey = `a${activityId}`;
      if (!completedActivities.includes(activityKey)) {
        const newActivities = [...completedActivities, activityKey];
        recordActivity();
        const progress = await updateProgress({
          completedActivities: newActivities,
        });

        syncActivity(supabase, userId, {
          activityType: "activity",
          resourceId: activityKey,
          moduleId: activityId,
          isCompleted: true,
        });

        return progress;
      }
      return courseProgress;
    },
    [
      completedActivities,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markChallengeComplete = useCallback(
    async (moduleId, score) => {
      if (!score || score < MODULE_THRESHOLD) {
        return { progress: courseProgress, passed: false };
      }

      const newChallengeScores = { ...challengeScores, [moduleId]: score };
      recordActivity();
      const progress = await updateProgress({
        challengeScores: newChallengeScores,
      });

      syncActivity(supabase, userId, {
        activityType: "challenge",
        resourceId: null,
        moduleId: moduleId,
        isCompleted: true,
        score: score,
      });

      return { progress, passed: true };
    },
    [
      challengeScores,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const markCommunityComplete = useCallback(
    async (moduleId) => {
      if (!completedCommunity.includes(moduleId)) {
        const newCommunity = [...completedCommunity, moduleId];
        recordActivity();
        const progress = await updateProgress({
          completedCommunity: newCommunity,
        });

        syncActivity(supabase, userId, {
          activityType: "community_comment",
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true,
        });

        return progress;
      }
      return courseProgress;
    },
    [
      completedCommunity,
      updateProgress,
      userId,
      supabase,
      courseProgress,
      recordActivity,
    ],
  );

  const getModuleProgress = useCallback(
    (moduleId) => {
      return calculateModuleProgressInternal(
        moduleId,
        completedVideos,
        completedExams,
        completedInfographics,
        completedActivities,
        challengeScores,
        completedCommunity,
      );
    },
    [
      completedVideos,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      completedCommunity,
    ],
  );

  const getModuleStats = useCallback(
    (moduleId) => {
      const config = MODULE_CONFIG.find((m) => m.id === moduleId);
      if (!config) return { completed: 0, total: 0, score: 0 };

      const moduleVideos = completedVideos.filter((v) =>
        v.startsWith(`m${moduleId}`),
      );
      const moduleInfographics = completedInfographics.filter((i) =>
        i.startsWith(`i${moduleId}`),
      );
      const moduleActivities = completedActivities.filter((a) =>
        a.startsWith(`a${moduleId}`),
      );
      const examScore = completedExams[moduleId] || 0;
      const challengeScore = challengeScores[moduleId] || 0;

      const resourcesCompleted =
        moduleVideos.length + moduleInfographics.length;

      return {
        videosWatched: moduleVideos.length,
        totalVideos: config.videos,
        infographicsViewed: moduleInfographics.length,
        totalInfographics: config.infographics,
        activityCompleted: moduleActivities.length > 0,
        examPassed: examScore >= MODULE_THRESHOLD,
        examScore,
        challengePassed: challengeScore >= MODULE_THRESHOLD,
        challengeScore,
        communityDone: completedCommunity.includes(moduleId),
        resourcesPct:
          TOTAL_RESOURCES > 0
            ? Math.round((resourcesCompleted / TOTAL_RESOURCES) * 100)
            : 0,
        score: calculateModuleProgressInternal(
          moduleId,
          completedVideos,
          completedExams,
          completedInfographics,
          completedActivities,
          challengeScores,
          completedCommunity,
        ),
      };
    },
    [
      completedVideos,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      completedCommunity,
    ],
  );

  const resetProgress = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    applyProgressData(setters, INITIAL_STATE);
    setCourseProgress(0);
  }, []);

  const refreshProgress = useCallback(async () => {
    if (!userId || !supabase) return;

    setIsLoading(true);
    const remoteData = await withRemoteTimeout(
      loadRemoteProgress(supabase, userId),
    );

    if (remoteData) {
      const mergedData = mergeLocalWithRemote(
        loadFromLocalStorage(),
        remoteData,
      );
      applyProgressData(setters, mergedData);
      const progress = computeGlobalProgress(mergedData);
      setCourseProgress(progress);
      saveToLocalStorage(mergedData);
    }

    setIsLoading(false);
  }, [userId, supabase, loadFromLocalStorage, saveToLocalStorage]);

  useEffect(() => {
    if (!isUserReady) {
      setIsLoading(false);
      return;
    }

    const initializeProgress = async () => {
      setIsLoading(true);
      setSyncStatus("syncing");

      try {
        const localData = loadFromLocalStorage();

        // Render-first: si hay progreso local, pintarlo de inmediato en vez de
        // esperar el roundtrip remoto. El sync remoto refina el estado después.
        if (localData) {
          applyProgressData(setters, localData);
          setCourseProgress(computeGlobalProgress(localData));
        }

        const remoteData = await withRemoteTimeout(
          loadRemoteProgress(supabase, userId),
        );
        const mergedData = mergeLocalWithRemote(localData, remoteData);

        applyProgressData(setters, mergedData);
        if (mergedData.gamification) setGamification(mergedData.gamification);

        const progress = computeGlobalProgress(mergedData);
        setCourseProgress(progress);

        saveToLocalStorage(mergedData);

        setSyncStatus(
          remoteData ? "synced" : isUsingJWT ? "syncing" : "synced",
        );
      } catch (error) {
        console.error("❌ Error inicializando progreso:", error);
        setSyncStatus("error");

        const localData = loadFromLocalStorage();
        if (localData) {
          applyProgressData(setters, localData);
          setCourseProgress(computeGlobalProgress(localData));
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [
    isUserReady,
    userId,
    supabase,
    loadFromLocalStorage,
    saveToLocalStorage,
    isUsingJWT,
  ]);

  useEffect(() => {
    if (!userId || !supabase) return;

    connectionCleanupRef.current = setupConnectionListener(supabase, userId);

    return () => {
      if (connectionCleanupRef.current) {
        connectionCleanupRef.current();
      }
    };
  }, [userId, supabase]);

  return {
    courseProgress,
    gamification,
    completedVideos,
    completedModules,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
    completedCommunity,
    isLoading,
    syncStatus,
    isUsingJWT,
    userId,
    isUserReady,
    getModuleProgress,
    getModuleStats,
    markVideoComplete,
    markModuleComplete,
    markExamComplete,
    markInfographicComplete,
    markActivityComplete,
    markChallengeComplete,
    markCommunityComplete,
    resetProgress,
    refreshProgress,
    syncGamification,
    setCompletedModules,
    setCourseProgress,
    recordLastTopic,
  };
};

export default usePersistentProgress;
