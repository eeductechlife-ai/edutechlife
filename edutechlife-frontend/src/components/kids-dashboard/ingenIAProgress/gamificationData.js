export const COLORS = {
  petroleum: "#004B63",
  cyan: "#00BCD4",
  coral: "#4DA8C4",
  mint: "#66CCCC",
  gold: "#FFD166",
  pink: "#FF6B9D",
  slate: "#64748B",
  lightBlue: "#B2D8E5",
};

export const REWARDS = [
  {
    id: 0,
    name: "Primer Paso",
    icon: "🎉",
    cost: 25,
    description: "¡Completaste tu primer día en IngenIA!",
  },
  {
    id: 1,
    name: "Explorador Digital",
    icon: "🔍",
    cost: 75,
    description: "Terminaste tu primer reto inteligente",
  },
  {
    id: 2,
    name: "Tema Oscuro",
    icon: "🌙",
    cost: 500,
    description: "Cambia a modo oscuro el dashboard",
  },
  {
    id: 3,
    name: "Avatar Dani Animado",
    icon: "🤖",
    cost: 750,
    description: "Desbloquea avatar animado de Dani",
  },
  {
    id: 4,
    name: "Fondo Galaxia",
    icon: "🌌",
    cost: 1000,
    description: "Fondo de pantalla espacial",
  },
  {
    id: 5,
    name: "Día Libre",
    icon: "🏖️",
    cost: 1500,
    description: "Un día sin tareas asignadas",
  },
  {
    id: 6,
    name: "Curso IA Básico",
    icon: "🤖",
    cost: 2000,
    description: "Acceso a curso introductorio de IA",
  },
  {
    id: 7,
    name: "Certificado VAK",
    icon: "📜",
    cost: 3000,
    description: "Certificado oficial de tu perfil VAK",
  },
];

export function getLevel(points) {
  if (points >= 5000)
    return { name: "Maestro", icon: "🏆", next: null, progress: 100 };
  if (points >= 2500)
    return {
      name: "Experto",
      icon: "⭐",
      next: 5000,
      progress: ((points - 2500) / 2500) * 100,
    };
  if (points >= 1000)
    return {
      name: "Avanzado",
      icon: "📚",
      next: 2500,
      progress: ((points - 1000) / 1500) * 100,
    };
  if (points >= 500)
    return {
      name: "Intermedio",
      icon: "🌟",
      next: 1000,
      progress: ((points - 500) / 500) * 100,
    };
  return {
    name: "Principiante",
    icon: "🌱",
    next: 500,
    progress: (points / 500) * 100,
  };
}

export function getDayStatus(dateStr, streakLog) {
  if (streakLog.some((e) => e.date === dateStr)) return "active";
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return "future";
  return "missed";
}

export function getActiveHour(dateStr, streakLog) {
  const entry = streakLog.find((e) => e.date === dateStr);
  return entry ? entry.hour : null;
}

export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },
};
