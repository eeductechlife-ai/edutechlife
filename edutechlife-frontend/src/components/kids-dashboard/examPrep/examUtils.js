const subjects = [
  { v: "matematicas", l: "Matemáticas", i: "🔢" },
  { v: "lenguaje", l: "Lenguaje", i: "📖" },
  { v: "ciencias", l: "Ciencias", i: "🔬" },
  { v: "historia", l: "Historia", i: "🏛️" },
  { v: "ingles", l: "Inglés", i: "🌎" },
  { v: "arte", l: "Arte", i: "🎨" },
];

const MATERIALS_LS = "edutechlife_exam_materials";

const daysLeft = (d) =>
  Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

const badgeCls = (d) =>
  d > 30
    ? "text-green-600 bg-green-50 border-green-200"
    : d >= 14
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : d >= 7
        ? "text-orange-600 bg-orange-50 border-orange-200"
        : "text-red-600 bg-red-50 border-red-200";

const badgeEmj = (d) =>
  d > 30 ? "🌱" : d >= 14 ? "📝" : d >= 7 ? "⚡" : "🔥";

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

const inpCls =
  "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#004B63] placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 bg-[#F8FAFC]";

const gdCls =
  "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all";

export {
  subjects,
  MATERIALS_LS,
  daysLeft,
  badgeCls,
  badgeEmj,
  getTips,
  sbj,
  inpCls,
  gdCls,
};
