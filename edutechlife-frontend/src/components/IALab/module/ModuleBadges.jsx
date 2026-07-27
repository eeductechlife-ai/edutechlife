import PropTypes from "prop-types";

const ModuleBadges = ({ duration, doneCount, totalLessons, t }) => {
  if (!totalLessons) return null;
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="px-3 py-1.5 bg-gradient-to-br from-petroleum/10 to-corporate/5 text-petroleum text-[10px] font-bold rounded-lg border border-petroleum/10 shadow-sm">
        {duration}
      </span>
      <span
        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${doneCount === totalLessons ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
      >
        {t("ialab.module.lessons", { done: doneCount, total: totalLessons })}
      </span>
    </div>
  );
};

ModuleBadges.propTypes = {
  duration: PropTypes.string,
  doneCount: PropTypes.number,
  totalLessons: PropTypes.number,
  t: PropTypes.func,
};

export default ModuleBadges;
