export const RESOURCE_TYPE_CONFIG = {
  video: {
    icon: "fa-video",
    label: "Video",
    color: "#004B63",
    bg: "bg-[#004B63]/10",
  },
  document: {
    icon: "fa-file-lines",
    label: "Documento",
    color: "#00BCD4",
    bg: "bg-[#00BCD4]/10",
  },
  documento: {
    icon: "fa-file-lines",
    label: "Documento",
    color: "#00BCD4",
    bg: "bg-[#00BCD4]/10",
  },
  pdf: { icon: "fa-file-pdf", label: "PDF", color: "#EF4444", bg: "bg-red-50" },
  "pdf-thumbnail": {
    icon: "fa-file-pdf",
    label: "PDF",
    color: "#EF4444",
    bg: "bg-red-50",
  },
  image: {
    icon: "fa-image",
    label: "Imagen",
    color: "#10B981",
    bg: "bg-emerald-50",
  },
  imagen: {
    icon: "fa-image",
    label: "Imagen",
    color: "#10B981",
    bg: "bg-emerald-50",
  },
  interactive: {
    icon: "fa-puzzle-piece",
    label: "Interactivo",
    color: "#F59E0B",
    bg: "bg-amber-50",
  },
  interactivo: {
    icon: "fa-puzzle-piece",
    label: "Interactivo",
    color: "#F59E0B",
    bg: "bg-amber-50",
  },
  ova: { icon: "fa-brain", label: "OVA", color: "#8B5CF6", bg: "bg-purple-50" },
  "ova-thumbnail": {
    icon: "fa-brain",
    label: "OVA",
    color: "#8B5CF6",
    bg: "bg-purple-50",
  },
  ova_interactive: {
    icon: "fa-brain",
    label: "OVA",
    color: "#8B5CF6",
    bg: "bg-purple-50",
  },
};

export const getResourceIcon = (type) => {
  const icons = {
    video: "fa-video",
    documento: "fa-file-lines",
    pdf: "fa-file-pdf",
    ova: "fa-brain",
    imagen: "fa-image",
    interactivo: "fa-puzzle-piece",
    document: "fa-file-lines",
    "pdf-thumbnail": "fa-file-pdf",
    "ova-thumbnail": "fa-brain",
    image: "fa-image",
    interactive: "fa-puzzle-piece",
  };
  return icons[type] || "fa-file";
};

export const getResourceColor = (type) => {
  const cfg = RESOURCE_TYPE_CONFIG[type];
  return cfg ? `text-[${cfg.color}]` : "text-slate-500";
};
