import { SB_COLORS, SB_SHADOWS, SB_RADII } from "../smartboardTheme";

const TREND_ICONS = { up: "↑", down: "↓", flat: "→" };
const TREND_COLORS = {
  up: SB_COLORS.success,
  down: SB_COLORS.danger,
  flat: SB_COLORS.textMutedLight,
};

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  color = SB_COLORS.primary,
  dark = false,
  style = {},
}) {
  const bg = dark ? SB_COLORS.surfaceDark : SB_COLORS.surfaceLight;
  const border = dark ? SB_COLORS.borderDark : SB_COLORS.borderLight;
  const textMain = dark ? "#F0F6FF" : SB_COLORS.deep;
  const textMuted = dark ? SB_COLORS.textMutedDark : SB_COLORS.textMutedLight;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: SB_RADII.lg,
        padding: "1rem 1.25rem",
        boxShadow: SB_SHADOWS.card,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{ fontSize: "0.8125rem", color: textMuted, fontWeight: 500 }}
        >
          {title}
        </span>
        {icon && (
          <span
            aria-hidden="true"
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: SB_RADII.sm,
              background: `${color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              color,
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
        <span
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: textMain,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{ fontSize: "0.875rem", color: textMuted, fontWeight: 500 }}
          >
            {unit}
          </span>
        )}
      </div>

      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span
            aria-label={
              trend === "up"
                ? "aumentó"
                : trend === "down"
                  ? "bajó"
                  : "sin cambio"
            }
            style={{
              color: TREND_COLORS[trend],
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {TREND_ICONS[trend]}
          </span>
          {trendLabel && (
            <span style={{ fontSize: "0.8rem", color: textMuted }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
