import { useTranslation } from '../i18n/I18nProvider';

const ColombiaFlag = () => (
  <svg className="w-5 h-5 rounded-sm shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#FCD116" />
    <rect y="10" width="30" height="5" fill="#003893" />
    <rect y="15" width="30" height="5" fill="#CE1126" />
  </svg>
);

const EnglandFlag = () => (
  <svg className="w-5 h-5 rounded-sm shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#FFFFFF" />
    <rect x="13" width="4" height="20" fill="#CE1126" />
    <rect y="8" width="30" height="4" fill="#CE1126" />
  </svg>
);

const LocaleSwitcher = ({ className = '' }) => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLocale('es')}
        className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
          locale === 'es'
            ? 'bg-petroleum/10 dark:bg-petroleum/20 text-petroleum dark:text-petroleum shadow-sm'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        aria-label="Español"
        title="Español"
      >
        <ColombiaFlag />
        <span className="hidden sm:inline">ES</span>
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
          locale === 'en'
            ? 'bg-petroleum/10 dark:bg-petroleum/20 text-petroleum dark:text-petroleum shadow-sm'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        aria-label="English"
        title="English"
      >
        <EnglandFlag />
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
};

export default LocaleSwitcher;
