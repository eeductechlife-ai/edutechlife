import { useCallback, useRef } from "react";
import { VAK_RECOMMENDATIONS } from "./smartBoardData";
import { track } from "../lib/analytics";
import { EVENTS } from "../lib/analyticsEvents";

export const useSmartBoardActions = (stateAndSetters) => {
  const ref = useRef(stateAndSetters);
  ref.current = stateAndSetters;

  const addPoints = useCallback((points, reason) => {
    const safePoints = parseInt(points, 10);
    if (Number.isNaN(safePoints)) return;
    const { setTotalPoints, setPointsHistory } = ref.current;
    setTotalPoints((prev) => prev + safePoints);
    setPointsHistory((prev) => [
      ...prev,
      { points: safePoints, reason, timestamp: new Date() },
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
      addPoints(mission.xp || 0, `Misión completada: ${mission.title || ""}`);
      track(EVENTS.MISSION_COMPLETED, {
        mission_id: missionId,
        title: mission.title || "",
        xp: mission.xp || 0,
      });
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const token = (() => {
        try {
          return sessionStorage.getItem("auth_token") || "";
        } catch {
          return "";
        }
      })();
      fetch(`${API_BASE_URL}/api/smartboard/gamification/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: "mission_complete",
          missionId,
          xp: mission.xp || 0,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.newBadges?.length) {
            const { setLastUnlockedBadge } = ref.current;
            setLastUnlockedBadge(data.newBadges[0]);
            setTimeout(() => setLastUnlockedBadge(null), 5000);
          }
        })
        .catch(() => {});
    }
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

  const unlockReward = useCallback(
    (reward) => {
      const {
        setUnlockedRewards,
        setDarkMode,
        setAvatarAnimado,
        setFondoGalaxia,
        setLastUnlockedReward,
        vakResult,
      } = ref.current;
      setUnlockedRewards((prev) => [...prev, reward.id]);
      addPoints(-reward.cost, `Canjeó recompensa: ${reward.name}`);
      track(EVENTS.BADGE_UNLOCKED, { reward_id: reward.id, name: reward.name });
      setLastUnlockedReward(reward);
      setTimeout(() => setLastUnlockedReward(null), 4000);
      if (reward.id === 1) setDarkMode(true);
      if (reward.id === 2) setAvatarAnimado(true);
      if (reward.id === 3) setFondoGalaxia(true);
      // Reward 4: Día Libre — Dani confirms and opens chat
      if (reward.id === 4) {
        addDaniMessage({
          role: "assistant",
          text: "🏖️ ¡Felicitaciones! Canjeaste tu **Día Libre**. Hoy puedes descansar y disfrutar sin presión académica. ¡Te lo ganaste! Vuelve mañana con energías recargadas 💪",
        });
        setTimeout(
          () => window.dispatchEvent(new CustomEvent("smartboard:open-dani")),
          800,
        );
      }
      // Reward 5: Curso IA Básico — Dani gives course access info
      if (reward.id === 5) {
        addDaniMessage({
          role: "assistant",
          text: "🤖 ¡Genial! Desbloqueaste el **Curso de IA Básico**. Para acceder, ve a IALab desde el menú principal. Allí encontrarás módulos de Inteligencia Artificial diseñados especialmente para ti. ¡Es el futuro del aprendizaje y tú ya eres parte de él! 🚀",
        });
        setTimeout(
          () => window.dispatchEvent(new CustomEvent("smartboard:open-dani")),
          800,
        );
      }
      // Reward 6: Certificado VAK — Dani generates and shows certificate
      if (reward.id === 6) {
        const style =
          vakResult?.predominantStyle || vakResult?.dominant || "Visual";
        const styleEmojis = { visual: "👁️", auditivo: "👂", kinestesico: "🤸" };
        const emoji = styleEmojis[style?.toLowerCase()] || "🧠";
        addDaniMessage({
          role: "assistant",
          text: `📜 ¡Felicitaciones! Aquí está tu **Certificado VAK Oficial**:\n\n${emoji} Estilo de Aprendizaje: **${style.charAt(0).toUpperCase() + style.slice(1)}**\n\nEste certificado confirma que conoces cómo aprendes mejor y usas esa información para estudiar de manera más efectiva. ¡Eres un estudiante consciente de tu propio aprendizaje! Puedes tomar una captura de pantalla de este mensaje como constancia 🎓`,
        });
        setTimeout(
          () => window.dispatchEvent(new CustomEvent("smartboard:open-dani")),
          800,
        );
      }
    },
    [addDaniMessage],
  );

  const toggleDarkMode = useCallback(() => {
    const { setDarkMode } = ref.current;
    setDarkMode((prev) => !prev);
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
    if (
      !parsed ||
      (!parsed.topics &&
        !parsed.interests &&
        !parsed.challengeObserved &&
        !parsed.strengthObserved &&
        !parsed.communicationStyle &&
        !parsed.studentMood &&
        !parsed.parentGoal)
    )
      return;
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
      if (Array.isArray(parsed.interests) && parsed.interests.length) {
        next.studentProfile.interests = parsed.interests;
      }
      if (parsed.parentGoal) {
        next.studentProfile.parentGoal = parsed.parentGoal;
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
    if (profile.parentGoal)
      parts.push(
        `Objetivo del padre/madre: ${profile.parentGoal}. Adapta tu ayuda a este objetivo cuando sea relevante.`,
      );

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
      studentGrades,
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

    // Calificaciones del estudiante
    const gradesSection =
      studentGrades?.length > 0
        ? `\n\n## CALIFICACIONES ACTUALES DEL ESTUDIANTE\n` +
          studentGrades
            .map(
              (g) =>
                `- ${g.subject || g.materia}: ${g.score ?? g.nota} (${
                  (g.score ?? g.nota) >= 3.5 ? "Aprobado" : "Necesita mejorar"
                })`,
            )
            .join("\n") +
          `\nPromedio general: ${(
            studentGrades.reduce(
              (sum, g) => sum + (g.score ?? g.nota ?? 0),
              0,
            ) / studentGrades.length
          ).toFixed(1)}`
        : "\n\n## CALIFICACIONES\nEl estudiante aún no ha registrado calificaciones.";

    // Plan de mejora activo
    let planSection = "";
    try {
      const savedPlan = userId
        ? localStorage.getItem(`improvement_plan_${userId}`)
        : null;
      const planData = savedPlan ? JSON.parse(savedPlan) : null;
      if (planData?.weeks?.length > 0) {
        planSection =
          `\n\n## PLAN DE MEJORA ACTIVO\n` +
          `Semana actual: ${planData.weeks[0]?.focus || "N/A"}\n` +
          `Top acciones: ${(planData.topActions || []).slice(0, 3).join(", ")}\n` +
          `Materias a reforzar: ${(planData.weakSubjects || []).join(", ")}`;
      }
    } catch (_) {
      // localStorage parse failed — omit plan section silently
    }

    context += gradesSection + planSection;

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
    toggleDarkMode,
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
