import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';

const ResearchContextBanner = ({ topic, stepNumber, moduleId = 3 }) => {
  const { t } = useTranslation();
  if (!topic) return null;
  return (
    <div className="bg-gradient-to-r from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 dark:from-[var(--theme-emphasis)]-dark/10 dark:to-[var(--theme-primary)]-dark/10 rounded-xl p-4 border border-[var(--theme-emphasis)]/10 dark:border-[var(--theme-emphasis)]-dark/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0">
          <Icon name="fa-search" className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--theme-primary)] uppercase tracking-wider">
              {t(`ialab.challenge.m${moduleId}.researching`)}
            </span>
            {stepNumber && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]-dark/20 text-[var(--theme-primary)] dark:text-[var(--theme-primary)]-dark font-medium">
                {t(`ialab.challenge.m${moduleId}.step_label`, { step: stepNumber })}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-[var(--theme-emphasis)] dark:text-white truncate mt-0.5">{topic}</p>
        </div>
      </div>
    </div>
  );
};


ResearchContextBanner.propTypes = {
  topic: PropTypes.string,
  stepNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  moduleId: PropTypes.number,
};

export default ResearchContextBanner;
