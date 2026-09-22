import { useIngenIAKids } from "../context/IngenIAKidsContext";

const TEXT = {
  early: {
    // Points tabs
    "points.tab_points": "⭐ Estrellitas",
    "points.tab_store": "🎁 Mis Premios",
    "points.tab_history": "📍 Mi Camino",
    // Level names and emojis (emoji is rendered separately by the component)
    "level.principiante": "Pollito",
    "level.principiante.emoji": "🐣",
    "level.intermedio": "Explorador",
    "level.intermedio.emoji": "⭐",
    "level.avanzado": "Aventurero",
    "level.avanzado.emoji": "🚀",
    "level.experto": "Campeón",
    "level.experto.emoji": "🏆",
    "level.maestro": "Superhéroe",
    "level.maestro.emoji": "🦸",
    // Hero section
    "hero.vak_question": "🧠 ¿Cómo aprendes mejor?",
    "hero.vak_subtitle": "Descubre tu súper poder · +25 XP",
    "hero.talk_dani": "¡Habla con Dani!",
    "hero.dani_tagline": "¡Aquí estoy!",
    // Missions
    "missions.title": "🗺️ Aventuras de hoy",
    // Challenges
    "challenge.name": "⚡ ¡Pregunta Mágica!",
    // Loading / empty
    loading: "🌟 ¡Preparando tu mundo!",
    empty: "¡Aquí empieza tu aventura! 🚀",
  },
  middle: {
    "points.tab_points": "💎 XP",
    "points.tab_store": "🛒 Canjear XP",
    "points.tab_history": "📜 Mi Historial",
    "level.principiante": "Iniciado",
    "level.principiante.emoji": "🌱",
    "level.intermedio": "Explorador",
    "level.intermedio.emoji": "⚡",
    "level.avanzado": "Guerrero",
    "level.avanzado.emoji": "🔥",
    "level.experto": "Elite",
    "level.experto.emoji": "💎",
    "level.maestro": "Leyenda",
    "level.maestro.emoji": "👑",
    "hero.vak_question": "⚡ ¿Cuál es tu estilo?",
    "hero.vak_subtitle": "Descubre tu estilo de aprendizaje · +25 XP",
    "hero.talk_dani": "Pregúntale a Dani",
    "hero.dani_tagline": "Aquí para ti",
    "missions.title": "🎯 Misiones de hoy",
    "challenge.name": "🧠 Reto IA",
    loading: "⚡ Cargando tu IngenIA...",
    empty: "Aún sin actividad · ¡Comienza ya!",
  },
  senior: {
    "points.tab_points": "Puntos",
    "points.tab_store": "Recompensas",
    "points.tab_history": "Actividad",
    "level.principiante": "Principiante",
    "level.intermedio": "Intermedio",
    "level.avanzado": "Avanzado",
    "level.experto": "Experto",
    "level.maestro": "Maestro",
    "hero.vak_question": "Perfil de aprendizaje VAK",
    "hero.vak_subtitle": "Descubre tu perfil · +25 XP",
    "hero.talk_dani": "Asistente Dani",
    "hero.dani_tagline": "Estoy aquí para ti",
    "missions.title": "Tareas pendientes",
    "challenge.name": "Ejercicio IA",
    loading: "Cargando...",
    empty: "Sin actividad registrada",
  },
};

export function useKidText() {
  const { studentAge } = useIngenIAKids();
  const group =
    studentAge <= 9 ? "early" : studentAge <= 12 ? "middle" : "senior";
  return (key, fallback) =>
    TEXT[group]?.[key] ?? TEXT.senior?.[key] ?? fallback ?? key;
}

export function getKidTextForAge(studentAge, key, fallback) {
  const group =
    studentAge <= 9 ? "early" : studentAge <= 12 ? "middle" : "senior";
  return TEXT[group]?.[key] ?? TEXT.senior?.[key] ?? fallback ?? key;
}
