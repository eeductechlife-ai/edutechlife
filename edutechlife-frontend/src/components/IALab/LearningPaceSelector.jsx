/**
 * LearningPaceSelector — Selector de ritmo de aprendizaje del usuario
 *
 * ADITIVO: Componente autocontenido. Escribe a adaptiveSlice.setLearningPace.
 * No modifica lógica existente. Puede insertarse en cualquier settings/onboarding.
 *
 * Uso:
 *   <LearningPaceSelector onChange={(pace) => ...} />
 *   <LearningPaceSelector compact />
 *
 * @see adaptiveSlice.js
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useIALabStore } from "../../store/ialabStore";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

const PACES = [
  {
    id: "slow",
    name: "ialab.learning_pace.slow_name",
    icon: "fa-leaf",
    color: "from-emerald-400 to-teal-500",
    ringColor: "ring-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    borderLight: "border-emerald-200 dark:border-emerald-700",
    textColor: "text-emerald-700 dark:text-emerald-300",
    description: "ialab.learning_pace.slow_desc",
    weekly: "ialab.learning_pace.slow_weekly",
  },
  {
    id: "normal",
    name: "ialab.learning_pace.normal_name",
    icon: "fa-scale-balanced",
    color: "from-sky-400 to-cyan-500",
    ringColor: "ring-sky-400",
    bgLight: "bg-sky-50 dark:bg-sky-900/20",
    borderLight: "border-sky-200 dark:border-sky-700",
    textColor: "text-sky-700 dark:text-sky-300",
    description: "ialab.learning_pace.normal_desc",
    weekly: "ialab.learning_pace.normal_weekly",
  },
  {
    id: "fast",
    name: "ialab.learning_pace.fast_name",
    icon: "fa-bolt",
    color: "from-amber-500 to-orange-500",
    ringColor: "ring-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderLight: "border-amber-200 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
    description: "ialab.learning_pace.fast_desc",
    weekly: "ialab.learning_pace.fast_weekly",
  },
];

const LearningPaceSelector = ({
  compact = false,
  onChange,
  showLabel = true,
  className = "",
}) => {
  const { t } = useTranslation();
  const learningPace = useIALabStore((s) => s.learningPace || "normal");
  const setLearningPace = useIALabStore((s) => s.setLearningPace);

  const handleSelect = (paceId) => {
    if (setLearningPace) setLearningPace(paceId);
    if (onChange) onChange(paceId);
  };

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1 p-1 rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        {PACES.map((pace) => {
          const isActive = learningPace === pace.id;
          return (
            <button
              key={pace.id}
              type="button"
              onClick={() => handleSelect(pace.id)}
              aria-pressed={isActive}
              aria-label={t("ialab.learning_pace.aria", {
                name: t(pace.name),
              })}
              title={`${t(pace.name)}: ${t(pace.description)}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? `bg-gradient-to-br ${pace.color} text-white shadow-md`
                  : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700"
              }`}
            >
              <Icon name={pace.icon} className="text-xs" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-3">
          <h3 className="text-sm font-bold text-petroleum dark:text-white">
            {t("ialab.learning_pace.title")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t("ialab.learning_pace.subtitle")}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PACES.map((pace, i) => {
          const isActive = learningPace === pace.id;
          return (
            <motion.button
              key={pace.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              type="button"
              onClick={() => handleSelect(pace.id)}
              aria-pressed={isActive}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                isActive
                  ? `${pace.bgLight} ${pace.borderLight} shadow-md ring-2 ${pace.ringColor} ring-opacity-40`
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pace-indicator"
                  initial={false}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center"
                >
                  <Icon
                    name="fa-check"
                    className={`text-[10px] ${pace.textColor}`}
                  />
                </motion.div>
              )}

              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pace.color} flex items-center justify-center mb-3 shadow-sm`}
              >
                <Icon name={pace.icon} className="text-white text-sm" />
              </div>

              <div
                className={`text-sm font-bold mb-1 ${isActive ? pace.textColor : "text-petroleum dark:text-white"}`}
              >
                {t(pace.name)}
              </div>

              <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                {t(pace.description)}
              </div>

              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${pace.bgLight} ${pace.textColor}`}
              >
                <Icon name="fa-clock" className="text-[9px]" />
                {t(pace.weekly)}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

LearningPaceSelector.propTypes = {
  compact: PropTypes.bool,
  onChange: PropTypes.func,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default LearningPaceSelector;
