import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { CheckCircle, Check, Award, Star, CheckCircle2 } from "lucide-react";
import { Card } from "../shared";

const QUESTIONS = {
  es: [
    {
      q: "1. Cada semana escribes un boletín para las familias con el mismo tono y las mismas reglas. ¿Qué te conviene armar?",
      options: [
        "Un agente que lo envíe solo, sin revisar.",
        "Un Proyecto con tus instrucciones y un ejemplo de boletín.",
        "Escribirlo desde cero cada semana.",
        "Un archivo con las contraseñas de las familias.",
      ],
      answer: 1,
    },
    {
      q: "2. ¿Cuál es la diferencia entre un Proyecto y un agente?",
      options: [
        "Un Proyecto guarda el contexto de un trabajo; un agente hace varios pasos seguidos bajo tu supervisión.",
        "Un agente siempre es más rápido que un Proyecto.",
        "El Proyecto solo funciona sin internet.",
        "No hay ninguna diferencia.",
      ],
      answer: 0,
    },
    {
      q: "3. Tu cuenta avisa que los GPTs personalizados dejarán de funcionar y tienes uno con tus instrucciones. ¿Qué haces?",
      options: [
        "Lo ignoro: seguro no pasa nada.",
        "Borro todo mi trabajo.",
        "Copio sus instrucciones y las guardo en un Proyecto.",
        "Lo comparto con más gente para que lo usen ya.",
      ],
      answer: 2,
    },
    {
      q: "4. Un agente comparó tres proveedores y armó una tabla. ¿Qué haces antes de enviarla a tu cliente?",
      options: [
        "La envío de inmediato.",
        "Confío porque trabajó varios minutos.",
        "Borro las fuentes para que no se vean.",
        "Reviso el plan, abro las fuentes y compruebo las cifras importantes.",
      ],
      answer: 3,
    },
    {
      q: "5. ¿Qué NO deberías subir a un Proyecto sin autorización?",
      options: [
        "El manual de tono de tu negocio.",
        "Una plantilla de correo.",
        "Datos personales de tus clientes o de menores de edad.",
        "Tus propias instrucciones.",
      ],
      answer: 2,
    },
    {
      q: "6. Un docente quiere dejar de repetir el mismo contexto en cada chat. ¿Qué paso es correcto?",
      options: [
        "Crear un Proyecto con instrucciones claras y los archivos necesarios, y probarlo con un caso real.",
        "Pegar todo el contexto en cada chat.",
        "Pedir un agente sin definir el objetivo.",
        "Subir todos los archivos del computador.",
      ],
      answer: 0,
    },
  ],
  en: [
    {
      q: "1. Every week you write a newsletter for families with the same tone and rules. What should you set up?",
      options: [
        "An agent that sends it on its own, with no review.",
        "A Project with your instructions and a sample newsletter.",
        "Writing it from scratch every week.",
        "A file with the families' passwords.",
      ],
      answer: 1,
    },
    {
      q: "2. What is the difference between a Project and an agent?",
      options: [
        "A Project keeps the context of a job; an agent does several steps in a row under your supervision.",
        "An agent is always faster than a Project.",
        "A Project only works offline.",
        "There is no difference.",
      ],
      answer: 0,
    },
    {
      q: "3. Your account warns that custom GPTs will stop working and you have one with your instructions. What do you do?",
      options: [
        "I ignore it: nothing will happen.",
        "I delete all my work.",
        "I copy its instructions and save them in a Project.",
        "I share it with more people so they can use it now.",
      ],
      answer: 2,
    },
    {
      q: "4. An agent compared three suppliers and built a table. What do you do before sending it to your client?",
      options: [
        "I send it right away.",
        "I trust it because it worked for several minutes.",
        "I delete the sources so they are not visible.",
        "I review the plan, open the sources and check the key figures.",
      ],
      answer: 3,
    },
    {
      q: "5. What should you NOT upload to a Project without permission?",
      options: [
        "Your business's tone manual.",
        "An email template.",
        "Personal data of your clients or of minors.",
        "Your own instructions.",
      ],
      answer: 2,
    },
    {
      q: "6. A teacher wants to stop repeating the same context in every chat. Which step is right?",
      options: [
        "Create a Project with clear instructions and the needed files, and test it with a real case.",
        "Paste all the context into every chat.",
        "Ask for an agent without defining the goal.",
        "Upload every file on the computer.",
      ],
      answer: 0,
    },
  ],
  pt: [
    {
      q: "1. Toda semana você escreve um informativo para as famílias com o mesmo tom e as mesmas regras. O que convém montar?",
      options: [
        "Um agente que envie sozinho, sem revisar.",
        "Um Projeto com as suas instruções e um exemplo de informativo.",
        "Escrever do zero toda semana.",
        "Um arquivo com as senhas das famílias.",
      ],
      answer: 1,
    },
    {
      q: "2. Qual a diferença entre um Projeto e um agente?",
      options: [
        "Um Projeto guarda o contexto de um trabalho; um agente faz vários passos seguidos sob a sua supervisão.",
        "Um agente é sempre mais rápido que um Projeto.",
        "O Projeto só funciona sem internet.",
        "Não há diferença.",
      ],
      answer: 0,
    },
    {
      q: "3. Sua conta avisa que os GPTs personalizados vão deixar de funcionar e você tem um com as suas instruções. O que faz?",
      options: [
        "Ignoro: com certeza não acontece nada.",
        "Apago todo o meu trabalho.",
        "Copio as instruções dele e guardo em um Projeto.",
        "Compartilho com mais gente para usarem já.",
      ],
      answer: 2,
    },
    {
      q: "4. Um agente comparou três fornecedores e montou uma tabela. O que você faz antes de enviá-la ao cliente?",
      options: [
        "Envio na hora.",
        "Confio porque ele trabalhou vários minutos.",
        "Apago as fontes para não aparecerem.",
        "Reviso o plano, abro as fontes e confiro os números importantes.",
      ],
      answer: 3,
    },
    {
      q: "5. O que você NÃO deve enviar a um Projeto sem autorização?",
      options: [
        "O manual de tom do seu negócio.",
        "Um modelo de e-mail.",
        "Dados pessoais de clientes ou de menores de idade.",
        "As suas próprias instruções.",
      ],
      answer: 2,
    },
    {
      q: "6. Um professor quer parar de repetir o mesmo contexto em cada chat. Qual passo é correto?",
      options: [
        "Criar um Projeto com instruções claras e os arquivos necessários, e testá-lo com um caso real.",
        "Colar todo o contexto em cada chat.",
        "Pedir um agente sem definir o objetivo.",
        "Enviar todos os arquivos do computador.",
      ],
      answer: 0,
    },
  ],
};

