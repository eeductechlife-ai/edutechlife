// Glosario puente: conecta la metáfora narrativa del curso con el término
// técnico real. Ayuda a transferir lo aprendido al lenguaje profesional.

const ES = [
  {
    term: "Artesano Digital",
    tech: "Ingeniería de prompts",
    def: "Quien diseña instrucciones precisas para obtener resultados útiles de la IA.",
  },
  {
    term: "Cincel",
    tech: "Prompt",
    def: "La instrucción de entrada que le das al modelo.",
  },
  {
    term: "Receta",
    tech: "Fórmula RTF",
    def: "Rol + Tarea + Formato: la estructura base de un buen prompt.",
  },
  {
    term: "Materia prima",
    tech: "Datos de entrenamiento",
    def: "Conocimiento con el que el modelo aprende patrones.",
  },
  {
    term: "Caja de herramientas",
    tech: "Herramientas integradas",
    def: "Funciones del modelo: buscar, analizar, generar imágenes, ejecutar código.",
  },
  {
    term: "Plano maestro",
    tech: "System prompt",
    def: "Las reglas base que definen el comportamiento del asistente.",
  },
  {
    term: "Fábrica de asistentes",
    tech: "GPT personalizado",
    def: "Un asistente configurado con rol, conocimiento y capacidades.",
  },
  {
    term: "Línea de montaje",
    tech: "Function Calling / API",
    def: "Conectar el asistente con servicios externos para ejecutar acciones.",
  },
  {
    term: "Lupa",
    tech: "Multimodalidad",
    def: "Capacidad de procesar texto, imagen, audio y video a la vez.",
  },
  {
    term: "Archivo forense",
    tech: "Deep Research",
    def: "Investigación con búsqueda en vivo y citas verificables.",
  },
  {
    term: "Grimorio",
    tech: "NotebookLM",
    def: "Cuaderno que responde solo con las fuentes que tú cargas, citándolas.",
  },
  {
    term: "Fórmula sonora",
    tech: "Audio Overview",
    def: "Resumen conversacional en audio de tus documentos.",
  },
  {
    term: "Espejo de la verdad",
    tech: "Sesgo e IA",
    def: "Desviación sistemática que puede producir decisiones injustas.",
  },
  {
    term: "Tribunal ético",
    tech: "Explicabilidad",
    def: "Poder entender y justificar las decisiones de un sistema.",
  },
  {
    term: "Guardián",
    tech: "Accountability",
    def: "Responsabilidad con personas y procesos claros ante los resultados.",
  },
  {
    term: "Bóveda",
    tech: "Privacidad y minimización de datos",
    def: "Usar y compartir solo los datos estrictamente necesarios.",
  },
  {
    term: "Alquimista",
    tech: "Curaduría de fuentes",
    def: "Seleccionar críticamente las fuentes antes de sintetizar.",
  },
  {
    term: "Temperatura",
    tech: "Aleatoriedad del modelo",
    def: "Controla qué tan creativa o predecible es la respuesta (0 = precisa, 1 = creativa).",
  },
  {
    term: "Token",
    tech: "Unidad de texto",
    def: "Fragmento mínimo en que el modelo divide el texto; afecta costo y límite.",
  },
  {
    term: "Ventana de contexto",
    tech: "Límite de memoria",
    def: "Cantidad máxima de texto que el modelo puede considerar a la vez.",
  },
];

