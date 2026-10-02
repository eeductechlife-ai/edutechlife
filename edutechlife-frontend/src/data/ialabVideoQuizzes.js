// Micro-quizzes de comprensión posteriores al video (Fase 1 pedagógica).
// 3 preguntas por video, con feedback. Se usan para desbloquear el marcado
// "visto" además del gate de reproducción.

const ES = {
  "intro-video-1": [
    {
      q: "¿Qué caracteriza a la IA generativa?",
      options: [
        "Crea contenido nuevo (texto, imagen, audio) a partir de patrones aprendidos",
        "Solo clasifica datos en categorías fijas",
        "Reemplaza toda decisión humana",
      ],
      correct: 0,
      feedback:
        "La IA generativa produce contenido nuevo; no solo clasifica ni decide por ti.",
    },
    {
      q: "Si un prompt es vago y genérico, ¿qué suele faltar?",
      options: [
        "Más velocidad del servidor",
        "Contexto y especificidad en la instrucción",
        "Cambiar de idioma",
      ],
      correct: 1,
      feedback:
        "El contexto y la especificidad son lo que evita respuestas genéricas.",
    },
    {
      q: "¿Cuál es el rol del estudiante frente a la IA?",
      options: [
        "Aceptar siempre la primera respuesta",
        "Delegar por completo las decisiones",
        "Revisar y validar la información antes de usarla",
      ],
      correct: 2,
      feedback:
        "La IA acelera el trabajo, pero la revisión y la decisión final son tuyas.",
    },
  ],
  "prompt-video-1": [
    {
      q: "¿Qué fórmula estructura un prompt claro?",
      options: ["RTF: Rol + Tarea + Formato", "HTML", "SQL"],
      correct: 0,
      feedback:
        "RTF (Rol, Tarea, Formato) ordena la instrucción para obtener respuestas claras.",
    },
    {
      q: "¿Por qué conviene iterar el prompt?",
      options: [
        "Porque hay que acertar a la primera",
        "Porque cada ajuste acerca el resultado al objetivo",
        "Porque la IA se cansa si no",
      ],
      correct: 1,
      feedback: "Iterar es parte del proceso: cada ajuste mejora el resultado.",
    },
    {
      q: "¿Qué define mejor la 'claridad' de un prompt?",
      options: [
        "Usar el mayor número de palabras posible",
        "Menos ambigüedad y más precisión en lo que pides",
        "Escribir en mayúsculas",
      ],
      correct: 1,
      feedback:
        "Claridad = menos ambigüedad, más precisión sobre el resultado esperado.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "¿Qué es ChatGPT?",
      options: [
        "Un motor de búsqueda de enlaces",
        "Un asistente conversacional que genera y transforma texto",
        "Una hoja de cálculo",
      ],
      correct: 1,
      feedback:
        "ChatGPT es un asistente conversacional basado en un modelo de lenguaje.",
    },
    {
      q: "¿Qué ayuda a obtener mejores respuestas de ChatGPT?",
      options: [
        "Dar rol, contexto y objetivo",
        "Escribir una sola palabra",
        "Repetir el mismo prompt sin cambios",
      ],
      correct: 0,
      feedback: "Rol, contexto y objetivo orientan la respuesta.",
    },
    {
      q: "¿Cuál es una buena práctica de seguridad con ChatGPT?",
      options: [
        "Compartir datos confidenciales sin revisar",
        "No subir información sensible innecesaria",
        "Confiar sin verificar datos críticos",
      ],
      correct: 1,
      feedback:
        "Evita exponer datos sensibles y verifica la información crítica.",
    },
  ],
  "gemini-video-1": [
    {
      q: "¿Qué significa 'multimodal' en Gemini?",
      options: [
        "Que solo procesa texto",
        "Que entiende texto, imágenes, audio y video",
        "Que funciona sin internet",
      ],
      correct: 1,
      feedback:
        "Multimodal = trabaja con varios tipos de datos a la vez (texto, imagen, audio, video).",
    },
    {
      q: "¿Cómo se conecta Gemini con el trabajo diario?",
      options: [
        "Solo con Google Chrome",
        "Integrado en Gmail, Docs, Sheets y Meet",
        "No tiene integración",
      ],
      correct: 1,
      feedback:
        "Gemini se integra nativamente en las apps de Google Workspace.",
    },
    {
      q: "¿Para qué sirve Deep Research en Gemini?",
      options: [
        "Buscar en tiempo real y entregar informes con fuentes",
        "Inventar datos verosímiles",
        "Solo traducir textos",
      ],
      correct: 0,
      feedback:
        "Deep Research busca, cruza fuentes y entrega informes con citas verificables.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "¿Cuál es la ventaja principal de Deep Research?",
      options: [
        "Responde con datos de entrenamiento",
        "Analiza cientos de fuentes y cita las referencias",
        "Evita leer documentos",
      ],
      correct: 1,
      feedback:
        "Deep Research rastrea y cita fuentes: ideal para informes verificables.",
    },
    {
      q: "Ante dos respuestas distintas, ¿qué es lo más crítico?",
      options: [
        "Elegir la más larga",
        "Contrastar con fuentes y decidir con evidencia",
        "Quedarte con la primera",
      ],
      correct: 1,
      feedback: "Contrastar con evidencia es lo que da rigor a la decisión.",
    },
    {
      q: "¿Qué mejora un informe de investigación?",
      options: [
        "Delimitar la pregunta y citar cada fuente",
        "Evitar las fuentes",
        "Copiar y pegar sin revisar",
      ],
      correct: 0,
      feedback: "Pregunta delimitada + citas = informe riguroso y rastreable.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "¿En qué se basa NotebookLM para responder?",
      options: [
        "En todo el internet",
        "En las fuentes que tú cargas",
        "En el azar",
      ],
      correct: 1,
      feedback:
        "NotebookLM responde estrictamente sobre los documentos que tú subes.",
    },
    {
      q: "¿Qué hace especial a sus respuestas?",
      options: [
        "Trae citas de tus propios documentos",
        "Ignora tus archivos",
        "Genera imágenes",
      ],
      correct: 0,
      feedback: "Cita tus fuentes, lo que facilita verificar cada dato.",
    },
    {
      q: "Si no encuentra un dato que preguntas, ¿qué significa?",
      options: [
        "Que el dato no está en tus documentos",
        "Que la herramienta está dañada",
        "Que debes pedirle que lo invente",
      ],
      correct: 0,
      feedback:
        "NotebookLM no inventa: si no está en tus fuentes, no puede responderlo.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "¿Qué es un Audio Overview en NotebookLM?",
      options: [
        "Un resumen en formato de conversación de audio",
        "Un documento PDF",
        "Una tabla de datos",
      ],
      correct: 0,
      feedback:
        "Convierte tus fuentes en un resumen conversacional para escuchar.",
    },
    {
      q: "¿Cuándo resulta más útil el audio?",
      options: [
        "Para repasar mientras te desplazas",
        "Para editar imágenes",
        "Para instalar software",
      ],
      correct: 0,
      feedback: "Es ideal para repaso pasivo en traslados o tareas.",
    },
    {
      q: "¿Qué debes hacer antes de generar el audio?",
      options: [
        "Cargar y curar fuentes relevantes",
        "No cargar nada",
        "Subir archivos al azar",
      ],
      correct: 0,
      feedback:
        "La calidad del audio depende de la calidad y curaduría de tus fuentes.",
    },
  ],
  "bias-video-1": [
    {
      q: "¿Qué es el sesgo de muestreo?",
      options: [
        "Los datos de entrenamiento no representan a toda la población",
        "El sistema funciona lento",
        "El modelo cambia de idioma",
      ],
      correct: 0,
      feedback:
        "Ocurre cuando la muestra de entrenamiento no representa a la población real.",
    },
    {
      q: "¿Por qué importa auditar sesgos?",
      options: [
        "Para que la IA sea más rápida",
        "Para evitar decisiones injustas y discriminatorias",
        "Para gastar menos",
      ],
      correct: 1,
      feedback: "Auditar sesgos protege la equidad de las decisiones.",
    },
    {
      q: "¿Cuál es una buena práctica ante un posible sesgo?",
      options: [
        "Ignorarlo si la IA es rápida",
        "Revisar los datos y la supervisión humana",
        "Confiar ciegamente en el modelo",
      ],
      correct: 1,
      feedback:
        "Revisar datos y mantener supervisión humana reduce el riesgo de sesgo.",
    },
  ],
  "privacy-video-1": [
    {
      q: "¿Qué dato NO conviene compartir con una IA pública?",
      options: [
        "Información personal o confidencial sensible",
        "Una pregunta general",
        "Un texto público",
      ],
      correct: 0,
      feedback: "Evita exponer datos personales o confidenciales sensibles.",
    },
    {
      q: "¿Qué implica la minimización de datos?",
      options: [
        "Recoger y compartir solo lo necesario",
        "Recoger todo lo posible",
        "Guardar datos sin límite",
      ],
      correct: 0,
      feedback: "Minimizar = usar solo los datos estrictamente necesarios.",
    },
    {
      q: "¿Quién es responsable de proteger los datos del estudiante?",
      options: [
        "Nadie",
        "La institución y el usuario con buenas prácticas",
        "Solo la IA",
      ],
      correct: 1,
      feedback:
        "La protección es corresponsabilidad entre institución y usuario.",
    },
  ],
  "ethics-video-1": [
    {
      q: "¿Qué implica el principio de transparencia?",
      options: [
        "Ocultar que se usa IA",
        "Informar claramente cuándo y cómo se usa la IA",
        "Esconder las decisiones",
      ],
      correct: 1,
      feedback: "Transparencia es informar de forma clara el uso de IA.",
    },
    {
      q: "¿Qué significa 'accountability' (responsabilidad)?",
      options: [
        "Que la IA es la única responsable",
        "Que hay personas y procesos que responden por los resultados",
        "Que nadie responde",
      ],
      correct: 1,
      feedback:
        "Debe haber responsables humanos y procesos claros ante los resultados.",
    },
    {
      q: "¿Qué busca la explicabilidad?",
      options: [
        "Que las decisiones se puedan entender y justificar",
        "Que el sistema nunca falle",
        "Que sea más rápido",
      ],
      correct: 0,
      feedback:
        "Explicabilidad = poder entender y justificar las decisiones ante las personas.",
    },
  ],
};

