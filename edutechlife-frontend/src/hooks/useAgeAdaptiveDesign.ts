/**
 * useAgeAdaptiveDesign Hook
 *
 * Adapts UI sizing, spacing, and typography for different age groups (6-16).
 * Ensures accessibility (WCAG 2.1 AA) while maintaining pedagogical quality.
 *
 * Usage:
 *   const { fontSize, touchTarget, spacing } = useAgeAdaptiveDesign(userAge)
 */

export type AgeGroup = "elementary" | "middle" | "secondary";

interface AdaptiveDesignTokens {
  ageGroup: AgeGroup;
  fontSize: {
    body: string;
    heading: string;
    label: string;
    caption: string;
  };
  touchTarget: string; // Minimum touch target size
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  lineHeight: string;
  letterSpacing: string;
  animationDuration: string;
  focusOutlineWidth: string;
  focusOutsetOffset: string;
}

export function useAgeAdaptiveDesign(userAge?: number): AdaptiveDesignTokens {
  // Determine age group
  const ageGroup: AgeGroup = userAge
    ? userAge <= 9
      ? "elementary"
      : userAge <= 13
        ? "middle"
        : "secondary"
    : "middle"; // default to middle school

  const TOKENS: Record<AgeGroup, AdaptiveDesignTokens> = {
    elementary: {
      // Ages 6-9: Large, friendly, forgiving
      ageGroup: "elementary",
      fontSize: {
        body: "18px", // Large, easy to read
        heading: "28px", // Prominent hierarchy
        label: "16px", // Form labels visible
        caption: "14px", // Secondary info
      },
      touchTarget: "56px", // 14mm (AAA for children)
      spacing: {
        xs: "12px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
      },
      borderRadius: "24px", // Friendly, rounded
      lineHeight: "1.8", // Generous (easier to track)
      letterSpacing: "0.5px", // Slightly loose
      animationDuration: "400ms", // Slower, clearer
      focusOutlineWidth: "4px", // Thicker for visibility
      focusOutsetOffset: "3px",
    },
    middle: {
      // Ages 10-13: Balanced, modern
      ageGroup: "middle",
      fontSize: {
        body: "16px", // Standard web font
        heading: "24px", // Clear hierarchy
        label: "14px", // Compact but readable
        caption: "13px",
      },
      touchTarget: "48px", // 12mm (AA standard)
      spacing: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      borderRadius: "12px", // Balanced
      lineHeight: "1.6", // Standard web
      letterSpacing: "0px", // Normal
      animationDuration: "300ms", // Responsive
      focusOutlineWidth: "3px",
      focusOutsetOffset: "2px",
    },
    secondary: {
      // Ages 14-16: Professional, adult-like
      ageGroup: "secondary",
      fontSize: {
        body: "14px", // Compact, professional
        heading: "20px", // Subtle hierarchy
        label: "13px", // Dense interfaces OK
        caption: "12px",
      },
      touchTarget: "44px", // 11mm (AA standard, adult size)
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      borderRadius: "8px", // Professional
      lineHeight: "1.5", // Compact
      letterSpacing: "-0.5px", // Tighter
      animationDuration: "200ms", // Snappy
      focusOutlineWidth: "2px",
      focusOutsetOffset: "2px",
    },
  };

  return TOKENS[ageGroup];
}

/**
 * Helper: Get CSS custom properties for a given age group
 * Useful for setting :root variables or inline styles
 */
export function getAdaptiveDesignCSS(userAge?: number): Record<string, string> {
  const tokens = useAgeAdaptiveDesign(userAge);

  return {
    "--age-group": tokens.ageGroup,
    "--font-size-body": tokens.fontSize.body,
    "--font-size-heading": tokens.fontSize.heading,
    "--font-size-label": tokens.fontSize.label,
    "--font-size-caption": tokens.fontSize.caption,
    "--touch-target": tokens.touchTarget,
    "--spacing-xs": tokens.spacing.xs,
    "--spacing-sm": tokens.spacing.sm,
    "--spacing-md": tokens.spacing.md,
    "--spacing-lg": tokens.spacing.lg,
    "--spacing-xl": tokens.spacing.xl,
    "--border-radius": tokens.borderRadius,
    "--line-height": tokens.lineHeight,
    "--letter-spacing": tokens.letterSpacing,
    "--animation-duration": tokens.animationDuration,
    "--focus-outline-width": tokens.focusOutlineWidth,
    "--focus-outline-offset": tokens.focusOutsetOffset,
  };
}

/**
 * Hook wrapper: useAgeAdaptiveDesign
 * Returns tokens + helper for applying CSS
 */
export function useAdaptiveDesignCSS(userAge?: number) {
  const tokens = useAgeAdaptiveDesign(userAge);
  const cssVars = getAdaptiveDesignCSS(userAge);

  return {
    tokens,
    cssVars,
    /**
     * Apply to inline style for immediate effect
     * Example: <div style={applyTokens()}>
     */
    applyTokens: () => cssVars,
  };
}
