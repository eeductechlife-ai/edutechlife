import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const MODULE_FLASHCARDS = {
  1: [
    { id: 'm1-f1', front: '¿Qué es un prompt?', back: 'Instrucción o entrada que se le da a un modelo de IA para generar una respuesta.' },
    { id: 'm1-f2', front: '¿Qué es fine-tuning?', back: 'Entrenar un modelo pre-entrenado con datos específicos para una tarea concreta.' },
    { id: 'm1-f3', front: '¿Qué es temperatura en un LLM?', back: 'Controla la aleatoriedad: baja = preciso, alta = creativo.' },
    { id: 'm1-f4', front: '¿Qué es RAG?', back: 'Técnica que combina búsqueda en documentos con generación de texto.' },
    { id: 'm1-f5', front: '¿Qué es un LLM?', back: 'Modelo de lenguaje entrenado con enormes cantidades de texto para comprender y generar lenguaje humano.' },
    { id: 'm1-f6', front: '¿Qué es pre-entrenamiento?', back: 'Fase donde el modelo aprende patrones del lenguaje desde datos masivos no etiquetados.' },
    { id: 'm1-f7', front: '¿Qué son los parámetros?', back: 'Valores numéricos que el modelo ajusta al aprender. Más parámetros = mayor capacidad.' },
  ],
  2: [
    { id: 'm2-f1', front: '¿Qué es ChatGPT?', back: 'Modelo de lenguaje de OpenAI basado en la arquitectura GPT.' },
    { id: 'm2-f2', front: '¿Qué son los tokens?', back: 'Unidades en que se divide un texto para procesarlo. 1 token ≈ 0.75 palabras.' },
    { id: 'm2-f3', front: '¿Qué es el context window?', back: 'Máximo de tokens que un modelo procesa en una interacción (ej: 8K, 32K, 128K).' },
    { id: 'm2-f4', front: '¿Qué es system prompt?', back: 'Instrucción inicial que define el rol y reglas del asistente durante toda la conversación.' },
    { id: 'm2-f5', front: '¿Qué es GPT?', back: 'Generative Pre-trained Transformer: arquitectura que usa transformers para texto coherente.' },
    { id: 'm2-f6', front: '¿Qué es RLHF?', back: 'Técnica que usa feedback humano para alinear las respuestas con preferencias humanas.' },
    { id: 'm2-f7', front: '¿Qué son embeddings?', back: 'Representaciones numéricas que capturan el significado semántico de las palabras.' },
  ],
  3: [
    { id: 'm3-f1', front: '¿Qué es Google Gemini?', back: 'Modelo multimodal de Google que procesa texto, imágenes, audio y video.' },
    { id: 'm3-f2', front: '¿Qué es chain-of-thought?', back: 'Técnica que guía al modelo a razonar paso a paso antes de responder.' },
    { id: 'm3-f3', front: '¿Qué es few-shot prompting?', back: 'Proporciona ejemplos entrada-salida en el prompt para guiar al modelo.' },
    { id: 'm3-f4', front: '¿Qué es grounding?', back: 'Conectar respuestas de IA a fuentes verificables para reducir alucinaciones.' },
    { id: 'm3-f5', front: '¿Qué es multimodal?', back: 'Capacidad de procesar texto, imágenes, audio y video simultáneamente.' },
    { id: 'm3-f6', front: '¿Qué es zero-shot prompting?', back: 'El modelo realiza una tarea sin ejemplos previos, solo con la instrucción.' },
    { id: 'm3-f7', front: 'Temperature en Gemini', back: 'Controla creatividad de respuestas: baja = precisa, alta = creativa.' },
  ],
  4: [
    { id: 'm4-f1', front: '¿Qué es un AI agent?', back: 'Sistema autónomo que percibe, decide y ejecuta acciones para lograr un objetivo.' },
    { id: 'm4-f2', front: '¿Qué son las tool calls?', back: 'Capacidad del LLM de invocar APIs, bases de datos o ejecutar código.' },
    { id: 'm4-f3', front: '¿Qué es memory en agents?', back: 'Mecanismo para recordar información entre sesiones usando vectores o bases de datos.' },
    { id: 'm4-f4', front: '¿Qué es multi-agent system?', back: 'Múltiples agentes IA colaboran, cada uno especializado en una tarea.' },
    { id: 'm4-f5', front: '¿Qué es planning?', back: 'Descomponer un objetivo complejo en pasos más pequeños y ejecutables.' },
    { id: 'm4-f6', front: '¿Qué es reasoning?', back: 'Analizar información, evaluar opciones y decidir el mejor curso de acción.' },
    { id: 'm4-f7', front: '¿Qué es autonomía?', back: 'Nivel de independencia del agente para operar sin intervención humana directa.' },
  ],
  5: [
    { id: 'm5-f1', front: '¿Qué es IA responsable?', back: 'Desarrollo de IA priorizando equidad, transparencia, privacidad y rendición de cuentas.' },
    { id: 'm5-f2', front: '¿Qué es bias en IA?', back: 'Sesgos por datos desbalanceados o etiquetado incorrecto en el entrenamiento.' },
    { id: 'm5-f3', front: '¿Qué es privacidad diferencial?', back: 'Añade ruido controlado a los datos para proteger información individual.' },
    { id: 'm5-f4', front: '¿Qué es IA explicable?', back: 'Rama que hace interpretables las decisiones de los modelos para humanos.' },
    { id: 'm5-f5', front: '¿Qué es equidad en IA?', back: 'Principio de no discriminar por raza, género, edad u otras características.' },
    { id: 'm5-f6', front: '¿Qué es transparencia?', back: 'Hacer visible cómo funciona un modelo, qué datos usa y cómo decide.' },
    { id: 'm5-f7', front: '¿Qué son sesgos algorítmicos?', back: 'Errores sistemáticos causados por datos incompletos o prejuicios históricos.' },
  ],
};

