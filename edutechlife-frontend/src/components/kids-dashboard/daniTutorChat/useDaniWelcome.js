import { useCallback } from "react";

/**
 * Elige UNA sugerencia para el saludo, por prioridad: lo que pasa hoy, una
 * materia que necesita práctica, las misiones pendientes (solo el número) y, al
 * final, el ADN. Devuelve "" si no hay nada que sugerir.
 */
export function pickWelcomeSuggestion({
  todayEvents = [],
  lowProgress = [],
  pendingMissions = [],
  hasVak = true,
}) {
  if (todayEvents.length > 0) {
    const names = todayEvents.map((e) => e.title).join(", ");
    return `Hoy tienes agendado: ${names}. ¿Cómo te sientes al respecto?`;
  }
  if (lowProgress.length > 0) {
    const subject = lowProgress[0].name;
    return `Noté que ${subject} necesita un poco más de práctica. ¿Quieres repasar algún tema?`;
  }
  if (pendingMissions.length > 0) {
    return pendingMissions.length === 1
      ? "Tienes 1 misión pendiente. ¿La hacemos juntos?"
      : `Tienes ${pendingMissions.length} misiones pendientes. ¿Quieres empezar por una?`;
  }
  if (!hasVak) {
    return "Si quieres, te ayudo a descubrir cómo aprendes mejor con el ADN de Aprendizaje.";
  }
  return "";
}

export default function useDaniWelcome({
  streak,
  vakResult,
  calendarEvents,
  activeTab,
  t,
  missions,
  subjects,
  documentForDani,
  studentAge,
}) {
  const isEarly = studentAge != null && studentAge <= 9;

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
      if (documentForDani.welcome)
        return `¡Hola${nameTag}! ${documentForDani.welcome}`;
      const firstQ = documentForDani.tutoringQuestions?.[0];
      const isGradePlan = documentForDani.subject === "múltiples materias";
      if (isGradePlan) {
        const weakArea = documentForDani.improvements?.[0]?.split(":")[0] || "";
        if (isEarly)
          return `¡Hola${nameTag}! 📊 Revisé lo que estás aprendiendo. ${weakArea ? `¡Vamos a practicar ${weakArea} juntos! ` : ""}${firstQ || "¿En qué te ayudo hoy?"}`;
        return `¡Hola${nameTag}! 📊 Revisé tu plan de estudio. ${documentForDani.summary ? documentForDani.summary + " " : ""}${weakArea ? `Vamos a enfocarnos en ${weakArea}. ` : ""}${firstQ || "¿En qué puedo ayudarte hoy?"}`;
      }
      if (isEarly)
        return `¡Hola${nameTag}! 📖 Leí sobre "${documentForDani.title}". ¿Me puedes contar de qué se trata con tus propias palabras? 😊`;
      return `¡Hola${nameTag}! 📖 Acabo de leer "${documentForDani.title}" ${documentForDani.difficulty ? `(nivel ${documentForDani.difficulty})` : ""}. ¿Puedes explicarme con tus palabras de qué trata?`;
    }

    const now = new Date();
    const hour = now.getHours();

    if (isEarly) {
      // Simpler, more playful greeting for young learners
      const timeEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";
      const parts = [];
      parts.push(`¡Hola${nameTag}! ${timeEmoji} ¡Qué bueno verte!`);
      if (streak.current >= 2)
        parts.push(
          `¡Llevas ${streak.current} días seguidos aprendiendo! 🔥 ¡Eso es genial!`,
        );
      const pendingMissions = (missions || []).filter((m) => !m.completed);
      if (pendingMissions.length > 0) {
        parts.push(
          pendingMissions.length === 1
            ? `Tienes 1 aventura esperándote. ¿La hacemos? 🗺️`
            : `Tienes ${pendingMissions.length} aventuras esperándote. ¿Cuál quieres hacer primero? 🗺️`,
        );
      } else {
        parts.push("¿Qué quieres aprender hoy? 🚀");
      }
      return parts.join(" ");
    }

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

    // Una sola sugerencia, la más útil. Antes el saludo juntaba las misiones
    // pendientes con sus nombres, las materias flojas, el ADN y el calendario.
    const todayStr = now.toISOString().split("T")[0];
    const suggestion = pickWelcomeSuggestion({
      todayEvents: calendarEvents.filter((e) => e.date === todayStr),
      lowProgress: (subjects || []).filter(
        (s) => (s.progress || 0) > 0 && (s.progress || 0) < 50,
      ),
      pendingMissions: (missions || []).filter((m) => !m.completed),
      hasVak: !!vakResult,
    });
    if (suggestion) parts.push(suggestion);

    if (!parts.some((p) => p.includes("¿"))) {
      parts.push(t("dani.welcome_first"));
    }

    return parts.join(" ");
  }, [
    isEarly,
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
