import React, { forwardRef, useState, useId } from 'react';
import PropTypes from 'prop-types';

const TooltipIcon = forwardRef(function TooltipIcon({ label, children, premium, decorative }, ref) {
  const [isFocused, setIsFocused] = useState(false);
  const tipId = useId();
  const wrapperProps = decorative ? {
    ref,
    className: "relative group/tip flex items-center justify-center",
  } : {
    ref,
    className: "relative group/tip flex items-center justify-center",
    tabIndex: 0,
    role: "button",
    "aria-describedby": tipId,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const interactive = e.currentTarget.querySelector('button, [role="button"], [tabindex]:not([tabindex="-1"])');
        interactive?.click();
      }
    },
  };
  return (
    <div {...wrapperProps}>
      {children}
      {premium ? (
        <div id={tipId} className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-petroleum/20 dark:border-petroleum/40 rounded-xl opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-petroleum/10 pointer-events-none min-w-[140px]" role="tooltip">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/95 dark:bg-slate-800/95 border-l border-b border-petroleum/20 dark:border-petroleum/40 -rotate-45" />
          {label}
        </div>
      ) : (
        <div id={tipId} className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-200 whitespace-nowrap z-[60] shadow-xl shadow-slate-900/20 pointer-events-none" role="tooltip">
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
};

export default TooltipIcon;
