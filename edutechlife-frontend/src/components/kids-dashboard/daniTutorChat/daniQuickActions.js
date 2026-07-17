export const QUICK_ACTIONS = [
  { icon: "📚", label: "Ayuda con tarea", value: "ayuda_tarea" },
  { icon: "💭", label: "Dime algo motivador", value: "motivame" },
  { icon: "🎯", label: "Mi estilo VAK", value: "vak_estrategias" },
  { icon: "📅", label: "Qué debo hacer hoy", value: "que_hacer_hoy" },
  { icon: "🧠", label: "Explícame un tema", value: "explicar_tema" },
  { icon: "🤗", label: "Apoyo emocional", value: "apoyo_emocional" },
];

export function getQuickActionMessage(action) {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? "hoy" : hour < 18 ? "esta tarde" : "esta noche";

  const messages = {
    ayuda_tarea: `Dani, necesito ayuda con mi tarea. ¿Me puedes explicar paso a paso y darme estrategias según mi estilo de aprendizaje?`,
    motivame: `Dani, necesito que me motives un poco. ¿Qué me dirías para seguir adelante con mis estudios ${timeOfDay}?`,
    vak_estrategias: `Dani, recuérdame cuál es mi estilo VAK y dame estrategias concretas para estudiar mejor`,
    que_hacer_hoy: `Dani, ¿qué me recomiendas hacer ${timeOfDay} para ser productivo en mis estudios?`,
    explicar_tema: `Dani, explícame un tema académico interesante de forma fácil y divertida`,
    apoyo_emocional: `Dani, necesito apoyo emocional. No me siento bien y necesito que me ayudes a sentirme mejor.`,
  };

  return messages[action] || action;
}
