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
      "Guía de Gemini Notebook: cómo cargar fuentes, obtener respuestas con citas y generar Audio Overviews para repasar.",
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
  "claude-guide-es": {
    summary:
      "Guía del director para trabajar con Claude: cómo pedir bien con los cinco elementos, cuándo usar Artifacts, Proyectos, conectores y Skills, y qué nunca delegar.",
    before: [
      "¿Qué tarea de mi trabajo podría delegar a Claude con revisión?",
      "¿Qué elementos (objetivo, audiencia, formato, tono, restricciones) suelo olvidar al pedir algo?",
      "¿Qué decisión nunca debería delegar, aunque la IA la haga bien?",
    ],
    after:
      "Escribe un pedido real para una tarea de tu semana usando los cinco elementos y compara el resultado con tu pedido anterior.",
  },
  "claude-guide-es-plantillas": {
    summary:
      "Plantillas para reutilizar: pedido base, instrucciones de Proyecto y lista de revisión antes de compartir cualquier resultado.",
    before: [
      "¿Qué procedimiento repito cada semana y podría guardar como Skill?",
      "¿Qué instrucciones daría a un Proyecto de mi área de trabajo?",
      "¿Qué revisión mínima necesita un documento antes de compartirlo?",
    ],
    after:
      "Crea una instrucción de Proyecto para tu área, pruébala con una tarea real y ajústala después de revisar el resultado.",
  },
  "fundamentals-guide-1": {
    summary:
      "Qué es la IA generativa, cómo predice respuestas plausibles y qué límites tiene: alucinaciones, falta de contexto, sesgos y cambios con el tiempo.",
    before: [
      "¿Qué diferencia hay entre una respuesta plausible y una respuesta correcta?",
      "¿Qué tarea mía podría hacer la IA sin que yo pierda aprendizaje?",
      "¿Qué dato de la IA usé alguna vez sin verificarlo?",
    ],
    after:
      "Escribe una respuesta de IA que hayas recibido y compárala con una fuente original: ¿qué cambió, qué faltó y qué verificarías antes de usarla?",
  },
  "claude-artifacts-guide-1": {
    summary:
      "Qué puedes crear con un Artifact, las 5 partes de un buen pedido y cómo mejorarlo con cambios pequeños antes de compartirlo.",
    before: [
      "¿Qué documento, presentación o tabla necesito esta semana?",
      "¿Quién lo va a leer y qué tono espera?",
      "¿Qué datos no debería incluir una IA en ese documento?",
    ],
    after:
      "Escribe un pedido con las 5 partes para una pieza real, pide un solo cambio y anota qué revisaste antes de compartirla.",
  },
  "facade-guide-1": {
    summary:
      "Cómo elegir entre Proyecto, GPT y agente de ChatGPT, cómo armar un Proyecto y cómo probar un GPT antes de compartirlo.",
    before: [
      "¿Qué trabajo mío se repite y necesita el mismo contexto cada vez?",
      "¿Qué regla pondría en las instrucciones de un asistente?",
      "¿Qué paso de una tarea de varios pasos no delegaría sin revisarlo?",
    ],
    after:
      "Diseña un Proyecto para un trabajo real: nombre, instrucciones, archivos y una prueba con un caso límite.",
  },
  "deep-research-guide-1": {
    summary:
      "Proceso de Deep Research en cuatro etapas: pregunta investigable, revisión del plan, verificación de fuentes y redacción con límites declarados.",
    before: [
      "¿Qué pregunta concreta necesito responder y para quién?",
      "¿Qué fuente primaria esperaría encontrar sobre ese tema?",
      "¿Qué diría si dos fuentes se contradicen?",
    ],
    after:
      "Elige un tema de tu área, investígalo con Deep Research y verifica tres conclusiones abriendo sus fuentes. ¿Cuál resistió la verificación?",
  },
  "notebook-audio-pdf-1": {
    summary:
      "Cómo usar los Audio Overviews para repasar sin reemplazar la verificación, y cómo organizar las fuentes de un cuaderno por tema, con fechas y sin datos personales.",
    before: [
      "¿Qué documento de mi trabajo convendría convertir en audio para repasar?",
      "¿Qué idea del audio tendría que comprobar antes de usarla?",
      "¿Qué datos personales podría tener un documento que voy a subir?",
    ],
    after:
      "Prepara un cuaderno con tres fuentes del mismo tema, genera un audio, escribe tres ideas con tus palabras y compáralas con las citas.",
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
      "Gemini Notebook guide: how to upload sources, get answers with citations, and generate Audio Overviews for review.",
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
  "claude-guide-es": {
    summary:
      "The conductor's guide to working with Claude: how to ask well with the five elements, when to use Artifacts, Projects, connectors and Skills, and what you never delegate.",
    before: [
      "Which task in my work could I delegate to Claude with review?",
      "Which elements (goal, audience, format, tone, constraints) do I usually forget when I ask?",
      "Which decision should I never delegate, even if AI does it well?",
    ],
    after:
      "Write a real request for a task from your week using the five elements, and compare the result with your previous request.",
  },
  "claude-guide-es-plantillas": {
    summary:
      "Templates to reuse: a base request, Project instructions and a checklist to review any result before sharing it.",
    before: [
      "Which procedure do I repeat each week that I could save as a Skill?",
      "What instructions would I give a Project for my team's work?",
      "What minimum review does a document need before I share it?",
    ],
    after:
      "Create Project instructions for your area, test them on a real task and adjust them after reviewing the result.",
  },
  "fundamentals-guide-1": {
    summary:
      "What generative AI is, how it predicts plausible answers, and its limits: hallucinations, missing context, biases and changes over time.",
    before: [
      "What is the difference between a plausible answer and a correct one?",
      "Which task of mine could AI do without my losing learning?",
      "Which AI fact have I ever used without checking it?",
    ],
    after:
      "Take an AI answer you received and compare it with an original source: what changed, what was missing, and what would you verify before using it?",
  },
  "claude-artifacts-guide-1": {
    summary:
      "What you can create with an Artifact, the 5 parts of a good request and how to improve it with small changes before sharing it.",
    before: [
      "Which document, presentation or table do I need this week?",
      "Who will read it and what tone do they expect?",
      "Which data should an AI not include in that document?",
    ],
    after:
      "Write a request with the 5 parts for a real piece, ask for just one change and note what you checked before sharing it.",
  },
  "facade-guide-1": {
    summary:
      "How to choose between a ChatGPT Project, GPT and agent, how to set up a Project, and how to test a GPT before sharing it.",
    before: [
      "Which of my work tasks repeats and needs the same context each time?",
      "Which rule would I put in the instructions of an assistant?",
      "Which step of a multi-step task would I not delegate without review?",
    ],
    after:
      "Design a Project for a real piece of work: name, instructions, files and a test with an edge case.",
  },
  "deep-research-guide-1": {
    summary:
      "The Deep Research process in four stages: a researchable question, plan review, source verification and writing with stated limits.",
    before: [
      "What specific question do I need to answer, and for whom?",
      "Which primary source would I expect on that topic?",
      "What would I do if two sources contradict each other?",
    ],
    after:
      "Pick a topic from your field, research it with Deep Research and verify three conclusions by opening their sources. Which one held up?",
  },
  "notebook-audio-pdf-1": {
    summary:
      "How to use Audio Overviews to review without replacing verification, and how to organize a notebook's sources by topic, with dates and without personal data.",
    before: [
      "Which document from my work would be worth turning into audio for review?",
      "Which idea in the audio would I have to check before using it?",
      "What personal data might a document I am about to upload contain?",
    ],
    after:
      "Prepare a notebook with three sources on the same topic, generate an audio, write three ideas in your own words and compare them with the citations.",
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
      "Guia do Gemini Notebook: como carregar fontes, obter respostas com citações e gerar Audio Overviews para revisar.",
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
  "claude-guide-es": {
    summary:
      "Guia do maestro para trabalhar com o Claude: como pedir bem com os cinco elementos, quando usar Artifacts, Projetos, conectores e Skills, e o que nunca delegar.",
    before: [
      "Qual tarefa do meu trabalho poderia delegar ao Claude com revisão?",
      "Quais elementos (objetivo, público, formato, tom, restrições) costumo esquecer ao pedir algo?",
      "Qual decisão eu nunca deveria delegar, mesmo que a IA faça bem?",
    ],
    after:
      "Escreva um pedido real para uma tarefa da sua semana usando os cinco elementos e compare o resultado com o seu pedido anterior.",
  },
  "claude-guide-es-plantillas": {
    summary:
      "Modelos para reutilizar: pedido base, instruções de Projeto e lista de revisão antes de compartilhar qualquer resultado.",
    before: [
      "Qual procedimento repito toda semana e poderia guardar como Skill?",
      "Que instruções daria a um Projeto da minha área de trabalho?",
      "Qual revisão mínima um documento precisa antes de ser compartilhado?",
    ],
    after:
      "Crie instruções de Projeto para a sua área, teste-as com uma tarefa real e ajuste depois de revisar o resultado.",
  },
  "fundamentals-guide-1": {
    summary:
      "O que é a IA generativa, como prevê respostas plausíveis e quais são seus limites: alucinações, falta de contexto, vieses e mudanças com o tempo.",
    before: [
      "Qual é a diferença entre uma resposta plausível e uma resposta correta?",
      "Que tarefa minha a IA poderia fazer sem que eu perdesse aprendizado?",
      "Que dado da IA eu já usei alguma vez sem verificar?",
    ],
    after:
      "Pegue uma resposta de IA que você recebeu e compare com uma fonte original: o que mudou, o que faltou e o que você verificaria antes de usar?",
  },
  "claude-artifacts-guide-1": {
    summary:
      "O que você pode criar com um Artifact, as 5 partes de um bom pedido e como melhorá-lo com mudanças pequenas antes de compartilhar.",
    before: [
      "Que documento, apresentação ou tabela eu preciso nesta semana?",
      "Quem vai ler e que tom essa pessoa espera?",
      "Quais dados uma IA não deveria incluir nesse documento?",
    ],
    after:
      "Escreva um pedido com as 5 partes para uma peça real, peça uma única mudança e anote o que você conferiu antes de compartilhar.",
  },
  "facade-guide-1": {
    summary:
      "Como escolher entre Projeto, GPT e agente do ChatGPT, como montar um Projeto e como testar um GPT antes de compartilhar.",
    before: [
      "Qual trabalho meu se repete e precisa do mesmo contexto toda vez?",
      "Que regra eu colocaria nas instruções de um assistente?",
      "Que etapa de uma tarefa de várias etapas eu não delegaria sem revisar?",
    ],
    after:
      "Desenhe um Projeto para um trabalho real: nome, instruções, arquivos e um teste com um caso limite.",
  },
  "deep-research-guide-1": {
    summary:
      "O processo do Deep Research em quatro etapas: pergunta pesquisável, revisão do plano, verificação das fontes e redação com limites declarados.",
    before: [
      "Qual pergunta concreta eu preciso responder, e para quem?",
      "Que fonte primária eu esperaria encontrar sobre esse tema?",
      "O que eu faria se duas fontes se contradizem?",
    ],
    after:
      "Escolha um tema da sua área, pesquise com o Deep Research e verifique três conclusões abrindo as fontes. Qual resistiu à verificação?",
  },
  "notebook-audio-pdf-1": {
    summary:
      "Como usar os Audio Overviews para revisar sem substituir a verificação, e como organizar as fontes de um caderno por tema, com datas e sem dados pessoais.",
    before: [
      "Qual documento do meu trabalho valeria a pena transformar em áudio para revisar?",
      "Que ideia do áudio eu precisaria conferir antes de usar?",
      "Que dados pessoais um documento que vou enviar pode conter?",
    ],
    after:
      "Prepare um caderno com três fontes do mesmo tema, gere um áudio, escreva três ideias com as suas palavras e compare com as citações.",
  },
};

export const DOC_GUIDES = { es: ES, en: EN, pt: PT };

export function getDocGuide(resourceId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = DOC_GUIDES[lang] || DOC_GUIDES.es;
  return pack[resourceId] || null;
}

export default DOC_GUIDES;
