import { SB_COLORS, SB_RADII } from "../smartboardTheme";

const SIZE_STYLES = {
  sm: { padding: "0.15rem 0.55rem", fontSize: "0.7rem" },
  md: { padding: "0.25rem 0.75rem", fontSize: "0.8rem" },
  lg: { padding: "0.375rem 1rem", fontSize: "0.9rem" },
};

const COLORS = {
  primary: {
    bg: `${SB_COLORS.primary}22`,
    text: SB_COLORS.primary,
    border: `${SB_COLORS.primary}44`,
  },
  success: {
    bg: `${SB_COLORS.success}22`,
    text: SB_COLORS.success,
    border: `${SB_COLORS.success}44`,
  },
  warning: {
    bg: `${SB_COLORS.warning}22`,
    text: "#B45309",
    border: `${SB_COLORS.warning}66`,
  },
  danger: {
    bg: `${SB_COLORS.danger}22`,
    text: SB_COLORS.danger,
    border: `${SB_COLORS.danger}44`,
  },
  violet: {
    bg: `${SB_COLORS.violet}22`,
    text: SB_COLORS.violet,
    border: `${SB_COLORS.violet}44`,
  },
  gold: {
    bg: `${SB_COLORS.gold}33`,
    text: "#92400E",
    border: `${SB_COLORS.gold}88`,
  },
  gray: {
    bg: "rgba(100,116,139,0.12)",
    text: "#64748B",
    border: "rgba(100,116,139,0.25)",
  },
};

export default function Badge({
  color = "primary",
  icon,
  label,
  size = "md",
  style = {},
  className = "",
}) {
  const c = COLORS[color] ?? COLORS.primary;
  const s = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: SB_RADII.pill,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && (
        <span aria-hidden="true" style={{ lineHeight: 1 }}>
          {icon}
        </span>
      )}
      {label}
    </span>
  );
}