const EN = {
  "intro-video-1": [
    {
      q: "What characterizes generative AI?",
      options: [
        "It creates new content (text, image, audio) from learned patterns",
        "It only sorts data into fixed categories",
        "It replaces all human decisions",
      ],
      correct: 0,
      feedback:
        "Generative AI produces new content; it doesn't just classify or decide for you.",
    },
    {
      q: "If a prompt is vague and generic, what is usually missing?",
      options: [
        "More server speed",
        "Context and specificity in the instruction",
        "Changing language",
      ],
      correct: 1,
      feedback: "Context and specificity are what prevent generic answers.",
    },
    {
      q: "What is the student's role with AI?",
      options: [
        "Always accept the first answer",
        "Fully delegate decisions",
        "Review and validate information before using it",
      ],
      correct: 2,
      feedback:
        "AI speeds up work, but review and the final decision are yours.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Which formula structures a clear prompt?",
      options: ["RTF: Role + Task + Format", "HTML", "SQL"],
      correct: 0,
      feedback:
        "RTF (Role, Task, Format) orders the instruction for clear answers.",
    },
    {
      q: "Why iterate on the prompt?",
      options: [
        "Because you must be right the first time",
        "Because each adjustment gets closer to the goal",
        "Because the AI gets tired otherwise",
      ],
      correct: 1,
      feedback:
        "Iterating is part of the process: each tweak improves the result.",
    },
    {
      q: "What best defines prompt 'clarity'?",
      options: [
        "Using as many words as possible",
        "Less ambiguity and more precision in what you ask",
        "Writing in capitals",
      ],
      correct: 1,
      feedback:
        "Clarity = less ambiguity, more precision about the expected result.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "What is ChatGPT?",
      options: [
        "A link search engine",
        "A conversational assistant that generates and transforms text",
        "A spreadsheet",
      ],
      correct: 1,
      feedback:
        "ChatGPT is a conversational assistant based on a language model.",
    },
    {
      q: "What helps get better answers from ChatGPT?",
      options: [
        "Giving role, context and goal",
        "Writing a single word",
        "Repeating the same prompt unchanged",
      ],
      correct: 0,
      feedback: "Role, context and goal steer the answer.",
    },
    {
      q: "What is a good security practice with ChatGPT?",
      options: [
        "Sharing confidential data without checking",
        "Not uploading unnecessary sensitive information",
        "Trusting critical data without verifying",
      ],
      correct: 1,
      feedback:
        "Avoid exposing sensitive data and verify critical information.",
    },
  ],
  "gemini-video-1": [
    {
      q: "What does 'multimodal' mean in Gemini?",
      options: [
        "It only processes text",
        "It understands text, images, audio and video",
        "It works without internet",
      ],
      correct: 1,
      feedback: "Multimodal = works with several data types at once.",
    },
    {
      q: "How does Gemini connect to daily work?",
      options: [
        "Only with Google Chrome",
        "Integrated into Gmail, Docs, Sheets and Meet",
        "It has no integration",
      ],
      correct: 1,
      feedback: "Gemini is natively integrated into Google Workspace apps.",
    },
    {
      q: "What is Deep Research in Gemini for?",
      options: [
        "Searching in real time and delivering reports with sources",
        "Inventing plausible data",
        "Only translating texts",
      ],
      correct: 0,
      feedback: "Deep Research searches, cross-references and cites sources.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "What is the main advantage of Deep Research?",
      options: [
        "It answers from training data",
        "It analyzes hundreds of sources and cites references",
        "It avoids reading documents",
      ],
      correct: 1,
      feedback:
        "Deep Research tracks and cites sources: ideal for verifiable reports.",
    },
    {
      q: "Facing two different answers, what is most critical?",
      options: [
        "Choosing the longest",
        "Cross-checking sources and deciding with evidence",
        "Keeping the first one",
      ],
      correct: 1,
      feedback: "Cross-checking with evidence is what gives rigor.",
    },
    {
      q: "What improves a research report?",
      options: [
        "Delimiting the question and citing each source",
        "Avoiding sources",
        "Copying and pasting without reviewing",
      ],
      correct: 0,
      feedback:
        "A delimited question + citations = rigorous, traceable report.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "What does NotebookLM base its answers on?",
      options: [
        "The whole internet",
        "The sources you upload",
        "Random chance",
      ],
      correct: 1,
      feedback: "NotebookLM answers strictly from the documents you upload.",
    },
    {
      q: "What makes its answers special?",
      options: [
        "It cites your own documents",
        "It ignores your files",
        "It generates images",
      ],
      correct: 0,
      feedback: "It cites your sources, which makes each fact easy to verify.",
    },
    {
      q: "If it can't find a fact you ask for, what does it mean?",
      options: [
        "The fact isn't in your documents",
        "The tool is broken",
        "You should ask it to make it up",
      ],
      correct: 0,
      feedback:
        "NotebookLM does not invent: if it's not in your sources, it can't answer.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "What is an Audio Overview in NotebookLM?",
      options: [
        "A summary in audio conversation format",
        "A PDF document",
        "A data table",
      ],
      correct: 0,
      feedback:
        "It turns your sources into a conversational summary to listen to.",
    },
    {
      q: "When is the audio most useful?",
      options: [
        "To review while commuting",
        "To edit images",
        "To install software",
      ],
      correct: 0,
      feedback: "It's ideal for passive review during commutes or chores.",
    },
    {
      q: "What should you do before generating the audio?",
      options: [
        "Upload and curate relevant sources",
        "Upload nothing",
        "Upload files at random",
      ],
      correct: 0,
      feedback:
        "Audio quality depends on the quality and curation of your sources.",
    },
  ],
  "bias-video-1": [
    {
      q: "What is sampling bias?",
      options: [
        "Training data does not represent the whole population",
        "The system runs slowly",
        "The model changes language",
      ],
      correct: 0,
      feedback:
        "It happens when the training sample doesn't represent the real population.",
    },
    {
      q: "Why audit for bias?",
      options: [
        "To make AI faster",
        "To avoid unfair and discriminatory decisions",
        "To spend less",
      ],
      correct: 1,
      feedback: "Auditing bias protects the fairness of decisions.",
    },
    {
      q: "Good practice for a possible bias?",
      options: [
        "Ignore it if AI is fast",
        "Review the data and keep human oversight",
        "Trust the model blindly",
      ],
      correct: 1,
      feedback: "Reviewing data and keeping human oversight reduces bias risk.",
    },
  ],
  "privacy-video-1": [
    {
      q: "What data should NOT be shared with a public AI?",
      options: [
        "Sensitive personal or confidential information",
        "A general question",
        "A public text",
      ],
      correct: 0,
      feedback: "Avoid exposing sensitive personal or confidential data.",
    },
    {
      q: "What does data minimization mean?",
      options: [
        "Collect and share only what's needed",
        "Collect as much as possible",
        "Store data without limits",
      ],
      correct: 0,
      feedback: "Minimize = use only strictly necessary data.",
    },
    {
      q: "Who is responsible for protecting student data?",
      options: [
        "Nobody",
        "The institution and the user with good practices",
        "Only the AI",
      ],
      correct: 1,
      feedback:
        "Protection is a shared responsibility between institution and user.",
    },
  ],
  "ethics-video-1": [
    {
      q: "What does the transparency principle imply?",
      options: [
        "Hiding that AI is used",
        "Clearly informing when and how AI is used",
        "Hiding decisions",
      ],
      correct: 1,
      feedback: "Transparency is clearly informing the use of AI.",
    },
    {
      q: "What does 'accountability' mean?",
      options: [
        "That AI is solely responsible",
        "That there are people and processes accountable for outcomes",
        "That nobody is responsible",
      ],
      correct: 1,
      feedback: "There must be human owners and clear processes for outcomes.",
    },
    {
      q: "What does explainability seek?",
      options: [
        "That decisions can be understood and justified",
        "That the system never fails",
        "That it is faster",
      ],
      correct: 0,
      feedback:
        "Explainability = being able to understand and justify decisions.",
    },
  ],
};

