import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Guía de selección de modelo de IA: criterios de costo, latencia,
 * privacidad y capacidades. Autocontenida, no afecta progreso ni XP.
 */

const CRITERIA_ICONS = ["fa-dollar-sign", "fa-bolt", "fa-lock", "fa-brain"];

const SCENARIOS_ES = [
  {
    id: "customer-service",
    title: "Soporte al cliente 24/7 en tiempo real",
    context:
      "Tu empresa recibe 1000+ preguntas diarias. Necesitas responder en menos de 2 segundos, el costo por respuesta es crítico, y algunos clientes piden no compartir datos con terceros.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "CRÍTICA", reason: "<2s por respuesta" },
      { name: "Costo", importance: "ALTA", reason: "1000+ consultas/día" },
      { name: "Privacidad", importance: "MEDIA", reason: "Algunos clientes exigen privacidad" },
      { name: "Capacidades", importance: "MEDIA", reason: "Preguntas rutinarias" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M tokens", latency: "~800ms", privacy: "Cloud", note: "Más caro pero confiable" },
      { model: "Gemini", cost: "$0.075/1M tokens", latency: "~600ms", privacy: "Cloud", note: "Más barato, latencia mejor" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~5s", privacy: "Cloud", note: "Lento, no apto para tiempo real" },
      { model: "Llama 3.1 (self-hosted)", cost: "GPU rental ~$1/h", latency: "~300ms", privacy: "On-premises", note: "Privacidad total, setup complejo" },
    ],
    expert: [
      "Latencia es lo primero: NotebookLM queda descartado (5s mínimo).",
      "Entre ChatGPT, Gemini y Llama self-hosted: Gemini gana en latencia (600ms) y costo bajo ($0.075/1M). ChatGPT es más confiable pero caro.",
      "Si privacidad es exigencia legal: Llama self-hosted en tu propia infraestructura, aunque requiere managing GPUs.",
      "Recomendación: Gemini como opción por defecto (costo-latencia), con ruta a Llama self-hosted si regulación lo exige.",
    ],
  },
  {
    id: "research-analysis",
    title: "Análisis profundo de documentos para research",
    context:
      "Investigas tendencias en 500+ artículos académicos por mes. Necesitas extracción precisa de datos, análisis comparativo, y poder procesar documentos de 50+ páginas. Presupuesto flexible.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "BAJA", reason: "Puede tomar minutos" },
      { name: "Costo", importance: "MEDIA", reason: "500+ docs, pero presupuesto existe" },
      { name: "Privacidad", importance: "BAJA", reason: "Documentos públicos o internos sensibles?" },
      { name: "Capacidades", importance: "CRÍTICA", reason: "Análisis profundo, extracción precisa" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.03/1K input", latency: "2-5s", privacy: "Cloud", note: "Mejor razonamiento, preciso" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "1-2s", privacy: "Cloud", note: "Rápido, pero menos profundo" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~2min/doc", privacy: "Cloud", note: "Hecho para esto: análisis + audio overviews" },
      { model: "Claude (via API)", cost: "$0.03/1K input", latency: "2-4s", privacy: "Cloud", note: "Bueno en análisis largo" },
    ],
    expert: [
      "NotebookLM está diseñado exactamente para esto: toma un documento largo y genera resumen + audio + insights automáticamente.",
      "Si necesitas extracción de datos estructurados: Claude o ChatGPT GPT-4 son más precisos. Si solo necesitas resumen: NotebookLM es la opción clara.",
      "Costo: para 500 docs/mes, NotebookLM = ~$40 (2 min/doc × 500), ChatGPT/Claude = ~$30-50 según tamaño.",
      "Recomendación: NotebookLM como flujo principal (resumen + audio para investigadores), con opción manual a Claude si necesitas datos estructurados en un doc.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Sistema de tutoría personalizado en tiempo real",
    context:
      "Educador usa IA para dar feedback personalizado a 30 estudiantes. Cada sesión dura 15 min, el modelo debe recordar el contexto del estudiante (errores previos, ritmo), y los datos de estudiantes no pueden salir de tu servidor.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "ALTA", reason: "Sesión en vivo, feedback inmediato" },
      { name: "Costo", importance: "MEDIA", reason: "30 estudiantes × 15 min/semana" },
      { name: "Privacidad", importance: "CRÍTICA", reason: "Datos sensibles de menores" },
      { name: "Capacidades", importance: "ALTA", reason: "Personalización y continuidad" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M", latency: "~800ms", privacy: "Cloud", note: "No cumple privacidad (datos a OpenAI)" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "~600ms", privacy: "Cloud", note: "Igual restricción de privacidad" },
      { model: "Llama 2/3.1 (self-hosted)", cost: "GPU ~$1/h", latency: "~300-500ms", privacy: "On-premises", note: "Cumple privacidad, latencia buena" },
      { model: "Mistral 7B (self-hosted)", cost: "GPU ~$0.5/h", latency: "~200-300ms", privacy: "On-premises", note: "Más rápido, menos contexto" },
    ],
    expert: [
      "Privacidad es no-negociable: cualquier cloud (ChatGPT, Gemini, NotebookLM) viola reglamentos de protección de menores en la mayoría de países.",
      "Opción obligatoria: self-hosted (Llama o Mistral) en tu infraestructura propia.",
      "Entre Llama y Mistral: Llama es mejor para tareas complejas (más contexto), Mistral es más rápido y usa menos GPU (mejor costo).",
      "Recomendación: Mistral 7B self-hosted (equilibrio costo-latencia-privacidad), con evaluación a Llama 13B si necesitas mejor comprensión de contexto.",
    ],
  },
  {
    id: "bulk-content",
    title: "Generación de contenido en lotes: 1000+ textos/mes",
    context:
      "Generas descripciones de productos, emails, posts de redes sociales. Volumen alto, calidad media-alta, cambios frecuentes en tono/estilo. Costo es muy importante.",
    decision: "¿Qué modelo elegirías y por qué?",
    criteria: [
      { name: "Latencia", importance: "BAJA", reason: "Batch, no en tiempo real" },
      { name: "Costo", importance: "CRÍTICA", reason: "1000+ textos/mes, presupuesto limitado" },
      { name: "Privacidad", importance: "BAJA", reason: "Contenido público, no sensible" },
      { name: "Capacidades", importance: "MEDIA", reason: "Generación de texto, versatilidad" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.50/1M", latency: "Batch OK", privacy: "Cloud", note: "Mejor calidad, más caro" },
      { model: "Gemini", cost: "$0.075/1M", latency: "Batch OK", privacy: "Cloud", note: "Más barato, buena calidad" },
      { model: "Llama 3.1 70B (self-hosted)", cost: "GPU ~$2/h", latency: "Batch OK", privacy: "On-premises", note: "Caro en compute, no rentable" },
      { model: "Open-source local (Mistral/Zephyr)", cost: "GPU barata ~$0.2/h", latency: "Batch OK", privacy: "On-premises", note: "Muy barato, calidad media" },
    ],
    expert: [
      "Volumen alto + costo crítico → Gemini gana (0.075/1M vs 0.50/1M de ChatGPT es 6-7x más barato).",
      "Self-hosted para lotes no es rentable: el costo de GPU rental por horas supera rápidamente a la API cloud.",
      "Calidad: Gemini es suficiente para descripción de productos/emails. Si necesitas mejor calidad, costo adicional de ChatGPT vale la pena solo si margen de producto lo permite.",
      "Recomendación: Gemini API con lotes (batch procesamiento es más barato aún), y A/B testing contra ChatGPT solo en casos de alta conversión.",
    ],
  },
];

const SCENARIOS_EN = [
  {
    id: "customer-service",
    title: "24/7 Customer Support in Real Time",
    context:
      "Your company receives 1000+ questions daily. You need answers in under 2 seconds, cost per answer is critical, and some customers demand data not be shared with third parties.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "CRITICAL", reason: "<2s per response" },
      { name: "Cost", importance: "HIGH", reason: "1000+ queries/day" },
      { name: "Privacy", importance: "MEDIUM", reason: "Some customers require it" },
      { name: "Capabilities", importance: "MEDIUM", reason: "Routine questions" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M tokens", latency: "~800ms", privacy: "Cloud", note: "Expensive but reliable" },
      { model: "Gemini", cost: "$0.075/1M tokens", latency: "~600ms", privacy: "Cloud", note: "Cheaper, better latency" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~5s", privacy: "Cloud", note: "Too slow, not real-time" },
      { model: "Llama 3.1 (self-hosted)", cost: "GPU rental ~$1/h", latency: "~300ms", privacy: "On-premises", note: "Full privacy, complex setup" },
    ],
    expert: [
      "Latency is first: NotebookLM is out (5s minimum).",
      "Between ChatGPT, Gemini, and Llama self-hosted: Gemini wins on latency (600ms) and cost ($0.075/1M). ChatGPT is more reliable but expensive.",
      "If privacy is a legal requirement: Llama self-hosted on your infrastructure, though it requires managing GPUs.",
      "Recommendation: Gemini as default (cost-latency balance), with path to Llama self-hosted if regulations demand it.",
    ],
  },
  {
    id: "research-analysis",
    title: "Deep Document Analysis for Research",
    context:
      "You analyze 500+ academic papers per month. You need precise data extraction, comparative analysis, and can process documents 50+ pages long. Budget is flexible.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "LOW", reason: "Can take minutes" },
      { name: "Cost", importance: "MEDIUM", reason: "500+ docs, but budget exists" },
      { name: "Privacy", importance: "LOW", reason: "Public documents or internal sensitive?" },
      { name: "Capabilities", importance: "CRITICAL", reason: "Deep analysis, precise extraction" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.03/1K input", latency: "2-5s", privacy: "Cloud", note: "Best reasoning, precise" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "1-2s", privacy: "Cloud", note: "Fast, but less deep" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~2min/doc", privacy: "Cloud", note: "Built for this: analysis + audio overviews" },
      { model: "Claude (via API)", cost: "$0.03/1K input", latency: "2-4s", privacy: "Cloud", note: "Good at long analysis" },
    ],
    expert: [
      "NotebookLM is designed exactly for this: takes a long document and auto-generates summary + audio + insights.",
      "If you need structured data extraction: Claude or ChatGPT GPT-4 are more precise. If just summaries: NotebookLM is the clear winner.",
      "Cost: for 500 docs/month, NotebookLM = ~$40 (2 min/doc × 500), ChatGPT/Claude = ~$30-50 depending on size.",
      "Recommendation: NotebookLM as main flow (summary + audio for researchers), with manual Claude fallback if you need structured data.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Personalized Real-Time Tutoring System",
    context:
      "Teacher uses AI to give personalized feedback to 30 students. Each session is 15 min, the model must remember the student's context (past errors, pace), and student data cannot leave your server.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "HIGH", reason: "Live session, immediate feedback" },
      { name: "Cost", importance: "MEDIUM", reason: "30 students × 15 min/week" },
      { name: "Privacy", importance: "CRITICAL", reason: "Sensitive child data" },
      { name: "Capabilities", importance: "HIGH", reason: "Personalization and continuity" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M", latency: "~800ms", privacy: "Cloud", note: "Fails privacy (data to OpenAI)" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "~600ms", privacy: "Cloud", note: "Same privacy restriction" },
      { model: "Llama 2/3.1 (self-hosted)", cost: "GPU ~$1/h", latency: "~300-500ms", privacy: "On-premises", note: "Meets privacy, good latency" },
      { model: "Mistral 7B (self-hosted)", cost: "GPU ~$0.5/h", latency: "~200-300ms", privacy: "On-premises", note: "Faster, less context" },
    ],
    expert: [
      "Privacy is non-negotiable: any cloud (ChatGPT, Gemini, NotebookLM) violates child protection regulations in most countries.",
      "Mandatory option: self-hosted (Llama or Mistral) on your own infrastructure.",
      "Between Llama and Mistral: Llama better for complex tasks (more context), Mistral faster and cheaper (less GPU).",
      "Recommendation: Mistral 7B self-hosted (cost-latency-privacy balance), evaluate Llama 13B if you need better context understanding.",
    ],
  },
  {
    id: "bulk-content",
    title: "Bulk Content Generation: 1000+ texts/month",
    context:
      "You generate product descriptions, emails, social media posts. High volume, medium-high quality, frequent tone/style changes. Cost is very important.",
    decision: "Which model would you choose and why?",
    criteria: [
      { name: "Latency", importance: "LOW", reason: "Batch, not real-time" },
      { name: "Cost", importance: "CRITICAL", reason: "1000+ texts/month, tight budget" },
      { name: "Privacy", importance: "LOW", reason: "Public content, not sensitive" },
      { name: "Capabilities", importance: "MEDIUM", reason: "Text generation, versatility" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.50/1M", latency: "Batch OK", privacy: "Cloud", note: "Best quality, pricey" },
      { model: "Gemini", cost: "$0.075/1M", latency: "Batch OK", privacy: "Cloud", note: "Cheaper, good quality" },
      { model: "Llama 3.1 70B (self-hosted)", cost: "GPU ~$2/h", latency: "Batch OK", privacy: "On-premises", note: "Expensive compute, not worth it" },
      { model: "Open-source local (Mistral/Zephyr)", cost: "Cheap GPU ~$0.2/h", latency: "Batch OK", privacy: "On-premises", note: "Very cheap, medium quality" },
    ],
    expert: [
      "High volume + cost critical → Gemini wins (0.075/1M vs 0.50/1M is 6-7x cheaper).",
      "Self-hosting for batches isn't cost-effective: GPU rental cost quickly exceeds cloud API.",
      "Quality: Gemini is fine for product descriptions/emails. Better quality from ChatGPT only worth it if product margin supports it.",
      "Recommendation: Gemini API with batch processing (even cheaper), A/B test ChatGPT only on high-conversion cases.",
    ],
  },
];

const SCENARIOS_PT = [
  {
    id: "customer-service",
    title: "Suporte ao Cliente 24/7 em Tempo Real",
    context:
      "Sua empresa recebe 1000+ perguntas diárias. Precisa responder em menos de 2 segundos, o custo por resposta é crítico, e alguns clientes exigem que dados não sejam compartilhados com terceiros.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "CRÍTICA", reason: "<2s por resposta" },
      { name: "Custo", importance: "ALTA", reason: "1000+ consultas/dia" },
      { name: "Privacidade", importance: "MÉDIA", reason: "Alguns clientes exigem" },
      { name: "Capacidades", importance: "MÉDIA", reason: "Perguntas rotineiras" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M tokens", latency: "~800ms", privacy: "Nuvem", note: "Caro mas confiável" },
      { model: "Gemini", cost: "$0.075/1M tokens", latency: "~600ms", privacy: "Nuvem", note: "Mais barato, latência melhor" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~5s", privacy: "Nuvem", note: "Lento, inadequado" },
      { model: "Llama 3.1 (auto-hospedado)", cost: "GPU ~$1/h", latency: "~300ms", privacy: "On-premises", note: "Privacidade total, complexo" },
    ],
    expert: [
      "Latência é o primeiro critério: NotebookLM está descartado (5s mínimo).",
      "Entre ChatGPT, Gemini e Llama auto-hospedado: Gemini vence em latência (600ms) e custo ($0.075/1M). ChatGPT é mais confiável mas caro.",
      "Se privacidade é exigência legal: Llama auto-hospedado na sua infraestrutura, embora exija gerenciar GPUs.",
      "Recomendação: Gemini como padrão (equilíbrio custo-latência), com caminho para Llama auto-hospedado se regulação exigir.",
    ],
  },
  {
    id: "research-analysis",
    title: "Análise Profunda de Documentos para Pesquisa",
    context:
      "Você analisa 500+ artigos acadêmicos por mês. Precisa extração precisa de dados, análise comparativa, e pode processar documentos de 50+ páginas. Orçamento é flexível.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "BAIXA", reason: "Pode levar minutos" },
      { name: "Custo", importance: "MÉDIA", reason: "500+ docs, mas orçamento existe" },
      { name: "Privacidade", importance: "BAIXA", reason: "Documentos públicos ou internos sensíveis?" },
      { name: "Capacidades", importance: "CRÍTICA", reason: "Análise profunda, extração precisa" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.03/1K input", latency: "2-5s", privacy: "Nuvem", note: "Melhor raciocínio, preciso" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "1-2s", privacy: "Nuvem", note: "Rápido, mas menos profundo" },
      { model: "NotebookLM", cost: "$0.008/min", latency: "~2min/doc", privacy: "Nuvem", note: "Feito para isso: análise + áudio" },
      { model: "Claude (via API)", cost: "$0.03/1K input", latency: "2-4s", privacy: "Nuvem", note: "Bom em análise longa" },
    ],
    expert: [
      "NotebookLM é projetado exatamente para isto: toma documento longo e gera automaticamente resumo + áudio + insights.",
      "Se precisa extração de dados estruturados: Claude ou ChatGPT GPT-4 são mais precisos. Se só resumo: NotebookLM é a opção clara.",
      "Custo: para 500 docs/mês, NotebookLM = ~$40 (2 min/doc × 500), ChatGPT/Claude = ~$30-50 conforme tamanho.",
      "Recomendação: NotebookLM como fluxo principal (resumo + áudio para pesquisadores), com opção manual a Claude se precisar dados estruturados.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Sistema de Tutoria Personalizada em Tempo Real",
    context:
      "Professor usa IA para dar feedback personalizado a 30 alunos. Cada sessão dura 15 min, o modelo deve lembrar contexto do aluno (erros prévios, ritmo), e dados não podem sair do seu servidor.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "ALTA", reason: "Sessão ao vivo, feedback imediato" },
      { name: "Custo", importance: "MÉDIA", reason: "30 alunos × 15 min/semana" },
      { name: "Privacidade", importance: "CRÍTICA", reason: "Dados sensíveis de menores" },
      { name: "Capacidades", importance: "ALTA", reason: "Personalização e continuidade" },
    ],
    options: [
      { model: "ChatGPT (API)", cost: "$0.50/1M", latency: "~800ms", privacy: "Nuvem", note: "Falha privacidade (dados para OpenAI)" },
      { model: "Gemini Advanced", cost: "$0.075/1M", latency: "~600ms", privacy: "Nuvem", note: "Mesma restrição privacidade" },
      { model: "Llama 2/3.1 (auto-hospedado)", cost: "GPU ~$1/h", latency: "~300-500ms", privacy: "On-premises", note: "Atende privacidade, latência boa" },
      { model: "Mistral 7B (auto-hospedado)", cost: "GPU ~$0.5/h", latency: "~200-300ms", privacy: "On-premises", note: "Mais rápido, menos contexto" },
    ],
    expert: [
      "Privacidade é inegociável: qualquer nuvem (ChatGPT, Gemini, NotebookLM) viola regulações de proteção de menores na maioria dos países.",
      "Opção obrigatória: auto-hospedado (Llama ou Mistral) na sua infraestrutura própria.",
      "Entre Llama e Mistral: Llama melhor para tarefas complexas (mais contexto), Mistral mais rápido e usa menos GPU (melhor custo).",
      "Recomendação: Mistral 7B auto-hospedado (equilíbrio custo-latência-privacidade), avaliar Llama 13B se precisar melhor compreensão de contexto.",
    ],
  },
  {
    id: "bulk-content",
    title: "Geração de Conteúdo em Lotes: 1000+ textos/mês",
    context:
      "Você gera descrições de produtos, emails, posts de redes sociais. Volume alto, qualidade média-alta, mudanças frequentes em tom/estilo. Custo é muito importante.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "BAIXA", reason: "Lote, não tempo real" },
      { name: "Custo", importance: "CRÍTICA", reason: "1000+ textos/mês, orçamento limitado" },
      { name: "Privacidade", importance: "BAIXA", reason: "Conteúdo público, não sensível" },
      { name: "Capacidades", importance: "MÉDIA", reason: "Geração de texto, versatilidade" },
    ],
    options: [
      { model: "ChatGPT (GPT-4)", cost: "$0.50/1M", latency: "Lote OK", privacy: "Nuvem", note: "Melhor qualidade, caro" },
      { model: "Gemini", cost: "$0.075/1M", latency: "Lote OK", privacy: "Nuvem", note: "Mais barato, boa qualidade" },
      { model: "Llama 3.1 70B (auto-hospedado)", cost: "GPU ~$2/h", latency: "Lote OK", privacy: "On-premises", note: "Caro compute, não rentável" },
      { model: "Open-source local (Mistral/Zephyr)", cost: "GPU barata ~$0.2/h", latency: "Lote OK", privacy: "On-premises", note: "Muito barato, qualidade média" },
    ],
    expert: [
      "Volume alto + custo crítico → Gemini vence (0.075/1M vs 0.50/1M é 6-7x mais barato).",
      "Auto-hospedado para lotes não é rentável: custo GPU rental por horas supera rápido API nuvem.",
      "Qualidade: Gemini é suficiente para descrição de produtos/emails. Melhor qualidade de ChatGPT só vale se margem do produto permite.",
      "Recomendação: Gemini API com processamento em lotes (ainda mais barato), teste A/B ChatGPT só em casos alta conversão.",
    ],
  },
];

export default function ModelSelectionGuide() {
  const { t, locale } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [showExpert, setShowExpert] = useState(false);

  const scenarios = useMemo(() => {
    if (locale === "en") return SCENARIOS_EN;
    if (locale === "pt") return SCENARIOS_PT;
    return SCENARIOS_ES;
  }, [locale]);

  const currentScenario = scenarios[selectedScenario];

  const handleCriterionClick = useCallback(
    (index) => {
      setExpandedCriteria(expandedCriteria === index ? null : index);
    },
    [expandedCriteria],
  );

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {locale === "en"
            ? "AI Model Selection Guide"
            : locale === "pt"
              ? "Guia de Seleção de Modelo de IA"
              : "Guía de Selección de Modelo de IA"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {locale === "en"
            ? "Learn when to use ChatGPT, Gemini, NotebookLM, and open-source alternatives"
            : locale === "pt"
              ? "Aprenda quando usar ChatGPT, Gemini, NotebookLM e alternativas open-source"
              : "Aprende cuándo usar ChatGPT, Gemini, NotebookLM y alternativas open-source"}
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 gap-2">
        {scenarios.map((scenario, idx) => (
          <motion.button
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(idx);
              setShowExpert(false);
              setExpandedCriteria(null);
            }}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedScenario === idx
                ? "bg-teal-500 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {scenario.title}
          </motion.button>
        ))}
      </div>

      {/* Current Scenario */}
      <motion.div
        key={currentScenario.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700 space-y-4"
      >
        {/* Context */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
            {locale === "en" ? "Context" : locale === "pt" ? "Contexto" : "Contexto"}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentScenario.context}
          </p>
        </div>

        {/* Criteria */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            {locale === "en" ? "Decision Criteria" : locale === "pt" ? "Critérios de Decisão" : "Criterios de Decisión"}
          </p>
          <div className="space-y-2">
            {currentScenario.criteria.map((criterion, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleCriterionClick(idx)}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{criterion.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{criterion.reason}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    criterion.importance === "CRITICAL" || criterion.importance === "CRÍTICA"
                      ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      : criterion.importance === "HIGH" || criterion.importance === "ALTA"
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  }`}>
                    {criterion.importance}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            {locale === "en" ? "Model Options" : locale === "pt" ? "Opções de Modelo" : "Opciones de Modelo"}
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentScenario.options.map((option, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-50">{option.model}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en" ? "Cost: " : locale === "pt" ? "Custo: " : "Costo: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">{option.cost}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en" ? "Latency: " : locale === "pt" ? "Latência: " : "Latencia: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">{option.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {locale === "en" ? "Privacy: " : locale === "pt" ? "Privacidade: " : "Privacidad: "}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-50">{option.privacy}</span>
                  </div>
                </div>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">{option.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Answer Toggle */}
        <motion.button
          onClick={() => setShowExpert(!showExpert)}
          className="w-full p-3 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-medium text-sm hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showExpert
            ? locale === "en"
              ? "Hide Expert Solution"
              : locale === "pt"
                ? "Ocultar Solução Experta"
                : "Ocultar Solución Experta"
            : locale === "en"
              ? "Reveal Expert Solution"
              : locale === "pt"
                ? "Revelar Solução Experta"
                : "Revelar Solución Experta"}
        </motion.button>

        {/* Expert Solution */}
        <AnimatePresence>
          {showExpert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              {currentScenario.expert.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {locale === "en" ? "Step" : locale === "pt" ? "Passo" : "Paso"} {idx + 1}:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {locale === "en"
          ? "💡 This is an interactive guide. Choose scenarios, explore criteria, and learn the trade-offs between models."
          : locale === "pt"
            ? "💡 Este é um guia interativo. Escolha cenários, explore critérios e aprenda os trade-offs entre modelos."
            : "💡 Esta es una guía interactiva. Elige escenarios, explora criterios y aprende los trade-offs entre modelos."}
      </p>
    </div>
  );
}
