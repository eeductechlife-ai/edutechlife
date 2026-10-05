// Lectura activa para documentos/PDF (Fase 1 pedagógica).
// "before": preguntas guía antes de leer. "after": reflexión de transferencia.
// "summary": resumen ejecutivo de 5 líneas para reducir carga cognitiva.

const ES = {
  "prompt-guide-1": {
    summary:
      "Guía de referencia sobre los elementos de un prompt (Rol, Contexto, Tarea, Formato, Restricciones, Ejemplos) y cómo combinarlos para obtener respuestas precisas.",
    before: [
      "¿Qué elemento de un prompt suele faltar en mis instrucciones actuales?",
      "¿Cómo cambiaría el resultado si añado un Rol explícito?",
      "¿Qué restricción evitaría respuestas demasiado largas o ambiguas?",
    ],
    after:
      "Escribe un prompt tuyo (de estudio o trabajo) y reescríbelo aplicando los 6 elementos. Compáralo con el original.",
  },
  "chatgpt-guide-modulo2": {
    summary:
      "Recorrido por la arquitectura de ChatGPT: modelos, interfaz, técnicas de prompting y buenas prácticas para tareas profesionales.",
    before: [
      "¿Qué tarea repetitiva de mi semana podría delegar a ChatGPT?",
      "¿Qué diferencia hay entre un prompt suelto y un system prompt?",
      "¿Cómo verificaría la información que me da?",
    ],
    after:
      "Diseña un system prompt para una tarea real y pruébalo. Anota en qué mejoró respecto a tu prompt anterior.",
  },
  "workflow-pdf-modulo2": {
    summary:
      "Cómo conectar ChatGPT con herramientas integradas (búsqueda, análisis de datos, código, imágenes) para construir flujos de trabajo completos.",
    before: [
      "¿Qué herramienta integrada resolvería mejor mi caso?",
      "¿En qué paso de mi proceso aporta más valor la automatización?",
      "¿Qué datos no debería subir por privacidad?",
    ],
    after:
      "Mapea un flujo de 3 pasos (entrada → herramienta → salida) para una tarea tuya y ejecútalo.",
  },
  "gemini-guide-1": {
    summary:
      "Manual de campo de Gemini: qué es, qué lo hace multimodal y cómo usarlo para tareas de productividad e investigación.",
    before: [
      "¿Qué tarea mía exige analizar imágenes o documentos grandes?",
      "¿Cuándo conviene Deep Research en lugar de una respuesta directa?",
      "¿Cómo citaría las fuentes en mi trabajo?",
    ],
    after:
      "Elige una pregunta de tu área, investígala con Deep Research y guarda el informe con sus citas.",
  },
  "workspace-template-1": {
    summary:
      "Ejercicios de campo para aplicar Gemini en Google Workspace: redacción en Docs, análisis en Sheets y personalización en Gmail.",
    before: [
      "¿Qué informe o correo repetitivo podría generar con Gemini?",
      "¿Qué datos necesito para personalizarlo por destinatario?",
      "¿Cómo verificaré que los datos estén actualizados?",
    ],
    after:
      "Genera un informe semanal real con Gemini en Sheets y redacta el correo en Gmail. Revisa el resultado.",
  },
  "notebooklm-guide-1": {
    summary:
      "Guía de NotebookLM: cómo cargar fuentes, obtener respuestas con citas y generar Audio Overviews para repasar.",
    before: [
      "¿Qué documentos quiero convertir en una fuente única de consulta?",
      "¿Cómo distinguiré una cita textual de una interpretación?",
      "¿Cuándo me sirve un Audio Overview en lugar de leer?",
    ],
    after:
      "Carga 3 fuentes sobre un tema y haz 5 preguntas citando cada respuesta. Marca las que no estén en las fuentes.",
  },
  "notebook-summary-template-1": {
    summary:
      "Plantillas de resumen (académico, ejecutivo, técnico) para convertir documentos extensos en síntesis citadas y accionables.",
    before: [
      "¿Qué tipo de resumen necesita mi audiencia?",
      "¿Qué información es imprescindible y qué se puede omitir?",
      "¿Cómo enlazaré cada idea con su fuente original?",
    ],
    after:
      "Toma un documento largo y genera un resumen de una página con 3 hallazgos clave y sus citas.",
  },
  "bias-guide-1": {
    summary:
      "Código de ética: principios de transparencia, equidad, explicabilidad y responsabilidad para un uso justo de la IA.",
    before: [
      "¿En qué decisión con IA podría haber un sesgo?",
      "¿Cómo explicaría una decisión automatizada a una persona afectada?",
      "¿Quién responde si el sistema se equivoca?",
    ],
    after:
      "Analiza un caso real donde la IA pudiera discriminar y propone una medida de mitigación con supervisión humana.",
  },
  "privacy-guide-1": {
    summary:
      "Manual de privacidad: qué datos evitar compartir, qué es la minimización de datos y cómo proteger a los estudiantes.",
    before: [
      "¿Qué datos sensibles podrían exponerse sin darme cuenta?",
      "¿Qué información es realmente necesaria para mi tarea?",
      "¿Cómo puedo anonimizar los ejemplos que subo?",
    ],
    after:
      "Revisa tus últimos prompts y marca los que contengan datos personales. Reescríbelos minimizando la información.",
  },
};

