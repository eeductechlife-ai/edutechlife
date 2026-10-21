import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";

// Laboratorio multimodal (Módulo 3): elegir la forma correcta de trabajar cada tipo de material.
// Aprueba con 4 de 6. Cada respuesta explica por qué, para que el aprendizaje no sea solo acertar.
const COPY = {
  es: {
    title: "La Lupa a Prueba",
    intro: "Para cada material, elige la forma de trabajarlo con Gemini que te dé un resultado verificable.",
    next: "Siguiente",
    see: "Ver resultado",
    score: "Acertaste {correct} de {total}.",
    passed: "Lupa calibrada. Ya sabes elegir la herramienta según el material.",
    failed: "Aún no. Revisa las explicaciones y vuelve a intentarlo: necesitas 4 de 6.",
    retry: "Reintentar",
    why: "Por qué",
  },
  en: {
    title: "Testing the Magnifying Glass",
    intro: "For each material, choose the way to work with Gemini that gives you a verifiable result.",
    next: "Next",
    see: "See result",
    score: "You got {correct} of {total}.",
    passed: "Magnifying glass calibrated. You know how to choose the tool for each material.",
    failed: "Not yet. Review the explanations and try again: you need 4 of 6.",
    retry: "Try again",
    why: "Why",
  },
  pt: {
    title: "A Lupa à Prova",
    intro: "Para cada material, escolha a forma de trabalhá-lo com o Gemini que dê um resultado verificável.",
    next: "Próximo",
    see: "Ver resultado",
    score: "Você acertou {correct} de {total}.",
    passed: "Lupa calibrada. Você já sabe escolher a ferramenta conforme o material.",
    failed: "Ainda não. Revise as explicações e tente de novo: são necessárias 4 de 6.",
    retry: "Tentar de novo",
    why: "Por quê",
  },
};

