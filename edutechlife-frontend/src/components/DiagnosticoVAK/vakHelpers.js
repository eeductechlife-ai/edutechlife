export const MOOD_OPTIONS = [
  {
    value: "happy",
    label: "Bien",
    icon: "Smile",
    message:
      "¡Qué genial que estás con buena energía! Vamos a pasarlo muy bien.",
  },
  {
    value: "neutral",
    label: "Regular",
    icon: "Meh",
    message: "Gracias por compartir. Estoy aquí para acompañarte en cada paso.",
  },
  {
    value: "sad",
    label: "No muy bien",
    icon: "Frown",
    message:
      "Entiendo cómo te sientes. Esta actividad te ayudará a conocerte mejor y puedes hacerla con calma.",
  },
];

/**
 * Destino del QR del informe: la página pública de IngenIA. No lleva datos
 * del estudiante y se genera en el propio navegador.
 */
export const INGENIA_QR_URL = "https://edutechlife.co/conoce-ingenia";

export const getMoodLabel = (moodValue, t) => {
  const labels = {
    happy: t("vak.ui.mood_good"),
    neutral: t("vak.ui.mood_neutral"),
    sad: t("vak.ui.mood_bad"),
  };
  return labels[moodValue] || t("vak.ui.mood_neutral_fallback");
};

export const getMoodFeedback = (moodValue, options) => {
  const mood = options.find((m) => m.value === moodValue);
  return mood || options[1];
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const validateEmail = (email) => {
  if (!email) return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getInstitutionSlugFromURL = () => {
  try {
    const slug = new URLSearchParams(window.location.search).get("inst");
    return slug ? slug.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};