const EN = {
  "prompt-guide-1": {
    summary:
      "Reference guide on prompt elements (Role, Context, Task, Format, Constraints, Examples) and how to combine them for precise answers.",
    before: [
      "Which prompt element is usually missing in my instructions?",
      "How would the result change if I add an explicit Role?",
      "Which constraint would avoid overly long or ambiguous answers?",
    ],
    after:
      "Write one of your own prompts and rewrite it applying the 6 elements. Compare it with the original.",
  },
  "chatgpt-guide-modulo2": {
    summary:
      "A tour of ChatGPT's architecture: models, interface, prompting techniques and best practices for professional tasks.",
    before: [
      "Which repetitive task of my week could I delegate to ChatGPT?",
      "What's the difference between a one-off prompt and a system prompt?",
      "How would I verify the information it gives me?",
    ],
    after:
      "Design a system prompt for a real task and test it. Note how it improved over your previous prompt.",
  },
  "workflow-pdf-modulo2": {
    summary:
      "How to connect ChatGPT with built-in tools (search, data analysis, code, images) to build complete workflows.",
    before: [
      "Which built-in tool would best solve my case?",
      "At which step of my process does automation add the most value?",
      "What data should I not upload for privacy reasons?",
    ],
    after:
      "Map a 3-step flow (input → tool → output) for one of your tasks and run it.",
  },
  "gemini-guide-1": {
    summary:
      "Gemini field manual: what it is, what makes it multimodal, and how to use it for productivity and research tasks.",
    before: [
      "Which task of mine requires analyzing images or large documents?",
      "When is Deep Research better than a direct answer?",
      "How would I cite the sources in my work?",
    ],
    after:
      "Pick a question in your field, research it with Deep Research and save the report with its citations.",
  },
  "workspace-template-1": {
    summary:
      "Field exercises to apply Gemini in Google Workspace: writing in Docs, analysis in Sheets and personalization in Gmail.",
    before: [
      "Which repetitive report or email could I generate with Gemini?",
      "What data do I need to personalize it per recipient?",
      "How will I verify the data is up to date?",
    ],
    after:
      "Generate a real weekly report with Gemini in Sheets and draft the email in Gmail. Review the result.",
  },
  "notebooklm-guide-1": {
    summary:
      "NotebookLM guide: how to upload sources, get answers with citations, and generate Audio Overviews for review.",
    before: [
      "Which documents do I want to turn into a single source of truth?",
      "How will I distinguish a direct quote from an interpretation?",
      "When is an Audio Overview better than reading?",
    ],
    after:
      "Upload 3 sources on a topic and ask 5 questions citing each answer. Flag the ones not in the sources.",
  },
  "notebook-summary-template-1": {
    summary:
      "Summary templates (academic, executive, technical) to turn long documents into cited, actionable syntheses.",
    before: [
      "What kind of summary does my audience need?",
      "What information is essential and what can be omitted?",
      "How will I link each idea to its original source?",
    ],
    after:
      "Take a long document and generate a one-page summary with 3 key findings and their citations.",
  },
  "bias-guide-1": {
    summary:
      "Code of ethics: principles of transparency, fairness, explainability and accountability for fair AI use.",
    before: [
      "In which AI decision could there be bias?",
      "How would I explain an automated decision to an affected person?",
      "Who is accountable if the system is wrong?",
    ],
    after:
      "Analyze a real case where AI could discriminate and propose a mitigation measure with human oversight.",
  },
  "privacy-guide-1": {
    summary:
      "Privacy manual: what data to avoid sharing, what data minimization means, and how to protect students.",
    before: [
      "What sensitive data could be exposed without me noticing?",
      "What information is really necessary for my task?",
      "How can I anonymize the examples I upload?",
    ],
    after:
      "Review your last prompts and flag any with personal data. Rewrite them minimizing the information.",
  },
};

