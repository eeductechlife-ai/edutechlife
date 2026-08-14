import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useSM2Flashcard } from "../../hooks/IALab/useSM2Flashcard";
import { useIALabStore } from "../../store/ialabStore";

const MODULE_FLASHCARDS_ES = {
  1: [
    {
      id: "m1-f1",
      front: "¿Qué es un prompt?",
      back: "Instrucción o entrada que se le da a un modelo de IA para generar una respuesta.",
    },
    {
      id: "m1-f2",
      front: "¿Qué es fine-tuning?",
      back: "Entrenar un modelo pre-entrenado con datos específicos para una tarea concreta.",
    },
    {
      id: "m1-f3",
      front: "¿Qué es temperatura en un LLM?",
      back: "Controla la aleatoriedad: baja = preciso, alta = creativo.",
    },
    {
      id: "m1-f4",
      front: "¿Qué es RAG?",
      back: "Técnica que combina búsqueda en documentos con generación de texto.",
    },
    {
      id: "m1-f5",
      front: "¿Qué es un LLM?",
      back: "Modelo de lenguaje entrenado con enormes cantidades de texto para comprender y generar lenguaje humano.",
    },
    {
      id: "m1-f6",
      front: "¿Qué es pre-entrenamiento?",
      back: "Fase donde el modelo aprende patrones del lenguaje desde datos masivos no etiquetados.",
    },
    {
      id: "m1-f7",
      front: "¿Qué son los parámetros?",
      back: "Valores numéricos que el modelo ajusta al aprender. Más parámetros = mayor capacidad.",
    },
  ],
  2: [
    {
      id: "m2-f1",
      front: "¿Qué es ChatGPT?",
      back: "Modelo de lenguaje de OpenAI basado en la arquitectura GPT.",
    },
    {
      id: "m2-f2",
      front: "¿Qué son los tokens?",
      back: "Unidades en que se divide un texto para procesarlo. 1 token ≈ 0.75 palabras.",
    },
    {
      id: "m2-f3",
      front: "¿Qué es el context window?",
      back: "Máximo de tokens que un modelo procesa en una interacción (ej: 8K, 32K, 128K).",
    },
    {
      id: "m2-f4",
      front: "¿Qué es system prompt?",
      back: "Instrucción inicial que define el rol y reglas del asistente durante toda la conversación.",
    },
    {
      id: "m2-f5",
      front: "¿Qué es GPT?",
      back: "Generative Pre-trained Transformer: arquitectura que usa transformers para texto coherente.",
    },
    {
      id: "m2-f6",
      front: "¿Qué es RLHF?",
      back: "Técnica que usa feedback humano para alinear las respuestas con preferencias humanas.",
    },
    {
      id: "m2-f7",
      front: "¿Qué son embeddings?",
      back: "Representaciones numéricas que capturan el significado semántico de las palabras.",
    },
  ],
  3: [
    {
      id: "m3-f1",
      front: "¿Qué es Google Gemini?",
      back: "Modelo multimodal de Google que procesa texto, imágenes, audio y video.",
    },
    {
      id: "m3-f2",
      front: "¿Qué es chain-of-thought?",
      back: "Técnica que guía al modelo a razonar paso a paso antes de responder.",
    },
    {
      id: "m3-f3",
      front: "¿Qué es few-shot prompting?",
      back: "Proporciona ejemplos entrada-salida en el prompt para guiar al modelo.",
    },
    {
      id: "m3-f4",
      front: "¿Qué es grounding?",
      back: "Conectar respuestas de IA a fuentes verificables para reducir alucinaciones.",
    },
    {
      id: "m3-f5",
      front: "¿Qué es multimodal?",
      back: "Capacidad de procesar texto, imágenes, audio y video simultáneamente.",
    },
    {
      id: "m3-f6",
      front: "¿Qué es zero-shot prompting?",
      back: "El modelo realiza una tarea sin ejemplos previos, solo con la instrucción.",
    },
    {
      id: "m3-f7",
      front: "Temperature en Gemini",
      back: "Controla creatividad de respuestas: baja = precisa, alta = creativa.",
    },
  ],
  4: [
    {
      id: "m4-f1",
      front: "¿Qué es un AI agent?",
      back: "Sistema autónomo que percibe, decide y ejecuta acciones para lograr un objetivo.",
    },
    {
      id: "m4-f2",
      front: "¿Qué son las tool calls?",
      back: "Capacidad del LLM de invocar APIs, bases de datos o ejecutar código.",
    },
    {
      id: "m4-f3",
      front: "¿Qué es memory en agents?",
      back: "Mecanismo para recordar información entre sesiones usando vectores o bases de datos.",
    },
    {
      id: "m4-f4",
      front: "¿Qué es multi-agent system?",
      back: "Múltiples agentes IA colaboran, cada uno especializado en una tarea.",
    },
    {
      id: "m4-f5",
      front: "¿Qué es planning?",
      back: "Descomponer un objetivo complejo en pasos más pequeños y ejecutables.",
    },
    {
      id: "m4-f6",
      front: "¿Qué es reasoning?",
      back: "Analizar información, evaluar opciones y decidir el mejor curso de acción.",
    },
    {
      id: "m4-f7",
      front: "¿Qué es autonomía?",
      back: "Nivel de independencia del agente para operar sin intervención humana directa.",
    },
  ],
  5: [
    {
      id: "m5-f1",
      front: "¿Qué es IA responsable?",
      back: "Desarrollo de IA priorizando equidad, transparencia, privacidad y rendición de cuentas.",
    },
    {
      id: "m5-f2",
      front: "¿Qué es bias en IA?",
      back: "Sesgos por datos desbalanceados o etiquetado incorrecto en el entrenamiento.",
    },
    {
      id: "m5-f3",
      front: "¿Qué es privacidad diferencial?",
      back: "Añade ruido controlado a los datos para proteger información individual.",
    },
    {
      id: "m5-f4",
      front: "¿Qué es IA explicable?",
      back: "Rama que hace interpretables las decisiones de los modelos para humanos.",
    },
    {
      id: "m5-f5",
      front: "¿Qué es equidad en IA?",
      back: "Principio de no discriminar por raza, género, edad u otras características.",
    },
    {
      id: "m5-f6",
      front: "¿Qué es transparencia?",
      back: "Hacer visible cómo funciona un modelo, qué datos usa y cómo decide.",
    },
    {
      id: "m5-f7",
      front: "¿Qué son sesgos algorítmicos?",
      back: "Errores sistemáticos causados por datos incompletos o prejuicios históricos.",
    },
  ],
};

