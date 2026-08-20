import { getSubjectEmoji } from "../../../config/subjectMappings";

// Mon=1 … Sun=7 (matches DB CHECK in migration 042).
export const DAY_KEYS = [1, 2, 3, 4, 5, 6, 7];

export const DAY_LABELS = {
  es: {
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
    7: "Dom",
    long: {
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
      7: "Domingo",
    },
  },
  en: {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
    long: {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    },
  },
};

// Palette used to auto-color slots when the scanner does not provide one.
const SUBJECT_COLORS = {
  matematicas: "#4DA8C4",
  lenguaje: "#EF476F",
  ciencias: "#06D6A0",
  sociales: "#FB8500",
  ingles: "#118AB2",
  arte: "#9D4EDD",
  educacion_fisica: "#FFD166",
  tecnologia: "#004B63",
  filosofia: "#7B2FF7",
  religion: "#B2D8E5",
  musica: "#FF6B9D",
  default: "#66CCCC",
};

const NORMALIZE_MAP = [
  [/matem[aá]t/i, "matematicas"],
  [/lenguaje|lengua|lecto|escritur|espa[ñn]ol/i, "lenguaje"],
  [/ciencias?\s*naturales|biolog|qu[ií]mic|f[ií]sic/i, "ciencias"],
  [/sociales|historia|geograf/i, "sociales"],
  [/ingl[eé]s|english/i, "ingles"],
  [/arte|art[ií]stic|m[uú]sic/i, "arte"],
  [/educaci[oó]n\s*f[ií]sic|deport|ed\.?\s*f[ií]s/i, "educacion_fisica"],
  [/tecnolog|inform[aá]tic|sistemas|computaci/i, "tecnologia"],
  [/filosof/i, "filosofia"],
  [/religi/i, "religion"],
];

export const normalizeSubject = (raw) => {
  if (!raw) return "otro";
  const s = String(raw).trim().toLowerCase();
  for (const [re, key] of NORMALIZE_MAP) {
    if (re.test(s)) return key;
  }
  return s.replace(/\s+/g, "_").slice(0, 30);
};

export const subjectColor = (subject) =>
  SUBJECT_COLORS[normalizeSubject(subject)] || SUBJECT_COLORS.default;

export const subjectEmoji = (subject) => getSubjectEmoji(subject);

// Accepts "8", "8:00", "8am", "8:30 am", "14:30" → "HH:MM"
export const parseTimeToHHMM = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase().replace(/\s+/g, "");
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3];
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

export const timeToMinutes = (hhmm) => {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

export const formatHHMM = (hhmm, locale = "es") => {
  // 24h looks fine in ES; convert to 12h for EN.
  if (!hhmm) return "";
  if (locale !== "en") return hhmm;
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
};

// Coerce a raw JSON slot from OCR into the shape saveSlots expects.
export const coerceSlot = (raw) => {
  const day = Number(raw.day_of_week ?? raw.day);
  const start = parseTimeToHHMM(raw.start_time || raw.start);
  const end = parseTimeToHHMM(raw.end_time || raw.end);
  const subjectLabel = (raw.subject || "").toString().trim();
  if (!day || !start || !end || !subjectLabel) return null;
  const subject = normalizeSubject(subjectLabel);
  return {
    day_of_week: day,
    start_time: start,
    end_time: end,
    subject,
    subject_label: subjectLabel,
    teacher: raw.teacher || null,
    room: raw.room || null,
    color: subjectColor(subject),
  };
};

// Deterministic id for React lists in the editor (slots have no db id until saved).
export const localId = () =>
  `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
