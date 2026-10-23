/**
 * ClaudeWelcome — Entorno de trabajo estilo Claude para el Módulo 5.
 * Recrea la pantalla de bienvenida (saludo, composer, tarjetas de acción) con
 * un chat funcional: el estudiante escribe y Max responde con orientación
 * del módulo. No usa logos ni marcas de Anthropic.
 */
import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { normalizeClaudeLocale } from "../../../data/ova/claudeModule";
import ClaudeLogo from "./ClaudeLogo";

const COPY = {
  es: {
    heading: "¿En qué quieres trabajar hoy?",
    sub: "Módulo 5 · Claude, el director de orquesta",
    intro1: "Claude ya no es solo un chat.",
    intro2:
      "Crea documentos y presentaciones, se conecta a tus herramientas y ejecuta tareas de varios pasos.",
    intro3:
      "En este módulo aprenderás a pedirle lo que necesitas, a revisar lo que entrega y a decidir qué nunca debes delegar.",
    placeholder: "Escribe tu pedido o tu duda sobre Claude…",
    send: "Enviar",
    guide: "Abrir la guía del módulo",
    cards: [
      {
        label: "Aprende a pedir bien",
        desc: "Objetivo, audiencia, formato, tono y restricciones",
        topic: 0,
      },
      {
        label: "Crea un documento",
        desc: "Artifacts: ideas convertidas en piezas listas",
        topic: 1,
      },
      {
        label: "Delega con Proyectos",
        desc: "Conectores, Skills y tareas recurrentes",
        topic: 2,
      },
      {
        label: "Practica el desafío",
        desc: "Clasifica, escribe un pedido y diseña el protocolo",
        action: "practica",
      },
    ],
    replies: {
      delegar:
        "Delega el trabajo de forma y los borradores. La decisión final, las cifras y la firma siguen siendo tuyas.",
      pedido:
        "Un buen pedido incluye: objetivo, audiencia, formato, tono y restricciones. Escríbelo y compáralo con el original.",
      artifact:
        "Un Artifact es un documento o pieza que editas al lado de la conversación. Pide cambios pequeños y compara versiones.",
      proyecto:
        "Un Proyecto guarda instrucciones y archivos de un mismo trabajo. Crea uno por tema.",
      default:
        "Cuéntame qué quieres lograr: el resultado, para quién es y cómo lo vas a usar. Así te ayudo mejor.",
    },
    you: "Tú",
    user: "Claude",
  },
  en: {
    heading: "What would you like to work on today?",
    sub: "Module 5 · Claude, the conductor",
    intro1: "Claude is no longer just a chat.",
    intro2:
      "It creates documents and presentations, connects to your tools and runs multi-step tasks.",
    intro3:
      "In this module you will learn to ask for what you need, review what it delivers and decide what you must never delegate.",
    placeholder: "Write your request or question about Claude…",
    send: "Send",
    guide: "Open the module guide",
    cards: [
      {
        label: "Learn to ask well",
        desc: "Goal, audience, format, tone and constraints",
        topic: 0,
      },
      {
        label: "Create a document",
        desc: "Artifacts: ideas turned into finished pieces",
        topic: 1,
      },
      {
        label: "Delegate with Projects",
        desc: "Connectors, Skills and recurring tasks",
        topic: 2,
      },
      {
        label: "Practice the challenge",
        desc: "Sort tasks, write a request and design the protocol",
        action: "practica",
      },
    ],
    replies: {
      delegar:
        "Delegate form and drafts. The final decision, the figures and the signature remain yours.",
      pedido:
        "A good request includes: goal, audience, format, tone and constraints. Write it and compare it with the original.",
      artifact:
        "An Artifact is a document or piece you edit next to the conversation. Ask for small changes and compare versions.",
      proyecto:
        "A Project keeps instructions and files for one piece of work. Create one per topic.",
      default:
        "Tell me what you want to achieve: the result, who it is for and how you will use it.",
    },
    you: "You",
    user: "Claude",
  },
  pt: {
    heading: "No que você quer trabalhar hoje?",
    sub: "Módulo 5 · Claude, o maestro",
    intro1: "O Claude já não é só um chat.",
    intro2:
      "Cria documentos e apresentações, conecta-se às suas ferramentas e executa tarefas de várias etapas.",
    intro3:
      "Neste módulo você vai aprender a pedir o que precisa, revisar o que ele entrega e decidir o que nunca delegar.",
    placeholder: "Escreva seu pedido ou dúvida sobre o Claude…",
    send: "Enviar",
    guide: "Abrir o guia do módulo",
    cards: [
      {
        label: "Aprenda a pedir bem",
        desc: "Objetivo, público, formato, tom e restrições",
        topic: 0,
      },
      {
        label: "Crie um documento",
        desc: "Artifacts: ideias transformadas em peças prontas",
        topic: 1,
      },
      {
        label: "Delegue com Projetos",
        desc: "Conectores, Skills e tarefas recorrentes",
        topic: 2,
      },
      {
        label: "Pratique o desafio",
        desc: "Classifique tarefas, escreva um pedido e desenhe o protocolo",
        action: "practica",
      },
    ],
    replies: {
      delegar:
        "Delegue a forma e os rascunhos. A decisão final, os números e a assinatura continuam sendo seus.",
      pedido:
        "Um bom pedido inclui: objetivo, público, formato, tom e restrições. Escreva e compare com o original.",
      artifact:
        "Um Artifact é um documento ou peça que você edita ao lado da conversa. Peça mudanças pequenas e compare versões.",
      proyecto:
        "Um Projeto guarda instruções e arquivos de um mesmo trabalho. Crie um por tema.",
      default:
        "Conte o que você quer alcançar: o resultado, para quem é e como vai usar.",
    },
    you: "Você",
    user: "Claude",
  },
};