export function FlashcardArena({ moduleId }) {
  const cards = MODULE_FLASHCARDS[moduleId] || MODULE_FLASHCARDS[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [allReviewed, setAllReviewed] = useState(false);

  const currentCard = cards[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex >= cards.length - 1) {
      setAllReviewed(true);
      return;
    }
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, cards.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  const resetCards = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
    setAllReviewed(false);
  }, []);

  if (allReviewed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-petroleum/10 flex items-center justify-center mb-4">
          <Icon name="fa-check" className="text-petroleum text-3xl" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-petroleum">¡Dominas los conceptos!</h3>
        <p className="text-sm text-petroleum/70 mt-1 mb-4">Completaste las 7 cápsulas de este módulo.</p>
        <button
          onClick={resetCards}
          className="px-4 py-2 rounded-xl bg-petroleum/10 text-petroleum text-sm font-semibold hover:bg-petroleum/20 transition-colors"
        >
          <Icon name="fa-rotate" className="mr-2" aria-hidden="true" />
          Repetir todas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between text-sm text-petroleum/70 mb-4" role="status" aria-live="polite">
        <span className="flex items-center gap-1.5">
          <Icon name="fa-layer-group" className="text-corporate" aria-hidden="true" />
          {currentIndex + 1} de {cards.length} cápsulas
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="fa-clock" className="text-petroleum" aria-hidden="true" />
          {cards.length - currentIndex - 1} restantes
        </span>
      </div>

      <div
        className="ialab-perspective h-64 cursor-pointer"
        onClick={() => setIsFlipped(v => !v)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard.id}
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
            className="relative w-full h-full"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Respuesta de la cápsula' : 'Pregunta de la cápsula. Presione Enter para ver la respuesta.'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(v => !v); } }}
          >
            <div
              className="relative w-full h-full ialab-preserve-3d"
              style={{
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 400ms ease-in-out'
              }}
            >
              <div className="absolute inset-0 bg-white border-2 border-petroleum/15 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden">
                <p className="text-lg font-medium text-petroleum text-center leading-relaxed">{currentCard.front}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-petroleum/10 to-corporate/10 border-2 border-corporate/40 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden ialab-rotate-y-180">
                <p className="text-base text-petroleum text-center leading-relaxed">{currentCard.back}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-petroleum/20 text-petroleum text-sm font-semibold hover:bg-petroleum/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="fa-arrow-left" className="text-xs" aria-hidden="true" />
            Anterior
          </button>
          <button
            onClick={goToNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-petroleum text-white text-sm font-semibold hover:bg-petroleum-dark transition-all"
          >
            Siguiente
            <Icon name="fa-arrow-right" className="text-xs" aria-hidden="true" />
          </button>
        </div>
      )}

      <p className="text-center text-xs text-petroleum/50 mt-4">
        Haz clic en la cápsula para ver el concepto
      </p>

      <div className="flex justify-center mt-4">
        <button
          onClick={resetCards}
          className="text-xs text-petroleum/50 hover:text-petroleum transition-colors flex items-center gap-1"
        >
          <Icon name="fa-rotate" aria-hidden="true" />
          Volver a empezar
        </button>
      </div>
    </div>
  );
}

export default FlashcardArena;