const MODULE_FLASHCARDS_EN = {
  1: [
    {
      id: "m1-f1",
      front: "What is a prompt?",
      back: "Instruction or input given to an AI model to generate a response.",
    },
    {
      id: "m1-f2",
      front: "What is fine-tuning?",
      back: "Training a pre-trained model with specific data for a concrete task.",
    },
    {
      id: "m1-f3",
      front: "What is temperature in an LLM?",
      back: "Controls randomness: low = precise, high = creative.",
    },
    {
      id: "m1-f4",
      front: "What is RAG?",
      back: "Technique that combines document search with text generation.",
    },
    {
      id: "m1-f5",
      front: "What is an LLM?",
      back: "Language model trained on vast amounts of text to understand and generate human language.",
    },
    {
      id: "m1-f6",
      front: "What is pre-training?",
      back: "Phase where the model learns language patterns from massive unlabeled data.",
    },
    {
      id: "m1-f7",
      front: "What are parameters?",
      back: "Numerical values the model adjusts while learning. More parameters = greater capacity.",
    },
  ],
  2: [
    {
      id: "m2-f1",
      front: "What is ChatGPT?",
      back: "OpenAI's language model based on the GPT architecture.",
    },
    {
      id: "m2-f2",
      front: "What are tokens?",
      back: "Units into which text is divided for processing. 1 token ≈ 0.75 words.",
    },
    {
      id: "m2-f3",
      front: "What is a context window?",
      back: "Maximum tokens a model processes in one interaction (e.g., 8K, 32K, 128K).",
    },
    {
      id: "m2-f4",
      front: "What is a system prompt?",
      back: "Initial instruction defining the assistant role and rules throughout the conversation.",
    },
    {
      id: "m2-f5",
      front: "What is GPT?",
      back: "Generative Pre-trained Transformer: architecture using transformers for coherent text.",
    },
    {
      id: "m2-f6",
      front: "What is RLHF?",
      back: "Technique using human feedback to align responses with human preferences.",
    },
    {
      id: "m2-f7",
      front: "What are embeddings?",
      back: "Numerical representations capturing the semantic meaning of words.",
    },
  ],
  3: [
    {
      id: "m3-f1",
      front: "What is Google Gemini?",
      back: "Google's multimodal model processing text, images, audio, and video.",
    },
    {
      id: "m3-f2",
      front: "What is chain-of-thought?",
      back: "Technique that guides the model to reason step by step before responding.",
    },
    {
      id: "m3-f3",
      front: "What is few-shot prompting?",
      back: "Providing input-output examples in the prompt to guide the model.",
    },
    {
      id: "m3-f4",
      front: "What is grounding?",
      back: "Connecting AI responses to verifiable sources to reduce hallucinations.",
    },
    {
      id: "m3-f5",
      front: "What is multimodal?",
      back: "Ability to process text, images, audio, and video simultaneously.",
    },
    {
      id: "m3-f6",
      front: "What is zero-shot prompting?",
      back: "The model performs a task without prior examples, using only the instruction.",
    },
    {
      id: "m3-f7",
      front: "Temperature in Gemini",
      back: "Controls response creativity: low = precise, high = creative.",
    },
  ],
  4: [
    {
      id: "m4-f1",
      front: "What is an AI agent?",
      back: "Autonomous system that perceives, decides, and executes actions to achieve a goal.",
    },
    {
      id: "m4-f2",
      front: "What are tool calls?",
      back: "LLM's ability to invoke APIs, databases, or execute code.",
    },
    {
      id: "m4-f3",
      front: "What is memory in agents?",
      back: "Mechanism to remember information between sessions using vectors or databases.",
    },
    {
      id: "m4-f4",
      front: "What is a multi-agent system?",
      back: "Multiple AI agents collaborate, each specialized in one task.",
    },
    {
      id: "m4-f5",
      front: "What is planning?",
      back: "Decomposing a complex goal into smaller actionable steps.",
    },
    {
      id: "m4-f6",
      front: "What is reasoning?",
      back: "Analyzing information, evaluating options, and deciding the best course of action.",
    },
    {
      id: "m4-f7",
      front: "What is autonomy?",
      back: "Agent's level of independence to operate without direct human intervention.",
    },
  ],
  5: [
    {
      id: "m5-f1",
      front: "What is responsible AI?",
      back: "AI development prioritizing fairness, transparency, privacy, and accountability.",
    },
    {
      id: "m5-f2",
      front: "What is bias in AI?",
      back: "Biases due to unbalanced data or incorrect labeling during training.",
    },
    {
      id: "m5-f3",
      front: "What is differential privacy?",
      back: "Adding controlled noise to data to protect individual information.",
    },
    {
      id: "m5-f4",
      front: "What is explainable AI?",
      back: "Branch making model decisions interpretable for humans.",
    },
    {
      id: "m5-f5",
      front: "What is fairness in AI?",
      back: "Principle of not discriminating based on race, gender, age, or other characteristics.",
    },
    {
      id: "m5-f6",
      front: "What is transparency?",
      back: "Making visible how a model works, what data it uses, and how it decides.",
    },
    {
      id: "m5-f7",
      front: "What are algorithmic biases?",
      back: "Systematic errors caused by incomplete data or historical prejudices.",
    },
  ],
};

