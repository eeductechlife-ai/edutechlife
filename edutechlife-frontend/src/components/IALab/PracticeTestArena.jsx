import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useIALabStore } from "../../store/ialabStore";

const MODULE_FLASHCARDS = {
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

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(cards) {
  return cards.map((card, idx) => {
    const otherBacks = cards
      .filter((_, i) => i !== idx)
      .map((c) => c.back)
      .filter((b) => b !== card.back);
    const shuffledOtherBacks = shuffleArray(otherBacks);
    const distractors = shuffledOtherBacks.slice(0, 3);
    while (distractors.length < 3) {
      distractors.push(`—`);
    }
    const options = shuffleArray([
      { id: `${card.id}-correct`, label: card.back, isCorrect: true },
      ...distractors.map((d, i) => ({
        id: `${card.id}-d${i}`,
        label: d,
        isCorrect: false,
      })),
    ]);
    return {
      id: card.id,
      question: card.front,
      options,
      correctLabel: card.back,
    };
  });
}

function ScoreCircle({ pct, size = 130 }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      requestAnimationFrame(() => setAnimated(true));
    }
  }, []);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="-rotate-90"
    >
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004B63" />
          <stop offset="100%" stopColor="#00BCD4" />
        </linearGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="url(#scoreGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={
          animated ? circumference * (1 - pct / 100) : circumference
        }
        style={{
          transition:
            "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
    </svg>
  );
}

