import { useCallback } from "react";
import { STORAGE_KEYS } from "./storageKeys";
import { MODULE_THRESHOLD } from "./courseModuleConfig";
import { calculateGlobalProgressInternal } from "./courseProgressUtils";

const useLocalProgress = () => {
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.videos,
        JSON.stringify(data.completedVideos),
      );
      localStorage.setItem(
        STORAGE_KEYS.modules,
        JSON.stringify(data.completedModules),
      );
      localStorage.setItem(
        STORAGE_KEYS.exams,
        JSON.stringify(data.completedExams),
      );
      localStorage.setItem(
        STORAGE_KEYS.infographics,
        JSON.stringify(data.completedInfographics),
      );
      localStorage.setItem(
        STORAGE_KEYS.activities,
        JSON.stringify(data.completedActivities),
      );
      localStorage.setItem(
        STORAGE_KEYS.challenges,
        JSON.stringify(data.challengeScores || {}),
      );
      localStorage.setItem(
        STORAGE_KEYS.community,
        JSON.stringify(data.completedCommunity || []),
      );

      localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify({
          percent: calculateGlobalProgressInternal(
            data.completedModules,
            data.completedVideos,
            data.completedExams,
            data.completedInfographics,
            data.completedActivities,
            data.challengeScores,
            data.completedCommunity || [],
          ),
          videos: data.completedVideos.length,
          modules: data.completedModules.length,
          exams: Object.values(data.completedExams).filter(
            (s) => s >= MODULE_THRESHOLD,
          ).length,
          infographics: data.completedInfographics.length,
          activities: data.completedActivities.length,
          challenges: Object.values(data.challengeScores || {}).filter(
            (s) => s >= MODULE_THRESHOLD,
          ).length,
          lastUpdate: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("❌ Error guardando en localStorage:", error);
    }
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedVideos = localStorage.getItem(STORAGE_KEYS.videos);
      const savedModules = localStorage.getItem(STORAGE_KEYS.modules);
      const savedExams = localStorage.getItem(STORAGE_KEYS.exams);
      const savedInfographics = localStorage.getItem(STORAGE_KEYS.infographics);
      const savedActivities = localStorage.getItem(STORAGE_KEYS.activities);
      const savedChallenges = localStorage.getItem(STORAGE_KEYS.challenges);
      const savedCommunity = localStorage.getItem(STORAGE_KEYS.community);

      return {
        completedVideos: savedVideos ? JSON.parse(savedVideos) : [],
        completedModules: savedModules ? JSON.parse(savedModules) : [],
        completedExams: savedExams ? JSON.parse(savedExams) : {},
        completedInfographics: savedInfographics
          ? JSON.parse(savedInfographics)
          : [],
        completedActivities: savedActivities ? JSON.parse(savedActivities) : [],
        challengeScores: savedChallenges ? JSON.parse(savedChallenges) : {},
        completedCommunity: savedCommunity ? JSON.parse(savedCommunity) : [],
      };
    } catch (error) {
      console.error("❌ Error cargando desde localStorage:", error);
      return null;
    }
  }, []);

  const recordActivity = useCallback(() => {
    try {
      localStorage.setItem(
        "ialab_last_activity_date",
        new Date().toISOString(),
      );
    } catch (err) {
      console.warn("[PROGRESS] Error registrando actividad:", err);
    }
  }, []);

  const recordLastTopic = useCallback(
    (moduleId, moduleName, resourceType, resourceTitle, resourceId) => {
      try {
        localStorage.setItem(
          "ialab_last_viewed_topic",
          JSON.stringify({
            moduleId,
            moduleName,
            resourceType,
            resourceTitle,
            resourceId,
            timestamp: new Date().toISOString(),
          }),
        );
      } catch (err) {
        console.warn("[PROGRESS] Error registrando ultimo tema:", err);
      }
    },
    [],
  );

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    recordActivity,
    recordLastTopic,
  };
};

export default useLocalProgress;
