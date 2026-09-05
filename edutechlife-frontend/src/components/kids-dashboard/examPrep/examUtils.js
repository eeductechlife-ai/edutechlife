const subjects = [
  { v: "matematicas", l: "Matemáticas", i: "🔢" },
  { v: "lenguaje", l: "Lenguaje", i: "📖" },
  { v: "ciencias", l: "Ciencias", i: "🔬" },
  { v: "historia", l: "Historia", i: "🏛️" },
  { v: "ingles", l: "Inglés", i: "🌎" },
  { v: "arte", l: "Arte", i: "🎨" },
];

const MATERIALS_LS = "edutechlife_exam_materials";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";
const PRACTICE_GLOW = "#EF476F";

const daysLeft = (d) =>
  Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

// Urgency badge — keeps semantic red/amber/green; only the accent style changes
const badgeCls = (d) =>
  d > 30
    ? "text-green-600 bg-green-50 border-green-200"
    : d >= 14
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : d >= 7
        ? "text-orange-600 bg-orange-50 border-orange-200"
        : "text-red-600 bg-red-50 border-red-200";

const badgeEmj = (d) => (d > 30 ? "🌱" : d >= 14 ? "📝" : d >= 7 ? "⚡" : "🔥");

const getTips = (vak) => {
  const style = vak?.predominantStyle || "visual";
  const map = {
    visual: [
      "Crea mapas mentales con colores",
      "Usa tarjetas visuales",
      "Dibuja diagramas",
    ],
    auditivo: [
      "Graba tus apuntes y escúchalos",
      "Explica en voz alta",
      "Usa rimas para recordar",
    ],
    kinestesico: [
      "Haz ejercicios prácticos",
      "Construye modelos",
      "Camina mientras repasas",
    ],
  };
  return (map[style] || map.visual).slice(0, 2);
};

const sbj = (val) => subjects.find((s) => s.v === val);

// SmartBoard pink theme — replaces the IALab teal palette
const inpCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#F1F5F9] text-[#1E293B] placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#FF6B9D] focus:ring-2 focus:ring-[#EF476F]/15 bg-[#F8FAFC] transition-all";

const gdCls =
  "text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all";

export {
  subjects,
  MATERIALS_LS,
  PRACTICE_GRADIENT,
  PRACTICE_GLOW,
  daysLeft,
  badgeCls,
  badgeEmj,
  getTips,
  sbj,
  inpCls,
  gdCls,
};
