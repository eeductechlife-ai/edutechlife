export const FIRE_GRADIENTS = {
  low: "from-[var(--theme-primary)] to-cyan-400",
  mid: "from-[var(--theme-emphasis)] to-[var(--theme-primary)]",
  high: "from-[var(--theme-emphasis)] to-cyan-400",
};

export const POSITION_ICONS = {
  1: { icon: "fa-trophy", color: "text-amber-400", bg: "bg-amber-50" },
  2: { icon: "fa-medal", color: "text-slate-400", bg: "bg-slate-50" },
  3: { icon: "fa-medal", color: "text-amber-700", bg: "bg-amber-50/50" },
};

export const SECTION_HEADER = "flex items-center gap-2 mb-3";

export const SECTION_ICON_WRAPPER =
  "w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-sm flex-shrink-0";

export const SECTION_TITLE = "text-sm font-bold text-[var(--theme-emphasis)]";

export const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      type: "spring",
      stiffness: 250,
      damping: 22,
    },
  }),
};
