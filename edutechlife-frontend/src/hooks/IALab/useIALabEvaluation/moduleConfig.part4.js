import {
  getClaudeTasks,
  normalizeClaudeLocale,
  parseBriefEvidence,
  CLAUDE_TASK_COUNT,
  parseClaudeAnswers,
  countClaudeCorrect,
} from "./moduleConfigShared";

export const MODULE_CONFIG_PART4 = {
  5: {
    name: {
      es: "Claude: El Director de Orquesta",
      en: "Claude: The Conductor",
      pt: "Claude: O Maestro",
    },
    totalSteps: 3,
    generateSystemPrompt: () =>
      "Eres un experto en productividad con IA y en uso responsable de asistentes como Claude. Genera 2 escenarios de trabajo real de nivel medio para practicar. Devuelve SOLO JSON.",
    generateUserPrompt: () => `Genera un JSON con 2 escenarios de trabajo real:
1. casoBrief: una situación de 3-4 oraciones para la que el estudiante debe escribir un pedido completo a Claude. Debe pedir un resultado concreto, sin dar objetivo, audiencia, formato, tono ni límites.
2. casoProtocolo: una situación de 3-4 oraciones que involucra datos personales de clientes y el uso de una herramienta de IA, para diseñar un protocolo de uso.

Formato JSON exacto: { "casoBrief": "texto", "casoProtocolo": "texto" }`,
    evaluateSystemPrompt:
      () => `Eres un evaluador EXPERTO en uso responsable de IA y productividad. Sé justo y alentador: la nota refleja lo que el estudiante cubrió, sin inflarla. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Clasificar tareas): la nota ya viene calculada en el mensaje del usuario. Usa ese valor exacto en nota_ej1.

CRITERIOS - EJERCICIO 2 (Pedido para Claude). Comprueba primero que el pedido corresponda al caso.
- Si no pegó el resultado que le dio Claude, la nota no supera 70. Con el resultado pegado y revisado, puede llegar a 100.
- No escribió un pedido o no corresponde al caso: 0-30
- Pedido con alguna instrucción clara: 40-55
- Cubre 2 o 3 de: objetivo, audiencia, formato, tono, límites: 60-75
- Cubre 4 partes: 80-89
- Cubre las 5 con claridad y encaja con el caso: 90-100

CRITERIOS - EJERCICIO 3 (Protocolo de uso). Debe cubrir: datos que no se comparten (o se anonimizan), verificación antes de usar, quién revisa y firma, cómo se declara el uso de IA.
- No propone medidas: 0-30
- Medidas básicas sin relación clara con el caso: 40-55
- Cubre 2 o 3 de los 4 puntos: 60-75
- Cubre los 4 puntos con medidas generales: 80-89
- Cubre los 4 puntos con medidas concretas para el caso: 90-100

Formato: { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S" }`,
    evaluateUserPrompt: (exercises, responses) => {
      const answers = parseClaudeAnswers(responses.ej1);
      const correct = countClaudeCorrect(answers);
      const nota1 = Math.round((correct / CLAUDE_TASK_COUNT) * 100);
      return `Evalúa estas respuestas del módulo Claude. Sé justo y alentador.

EJERCICIO 1: el estudiante acertó ${correct} de ${CLAUDE_TASK_COUNT} tareas. Usa nota_ej1 = ${nota1} exactamente.

CASO DEL PEDIDO: ${exercises?.casoBrief || "N/A"}
Pedido del estudiante: ${parseBriefEvidence(responses.ej2).pedido}
Resultado que pegó el estudiante: ${parseBriefEvidence(responses.ej2).resultado || "(no lo pegó)"}
Revisiones marcadas: ${parseBriefEvidence(responses.ej2).revision.filter(Boolean).length} de 3

CASO DEL PROTOCOLO: ${exercises?.casoProtocolo || "N/A"}
Protocolo del estudiante: ${responses.ej3 || ""}

Devuelve SOLO JSON válido.`;
    },
    fallbackExercises: (locale) => {
      const lang = normalizeClaudeLocale(locale);
      const scenarios = {
        es: {
          casoBrief:
            "Tu directora te pide una propuesta para una alianza con un colegio de Manizales antes del viernes. Debe ser clara, convincente y responder a lo que el colegio necesita.",
          casoProtocolo:
            "Tu equipo quiere usar Claude para resumir las encuestas de satisfacción de clientes, que incluyen nombres, correos y comentarios personales. Debe quedar claro qué se comparte, qué se revisa y quién firma las conclusiones.",
        },
        en: {
          casoBrief:
            "Your director asks for a proposal for a partnership with a school in Manizales before Friday. It must be clear, persuasive and answer what the school needs.",
          casoProtocolo:
            "Your team wants to use Claude to summarize customer satisfaction surveys that include names, emails and personal comments. It must be clear what is shared, what is reviewed and who signs the conclusions.",
        },
        pt: {
          casoBrief:
            "Sua diretora pede uma proposta de parceria com um colégio de Manizales até sexta-feira. Precisa ser clara, convincente e responder ao que o colégio precisa.",
          casoProtocolo:
            "Sua equipe quer usar o Claude para resumir pesquisas de satisfação de clientes, que incluem nomes, e-mails e comentários pessoais. Deve ficar claro o que se compartilha, o que se revisa e quem assina as conclusões.",
        },
      };
      return {
        tareas: getClaudeTasks(lang).map((t) => ({ id: t.id, task: t.task })),
        ...scenarios[lang],
      };
    },
    localEvaluate: (responses) => {
      const correct = countClaudeCorrect(parseClaudeAnswers(responses.ej1));
      const nota_ej1 = Math.round((correct / CLAUDE_TASK_COUNT) * 100);
      const feedback_ej1 = `Acertaste ${correct} de ${CLAUDE_TASK_COUNT} tareas. Revisa las que fallaste: cada una trae la razón de la respuesta correcta.`;

      // El pedido se califica por las cinco partes que enseña el módulo, no por su longitud.
      const evidence = parseBriefEvidence(responses.ej2);
      const brief = evidence.pedido.trim();
      const BRIEF_PARTS = [
        [
          "objetivo",
          /(objetivo|para qu[eé]|lograr|alcanzar|goal|purpose|so that)/i,
        ],
        [
          "audiencia",
          /(audiencia|dirigid|lector|p[uú]blico|destinatari|audience|reader|leitor)/i,
        ],
        [
          "formato",
          /(formato|p[aá]ginas|diapositiv|lista|tabla|correo|documento|format|pages|slides|table|email|e-mail|\d+\s*(palabras|words|palavras|ideas|ideias|minutos|minutes|p[aá]ginas|pages|diapositivas|slides))/i,
        ],
        [
          "tono",
          /(tono|formal|cercan|amable|tone|warm|friendly|\btom\b|cordial)/i,
        ],
        [
          "límites",
          /(no (prometas|incluyas|uses|inventes|compartas|menciones|pongas|prometer|inventar|incluir)|sin (prometer|inventar|incluir|usar|datos|precios|fechas|compartir|mencionar)|evita|l[ií]mite|restric|without (promis|invent|includ|shar)|avoid|do not|don't|limit|sem (prometer|inventar|incluir|dados)|n[aã]o (prometa|inclua|use|invente|compartilhe))/i,
        ],
      ];
      const missingParts = BRIEF_PARTS.filter(([, re]) => !re.test(brief)).map(
        ([name]) => name,
      );
      const briefWords = brief ? brief.split(/\s+/).length : 0;
      const briefScore = Math.min(
        100,
        30 + (BRIEF_PARTS.length - missingParts.length) * 14,
      );
      // Un pedido de pocas palabras no alcanza a cubrir las partes con claridad.
      const baseNota = !brief
        ? 0
        : briefWords < 12
          ? Math.min(50, briefScore)
          : briefScore;
      const baseFeedback = !brief
        ? "Escribe el pedido con objetivo, audiencia, formato, tono y límites."
        : missingParts.length === 0
          ? "Tu pedido cubre las cinco partes. Revisa que el formato y el tono coincidan con la audiencia."
          : `A tu pedido le falta: ${missingParts.join(", ")}. Con eso Claude acierta a la primera.`;
      // Evidencia (30%): el resultado real de Claude pegado y las revisiones marcadas.
      const resultWords = evidence.resultado.trim()
        ? evidence.resultado.trim().split(/\s+/).length
        : 0;
      const reviewed = evidence.revision.filter(Boolean).length;
      const evidenceScore =
        (resultWords >= 20 ? 50 : resultWords > 0 ? 25 : 0) +
        Math.round((reviewed / evidence.revision.length) * 50);
      const nota_ej2 =
        evidence.legacy || !brief
          ? baseNota
          : Math.min(
              resultWords === 0 ? 70 : 100,
              Math.round(baseNota * 0.7 + evidenceScore * 0.3),
            );
      const feedback_ej2 =
        evidence.legacy || !brief
          ? baseFeedback
          : `${baseFeedback}${resultWords === 0 ? " Pega el resultado que te dio Claude y revísalo." : reviewed < evidence.revision.length ? " Marca las tres revisiones después de comprobar el resultado." : ""}`;

      // El protocolo se califica por los cuatro puntos que pide el paso 3.
      const protocol = (responses.ej3 || "").trim();
      const protocolWords = protocol ? protocol.split(/\s+/).length : 0;
      const PROTOCOL_POINTS = [
        [
          "datos que no se comparten",
          /(dato|personal|confidencial|anonimi|anonymi|dados)/i,
        ],
        [
          "verificación",
          /(verific|revis|comprob|fuente|cifra|check|verify|review|source|confer|fonte)/i,
        ],
        [
          "quién revisa y firma",
          /(firm|responsable|aprueb|sign|approv|responsible|assin|aprova)/i,
        ],
        [
          "declaración del uso de IA",
          /(declar|transparen|disclos|divulg|informa[a-z]* (que|el uso|o uso))/i,
        ],
      ];
      const missingPoints = PROTOCOL_POINTS.filter(
        ([, re]) => !re.test(protocol),
      ).map(([name]) => name);
      const protocolScore = Math.round(
        Math.min(
          100,
          30 + (PROTOCOL_POINTS.length - missingPoints.length) * 17.5,
        ),
      );
      const nota_ej3 = !protocol
        ? 0
        : protocolWords < 30
          ? Math.min(60, protocolScore)
          : protocolScore;
      const feedback_ej3 = !protocol
        ? "Escribe el protocolo con los cuatro puntos: datos, verificación, quién firma y cómo se declara la IA."
        : missingPoints.length === 0
          ? "Protocolo completo: cubre datos, verificación, responsabilidad y declaración de IA. Hazlo concreto para el caso."
          : `A tu protocolo le falta: ${missingPoints.join(", ")}.`;

      const notaGlobal =
        Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;
      return {
        nota_ej1,
        nota_ej2,
        nota_ej3,
        notaGlobal,
        feedback_ej1,
        feedback_ej2,
        feedback_ej3,
      };
    },
  },
};
