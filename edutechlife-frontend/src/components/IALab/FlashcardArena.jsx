import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

function calculateNextReview(quality, previousInterval = 1, previousEase = 2.5) {
  let newInterval, newEase;

  if (quality < 3) {
    newInterval = 1;
    newEase = previousEase;
  } else {
    if (previousInterval === 1) newInterval = 6;
    else if (previousInterval === 6) newInterval = 16;
    else newInterval = Math.round(previousInterval * previousEase);
    newEase = previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  }

  return { interval: newInterval, ease: Math.max(1.3, newEase) };
}

const MODULE_FLASHCARDS = {
  1: [
    { id: 'm1-f1', front: '¿Qué es un prompt?', back: 'Instrucción o entrada que se le da a un modelo de IA para generar una respuesta.' },
    { id: 'm1-f2', front: '¿Qué es fine-tuning?', back: 'Proceso de entrenar un modelo pre-entrenado con datos específicos para una tarea concreta.' },
    { id: 'm1-f3', front: '¿Qué es temperatura en un LLM?', back: 'Parámetro que controla la aleatoriedad de las respuestas. Valores bajos (0.1) = más determinista, altos (0.9) = más creativo.' },
    { id: 'm1-f4', front: '¿Qué es RAG?', back: 'Retrieval Augmented Generation — técnica que combina búsqueda en documentos con generación de texto.' },
  ],
  2: [
    { id: 'm2-f1', front: '¿Qué es ChatGPT?', back: 'Modelo de lenguaje desarrollado por OpenAI basado en la arquitectura GPT (Generative Pre-trained Transformer).' },
    { id: 'm2-f2', front: '¿Qué son los tokens?', back: 'Unidades en las que se divide un texto para ser procesado por un LLM. 1 token ≈ 0.75 palabras en inglés.' },
    { id: 'm2-f3', front: '¿Qué es el context window?', back: 'Cantidad máxima de tokens que un modelo puede procesar en una sola interacción (ej: 8K, 32K, 128K tokens).' },
    { id: 'm2-f4', front: '¿Qué es system prompt?', back: 'Instrucción inicial que define el comportamiento, rol y reglas del asistente IA durante toda la conversación.' },
  ],
  3: [
    { id: 'm3-f1', front: '¿Qué es Google Gemini?', back: 'Modelo multimodal de Google que puede procesar texto, imágenes, audio y video simultáneamente.' },
    { id: 'm3-f2', front: '¿Qué es chain-of-thought?', back: 'Técnica de prompting que guía al modelo a razonar paso a paso antes de dar una respuesta final.' },
    { id: 'm3-f3', front: '¿Qué es few-shot prompting?', back: 'Técnica que proporciona ejemplos de entrada-salida dentro del prompt para guiar al modelo.' },
    { id: 'm3-f4', front: '¿Qué es grounding?', back: 'Proceso de conectar las respuestas de IA a fuentes verificables para reducir alucinaciones.' },
  ],
  4: [
    { id: 'm4-f1', front: '¿Qué es un AI agent?', back: 'Sistema autónomo que percibe su entorno, toma decisiones y ejecuta acciones para lograr un objetivo específico.' },
    { id: 'm4-f2', front: '¿Qué son las tool calls?', back: 'Capacidad de un LLM para invocar funciones externas como APIs, bases de datos o ejecución de código.' },
    { id: 'm4-f3', front: '¿Qué es memory en agents?', back: 'Mecanismo que permite al agente recordar información a través de sesiones usando vectores o bases de datos.' },
    { id: 'm4-f4', front: '¿Qué es multi-agent system?', back: 'Arquitectura donde múltiples agentes IA colaboran, cada uno especializado en una tarea específica.' },
  ],
  5: [
    { id: 'm5-f1', front: '¿Qué es IA responsable?', back: 'Enfoque de desarrollo de IA que prioriza la equidad, transparencia, privacidad y rendición de cuentas.' },
    { id: 'm5-f2', front: '¿Qué es bias en IA?', back: 'Sesgos sistemáticos en los resultados de un modelo debido a datos de entrenamiento desbalanceados o etiquetado incorrecto.' },
    { id: 'm5-f3', front: '¿Qué es privacidad diferencial?', back: 'Técnica que añade ruido controlado a los datos para proteger la información individual mientras se mantiene la utilidad estadística.' },
    { id: 'm5-f4', front: '¿Qué es IA explicable?', back: 'Rama de IA que busca hacer interpretables las decisiones de los modelos, proporcionando razones comprensibles para humanos.' },
  ],
};

const STORAGE_KEY = 'ialab-flashcards';

