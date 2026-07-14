import { useState, useEffect, useCallback, useRef } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/react";
import { useSupabase } from "../useSupabase";
import {
  syncActivityToSupabase,
  loadProgressFromSupabase,
  mergeProgress,
  setupConnectionListener,
} from "../../services/progressSync";
import {
  MODULE_CONFIG,
  MODULE_THRESHOLD,
  TOTAL_RESOURCES,
} from "./courseModuleConfig";
import { STORAGE_KEYS } from "./storageKeys";
import {
  calculateModuleProgressInternal,
  calculateGlobalProgressInternal,
} from "./courseProgressUtils";
import useLocalProgress from "./useLocalProgress";
import useSyncProgress from "./useSyncProgress";

export const usePersistentProgress = () => {
  const { user: clerkUser } = useUser();
  const { isSignedIn } = useClerkAuth();
  const {
    supabase,
    isLoading: supabaseLoading,
    isUsingJWT,
    userId: supabaseUserId,
  } = useSupabase();

  const userId = supabaseUserId || clerkUser?.id;
  const isUserReady = isSignedIn && userId;

  const [completedVideos, setCompletedVideos] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [completedExams, setCompletedExams] = useState({});
  const [completedInfographics, setCompletedInfographics] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [challengeScores, setChallengeScores] = useState({});
  const [completedCommunity, setCompletedCommunity] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle");

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

      const progress = calculateGlobalProgressInternal(
        newData.completedModules,
        newData.completedVideos,
        newData.completedExams,
        newData.completedInfographics,
        newData.completedActivities,
        newData.challengeScores,
        newData.completedCommunity,
      );
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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "video",
            resourceId: videoKey,
            moduleId: videoId,
            isCompleted: true,
          });
        }

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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "module",
            resourceId: `module_${moduleId}`,
            moduleId: moduleId,
            isCompleted: true,
          });
        }

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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "exam",
            resourceId: null,
            moduleId: moduleId,
            isCompleted: true,
            score: examScore,
          });
        }

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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "infographic",
            resourceId: infographicKey,
            moduleId: infographicId,
            isCompleted: true,
          });
        }

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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "activity",
            resourceId: activityKey,
            moduleId: activityId,
            isCompleted: true,
          });
        }

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

      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: "challenge",
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true,
          score: score,
        });
      }

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

        if (userId && supabase) {
          syncActivityToSupabase(supabase, userId, {
            activityType: "community_comment",
            resourceId: null,
            moduleId: moduleId,
            isCompleted: true,
          });
        }

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

    setCompletedVideos([]);
    setCompletedModules([]);
    setCompletedExams({});
    setCompletedInfographics([]);
    setCompletedActivities([]);
    setChallengeScores({});
    setCompletedCommunity([]);
    setCourseProgress(0);
  }, []);

  const refreshProgress = useCallback(async () => {
    if (!userId || !supabase) return;

    setIsLoading(true);
    const result = await loadProgressFromSupabase(supabase, userId);

    if (result.success) {
      const mergedData = mergeProgress(loadFromLocalStorage(), result.data);

      setCompletedVideos(mergedData.completedVideos);
      setCompletedModules(mergedData.completedModules);
      setCompletedExams(mergedData.completedExams);
      setCompletedInfographics(mergedData.completedInfographics);
      setCompletedActivities(mergedData.completedActivities);
      setChallengeScores(mergedData.challengeScores || {});
      setCompletedCommunity(mergedData.completedCommunity || []);

      const progress = calculateGlobalProgressInternal(
        mergedData.completedModules,
        mergedData.completedVideos,
        mergedData.completedExams,
        mergedData.completedInfographics,
        mergedData.completedActivities,
        mergedData.challengeScores,
        mergedData.completedCommunity,
      );
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

        let remoteData = null;
        if (supabase && navigator.onLine) {
          const result = await loadProgressFromSupabase(supabase, userId);
          if (result.success) {
            remoteData = result.data;
          }
        }

        const mergedData = mergeProgress(localData, remoteData);

        setCompletedVideos(mergedData.completedVideos);
        setCompletedModules(mergedData.completedModules);
        setCompletedExams(mergedData.completedExams);
        setCompletedInfographics(mergedData.completedInfographics);
        setCompletedActivities(mergedData.completedActivities);
        setChallengeScores(mergedData.challengeScores || {});
        setCompletedCommunity(mergedData.completedCommunity || []);
        if (mergedData.gamification) setGamification(mergedData.gamification);

        const progress = calculateGlobalProgressInternal(
          mergedData.completedModules,
          mergedData.completedVideos,
          mergedData.completedExams,
          mergedData.completedInfographics,
          mergedData.completedActivities,
          mergedData.challengeScores,
          mergedData.completedCommunity,
        );
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
          setCompletedVideos(localData.completedVideos);
          setCompletedModules(localData.completedModules);
          setCompletedExams(localData.completedExams);
          setCompletedInfographics(localData.completedInfographics);
          setCompletedActivities(localData.completedActivities);
          setChallengeScores(localData.challengeScores || {});
          setCompletedCommunity(localData.completedCommunity || []);
          setCourseProgress(
            calculateGlobalProgressInternal(
              localData.completedModules,
              localData.completedVideos,
              localData.completedExams,
              localData.completedInfographics,
              localData.completedActivities,
              localData.challengeScores,
              localData.completedCommunity,
            ),
          );
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
