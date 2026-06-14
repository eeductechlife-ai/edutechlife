import { useState, useEffect, useRef, useCallback } from 'react'
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const TOUR_KEY = 'ialab_dashboard_tour_completed';
const RETRY_INTERVAL = 300;
const MAX_RETRIES = 10;

const STEPS_CONFIG = [
  { key: 'welcome' },
  { target: 'dashboard-stats', key: 'stats' },
  { target: 'dashboard-tabs', key: 'tabs' },
  { target: 'dashboard-modules', key: 'modules' },
  { target: 'dashboard-continue', key: 'continue' },
];

export default function DashboardTour({ onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(-1);
  const [targetRect, setTargetRect] = useState(null);
  const [ready, setReady] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(null);
  const retryCount = useRef(0);
  const resizeObserverRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const findTarget = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= STEPS_CONFIG.length) return null;
    const target = STEPS_CONFIG[stepIndex].target;
    if (!target) return null;
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return { el, rect };
    return null;
  }, []);

  const scrollToTarget = useCallback((stepIndex) => {
    const result = findTarget(stepIndex);
    if (!result) return;
    result.el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [findTarget]);

  const updatePosition = useCallback(() => {
    if (step < 0 || step >= STEPS_CONFIG.length) return;
    const result = findTarget(step);
    if (!result) {
      setTargetRect(null);
      setTooltipPos(null);
      return;
    }
    const { rect } = result;
    setTargetRect(rect);
    const tooltipWidth = 288;
    const gap = 12;
    let top = rect.bottom + gap;
    let left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16));
    const wouldOverflow = top + 200 > window.innerHeight;
    if (wouldOverflow) top = rect.top - gap - 160;
    setTooltipPos({ top, left });
  }, [step, findTarget]);

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY);
    if (done) return;

    retryCount.current = 0;
    const attempt = () => {
      const result = findTarget(1);
      if (result && result.rect.width > 0) {
        const scrollContainer = result.el.closest('.overflow-y-auto') || window;
        scrollContainerRef.current = scrollContainer;
        setReady(true);
      } else if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        setTimeout(attempt, RETRY_INTERVAL);
      }
    };
    setStep(0);
    setReady(true);
    attempt();

    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step < 0 || step >= STEPS_CONFIG.length) {
      setReady(false);
      setTargetRect(null);
      setTooltipPos(null);
      return;
    }
    if (STEPS_CONFIG[step].target) {
      setReady(false);
      setTargetRect(null);
      setTooltipPos(null);
      scrollToTarget(step);

      const timer = setTimeout(() => {
        updatePosition();
        setReady(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setTargetRect(null);
      setTooltipPos(null);
      setReady(true);
    }
  }, [step, updatePosition, scrollToTarget]);

  useEffect(() => {
    if (!ready || step < 0) return;

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    const container = scrollContainerRef.current;
    if (container && container.addEventListener) {
      container.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const result = findTarget(step);
    if (result) {
      resizeObserverRef.current = new ResizeObserver(() => updatePosition());
      resizeObserverRef.current.observe(result.el);
    }

    return () => {
      if (container && container.removeEventListener) {
        container.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [ready, step, updatePosition, findTarget]);

  const handleNext = () => {
    if (step < STEPS_CONFIG.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(TOUR_KEY, 'true');
      setStep(-1);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setStep(-1);
    onComplete?.();
  };

  if (!ready || step < 0 || step >= STEPS_CONFIG.length) return null;

  const current = STEPS_CONFIG[step];
  const isLast = step === STEPS_CONFIG.length - 1;
  const isWelcome = !current.target;

  const totalSteps = STEPS_CONFIG.length;
  const displayStep = step + 1;

  return (
    <>
      <div className="fixed inset-0 z-[60] cursor-pointer" onClick={handleSkip} />

      {targetRect && (
        <div
          className="fixed z-[61] pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 3,
            left: targetRect.left - 3,
            width: targetRect.width + 6,
            height: targetRect.height + 6,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            borderRadius: '10px',
          }}
        />
      )}

      {!targetRect && (
        <div className="fixed inset-0 z-[61] bg-black/35" />
      )}

      <div
        className={`fixed z-[70] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 ${
          isWelcome ? 'w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6' : 'w-72 p-4'
        }`}
        aria-live="polite"
        aria-label={t('ialab.dashboard_tour.aria_label', { step: displayStep, total: totalSteps })}
        style={!isWelcome && tooltipPos ? { top: tooltipPos.top, left: tooltipPos.left } : {}}
      >
        {isWelcome ? (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center mb-3">
                <Icon name="fa-compass" className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-corporate uppercase tracking-wider mb-1">
                {t('ialab.dashboard_tour.step_label', { step: displayStep, total: totalSteps })}
              </span>
              <h3 className="text-base font-bold text-petroleum mb-2">{t('ialab.dashboard_tour.welcome_title')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">{t('ialab.dashboard_tour.welcome_desc')}</p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {t('ialab.dashboard_tour.next')}
                <Icon name="fa-arrow-right" className="text-[10px]" />
              </button>
              <button onClick={handleSkip} className="mt-3 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
                {t('ialab.dashboard_tour.skip')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-corporate uppercase tracking-wider">
                {t('ialab.dashboard_tour.step_label', { step: displayStep, total: totalSteps })}
              </span>
              <button onClick={handleSkip} className="text-xs text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {t('ialab.dashboard_tour.skip')}
              </button>
            </div>
            <h4 className="text-sm font-bold text-petroleum mb-1">{t(`ialab.dashboard_tour.${current.key}_title`)}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{t(`ialab.dashboard_tour.${current.key}_desc`)}</p>
            <button
              onClick={handleNext}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              {isLast ? t('ialab.dashboard_tour.start') : t('ialab.dashboard_tour.next')}
              {!isLast && <Icon name="fa-arrow-right" className="text-[10px]" />}
            </button>
          </>
        )}
      </div>
    </>
  );
}