const PT = {
  "intro-video-1": [
    {
      q: "O que caracteriza a IA generativa?",
      options: [
        "Cria conteúdo novo (texto, imagem, áudio) a partir de padrões aprendidos",
        "Apenas classifica dados em categorias fixas",
        "Substitui toda decisão humana",
      ],
      correct: 0,
      feedback: "A IA generativa produz conteúdo novo; não apenas classifica.",
    },
    {
      q: "Se um prompt é vago e genérico, o que costuma faltar?",
      options: [
        "Mais velocidade do servidor",
        "Contexto e especificidade na instrução",
        "Mudar de idioma",
      ],
      correct: 1,
      feedback: "Contexto e especificidade evitam respostas genéricas.",
    },
    {
      q: "Qual é o papel do estudante diante da IA?",
      options: [
        "Aceitar sempre a primeira resposta",
        "Delegar totalmente as decisões",
        "Revisar e validar a informação antes de usá-la",
      ],
      correct: 2,
      feedback: "A revisão e a decisão final são suas.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Qual fórmula estrutura um prompt claro?",
      options: ["RTF: Papel + Tarefa + Formato", "HTML", "SQL"],
      correct: 0,
      feedback: "RTF (Papel, Tarefa, Formato) organiza a instrução.",
    },
    {
      q: "Por que iterar o prompt?",
      options: [
        "Porque é preciso acertar de primeira",
        "Porque cada ajuste aproxima do objetivo",
        "Porque a IA se cansa",
      ],
      correct: 1,
      feedback: "Iterar faz parte do processo.",
    },
    {
      q: "O que define melhor a 'clareza' de um prompt?",
      options: [
        "Usar o máximo de palavras",
        "Menos ambiguidade e mais precisão no pedido",
        "Escrever em maiúsculas",
      ],
      correct: 1,
      feedback: "Clareza = menos ambiguidade, mais precisão.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "O que é o ChatGPT?",
      options: [
        "Um buscador de links",
        "Um assistente conversacional que gera e transforma texto",
        "Uma planilha",
      ],
      correct: 1,
      feedback: "ChatGPT é um assistente conversacional.",
    },
    {
      q: "O que ajuda a obter melhores respostas?",
      options: [
        "Dar papel, contexto e objetivo",
        "Escrever uma única palavra",
        "Repetir o mesmo prompt sem mudança",
      ],
      correct: 0,
      feedback: "Papel, contexto e objetivo orientam a resposta.",
    },
    {
      q: "Boa prática de segurança com ChatGPT?",
      options: [
        "Compartilhar dados confidenciais sem revisar",
        "Não enviar informação sensível desnecessária",
        "Confiar sem verificar dados críticos",
      ],
      correct: 1,
      feedback: "Evite expor dados sensíveis e verifique o crítico.",
    },
  ],
  "gemini-video-1": [
    {
      q: "O que significa 'multimodal' no Gemini?",
      options: [
        "Só processa texto",
        "Entende texto, imagens, áudio e vídeo",
        "Funciona sem internet",
      ],
      correct: 1,
      feedback: "Multimodal = trabalha com vários tipos de dados.",
    },
    {
      q: "Como o Gemini se conecta ao trabalho diário?",
      options: [
        "Só com o Google Chrome",
        "Integrado ao Gmail, Docs, Sheets e Meet",
        "Não tem integração",
      ],
      correct: 1,
      feedback: "Integra-se nativamente ao Google Workspace.",
    },
    {
      q: "Para que serve o Deep Research no Gemini?",
      options: [
        "Buscar em tempo real e entregar relatórios com fontes",
        "Inventar dados verossímeis",
        "Apenas traduzir textos",
      ],
      correct: 0,
      feedback: "Deep Research busca, cruza e cita fontes.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "Qual é a principal vantagem do Deep Research?",
      options: [
        "Responde com dados de treinamento",
        "Analisa centenas de fontes e cita referências",
        "Evita ler documentos",
      ],
      correct: 1,
      feedback: "Rastreia e cita fontes: ideal para relatórios verificáveis.",
    },
    {
      q: "Diante de duas respostas distintas, o que é mais crítico?",
      options: [
        "Escolher a mais longa",
        "Contrastar com fontes e decidir com evidência",
        "Ficar com a primeira",
      ],
      correct: 1,
      feedback: "Contrastar com evidência dá rigor à decisão.",
    },
    {
      q: "O que melhora um relatório de pesquisa?",
      options: [
        "Delimitar a pergunta e citar cada fonte",
        "Evitar fontes",
        "Copiar e colar sem revisar",
      ],
      correct: 0,
      feedback: "Pergunta delimitada + citações = relatório rigoroso.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "Em que o NotebookLM baseia suas respostas?",
      options: ["Em toda a internet", "Nas fontes que você envia", "No acaso"],
      correct: 1,
      feedback: "Responde estritamente sobre os documentos que você envia.",
    },
    {
      q: "O que há de especial nas respostas?",
      options: [
        "Traz citações dos seus próprios documentos",
        "Ignora seus arquivos",
        "Gera imagens",
      ],
      correct: 0,
      feedback: "Cita suas fontes, facilitando verificar cada dado.",
    },
    {
      q: "Se não encontra um dado, o que significa?",
      options: [
        "Que o dado não está nos seus documentos",
        "Que a ferramenta está quebrada",
        "Que deve pedir para inventar",
      ],
      correct: 0,
      feedback:
        "O NotebookLM não inventa: se não está nas fontes, não responde.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "O que é um Audio Overview no NotebookLM?",
      options: [
        "Um resumo em formato de conversa em áudio",
        "Um documento PDF",
        "Uma tabela de dados",
      ],
      correct: 0,
      feedback:
        "Transforma suas fontes em um resumo conversacional para ouvir.",
    },
    {
      q: "Quando o áudio é mais útil?",
      options: [
        "Para revisar durante deslocamentos",
        "Para editar imagens",
        "Para instalar software",
      ],
      correct: 0,
      feedback: "Ideal para revisão passiva em trânsito.",
    },
    {
      q: "O que fazer antes de gerar o áudio?",
      options: [
        "Carregar e curar fontes relevantes",
        "Não carregar nada",
        "Enviar arquivos aleatórios",
      ],
      correct: 0,
      feedback: "A qualidade do áudio depende da curadoria das fontes.",
    },
  ],
  "bias-video-1": [
    {
      q: "O que é o viés de amostragem?",
      options: [
        "Os dados de treino não representam toda a população",
        "O sistema fica lento",
        "O modelo muda de idioma",
      ],
      correct: 0,
      feedback: "Ocorre quando a amostra não representa a população real.",
    },
    {
      q: "Por que auditar vieses?",
      options: [
        "Para a IA ser mais rápida",
        "Para evitar decisões injustas e discriminatórias",
        "Para gastar menos",
      ],
      correct: 1,
      feedback: "Auditar vieses protege a equidade das decisões.",
    },
    {
      q: "Boa prática diante de um possível viés?",
      options: [
        "Ignorar se a IA for rápida",
        "Revisar os dados e manter supervisão humana",
        "Confiar cegamente no modelo",
      ],
      correct: 1,
      feedback: "Revisar dados e manter supervisão reduz o risco.",
    },
  ],
  "privacy-video-1": [
    {
      q: "Qual dado NÃO se deve compartilhar com uma IA pública?",
      options: [
        "Informação pessoal ou confidencial sensível",
        "Uma pergunta geral",
        "Um texto público",
      ],
      correct: 0,
      feedback: "Evite expor dados pessoais ou confidenciais.",
    },
    {
      q: "O que significa minimização de dados?",
      options: [
        "Coletar e compartilhar só o necessário",
        "Coletar o máximo possível",
        "Guardar sem limites",
      ],
      correct: 0,
      feedback: "Minimizar = usar apenas os dados estritamente necessários.",
    },
    {
      q: "Quem é responsável por proteger os dados do estudante?",
      options: [
        "Ninguém",
        "A instituição e o usuário com boas práticas",
        "Só a IA",
      ],
      correct: 1,
      feedback: "A proteção é corresponsabilidade.",
    },
  ],
  "ethics-video-1": [
    {
      q: "O que implica o princípio de transparência?",
      options: [
        "Ocultar que se usa IA",
        "Informar claramente quando e como se usa a IA",
        "Esconder as decisões",
      ],
      correct: 1,
      feedback: "Transparência é informar claramente o uso de IA.",
    },
    {
      q: "O que significa 'accountability' (responsabilidade)?",
      options: [
        "Que a IA é a única responsável",
        "Que há pessoas e processos que respondem pelos resultados",
        "Que ninguém responde",
      ],
      correct: 1,
      feedback: "Deve haver responsáveis humanos e processos claros.",
    },
    {
      q: "O que busca a explicabilidade?",
      options: [
        "Que as decisões possam ser entendidas e justificadas",
        "Que o sistema nunca falhe",
        "Que seja mais rápido",
      ],
      correct: 0,
      feedback: "Explicabilidade = entender e justificar as decisões.",
    },
  ],
};

export const VIDEO_QUIZZES = { es: ES, en: EN, pt: PT };

export function getVideoQuiz(videoId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = VIDEO_QUIZZES[lang] || VIDEO_QUIZZES.es;
  return pack[videoId] || null;
}

export default VIDEO_QUIZZES;
