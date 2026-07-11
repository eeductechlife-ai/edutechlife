import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * BrandButton — Fase 1 · Cimientos de diseño
 * ============================================================
 * Botón primitivo que replica el patrón visual ya usado en
 * FlashcardSystem.jsx / ProblemScanner.jsx (gradiente petróleo→mint,
 * bordes marcados, rounded-2xl, motion whileHover/whileTap) usando
 * los tokens `brand-*` de src/styles/tokens.css.
 *
 * No reemplaza `src/components/ui/button.jsx` (primitivo shadcn/ui
 * usado por otras partes del código) — es un primitivo nuevo,
 * pensado para las superficies "kids-dashboard" / gamificadas.
 *
 * Nombrado `BrandButton` (no `Button`) para evitar colisión de
 * archivo en sistemas de archivos insensibles a mayúsculas (APFS)
 * con el ya existente `button.jsx`.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} [variant='primary']
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [fullWidth=false]
 * @param {boolean} [motionEnabled=true] - desactiva whileHover/whileTap
 * @param {string} [className]
 */
const VARIANT_STYLES = {
  primary:
    "bg-gradient-brand-primary text-white shadow-brand-md hover:shadow-brand-lg border border-transparent",
  secondary:
    "bg-white text-brand-ink border-2 border-brand-primary shadow-brand-sm hover:bg-brand-primary/5",
  ghost:
    "bg-white text-brand-text-sub border border-brand-border shadow-brand-sm hover:bg-slate-50",
  danger:
    "bg-white text-red-500 border-2 border-red-400 hover:bg-red-50 shadow-brand-sm",
};

const SIZE_STYLES = {
  sm: "px-4 py-2 text-sm rounded-brand-md gap-1.5",
  md: "px-5 py-3 text-base rounded-brand-lg gap-2",
  lg: "px-6 py-4 text-lg rounded-brand-lg gap-2.5",
};

const BrandButton = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      motionEnabled = true,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center font-bold transition-all",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
      VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
      SIZE_STYLES[size] || SIZE_STYLES.md,
      fullWidth && "w-full",
      className,
    );

    if (motionEnabled && !disabled) {
      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={classes}
          disabled={disabled}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {children}
      </button>
    );
  },
);

BrandButton.displayName = "BrandButton";

export { BrandButton };
export default BrandButton;
