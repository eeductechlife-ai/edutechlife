import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * BrandCard — Fase 1 · Cimientos de diseño
 * ============================================================
 * Contenedor primitivo que replica el patrón de tarjeta usado en
 * FlashcardSystem.jsx / ProblemScanner.jsx: fondo blanco, borde
 * sutil o marcado, rounded-2xl, sombra suave, usando los tokens
 * `brand-*` de src/styles/tokens.css.
 *
 * No reemplaza `src/components/ui/card.jsx` (primitivo shadcn/ui) —
 * es un primitivo nuevo para superficies "kids-dashboard". Nombrado
 * `BrandCard` (no `Card`) para evitar colisión de archivo en
 * sistemas de archivos insensibles a mayúsculas (APFS).
 *
 * @param {'default'|'outline'|'glass'} [variant='default']
 * @param {boolean} [hoverable=false] - eleva la tarjeta al pasar el mouse
 * @param {boolean} [interactive=false] - envuelve en motion.div con tap scale
 * @param {string} [as='div'] - tag a renderizar cuando no es interactive
 */
const VARIANT_STYLES = {
  default: "bg-white border border-brand-border shadow-brand-sm",
  outline: "bg-white border-2 border-brand-primary shadow-brand-sm",
  glass:
    "bg-white/80 backdrop-blur-glass border border-brand-border shadow-glass",
};

const BrandCard = forwardRef(
  (
    {
      variant = "default",
      hoverable = false,
      interactive = false,
      as: Tag = "div",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "rounded-brand-lg p-5 transition-all",
      VARIANT_STYLES[variant] || VARIANT_STYLES.default,
      hoverable && "hover:shadow-brand-md hover:-translate-y-0.5",
      className,
    );

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(classes, "cursor-pointer")}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  },
);

BrandCard.displayName = "BrandCard";

const BrandCardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 mb-4", className)}
    {...props}
  />
));
BrandCardHeader.displayName = "BrandCardHeader";

const BrandCardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold text-brand-ink leading-tight", className)}
    {...props}
  />
));
BrandCardTitle.displayName = "BrandCardTitle";

const BrandCardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-brand-text-sub", className)}
    {...props}
  />
));
BrandCardDescription.displayName = "BrandCardDescription";

const BrandCardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-brand-text", className)} {...props} />
));
BrandCardContent.displayName = "BrandCardContent";

const BrandCardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 mt-4 pt-4 border-t border-brand-border",
      className,
    )}
    {...props}
  />
));
BrandCardFooter.displayName = "BrandCardFooter";

export {
  BrandCard,
  BrandCardHeader,
  BrandCardTitle,
  BrandCardDescription,
  BrandCardContent,
  BrandCardFooter,
};
export default BrandCard;
