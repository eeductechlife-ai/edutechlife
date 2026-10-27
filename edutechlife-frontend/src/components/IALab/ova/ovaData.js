export const GEMINI_SLIDE_TABS = [
  { id: "arquitectura", icon: "fa-brain" },
  { id: "multimodalidad", icon: "fa-eye" },
  { id: "deep-research", icon: "fa-magnifying-glass" },
  { id: "workspace", icon: "fa-briefcase" },
  { id: "quiz", icon: "fa-question-circle" },
];

export const SLIDE_ICONS = [
  "fa-brain",
  "fa-eye",
  "fa-magnifying-glass",
  "fa-briefcase",
  "fa-question-circle",
];

export const SLIDE_TITLES = {
  es: [
    "Arquitectura de Gemini",
    "Multimodalidad en la práctica",
    "Investigar con Deep Research",
    "Gemini en tu día a día",
    "Quiz final",
  ],
  en: [
    "Gemini Architecture",
    "Multimodality in practice",
    "Research with Deep Research",
    "Gemini in your day to day",
    "Final quiz",
  ],
  pt: [
    "Arquitetura do Gemini",
    "Multimodalidade na prática",
    "Pesquisar com Deep Research",
    "Gemini no seu dia a dia",
    "Quiz final",
  ],
};

export const SLIDE_DESCRIPTIONS = {
  es: [
    "Cómo está pensado Gemini",
    "Cómo trabaja con texto, imágenes, audio y video",
    "Cómo pedir una investigación y comprobarla",
    "Gemini dentro de tus herramientas",
    "Pon a prueba lo aprendido",
  ],
  en: [
    "How Gemini is designed",
    "How it works with text, images, audio and video",
    "How to ask for research and check it",
    "Gemini inside your tools",
    "Test what you learned",
  ],
  pt: [
    "Como o Gemini foi pensado",
    "Como trabalha com texto, imagens, áudio e vídeo",
    "Como pedir uma pesquisa e conferi-la",
    "O Gemini dentro das suas ferramentas",
    "Teste o que aprendeu",
  ],
};

