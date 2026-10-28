// Datos compartidos del módulo 5 (Claude): OVAs y desafío.
// Cada respuesta correcta lleva su razón, para que la retroalimentación sea pedagógica.

export const DELEGATION_ANSWERS = ["delegate", "review", "never"];

const TASKS = {
  es: [
    {
      id: "t1",
      task: "Ordenar por tema las ideas que anotaste en una lluvia de ideas",
      answer: "delegate",
      why: "Es de forma, son tus propias ideas y no sale a terceros.",
    },
    {
      id: "t2",
      task: "Redactar el boletín mensual para las familias con las fechas del calendario aprobado",
      answer: "review",
      why: "Sale a terceros y lleva fechas: revisa que coincidan con el calendario antes de enviarlo.",
    },
    {
      id: "t3",
      task: "Decidir qué estudiantes reciben la beca de transporte según un análisis de Claude",
      answer: "never",
      why: "Decide sobre personas y dinero: Claude puede ordenar la información, pero la decisión es tuya.",
    },
    {
      id: "t4",
      task: "Convertir en tabla tus notas de una reunión interna",
      answer: "delegate",
      why: "Es de forma, con tus propios datos y para uso interno.",
    },
    {
      id: "t5",
      task: "Resumir una encuesta a padres que incluye nombres y teléfonos",
      answer: "review",
      why: "Tiene datos personales: anonimízalos o ten autorización antes de compartirlos con Claude (Ley 1581 de 2012) y revisa el resumen.",
    },
    {
      id: "t6",
      task: "Aceptar en nombre del colegio los términos de un contrato con un proveedor",
      answer: "never",
      why: "Compromete legalmente al colegio: la aceptación y la firma son de una persona responsable.",
    },
  ],
  en: [
    {
      id: "t1",
      task: "Group by topic the ideas you wrote down in a brainstorm",
      answer: "delegate",
      why: "It is about form, they are your own ideas and nothing goes to third parties.",
    },
    {
      id: "t2",
      task: "Write the monthly newsletter for families with the dates from the approved calendar",
      answer: "review",
      why: "It goes to third parties and has dates: check they match the calendar before sending.",
    },
    {
      id: "t3",
      task: "Decide which students get the transport grant based on an analysis by Claude",
      answer: "never",
      why: "It decides about people and money: Claude can organize the information, but the decision is yours.",
    },
    {
      id: "t4",
      task: "Turn your notes from an internal meeting into a table",
      answer: "delegate",
      why: "It is about form, with your own data and for internal use.",
    },
    {
      id: "t5",
      task: "Summarize a parent survey that includes names and phone numbers",
      answer: "review",
      why: "It has personal data: anonymize it or have authorization before sharing it with Claude, and review the summary.",
    },
    {
      id: "t6",
      task: "Accept, on behalf of the school, the terms of a contract with a supplier",
      answer: "never",
      why: "It legally commits the school: acceptance and signature belong to a responsible person.",
    },
  ],
  pt: [
    {
      id: "t1",
      task: "Organizar por tema as ideias que você anotou em um brainstorming",
      answer: "delegate",
      why: "É de forma, são as suas próprias ideias e não vai para terceiros.",
    },
    {
      id: "t2",
      task: "Redigir o boletim mensal para as famílias com as datas do calendário aprovado",
      answer: "review",
      why: "Vai para terceiros e tem datas: confira se coincidem com o calendário antes de enviar.",
    },
    {
      id: "t3",
      task: "Decidir quais alunos recebem a bolsa de transporte com base em uma análise do Claude",
      answer: "never",
      why: "Decide sobre pessoas e dinheiro: o Claude pode organizar a informação, mas a decisão é sua.",
    },
    {
      id: "t4",
      task: "Transformar em tabela as suas anotações de uma reunião interna",
      answer: "delegate",
      why: "É de forma, com os seus próprios dados e para uso interno.",
    },
    {
      id: "t5",
      task: "Resumir uma pesquisa com pais que inclui nomes e telefones",
      answer: "review",
      why: "Tem dados pessoais: anonimize-os ou tenha autorização antes de compartilhar com o Claude e revise o resumo.",
    },
    {
      id: "t6",
      task: "Aceitar, em nome da escola, os termos de um contrato com um fornecedor",
      answer: "never",
      why: "Compromete legalmente a escola: a aceitação e a assinatura são de uma pessoa responsável.",
    },
  ],
};

const BRIEF_ELEMENTS = {
  es: [
    {
      key: "objetivo",
      label: "Objetivo",
      hint: "¿Qué debe lograr el resultado?",
    },
    {
      key: "audiencia",
      label: "Audiencia",
      hint: "¿Quién lo va a leer o usar?",
    },
    {
      key: "formato",
      label: "Formato",
      hint: "Documento, diapositivas, tabla, pieza interactiva, longitud.",
    },
    {
      key: "tono",
      label: "Tono",
      hint: "Formal, cercano, técnico, de ventas.",
    },
    {
      key: "restricciones",
      label: "Límites",
      hint: "Qué no debe incluir, datos a usar, límites.",
    },
  ],
  en: [
    { key: "objetivo", label: "Goal", hint: "What should the result achieve?" },
    { key: "audiencia", label: "Audience", hint: "Who will read or use it?" },
    {
      key: "formato",
      label: "Format",
      hint: "Document, slides, table, interactive piece, length.",
    },
    { key: "tono", label: "Tone", hint: "Formal, warm, technical, sales." },
    {
      key: "restricciones",
      label: "Limits",
      hint: "What to leave out, data to use, limits.",
    },
  ],
  pt: [
    {
      key: "objetivo",
      label: "Objetivo",
      hint: "O que o resultado deve alcançar?",
    },
    { key: "audiencia", label: "Público", hint: "Quem vai ler ou usar?" },
    {
      key: "formato",
      label: "Formato",
      hint: "Documento, slides, tabela, peça interativa, extensão.",
    },
    { key: "tono", label: "Tom", hint: "Formal, cordial, técnico, de vendas." },
    {
      key: "restricciones",
      label: "Limites",
      hint: "O que não incluir, dados a usar, limites.",
    },
  ],
};

export const normalizeClaudeLocale = (locale = "es") => {
  if (String(locale).startsWith("en")) return "en";
  if (String(locale).startsWith("pt")) return "pt";
  return "es";
};

export const getClaudeTasks = (locale) => TASKS[normalizeClaudeLocale(locale)];
export const getBriefElements = (locale) =>
  BRIEF_ELEMENTS[normalizeClaudeLocale(locale)];
