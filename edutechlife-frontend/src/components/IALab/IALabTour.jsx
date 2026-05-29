import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const getSteps = (t) => [
  {
    target: 'tour-sidebar',
    title: t('ialab.tour.step_0_title'),
    description: t('ialab.tour.step_0_desc'),
  },
  {
    target: 'tour-tabs',
    title: t('ialab.tour.step_1_title'),
    description: t('ialab.tour.step_1_desc'),
  },
  {
    target: 'tour-ruta',
    title: t('ialab.tour.step_2_title'),
    description: t('ialab.tour.step_2_desc'),
  },
  {
    target: 'tour-objetivos',
    title: t('ialab.tour.step_3_title'),
    description: t('ialab.tour.step_3_desc'),
  },
  {
    target: 'tour-temas',
    title: t('ialab.tour.step_4_title'),
    description: t('ialab.tour.step_4_desc'),
  },
  {
    target: 'tour-actividades',
    title: t('ialab.tour.step_5_title'),
    description: t('ialab.tour.step_5_desc'),
  },
  {
    target: 'tour-notificaciones',
    title: t('ialab.tour.step_6_title'),
    description: t('ialab.tour.step_6_desc'),
  },
  {
    target: ['tour-undermenu-mobile', 'tour-undermenu-desktop'],
    title: t('ialab.tour.step_7_title'),
    description: t('ialab.tour.step_7_desc'),
  },
  {
    target: 'tour-valerio',
    title: t('ialab.tour.step_8_title'),
    description: t('ialab.tour.step_8_desc'),
  },
  {
    target: 'tour-herramientas',
    title: t('ialab.tour.step_9_title'),
    description: t('ialab.tour.step_9_desc'),
  },
];

const TOUR_KEY = 'ialab_tour_completed';
const INITIAL_DELAY = 1500;
const RETRY_INTERVAL = 300;
const MAX_RETRIES = 10;

const IALabTour = ({ hasStartedCourse }) => {
  const { t } = useTranslation();
  const STEPS = useMemo(() => getSteps(t), [t]);
  const [step, setStep] = useState(-1);
  const [targetRect, setTargetRect] = useState(null);
  const [ready, setReady] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(null);
  const retryCount = useRef(0);
  const resizeObserverRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const getTargetSelectors = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= STEPS.length) return null;
    const t = STEPS[stepIndex].target;
    return Array.isArray(t) ? t : [t];
  }, []);

  const findTarget = useCallback((stepIndex) => {
    const selectors = getTargetSelectors(stepIndex);
    if (!selectors) return null;
    for (const sel of selectors) {
      const el = document.querySelector(`[data-tour="${sel}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { el, rect };
        }
      }
    }
    return null;
  }, [getTargetSelectors]);

  const scrollToTarget = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= STEPS.length) return;
    const result = findTarget(stepIndex);
    if (!result) return;
    result.el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [findTarget]);

  const measureTarget = useCallback(() => {
    if (step < 0 || step >= STEPS.length) return null;
    const result = findTarget(step);
    if (!result) return null;
    return { rect: result.rect, el: result.el };
  }, [step, findTarget]);

  const updatePosition = useCallback(() => {
    const result = measureTarget();
    if (!result) return;
    const { rect } = result;

    setTargetRect(rect);

    const tooltipWidth = 288;
    const gap = 12;
    let top = rect.bottom + gap;
    let left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16));

    const wouldOverflow = top + 200 > window.innerHeight;
    if (wouldOverflow) {
      top = rect.top - gap - 160;
    }

    setTooltipPos({ top, left });
  }, [measureTarget]);

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY);
    if (done || hasStartedCourse) return;

    const timer = setTimeout(() => {
      retryCount.current = 0;
      const attempt = () => {
        const result = findTarget(0);
        if (result && result.rect.width > 0) {
          const scrollContainer = result.el.closest('.overflow-y-auto') || window;
          scrollContainerRef.current = scrollContainer;
          setReady(true);
        } else if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          setTimeout(attempt, RETRY_INTERVAL);
        }
      };
      scrollToTarget(0);
      setStep(0);
      attempt();
    }, INITIAL_DELAY);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) {
      setReady(false);
      setTargetRect(null);
      setTooltipPos(null);
      return;
    }

    setReady(false);
    setTargetRect(null);
    setTooltipPos(null);

    scrollToTarget(step);

    const timer = setTimeout(() => {
      updatePosition();
      setReady(true);
    }, 500);

    return () => clearTimeout(timer);
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
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(TOUR_KEY, 'true');
      setStep(-1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setStep(-1);
  };

  if (!ready || step < 0 || step >= STEPS.length) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] cursor-pointer"
        onClick={handleSkip}
      />

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

      <div
        className="fixed z-[70] w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4"
        aria-live="polite" aria-label={t('ialab.tour.aria_label', { step: step + 1, total: STEPS.length })}
        style={tooltipPos ? { top: tooltipPos.top, left: tooltipPos.left } : {}}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-corporate uppercase tracking-wider">
            {t('ialab.tour.step_label', { step: step + 1, total: STEPS.length })}
          </span>
          <button
            onClick={handleSkip}
            className="text-xs text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {t('ialab.tour.skip')}
          </button>
        </div>
        <h4 className="text-sm font-bold text-petroleum mb-1">{current.title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{current.description}</p>
        <button
          onClick={handleNext}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {isLast ? t('ialab.tour.start') : t('ialab.tour.next')}
          {!isLast && <Icon name="fa-arrow-right" className="text-[10px]" />}
        </button>
      </div>
    </>
  );
};

export default IALabTour;
