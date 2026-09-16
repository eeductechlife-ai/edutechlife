import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Práctica guiada de razonamiento en cadena (Chain-of-Thought).
 * Herramienta autocontenida: no llama a ningún modelo ni afecta
 * moduleProgress/XP — es una guía de práctica, no una evaluación.
 */

const STEP_ICONS = ["fa-magnifying-glass", "fa-puzzle-piece", "fa-hammer", "fa-check-double"];

const SCENARIOS_ES = [
  {
    id: "reporte",
    title: "El informe imposible",
    prompt:
      '"Necesito un informe para la junta directiva sobre por qué bajaron las ventas este trimestre, qué hacer al respecto, y que quede listo para mañana."',
    steps: [
      "¿Qué pide realmente esta persona? Sepára el pedido en sus partes.",
      "¿Qué datos o contexto te faltan para responder bien? Enuméralos.",
      "Resuelve cada parte por separado, en orden.",
      "Combina las partes en una respuesta final coherente.",
    ],
    expert: [
      "Pide 3 cosas distintas: (1) diagnóstico de la caída en ventas, (2) un plan de acción, (3) un formato ejecutivo con plazo fijo.",
      "Faltan: el rango de fechas exacto, si hay datos de ventas por categoría/región, y si la junta prefiere un documento o una presentación.",
      "Primero se resuelve el diagnóstico (causas), luego el plan de acción (con base en esas causas), y al final el formato — nunca al revés.",
      "Un informe ejecutivo de una página: 3 causas priorizadas + 3 acciones concretas con dueño y fecha, listo para revisar antes de la junta.",
    ],
  },
  {
    id: "bug",
    title: "El bug que nadie entiende",
    prompt:
      '"La app se cae a veces para algunos usuarios y no sabemos por qué, arréglalo."',
    steps: [
      "¿Qué información concreta falta para poder investigar esto?",
      "¿Cómo reducirías el problema a casos más pequeños y verificables?",
      "¿Qué harías primero: reproducir, aislar, o revisar logs? ¿Por qué ese orden?",
      "¿Cómo verificarías que la solución realmente funcionó y no rompió nada más?",
    ],
    expert: [
      "Falta: mensaje de error exacto, dispositivo/navegador, frecuencia, y si hay un patrón (hora, acción previa, tipo de usuario).",
      "Dividir en: ¿pasa en todos los dispositivos o solo algunos? ¿pasa siempre después de la misma acción? ¿es reciente o siempre existió?",
      "Primero revisar logs (barato y rápido), luego intentar reproducir con los datos del log, y solo al final aislar el código sospechoso.",
      "Confirmar el fix con los mismos pasos que causaban el error, además de correr las pruebas automáticas existentes para descartar efectos secundarios.",
    ],
  },
  {
    id: "campaña",
    title: "La campaña que debe funcionar sí o sí",
    prompt:
      '"Lanza una campaña de marketing que nos traiga clientes nuevos, tenemos poco presupuesto y hay que hacerlo ya."',
    steps: [
      "¿Qué significa \"funcionar\" aquí? ¿Qué métrica define el éxito?",
      "¿Qué restricciones reales tienes (presupuesto, tiempo, canal) y cómo limitan las opciones?",
      "¿Qué 2-3 alternativas concretas caben dentro de esas restricciones?",
      "¿Cuál eliges y con qué justificación medible?",
    ],
    expert: [
      "\"Funcionar\" debería traducirse en un número: ej. 50 leads calificados en 30 días, no solo \"más clientes\".",
      "Presupuesto bajo + urgencia descarta canales pagos caros (TV, vallas) y favorece canales orgánicos o de bajo costo con retorno rápido.",
      "Ej: (1) campaña de referidos con incentivo, (2) contenido orgánico en el canal donde ya está tu audiencia, (3) email a base existente.",
      "La opción con menor costo de adquisición esperado y que puedas medir en la primera semana, no la que \"suena\" mejor.",
    ],
  },
];

