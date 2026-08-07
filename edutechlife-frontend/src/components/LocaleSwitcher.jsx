import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';

const LOCALES = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt', label: 'Português', short: 'PT' },
];

const LocaleSwitcher = ({ className = '' }) => {
  const { locale, setLocale } = useTranslation();
  const current = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 bg-white border border-petroleum/20 hover:border-petroleum/40 hover:shadow-sm text-petroleum active:scale-95 group ${className}`}
          aria-label={`Idioma actual: ${current.label}`}
          title={current.label}
        >
          <Icon
            name="fa-globe"
            className="text-sm text-petroleum/60 group-hover:scale-110 group-hover:text-petroleum transition-all duration-300"
          />
          <span className="hidden sm:inline">{current.short}</span>
          <Icon
            name="fa-chevron-down"
            className="w-3 h-3 text-petroleum/50 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-[10rem] rounded-xl border border-petroleum/15 bg-white dark:bg-slate-800 shadow-lg shadow-petroleum/10 p-1.5 z-50"
      >
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLocale(l.code)}
            className={`cursor-pointer rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none ${
              locale === l.code
                ? 'bg-petroleum/10 text-petroleum dark:text-[#4DA8C4]'
                : 'text-slate-600 dark:text-slate-300 hover:bg-petroleum/5 dark:hover:bg-slate-700/60'
            }`}
          >
            <span className="w-8 inline-block">{l.short}</span>
            {l.label}
            {locale === l.code && (
              <Icon name="fa-check" className="ml-auto w-3.5 h-3.5 text-corporate" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
