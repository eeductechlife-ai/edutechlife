import PropTypes from "prop-types";
const ModuleHeaderSection = ({ moduleData }) => {
  return (
    <div className="relative pl-5 border-l-2 border-transparent bg-gradient-to-b from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/5 rounded-r-xl py-3 pr-4 dark:from-[var(--theme-emphasis)]/20 dark:to-[var(--theme-primary)]/10"
      style={{
        borderImage: "linear-gradient(to bottom, #004B63, #00BCD4) 1",
      }}
    >
      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-sm flex items-center justify-center flex-shrink-0">
        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4 L20 12 L4 20" />
        </svg>
      </div>

      <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed dark:text-slate-200 font-[450]">
        {moduleData.description}
      </p>
    </div>
  );
};

ModuleHeaderSection.propTypes = {
  moduleData: PropTypes.object,
};

export default ModuleHeaderSection;
