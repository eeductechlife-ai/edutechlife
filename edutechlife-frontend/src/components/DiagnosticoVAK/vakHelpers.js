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
      "Entiendo cómo te sientes. Este diagnóstico te ayudará a conocerte mejor.",
  },
];

export const buildResultsURL = (diag) => {
  if (!diag) return "";
  try {
    const base = "https://edutechlife.co";
    const payload = encodeURIComponent(
      JSON.stringify({
        studentName: diag.studentName,
        date: diag.date,
        predominantStyle: diag.predominantStyle,
        percentage: diag.percentage,
      }),
    );
    const dataURL = `${base}/diagnosis/vak/results?payload=${payload}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataURL)}`;
  } catch (e) {
    return "";
  }
};

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
