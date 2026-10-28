import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { Check, X, ArrowRight } from "lucide-react";
import { Button, Card } from "../shared";

ModulePrueba.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
};

const CORRECT = 1;

const TEXTS = {
  es: {
    title: "Paso 4: Prueba antes de usar",
    desc: "Un Proyecto puede sonar seguro aunque invente un dato. Lee esta respuesta de prueba y decide qué verificar.",
    user: "Escribe el aviso para las familias con la fecha y el requisito de la próxima reunión.",
    reply:
      "La reunión será el jueves 5 de noviembre a las 7:00 p. m. Traigan el formato firmado y su documento de identidad. (Siguiendo tus instrucciones: tono cercano y tres párrafos.)",
    question: "¿Qué debes verificar antes de enviarlo?",
    options: [
      "El tono, porque las instrucciones ya lo piden.",
      "La fecha y el requisito del documento, porque no están en los archivos del Proyecto.",
      "Nada: el Proyecto ya lo revisó por mí.",
      "Solo la ortografía.",
    ],
    ok: "Correcto. El Proyecto solo conoce lo que está en sus instrucciones y archivos. Si la fecha o el requisito no aparecen allí, confírmalos con la fuente antes de enviar.",
    no: "Revisa de dónde sale ese dato: ¿está en tus instrucciones o en tus archivos? Si no está, verifícalo antes de usarlo.",
    next: "Continuar a la actividad",
  },
  en: {
    title: "Step 4: Test before you use it",
    desc: "A Project can sound confident even when it invents a detail. Read this test answer and decide what to verify.",
    user: "Write the notice for families with the date and the requirement for the next meeting.",
    reply:
      "The meeting will be on Thursday, November 5 at 7:00 p.m. Bring the signed form and your ID. (Following your instructions: warm tone and three paragraphs.)",
    question: "What should you verify before sending it?",
    options: [
      "The tone, because the instructions already ask for it.",
      "The date and the document requirement, because they are not in the Project's files.",
      "Nothing: the Project already checked it for me.",
      "Only the spelling.",
    ],
    ok: "Correct. The Project only knows what is in its instructions and files. If the date or the requirement is not there, confirm it with the source before sending.",
    no: "Check where that detail comes from: is it in your instructions or your files? If not, verify it before using it.",
    next: "Continue to the activity",
  },
  pt: {
    title: "Passo 4: Teste antes de usar",
    desc: "Um Projeto pode parecer seguro mesmo quando inventa um dado. Leia esta resposta de teste e decida o que conferir.",
    user: "Escreva o aviso para as famílias com a data e o requisito da próxima reunião.",
    reply:
      "A reunião será na quinta-feira, 5 de novembro, às 19h. Tragam o formulário assinado e o documento de identidade. (Seguindo as suas instruções: tom próximo e três parágrafos.)",
    question: "O que você deve conferir antes de enviar?",
    options: [
      "O tom, porque as instruções já pedem isso.",
      "A data e o requisito do documento, porque não estão nos arquivos do Projeto.",
      "Nada: o Projeto já revisou por mim.",
      "Só a ortografia.",
    ],
    ok: "Correto. O Projeto só conhece o que está nas instruções e nos arquivos. Se a data ou o requisito não estiverem ali, confirme na fonte antes de enviar.",
    no: "Veja de onde sai esse dado: está nas suas instruções ou nos seus arquivos? Se não estiver, confira antes de usar.",
    next: "Continuar para a atividade",
  },
};

export default function ModulePrueba({ onNext, addXp }) {
  const { locale } = useTranslation();
  const txt = TEXTS[locale] || TEXTS.es;
  const [picked, setPicked] = useState(null);
  const [rewarded, setRewarded] = useState(false);

  const choose = (index) => {
    if (picked === CORRECT) return;
    setPicked(index);
    if (index === CORRECT && !rewarded) {
      setRewarded(true);
      addXp(100);
    }
  };

  const solved = picked === CORRECT;

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <h2 className="text-3xl font-bold text-[var(--theme-emphasis)] mb-2">
        {txt.title}
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-6">{txt.desc}</p>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="self-end max-w-[85%] rounded-2xl bg-[var(--theme-primary)]/10 px-4 py-3 text-slate-700 dark:text-slate-200">
            {txt.user}
          </div>
          <div className="self-start max-w-[85%] rounded-2xl bg-slate-100 dark:bg-slate-700/50 px-4 py-3 text-slate-700 dark:text-slate-200">
            {txt.reply}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-4">
          {txt.question}
        </p>
        <div className="grid gap-3">
          {txt.options.map((opt, i) => {
            const isPicked = picked === i;
            const isRight = i === CORRECT;
            let cls =
              "text-left rounded-xl border px-4 py-3 transition text-slate-700 dark:text-slate-200 ";
            if (solved && isRight)
              cls += "border-green-500 bg-green-50 dark:bg-green-900/20";
            else if (isPicked && !isRight)
              cls += "border-red-400 bg-red-50 dark:bg-red-900/20";
            else
              cls +=
                "border-slate-200 dark:border-slate-700 hover:border-[var(--theme-primary)]";
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                className={cls}
              >
                {opt}
                {solved && isRight && (
                  <Check className="inline ml-2 text-green-600" size={16} />
                )}
                {isPicked && !isRight && (
                  <X className="inline ml-2 text-red-500" size={16} />
                )}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p
            className={`mt-4 text-sm font-medium ${
              solved
                ? "text-green-700 dark:text-green-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {solved ? txt.ok : txt.no}
          </p>
        )}
      </Card>

      {solved && (
        <div className="flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
          <Button onClick={onNext}>
            {txt.next} <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
