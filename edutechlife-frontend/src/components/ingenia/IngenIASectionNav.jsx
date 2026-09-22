import { forwardRef } from "react";
import PropTypes from "prop-types";

const IngenIASectionNav = forwardRef(function IngenIASectionNav(
  { currentStep, totalSteps, stepLabels, onGoToStep },
  ref,
) {
  return (
    <div
      ref={ref}
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-petroleum/5 shadow-premium"
    >
      {/* Mobile: scroll */}
      <div className="relative lg:hidden">
        <div className="max-w-7xl mx-auto pl-16 pr-2 sm:pl-4 sm:pr-4 py-2.5 sm:py-3 overflow-x-auto scrollbar-none">
          <nav
            className="flex items-center gap-1 sm:gap-1.5 min-w-max justify-center"
            role="navigation"
            aria-label="Secciones del sitio"
          >
            {stepLabels.map((label, idx) => (
              <button
                key={idx}
                onClick={() => onGoToStep(idx)}
                className={`relative px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap border-b-2 ${
                  idx === currentStep
                    ? "bg-petroleum text-white shadow-premium-lg scale-105 ring-2 ring-petroleum/20 border-b-petroleum"
                    : "bg-petroleum/5 border-petroleum/10 text-petroleum/80 border-b-transparent hover:bg-petroleum hover:text-white hover:border-b-petroleum hover:shadow-md hover:scale-105 active:scale-95"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-1.5 sm:ml-2 px-2 py-1 rounded-full bg-petroleum/5 border border-petroleum/10 text-[9px] sm:text-xs font-bold text-petroleum whitespace-nowrap">
              {currentStep + 1} / {totalSteps}
            </span>
          </nav>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 to-transparent pointer-events-none" />
      </div>

      {/* Desktop: all buttons visible */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 py-2.5">
        <nav
          className="flex items-center justify-center gap-1.5 flex-wrap"
          role="navigation"
          aria-label="Secciones del sitio"
        >
          {stepLabels.map((label, idx) => (
            <button
              key={idx}
              onClick={() => onGoToStep(idx)}
              className={`relative px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap border-b-2 ${
                idx === currentStep
                  ? "bg-petroleum text-white shadow-premium-lg scale-105 ring-2 ring-petroleum/20 border-b-petroleum"
                  : "bg-petroleum/5 border-petroleum/10 text-petroleum/80 border-b-transparent hover:bg-petroleum hover:text-white hover:border-b-petroleum"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-2 px-3 py-1 rounded-full bg-petroleum/5 border border-petroleum/10 text-sm font-bold text-petroleum whitespace-nowrap">
            {currentStep + 1} / {totalSteps}
          </span>
        </nav>
      </div>
    </div>
  );
});

IngenIASectionNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGoToStep: PropTypes.func.isRequired,
};

export default IngenIASectionNav;
