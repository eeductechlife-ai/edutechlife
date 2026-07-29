import { useCallback, useRef } from "react";
import { VAK_RECOMMENDATIONS } from "./smartBoardData";

export const useSmartBoardActions = (stateAndSetters) => {
  const ref = useRef(stateAndSetters);
  ref.current = stateAndSetters;

  const addPoints = useCallback((points, reason) => {
    const { setTotalPoints, setPointsHistory } = ref.current;
    setTotalPoints((prev) => prev + points);
    setPointsHistory((prev) => [
      ...prev,
      { points, reason, timestamp: new Date() },
    ]);
  }, []);

  const completeMission = useCallback((missionId) => {
    const { setMissions, missions } = ref.current;
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId && !m.completed ? { ...m, completed: true } : m,
      ),
    );
    const mission = missions.find((m) => m.id === missionId);
    if (mission && !mission.completed) {
      addPoints(mission.xp, `Misión completada: ${mission.title}`);
    }
  }, []);

  const unlockReward = useCallback((reward) => {
    const {
      setUnlockedRewards,
      setDarkMode,
      setAvatarAnimado,
      setFondoGalaxia,
      setLastUnlockedReward,
    } = ref.current;
    setUnlockedRewards((prev) => [...prev, reward.id]);
    addPoints(-reward.cost, `Canjeó recompensa: ${reward.name}`);
    setLastUnlockedReward(reward);
    setTimeout(() => setLastUnlockedReward(null), 4000);
    if (reward.id === 1) setDarkMode(true);
    if (reward.id === 2) setAvatarAnimado(true);
    if (reward.id === 3) setFondoGalaxia(true);
  }, []);

  const addDaniMessage = useCallback((message) => {
    const { setDaniChatHistory, setConversationCount } = ref.current;
    setDaniChatHistory((prev) => [
      ...prev,
      {
        role: message.role,
        text: message.text || message.content || "",
        type: message.type || "text",
        data: message.data || null,
        id:
          message.id ||
          Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        timestamp: new Date().toISOString(),
      },
    ]);
    if (message.role === "user") {
      setConversationCount((prev) => prev + 1);
    }
  }, []);

  const recordMoodInference = useCallback((mood, confidence, context) => {
    const { setStudentMoodHistory } = ref.current;
    const entry = { mood, confidence, context, date: new Date() };
    setStudentMoodHistory((prev) => [...prev, entry].slice(-30));
  }, []);

  const trackAcademicTopic = useCallback((topic) => {
    if (!topic) return;
    const { setAcademicTopics } = ref.current;
    setAcademicTopics((prev) => {
      const existing = prev.find((t) => t.topic === topic);
      return existing
        ? prev.map((t) =>
            t.topic === topic
              ? { ...t, count: t.count + 1, lastAsked: new Date() }
              : t,
          )
        : [...prev, { topic, count: 1, lastAsked: new Date() }];
    });
  }, []);

  const updateDaniMemory = useCallback((parsed) => {
    if (!parsed || !parsed.topics) return;
    const { setDaniMemory } = ref.current;
    setDaniMemory((prev) => {
      const next = { ...prev, studentProfile: { ...prev.studentProfile } };
      next.interactionCount = prev.interactionCount + 1;

      if (Array.isArray(parsed.topics) && parsed.topics.length) {
        parsed.topics.forEach((topic) => {
          const existing = next.pendingTopics.find((t) => t.topic === topic);
          if (existing) {
            existing.lastSeen = new Date().toISOString();
            existing.count = (existing.count || 0) + 1;
          } else {
            next.pendingTopics.push({
              topic,
              lastSeen: new Date().toISOString(),
              count: 1,
            });
          }
        });
      }

      if (
        parsed.challengeObserved &&
        !next.studentProfile.challenges.includes(parsed.challengeObserved)
      ) {
        next.studentProfile.challenges = [
          ...next.studentProfile.challenges,
          parsed.challengeObserved,
        ].slice(-10);
      }
      if (
        parsed.strengthObserved &&
        !next.studentProfile.strengths.includes(parsed.strengthObserved)
      ) {
        next.studentProfile.strengths = [
          ...next.studentProfile.strengths,
          parsed.strengthObserved,
        ].slice(-10);
      }
      if (parsed.communicationStyle) {
        next.studentProfile.communicationStyle = parsed.communicationStyle;
      }
      if (parsed.studentMood) {
        next.studentProfile.lastKnownMood = parsed.studentMood;
      }
      return next;
    });
  }, []);

  const buildMemoryInjection = useCallback(() => {
    const { daniMemory } = ref.current;
    const profile = daniMemory.studentProfile;
    const parts = [];
    if (profile.communicationStyle)
      parts.push(
        `Estilo de comunicación detectado: ${profile.communicationStyle}.`,
      );
    if (profile.challenges.length > 0)
      parts.push(
        `Dificultades observadas: ${profile.challenges.slice(-3).join(", ")}.`,
      );
    if (profile.strengths.length > 0)
      parts.push(`Fortalezas: ${profile.strengths.slice(-3).join(", ")}.`);
    if (profile.lastKnownMood)
      parts.push(`Último estado de ánimo: ${profile.lastKnownMood}.`);

    const pending = daniMemory.pendingTopics.filter((t) => {
      const daysSince =
        (Date.now() - new Date(t.lastSeen).getTime()) / 86400000;
      return daysSince > 0.5 && daysSince < 7;
    });
    if (pending.length > 0) {
      parts.push(
        `Temas para retomar: ${pending.map((t) => t.topic).join(", ")}.`,
      );
    }

    return parts.length > 0
      ? `## MEMORIA DEL ESTUDIANTE\n${parts.join("\n")}\nUsa esta información para personalizar tu respuesta. Si hay temas pendientes, retómalos brevemente.`
      : "";
  }, []);

  const buildDaniContext = useCallback(() => {
    const {
      vakResult,
      totalPoints,
      streak,
      calendarEvents,
      studentMoodHistory,
      academicTopics,
      userId,
      conversationCount,
      missions,
      subjects,
      studentAge,
    } = ref.current;
    const now = new Date();
    const fecha = now.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const hora = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const todayStr = now.toISOString().split("T")[0];

    const todayEvents = calendarEvents.filter((e) => e.date === todayStr);
    const pendingMissions = missions.filter((m) => !m.completed);

    const lastMoods = studentMoodHistory
      .slice(-5)
      .map((m) => `${m.mood}${m.confidence > 0.7 ? " (alta confianza)" : ""}`)
      .join(", ");

    const recentTopics = academicTopics
      .slice(-5)
      .map((t) => t.topic)
      .join(", ");

    const subjectsStr = subjects
      .map((s) => `${s.name}${s.progress ? ` (${s.progress}%)` : ""}`)
      .join(", ");

    let context = `INFORMACIÓN DEL ESTUDIANTE:\n`;
    context += `- Fecha: ${fecha}\n`;
    context += `- Hora: ${hora}\n`;
    context += `- Edad del estudiante: ${studentAge || "No especificada"}\n`;
    context += `- Puntos acumulados: ${totalPoints}\n`;
    context += `- Racha: ${streak.current} días${streak.current > 0 ? " 🔥" : ""}\n`;
    context += `- Conversaciones con Dani: ${conversationCount + 1}\n`;

    if (vakResult) {
      context += `- Perfil VAK: ${vakResult.predominantStyle}\n`;
      context += `  Visual: ${vakResult.scores.visual}% | Auditivo: ${vakResult.scores.auditivo}% | Kinestésico: ${vakResult.scores.kinestesico}%\n`;
    } else {
      context += `- Perfil VAK: Aún no diagnosticado\n`;
    }

    if (subjectsStr) context += `- Materias: ${subjectsStr}\n`;
    if (pendingMissions.length > 0)
      context += `- Misiones pendientes: ${pendingMissions.length}\n`;
    if (todayEvents.length > 0)
      context += `- Eventos de hoy: ${todayEvents.map((e) => e.title).join(", ")}\n`;
    if (lastMoods)
      context += `- Estados de ánimo inferidos recientes: ${lastMoods}\n`;
    if (recentTopics)
      context += `- Temas académicos consultados: ${recentTopics}\n`;

    return context;
  }, []);

  const setVakResultAndRecommendations = useCallback((result) => {
    const { setVakResult, setVakRecommendations } = ref.current;
    setVakResult(result);
    if (result) {
      const dominantStyle = result.predominantStyle;
      const recommendations = VAK_RECOMMENDATIONS[dominantStyle] || [];
      setVakRecommendations(recommendations);
      addPoints(300, "Completó diagnóstico VAK");
    }
  }, []);

  const addCalendarEvent = useCallback((event) => {
    const { setCalendarEvents } = ref.current;
    setCalendarEvents((prev) => [...prev, { ...event, id: Date.now() }]);
  }, []);

  const addUploadedActivity = useCallback((activity) => {
    const { setUploadedActivities } = ref.current;
    setUploadedActivities((prev) => [
      ...prev,
      { ...activity, id: Date.now(), uploadedAt: new Date() },
    ]);
    addPoints(50, "Subió actividad académica");
  }, []);

  const addAnalyzedActivity = useCallback((analysis) => {
    const { setAnalyzedActivities } = ref.current;
    setAnalyzedActivities((prev) => [analysis, ...prev].slice(-20));
    addPoints(100, "Actividad analizada por Dani");
  }, []);

  const markNewsAsRead = useCallback((newsId) => {
    const { setReadNews } = ref.current;
    setReadNews((prev) => [...prev, newsId]);
  }, []);

  return {
    addPoints,
    completeMission,
    unlockReward,
    addDaniMessage,
    recordMoodInference,
    trackAcademicTopic,
    updateDaniMemory,
    buildMemoryInjection,
    buildDaniContext,
    setVakResultAndRecommendations,
    addCalendarEvent,
    addUploadedActivity,
    addAnalyzedActivity,
    markNewsAsRead,
  };
};
