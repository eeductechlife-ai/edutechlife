import { useState } from 'react'
import PropTypes from 'prop-types';;
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import OVAValerioBar from './OVAValerioBar';
import OVANavTabs from './OVANavTabs';

const OVALayout = ({
  children,
  title,
  icon = 'fa-brain',
  tabs = [],
  currentTab,
  onTabChange,
  valerioText,
  valerioAutoPlay = false,
  showNav = true,
  nextLabel,
  prevLabel,
  className,
}) => {
  const hasTabs = tabs.length > 0;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden rounded-2xl">
      {title && (
        <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center">
              <Icon name={icon} className="text-white text-sm sm:text-base" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white font-montserrat">
              {title}
            </h2>
          </div>
        </div>
      )}

      <div className={cn('flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6', className)}>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab || 'content'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showNav && hasTabs && (
        <OVANavTabs
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={onTabChange}
          currentIndex={tabs.findIndex(t => t.id === currentTab)}
          totalTabs={tabs.length}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
        />
      )}

      <OVAValerioBar text={valerioText} autoPlay={valerioAutoPlay} />
    </div>
  );
};


OVALayout.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  tabs: PropTypes.array,
  currentTab: PropTypes.string,
  onTabChange: PropTypes.func,
  valerioText: PropTypes.string,
  valerioAutoPlay: PropTypes.bool,
  showNav: PropTypes.bool,
  nextLabel: PropTypes.string,
  prevLabel: PropTypes.string,
};

export default OVALayout;
