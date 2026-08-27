import { SB_COLORS, SB_RADII } from "../smartboardTheme";
import Button from "./Button";

const SEVERITY = {
  green: {
    bg: `${SB_COLORS.success}18`,
    border: `${SB_COLORS.success}55`,
    icon: "🟢",
    color: SB_COLORS.success,
  },
  yellow: {
    bg: `${SB_COLORS.warning}18`,
    border: `${SB_COLORS.warning}55`,
    icon: "🟡",
    color: "#B45309",
  },
  red: {
    bg: `${SB_COLORS.danger}14`,
    border: `${SB_COLORS.danger}55`,
    icon: "🔴",
    color: SB_COLORS.danger,
  },
};

export default function AlertCard({
  severity = "yellow",
  title,
  message,
  action,
  onAction,
  style = {},
}) {
  const s = SEVERITY[severity] ?? SEVERITY.yellow;

  return (
    <div
      role="alert"
      style={{
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        borderRadius: SB_RADII.lg,
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span aria-hidden="true" style={{ fontSize: "1rem" }}>
          {s.icon}
        </span>
        <span
          style={{ fontWeight: 700, fontSize: "0.9375rem", color: s.color }}
        >
          {title}
        </span>
      </div>
      {message && (
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "inherit",
            opacity: 0.85,
          }}
        >
          {message}
        </p>
      )}
      {action && onAction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          style={{
            color: s.color,
            alignSelf: "flex-start",
            padding: "0.25rem 0",
          }}
        >
          {action} →
        </Button>
      )}
    </div>
  );
}
