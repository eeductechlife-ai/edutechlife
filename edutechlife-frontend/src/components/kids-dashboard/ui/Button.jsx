import { forwardRef } from "react";
import { SB_COLORS, SB_RADII } from "../smartboardTheme";

const VARIANTS = {
  primary: {
    bg: SB_COLORS.primary,
    text: "#FFFFFF",
    hover: SB_COLORS.primaryBright,
    border: "transparent",
  },
  secondary: {
    bg: "transparent",
    text: SB_COLORS.primary,
    hover: "rgba(0,150,199,0.08)",
    border: SB_COLORS.primary,
  },
  ghost: {
    bg: "transparent",
    text: SB_COLORS.textMutedLight,
    hover: "rgba(0,0,0,0.04)",
    border: "transparent",
  },
  danger: {
    bg: SB_COLORS.danger,
    text: "#FFFFFF",
    hover: "#D63060",
    border: "transparent",
  },
};

const SIZES = {
  sm: { padding: "0.375rem 0.875rem", fontSize: "0.8125rem", minH: "2rem" },
  md: { padding: "0.5rem 1.25rem", fontSize: "0.9375rem", minH: "2.5rem" },
  lg: { padding: "0.75rem 1.75rem", fontSize: "1.0625rem", minH: "3rem" },
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    children,
    className = "",
    style = {},
    onClick,
    type = "button",
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: s.padding,
        fontSize: s.fontSize,
        minHeight: s.minH,
        fontWeight: 600,
        borderRadius: SB_RADII.md,
        border: `1.5px solid ${v.border}`,
        background: isDisabled ? "rgba(100,116,139,0.12)" : v.bg,
        color: isDisabled ? SB_COLORS.textMutedLight : v.text,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "background 0.18s, opacity 0.18s, transform 0.12s",
        outline: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          style={{
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "sb-spin 0.7s linear infinite",
          }}
        />
      )}
      {children}
    </button>
  );
});

export default Button;
