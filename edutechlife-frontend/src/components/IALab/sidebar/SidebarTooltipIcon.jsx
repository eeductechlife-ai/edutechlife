import React, { forwardRef, useId } from "react";
import PropTypes from "prop-types";

// Nota de accesibilidad: el wrapper NO debe ser un control (sin role/tabIndex)
// porque el hijo ya es un botón real; tener ambos crea un doble tab-stop. El
// tooltip se asocia al control con `aria-describedby` y se muestra también con
// `focus-within` cuando el control recibe foco por teclado.
const TooltipIcon = forwardRef(function TooltipIcon(
  { label, children, premium, decorative },
  ref,
) {
  const tipId = useId();
  const child =
    !decorative && React.isValidElement(children)
      ? React.cloneElement(children, { "aria-describedby": tipId })
      : children;

  return (
    <div
      ref={ref}
      className="relative group/tip flex items-center justify-center"
    >
      {child}
      {premium ? (
        <div
          id={tipId}
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-[var(--theme-emphasis)]/20 dark:border-[var(--theme-emphasis)]/40 rounded-xl opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-[var(--theme-emphasis)]/10 pointer-events-none min-w-[140px]"
          role="tooltip"
        >
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/95 dark:bg-slate-800/95 border-l border-b border-[var(--theme-emphasis)]/20 dark:border-[var(--theme-emphasis)]/40 -rotate-45" />
          {label}
        </div>
      ) : (
        <div
          id={tipId}
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-slate-900/20 pointer-events-none"
          role="tooltip"
        >
          {label}
        </div>
      )}
    </div>
  );
});

TooltipIcon.propTypes = {
  label: PropTypes.node,
  premium: PropTypes.bool,
  decorative: PropTypes.bool,
  children: PropTypes.node,
};

export default TooltipIcon;
