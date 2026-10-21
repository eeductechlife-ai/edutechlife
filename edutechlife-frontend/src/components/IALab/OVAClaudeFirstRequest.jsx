import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";

// Primer pedido a Claude (Módulo 5): elegir la versión que completa los elementos del pedido.
// Aprueba con 2 de 3. Cada escenario muestra por qué la versión elegida funciona mejor.
const COPY = {
  es: {
    title: "El Primer Pedido",
    intro: "Un pedido vago produce un resultado vago. Elige, en cada caso, la versión que dice qué quieres, para quién, en qué formato, con qué tono y con qué límites.",
    next: "Siguiente",
    see: "Ver resultado",
    score: "Acertaste {correct} de {total}.",
    passed: "Ya sabes escribir un primer pedido completo.",
    failed: "Aún no. Revisa las explicaciones y vuelve a intentarlo: necesitas 2 de 3.",
    retry: "Reintentar",
    why: "Por qué",
    weak: "Pedido original",
  },
  en: {
    title: "The First Request",
    intro: "A vague request produces a vague result. In each case, choose the version that says what you want, for whom, in what format, with what tone and with what limits.",
    next: "Next",
    see: "See result",
    score: "You got {correct} of {total}.",
    passed: "You now know how to write a complete first request.",
    failed: "Not yet. Review the explanations and try again: you need 2 of 3.",
    retry: "Try again",
    why: "Why",
    weak: "Original request",
  },
  pt: {
    title: "O Primeiro Pedido",
    intro: "Um pedido vago gera um resultado vago. Em cada caso, escolha a versão que diz o que você quer, para quem, em que formato, com que tom e com que limites.",
    next: "Próximo",
    see: "Ver resultado",
    score: "Você acertou {correct} de {total}.",
    passed: "Você já sabe escrever um primeiro pedido completo.",
    failed: "Ainda não. Revise as explicações e tente de novo: são necessárias 2 de 3.",
    retry: "Tentar de novo",
    why: "Por quê",
    weak: "Pedido original",
  },
};

const SCENARIOS = {
  es: [
    { weak: "Escribe un correo a mis clientes.", options: [
      "Escribe un correo para clientes sobre el nuevo horario.",
      "Eres asistente de atención al cliente de una escuela de idiomas. Objetivo: avisar del nuevo horario. Audiencia: alumnos adultos. Formato: correo de 120 palabras. Tono: cercano. Restricciones: no prometas fechas sin confirmar.",
      "Escribe un correo muy bueno y profesional para todos.",
    ], correct: 1, why: "Define rol, objetivo, audiencia, formato, tono y límites. Así el resultado sale útil a la primera." },
    { weak: "Haz un resumen de este informe.", options: [
      "Resume el informe y dime qué opinas de todo.",
      "Resume el informe.",
      "Haz un resumen de este informe en 5 ideas, con la página de cada una, para un directivo que tiene 3 minutos.",
    ], correct: 2, why: "Indicar el número de ideas, la fuente (página) y el lector hace que el resumen sea verificable y útil." },
    { weak: "Crea una presentación sobre IA.", options: [
      "Crea una presentación sobre IA.",
      "Hazla bonita y que se entienda.",
      "Presentación de 8 diapositivas sobre IA para docentes sin experiencia técnica. Tono cercano, una idea por diapositiva, y fuentes citadas en la última.",
    ], correct: 2, why: "Número de diapositivas, público, tono y una regla de contenido: el pedido describe el resultado que quieres." },
  ],
  en: [
    { weak: "Write an email to my customers.", options: [
      "Write an email to customers about the new schedule.",
      "You are a customer-care assistant at a language school. Goal: announce the new schedule. Audience: adult students. Format: 120-word email. Tone: warm. Constraints: do not promise dates that are not confirmed.",
      "Write a really good, professional email for everyone.",
    ], correct: 1, why: "It defines role, goal, audience, format, tone and limits, so the result is useful on the first try." },
    { weak: "Summarize this report.", options: [
      "Summarize the report and tell me what you think of it all.",
      "Summarize the report.",
      "Summarize this report in 5 ideas, with the page of each, for an executive with 3 minutes.",
    ], correct: 2, why: "Stating the number of ideas, the source (page) and the reader makes the summary verifiable and useful." },
    { weak: "Make a presentation about AI.", options: [
      "Make a presentation about AI.",
      "Make it pretty and easy to understand.",
      "An 8-slide presentation about AI for teachers with no technical background. Warm tone, one idea per slide, and cited sources on the last slide.",
    ], correct: 2, why: "Number of slides, audience, tone and a content rule: the request describes the result you want." },
  ],
  pt: [
    { weak: "Escreva um e-mail para os meus clientes.", options: [
      "Escreva um e-mail para clientes sobre o novo horário.",
      "Você é assistente de atendimento de uma escola de idiomas. Objetivo: avisar do novo horário. Público: alunos adultos. Formato: e-mail de 120 palavras. Tom: cordial. Restrições: não prometa datas sem confirmação.",
      "Escreva um e-mail muito bom e profissional para todos.",
    ], correct: 1, why: "Define papel, objetivo, público, formato, tom e limites. Assim o resultado já sai útil de primeira." },
    { weak: "Faça um resumo deste relatório.", options: [
      "Resuma o relatório e diga o que você acha de tudo.",
      "Resuma o relatório.",
      "Faça um resumo deste relatório em 5 ideias, com a página de cada uma, para um diretor que tem 3 minutos.",
    ], correct: 2, why: "Indicar o número de ideias, a fonte (página) e o leitor torna o resumo verificável e útil." },
    { weak: "Crie uma apresentação sobre IA.", options: [
      "Crie uma apresentação sobre IA.",
      "Deixe bonita e fácil de entender.",
      "Apresentação de 8 slides sobre IA para professores sem experiência técnica. Tom cordial, uma ideia por slide e fontes citadas no último.",
    ], correct: 2, why: "Número de slides, público, tom e uma regra de conteúdo: o pedido descreve o resultado que você quer." },
  ],
};