export function PracticeTestArena({ moduleId, onClose }) {
  const [locale, setLocale] = React.useState("es");
  React.useEffect(() => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang.startsWith("en")) setLocale("en");
  }, []);

  const isEn = locale === "en";
  const cards =
    (isEn ? MODULE_FLASHCARDS_EN : MODULE_FLASHCARDS)[moduleId] ||
    (isEn ? MODULE_FLASHCARDS_EN : MODULE_FLASHCARDS)[1];

  const questions = useMemo(() => generateQuestions(cards), [cards]);
  const addXp = useIALabStore((s) => s.addXp);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const isCorrect =
    selected !== null &&
    questions[currentQ]?.options.find((o) => o.id === selected)?.isCorrect;

  const handleSelect = useCallback(
    (optId) => {
      if (selected !== null) return;
      setSelected(optId);
    },
    [selected],
  );

  const handleNext = useCallback(() => {
    const correct =
      questions[currentQ]?.options.find((o) => o.id === selected)?.isCorrect ||
      false;
    const newAnswers = [
      ...answers,
      { questionId: questions[currentQ].id, correct },
    ];
    setAnswers(newAnswers);

    if (currentQ >= questions.length - 1) {
      const totalCorrect = newAnswers.filter((a) => a.correct).length;
      const pct = Math.round((totalCorrect / questions.length) * 100);
      setShowResult(true);
      if (pct >= 60) addXp(50);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    }
  }, [currentQ, selected, answers, questions, addXp]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  }, []);

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-slate-500">
          No hay preguntas disponibles para este módulo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-[1.5px] bg-gradient-to-br from-petroleum/20 via-corporate/10 to-petroleum/5 rounded-[1.75rem]">
      <div className="relative bg-white dark:bg-slate-800 rounded-[calc(1.75rem-1.5px)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-[calc(1.75rem-1.5px)]" />

        {!showResult ? (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-petroleum/10 to-corporate/10">
                  <span className="text-[10px] font-semibold text-petroleum uppercase tracking-wide">
                    {isEn ? "Practice Test" : "Test de Práctica"}
                  </span>
                </div>
                <span className="text-xs text-slate-400 tabular-nums">
                  {currentQ + 1}/{questions.length}
                </span>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-petroleum hover:border-petroleum/30 transition-all"
                  aria-label={isEn ? "Close" : "Cerrar"}
                >
                  <Icon name="fa-xmark" className="text-sm" />
                </button>
              )}
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQ + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-base font-bold text-petroleum dark:text-white mb-5 leading-relaxed">
                  {questions[currentQ].question}
                </p>

                <div className="space-y-2.5">
                  {questions[currentQ].options.map((opt) => {
                    let borderClass =
                      "border-slate-200/60 dark:border-slate-600 hover:border-petroleum/30 dark:hover:border-petroleum/50 hover:bg-petroleum/5 dark:hover:bg-petroleum/10";
                    let bgClass = "bg-white dark:bg-slate-800";
                    let textClass = "text-slate-700 dark:text-slate-200";
                    let iconWrapper = null;

                    if (selected === opt.id) {
                      if (opt.isCorrect) {
                        borderClass =
                          "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                        bgClass = "bg-emerald-50 dark:bg-emerald-900/20";
                        textClass = "text-emerald-700 dark:text-emerald-300";
                        iconWrapper = (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name="fa-check"
                              className="text-emerald-500 text-sm"
                            />
                          </div>
                        );
                      } else {
                        borderClass =
                          "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20";
                        bgClass = "bg-red-50 dark:bg-red-900/20";
                        textClass = "text-red-600 dark:text-red-300";
                        iconWrapper = (
                          <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name="fa-xmark"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        );
                      }
                    } else if (selected !== null && opt.isCorrect) {
                      borderClass =
                        "border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10";
                      bgClass = "bg-emerald-50/50 dark:bg-emerald-900/10";
                      textClass = "text-emerald-700 dark:text-emerald-300";
                      iconWrapper = (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon
                            name="fa-check"
                            className="text-emerald-500 text-sm"
                          />
                        </div>
                      );
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        disabled={selected !== null}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${borderClass} ${bgClass} ${selected !== null ? "cursor-default" : "cursor-pointer active:scale-[0.99] hover:shadow-sm"}`}
                      >
                        <span
                          className={`flex-1 text-sm leading-relaxed ${textClass}`}
                        >
                          {opt.label}
                        </span>
                        {iconWrapper || (
                          <div className="w-7 h-7 rounded-lg border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 group-hover:border-petroleum/30 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <div
                  className={`p-3 sm:p-4 rounded-xl text-sm mb-4 flex items-start gap-3 ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? "bg-emerald-500/15" : "bg-red-500/15"
                    }`}
                  >
                    <Icon
                      name={isCorrect ? "fa-check" : "fa-xmark"}
                      className={`text-lg ${isCorrect ? "text-emerald-500" : "text-red-500"}`}
                    />
                  </div>
                  <div>
                    <span className="font-semibold">
                      {isCorrect
                        ? isEn
                          ? "Correct!"
                          : "¡Correcto!"
                        : isEn
                          ? "Incorrect. The answer was:"
                          : "Incorrecto. La respuesta era:"}
                    </span>
                    {!isCorrect && (
                      <span className="block font-medium mt-1">
                        {questions[currentQ].correctLabel}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="group w-full py-3 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-semibold shadow-md shadow-petroleum/20 hover:shadow-lg hover:shadow-petroleum/30 transition-all duration-200 active:scale-[0.99] inline-flex items-center justify-center gap-2"
                >
                  <span>
                    {currentQ >= questions.length - 1
                      ? isEn
                        ? "See Results"
                        : "Ver Resultados"
                      : isEn
                        ? "Next Question"
                        : "Siguiente Pregunta"}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                    <Icon
                      name="fa-chevron-right"
                      className="text-white text-xs"
                    />
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center">
            {(() => {
              const pct = Math.round(
                (answers.filter((a) => a.correct).length / questions.length) *
                  100,
              );
              const passed = pct >= 60;
              return (
                <>
                  <div className="relative w-[130px] h-[130px] mx-auto mb-4">
                    <ScoreCircle pct={pct} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span
                          className={`text-2xl font-bold ${passed ? "text-emerald-600" : "text-petroleum"}`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-petroleum dark:text-white mb-1">
                    {isEn
                      ? "Practice Test Complete"
                      : "Test de Práctica Completado"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    {isEn
                      ? "Check your results below"
                      : "Revisa tus resultados a continuación"}
                  </p>

                  {passed && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-5">
                      <Icon name="fa-star" className="text-amber-400" />
                      +50 XP
                    </div>
                  )}

                  <div className="flex justify-center gap-6 sm:gap-10 mb-6">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {answers.filter((a) => a.correct).length}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEn ? "Correct" : "Correctas"}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-500 dark:text-red-400">
                        {answers.filter((a) => !a.correct).length}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEn ? "Incorrect" : "Incorrectas"}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-petroleum dark:text-white">
                        {questions.length}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEn ? "Total" : "Total"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={handleRestart}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-petroleum/10 dark:bg-petroleum/20 text-petroleum dark:text-white text-sm font-semibold hover:bg-petroleum/20 dark:hover:bg-petroleum/30 transition-all active:scale-[0.97]"
                    >
                      <Icon name="fa-rotate" aria-hidden="true" />
                      {isEn ? "Retry" : "Reintentar"}
                    </button>
                    {onClose && (
                      <button
                        onClick={onClose}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-semibold shadow-md shadow-petroleum/20 hover:shadow-lg transition-all active:scale-[0.97]"
                      >
                        <span>{isEn ? "Close" : "Cerrar"}</span>
                        <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center">
                          <Icon
                            name="fa-chevron-right"
                            className="text-white text-[10px]"
                          />
                        </div>
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticeTestArena;