export const SLIDE_CONTENT = {
  es: [
    {
      title: "¿Qué hace especial a Gemini?",
      paragraphs: [
        "Gemini es un modelo de IA multimodal desarrollado por Google DeepMind. Además de texto, puede recibir imágenes, audio y video, y combinarlos en una misma conversación.",
        "La idea clave: en vez de juntar herramientas separadas para leer, escuchar y mirar, un mismo modelo trabaja con varios formatos a la vez.",
        "Como toda IA, puede equivocarse con seguridad. La verificación de cifras, fechas y nombres sigue siendo tuya.",
      ],
      highlights: [
        "Recibe texto, imágenes, audio y video",
        "Combina formatos en una misma conversación",
        "Desarrollado por Google DeepMind",
        "Lo que ves depende de tu plan",
      ],
    },
    {
      title: "Multimodalidad en la práctica",
      paragraphs: [
        "Puedes subir la foto de un ejercicio escrito a mano y pedir una explicación paso a paso. Revisa cada paso: leer la letra puede fallar.",
        "También sirve para leer un gráfico de un informe o transcribir la grabación de una clase. Después compara con la imagen o el audio originales.",
        "Con un video corto puede describir lo que ocurre. Para decisiones importantes, mira tú los momentos que menciona.",
      ],
      highlights: [
        "Foto + pregunta = explicación paso a paso",
        "Lee gráficos y texto de un mismo informe",
        "Describe videos cortos",
        "Compara siempre con el original",
      ],
    },
    {
      title: "Investigar con Deep Research",
      paragraphs: [
        "Deep Research es una función que, según tu plan, busca fuentes en varias etapas y entrega un informe. Tú defines la pregunta y revisas el plan antes de que trabaje.",
        "El informe debe traer fuentes. Ábrelas: confirma que existen y que dicen lo que el informe afirma.",
        "Si una fuente no aparece o no dice eso, no uses esa conclusión.",
      ],
      highlights: [
        "Pregunta clara primero",
        "Revisa el plan antes de ejecutarlo",
        "Abre al menos tres fuentes por conclusión",
        "Disponible según tu plan",
      ],
    },
    {
      title: "Gemini en tu día a día",
      paragraphs: [
        "Dentro de Gmail, Docs, Sheets y Slides puedes pedir ayuda sin cambiar de aplicación, si tu cuenta lo incluye. Revisa qué funciones ves en tu cuenta.",
        "En Gmail sirve para resumir un hilo largo y redactar una respuesta. Antes de enviar, revisa fechas y compromisos.",
        "En Sheets puede sugerir fórmulas o gráficos: recalcula una fila a mano. En Slides puede hacer un borrador que tú ajustas.",
      ],
      highlights: [
        "Ayuda dentro de Gmail, Docs, Sheets y Slides",
        "Resume hilos: revisa antes de enviar",
        "Sugiere fórmulas: recalcula una fila",
        "Borradores que tú ajustas",
      ],
    },
  ],
  en: [
    {
      title: "What makes Gemini special?",
      paragraphs: [
        "Gemini is a multimodal AI model developed by Google DeepMind. Besides text, it can take images, audio and video and combine them in one conversation.",
        "The key idea: instead of joining separate tools to read, listen and look, one model works with several formats at once.",
        "Like any AI, it can be confidently wrong. Checking figures, dates and names is still your job.",
      ],
      highlights: [
        "Takes text, images, audio and video",
        "Combines formats in one conversation",
        "Developed by Google DeepMind",
        "What you see depends on your plan",
      ],
    },
    {
      title: "Multimodality in practice",
      paragraphs: [
        "You can upload a photo of a handwritten exercise and ask for a step-by-step explanation. Check each step: reading the handwriting can fail.",
        "It can also read a chart from a report or transcribe a class recording. Then compare with the original image or audio.",
        "With a short video it can describe what happens. For important decisions, watch the moments it mentions yourself.",
      ],
      highlights: [
        "Photo + question = step-by-step explanation",
        "Reads charts and text from the same report",
        "Describes short videos",
        "Always compare with the original",
      ],
    },
    {
      title: "Research with Deep Research",
      paragraphs: [
        "Deep Research is a feature that, depending on your plan, searches sources in several stages and delivers a report. You define the question and review the plan before it works.",
        "The report must include sources. Open them: confirm they exist and say what the report claims.",
        "If a source is missing or does not say that, do not use that conclusion.",
      ],
      highlights: [
        "Start with a clear question",
        "Review the plan before it runs",
        "Open at least three sources per conclusion",
        "Available depending on your plan",
      ],
    },
    {
      title: "Gemini in your day to day",
      paragraphs: [
        "Inside Gmail, Docs, Sheets and Slides you can ask for help without switching apps, if your account includes it. Check which features you see in your account.",
        "In Gmail it helps summarize a long thread and draft a reply. Before sending, check dates and commitments.",
        "In Sheets it can suggest formulas or charts: recompute one row by hand. In Slides it can make a draft that you adjust.",
      ],
      highlights: [
        "Helps inside Gmail, Docs, Sheets and Slides",
        "Summarizes threads: review before sending",
        "Suggests formulas: recompute one row",
        "Drafts that you adjust",
      ],
    },
  ],
  pt: [
    {
      title: "O que torna o Gemini especial?",
      paragraphs: [
        "O Gemini é um modelo de IA multimodal desenvolvido pelo Google DeepMind. Além de texto, pode receber imagens, áudio e vídeo e combiná-los em uma mesma conversa.",
        "A ideia-chave: em vez de juntar ferramentas separadas para ler, ouvir e olhar, um mesmo modelo trabalha com vários formatos ao mesmo tempo.",
        "Como toda IA, pode errar com segurança. Conferir números, datas e nomes continua sendo sua tarefa.",
      ],
      highlights: [
        "Recebe texto, imagens, áudio e vídeo",
        "Combina formatos em uma mesma conversa",
        "Desenvolvido pelo Google DeepMind",
        "O que você vê depende do seu plano",
      ],
    },
    {
      title: "Multimodalidade na prática",
      paragraphs: [
        "Você pode enviar a foto de um exercício escrito à mão e pedir uma explicação passo a passo. Revise cada passo: ler a letra pode falhar.",
        "Também serve para ler um gráfico de um relatório ou transcrever a gravação de uma aula. Depois compare com a imagem ou o áudio originais.",
        "Com um vídeo curto ele pode descrever o que acontece. Para decisões importantes, assista você mesmo aos momentos que ele menciona.",
      ],
      highlights: [
        "Foto + pergunta = explicação passo a passo",
        "Lê gráficos e textos de um mesmo relatório",
        "Descreve vídeos curtos",
        "Compare sempre com o original",
      ],
    },
    {
      title: "Pesquisar com Deep Research",
      paragraphs: [
        "Deep Research é uma função que, conforme o seu plano, busca fontes em várias etapas e entrega um relatório. Você define a pergunta e revisa o plano antes de ele trabalhar.",
        "O relatório deve trazer fontes. Abra-as: confirme que existem e que dizem o que o relatório afirma.",
        "Se uma fonte não aparece ou não diz isso, não use essa conclusão.",
      ],
      highlights: [
        "Comece com uma pergunta clara",
        "Revise o plano antes de executar",
        "Abra pelo menos três fontes por conclusão",
        "Disponível conforme o seu plano",
      ],
    },
    {
      title: "Gemini no seu dia a dia",
      paragraphs: [
        "Dentro do Gmail, Docs, Sheets e Slides você pode pedir ajuda sem trocar de aplicativo, se a sua conta incluir. Veja quais funções aparecem na sua conta.",
        "No Gmail ajuda a resumir uma conversa longa e rascunhar uma resposta. Antes de enviar, confira datas e compromissos.",
        "No Sheets pode sugerir fórmulas ou gráficos: refaça uma linha à mão. No Slides pode fazer um rascunho que você ajusta.",
      ],
      highlights: [
        "Ajuda dentro do Gmail, Docs, Sheets e Slides",
        "Resume conversas: revise antes de enviar",
        "Sugere fórmulas: refaça uma linha",
        "Rascunhos que você ajusta",
      ],
    },
  ],
};