const EN = [
  {
    term: "Digital artisan",
    tech: "Prompt engineering",
    def: "Designing precise instructions to get useful results from AI.",
  },
  {
    term: "Chisel",
    tech: "Prompt",
    def: "The input instruction you give the model.",
  },
  {
    term: "Recipe",
    tech: "RTF formula",
    def: "Role + Task + Format: the base structure of a good prompt.",
  },
  {
    term: "Raw material",
    tech: "Training data",
    def: "The knowledge the model learns patterns from.",
  },
  {
    term: "Toolbox",
    tech: "Built-in tools",
    def: "Model functions: search, analyze, generate images, run code.",
  },
  {
    term: "Master blueprint",
    tech: "System prompt",
    def: "The base rules that define the assistant's behavior.",
  },
  {
    term: "Assistant factory",
    tech: "Custom GPT",
    def: "An assistant configured with role, knowledge and capabilities.",
  },
  {
    term: "Assembly line",
    tech: "Function Calling / API",
    def: "Connecting the assistant to external services to take actions.",
  },
  {
    term: "Magnifier",
    tech: "Multimodality",
    def: "Ability to process text, image, audio and video at once.",
  },
  {
    term: "Forensic archive",
    tech: "Deep Research",
    def: "Research with live search and verifiable citations.",
  },
  {
    term: "Grimoire",
    tech: "NotebookLM",
    def: "A notebook that answers only from the sources you upload, citing them.",
  },
  {
    term: "Sound formula",
    tech: "Audio Overview",
    def: "A conversational audio summary of your documents.",
  },
  {
    term: "Mirror of truth",
    tech: "Bias and AI",
    def: "A systematic deviation that can produce unfair decisions.",
  },
  {
    term: "Ethical court",
    tech: "Explainability",
    def: "Being able to understand and justify a system's decisions.",
  },
  {
    term: "Guardian",
    tech: "Accountability",
    def: "Responsibility with clear people and processes for outcomes.",
  },
  {
    term: "Vault",
    tech: "Privacy and data minimization",
    def: "Use and share only strictly necessary data.",
  },
  {
    term: "Alchemist",
    tech: "Source curation",
    def: "Critically selecting sources before synthesizing.",
  },
  {
    term: "Temperature",
    tech: "Model randomness",
    def: "Controls how creative or predictable the answer is (0 = precise, 1 = creative).",
  },
  {
    term: "Token",
    tech: "Text unit",
    def: "The smallest chunk the model splits text into; affects cost and limits.",
  },
  {
    term: "Context window",
    tech: "Memory limit",
    def: "Maximum amount of text the model can consider at once.",
  },
];

const PT = [
  {
    term: "Artesão digital",
    tech: "Engenharia de prompts",
    def: "Quem desenha instruções precisas para obter resultados úteis da IA.",
  },
  {
    term: "Cinzel",
    tech: "Prompt",
    def: "A instrução de entrada que você dá ao modelo.",
  },
  {
    term: "Receita",
    tech: "Fórmula RTF",
    def: "Papel + Tarefa + Formato: a estrutura base de um bom prompt.",
  },
  {
    term: "Matéria-prima",
    tech: "Dados de treino",
    def: "O conhecimento de onde o modelo aprende padrões.",
  },
  {
    term: "Caixa de ferramentas",
    tech: "Ferramentas integradas",
    def: "Funções do modelo: buscar, analisar, gerar imagens, executar código.",
  },
  {
    term: "Planta mestre",
    tech: "System prompt",
    def: "As regras base que definem o comportamento do assistente.",
  },
  {
    term: "Fábrica de assistentes",
    tech: "GPT personalizado",
    def: "Um assistente configurado com papel, conhecimento e capacidades.",
  },
  {
    term: "Linha de montagem",
    tech: "Function Calling / API",
    def: "Conectar o assistente a serviços externos para executar ações.",
  },
  {
    term: "Lupa",
    tech: "Multimodalidade",
    def: "Capacidade de processar texto, imagem, áudio e vídeo ao mesmo tempo.",
  },
  {
    term: "Arquivo forense",
    tech: "Deep Research",
    def: "Pesquisa com busca ao vivo e citações verificáveis.",
  },
  {
    term: "Grimório",
    tech: "NotebookLM",
    def: "Caderno que responde só com as fontes que você envia, citando-as.",
  },
  {
    term: "Fórmula sonora",
    tech: "Audio Overview",
    def: "Resumo em áudio, em formato de conversa, dos seus documentos.",
  },
  {
    term: "Espelho da verdade",
    tech: "Viés e IA",
    def: "Desvio sistemático que pode gerar decisões injustas.",
  },
  {
    term: "Tribunal ético",
    tech: "Explicabilidade",
    def: "Poder entender e justificar as decisões de um sistema.",
  },
  {
    term: "Guardião",
    tech: "Accountability",
    def: "Responsabilidade com pessoas e processos claros pelos resultados.",
  },
  {
    term: "Cofre",
    tech: "Privacidade e minimização de dados",
    def: "Usar e compartilhar apenas os dados estritamente necessários.",
  },
  {
    term: "Alquimista",
    tech: "Curadoria de fontes",
    def: "Selecionar criticamente as fontes antes de sintetizar.",
  },
  {
    term: "Temperatura",
    tech: "Aleatoriedade do modelo",
    def: "Controla o quão criativa ou previsível é a resposta (0 = precisa, 1 = criativa).",
  },
  {
    term: "Token",
    tech: "Unidade de texto",
    def: "Menor fragmento em que o modelo divide o texto; afeta custo e limite.",
  },
  {
    term: "Janela de contexto",
    tech: "Limite de memória",
    def: "Quantidade máxima de texto que o modelo considera de uma vez.",
  },
];

export const GLOSSARY = { es: ES, en: EN, pt: PT };

export function getGlossary(locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  return GLOSSARY[lang] || GLOSSARY.es;
}

export default GLOSSARY;