const GUIDE_PDF = "/ialab-resources/modulo5/guia-claude-es.pdf";

const pickReply = (text, replies) => {
  const t = text.toLowerCase();
  if (/delegar|delegate|delegue/.test(t)) return replies.delegar;
  if (/pedido|prompt|pedir|request/.test(t)) return replies.pedido;
  if (/artifact|documento|presentaci/.test(t)) return replies.artifact;
  if (/proyecto|project|skill/.test(t)) return replies.proyecto;
  return replies.default;
};

export default function ClaudeWelcome({
  topics = [],
  onSelectSection,
  onSelectTopic,
  locale = "es",
}) {
  const lang = normalizeClaudeLocale(locale);
  const copy = COPY[lang];
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: pickReply(text, copy.replies) },
    ]);
    setDraft("");
  };

  return (
    <motion.div
      key="claude-welcome"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl pt-8 pb-4"
      data-testid="claude-welcome"
    >
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <ClaudeLogo size={44} />
        <h2
          className="text-3xl font-medium theme-text md:text-4xl"
          style={{ fontFamily: "var(--theme-font-display)" }}
        >
          {copy.heading}
        </h2>
        <p className="max-w-sm text-sm theme-text-muted">{copy.sub}</p>
      </div>

      <div className="mb-6 flex gap-3">
        <ClaudeLogo size={24} className="mt-1 flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <p className="text-sm font-semibold leading-snug theme-text">
            {copy.intro1}
          </p>
          <p className="text-sm leading-relaxed theme-text-muted">
            {copy.intro2}
          </p>
          <p className="text-sm leading-relaxed theme-text-muted">
            {copy.intro3}
          </p>
        </div>
      </div>

      {messages.length > 0 && (
        <div
          className="mb-6 space-y-4"
          aria-live="polite"
          data-testid="claude-thread"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#efeee7] text-[#141413]"
                    : "theme-text"
                }`}
              >
                <span className="mb-0.5 block text-xs font-semibold theme-text-muted">
                  {m.role === "user" ? copy.you : copy.user}
                </span>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        className="mb-6 flex items-end gap-2 rounded-2xl border border-[#e8e6dc] bg-white p-3 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          className="min-h-[2.5rem] flex-1 resize-none bg-transparent text-sm text-[#141413] outline-none placeholder:text-[#8f8d85]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="rounded-xl bg-[#c96442] px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
        >
          {copy.send}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {copy.cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() =>
              card.action
                ? onSelectSection(card.action)
                : onSelectTopic(card.topic)
            }
            disabled={!card.action && !topics[card.topic]}
            className="theme-prompt-card rounded-2xl border border-[#e8e6dc] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
          >
            <p
              className="text-sm font-semibold theme-text"
              style={{ fontFamily: "var(--theme-font)" }}
            >
              {card.label}
            </p>
            <p className="mt-0.5 text-xs theme-text-muted">{card.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href={GUIDE_PDF}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-[#c96442] underline-offset-4 hover:underline"
        >
          {copy.guide}
        </a>
      </div>
    </motion.div>
  );
}

ClaudeWelcome.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
  locale: PropTypes.string,
};
