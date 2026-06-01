import { useState } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { CheckCircle, Check, Award, Star } from 'lucide-react';
import { Button, Card } from '../shared';

const questions = [
  {
    q: "1. Un equipo docente quiere que un GPT responda automáticamente dudas sobre fechas de exámenes dentro del correo electrónico. ¿Qué necesita configurar?",
    options: [
      "Un GPT con Acción de Gmail que lea y responda correos automáticamente.",
      "Un GPT estándar sin acciones, los alumnos copian y pegan sus dudas.",
      "Solo un prompt bien escrito, sin necesidad de APIs externas.",
      "Un archivo PDF subido como conocimiento del GPT."
    ],
    answer: 0
  },
  {
    q: "2. ¿Cuál es la diferencia clave entre un GPT personalizado y el ChatGPT estándar?",
    options: [
      "El GPT personalizado sigue instrucciones fijas, tiene base de conocimiento propia y puede conectar con APIs externas.",
      "El GPT personalizado es más rápido que ChatGPT estándar.",
      "ChatGPT estándar no puede procesar texto largo, solo el GPT personalizado.",
      "El GPT personalizado funciona sin conexión a internet."
    ],
    answer: 0
  },
  {
    q: "3. Un estudiante usa un GPT para generar un ensayo completo y lo entrega sin leerlo. ¿Cuál debió ser el uso correcto?",
    options: [
      "Usarlo como compañero cognitivo: para lluvia de ideas, debatir conceptos y recibir retroalimentación de sus borradores.",
      "Usarlo solo para formato, porque la IA no debería participar en la creación de contenido.",
      "Usar herramientas para ocultar el rastro de IA y evitar detección.",
      "Evitar la IA por completo, pues destruye la creatividad."
    ],
    answer: 0
  },
  {
    q: "4. ¿Cuál es el mayor impacto pedagógico de que un docente automatice tareas administrativas con un GPT?",
    options: [
      "Libera tiempo para enfocarse en empatía, tutorías personalizadas y diseño de experiencias de aprendizaje más humanas.",
      "Permite justificar una reducción de carga laboral y dar menos clases.",
      "Demuestra que los docentes pueden ser reemplazados por sistemas de IA.",
      "Obliga al docente a certificarse como ingeniero de software."
    ],
    answer: 0
  }
];

export default function QuizScreen({ onNext, addXp }) {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAnswer = (index) => {
    setSelected(index);
    if (index === questions[currentQ].answer) {
      setScore(score + 1);
      addXp(125);
    }
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] pb-12">
      <h2 className="text-3xl font-bold text-petroleum mb-6 flex items-center gap-3">
        <CheckCircle className="text-corporate" size={32}/> {t('ova.buildgpt.quiz_title')}
      </h2>
      {!showResult ? (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('ova.buildgpt.quiz_question', { current: currentQ + 1, total: questions.length })}</span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mb-6">{questions[currentQ].q}</h3>
          <div className="space-y-3">
            {questions[currentQ].options.map((opt, i) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
              if (selected === null) {
                btnClass += "border-gray-200 dark:border-slate-600 hover:border-corporate hover:bg-cyan-50";
              } else {
                if (i === questions[currentQ].answer) {
                  btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 font-medium";
                } else if (i === selected) {
                  btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                } else {
                  btnClass += "opacity-50 border-gray-200 dark:border-slate-600";
                }
              }
              return (
                <button key={i} onClick={() => selected === null && handleAnswer(i)} className={btnClass} disabled={selected !== null}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${selected !== null && i === questions[currentQ].answer ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-slate-500'}`}>
                      {selected !== null && i === questions[currentQ].answer && <Check size={14} />}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="text-center animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-corporate to-petroleum rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-cyan-200">
            <Award size={48} />
          </div>
          <h3 className="text-3xl font-bold text-petroleum mb-2">{t('ova.buildgpt.quiz_result_title')}</h3>
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-6">{t('ova.buildgpt.quiz_score', { score, total: questions.length })}</p>
          {score === questions.length ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl mb-8 border border-green-200 dark:border-green-800">
              <p className="font-medium flex items-center justify-center gap-2"><Star className="text-yellow-500 fill-current" size={20}/> {t('ova.buildgpt.quiz_perfect')}</p>
            </div>
          ) : score >= 2 ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-8 border border-blue-200 dark:border-blue-800">
              <p className="font-medium">{t('ova.buildgpt.quiz_good')}</p>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 p-4 rounded-xl mb-8 border border-orange-200 dark:border-orange-800">
              <p className="font-medium">{t('ova.buildgpt.quiz_bad')}</p>
            </div>
          )}
          <Button onClick={onNext} icon={Award} className="w-full sm:w-auto text-lg py-3 px-8 mx-auto">
            {t('ova.buildgpt.quiz_cert_btn')}
          </Button>
        </Card>
      )}
    </div>
  );
}
