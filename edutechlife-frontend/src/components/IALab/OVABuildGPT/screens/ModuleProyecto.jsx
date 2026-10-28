import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { Bot, MessageSquare, CheckCircle, Zap, ArrowRight } from "lucide-react";
import { Button, Card } from "../shared";

ModuleProyecto.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
};

const SIM = {
  es: {
    room: "# Proyecto: mensajes a las familias",
    user: "Profe Ana",
    ask: "Escribe el mensaje para invitar a las familias a la reunión del sábado.",
    bot: "Asistente del Proyecto",
    reply:
      "Hola, familias de primaria. Las invitamos a la reunión del sábado a las 9:00 a. m. en el salón principal. Vamos a hablar de las actividades del mes. ¡Las esperamos!\n\n(Siguiendo tus instrucciones: tono cercano, menos de 60 palabras y sin nombres de estudiantes.)",
  },
  en: {
    room: "# Project: messages to families",
    user: "Teacher Ana",
    ask: "Write the message inviting families to Saturday's meeting.",
    bot: "Project assistant",
    reply:
      "Hello, primary-school families. We invite you to Saturday's meeting at 9:00 a.m. in the main hall. We will talk about this month's activities. We look forward to seeing you!\n\n(Following your instructions: warm tone, under 60 words and no student names.)",
  },
  pt: {
    room: "# Projeto: mensagens para as famílias",
    user: "Profa. Ana",
    ask: "Escreva a mensagem convidando as famílias para a reunião de sábado.",
    bot: "Assistente do Projeto",
    reply:
      "Olá, famílias do ensino fundamental. Convidamos vocês para a reunião de sábado, às 9h, no salão principal. Vamos falar das atividades do mês. Esperamos vocês!\n\n(Seguindo as suas instruções: tom próximo, menos de 60 palavras e sem nomes de estudantes.)",
  },
};

export default function ModuleProyecto({ onNext, addXp }) {
  const { t, locale } = useTranslation();
  const sim = SIM[locale] || SIM.es;
  const [messages, setMessages] = useState([
    { sender: sim.user, text: sim.ask, isBot: false },
  ]);
  const [simulated, setSimulated] = useState(false);

  const simulateIA = () => {
    setSimulated(true);
    addXp(100);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: sim.bot, text: sim.reply, isBot: true },
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <h2 className="text-3xl font-bold text-[var(--theme-emphasis)] mb-2">
        {t("ova.buildgpt.slack_title")}
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-6">
        {t("ova.buildgpt.slack_desc")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 flex flex-col justify-between">
          <div>
            <MessageSquare className="text-[var(--theme-primary)] w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-[var(--theme-emphasis)] mb-3">
              {t("ova.buildgpt.slack_what_title")}
            </h3>
            <ul className="space-y-3">
              {[
                t("ova.buildgpt.slack_item1"),
                t("ova.buildgpt.slack_item2"),
                t("ova.buildgpt.slack_item3"),
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300"
                >
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-0.5 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <Card className="col-span-2 bg-gray-50 dark:bg-slate-700/30 border-slate-300 dark:border-slate-600">
          <div className="border-b border-slate-300 dark:border-slate-600 pb-3 mb-4 flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {sim.room}
            </span>
          </div>
          <div className="space-y-4 mb-6 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 animate-[fadeIn_0.6s_ease-out_forwards] ${msg.isBot ? "bg-white dark:bg-slate-700 p-3 rounded-lg border border-[var(--theme-primary)]/20 dark:border-[var(--theme-primary)]/20 shadow-sm" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 ${msg.isBot ? "bg-[var(--theme-primary)]" : "bg-purple-600"}`}
                >
                  {msg.isBot ? <Bot size={18} /> : "A"}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {msg.sender}
                    {msg.isBot && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 rounded uppercase">
                        IA
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mt-1">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!simulated ? (
            <Button onClick={simulateIA} icon={Zap} className="w-full">
              {t("ova.buildgpt.slack_btn")}
            </Button>
          ) : (
            <Button onClick={onNext} variant="secondary" className="w-full">
              {t("ova.buildgpt.slack_next")} <ArrowRight size={16} />
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