const PT = {
  "prompt-guide-1": {
    summary:
      "Guia de referência sobre os elementos de um prompt (Papel, Contexto, Tarefa, Formato, Restrições, Exemplos) e como combiná-los.",
    before: [
      "Qual elemento do prompt costuma faltar nas minhas instruções?",
      "Como o resultado mudaria se eu adicionar um Papel explícito?",
      "Qual restrição evitaria respostas longas ou ambíguas?",
    ],
    after:
      "Escreva um prompt seu e reescreva-o aplicando os 6 elementos. Compare com o original.",
  },
  "chatgpt-guide-modulo2": {
    summary:
      "Um passeio pela arquitetura do ChatGPT: modelos, interface, técnicas de prompting e boas práticas profissionais.",
    before: [
      "Qual tarefa repetitiva da minha semana eu poderia delegar ao ChatGPT?",
      "Qual a diferença entre um prompt avulso e um system prompt?",
      "Como eu verificaria a informação que ele fornece?",
    ],
    after:
      "Crie um system prompt para uma tarefa real e teste. Anote o que melhorou em relação ao anterior.",
  },
  "workflow-pdf-modulo2": {
    summary:
      "Como conectar o ChatGPT a ferramentas integradas (busca, análise de dados, código, imagens) para montar fluxos completos.",
    before: [
      "Qual ferramenta integrada resolveria melhor o meu caso?",
      "Em qual etapa do meu processo a automação agrega mais valor?",
      "Quais dados eu não deveria enviar por privacidade?",
    ],
    after:
      "Mapeie um fluxo de 3 passos (entrada → ferramenta → saída) e execute-o.",
  },
  "gemini-guide-1": {
    summary:
      "Manual de campo do Gemini: o que é, o que o torna multimodal e como usá-lo para produtividade e pesquisa.",
    before: [
      "Qual tarefa minha exige analisar imagens ou documentos grandes?",
      "Quando o Deep Research é melhor que uma resposta direta?",
      "Como eu citaria as fontes no meu trabalho?",
    ],
    after:
      "Escolha uma pergunta da sua área, pesquise com o Deep Research e salve o relatório com as citações.",
  },
  "workspace-template-1": {
    summary:
      "Exercícios de campo para aplicar o Gemini no Google Workspace: redação no Docs, análise no Sheets e personalização no Gmail.",
    before: [
      "Qual relatório ou e-mail repetitivo eu poderia gerar com o Gemini?",
      "Quais dados preciso para personalizá-lo por destinatário?",
      "Como vou verificar que os dados estão atualizados?",
    ],
    after:
      "Gere um relatório semanal real no Sheets e redija o e-mail no Gmail. Revise o resultado.",
  },
  "notebooklm-guide-1": {
    summary:
      "Guia do NotebookLM: como carregar fontes, obter respostas com citações e gerar Audio Overviews para revisar.",
    before: [
      "Quais documentos quero transformar em uma fonte única de consulta?",
      "Como vou distinguir uma citação textual de uma interpretação?",
      "Quando um Audio Overview é melhor que ler?",
    ],
    after:
      "Carregue 3 fontes sobre um tema e faça 5 perguntas citando cada resposta.",
  },
  "notebook-summary-template-1": {
    summary:
      "Modelos de resumo (acadêmico, executivo, técnico) para transformar documentos longos em sínteses citadas e acionáveis.",
    before: [
      "Que tipo de resumo a minha audiência precisa?",
      "Qual informação é essencial e o que pode ser omitido?",
      "Como vou ligar cada ideia à sua fonte original?",
    ],
    after:
      "Pegue um documento longo e gere um resumo de uma página com 3 achados-chave e suas citações.",
  },
  "bias-guide-1": {
    summary:
      "Código de ética: princípios de transparência, equidade, explicabilidade e responsabilidade para um uso justo da IA.",
    before: [
      "Em qual decisão com IA poderia haver viés?",
      "Como eu explicaria uma decisão automatizada a uma pessoa afetada?",
      "Quem responde se o sistema erra?",
    ],
    after:
      "Analise um caso real em que a IA poderia discriminar e proponha uma medida de mitigação.",
  },
  "privacy-guide-1": {
    summary:
      "Manual de privacidade: quais dados evitar compartilhar, o que é minimização de dados e como proteger os estudantes.",
    before: [
      "Quais dados sensíveis poderiam ser expostos sem eu perceber?",
      "Qual informação é realmente necessária para a minha tarefa?",
      "Como posso anonimizar os exemplos que envio?",
    ],
    after:
      "Revise seus últimos prompts e marque os que contenham dados pessoais. Reescreva-os minimizando a informação.",
  },
};

export const DOC_GUIDES = { es: ES, en: EN, pt: PT };

export function getDocGuide(resourceId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = DOC_GUIDES[lang] || DOC_GUIDES.es;
  return pack[resourceId] || null;
}

export default DOC_GUIDES;
