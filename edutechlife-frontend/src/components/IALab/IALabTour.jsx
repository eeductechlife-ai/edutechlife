import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const STEPS = [
  {
    target: 'tour-ruta',
    title: 'Tu ruta de hoy',
    description: 'Aquí encontrarás la próxima acción recomendada para avanzar en tu módulo. Sigue la ruta y no te detengas.',
  },
  {
    target: 'tour-temas',
    title: 'Temas del módulo',
    description: 'Cada tema contiene recursos multimedia. Expande un tema y completa todos los recursos para avanzar.',
  },
  {
    target: 'tour-actividades',
    title: 'Actividades del módulo',
    description: 'Completa las 3 actividades (Comunidad, Desafío, Examen) para aprobar el módulo con 80% o más.',
  },
];

const TOUR_KEY = 'ialab_tour_completed';
const INITIAL_DELAY = 1500;
const RETRY_INTERVAL = 300;
const MAX_RETRIES = 5;

const IALabTour = () => {
  const [step, setStep] = useState(-1);
  const [targetRect, setTargetRect] = useState(null);
  const [ready, setReady] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(null);
  const retryCount = useRef(0);
  const resizeObserverRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const measureTarget = useCallback(() => {
    if (step < 0 || step >= STEPS.length) return;
    const el = document.querySelector(`[data-tour="${STEPS[step].target}"]`);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return { rect, el };
  }, [step]);

  const updatePosition = useCallback(() => {
    const result = measureTarget();
    if (!result) return;
    const { rect, el: _el } = result;

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
    if (done) return;

    const timer = setTimeout(() => {
      retryCount.current = 0;
      const attempt = () => {
        const result = measureTarget();
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

    const timer = setTimeout(() => {
      updatePosition();
      setReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [step, updatePosition]);

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

    const el = document.querySelector(`[data-tour="${STEPS[step].target}"]`);
    if (el) {
      resizeObserverRef.current = new ResizeObserver(() => updatePosition());
      resizeObserverRef.current.observe(el);
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
  }, [ready, step, updatePosition]);

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
        aria-live="polite" aria-label={`Tour: paso ${step + 1} de ${STEPS.length}`}
        style={tooltipPos ? { top: tooltipPos.top, left: tooltipPos.left } : {}}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-corporate uppercase tracking-wider">
            {step + 1} de {STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Saltar
          </button>
        </div>
        <h4 className="text-sm font-bold text-petroleum dark:text-[#4DA8C4] mb-1">{current.title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{current.description}</p>
        <button
          onClick={handleNext}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {isLast ? '¡Comenzar!' : 'Siguiente'}
          {!isLast && <Icon name="fa-arrow-right" className="text-[10px]" />}
        </button>
      </div>
    </>
  );
};

export default IALabTour;
