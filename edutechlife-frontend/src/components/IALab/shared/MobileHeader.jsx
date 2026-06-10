import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping';
import { useTranslation } from '../../../i18n/I18nProvider';

/**
 * @param {Object} props
 * @param {() => void} props.onOpenMobileMenu
 * @param {(v: boolean) => void} props.setIsSearchOpen
 * @param {string} props.searchQuery
 * @param {(v: string) => void} props.setSearchQuery
 * @param {boolean} props.isSearchOpen
 */
const MobileHeader = ({ onOpenMobileMenu, setIsSearchOpen, searchQuery, setSearchQuery, isSearchOpen }) => {
  const { t } = useTranslation();
  return (
    <div role="banner" onTouchStart={(e) => e.stopPropagation()} className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 pt-[var(--safe-area-top)]">
      <h1 className="text-2xl font-bold text-petroleum dark:text-petroleum tracking-tight">{t('ialab.title')}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
           aria-label={t('ialab.search_aria')}
         >
           <Icon name="fa-search" className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          onClick={onOpenMobileMenu}
          className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
           aria-label={t('ialab.menu_aria')}
       >
         <svg className="w-6 h-6 text-petroleum dark:text-corporate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
         </svg>
        </button>
      </div>
    </div>
  );
};

MobileHeader.displayName = 'MobileHeader';


MobileHeader.propTypes = {
  onOpenMobileMenu: PropTypes.func,
  setIsSearchOpen: PropTypes.func,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  isSearchOpen: PropTypes.bool,
};

export default MobileHeader;
export { MobileHeader };