const SCENARIOS_EN = [
  {
    id: "reporte",
    title: "The impossible report",
    prompt:
      '"I need a report for the board about why sales dropped this quarter, what to do about it, and it needs to be ready by tomorrow."',
    steps: [
      "What is this person actually asking for? Split the request into its parts.",
      "What data or context are you missing to answer well? List it.",
      "Solve each part separately, in order.",
      "Combine the parts into one coherent final answer.",
    ],
    expert: [
      "It asks for 3 different things: (1) diagnosis of the sales drop, (2) an action plan, (3) an executive format with a fixed deadline.",
      "Missing: the exact date range, whether sales data exists by category/region, and whether the board prefers a document or a slide deck.",
      "Solve the diagnosis first (causes), then the action plan (based on those causes), and the format last — never the other way around.",
      "A one-page executive report: 3 prioritized causes + 3 concrete actions with an owner and a date, ready to review before the meeting.",
    ],
  },
  {
    id: "bug",
    title: "The bug nobody understands",
    prompt: '"The app crashes sometimes for some users and we don\'t know why, fix it."',
    steps: [
      "What concrete information is missing to investigate this?",
      "How would you break the problem into smaller, verifiable cases?",
      "What would you do first: reproduce, isolate, or check logs? Why that order?",
      "How would you verify the fix actually worked and didn't break anything else?",
    ],
    expert: [
      "Missing: the exact error message, device/browser, frequency, and whether there's a pattern (time, prior action, user type).",
      "Split into: does it happen on all devices or only some? does it always follow the same action? is it new or has it always happened?",
      "Check logs first (cheap and fast), then try to reproduce using what the logs show, and only then isolate the suspect code.",
      "Confirm the fix with the same steps that caused the error, plus running the existing automated tests to rule out side effects.",
    ],
  },
  {
    id: "campaña",
    title: "The campaign that has to work",
    prompt:
      '"Launch a marketing campaign that brings us new customers, we have little budget and need it now."',
    steps: [
      "What does \"work\" mean here? What metric defines success?",
      "What real constraints do you have (budget, time, channel) and how do they limit the options?",
      "What 2-3 concrete alternatives fit within those constraints?",
      "Which one do you pick, and with what measurable justification?",
    ],
    expert: [
      "\"Work\" should translate into a number: e.g. 50 qualified leads in 30 days, not just \"more customers\".",
      "Low budget + urgency rules out expensive paid channels (TV, billboards) and favors organic or low-cost, fast-return channels.",
      "E.g.: (1) referral campaign with an incentive, (2) organic content where your audience already is, (3) email to your existing list.",
      "The option with the lowest expected acquisition cost that you can measure within the first week — not the one that \"sounds\" best.",
    ],
  },
];

const SCENARIOS_PT = [
  {
    id: "reporte",
    title: "O relatório impossível",
    prompt:
      '"Preciso de um relatório para a diretoria sobre por que as vendas caíram neste trimestre, o que fazer a respeito, e precisa estar pronto amanhã."',
    steps: [
      "O que essa pessoa está realmente pedindo? Separe o pedido em partes.",
      "Que dados ou contexto estão faltando para responder bem? Liste-os.",
      "Resolva cada parte separadamente, em ordem.",
      "Combine as partes em uma resposta final coerente.",
    ],
    expert: [
      "Pede 3 coisas diferentes: (1) diagnóstico da queda nas vendas, (2) um plano de ação, (3) um formato executivo com prazo fixo.",
      "Faltam: o período exato, se há dados de vendas por categoria/região, e se a diretoria prefere um documento ou uma apresentação.",
      "Primeiro resolva o diagnóstico (causas), depois o plano de ação (com base nessas causas), e por último o formato — nunca o contrário.",
      "Um relatório executivo de uma página: 3 causas priorizadas + 3 ações concretas com responsável e data, pronto para revisar antes da reunião.",
    ],
  },
  {
    id: "bug",
    title: "O bug que ninguém entende",
    prompt: '"O app trava às vezes para alguns usuários e não sabemos por quê, conserte."',
    steps: [
      "Que informação concreta falta para investigar isso?",
      "Como você dividiria o problema em casos menores e verificáveis?",
      "O que você faria primeiro: reproduzir, isolar, ou checar logs? Por que essa ordem?",
      "Como você verificaria que a correção realmente funcionou e não quebrou mais nada?",
    ],
    expert: [
      "Falta: a mensagem de erro exata, dispositivo/navegador, frequência, e se há um padrão (horário, ação anterior, tipo de usuário).",
      "Dividir em: acontece em todos os dispositivos ou só em alguns? sempre depois da mesma ação? é recente ou sempre existiu?",
      "Primeiro checar os logs (barato e rápido), depois tentar reproduzir com os dados do log, e só então isolar o código suspeito.",
      "Confirmar a correção com os mesmos passos que causavam o erro, além de rodar os testes automatizados existentes para descartar efeitos colaterais.",
    ],
  },
  {
    id: "campaña",
    title: "A campanha que precisa funcionar",
    prompt:
      '"Lance uma campanha de marketing que traga novos clientes, temos pouco orçamento e precisa ser agora."',
    steps: [
      "O que significa \"funcionar\" aqui? Qual métrica define o sucesso?",
      "Quais restrições reais você tem (orçamento, tempo, canal) e como elas limitam as opções?",
      "Quais 2-3 alternativas concretas cabem dentro dessas restrições?",
      "Qual você escolhe e com qual justificativa mensurável?",
    ],
    expert: [
      "\"Funcionar\" deveria virar um número: ex. 50 leads qualificados em 30 dias, não apenas \"mais clientes\".",
      "Orçamento baixo + urgência descarta canais pagos caros (TV, outdoors) e favorece canais orgânicos ou de baixo custo com retorno rápido.",
      "Ex: (1) campanha de indicação com incentivo, (2) conteúdo orgânico no canal onde seu público já está, (3) e-mail para a base existente.",
      "A opção com menor custo de aquisição esperado e que você consiga medir na primeira semana — não a que \"parece\" melhor.",
    ],
  },
];

