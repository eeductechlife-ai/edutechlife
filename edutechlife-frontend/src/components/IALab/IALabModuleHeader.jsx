import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useIALabProgressContext } from "../../context/IALabContext";
import { useTranslation } from "../../i18n/I18nProvider";
import LevelBadge from "./LevelBadge";

// Deriva nivel 0-4 a partir del progreso del módulo (aditivo, no modifica lógica)
const progressToLevel = (progress = 0) => {
  if (progress <= 0) return 0;
  if (progress < 25) return 1;
  if (progress < 50) return 2;
  if (progress < 75) return 3;
  return 4;
};

const IALabModuleHeader = ({ onAction }) => {
  const { t } = useTranslation();
  const { activeMod, modules, courseProgress } = useIALabProgressContext();
  const curr = modules.find((m) => m.id === activeMod) || modules[0];
  const level = progressToLevel(curr?.progress ?? courseProgress);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.05)] border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 hover:border-petroleum/20 dark:hover:border-petroleum/30"
    >
      <div className="bg-gradient-to-r from-petroleum to-corporate py-3 px-4 md:py-3.5 md:px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 bg-white/15 rounded-full flex flex-col items-center justify-center shadow-inner flex-shrink-0">
            <div className="text-lg font-bold text-white leading-none">
              {activeMod}
            </div>
            <div className="text-[9px] font-semibold text-white/70 uppercase tracking-wide leading-none mt-0.5">
              {t("ialab.module_header.module")}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight font-montserrat truncate">
              {curr?.title}
            </h1>
          </div>
          <LevelBadge
            level={level}
            size="sm"
            compact
            showStars
            className="flex-shrink-0"
          />
        </div>
      </div>
    </motion.div>
  );
};

IALabModuleHeader.propTypes = {
  onAction: PropTypes.func,
};

export default IALabModuleHeader;