const RATING_ACTIONS = [
  {
    rating: 0,
    labelKey: "flashcard.rating_again",
    className: "border-red-300 text-red-600 hover:bg-red-50",
    icon: "fa-xmark",
  },
  {
    rating: 1,
    labelKey: "flashcard.rating_hard",
    className: "border-amber-300 text-amber-600 hover:bg-amber-50",
    icon: "fa-minus",
  },
  {
    rating: 2,
    labelKey: "flashcard.rating_good",
    className: "border-emerald-300 text-emerald-600 hover:bg-emerald-50",
    icon: "fa-check",
  },
  {
    rating: 3,
    labelKey: "flashcard.rating_easy",
    className: "border-petroleum/30 text-petroleum hover:bg-petroleum/5",
    icon: "fa-rocket",
  },
];

export function FlashcardArena({ moduleId }) {
  const { t, locale } = useTranslation();
  const MODULE_FLASHCARDS = ["en", "pt"].includes(locale)
    ? MODULE_FLASHCARDS_EN
    : MODULE_FLASHCARDS_ES;
  const allCards = MODULE_FLASHCARDS[moduleId] || MODULE_FLASHCARDS[1];
  const { rateCard, getCardStats, getDueCards, resetModule, state } =
    useSM2Flashcard(moduleId);

  const sortedCards = useMemo(() => {
    const due = getDueCards(allCards);
    const reviewed = allCards.filter((c) => !due.find((d) => d.id === c.id));
    reviewed.sort((a, b) => {
      const aDate = getCardStats(a.id).nextReviewDate || "";
      const bDate = getCardStats(b.id).nextReviewDate || "";
      return aDate.localeCompare(bDate);
    });
    return [...due, ...reviewed];
  }, [allCards, getDueCards, state]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [allReviewed, setAllReviewed] = useState(false);
  const xpAwardedRef = useRef(false);

  useEffect(() => {
    if (allReviewed && !xpAwardedRef.current) {
      xpAwardedRef.current = true;
      useIALabStore.getState().addXp(30);
    }
  }, [allReviewed]);

  const currentCard = sortedCards[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex >= sortedCards.length - 1) {
      setAllReviewed(true);
      return;
    }
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, sortedCards.length]);

  const handleRate = useCallback(
    (rating) => {
      if (!currentCard) return;
      rateCard(currentCard.id, rating);
      setRatedCount((prev) => prev + 1);
      goToNext();
    },
    [currentCard, rateCard, goToNext],
  );

  const resetCards = useCallback(() => {
    resetModule();
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
    setAllReviewed(false);
    setRatedCount(0);
    xpAwardedRef.current = false;
  }, [resetModule]);

  if (allReviewed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-petroleum/10 flex items-center justify-center mb-4">
          <Icon
            name="fa-check"
            className="text-petroleum text-3xl"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-lg font-bold text-petroleum">
          {t("flashcard.mastered_title")}
        </h3>
        <p className="text-sm text-petroleum/70 mt-1 mb-4">
          {t("flashcard.completed_desc", { count: allCards.length })}
        </p>
        <button
          onClick={resetCards}
          className="px-4 py-2 rounded-xl bg-petroleum/10 text-petroleum text-sm font-semibold hover:bg-petroleum/20 transition-colors"
        >
          <Icon name="fa-rotate" className="mr-2" aria-hidden="true" />
          {t("flashcard.repeat_all")}
        </button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-sm text-petroleum/70">{t("flashcard.no_cards")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div
        className="flex items-center justify-between text-sm text-petroleum/70 mb-4"
        role="status"
        aria-live="polite"
      >
        <span className="flex items-center gap-1.5">
          <Icon
            name="fa-layer-group"
            className="text-corporate"
            aria-hidden="true"
          />
          {t("flashcard.progress", {
            current: currentIndex + 1,
            total: sortedCards.length,
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="fa-clock" className="text-petroleum" aria-hidden="true" />
          {t("flashcard.remaining", {
            count: sortedCards.length - currentIndex - 1,
          })}
        </span>
      </div>

      <div
        className="ialab-perspective h-64 cursor-pointer"
        onClick={() => setIsFlipped((v) => !v)}
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
            aria-label={
              isFlipped
                ? t("flashcard.answer_aria")
                : t("flashcard.question_aria")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFlipped((v) => !v);
              }
            }}
          >
            <div
              className="relative w-full h-full ialab-preserve-3d"
              style={{
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 400ms ease-in-out",
              }}
            >
              <div className="absolute inset-0 bg-white border-2 border-petroleum/15 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden">
                <p className="text-lg font-medium text-petroleum text-center leading-relaxed">
                  {currentCard.front}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-petroleum/10 to-corporate/10 border-2 border-corporate/40 rounded-2xl shadow-sm p-6 flex items-center justify-center ialab-backface-hidden ialab-rotate-y-180">
                <p className="text-base text-petroleum text-center leading-relaxed">
                  {currentCard.back}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex justify-center gap-2">
            {RATING_ACTIONS.map(({ rating, labelKey, className, icon }) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all active:scale-[0.95] ${className}`}
                title={t(labelKey)}
              >
                <Icon name={icon} className="text-xs" aria-hidden="true" />
                {t(labelKey)}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-petroleum/40">
            {t("flashcard.rating_hint")}
          </p>
        </div>
      )}

      <p className="text-center text-xs text-petroleum/50 mt-4">
        {t("flashcard.click_hint")}
      </p>

      <div className="flex justify-center mt-4">
        <button
          onClick={resetCards}
          className="text-xs text-petroleum/50 hover:text-petroleum transition-colors flex items-center gap-1"
        >
          <Icon name="fa-rotate" aria-hidden="true" />
          {t("flashcard.restart_btn")}
        </button>
      </div>
    </div>
  );
}

export default FlashcardArena;
