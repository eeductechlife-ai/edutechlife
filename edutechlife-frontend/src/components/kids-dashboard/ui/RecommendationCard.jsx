import { SB_COLORS, SB_RADII, SB_SHADOWS } from "../smartboardTheme";
import Button from "./Button";

export default function RecommendationCard({
  title,
  reason,
  action,
  onAction,
  duration,
  difficulty,
  subject,
  dark = false,
  style = {},
}) {
  const bg = dark ? SB_COLORS.surfaceDarkAlt : SB_COLORS.surfaceLight;
  const border = dark ? SB_COLORS.borderDark : SB_COLORS.borderLight;
  const textMain = dark ? "#F0F6FF" : SB_COLORS.deep;
  const textMuted = dark ? SB_COLORS.textMutedDark : SB_COLORS.textMutedLight;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: SB_RADII.lg,
        padding: "1.25rem",
        boxShadow: SB_SHADOWS.card,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        ...style,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <div style={{ flex: 1 }}>
          {subject && (
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: SB_COLORS.primary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {subject}
            </span>
          )}
          <h3
            style={{
              margin: subject ? "0.2rem 0 0" : 0,
              fontSize: "1rem",
              fontWeight: 700,
              color: textMain,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </div>
        {duration && (
          <span
            style={{
              flexShrink: 0,
              fontSize: "0.8rem",
              color: textMuted,
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              borderRadius: SB_RADII.pill,
              padding: "0.2rem 0.6rem",
              fontWeight: 500,
            }}
          >
            ⏱ {duration}
          </span>
        )}
      </div>

      {/* Reason */}
      {reason && (
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: textMuted,
            lineHeight: 1.55,
            borderLeft: `3px solid ${SB_COLORS.primary}55`,
            paddingLeft: "0.75rem",
          }}
        >
          {reason}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        {difficulty && (
          <span style={{ fontSize: "0.8rem", color: textMuted }}>
            {difficulty === "easy"
              ? "😊 Fácil"
              : difficulty === "hard"
                ? "😣 Difícil"
                : "😐 Normal"}
          </span>
        )}
        {action && onAction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            style={{ marginLeft: "auto" }}
          >
            {action}
          </Button>
        )}
      </div>
    </div>
  );
}