const loadCards = (moduleId) => {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}-${moduleId}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  const base = MODULE_FLASHCARDS[moduleId] || MODULE_FLASHCARDS[1];
  return base.map(c => ({ ...c, interval: 1, ease: 2.5, nextReview: 0 }));
};

const saveCards = (moduleId, cards) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}-${moduleId}`, JSON.stringify(cards));
  } catch {}
};

export function FlashcardArena({ moduleId }) {
  const [cards, setCards] = useState(() => loadCards(moduleId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const now = Date.now();
  const dueCards = cards.filter(c => c.nextReview <= now);
  const currentCard = dueCards[currentIndex] || cards[currentIndex];
  const studied = cards.filter(c => c.interval > 1).length;

  const handleRate = useCallback((quality) => {
    if (!currentCard) return;

    const { interval, ease } = calculateNextReview(
      quality, currentCard.interval, currentCard.ease
    );
    const nextReview = now + interval * 86400000;

    setCards(prev => {
      const updated = prev.map(c =>
        c.id === currentCard.id
          ? { ...c, interval, ease, nextReview: nextReview + Math.random() * 3600000 }
          : c
      );
      return updated;
    });

    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % dueCards.length);

    setTimeout(() => {
      setCards(prev => {
        const updated = prev.map(c =>
          c.id === currentCard.id
            ? { ...c, interval, ease, nextReview: nextReview + Math.random() * 3600000 }
            : c
        );
        saveCards(moduleId, updated);
        return updated;
      });
    }, 100);
  }, [currentCard, cards, moduleId, dueCards.length, now]);

  const resetCards = useCallback(() => {
    const base = MODULE_FLASHCARDS[moduleId] || MODULE_FLASHCARDS[1];
    const fresh = base.map(c => ({ ...c, interval: 1, ease: 2.5, nextReview: 0 }));
    setCards(fresh);
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
    saveCards(moduleId, fresh);
  }, [moduleId]);

  const stats = { total: cards.length, due: dueCards.length, studied };

  if (dueCards.length === 0 && studied > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <Icon name="fa-check" className="text-emerald-500 text-3xl" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">¡Todo al día!</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">No hay flashcards para repasar ahora. Vuelve más tarde.</p>
        <button
          onClick={resetCards}
          className="px-4 py-2 rounded-xl bg-petroleum/10 text-petroleum text-sm font-semibold hover:bg-petroleum/20 transition-colors"
        >
          <Icon name="fa-rotate" className="mr-2" aria-hidden="true" />
          Reiniciar todas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4" role="status" aria-live="polite">
        <span className="flex items-center gap-1.5">
          <Icon name="fa-layer-group" className="text-corporate" aria-hidden="true" />
          {stats.total} tarjetas
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="fa-clock" className="text-amber-500" aria-hidden="true" />
          {stats.due} para repasar
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="fa-check-circle" className="text-emerald-500" aria-hidden="true" />
          {stats.studied} estudiadas
        </span>
      </div>

      <div
        className="ialab-perspective h-64 cursor-pointer"
        onClick={() => setIsFlipped(v => !v)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard?.id}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="relative w-full h-full ialab-preserve-3d"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Respuesta de la tarjeta' : 'Pregunta de la tarjeta. Presione Enter para ver la respuesta.'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(v => !v); } }}
          >
            <div className={`absolute inset-0 bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden ${isFlipped ? '' : ''}`}>
              <p className="text-lg font-medium text-slate-800 text-center leading-relaxed">{currentCard?.front}</p>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br from-petroleum/5 to-corporate/5 border-2 border-corporate/30 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden ialab-rotate-y-180 ${isFlipped ? '' : ''}`}>
              <p className="text-base text-slate-700 text-center leading-relaxed">{currentCard?.back}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <div className="flex justify-center gap-3 mt-6">
          {[
            { label: 'Difícil', quality: 1, className: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
            { label: 'Regular', quality: 3, className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
            { label: 'Fácil', quality: 5, className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
          ].map((btn) => (
            <button
              key={btn.quality}
              onClick={(e) => { e.stopPropagation(); handleRate(btn.quality); }}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${btn.className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-4">
        Haz clic en la tarjeta para ver la respuesta
      </p>

      <div className="flex justify-center mt-4">
        <button
          onClick={resetCards}
          className="text-xs text-slate-400 hover:text-petroleum transition-colors flex items-center gap-1"
        >
          <Icon name="fa-rotate" aria-hidden="true" />
          Reiniciar progreso
        </button>
      </div>
    </div>
  );
}

export default FlashcardArena;
