// Datos compartidos del módulo 5 (Claude): OVAs y desafío.
// Cada respuesta correcta lleva su razón, para que la retroalimentación sea pedagógica.

export const DELEGATION_ANSWERS = ["delegate", "review", "never"];

const TASKS = {
  es: [
    { id: "t1", task: "Resumir un informe de 30 páginas para la junta directiva", answer: "review", why: "Claude resume rápido, pero las cifras y conclusiones se verifican contra la fuente original." },
    { id: "t2", task: "Dar formato a una plantilla de acta de reunión que ya aprobaste", answer: "delegate", why: "Es una tarea de forma, sin decisión de fondo: ideal para delegar." },
    { id: "t3", task: "Decidir si despides a un colaborador con base en un análisis automático", answer: "never", why: "Las decisiones sobre personas requieren criterio, responsabilidad y contexto humano." },
    { id: "t4", task: "Preparar borradores de respuesta a correos de clientes para que tú los revises", answer: "review", why: "Delegas el borrador; la respuesta final y su envío siguen siendo tuyos." },
    { id: "t5", task: "Clasificar 200 correos de prueba por tema y prioridad", answer: "delegate", why: "Es repetitiva y de bajo riesgo. Conviene revisar una muestra para comprobar el resultado." },
    { id: "t6", task: "Firmar un contrato o enviar una oferta legal en nombre de la empresa", answer: "never", why: "Las obligaciones legales requieren la firma y la revisión de una persona responsable." },
  ],
  en: [
    { id: "t1", task: "Summarize a 30-page report for the board of directors", answer: "review", why: "Claude summarizes fast, but figures and conclusions must be checked against the original source." },
    { id: "t2", task: "Format a meeting-minutes template you already approved", answer: "delegate", why: "It is a formatting task with no substantive decision: ideal to delegate." },
    { id: "t3", task: "Decide whether to dismiss an employee based on an automated analysis", answer: "never", why: "Decisions about people require human judgment, accountability and context." },
    { id: "t4", task: "Draft replies to client emails for you to review", answer: "review", why: "You delegate the draft; the final reply and sending it remain yours." },
    { id: "t5", task: "Sort 200 test emails by topic and priority", answer: "delegate", why: "It is repetitive and low risk. Review a sample to check the result." },
    { id: "t6", task: "Sign a contract or send a legal offer on behalf of the company", answer: "never", why: "Legal obligations require signature and review by a responsible person." },
  ],
  pt: [
    { id: "t1", task: "Resumir um relatório de 30 páginas para o conselho", answer: "review", why: "O Claude resume rápido, mas números e conclusões devem ser conferidos na fonte original." },
    { id: "t2", task: "Dar formato a um modelo de ata de reunião que você já aprovou", answer: "delegate", why: "É uma tarefa de forma, sem decisão de fundo: ideal para delegar." },
    { id: "t3", task: "Decidir demitir um colaborador com base em uma análise automática", answer: "never", why: "Decisões sobre pessoas exigem critério, responsabilidade e contexto humano." },
    { id: "t4", task: "Preparar rascunhos de resposta a e-mails de clientes para você revisar", answer: "review", why: "Você delega o rascunho; a resposta final e o envio continuam sendo seus." },
    { id: "t5", task: "Classificar 200 e-mails de teste por tema e prioridade", answer: "delegate", why: "É repetitiva e de baixo risco. Revise uma amostra para conferir o resultado." },
    { id: "t6", task: "Assinar um contrato ou enviar uma proposta legal em nome da empresa", answer: "never", why: "Obrigações legais exigem assinatura e revisão de uma pessoa responsável." },
  ],
};

const BRIEF_ELEMENTS = {
  es: [
    { key: "objetivo", label: "Objetivo", hint: "¿Qué debe lograr el resultado?" },
    { key: "audiencia", label: "Audiencia", hint: "¿Quién lo va a leer o usar?" },
    { key: "formato", label: "Formato", hint: "Documento, diapositivas, tabla, pieza interactiva, longitud." },
    { key: "tono", label: "Tono", hint: "Formal, cercano, técnico, de ventas." },
    { key: "restricciones", label: "Restricciones", hint: "Qué no debe incluir, datos a usar, límites." },
  ],
  en: [
    { key: "objetivo", label: "Goal", hint: "What should the result achieve?" },
    { key: "audiencia", label: "Audience", hint: "Who will read or use it?" },
    { key: "formato", label: "Format", hint: "Document, slides, table, interactive piece, length." },
    { key: "tono", label: "Tone", hint: "Formal, warm, technical, sales." },
    { key: "restricciones", label: "Constraints", hint: "What to leave out, data to use, limits." },
  ],
  pt: [
    { key: "objetivo", label: "Objetivo", hint: "O que o resultado deve alcançar?" },
    { key: "audiencia", label: "Público", hint: "Quem vai ler ou usar?" },
    { key: "formato", label: "Formato", hint: "Documento, slides, tabela, peça interativa, extensão." },
    { key: "tono", label: "Tom", hint: "Formal, cordial, técnico, de vendas." },
    { key: "restricciones", label: "Restrições", hint: "O que não incluir, dados a usar, limites." },
  ],
};

export const normalizeClaudeLocale = (locale = "es") => {
  if (String(locale).startsWith("en")) return "en";
  if (String(locale).startsWith("pt")) return "pt";
  return "es";
};

export const getClaudeTasks = (locale) => TASKS[normalizeClaudeLocale(locale)];
export const getBriefElements = (locale) => BRIEF_ELEMENTS[normalizeClaudeLocale(locale)];
