import { speakTextConversational } from "./synthesis.js";

const findBestSpanishVoice = (profile = "valerio") => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const spanishVoices = voices.filter((v) => v.lang && v.lang.startsWith("es"));
  const isMaleProfile = [
    "valerio",
    "nico",
    "nico_premium",
    "nico_authority",
  ].includes(profile);

  const maleKeywords = [
    "Jorge",
    "Andres",
    "Carlos",
    "Pablo",
    "Santiago",
    "Microsoft Carlos",
    "Microsoft Pablo",
    "Microsoft Santiago",
    "Microsoft Jorge",
    "Microsoft Andres",
    "Microsoft Felipe",
    "David",
    "James",
    "Google UK English Male",
    "Google US English Male",
    "Microsoft David Desktop",
    "Microsoft Mark",
    "Rocko",
    "Eddy",
    "Reed",
  ];
  const femaleKeywords = [
    "Paulina",
    "Monica",
    "Sabina",
    "Helena",
    "Laura",
    "Sofia",
    "Valentina",
    "Daniela",
    "Camila",
    "Lucia",
    "Sandy",
    "Shelley",
    "Grandma",
    "Microsoft Sabina",
    "Microsoft Helena",
    "Microsoft Laura",
    "Microsoft Paulina",
    "Microsoft Monica",
    "Microsoft Sabina Desktop",
    "Zira",
    "Susan",
    "Hazel",
    "Google US English",
    "Google UK English Female",
  ];

  const isMaleName = (name) => {
    if (maleKeywords.some((k) => name.includes(k))) return true;
    if (femaleKeywords.some((k) => name.includes(k))) return false;
    return !femaleKeywords.some((k) =>
      ["A", "D", "F", "H", "J"].some((e) => name.endsWith(e)),
    );
  };

  const latinRegions = ["es-MX", "es-US", "es-CO", "es-419", "es-ES"];
  const latinMatch = (v) => latinRegions.some((r) => v.lang === r);

  const priority = [
    ...(isMaleProfile
      ? [
          (v) =>
            isMaleName(v.name) &&
            latinMatch(v) &&
            (v.name.includes("Microsoft") ||
              v.name.includes("Carlos") ||
              v.name.includes("Jorge")),
          (v) => isMaleName(v.name) && latinMatch(v),
        ]
      : [
          (v) =>
            !isMaleName(v.name) &&
            latinMatch(v) &&
            (v.name.includes("Microsoft") || v.name.includes("Google")),
          (v) => !isMaleName(v.name) && latinMatch(v),
        ]),
    (v) => latinMatch(v),
    (v) => v.lang.startsWith("es"),
    ...(isMaleProfile
      ? [(v) => isMaleName(v.name)]
      : [(v) => !isMaleName(v.name)]),
    (v) => true,
  ];

  for (const matcher of priority) {
    const found = voices.find(matcher);
    if (found) return found;
  }
  return null;
};

const speakValerioSentence = (text, onEnd, lang = "es-MX") => {
  try {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakValerioSentence(text, onEnd, lang);
      };
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    if (lang.startsWith("es")) {
      const bestVoice = findBestSpanishVoice("valerio");
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.pitch = 0.95;
      }
    } else {
      const englishVoices = voices.filter(
        (v) => v.lang && v.lang.startsWith("en"),
      );
      const bestEnglish =
        englishVoices.find((v) => /male|david|mark|james/i.test(v.name)) ||
        englishVoices[0];
      if (bestEnglish) utterance.voice = bestEnglish;
    }
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => onEnd && onEnd();
    window.speechSynthesis.speak(utterance);
  } catch {}
};

const fireConfetti = (opts) =>
  import("canvas-confetti").then((m) => m.default(opts));

const speakAsValentina = async (
  text,
  age = 12,
  onEndCallback,
  onPermissionError,
) => {
  let profile = "valentina";

  if (age >= 6 && age <= 10) {
    profile = "valentina_child";
  } else if (age >= 15 && age <= 17) {
    profile = "valentina_teen";
  }

  return await speakTextConversational(
    text,
    profile,
    {},
    onEndCallback,
    onPermissionError,
  );
};

const getValentinaVoiceConfig = (age = 12) => {
  if (age >= 6 && age <= 10) {
    return {
      profile: "valentina_child",
      rate: 0.9,
      pitch: 0.3,
      description: "Voz amigable para niños",
    };
  } else if (age >= 11 && age <= 14) {
    return {
      profile: "valentina",
      rate: 1.0,
      pitch: 0.2,
      description: "Voz profesional estándar",
    };
  } else if (age >= 15 && age <= 17) {
    return {
      profile: "valentina_teen",
      rate: 1.1,
      pitch: 0.1,
      description: "Voz profesional para adolescentes",
    };
  }

  return {
    profile: "valentina",
    rate: 1.0,
    pitch: 0.2,
    description: "Voz profesional estándar",
  };
};

export {
  findBestSpanishVoice,
  speakValerioSentence,
  fireConfetti,
  speakAsValentina,
  getValentinaVoiceConfig,
};
