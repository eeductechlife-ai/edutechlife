import { useState, useEffect, useRef } from "react";
import useSmartBoardSync from "../hooks/useSmartBoardSync";

const LS_PREFIX = "edutechlife_";

export const getLocalStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`${LS_PREFIX}${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const pendingWrites = {};
let writeTimer = null;

const flushWrites = () => {
  const batch = { ...pendingWrites };
  Object.keys(batch).forEach((k) => delete pendingWrites[k]);
  writeTimer = null;
  try {
    Object.entries(batch).forEach(([key, value]) => {
      localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(value));
    });
  } catch {
    // localStorage lleno, ignorar
  }
};

export const setLocalStorage = (key, value) => {
  pendingWrites[key] = value;
  if (!writeTimer) writeTimer = setTimeout(flushWrites, 50);
};

export const useSmartBoardPersistence = (setters) => {
  const settersRef = useRef(setters);
  settersRef.current = setters;
  const {
    loadData,
    saveData,
    mergeWithLocal,
    userId,
    isLoading: syncLoading,
    isConnected,
  } = useSmartBoardSync();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!userId || dataLoaded || syncLoading) return;

    const loadAllData = async () => {
      try {
        const {
          setDaniChatHistory,
          setStudentMoodHistory,
          setAcademicTopics,
          setConversationCount,
          setStudentAge,
          setTotalPoints,
          setPointsHistory,
          setUnlockedRewards,
          setTotalActiveMinutes,
          setSessions,
          setStreak,
          setStreakLog,
          setDaniMemory,
          setSubjectTime,
          setCalendarEvents,
          setReadNews,
          setMissions,
          setSubjects,
          setUploadedActivities,
          setAnalyzedActivities,
          setDarkMode,
          setAvatarAnimado,
          setFondoGalaxia,
          setSubscriptionTier,
          setVakResult,
          setFlashcardDecks,
          setExams,
          setExamMaterials,
          setSmartBookHistory,
          setPlanCompletedActivities,
        } = settersRef.current;

        const localData = {
          daniChatHistory: getLocalStorage(`dani_chat_${userId}`, []),
          studentMoodHistory: getLocalStorage(`mood_history_${userId}`, []),
          academicTopics: getLocalStorage(`academic_topics_${userId}`, []),
          conversationCount: getLocalStorage(`conversation_count_${userId}`, 0),
          studentAge: getLocalStorage(`age_${userId}`, null),
          totalPoints: getLocalStorage(`points_${userId}`, 0),
          pointsHistory: getLocalStorage(`points_history_${userId}`, []),
          unlockedRewards: getLocalStorage(`rewards_${userId}`, []),
          totalActiveMinutes: getLocalStorage(`minutes_${userId}`, 0),
          sessions: getLocalStorage(`sessions_${userId}`, []),
          streak: getLocalStorage(`streak_${userId}`, {
            current: 0,
            longest: 0,
            lastActive: null,
          }),
          streakLog: getLocalStorage(`streak_log_${userId}`, []),
          daniMemory: getLocalStorage(`dani_memory_${userId}`, {
            conversations: [],
            studentProfile: {
              communicationStyle: null,
              strengths: [],
              challenges: [],
              interests: [],
            },
            pendingTopics: [],
            interactionCount: 0,
            lastSessionSummary: null,
          }),
          subjectTime: getLocalStorage(`subject_time_${userId}`, {}),
          calendarEvents: getLocalStorage(`calendar_${userId}`, []),
          readNews: getLocalStorage(`read_news_${userId}`, []),
          missions: getLocalStorage(`missions_${userId}`, []),
          subjects: getLocalStorage(`subjects_${userId}`, []),
          uploadedActivities: getLocalStorage(`activities_${userId}`, []),
          analyzedActivities: getLocalStorage(`analyzed_${userId}`, []),
          darkMode: getLocalStorage(`dark_mode_${userId}`, false),
          avatarAnimado: getLocalStorage(`avatar_animado_${userId}`, false),
          fondoGalaxia: getLocalStorage(`fondo_galaxia_${userId}`, false),
          subscriptionTier: getLocalStorage(`subscription_tier`, "basic"),
          vakResult: getLocalStorage(`vak_${userId}`, null),

          // Backward-compat: try per-user key first, fall back to global
          flashcardDecks: (() => {
            const perUser = getLocalStorage(`flashcards_${userId}`, undefined);
            if (perUser !== undefined) return perUser;
            return getLocalStorage("flashcards", []);
          })(),
          exams: (() => {
            const perUser = getLocalStorage(`exams_${userId}`, undefined);
            if (perUser !== undefined) return perUser;
            return getLocalStorage("exams", []);
          })(),
          examMaterials: (() => {
            const perUser = getLocalStorage(
              `exam_materials_${userId}`,
              undefined,
            );
            if (perUser !== undefined) return perUser;
            return getLocalStorage("exam_materials", {});
          })(),
          smartBookHistory: (() => {
            const perUser = getLocalStorage(`smartbooks_${userId}`, undefined);
            if (perUser !== undefined) return perUser;
            return getLocalStorage("smartbooks", []);
          })(),
          planCompletedActivities: (() => {
            const perUser = getLocalStorage(
              `plan_completed_${userId}`,
              undefined,
            );
            if (perUser !== undefined) return perUser;
            return getLocalStorage("plan_completed", []);
          })(),
        };

        let merged = localData;
        let remoteData = null;
        if (navigator.onLine) {
          remoteData = await loadData();
          if (remoteData) {
            merged = mergeWithLocal(localData, remoteData);
          }
        }

        setDaniChatHistory(merged.daniChatHistory || []);
        setStudentMoodHistory(merged.studentMoodHistory || []);
        setAcademicTopics(merged.academicTopics || []);
        setConversationCount(merged.conversationCount || 0);
        setStudentAge(merged.studentAge || null);
        setTotalPoints(merged.totalPoints || 0);
        setPointsHistory(merged.pointsHistory || []);
        setUnlockedRewards(merged.unlockedRewards || []);
        setTotalActiveMinutes(merged.totalActiveMinutes || 0);
        setSessions(merged.sessions || []);
        setStreak(
          merged.streak || { current: 0, longest: 0, lastActive: null },
        );
        setStreakLog(merged.streakLog || []);
        setDaniMemory(
          merged.daniMemory || {
            conversations: [],
            studentProfile: {
              communicationStyle: null,
              strengths: [],
              challenges: [],
              interests: [],
            },
            pendingTopics: [],
            interactionCount: 0,
            lastSessionSummary: null,
          },
        );
        setSubjectTime(merged.subjectTime || {});
        setCalendarEvents(merged.calendarEvents || []);
        setReadNews(merged.readNews || []);
        if (merged.missions?.length) setMissions(merged.missions);
        if (merged.subjects?.length) setSubjects(merged.subjects);
        setUploadedActivities(merged.uploadedActivities || []);
        setAnalyzedActivities(merged.analyzedActivities || []);
        setDarkMode(!!merged.darkMode);
        setAvatarAnimado(!!merged.avatarAnimado);
        setFondoGalaxia(!!merged.fondoGalaxia);
        if (merged.subscriptionTier === "premium")
          setSubscriptionTier("premium");
        if (merged.vakResult) setVakResult(merged.vakResult);
        setFlashcardDecks(merged.flashcardDecks || []);
        setExams(merged.exams || []);
        setExamMaterials(merged.examMaterials || {});
        setSmartBookHistory(merged.smartBookHistory || []);
        setPlanCompletedActivities(merged.planCompletedActivities || []);

        if (!remoteData && navigator.onLine) {
          saveData(merged);
        }
      } catch (error) {
        console.error("Error cargando datos SmartBoard:", error);
      } finally {
        setDataLoaded(true);
      }
    };

    loadAllData();
  }, [userId, syncLoading]);

  return {
    dataLoaded,
    getLocalStorage,
    setLocalStorage,
    saveData,
    userId,
    isConnected,
    syncLoading,
  };
};
