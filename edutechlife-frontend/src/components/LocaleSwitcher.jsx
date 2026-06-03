import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';

const LocaleSwitcher = ({ className = '' }) => {
  const { locale, setLocale } = useTranslation();
  const isSpanish = locale === 'es';

  const toggleLocale = () => {
    setLocale(isSpanish ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLocale}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 bg-white border border-petroleum/20 hover:border-petroleum/40 hover:shadow-sm text-petroleum active:scale-95 group ${className}`}
      aria-label={isSpanish ? 'Cambiar a English' : 'Cambiar a Español'}
      title={isSpanish ? 'English' : 'Español'}
    >
      <Icon
        name="fa-globe"
        className="text-sm text-petroleum/60 group-hover:scale-110 group-hover:text-petroleum transition-all duration-300"
      />
      <span className="hidden sm:inline">{isSpanish ? 'ES' : 'EN'}</span>
    </button>
  );
};

export default LocaleSwitcher;
