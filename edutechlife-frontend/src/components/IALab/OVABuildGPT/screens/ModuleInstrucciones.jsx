import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import {
  Mail,
  FileText,
  Database,
  Lightbulb,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button, Card } from "../shared";

ModuleInstrucciones.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
};

const TEXTS = {
  es: {
    to: "Instrucciones del Proyecto",
    weak: "Responde cosas del colegio.",
    strong:
      "Eres el asistente de comunicaciones de un colegio de primaria.\nEscribes para las familias, con tono cercano y frases cortas.\nNunca incluyas nombres ni datos de estudiantes.\nSi falta una fecha o un lugar, pregúntame antes de responder.\nEntrega mensajes de máximo 60 palabras.",
  },
  en: {
    to: "Project instructions",
    weak: "Answer school stuff.",
    strong:
      "You are the communications assistant of a primary school.\nYou write for families, in a warm tone and short sentences.\nNever include students' names or data.\nIf a date or place is missing, ask me before answering.\nDeliver messages of 60 words at most.",
  },
  pt: {
    to: "Instruções do Projeto",
    weak: "Responda coisas da escola.",
    strong:
      "Você é o assistente de comunicação de uma escola de ensino fundamental.\nEscreve para as famílias, em tom próximo e frases curtas.\nNunca inclua nomes nem dados de estudantes.\nSe faltar uma data ou um local, pergunte antes de responder.\nEntregue mensagens de no máximo 60 palavras.",
  },
};

export default function ModuleInstrucciones({ onNext, addXp }) {
  const { t, locale } = useTranslation();
  const txt = TEXTS[locale] || TEXTS.es;
  const [emailText, setEmailText] = useState(txt.weak);
  const [improved, setImproved] = useState(false);

  const improveText = () => {
    setImproved(true);
    addXp(100);
    setEmailText(txt.strong);
  };

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <h2 className="text-3xl font-bold text-[var(--theme-emphasis)] mb-2">
        {t("ova.buildgpt.google_title")}
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-6">
        {t("ova.buildgpt.google_desc")}
      </p>
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Mail className="text-red-500" />
            <FileText className="text-blue-500" />
            <Database className="text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-700/50 px-4 py-2 border-b dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 flex gap-2">
            <span>{txt.to}</span>
          </div>
          <div className="p-4">
            <textarea
              className="w-full h-40 p-2 border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-300 bg-transparent"
              value={emailText}
              readOnly
            />
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/30 p-3 border-t dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {t("ova.buildgpt.google_draft")}
            </span>
            {!improved ? (
              <Button
                onClick={improveText}
                variant="secondary"
                className="!py-1.5 !px-4 text-sm"
                icon={Lightbulb}
              >
                {t("ova.buildgpt.google_improve")}
              </Button>
            ) : (
              <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1">
                <Check size={16} /> {t("ova.buildgpt.google_optimized")}
              </span>
            )}
          </div>
        </div>
      </Card>
      {improved && (
        <div className="flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
          <Button onClick={onNext}>
            {t("ova.buildgpt.google_next")} <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
