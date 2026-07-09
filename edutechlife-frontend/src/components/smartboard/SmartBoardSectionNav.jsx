export default function SmartBoardSectionNav({
  currentStep,
  totalSteps,
  stepLabels,
  onGoToStep,
}) {
  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-petroleum/5 shadow-premium">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-3.5 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1.5 sm:gap-2 min-w-max justify-center">
          {stepLabels.map((label, idx) => (
            <button
              key={idx}
              onClick={() => onGoToStep(idx)}
              className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-[13px] font-bold transition-all duration-300 whitespace-nowrap border-b-2 ${
                idx === currentStep
                  ? "bg-petroleum text-white shadow-premium-lg scale-105 ring-2 ring-petroleum/20 border-b-petroleum"
                  : "bg-petroleum/5 border-petroleum/10 text-petroleum/80 border-b-transparent hover:bg-petroleum hover:text-white hover:border-b-petroleum"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-2 sm:ml-3 px-2.5 py-1 rounded-full bg-petroleum/5 border border-petroleum/10 text-xs sm:text-sm font-bold text-petroleum whitespace-nowrap">
            {currentStep + 1} / {totalSteps}
          </span>
        </nav>
      </div>
    </div>
  );
}