export const OVA_CATALOG = [
  {
    id: "prompt-ova-html-1",
    title: "El Cincel",
    module: 1,
    icon: "fa-brain",
    duration: "15 min",
    description: "Fundamentos del prompt y su anatomía.",
    component: "OVAIntroPrompt",
  },
  {
    id: "prompt-lab-ova-1",
    title: "El Martillo",
    module: 1,
    icon: "fa-hammer",
    duration: "15 min",
    description: "Laboratorio de prompts en vivo con retroalimentación.",
    component: "OVAPromptLab",
  },
  {
    id: "chatgpt-ova-ecosystem",
    title: "El Plano Maestro",
    module: 2,
    icon: "fa-sitemap",
    duration: "20 min",
    description: "Mapa del ecosistema ChatGPT.",
    component: "OVAEcosystemGuide",
  },
  {
    id: "workflow-ova-herramientas",
    title: "La Caja de Herramientas",
    module: 2,
    icon: "fa-wand-magic-sparkles",
    duration: "25 min",
    description: "Arsenal integrado de ChatGPT.",
    component: "OVAChatGPTTools",
  },
  {
    id: "automation-flows-ova-1",
    title: "La Línea de Montaje",
    module: 2,
    icon: "fa-diagram-project",
    duration: "22 min",
    description: "Flujos de automatización en el mundo real.",
    component: "OVAAutomationFlows",
  },
  {
    id: "gpts-ova-1",
    title: "La Fábrica de Asistentes",
    module: 2,
    icon: "fa-robot",
    duration: "25 min",
    description: "Construye tu GPT personalizado.",
    component: "OVABuildGPT",
  },
  {
    id: "workspace-ova-1",
    title: "La Lupa Multimodal",
    module: 3,
    icon: "fa-atom",
    duration: "25 min",
    description: "Misión Gemini: capacidades multimodales y Workspace.",
    component: "OvaEdutechlife",
  },
  {
    id: "gemini-cases-ova-1",
    title: "El Caso Abierto",
    module: 3,
    icon: "fa-briefcase",
    duration: "25 min",
    description: "Casos prácticos con Gemini.",
    component: "OVAPracticalCases",
  },
  {
    id: "gemini-deep-research-ova-1",
    title: "El Archivo Forense",
    module: 3,
    icon: "fa-magnifying-glass",
    duration: "25 min",
    description: "Investigación profunda y verificación de fuentes.",
    component: "OVAGeminiDeepResearch",
  },
  {
    id: "notebooklm-ova-1",
    title: "El Grimorio",
    module: 4,
    icon: "fa-flask-vial",
    duration: "15 min",
    description: "Construye tu notebook inteligente.",
    component: "OVANotebookLab",
  },
  {
    id: "notebook-summary-ova-1",
    title: "El Crisol",
    module: 4,
    icon: "fa-file-text",
    duration: "20 min",
    description: "Simulador de análisis documental.",
    component: "OVANotebookSimulator",
  },
  {
    id: "notebook-audio-guide-1",
    title: "La Fórmula Sonora",
    module: 4,
    icon: "fa-podcast",
    duration: "30 min",
    description: "Guía de Audio Overviews.",
    component: "OVANotebookPodcastGuide",
  },
  {
    id: "notebook-audio-ova-1",
    title: "El Estudio Alquímico",
    module: 4,
    icon: "fa-microphone",
    duration: "15 min",
    description: "Crea tu podcast IA.",
    component: "OVAPodcastStudio",
  },
  {
    id: "document-mastery-ova-1",
    title: "La Transmutación",
    module: 4,
    icon: "fa-arrows-spin",
    duration: "24 min",
    description: "Del documento al podcast sin perder profundidad.",
    component: "OVADocumentMastery",
  },
  {
    id: "intro-ova-1",
    title: "La Materia Prima",
    module: 1,
    icon: "fa-book-open",
    duration: "15 min",
    description: "Orígenes de la IA y fundamentos del prompt.",
    component: "OVAEtica",
  },
  {
    id: "bias-ova-1",
    title: "El Espejo de la Verdad",
    module: 1,
    icon: "fa-exclamation-triangle",
    duration: "15 min",
    description: "Detector de sesgos algorítmicos.",
    component: "OVABiasLab",
  },
  {
    id: "privacy-ova-1",
    title: "La Brújula de Riesgos",
    module: 1,
    icon: "fa-shield-alt",
    duration: "20 min",
    description: "Privacidad y evaluación de riesgos.",
    component: "OVARiskSimulator",
  },
  {
    id: "ethics-ova-1",
    title: "El Tribunal Ético",
    module: 1,
    icon: "fa-scale-balanced",
    duration: "25 min",
    description: "Dilemas éticos con consecuencias reales.",
    component: "OVAEthicalDilemmas",
  },
  {
    id: "ethics-cases-ova-1",
    title: "Casos del Guardián",
    module: 1,
    icon: "fa-gavel",
    duration: "20 min",
    description: "Ética aplicada al mundo real.",
    component: "OVAEthicsCases",
  },
  {
    id: "claude-artifacts-ova-1",
    title: "El Taller de Artifacts",
    module: 5,
    icon: "fa-pen-nib",
    duration: "15 min",
    description: "Arma el pedido perfecto para Claude.",
    component: "OVAClaudeArtifacts",
  },
  {
    id: "claude-delegation-ova-1",
    title: "El Tablero de Delegación",
    module: 5,
    icon: "fa-diagram-project",
    duration: "15 min",
    description: "Qué delegar, qué delegar con revisión y qué nunca delegar.",
    component: "OVAClaudeDelegation",
  },
  {
    id: "gemini-multimodal-ova-1",
    title: "La Lupa a Prueba",
    module: 3,
    icon: "fa-eye",
    duration: "15 min",
    description:
      "Elige la forma de trabajar cada material con Gemini para obtener un resultado verificable.",
    component: "OVAMultimodalLab",
  },
  {
    id: "claude-first-request-ova-1",
    title: "El Primer Pedido",
    module: 5,
    icon: "fa-comments",
    duration: "15 min",
    description:
      "Elige el pedido que dice qué quieres, para quién, en qué formato y con qué límites.",
    component: "OVAClaudeFirstRequest",
  },
];

