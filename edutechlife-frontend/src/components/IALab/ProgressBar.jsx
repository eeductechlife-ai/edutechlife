import { motion } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * ProgressBar — Barra de progreso visual mejorada
 * Muestra: porcentaje, lecciones completadas, y animación suave
 */
export const ProgressBar = ({
  completed = 0,
  total = 15,
  showLabel = true,
  size = "md",
}) => {
  const { t } = useTranslation();
  const percentage = Math.round((completed / total) * 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-full ${sizeClasses[size]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}
      >
        <motion.div
          className="h-full theme-bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold theme-text-primary">
            {t("ialab.progress_label")}
          </span>
          <span className="text-xs font-bold theme-text-muted">
            {completed}/{total} ({percentage}%)
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
