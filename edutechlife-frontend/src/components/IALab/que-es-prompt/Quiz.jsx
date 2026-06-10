import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from '../../../i18n/I18nProvider'

const Quiz = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      q: "Si un prompt genera una respuesta 'vaga y genérica', ¿cuál es probablemente la razón principal según la lectura?",
      o: ["La IA no tiene suficiente memoria", "Falta de contexto y especificidad en la instrucción", "El servidor de la IA está saturado", "La IA no sabe hablar español"],
      c: 1,
      f: "La lectura enfatiza que la IA no conoce tu contexto personal a menos que tú se lo proporciones explícitamente."
    },
    {
      q: "Al usar la técnica 'Chain of Thought' (Cadena de Pensamiento), el objetivo principal es:",
      o: ["Que la IA responda más rápido", "Hacer que la IA escriba textos creativos", "Obligar a la IA a mostrar su razonamiento paso a paso para mejorar la precisión", "Ahorrar tokens en la respuesta"],
      c: 2,
      f: "Esta técnica mejora drásticamente los resultados en tareas de lógica y resolución de problemas."
    },
    {
      q: "¿Por qué el prompt se define como un 'puente de comunicación'?",
      o: ["Porque permite conectar dos computadoras", "Porque es la única interfaz que guía el razonamiento y la creatividad de la máquina", "Porque traduce idiomas automáticamente", "Porque conecta a la IA con el internet"],
      c: 1,
      f: "El prompt es la herramienta que permite que la intención humana se convierta en una salida útil de la IA."
    },
    {
      q: "En la 'Anatomía de un Prompt', ¿cuál es la función del componente de Restricciones?",
      o: ["Hacer el prompt más largo", "Dar ejemplos del resultado", "Establecer límites y condiciones de lo que la IA NO debe hacer", "Elegir el idioma de salida"],
      c: 2,
      f: "Las restricciones acotan el resultado final evitando tecnicismos innecesarios o extensiones excesivas."
    },
    {
      q: "¿Qué implica la 'Iteración' en la ingeniería de prompts?",
      o: ["Aceptar la primera respuesta de la IA", "Copiar y pegar el mismo prompt varias veces", "Evaluar, identificar limitaciones y ajustar la instrucción hasta lograr el resultado óptimo", "Apagar y encender el sistema"],
      c: 2,
      f: "La ingeniería de prompts es un proceso dinámico y estratégico de refinamiento constante."
    }
  ];

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[currentQ].c) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
        <span>{t('ialab.que_es_prompt.quiz_analysis', { current: currentQ + 1, total: 5 })}</span>
        <span className="text-[#00B4D8]">{t('ialab.que_es_prompt.quiz_score', { score })}</span>
      </div>
      <h3 className="text-xl font-[900] text-[#0D2B5B] leading-tight">{questions[currentQ].q}</h3>
      <div className="grid gap-2">
        {questions[currentQ].o.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all ${
              showFeedback
                ? i === questions[currentQ].c ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300' : selected === i ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-700/30 border-transparent opacity-50'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#00B4D8]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className="p-5 bg-slate-100 dark:bg-slate-700/50 rounded-[2rem] animate-[slideInFromTop_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <p className="text-xs font-bold leading-relaxed">{questions[currentQ].f}</p>
          <button onClick={handleNext} className="mt-4 w-full py-3 bg-[#0D2B5B] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">
            {currentQ === 4 ? t('ialab.que_es_prompt.quiz_see_results') : t('ialab.que_es_prompt.quiz_continue')} <ChevronRight size={14}/>
          </button>
        </div>
      )}
    </div>
  );
};

Quiz.propTypes = {
  onComplete: PropTypes.func,
};

export default Quiz;
