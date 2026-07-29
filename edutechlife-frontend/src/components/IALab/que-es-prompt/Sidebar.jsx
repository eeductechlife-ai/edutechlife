import PropTypes from 'prop-types'
import { X, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../../i18n/I18nProvider'

const Sidebar = ({ isMenuOpen, setIsMenuOpen, screen, setScreen, completed, screensData }) => {
  const { t } = useTranslation();
  const nav = ['welcome', 'menu', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'];

  return isMenuOpen ? (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsMenuOpen(false)} aria-hidden="true">
      <div role="dialog" aria-modal="true" aria-label={t('ialab.que_es_prompt.sidebar_title')} className="absolute right-0 h-full w-[400px] bg-white dark:bg-slate-800 shadow-2xl p-12 flex flex-col gap-6 animate-[slideInFromRight_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] duration-300" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsMenuOpen(false)} aria-label="Cerrar menú" className="self-end p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-8 h-8 text-slate-600 dark:text-slate-300" /></button>
        <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.4em] mt-12 mb-8 uppercase border-b-2 border-slate-50 dark:border-slate-700 pb-6">{t('ialab.que_es_prompt.sidebar_title')}</h3>
        {nav.map(id => (
          <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} aria-current={screen === id ? 'page' : undefined} className={`p-6 rounded-[2.5rem] text-left text-xs font-[900] transition-all flex items-center justify-between group ${screen === id ? 'bg-[#0D2B5B] text-white shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            <span className="uppercase tracking-widest">{screensData[id].title}</span>
            {completed.includes(id) && <CheckCircle2 className="w-6 h-6 text-[#00B4D8]" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  ) : null;
};

Sidebar.propTypes = {
  isMenuOpen: PropTypes.bool,
  setIsMenuOpen: PropTypes.func,
  screen: PropTypes.string,
  setScreen: PropTypes.func,
  completed: PropTypes.array,
  screensData: PropTypes.object,
};

export default Sidebar;
