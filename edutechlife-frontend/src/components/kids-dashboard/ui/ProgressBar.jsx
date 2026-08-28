import { SB_COLORS, SB_RADII } from "../smartboardTheme";

export default function ProgressBar({
  value = 0,
  max = 100,
  color = SB_COLORS.primary,
  label,
  showPercent = false,
  animated = true,
  height = "0.625rem",
  dark = false,
  "aria-label": ariaLabel,
}) {
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  const trackColor = dark ? SB_COLORS.borderDark : SB_COLORS.borderLight;
  const labelText = ariaLabel || label || `${Math.round(pct)}%`;

  return (
    <div style={{ width: "100%" }}>
      {(label || showPercent) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.375rem",
            fontSize: "0.8125rem",
            color: dark ? SB_COLORS.textMutedDark : SB_COLORS.textMutedLight,
            fontWeight: 500,
          }}
        >
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={labelText}
        style={{
          width: "100%",
          height,
          background: trackColor,
          borderRadius: SB_RADII.pill,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: SB_RADII.pill,
            transition: animated
              ? "width 0.5s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}
