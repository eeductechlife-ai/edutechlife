import { forwardRef } from "react";
import { cn } from "../../lib/utils";

/**
 * BrandBadge — Fase 1 · Cimientos de diseño
 * ============================================================
 * Etiqueta/pill primitiva que replica el patrón de badges usado en
 * FlashcardSystem.jsx (términos relacionados, indicador de grado)
 * usando los tokens `brand-*` de src/styles/tokens.css.
 *
 * @param {'primary'|'mint'|'pink'|'yellow'|'purple'|'success'|'warning'|'danger'|'neutral'} [variant='primary']
 * @param {'sm'|'md'} [size='md']
 * @param {'lg'|'pill'} [shape='lg'] - rounded-brand-md ("lg" visual) o pill completo
 * @param {boolean} [outline=false] - variante con fondo suave + texto de color en vez de fondo sólido
 */
const SOLID_VARIANT_STYLES = {
  primary: "bg-brand-primary text-white",
  mint: "bg-brand-mint text-brand-ink",
  pink: "bg-brand-pink text-white",
  yellow: "bg-brand-yellow text-brand-ink",
  purple: "bg-brand-purple text-white",
  success: "bg-brand-success text-white",
  warning: "bg-brand-warning text-white",
  danger: "bg-brand-danger text-white",
  neutral: "bg-slate-100 text-brand-text-sub",
};

const OUTLINE_VARIANT_STYLES = {
  primary: "bg-brand-primary/10 text-brand-primary",
  mint: "bg-brand-mint/15 text-brand-ink",
  pink: "bg-brand-pink/10 text-brand-pink",
  yellow: "bg-brand-yellow/15 text-brand-ink",
  purple: "bg-brand-purple/10 text-brand-purple",
  success: "bg-brand-success-bg text-brand-success",
  warning: "bg-brand-warning-bg text-brand-warning",
  danger: "bg-brand-danger-bg text-brand-danger",
  neutral: "bg-slate-50 text-brand-text-sub border border-slate-100",
};

const SIZE_STYLES = {
  sm: "text-xs px-2 py-1 gap-1",
  md: "text-sm px-3 py-1.5 gap-1.5",
};

const BrandBadge = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      shape = "lg",
      outline = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = outline
      ? OUTLINE_VARIANT_STYLES
      : SOLID_VARIANT_STYLES;
    const classes = cn(
      "inline-flex items-center justify-center font-bold whitespace-nowrap",
      shape === "pill" ? "rounded-brand-pill" : "rounded-brand-md",
      variantStyles[variant] || variantStyles.primary,
      SIZE_STYLES[size] || SIZE_STYLES.md,
      className,
    );

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

BrandBadge.displayName = "BrandBadge";

export { BrandBadge };
export default BrandBadge;
