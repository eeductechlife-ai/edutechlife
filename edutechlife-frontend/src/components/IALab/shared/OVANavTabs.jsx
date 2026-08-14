import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import { cn } from "../../forum/forumDesignSystem";
import { useTranslation } from "../../../i18n/I18nProvider";

const OVANavTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  currentIndex = 0,
  totalTabs = 0,
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
  className,
}) => {
  const { t } = useTranslation();
  const showTabs = tabs.length > 0;
  const showNav = totalTabs > 0;

  return (
    <div
      className={cn(
        "flex-shrink-0 border-t border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-4xl mx-auto">
        {showNav && currentIndex > 0 ? (
          <button
            onClick={onPrev}
            aria-label={prevLabel || t("ova.nav.prev")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-corporate transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon name="fa-chevron-left" className="text-xs" />
            {prevLabel || t("ova.nav.prev")}
          </button>
        ) : (
          <div />
        )}

        {showTabs && (
          <div className="flex items-center gap-1.5 sm:gap-2" role="tablist">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id || idx}
                onClick={() => onTabChange?.(idx)}
                role="tab"
                aria-selected={tab.id === activeTab || idx === currentIndex}
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all",
                  tab.id === activeTab || idx === currentIndex
                    ? "bg-gradient-to-br from-corporate to-petroleum text-white shadow-md shadow-corporate/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
                )}
                title={tab.title || tab.label || ""}
              >
                <Icon
                  name={tab.icon || "fa-circle"}
                  className="text-sm sm:text-base"
                />
              </button>
            ))}
          </div>
        )}

        {showNav && currentIndex < totalTabs - 1 ? (
          <button
            onClick={onNext}
            aria-label={nextLabel || t("ova.nav.next")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-corporate transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {nextLabel || t("ova.nav.next")}
            <Icon name="fa-chevron-right" className="text-xs" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

OVANavTabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  currentIndex: PropTypes.number,
  totalTabs: PropTypes.number,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  nextLabel: PropTypes.string,
  prevLabel: PropTypes.string,
};

export default OVANavTabs;
