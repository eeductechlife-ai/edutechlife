/**
 * SmartBoard 2.0 — Design Token System
 * ------------------------------------------------------------
 * A vibrant, premium visual language crafted for students 8–16.
 * Keeps EdutechLife's teal identity but amplifies it with rich
 * multi-stop gradients, colored glows and layered depth.
 *
 * Usage:
 *   import { SB, catTheme, glow } from "./smartboardTheme";
 *   style={{ background: SB.gradients.brand }}
 */

// ── Core brand palette ──────────────────────────────────────
export const SB_COLORS = {
  // Deep anchors (headings, dark surfaces)
  deep: "#00303F",
  deepAlt: "#004B63",
  // Primary teal family (brighter, more alive than legacy #4DA8C4)
  primary: "#0096C7",
  primaryBright: "#00B4D8",
  cyan: "#48CAE4",
  sky: "#90E0EF",
  mist: "#CAF0F8",
  // Vibrant accents
  gold: "#FFD166",
  amber: "#FB8500",
  coral: "#EF476F",
  pink: "#FF6B9D",
  violet: "#9D4EDD",
  grape: "#C77DFF",
  mint: "#06D6A0",
  lime: "#95D5B2",
  // Functional
  success: "#06D6A0",
  warning: "#FFB703",
  danger: "#EF476F",
  // Neutrals — light
  bgLight: "#F4F9FC",
  surfaceLight: "#FFFFFF",
  borderLight: "#E2E8F0",
  textMutedLight: "#64748B",
  // Neutrals — dark
  bgDark: "#0B1120",
  surfaceDark: "#151F32",
  surfaceDarkAlt: "#1E293B",
  borderDark: "#2A3A54",
  textMutedDark: "#94A3B8",
};

// ── Signature gradients ─────────────────────────────────────
export const SB_GRADIENTS = {
  brand: "linear-gradient(135deg, #0077B6 0%, #00B4D8 55%, #48CAE4 100%)",
  brandSoft: "linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)",
  hero: "linear-gradient(140deg, #00303F 0%, #0077B6 45%, #00B4D8 78%, #48CAE4 100%)",
  gold: "linear-gradient(135deg, #FFE29A 0%, #FFD166 45%, #FB8500 100%)",
  // Category signatures — each distinct with real personality
  home: "linear-gradient(135deg, #0077B6 0%, #00B4D8 60%, #48CAE4 100%)",
  learn: "linear-gradient(135deg, #06D6A0 0%, #1B9AAA 60%, #118AB2 100%)",
  practice: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)",
  progress: "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
  explore: "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)",
};

// ── Colored glows (box-shadow strings) ──────────────────────
export const glow = (hex, strength = 0.45) => {
  const a = Math.round(strength * 255)
    .toString(16)
    .padStart(2, "0");
  return `0 8px 30px -6px ${hex}${a}, 0 4px 12px -4px ${hex}${a}`;
};

export const SB_SHADOWS = {
  card: "0 10px 30px -12px rgba(0, 48, 63, 0.18), 0 4px 10px -6px rgba(0, 48, 63, 0.12)",
  cardHover:
    "0 20px 45px -12px rgba(0, 48, 63, 0.28), 0 8px 18px -8px rgba(0, 48, 63, 0.18)",
  float: "0 18px 40px -10px rgba(0, 150, 199, 0.35)",
  inset: "inset 0 1px 0 0 rgba(255,255,255,0.25)",
};

// ── Radii (chunky, kid-friendly) ────────────────────────────
export const SB_RADII = {
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  pill: "999px",
};

// ── Per-category theming helper ─────────────────────────────
const CAT_THEME = {
  home: {
    gradient: SB_GRADIENTS.home,
    solid: SB_COLORS.primary,
    glowColor: SB_COLORS.primaryBright,
    emoji: "🏠",
  },
  learn: {
    gradient: SB_GRADIENTS.learn,
    solid: SB_COLORS.mint,
    glowColor: SB_COLORS.mint,
    emoji: "📚",
  },
  practice: {
    gradient: SB_GRADIENTS.practice,
    solid: SB_COLORS.pink,
    glowColor: SB_COLORS.coral,
    emoji: "✏️",
  },
  progress: {
    gradient: SB_GRADIENTS.progress,
    solid: SB_COLORS.amber,
    glowColor: SB_COLORS.warning,
    emoji: "📊",
  },
  explore: {
    gradient: SB_GRADIENTS.explore,
    solid: SB_COLORS.violet,
    glowColor: SB_COLORS.grape,
    emoji: "🎮",
  },
};

export const catTheme = (id) => CAT_THEME[id] || CAT_THEME.home;

// Convenience export bundle
export const SB = {
  colors: SB_COLORS,
  gradients: SB_GRADIENTS,
  shadows: SB_SHADOWS,
  radii: SB_RADII,
};

export default SB;
