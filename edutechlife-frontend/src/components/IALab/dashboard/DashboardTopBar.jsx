import { Icon } from '../../../utils/iconMapping.jsx';
import { useTheme } from '../../../context/ThemeContext';
import LocaleSwitcher from '../../LocaleSwitcher';

export default function DashboardTopBar() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-petroleum via-petroleum-dark to-corporate rounded-xl flex items-center justify-center shadow-sm shadow-petroleum/15">
          <Icon name="fa-brain" className="text-white text-sm" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-bold text-petroleum dark:text-petroleum tracking-tight">IALab</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center p-2 rounded-xl border border-transparent hover:border-petroleum/20 hover:shadow-sm transition-all duration-200"
          aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-lg ${isDarkMode ? 'text-amber-400' : 'text-corporate'}`} />
        </button>
        <LocaleSwitcher />
      </div>
    </div>
  );
}
