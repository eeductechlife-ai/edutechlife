import { useCallback } from "react";
import { STORAGE_KEYS } from "./storageKeys";
import { MODULE_THRESHOLD } from "./courseModuleConfig";
import { calculateGlobalProgressInternal } from "./courseProgressUtils";
import { scopedKey } from "../../utils/userScopedStorage";

// Lee/scribe por cuenta. Si existe el dato legacy sin scope y la cuenta aún no
// tiene el suyo, lo migra (defensivo, por si el claim no alcanzó a hacerlo).
const readScoped = (baseKey) => {
  try {
    let raw = localStorage.getItem(scopedKey(baseKey));
    if (raw === null) {
      const legacy = localStorage.getItem(baseKey);
      if (legacy !== null) {
        localStorage.setItem(scopedKey(baseKey), legacy);
        raw = legacy;
      }
    }
    return raw;
  } catch {
    return null;
  }
};

const writeScoped = (baseKey, value) => {
  try {
    localStorage.setItem(scopedKey(baseKey), value);
  } catch (error) {
    console.error("❌ Error guardando en localStorage:", error);
  }
};

const useLocalProgress = () => {
  const saveToLocalStorage = useCallback((data) => {
    try {
      writeScoped(STORAGE_KEYS.videos, JSON.stringify(data.completedVideos));
      writeScoped(STORAGE_KEYS.modules, JSON.stringify(data.completedModules));
      writeScoped(STORAGE_KEYS.exams, JSON.stringify(data.completedExams));
      writeScoped(
        STORAGE_KEYS.infographics,
        JSON.stringify(data.completedInfographics),
      );
      writeScoped(
        STORAGE_KEYS.activities,
        JSON.stringify(data.completedActivities),
      );
      writeScoped(
        STORAGE_KEYS.challenges,
        JSON.stringify(data.challengeScores || {}),
      );
      writeScoped(
        STORAGE_KEYS.community,
        JSON.stringify(data.completedCommunity || []),
      );

      writeScoped(
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
      const savedVideos = readScoped(STORAGE_KEYS.videos);
      const savedModules = readScoped(STORAGE_KEYS.modules);
      const savedExams = readScoped(STORAGE_KEYS.exams);
      const savedInfographics = readScoped(STORAGE_KEYS.infographics);
      const savedActivities = readScoped(STORAGE_KEYS.activities);
      const savedChallenges = readScoped(STORAGE_KEYS.challenges);
      const savedCommunity = readScoped(STORAGE_KEYS.community);

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
      writeScoped("ialab_last_activity_date", new Date().toISOString());
    } catch (err) {
      console.warn("[PROGRESS] Error registrando actividad:", err);
    }
  }, []);

  const recordLastTopic = useCallback(
    (moduleId, moduleName, resourceType, resourceTitle, resourceId) => {
      try {
        writeScoped(
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
