import { useState, useRef } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../i18n/I18nProvider';
import { GraduationCap, Star } from 'lucide-react';
import { OVAIntro, OVAValerioBar } from '../shared';

import IntroScreen from './screens/IntroScreen';
import ModuleSlack from './screens/ModuleSlack';
import ModuleGoogle from './screens/ModuleGoogle';
import ModuleMakeZapier from './screens/ModuleMakeZapier';
import ActivityBuilder from './screens/ActivityBuilder';
import QuizScreen from './screens/QuizScreen';
import CertificateScreen from './screens/CertificateScreen';

const screens = [
  IntroScreen,
  ModuleSlack,
  ModuleGoogle,
  ModuleMakeZapier,
  ActivityBuilder,
  QuizScreen,
  CertificateScreen,
];

const totalXp = 1000;


OVABuildGPT.propTypes = {
  onComplete: PropTypes.func,
};

export default function OVABuildGPT({ onComplete }) {
  const { t, locale } = useTranslation();
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState('intro');
  const [currentScreen, setCurrentScreen] = useState(0);
  const [xp, setXp] = useState(0);

  const addXp = (amount) => {
    setXp(prev => Math.min(prev + amount, totalXp));
    import('../../../store/ialabStore').then(m => m.useIALabStore.getState().addXp(amount));
  };

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(prev => prev + 1);
  };

  const getValerioText = () => {
    const screenTexts = [
      '',
      t('ova.buildgpt.intro_text'),
      'Los GPTs personalizados. Tu GPT personalizado puede conectarse a Slack mediante Acciones.',
      'Al conectar tu GPT con Google Workspace mediante Acciones, puedes pedirle que redacte correos, analice documentos de Docs o extraiga conclusiones de Sheets.',
      'Las Acciones de GPT funcionan como un puente: defines una especificación OpenAPI y tu GPT puede llamar a servicios externos.',
      'Construye tu propio flujo de automatización seleccionando un disparador, una acción de IA y un destino.',
      t('ova.buildgpt.quiz_title'),
      t('ova.buildgpt.cert_desc'),
    ];
    return screenTexts[currentScreen] || '';
  };

  if (screen === 'intro') {
    const isES = locale === 'es';
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <OVAIntro
          icon="fa-robot"
          badge={isES ? 'OVA Interactivo' : 'Interactive OVA'}
          title={isES ? 'Crea tu Propio GPT Personalizado' : 'Build Your Own Custom GPT'}
          description={isES
            ? 'Aprende a crear, configurar y conectar GPTs personalizados con acciones, APIs y herramientas externas en un recorrido práctico y completo.'
            : 'Learn to create, configure and connect custom GPTs with actions, APIs and external tools in a practical, complete tour.'}
          audioText={isES
            ? 'Bienvenido al laboratorio de GPTs personalizados. Vamos a explorar cómo crear asistentes de IA a tu medida.'
            : 'Welcome to the custom GPT lab. Let us explore how to create AI assistants tailored to your needs.'}
          onStart={() => setScreen('slides')}
          startLabel={isES ? 'Comenzar Laboratorio' : 'Start Lab'}
        />
      </div>
    );
  }

  const ScreenComponent = screens[currentScreen];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white dark:from-slate-900 dark:to-slate-800 font-sans selection:bg-corporate selection:text-white">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 transform scale-75 origin-left sm:scale-100 transition-transform">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm text-white">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-corporate">Edu</span><span className="text-petroleum">techlife</span>
            </span>
          </div>
          {currentScreen < screens.length - 1 && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t('ova.buildgpt.step', { current: currentScreen + 1, total: screens.length })}
              </div>
              <div className="flex items-center gap-2 bg-cyan-50 dark:bg-slate-700/30 px-4 py-1.5 rounded-full border border-corporate/20">
                <Star className="text-yellow-500 fill-current" size={16} />
                <span className="font-bold text-petroleum">{xp} XP</span>
              </div>
            </div>
          )}
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-corporate to-petroleum transition-all duration-1000 ease-out"
            style={{ width: `${(xp / totalXp) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <ScreenComponent onNext={nextScreen} addXp={addXp} onMarkComplete={() => { certCompletedRef.current = true; onComplete?.(); }} {...(currentScreen === screens.length - 1 ? { xp, onReset: () => { setCurrentScreen(0); setXp(0); } } : {})} />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 mt-12 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>{t('ova.buildgpt.footer')}</p>
      </footer>

      <OVAValerioBar text={getValerioText()} />
    </div>
  );
}
