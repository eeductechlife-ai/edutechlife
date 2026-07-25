import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import IALabMobileMenu from '../IALabMobileMenu';

export const MobileMenuOverlay = forwardRef(function MobileMenuOverlay({ showMobileMenu, mobileMenuClosing, closeMobileMenu, MOBILE_MENU_WIDTH, SPRING_DAMPING, SPRING_STIFFNESS, toggleDarkMode, isDarkMode, handleOpenProfile, handleOpenHistory, handleOpenHelp }, ref) {
  return (showMobileMenu || mobileMenuClosing) ? (
    <div ref={ref} id="ialab-mobile-menu" className="fixed inset-0 z-[1001] md:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
      <div className={`absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-250 ${mobileMenuClosing ? 'opacity-0' : 'opacity-100'}`} onClick={closeMobileMenu} />
      <motion.div
        initial={false}
        animate={{ x: mobileMenuClosing ? -MOBILE_MENU_WIDTH : 0 }}
        transition={{ type: 'spring', damping: SPRING_DAMPING, stiffness: SPRING_STIFFNESS }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.4, right: 0 }}
        onDragEnd={(_, info) => { if (info.offset.x < -80) closeMobileMenu(); }}
        className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-xl overflow-y-auto"
        style={{ willChange: 'transform' }}>
        <IALabMobileMenu
          closeMobileMenu={closeMobileMenu}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          onOpenProfile={handleOpenProfile}
          onOpenHistory={handleOpenHistory}
          onOpenHelp={handleOpenHelp}
        />
      </motion.div>
    </div>
  ) : null;
});

const Memoized = memo(MobileMenuOverlay);
export default Memoized;