const ITEMS = {
  es: [
    { task: "Tienes una foto borrosa de una factura y necesitas los totales.", options: ["Pedir un resumen de texto sin subir la imagen", "Subir la imagen y pedir los totales, revisando cada cifra contra la foto", "Buscar la factura en Google"], correct: 1, why: "Los modelos multimodales leen imágenes. Pide los totales y compruébalos contra la foto." },
    { task: "Grabaste una reunión de 45 minutos y necesitas las decisiones tomadas.", options: ["Transcribir el audio y pedir las decisiones con la minuta de cada una", "Pedir un resumen sin subir el audio", "Escribir la reunión de memoria"], correct: 0, why: "Con la transcripción y la marca de tiempo puedes verificar cada decisión." },
    { task: "Tienes un informe de 60 páginas en PDF y debes citar cada cifra.", options: ["Pedir un resumen sin fuentes", "Pedir un resumen con citas a las páginas y verificar dos de ellas", "Copiar solo la primera página"], correct: 1, why: "Una cita a la página te permite volver al original y comprobar la cifra." },
    { task: "Una hoja de cálculo con ventas por mes; quieres la tendencia.", options: ["Pedir una opinión sobre las ventas", "Pedir el cálculo de la tendencia y revisar la fórmula con una muestra", "Estimar la tendencia a ojo"], correct: 1, why: "Un cálculo se verifica revisando la fórmula y comparando con unos pocos datos." },
    { task: "Un video de clase de 30 minutos; necesitas los conceptos principales.", options: ["Ver el video completo sin notas", "Pedir la transcripción y un resumen con el minuto de cada concepto", "Pedir que complete lo que no se dijo"], correct: 1, why: "La transcripción con minutos te permite ir directo a cada concepto y comprobarlo." },
    { task: "Quieres saber si una cifra de una noticia es real.", options: ["Preguntar a la IA si es verdadera y aceptar la respuesta", "Buscar fuentes que la confirmen o la desmientan y abrir dos primarias", "Compartirla si suena creíble"], correct: 1, why: "La verificación se hace con fuentes primarias, no con la misma herramienta que pudo equivocarse." },
  ],
  en: [
    { task: "You have a blurry photo of an invoice and need the totals.", options: ["Ask for a text summary without uploading the image", "Upload the image and ask for the totals, checking each figure against the photo", "Search for the invoice on Google"], correct: 1, why: "Multimodal models read images. Ask for the totals and check them against the photo." },
    { task: "You recorded a 45-minute meeting and need the decisions made.", options: ["Transcribe the audio and ask for each decision with its timestamp", "Ask for a summary without uploading the audio", "Write the meeting from memory"], correct: 0, why: "With the transcript and timestamps you can verify each decision." },
    { task: "You have a 60-page PDF report and must cite every figure.", options: ["Ask for a summary without sources", "Ask for a summary with page citations and verify two of them", "Copy only the first page"], correct: 1, why: "A page citation lets you go back to the original and check the figure." },
    { task: "A spreadsheet with monthly sales; you want the trend.", options: ["Ask for an opinion about the sales", "Ask for the trend calculation and check the formula against a sample", "Estimate the trend by eye"], correct: 1, why: "A calculation is verified by checking the formula and comparing with a few data points." },
    { task: "A 30-minute class video; you need the main concepts.", options: ["Watch the whole video without notes", "Ask for the transcript and a summary with the minute of each concept", "Ask it to fill in what was not said"], correct: 1, why: "A transcript with minutes takes you straight to each concept so you can check it." },
    { task: "You want to know whether a figure in a news story is real.", options: ["Ask the AI whether it is true and accept the answer", "Search for sources that confirm or refute it and open two primary ones", "Share it if it sounds credible"], correct: 1, why: "Verification uses primary sources, not the same tool that may have made a mistake." },
  ],
  pt: [
    { task: "Você tem uma foto borrada de uma fatura e precisa dos totais.", options: ["Pedir um resumo de texto sem enviar a imagem", "Enviar a imagem e pedir os totais, conferindo cada número na foto", "Procurar a fatura no Google"], correct: 1, why: "Os modelos multimodais leem imagens. Peça os totais e confira-os na foto." },
    { task: "Você gravou uma reunião de 45 minutos e precisa das decisões tomadas.", options: ["Transcrever o áudio e pedir cada decisão com o minuto em que foi tomada", "Pedir um resumo sem enviar o áudio", "Escrever a reunião de memória"], correct: 0, why: "Com a transcrição e os minutos você verifica cada decisão." },
    { task: "Você tem um relatório de 60 páginas em PDF e precisa citar cada número.", options: ["Pedir um resumo sem fontes", "Pedir um resumo com citações das páginas e verificar duas delas", "Copiar só a primeira página"], correct: 1, why: "A citação da página permite voltar ao original e conferir o número." },
    { task: "Uma planilha de vendas por mês; você quer a tendência.", options: ["Pedir uma opinião sobre as vendas", "Pedir o cálculo da tendência e conferir a fórmula com uma amostra", "Estimar a tendência a olho"], correct: 1, why: "Um cálculo se verifica conferindo a fórmula e comparando com alguns dados." },
    { task: "Um vídeo de aula de 30 minutos; você precisa dos conceitos principais.", options: ["Assistir ao vídeo inteiro sem anotações", "Pedir a transcrição e um resumo com o minuto de cada conceito", "Pedir que complete o que não foi dito"], correct: 1, why: "A transcrição com minutos leva direto a cada conceito para você conferir." },
    { task: "Você quer saber se um número de uma notícia é real.", options: ["Perguntar à IA se é verdade e aceitar a resposta", "Buscar fontes que confirmem ou desmintam e abrir duas primárias", "Compartilhar se parecer crível"], correct: 1, why: "A verificação usa fontes primárias, não a mesma ferramenta que pode ter errado." },
  ],
};

export default function OVAMultimodalLab({ onComplete }) {
  const { locale } = useTranslation();
  const lang = COPY[locale] ? locale : "es";
  const copy = COPY[lang];
  const items = ITEMS[lang];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  const correct = answers.filter(Boolean).length;
  const passed = finished && correct >= 4;

  useEffect(() => {
    if (passed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [passed, onComplete]);

  const item = items[index];
  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
  };
  const advance = () => {
    const next = [...answers, picked === item.correct];
    setAnswers(next);
    setPicked(null);
    if (index >= items.length - 1) setFinished(true);
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{index + 1} / {items.length}</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.task}</p>
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
                  onClick={() => choose(i)}
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
                {index >= items.length - 1 ? copy.see : copy.next}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{copy.score.replace("{correct}", correct).replace("{total}", items.length)}</p>
          <p className="text-slate-600 dark:text-slate-300">{passed ? copy.passed : copy.failed}</p>
          {!passed && (
            <button type="button" onClick={restart} className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-bold text-white">{copy.retry}</button>
          )}
        </div>
      )}
    </section>
  );
}

OVAMultimodalLab.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};
