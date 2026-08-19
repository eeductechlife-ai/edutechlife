import { useCallback } from "react";

export default function useDaniWelcome({
  streak,
  vakResult,
  calendarEvents,
  activeTab,
  t,
  missions,
  subjects,
  documentForDani,
}) {
  const buildRichWelcome = useCallback(() => {
    // Nombre real del estudiante desde localStorage
    const rawName =
      typeof window !== "undefined"
        ? localStorage.getItem("student_name") || ""
        : "";
    const firstName = rawName.split(" ")[0] || "";
    const nameTag = firstName ? `, ${firstName}` : "";

    // If Dani has document/topic context, generate a focused verification opener
    if (documentForDani?.title) {
      const firstQ = documentForDani.tutoringQuestions?.[0];
      const isGradePlan = documentForDani.subject === "múltiples materias";
      if (isGradePlan) {
        const weakArea = documentForDani.improvements?.[0]?.split(":")[0] || "";
        return `¡Hola${nameTag}! 📊 Revisé tu plan de estudio. ${documentForDani.summary ? documentForDani.summary + " " : ""}${weakArea ? `Vamos a enfocarnos en ${weakArea}. ` : ""}${firstQ || "¿En qué puedo ayudarte hoy?"}`;
      }
      return `¡Hola${nameTag}! 📖 Acabo de leer "${documentForDani.title}" ${documentForDani.difficulty ? `(nivel ${documentForDani.difficulty})` : ""}. ¿Puedes explicarme con tus palabras de qué trata?`;
    }

    const now = new Date();
    const hour = now.getHours();
    const timeOfDay =
      hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

    const parts = [];
    parts.push(`¡${timeOfDay}${nameTag}! ¿En qué puedo ayudarte hoy?`);

    if (streak.current >= 2) {
      parts.push(t("dani.welcome_streak", { days: streak.current }));
    }

    const tabMessages = {
      misiones: "Veo que estabas viendo tus misiones.",
      materias: "Estabas repasando tus materias.",
      actividades: "Estabas en la sección de actividades.",
      calendario: "Estabas viendo tu calendario.",
      puntos: "Estabas revisando tus puntos y recompensas.",
      noticias: "Estabas leyendo las noticias tech.",
      vak: "Estabas en tu perfil VAK.",
      inicio: "",
      dani: "",
    };
    const tabContext = tabMessages[activeTab] || "";
    if (tabContext) parts.push(tabContext);

    const pendingMissions = (missions || []).filter((m) => !m.completed);
    if (pendingMissions.length > 0) {
      const names = pendingMissions
        .slice(0, 3)
        .map((m) => `"${m.title}"`)
        .join(", ");
      const missionText =
        pendingMissions.length === 1
          ? `Tienes 1 misión pendiente: ${names}.`
          : `Tienes ${pendingMissions.length} misiones pendientes: ${names}${pendingMissions.length > 3 ? " y más." : "."}`;
      parts.push(missionText);
      parts.push("¿Quieres que empecemos con alguna?");
    }

    if (!parts.some((p) => p.includes("misiones"))) {
      const lowProgress = (subjects || []).filter(
        (s) => (s.progress || 0) > 0 && (s.progress || 0) < 50,
      );
      if (lowProgress.length > 0) {
        const names = lowProgress
          .slice(0, 3)
          .map((s) => `${s.name} (${s.progress}%)`)
          .join(", ");
        parts.push(
          `Noté que ${names} necesitan un poco más de práctica. ¿Quieres repasar algún tema en específico?`,
        );
      }
    }

    if (!vakResult) {
      parts.push(
        "¿Sabías que aún no has descubierto tu estilo de aprendizaje? Podemos hacer el diagnóstico VAK ahora mismo 🧠",
      );
    }

    const todayStr = now.toISOString().split("T")[0];
    const todayEvents = calendarEvents.filter((e) => e.date === todayStr);
    if (todayEvents.length > 0) {
      const eventNames = todayEvents.map((e) => e.title).join(", ");
      parts.push(
        `Hoy tienes agendado: ${eventNames}. ¿Cómo te sientes al respecto?`,
      );
    }

    if (!parts.some((p) => p.includes("¿"))) {
      parts.push(t("dani.welcome_first"));
    }

    return parts.join(" ");
  }, [
    streak,
    vakResult,
    calendarEvents,
    activeTab,
    t,
    missions,
    subjects,
    documentForDani,
  ]);

  return buildRichWelcome;
}
