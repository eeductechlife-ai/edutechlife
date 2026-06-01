export const MODULE_4_ES = {
    objective: "Transforma documentos y fuentes en podcasts, resúmenes y conocimiento accionable en minutos.",
    learningPoints: [
      { text: "Seleccionar y curar tus fuentes", icon: "fa-book-open" },
      { text: "Sintetizar documentos con IA", icon: "fa-file-alt" },
      { text: "Crear podcasts desde tus archivos", icon: "fa-microphone" },
      { text: "Gestionar documentación inteligente", icon: "fa-folder-open" }
    ],
    overviewData: {
      title: "Tu Primer Notebook con IA",
      description: "En este módulo, transformarás cualquier documento en conocimiento útil. Desde resúmenes inteligentes hasta podcasts generados por IA, todo desde una sola herramienta.",
      mission: "Domina el arte de transformar documentos en conocimiento. Convierte PDFs en resúmenes inteligentes, podcasts y asistentes de investigación personalizados.",
      topics: [
        { title: "¿Qué es NotebookLM y para qué sirve?", icon: "fa-microphone", resources: 3, duration: "20 min" },
        { title: "Curaduría de Fuentes y Síntesis de Documentos", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Audio Overviews y Gestión Documental con IA", icon: "fa-podcast", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "¿Qué es NotebookLM y para qué sirve?",
        description: "Tu asistente de investigación con IA",
        detailedDescription: "Conoce NotebookLM, la herramienta de Google que convierte tus PDFs, artículos y apuntes en un asistente personal que responde con citas exactas de tus documentos.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B"
      },
      {
        id: 2,
        title: "Curaduría de Fuentes y Síntesis de Documentos",
        description: "Organiza tu investigación como un pro",
        detailedDescription: "Aprende a seleccionar las mejores fuentes, organizarlas por temas y conectar ideas entre documentos para crear resúmenes y análisis de nivel profesional.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981"
      },
      {
        id: 3,
        title: "Audio Overviews y Gestión Documental con IA",
        description: "Convierte PDFs en podcasts",
        detailedDescription: "Transforma tus documentos en conversaciones de podcast con dos voces IA. Ideal para aprender mientras viajas. Gestiona tu biblioteca de conocimiento de forma inteligente.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Comprender qué es NotebookLM, cómo funciona y por qué es revolucionario para la gestión del conocimiento personal.",
        achievements: [
          { icon: "fa-check", text: "Entender el concepto de IA basada en fuentes propias" },
          { icon: "fa-check", text: "Crear tu primer notebook con documentos" },
          { icon: "fa-check", text: "Diferenciar NotebookLM de chatbots genéricos" }
        ],
        warnings: [
          { icon: "fa-times", text: "Subir documentos sin curar ni organizar" },
          { icon: "fa-times", text: "Esperar que funcione sin fuentes de calidad" },
          { icon: "fa-times", text: "No entender que solo responde basado en tus fuentes" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Notebook vacío: Sin fuentes subidas, sin contexto",
          strong: "✅ Notebook potente: 5 PDFs de investigación académica + 3 artículos de industria = Asistente experto que responde con citas textuales de tus documentos"
        }
      },
      2: {
        objective: "📚 Curaduría de Fuentes: Calidad sobre Cantidad",
        objectiveDesc: "Aprende a seleccionar, organizar y sintetizar documentos para maximizar el valor de tu notebook de investigación.",
        achievements: [
          { icon: "fa-check", text: "Seleccionar fuentes relevantes y confiables" },
          { icon: "fa-check", text: "Organizar documentos por categorías temáticas" },
          { icon: "fa-check", text: "Generar síntesis cruzadas entre múltiples fuentes" }
        ],
        warnings: [
          { icon: "fa-times", text: "Subir 50 documentos sin filtro de calidad" },
          { icon: "fa-times", text: "Mezclar fuentes contradictorias sin contexto" },
          { icon: "fa-times", text: "No actualizar las fuentes regularmente" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Sin curaduría: Subir todo lo que encuentro sobre IA",
          strong: "✅ Con curaduría: 10 papers seleccionados por relevancia, organizados por tema (ética, técnica, aplicaciones), con notas de contexto para cada grupo"
        }
      },
      3: {
        objective: "🎙️ Audio Overviews: Tu Conocimiento en Formato Podcast",
        objectiveDesc: "Transforma documentos complejos en conversaciones de audio engaging generadas por IA con dos presentadores virtuales.",
        achievements: [
          { icon: "fa-check", text: "Generar Audio Overviews desde tus documentos" },
          { icon: "fa-check", text: "Personalizar el tono y enfoque del podcast" },
          { icon: "fa-check", text: "Usar audio para repaso y aprendizaje móvil" }
        ],
        warnings: [
          { icon: "fa-times", text: "Esperar audio perfecto con documentos cortos" },
          { icon: "fa-times", text: "No revisar el contenido generado antes de compartir" },
          { icon: "fa-times", text: "Usar solo audio sin complementar con resúmenes escritos" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Audio genérico: Conversación vaga sobre el tema",
          strong: "✅ Audio enfocado: Podcast de 15 minutos donde dos presentadores discuten los hallazgos clave de 5 papers sobre neuroplasticidad, con ejemplos prácticos y analogías claras"
        }
      }
    }
};

export const MODULE_4_EN = {
    objective: "Transform documents and sources into podcasts, summaries, and actionable knowledge in minutes.",
    learningPoints: [
      { text: "Select and curate your sources", icon: "fa-book-open" },
      { text: "Synthesize documents with AI", icon: "fa-file-alt" },
      { text: "Create podcasts from your files", icon: "fa-microphone" },
      { text: "Manage intelligent documentation", icon: "fa-folder-open" }
    ],
    overviewData: {
      title: "Your First AI Notebook",
      description: "In this module, you will transform any document into useful knowledge. From intelligent summaries to AI-generated podcasts, all from a single tool.",
      mission: "Master the art of transforming documents into knowledge. Turn PDFs into intelligent summaries, podcasts, and personalized research assistants.",
      topics: [
        { title: "What is NotebookLM and how is it used?", icon: "fa-microphone", resources: 3, duration: "20 min" },
        { title: "Source Curation and Document Synthesis", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Audio Overviews and AI Document Management", icon: "fa-podcast", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "What is NotebookLM and how is it used?",
        description: "Your AI research assistant",
        detailedDescription: "Discover NotebookLM, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with exact citations from your documents.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B"
      },
      {
        id: 2,
        title: "Source Curation and Document Synthesis",
        description: "Organize your research like a pro",
        detailedDescription: "Learn to select the best sources, organize them by topic, and connect ideas across documents to create professional-level summaries and analyses.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981"
      },
      {
        id: 3,
        title: "Audio Overviews and AI Document Management",
        description: "Turn PDFs into podcasts",
        detailedDescription: "Transform your documents into podcast conversations with two AI voices. Ideal for learning on the go. Manage your knowledge library intelligently.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Understand what NotebookLM is, how it works, and why it's revolutionary for personal knowledge management.",
        achievements: [
          { icon: "fa-check", text: "Understand the concept of AI based on your own sources" },
          { icon: "fa-check", text: "Create your first notebook with documents" },
          { icon: "fa-check", text: "Differentiate NotebookLM from generic chatbots" }
        ],
        warnings: [
          { icon: "fa-times", text: "Uploading documents without curating or organizing them" },
          { icon: "fa-times", text: "Expecting it to work without quality sources" },
          { icon: "fa-times", text: "Not understanding it only responds based on your sources" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Empty notebook: No sources uploaded, no context",
          strong: "✅ Powerful notebook: 5 academic research PDFs + 3 industry articles = Expert assistant that responds with verbatim citations from your documents"
        }
      },
      2: {
        objective: "📚 Source Curation: Quality over Quantity",
        objectiveDesc: "Learn to select, organize, and synthesize documents to maximize the value of your research notebook.",
        achievements: [
          { icon: "fa-check", text: "Select relevant and reliable sources" },
          { icon: "fa-check", text: "Organize documents by thematic categories" },
          { icon: "fa-check", text: "Generate cross-syntheses across multiple sources" }
        ],
        warnings: [
          { icon: "fa-times", text: "Uploading 50 documents without quality filtering" },
          { icon: "fa-times", text: "Mixing contradictory sources without context" },
          { icon: "fa-times", text: "Not updating sources regularly" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Without curation: Uploading everything I find about AI",
          strong: "✅ With curation: 10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group"
        }
      },
      3: {
        objective: "🎙️ Audio Overviews: Your Knowledge in Podcast Format",
        objectiveDesc: "Transform complex documents into engaging audio conversations generated by AI with two virtual hosts.",
        achievements: [
          { icon: "fa-check", text: "Generate Audio Overviews from your documents" },
          { icon: "fa-check", text: "Customize the podcast tone and focus" },
          { icon: "fa-check", text: "Use audio for review and mobile learning" }
        ],
        warnings: [
          { icon: "fa-times", text: "Expecting perfect audio with short documents" },
          { icon: "fa-times", text: "Not reviewing generated content before sharing" },
          { icon: "fa-times", text: "Using only audio without supplementing with written summaries" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic audio: Vague conversation about the topic",
          strong: "✅ Focused audio: 15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples and clear analogies"
        }
      }
    }
};