export const MODULE_NAMES = {
  1: {
    es: "El Artesano Digital — Ingeniería de Prompts",
    en: "The Digital Artisan — Prompt Engineering",
    pt: "O Artesão Digital — Engenharia de Prompts",
  },
  2: {
    es: "El Arquitecto de Automatización — ChatGPT",
    en: "The Automation Architect — ChatGPT",
    pt: "O Arquiteto de Automação — ChatGPT",
  },
  3: {
    es: "El Detective de Datos — Rastreo Profundo con Gemini",
    en: "The Data Detective — Deep Tracking with Gemini",
    pt: "O Detetive de Dados — Rastreamento com Gemini",
  },
  4: {
    es: "El Alquimista del Conocimiento — Gemini Notebook",
    en: "The Knowledge Alchemist — Gemini Notebook",
    pt: "O Alquimista do Conhecimento — Gemini Notebook",
  },
  5: {
    es: "El Director de Orquesta — Claude",
    en: "The Conductor — Claude",
    pt: "O Maestro — Claude",
  },
};

export const QUIZ_DATA = {
  es: [
    {
      question: "¿Qué significa que Gemini sea un modelo multimodal?",
      options: [
        { id: "a", text: "Que solo procesa texto" },
        { id: "b", text: "Que funciona sin conexión a internet" },
        { id: "c", text: "Que puede entender texto, imágenes, audio y video" },
        { id: "d", text: "Que solo está disponible en inglés" },
      ],
      correct: "c",
    },
    {
      question: "¿Qué es cierto sobre Gemini en Gmail y Docs?",
      options: [
        {
          id: "a",
          text: "Puede resumir hilos largos y sugerir borradores que debes revisar",
        },
        { id: "b", text: "No tiene ninguna integración con Workspace" },
        { id: "c", text: "Solo funciona si cambias de aplicación" },
        { id: "d", text: "Envía los correos sin preguntarte" },
      ],
      correct: "a",
    },
    {
      question: "¿Qué debes hacer con un informe de Deep Research?",
      options: [
        { id: "a", text: "Copiarlo tal cual, porque cita fuentes" },
        { id: "b", text: "Confiar en el resumen sin abrir las fuentes" },
        { id: "c", text: "Ignorar las fuentes porque ya están citadas" },
        {
          id: "d",
          text: "Abrir las fuentes y comprobar que dicen lo que el informe afirma",
        },
      ],
      correct: "d",
    },
    {
      question: "¿Qué ventaja ofrece Gemini al analizar un video?",
      options: [
        { id: "a", text: "Solo puede procesar imágenes estáticas" },
        {
          id: "b",
          text: "Puede describir lo que ocurre en un video corto, y tú verificas los momentos que menciona",
        },
        { id: "c", text: "No puede procesar video, solo texto" },
        { id: "d", text: "Requiere cable para procesar video" },
      ],
      correct: "b",
    },
    {
      question: "¿Por qué Gemini es multimodal desde su núcleo?",
      options: [
        { id: "a", text: "Solo es más rápido que los modelos tradicionales" },
        { id: "b", text: "Los modelos tradicionales también son multimodales" },
        {
          id: "c",
          text: "Está entrenado para trabajar con varios tipos de datos a la vez",
        },
        { id: "d", text: "No procesa código, solo los tradicionales" },
      ],
      correct: "c",
    },
  ],
  en: [
    {
      question: "What does it mean that Gemini is a multimodal model?",
      options: [
        { id: "a", text: "It only processes text" },
        { id: "b", text: "It works without an internet connection" },
        { id: "c", text: "It can understand text, images, audio and video" },
        { id: "d", text: "It is only available in English" },
      ],
      correct: "c",
    },
    {
      question: "What is true about Gemini in Gmail and Docs?",
      options: [
        {
          id: "a",
          text: "It can summarize long threads and suggest drafts that you must review",
        },
        { id: "b", text: "It has no integration with Workspace" },
        { id: "c", text: "It only works if you switch apps" },
        { id: "d", text: "It sends emails without asking you" },
      ],
      correct: "a",
    },
    {
      question: "What should you do with a Deep Research report?",
      options: [
        { id: "a", text: "Copy it as is, because it cites sources" },
        { id: "b", text: "Trust the summary without opening the sources" },
        { id: "c", text: "Ignore the sources because they are already cited" },
        {
          id: "d",
          text: "Open the sources and check they say what the report claims",
        },
      ],
      correct: "d",
    },
    {
      question: "What advantage does Gemini offer when analyzing a video?",
      options: [
        { id: "a", text: "It can only process static images" },
        {
          id: "b",
          text: "It can describe what happens in a short video, and you check the moments it mentions",
        },
        { id: "c", text: "It cannot process video, only text" },
        { id: "d", text: "It needs a cable to process video" },
      ],
      correct: "b",
    },
    {
      question: "Why is Gemini multimodal at its core?",
      options: [
        { id: "a", text: "It is only faster than traditional models" },
        { id: "b", text: "Traditional models are also multimodal" },
        {
          id: "c",
          text: "It is trained to work with several types of data at once",
        },
        {
          id: "d",
          text: "It does not process code, only traditional models do",
        },
      ],
      correct: "c",
    },
  ],
  pt: [
    {
      question: "O que significa dizer que o Gemini é um modelo multimodal?",
      options: [
        { id: "a", text: "Que só processa texto" },
        { id: "b", text: "Que funciona sem conexão com a internet" },
        { id: "c", text: "Que pode entender texto, imagens, áudio e vídeo" },
        { id: "d", text: "Que só está disponível em inglês" },
      ],
      correct: "c",
    },
    {
      question: "O que é verdade sobre o Gemini no Gmail e no Docs?",
      options: [
        {
          id: "a",
          text: "Pode resumir conversas longas e sugerir rascunhos que você deve revisar",
        },
        { id: "b", text: "Não tem nenhuma integração com o Workspace" },
        { id: "c", text: "Só funciona se você trocar de aplicativo" },
        { id: "d", text: "Envia os e-mails sem perguntar" },
      ],
      correct: "a",
    },
    {
      question: "O que você deve fazer com um relatório do Deep Research?",
      options: [
        { id: "a", text: "Copiá-lo como está, porque cita fontes" },
        { id: "b", text: "Confiar no resumo sem abrir as fontes" },
        { id: "c", text: "Ignorar as fontes porque já estão citadas" },
        {
          id: "d",
          text: "Abrir as fontes e conferir se dizem o que o relatório afirma",
        },
      ],
      correct: "d",
    },
    {
      question: "Que vantagem o Gemini oferece ao analisar um vídeo?",
      options: [
        { id: "a", text: "Só pode processar imagens estáticas" },
        {
          id: "b",
          text: "Pode descrever o que acontece em um vídeo curto, e você confere os momentos que menciona",
        },
        { id: "c", text: "Não processa vídeo, só texto" },
        { id: "d", text: "Precisa de cabo para processar vídeo" },
      ],
      correct: "b",
    },
    {
      question: "Por que o Gemini é multimodal desde o núcleo?",
      options: [
        { id: "a", text: "Só é mais rápido que os modelos tradicionais" },
        { id: "b", text: "Os modelos tradicionais também são multimodais" },
        {
          id: "c",
          text: "Foi treinado para trabalhar com vários tipos de dados ao mesmo tempo",
        },
        { id: "d", text: "Não processa código, só os tradicionais" },
      ],
      correct: "c",
    },
  ],
};
