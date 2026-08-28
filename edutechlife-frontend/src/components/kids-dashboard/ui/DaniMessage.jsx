import { SB_COLORS, SB_RADII } from "../smartboardTheme";

const MOOD_CONFIG = {
  happy: {
    emoji: "😊",
    bg: `${SB_COLORS.primary}18`,
    border: `${SB_COLORS.primary}44`,
  },
  thinking: {
    emoji: "🤔",
    bg: "rgba(155,135,245,0.12)",
    border: "rgba(155,135,245,0.35)",
  },
  explaining: {
    emoji: "💡",
    bg: `${SB_COLORS.gold}22`,
    border: `${SB_COLORS.gold}66`,
  },
  excited: {
    emoji: "🎉",
    bg: `${SB_COLORS.mint}18`,
    border: `${SB_COLORS.mint}44`,
  },
  supportive: {
    emoji: "💙",
    bg: "rgba(239,71,111,0.10)",
    border: "rgba(239,71,111,0.35)",
  },
};

export default function DaniMessage({
  text,
  mood = "happy",
  streaming = false,
  dark = false,
}) {
  const cfg = MOOD_CONFIG[mood] ?? MOOD_CONFIG.happy;
  const textColor = dark ? "#E2E8F0" : SB_COLORS.deep;

  return (
    <div
      role="status"
      aria-live={streaming ? "polite" : undefined}
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "50%",
          background: cfg.bg,
          border: `1.5px solid ${cfg.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.125rem",
        }}
      >
        {cfg.emoji}
      </span>
      <div
        style={{
          flex: 1,
          background: cfg.bg,
          border: `1.5px solid ${cfg.border}`,
          borderRadius: `0.25rem ${SB_RADII.lg} ${SB_RADII.lg} ${SB_RADII.lg}`,
          padding: "0.75rem 1rem",
          fontSize: "0.9375rem",
          lineHeight: 1.6,
          color: textColor,
        }}
      >
        {text}
        {streaming && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.5rem",
              height: "1rem",
              background: SB_COLORS.primary,
              marginLeft: "0.25rem",
              borderRadius: "2px",
              animation: "sb-blink 1s step-end infinite",
              verticalAlign: "text-bottom",
            }}
          />
        )}
      </div>
    </div>
  );
}
