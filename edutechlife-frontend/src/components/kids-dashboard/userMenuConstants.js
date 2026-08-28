export const VAK_STYLES_MAP = {
  visual: {
    es: "visual",
    labelKey: "kid.vak.style_visual",
    color: "#0077B6",
    icon: "\u{1F441}️",
    bg: "#E1F2FB",
  },
  auditory: {
    es: "auditivo",
    labelKey: "kid.vak.style_auditory",
    color: "#0F766E",
    icon: "\u{1F442}",
    bg: "#E0F5F2",
  },
  kinesthetic: {
    es: "kinestesico",
    labelKey: "kid.vak.style_kinesthetic",
    color: "#B45309",
    icon: "\u{1F938}",
    bg: "#FEF3E2",
  },
};

export const VAK_OPTIONS = [
  { value: "visual", labelKey: "kid.vak.style_visual", icon: "\u{1F441}️" },
  { value: "auditory", labelKey: "kid.vak.style_auditory", icon: "\u{1F442}" },
  {
    value: "kinesthetic",
    labelKey: "kid.vak.style_kinesthetic",
    icon: "\u{1F938}",
  },
];

export const getInitials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "S";

export const getVakKey = (vakStyle) => {
  if (!vakStyle) return null;
  const normalized = String(vakStyle).toLowerCase().trim();
  const map = {
    visual: "visual",
    auditivo: "auditory",
    auditory: "auditory",
    kinestesico: "kinesthetic",
    kinesthetic: "kinesthetic",
  };
  return map[normalized] || null;
};