QuizScreen.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
  onMarkComplete: PropTypes.func,
};

export default function QuizScreen({ onNext, addXp, onMarkComplete }) {
  const { t, locale } = useTranslation();
  const questions = QUESTIONS[locale] || QUESTIONS.es;
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const autoCompletedRef = useRef(false);

  useEffect(() => {
    if (showResult && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onMarkComplete?.();
    }
  }, [showResult, onMarkComplete]);

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
      <h2 className="text-3xl font-bold text-[var(--theme-emphasis)] mb-6 flex items-center gap-3">
        <CheckCircle className="text-[var(--theme-primary)]" size={32} />{" "}
        {t("ova.buildgpt.quiz_title")}
      </h2>
      {!showResult ? (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              {t("ova.buildgpt.quiz_question", {
                current: currentQ + 1,
                total: questions.length,
              })}
            </span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200 mb-6">
            {questions[currentQ].q}
          </h3>
          <div className="space-y-3">
            {questions[currentQ].options.map((opt, i) => {
              let btnClass =
                "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
              if (selected === null) {
                btnClass +=
                  "border-gray-200 dark:border-slate-600 hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10";
              } else {
                if (i === questions[currentQ].answer) {
                  btnClass +=
                    "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 font-medium";
                } else if (i === selected) {
                  btnClass +=
                    "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                } else {
                  btnClass +=
                    "opacity-50 border-gray-200 dark:border-slate-600";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => selected === null && handleAnswer(i)}
                  aria-pressed={selected === i}
                  className={btnClass}
                  disabled={selected !== null}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${selected !== null && i === questions[currentQ].answer ? "bg-green-500 border-green-500 text-white" : "border-gray-300 dark:border-slate-500"}`}
                      aria-hidden="true"
                    >
                      {selected !== null &&
                        i === questions[currentQ].answer && <Check size={14} />}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card
          className="text-center animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]"
          aria-live="polite"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[var(--theme-primary)] to-[var(--theme-emphasis)] rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-[var(--theme-primary)]/20">
            <Award size={48} />
          </div>
          <h3 className="text-3xl font-bold text-[var(--theme-emphasis)] mb-2">
            {t("ova.buildgpt.quiz_result_title")}
          </h3>
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-6">
            {t("ova.buildgpt.quiz_score", { score, total: questions.length })}
          </p>
          {score === questions.length ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl mb-8 border border-green-200 dark:border-green-800">
              <p className="font-medium flex items-center justify-center gap-2">
                <Star className="text-yellow-500 fill-current" size={20} />{" "}
                {t("ova.buildgpt.quiz_perfect")}
              </p>
            </div>
          ) : score >= 2 ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-8 border border-blue-200 dark:border-blue-800">
              <p className="font-medium">{t("ova.buildgpt.quiz_good")}</p>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 p-4 rounded-xl mb-8 border border-orange-200 dark:border-orange-800">
              <p className="font-medium">{t("ova.buildgpt.quiz_bad")}</p>
            </div>
          )}
          <button
            onClick={() => onNext?.()}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <CheckCircle2 size={22} />
            {t("ova.nav.next")}
          </button>
        </Card>
      )}
    </div>
  );
}