const SCENARIOS_BY_LOCALE = { es: SCENARIOS_ES, en: SCENARIOS_EN, pt: SCENARIOS_PT };

const COMPLETED_KEY = "ialab_cot_trainer_completed";

const readCompleted = () => {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]");
  } catch {
    return [];
  }
};

const markCompleted = (scenarioId) => {
  try {
    const current = readCompleted();
    if (!current.includes(scenarioId)) {
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([...current, scenarioId]));
    }
  } catch {
    /* almacenamiento no disponible */
  }
};

const ChainOfThoughtTrainer = () => {
  const { t, locale } = useTranslation();
  const scenarios = useMemo(
    () => SCENARIOS_BY_LOCALE[locale] || SCENARIOS_ES,
    [locale],
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(readCompleted);

  const scenario = scenarios[activeIdx];

  const selectScenario = useCallback((idx) => {
    setActiveIdx(idx);
    setAnswers(["", "", "", ""]);
    setRevealed(false);
  }, []);

  const handleAnswerChange = useCallback((stepIdx, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIdx] = value;
      return next;
    });
  }, []);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    markCompleted(scenario.id);
    setCompleted(readCompleted());
  }, [scenario]);

  const hasWrittenSomething = answers.some((a) => a.trim().length > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-gradient-to-r from-[var(--theme-primary)]/8 to-[var(--theme-emphasis)]/8 border border-[var(--theme-primary)]/15 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center flex-shrink-0">
            <Icon name="fa-diagram-project" className="text-[var(--theme-primary)] text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {t("ialab.cot_trainer.title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {t("ialab.cot_trainer.intro")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {scenarios.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => selectScenario(idx)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              idx === activeIdx
                ? "bg-[var(--theme-primary)] text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {completed.includes(s.id) && (
              <Icon name="fa-check-circle" className="text-[10px]" />
            )}
            {s.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {t("ialab.cot_trainer.prompt_label")}
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
          {scenario.prompt}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {scenario.steps.map((stepLabel, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mt-0.5">
              <Icon name={STEP_ICONS[idx]} className="text-slate-500 dark:text-slate-300 text-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                {t("ialab.cot_trainer.step_n", { n: idx + 1 })} — {stepLabel}
              </p>
              <textarea
                value={answers[idx]}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                rows={2}
                placeholder={t("ialab.cot_trainer.step_placeholder")}
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30 resize-none text-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
        ))}
      </div>

      {!revealed ? (
        <button
          onClick={handleReveal}
          disabled={!hasWrittenSomething}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--theme-primary)] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <Icon name="fa-eye" className="text-xs" />
          {t("ialab.cot_trainer.reveal_btn")}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
              {t("ialab.cot_trainer.expert_label")}
            </p>
            <ol className="flex flex-col gap-2">
              {scenario.expert.map((line, idx) => (
                <li key={idx} className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  <span className="font-bold">{idx + 1}.</span> {line}
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChainOfThoughtTrainer;
