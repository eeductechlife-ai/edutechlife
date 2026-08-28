import { SB_COLORS, SB_SHADOWS, SB_RADII } from "../smartboardTheme";

const VARIANTS = {
  default: (dark) => ({
    background: dark ? SB_COLORS.surfaceDark : SB_COLORS.surfaceLight,
    border: `1px solid ${dark ? SB_COLORS.borderDark : SB_COLORS.borderLight}`,
    boxShadow: SB_SHADOWS.card,
  }),
  glass: (dark) => ({
    background: dark ? "rgba(21,31,50,0.72)" : "rgba(255,255,255,0.72)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
    boxShadow: SB_SHADOWS.float,
  }),
  colored: (_dark, color) => ({
    background: color || SB_COLORS.primary,
    border: "none",
    boxShadow: SB_SHADOWS.float,
    color: "#FFFFFF",
  }),
};

const PADDING = { none: "0", sm: "0.75rem", md: "1.25rem", lg: "1.75rem" };

export default function Card({
  variant = "default",
  color,
  padding = "md",
  dark = false,
  className = "",
  style = {},
  children,
  onClick,
  role,
  "aria-label": ariaLabel,
}) {
  const variantFn = VARIANTS[variant] ?? VARIANTS.default;
  const variantStyle = variantFn(dark, color);

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      style={{
        borderRadius: SB_RADII.lg,
        padding: PADDING[padding] ?? PADDING.md,
        cursor: onClick ? "pointer" : undefined,
        transition: onClick ? "box-shadow 0.18s, transform 0.15s" : undefined,
        ...variantStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