export default function OVAClaudeFirstRequest({ onComplete }) {
  const { locale } = useTranslation();
  const lang = COPY[locale] ? locale : "es";
  const copy = COPY[lang];
  const scenarios = SCENARIOS[lang];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  const correct = answers.filter(Boolean).length;
  const passed = finished && correct >= 2;

  useEffect(() => {
    if (passed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [passed, onComplete]);

  const item = scenarios[index];
  const advance = () => {
    setAnswers([...answers, picked === item.correct]);
    setPicked(null);
    if (index >= scenarios.length - 1) setFinished(true);
    else setIndex(index + 1);
  };
  const restart = () => {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
    completedRef.current = false;
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5 p-6">
      <header>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{copy.title}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{copy.intro}</p>
      </header>

      {!finished ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{index + 1} / {scenarios.length}</p>
          <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span className="font-semibold">{copy.weak}: </span>{item.weak}
          </p>
          <div className="space-y-2">
            {item.options.map((opt, i) => {
              const isCorrect = i === item.correct;
              const cls = picked === null
                ? "border-slate-300 hover:border-cyan-500 dark:border-slate-600"
                : isCorrect
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : i === picked
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
                    : "border-slate-200 opacity-60 dark:border-slate-700";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => picked === null && setPicked(i)}
                  disabled={picked !== null}
                  className={`w-full rounded-xl border-2 p-3 text-left text-sm text-slate-900 transition dark:text-slate-100 ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="space-y-3">
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="font-semibold">{copy.why}: </span>{item.why}
              </p>
              <button type="button" onClick={advance} className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white">
                {index >= scenarios.length - 1 ? copy.see : copy.next}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{copy.score.replace("{correct}", correct).replace("{total}", scenarios.length)}</p>
          <p className="text-slate-600 dark:text-slate-300">{passed ? copy.passed : copy.failed}</p>
          {!passed && (
            <button type="button" onClick={restart} className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-bold text-white">{copy.retry}</button>
          )}
        </div>
      )}
    </section>
  );
}

OVAClaudeFirstRequest.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};
