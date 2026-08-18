import PropTypes from "prop-types";

export default function SmartBoardSectionNav({
  currentStep,
  totalSteps,
  stepLabels,
  onGoToStep,
}) {
  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-petroleum/5 shadow-premium">
      {/* Mobile: scroll */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2.5 sm:py-3 lg:hidden overflow-x-auto scrollbar-none">
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
                  : "bg-petroleum/5 border-petroleum/10 text-petroleum/80 border-b-transparent hover:bg-petroleum hover:text-white hover:border-b-petroleum"
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
}

SmartBoardSectionNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGoToStep: PropTypes.func.isRequired,
};
