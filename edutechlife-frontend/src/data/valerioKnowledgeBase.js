const KNOWLEDGE_BASE = [
  {
    id: "kb-1",
    keywords: [
      "prompt",
      "ingeniería de prompts",
      "prompt engineering",
      "instrucción",
      "instruction",
    ],
    en: {
      question: "What is prompt engineering?",
      answer: `Prompt engineering is the practice of designing and refining instructions given to AI models to get accurate, useful responses. Think of it as learning to communicate effectively with AI — the clearer and more specific your instruction, the better the result.

Key principles include: being specific about the task, providing context, defining the desired format, and iterating based on results. In our course, we explore techniques like role assignment, chain-of-thought prompting, and structured outputs.`,
    },
    es: {
      question: "¿Qué es la ingeniería de prompts?",
      answer: `La ingeniería de prompts es la práctica de diseñar y refinar las instrucciones que le damos a la IA para obtener respuestas precisas y útiles. Es como aprender a comunicarte efectivamente con la IA — cuanto más clara y específica sea tu instrucción, mejor será el resultado.

Los principios clave incluyen: ser específico sobre la tarea, proporcionar contexto, definir el formato deseado e iterar según los resultados. En nuestro curso, exploramos técnicas como asignación de roles, chain-of-thought y salidas estructuradas.`,
    },
    pt: {
      question: "O que é engenharia de prompts?",
      answer: `Engenharia de prompts é a prática de projetar e refinar as instruções que damos à IA para obter respostas precisas e úteis. É como aprender a se comunicar de forma eficaz com a IA — quanto mais clara e específica for a sua instrução, melhor será o resultado.

Os princípios-chave incluem: ser específico sobre a tarefa, fornecer contexto, definir o formato desejado e iterar com base nos resultados. No nosso curso, exploramos técnicas como atribuição de papéis, chain-of-thought e saídas estruturadas.`,
    },
  },
  {
    id: "kb-2",
    keywords: ["chatgpt", "gpt", "modelo", "model", "openai"],
    en: {
      question: "How does ChatGPT work?",
      answer: `ChatGPT is a conversational AI developed by OpenAI, based on the GPT (Generative Pre-trained Transformer) architecture. It processes text input and generates human-like responses by predicting the most likely next words based on patterns learned from vast amounts of text data.

ChatGPT can be customized through System Prompts, which set the AI's behavior and role. In our "Potencia ChatGPT" module, we cover how to configure conversations, create custom GPTs, and use tools like Advanced Data Analysis and Function Calling.`,
    },
    es: {
      question: "¿Cómo funciona ChatGPT?",
      answer: `ChatGPT es una IA conversacional desarrollada por OpenAI, basada en la arquitectura GPT (Generative Pre-trained Transformer). Procesa texto de entrada y genera respuestas similares a las humanas prediciendo las palabras más probables según patrones aprendidos de grandes cantidades de datos textuales.

ChatGPT se puede personalizar mediante System Prompts, que definen el comportamiento y rol de la IA. En nuestro módulo "Potencia ChatGPT", cubrimos cómo configurar conversaciones, crear GPTs personalizados y usar herramientas como Advanced Data Analysis y Function Calling.`,
    },
    pt: {
      question: "Como funciona o ChatGPT?",
      answer: `O ChatGPT é uma IA conversacional desenvolvida pela OpenAI, baseada na arquitetura GPT (Generative Pre-trained Transformer). Ele processa texto de entrada e gera respostas semelhantes às humanas prevendo as palavras mais prováveis com base em padrões aprendidos a partir de grandes quantidades de dados textuais.

O ChatGPT pode ser personalizado por meio de System Prompts, que definem o comportamento e o papel da IA. No nosso módulo "Potencialize o ChatGPT", cobrimos como configurar conversas, criar GPTs personalizados e usar ferramentas como o Advanced Data Analysis e o Function Calling.`,
    },
  },
  {
    id: "kb-3",
    keywords: ["gemini", "google", "multimodal", "deep research"],
    en: {
      question: "What makes Gemini different from other AI models?",
      answer: `Gemini, developed by Google DeepMind, is a multimodal AI model that can process text, images, audio, and video simultaneously. Unlike models that only handle text, Gemini can "see" and "hear" your input, making it ideal for tasks that require understanding multiple formats.

Gemini also integrates with Google Workspace (Docs, Sheets, Gmail) and features Deep Research capabilities for thorough investigation with source verification. Our "Rastreo Profundo con Gemini" module covers all of this in detail.`,
    },
    es: {
      question: "¿Qué hace diferente a Gemini de otros modelos de IA?",
      answer: `Gemini, desarrollado por Google DeepMind, es un modelo de IA multimodal que puede procesar texto, imágenes, audio y video simultáneamente. A diferencia de los modelos que solo manejan texto, Gemini puede "ver" y "escuchar" tu entrada, ideal para tareas que requieren comprensión de múltiples formatos.

Gemini también se integra con Google Workspace (Docs, Sheets, Gmail) y cuenta con capacidades de Deep Research para investigación exhaustiva con verificación de fuentes. Nuestro módulo "Rastreo Profundo con Gemini" cubre todo esto en detalle.`,
    },
    pt: {
      question: "O que torna o Gemini diferente de outros modelos de IA?",
      answer: `O Gemini, desenvolvido pelo Google DeepMind, é um modelo de IA multimodal que pode processar texto, imagens, áudio e vídeo simultaneamente. Ao contrário dos modelos que lidam apenas com texto, o Gemini consegue "ver" e "ouvir" a sua entrada, sendo ideal para tarefas que exigem compreensão de múltiplos formatos.

O Gemini também se integra ao Google Workspace (Docs, Sheets, Gmail) e conta com recursos de Deep Research para investigação aprofundada com verificação de fontes. Nosso módulo "Investigação Profunda com o Gemini" cobre tudo isso em detalhes.`,
    },
  },
  {
    id: "kb-4",
    keywords: [
      "notebooklm",
      "notebook",
      "podcast",
      "audio overview",
      "documento",
      "document",
    ],
    en: {
      question: "What is NotebookLM and how can I use it?",
      answer: `NotebookLM is Google's AI-powered research assistant that lets you upload documents (PDFs, Google Docs, websites) and interact with them through questions, summaries, and insights — all grounded in your sources.

Its standout feature is Audio Overview, which converts your notes into a podcast-like conversation between two AI hosts. This makes reviewing and studying content much more engaging. Our "Inmersión NotebookLM" module explores everything from basic notebook creation to advanced research workflows.`,
    },
    es: {
      question: "¿Qué es NotebookLM y cómo puedo usarlo?",
      answer: `NotebookLM es el asistente de investigación impulsado por IA de Google que te permite subir documentos (PDFs, Google Docs, sitios web) e interactuar con ellos mediante preguntas, resúmenes y análisis — todo fundamentado en tus fuentes.

Su función destacada es Audio Overview, que convierte tus notas en una conversación tipo podcast entre dos anfitriones IA. Esto hace que revisar y estudiar contenido sea mucho más interactivo. Nuestro módulo "Inmersión NotebookLM" explora desde la creación básica de notebooks hasta flujos de investigación avanzados.`,
    },
    pt: {
      question: "O que é o NotebookLM e como posso usá-lo?",
      answer: `O NotebookLM é o assistente de pesquisa do Google, alimentado por IA, que permite enviar documentos (PDFs, Google Docs, sites) e interagir com eles por meio de perguntas, resumos e análises — tudo com base nas suas fontes.

Seu recurso de destaque é o Audio Overview, que transforma suas anotações em uma conversa estilo podcast entre dois anfitriões de IA. Isso torna a revisão e o estudo de conteúdos muito mais envolventes. Nosso módulo "Imersão NotebookLM" explora desde a criação básica de notebooks até fluxos avançados de pesquisa.`,
    },
  },
  {
    id: "kb-5",
    keywords: [
      "ética",
      "ethics",
      "sesgo",
      "bias",
      "privacidad",
      "privacy",
      "responsable",
      "responsible",
    ],
    en: {
      question: "Why is AI ethics important?",
      answer: `AI ethics ensures that artificial intelligence is developed and used in ways that are fair, transparent, and accountable. Key concerns include algorithmic bias (where AI systems discriminate against certain groups), privacy risks, lack of transparency, and accountability gaps.

In our "Ética Aplicada a IA Generativa" module, we provide practical frameworks to identify bias, protect personal data, and make responsible decisions when using AI. Every professional using AI today should understand these principles.`,
    },
    es: {
      question: "¿Por qué es importante la ética en IA?",
      answer: `La ética en IA asegura que la inteligencia artificial se desarrolle y use de manera justa, transparente y responsable. Las principales preocupaciones incluyen el sesgo algorítmico (donde los sistemas de IA discriminan contra ciertos grupos), riesgos de privacidad, falta de transparencia y vacíos de responsabilidad.

En nuestro módulo "Ética Aplicada a IA Generativa", proporcionamos frameworks prácticos para identificar sesgos, proteger datos personales y tomar decisiones responsables al usar IA. Todo profesional que use IA hoy debería entender estos principios.`,
    },
    pt: {
      question: "Por que a ética em IA é importante?",
      answer: `A ética em IA garante que a inteligência artificial seja desenvolvida e usada de forma justa, transparente e responsável. As principais preocupações incluem o viés algorítmico (quando os sistemas de IA discriminam certos grupos), riscos de privacidade, falta de transparência e lacunas de responsabilidade.

No nosso módulo "Ética Aplicada à IA Generativa", fornecemos estruturas práticas para identificar vieses, proteger dados pessoais e tomar decisões responsáveis ao usar IA. Todo profissional que usa IA hoje deveria entender esses princípios.`,
    },
  },
  {
    id: "kb-6",
    keywords: [
      "rol",
      "role",
      "system prompt",
      "system",
      "personalidad",
      "personality",
    ],
    en: {
      question: "How do I assign a role to an AI?",
      answer: `Assigning a role (role prompting) is a powerful technique where you tell the AI to adopt a specific persona — like "act as a tutor," "you are a career coach," or "respond as a data scientist." This dramatically improves response quality by framing the context.

In our module, we teach you to combine role assignment with specific tasks and format instructions. For example: "You are an expert copywriter. Write a 50-word product description for an eco-friendly water bottle, in a friendly tone."`,
    },
    es: {
      question: "¿Cómo asigno un rol a una IA?",
      answer: `Asignar un rol (role prompting) es una técnica poderosa donde le dices a la IA que adopte una personalidad específica — como "actúa como tutor", "eres un coach profesional" o "responde como científico de datos". Esto mejora drásticamente la calidad de la respuesta al enmarcar el contexto.

En nuestro módulo, enseñamos a combinar la asignación de roles con tareas específicas e instrucciones de formato. Por ejemplo: "Eres un copywriter experto. Escribe una descripción de producto de 50 palabras para una botella ecológica, en tono amigable".`,
    },
    pt: {
      question: "Como atribuo um papel a uma IA?",
      answer: `Atribuir um papel (role prompting) é uma técnica poderosa em que você diz à IA para adotar uma persona específica — como "aja como tutor", "você é um coach de carreira" ou "responda como cientista de dados". Isso melhora drasticamente a qualidade da resposta ao enquadrar o contexto.

No nosso módulo, ensinamos a combinar a atribuição de papéis com tarefas específicas e instruções de formato. Por exemplo: "Você é um copywriter experiente. Escreva uma descrição de produto de 50 palavras para uma garrafa ecológica, em tom amigável".`,
    },
  },
  {
    id: "kb-7",
    keywords: [
      "chain of thought",
      "cadena de pensamiento",
      "razonamiento",
      "reasoning",
      "paso a paso",
      "step by step",
    ],
    en: {
      question: "What is chain-of-thought prompting?",
      answer: `Chain-of-thought (CoT) prompting is a technique where you ask the AI to reason step by step before giving a final answer. This mimics how humans solve complex problems by breaking them down into smaller, manageable steps.

CoT is especially useful for math problems, logical reasoning, multi-step analysis, and any task requiring deep thinking. You can trigger it by simply adding "Let's think step by step" or "Reason through this carefully" to your prompt.`,
    },
    es: {
      question: "¿Qué es el chain-of-thought prompting?",
      answer: `Chain-of-thought (CoT) es una técnica donde le pides a la IA que razone paso a paso antes de dar una respuesta final. Esto imita cómo los humanos resolvemos problemas complejos dividiéndolos en pasos más pequeños y manejables.

CoT es especialmente útil para problemas matemáticos, razonamiento lógico, análisis multi-paso y cualquier tarea que requiera pensamiento profundo. Puedes activarlo simplemente añadiendo "Pensemos paso a paso" o "Razona esto cuidadosamente" a tu prompt.`,
    },
    pt: {
      question: "O que é chain-of-thought prompting?",
      answer: `Chain-of-thought (CoT) é uma técnica em que você pede à IA para raciocinar passo a passo antes de dar uma resposta final. Isso imita como os humanos resolvem problemas complexos dividindo-os em etapas menores e gerenciáveis.

O CoT é especialmente útil para problemas matemáticos, raciocínio lógico, análise em múltiplas etapas e qualquer tarefa que exija pensamento profundo. Você pode ativá-lo simplesmente adicionando "Vamos pensar passo a passo" ou "Raciocine sobre isso com cuidado" ao seu prompt.`,
    },
  },
  {
    id: "kb-8",
    keywords: [
      "alucinación",
      "hallucination",
      "inventar",
      "make up",
      "precisión",
      "accuracy",
    ],
    en: {
      question: "Why do AI models hallucinate?",
      answer: `AI hallucinations occur when a model generates information that sounds plausible but is factually incorrect. This happens because language models are designed to predict the most likely next words, not to verify facts.

To minimize hallucinations: always verify AI outputs against reliable sources, use specific prompts (not vague ones), ask the AI to cite sources when appropriate, and treat AI-generated content as a starting point — not the final word. NotebookLM is particularly useful here because it grounds responses in your uploaded documents.`,
    },
    es: {
      question: "¿Por qué alucinan los modelos de IA?",
      answer: `Las alucinaciones de IA ocurren cuando un modelo genera información que suena plausible pero es incorrecta. Esto sucede porque los modelos de lenguaje están diseñados para predecir las palabras más probables, no para verificar hechos.

Para minimizar alucinaciones: siempre verifica los resultados de la IA contra fuentes confiables, usa prompts específicos (no vagos), pide a la IA que cite fuentes cuando sea apropiado, y trata el contenido generado como punto de partida — no como palabra final. NotebookLM es particularmente útil aquí porque fundamenta las respuestas en tus documentos subidos.`,
    },
    pt: {
      question: "Por que os modelos de IA alucinam?",
      answer: `As alucinações de IA ocorrem quando um modelo gera informações que parecem plausíveis, mas são factualmente incorretas. Isso acontece porque os modelos de linguagem são projetados para prever as palavras mais prováveis, e não para verificar fatos.

Para minimizar alucinações: sempre verifique os resultados da IA com fontes confiáveis, use prompts específicos (não vagos), peça à IA para citar fontes quando apropriado e trate o conteúdo gerado como ponto de partida — não como palavra final. O NotebookLM é particularmente útil aqui porque fundamenta as respostas nos documentos que você enviou.`,
    },
  },
  {
    id: "kb-9",
    keywords: [
      "function calling",
      "api",
      "gpt",
      "acción",
      "action",
      "conectar",
      "connect",
    ],
    en: {
      question: "What is Function Calling in ChatGPT?",
      answer: `Function Calling allows ChatGPT to interact with external APIs and perform real-world actions — like querying a database, sending an email, or fetching live data. You define functions in JSON format, and the model decides when to call them based on the conversation.

This turns ChatGPT from a text generator into an autonomous assistant capable of executing tasks. Our module covers how to create GPTs with custom Actions that connect to any public API.`,
    },
    es: {
      question: "¿Qué es Function Calling en ChatGPT?",
      answer: `Function Calling permite que ChatGPT interactúe con APIs externas y realice acciones del mundo real — como consultar una base de datos, enviar un correo u obtener datos en vivo. Defines funciones en formato JSON y el modelo decide cuándo llamarlas según la conversación.

Esto convierte a ChatGPT de un generador de texto a un asistente autónomo capaz de ejecutar tareas. Nuestro módulo cubre cómo crear GPTs con Acciones personalizadas que se conectan a cualquier API pública.`,
    },
    pt: {
      question: "O que é Function Calling no ChatGPT?",
      answer: `O Function Calling permite que o ChatGPT interaja com APIs externas e execute ações do mundo real — como consultar um banco de dados, enviar um e-mail ou obter dados ao vivo. Você define funções em formato JSON e o modelo decide quando chamá-las com base na conversa.

Isso transforma o ChatGPT de um gerador de texto em um assistente autônomo capaz de executar tarefas. Nosso módulo cobre como criar GPTs com Ações personalizadas que se conectam a qualquer API pública.`,
    },
  },
  {
    id: "kb-10",
    keywords: [
      "temperature",
      "temperatura",
      "parámetro",
      "parameter",
      "top_p",
      "top p",
      "configuración",
      "setting",
    ],
    en: {
      question: "What does temperature mean in AI models?",
      answer: `Temperature controls the randomness of AI outputs. A low temperature (0-0.3) makes responses more focused, deterministic, and predictable — ideal for factual answers. A high temperature (0.7-1.0) increases creativity and variety — great for brainstorming or creative writing.

Think of it as a focus dial: low = precise and conservative, high = creative and exploratory. Most practical applications work well between 0.5 and 0.8. You can also adjust Top-P, which controls the probability pool of word choices.`,
    },
    es: {
      question: "¿Qué significa temperature en los modelos de IA?",
      answer: `La temperatura controla la aleatoriedad de las respuestas de la IA. Una temperatura baja (0-0.3) hace las respuestas más enfocadas, deterministas y predecibles — ideal para respuestas factuales. Una temperatura alta (0.7-1.0) aumenta la creatividad y variedad — excelente para lluvia de ideas o escritura creativa.

Piénsalo como un dial de enfoque: bajo = preciso y conservador, alto = creativo y exploratorio. La mayoría de aplicaciones prácticas funcionan bien entre 0.5 y 0.8. También puedes ajustar Top-P, que controla el grupo de probabilidad de selección de palabras.`,
    },
    pt: {
      question: "O que significa temperature nos modelos de IA?",
      answer: `A temperatura controla a aleatoriedade das respostas da IA. Uma temperatura baixa (0-0.3) torna as respostas mais focadas, deterministas e previsíveis — ideal para respostas factuais. Uma temperatura alta (0.7-1.0) aumenta a criatividade e a variedade — excelente para brainstorming ou escrita criativa.

Pense nela como um botão de foco: baixo = preciso e conservador, alto = criativo e exploratório. A maioria das aplicações práticas funciona bem entre 0.5 e 0.8. Você também pode ajustar o Top-P, que controla o conjunto de probabilidades para a escolha de palavras.`,
    },
  },
  {
    id: "kb-11",
    keywords: [
      "few shot",
      "few-shot",
      "ejemplo",
      "example",
      "muestra",
      "sample",
    ],
    en: {
      question: "What is few-shot prompting?",
      answer: `Few-shot prompting means providing a few examples (usually 2-5) within your prompt to show the AI exactly what kind of response you expect. This is one of the most effective techniques for getting consistent, high-quality outputs.

For example, instead of saying "Translate these to Spanish," you'd write: "Hello -> Hola, Good morning -> Buenos días, How are you? ->" and the AI will infer the pattern. Our course covers when to use zero-shot vs few-shot and how many examples are optimal.`,
    },
    es: {
      question: "¿Qué es el few-shot prompting?",
      answer: `Few-shot prompting significa proporcionar algunos ejemplos (generalmente 2-5) dentro de tu prompt para mostrarle a la IA exactamente qué tipo de respuesta esperas. Es una de las técnicas más efectivas para obtener resultados consistentes y de alta calidad.

Por ejemplo, en lugar de decir "Traduce estos al inglés", escribirías: "Hola -> Hello, Buenos días -> Good morning, ¿Cómo estás? ->" y la IA inferirá el patrón. Nuestro curso cubre cuándo usar zero-shot vs few-shot y cuántos ejemplos son óptimos.`,
    },
    pt: {
      question: "O que é few-shot prompting?",
      answer: `Few-shot prompting significa fornecer alguns exemplos (geralmente 2 a 5) dentro do seu prompt para mostrar à IA exatamente que tipo de resposta você espera. É uma das técnicas mais eficazes para obter resultados consistentes e de alta qualidade.

Por exemplo, em vez de dizer "Traduza estes para o inglês", você escreveria: "Olá -> Hello, Bom dia -> Good morning, Como você está? ->" e a IA inferirá o padrão. Nosso curso cobre quando usar zero-shot vs few-shot e quantos exemplos são ideais.`,
    },
  },
  {
    id: "kb-12",
    keywords: [
      "vak",
      "visual",
      "auditivo",
      "auditory",
      "kinestésico",
      "kinesthetic",
      "aprendizaje",
      "learning style",
    ],
    en: {
      question: "How does the VAK methodology apply to AI learning?",
      answer: `The VAK (Visual-Auditory-Kinesthetic) methodology recognizes that people learn differently: some prefer images (visual), others prefer explanations (auditory), and others learn by doing (kinesthetic). In our IALab course, we apply this through diverse resources: videos and infographics for visual learners, podcast-style Audio Overviews for auditory learners, and hands-on labs and OVAs for kinesthetic learners.

When you study with MAX, feel free to ask for explanations in your preferred style — whether that's a diagram description, a step-by-step walkthrough, or a practical example.`,
    },
    es: {
      question: "¿Cómo aplica la metodología VAK al aprendizaje de IA?",
      answer: `La metodología VAK (Visual-Auditivo-Kinestésico) reconoce que las personas aprenden diferente: unos prefieren imágenes (visual), otros explicaciones (auditivo), y otros aprenden haciendo (kinestésico). En nuestro curso IALab, aplicamos esto con recursos diversos: videos e infografías para visuales, Audio Overviews tipo podcast para auditivos, y laboratorios prácticos y OVAs para kinestésicos.

Cuando estudies con MAX, siéntete libre de pedir explicaciones en tu estilo preferido — ya sea una descripción visual, una explicación paso a paso, o un ejemplo práctico.`,
    },
    pt: {
      question: "Como a metodologia VAK se aplica ao aprendizado de IA?",
      answer: `A metodologia VAK (Visual-Auditivo-Cinestésico) reconhece que as pessoas aprendem de formas diferentes: alguns preferem imagens (visual), outros preferem explicações (auditivo) e outros aprendem fazendo (cinestésico). No nosso curso IALab, aplicamos isso com recursos diversos: vídeos e infográficos para os visuais, Audio Overviews em formato de podcast para os auditivos e laboratórios práticos e OVAs para os cinestésicos.

Quando você estuda com o MAX, sinta-se à vontade para pedir explicações no seu estilo preferido — seja uma descrição visual, um passo a passo ou um exemplo prático.`,
    },
  },
  {
    id: "kb-13",
    keywords: ["OVA", "recurso", "resource", "material", "laboratorio", "lab"],
    en: {
      question: "What types of resources are available in IALab?",
      answer: `IALab offers a rich variety of learning resources for each module: instructional videos with practical demonstrations, downloadable PDFs with detailed guides, interactive OVAs (Virtual Learning Objects) for hands-on practice, infographics and images for quick reference, and document templates you can use in real projects.

Each module has resources tailored to its topic, and you can always find them within the module page. MAX can point you to the most relevant resource based on your specific question.`,
    },
    es: {
      question: "¿Qué tipos de recursos hay disponibles en IALab?",
      answer: `IALab ofrece una gran variedad de recursos de aprendizaje para cada módulo: videos instructivos con demostraciones prácticas, PDFs descargables con guías detalladas, OVAs (Objetos Virtuales de Aprendizaje) interactivos para práctica hands-on, infografías e imágenes para referencia rápida, y plantillas de documentos que puedes usar en proyectos reales.

Cada módulo tiene recursos adaptados a su tema, y siempre puedes encontrarlos dentro de la página del módulo. MAX puede señalarte el recurso más relevante según tu pregunta específica.`,
    },
    pt: {
      question: "Que tipos de recursos estão disponíveis no IALab?",
      answer: `O IALab oferece uma grande variedade de recursos de aprendizado para cada módulo: vídeos instrutivos com demonstrações práticas, PDFs para download com guias detalhados, OVAs (Objetos Virtuais de Aprendizagem) interativos para prática, infográficos e imagens para consulta rápida, e modelos de documentos que você pode usar em projetos reais.

Cada módulo tem recursos adaptados ao seu tema, e você sempre pode encontrá-los na página do módulo. O MAX pode indicar o recurso mais relevante de acordo com a sua pergunta específica.`,
    },
  },
  {
    id: "kb-14",
    keywords: [
      "certificado",
      "certificate",
      "curso",
      "course",
      "progreso",
      "progress",
      "completar",
      "complete",
    ],
    en: {
      question: "How do I complete the IALab course?",
      answer: `To complete the IALab course, you need to go through all 5 modules: Prompt Engineering, Potencia ChatGPT, Gemini Deep Research, NotebookLM, and Applied AI Ethics. For each module, you must watch the videos, study the resources, complete the quiz with at least 80%, and pass the final challenge.

Your progress is tracked across all modules, and MAX is here to help you with any topic you find challenging. Keep up your streak, practice consistently, and you'll earn your certificate.`,
    },
    es: {
      question: "¿Cómo completo el curso IALab?",
      answer: `Para completar el curso IALab, debes recorrer los 5 módulos: Ingeniería de Prompts, Potencia ChatGPT, Gemini Deep Research, NotebookLM y Ética Aplicada a IA. En cada módulo, debes ver los videos, estudiar los recursos, completar el quiz con al menos 80% y pasar el desafío final.

Tu progreso se registra en todos los módulos, y MAX está aquí para ayudarte con cualquier tema que se te complique. Mantén tu racha, practica consistentemente y obtendrás tu certificado.`,
    },
    pt: {
      question: "Como completo o curso IALab?",
      answer: `Para completar o curso IALab, você precisa percorrer os 5 módulos: Engenharia de Prompts, Potencialize o ChatGPT, Investigação Profunda com o Gemini, NotebookLM e Ética Aplicada à IA. Em cada módulo, você deve assistir aos vídeos, estudar os recursos, concluir o quiz com pelo menos 80% e passar no desafio final.

Seu progresso é registrado em todos os módulos, e o MAX está aqui para ajudá-lo com qualquer tema que você achar desafiador. Mantenha sua sequência, pratique com consistência e você conquistará seu certificado.`,
    },
  },
  {
    id: "kb-15",
    keywords: [
      "atajo",
      "shortcut",
      "consejo",
      "tip",
      "recomendación",
      "recommendation",
      "mejorar",
      "improve",
    ],
    en: {
      question: "What is your best tip for getting better at AI?",
      answer: `My best tip: practice deliberately and consistently. AI is a skill, not a theory. Spend at least 15 minutes daily crafting prompts, testing different approaches, and analyzing why some work better than others.

Specifically: (1) Always start with a clear objective, (2) Iterate — your first prompt is rarely your best, (3) Keep a "prompt journal" of what works, (4) Study failures more than successes. And most importantly, use IALab's resources to build a strong foundation. The time you invest now will multiply your productivity later.`,
    },
    es: {
      question: "¿Cuál es tu mejor consejo para mejorar con IA?",
      answer: `Mi mejor consejo: practica deliberadamente y con constancia. La IA es una habilidad, no una teoría. Dedica al menos 15 minutos diarios a crear prompts, probar diferentes enfoques y analizar por qué unos funcionan mejor que otros.

Específicamente: (1) Siempre empieza con un objetivo claro, (2) Itera — tu primer prompt rara vez es el mejor, (3) Lleva un "diario de prompts" de lo que funciona, (4) Estudia más los fallos que los aciertos. Y lo más importante, usa los recursos de IALab para construir una base sólida. El tiempo que inviertas ahora multiplicará tu productividad después.`,
    },
    pt: {
      question: "Qual é a sua melhor dica para melhorar com IA?",
      answer: `Minha melhor dica: pratique com propósito e consistência. IA é uma habilidade, não uma teoria. Dedique pelo menos 15 minutos por dia para criar prompts, testar abordagens diferentes e analisar por que algumas funcionam melhor que outras.

Especificamente: (1) Sempre comece com um objetivo claro, (2) Itere — o seu primeiro prompt raramente é o melhor, (3) Mantenha um "diário de prompts" com o que funciona, (4) Estude mais as falhas do que os acertos. E o mais importante, use os recursos do IALab para construir uma base sólida. O tempo que você investir agora vai multiplicar sua produtividade no futuro.`,
    },
  },
];

export const searchKnowledgeBase = (query, locale) => {
  const text = query.toLowerCase().trim();
  const results = [];

  for (const entry of KNOWLEDGE_BASE) {
    const matchScore = entry.keywords.reduce((score, kw) => {
      if (text.includes(kw)) return score + 2;
      if (kw.includes(text) || text.includes(kw)) return score + 1;
      return score;
    }, 0);

    if (matchScore > 0) {
      results.push({ entry, score: matchScore });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const best = results[0];

  if (best && best.score >= 2) {
    return best.entry[locale] || best.entry.en || best.entry.es;
  }

  return null;
};

export default KNOWLEDGE_BASE;
