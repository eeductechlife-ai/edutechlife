export const learningObjectives = [
  "Simular o uso do NotebookLM para organizar informações",
  "Praticar o envio e a análise de documentos em um ambiente virtual",
  "Desenvolver habilidades de síntese de informações com IA",
  "Avaliar a qualidade das respostas baseadas em fontes próprias",
];

export const furtherReading = [
  {
    title: "NotebookLM Help Center",
    url: "https://support.google.com/notebooklm/",
    description: "Centro de ajuda oficial do NotebookLM.",
  },
  {
    title: "AI-Powered Research Tools Comparison",
    url: "https://www.edutechlife.com/blog/ai-research-tools",
    description: "Comparativo de ferramentas de pesquisa com IA.",
  },
];

export const contentScreens = [
  {
    id: "sourcing",
    title: "Seleção e Curadoria de Fontes",
    subtitle:
      "Simulação prática de curadoria de fontes e análise documental com IA",
    objective:
      "Aprender a selecionar, organizar e avaliar fontes para o seu notebook",
    valerioText:
      "A base de uma boa análise documental começa com a seleção de fontes. Não se trata de acumular documentos, mas de escolher os mais relevantes e confiáveis. Uma fonte bem curada faz a diferença entre uma análise superficial e uma profunda. Aprenda a identificar fontes primárias, avaliar sua credibilidade e organizá-las tematicamente para maximizar o valor da sua pesquisa.",
    achievements: [
      { text: "Identificar fontes primárias e secundárias relevantes" },
      { text: "Avaliar a credibilidade e a atualidade de cada fonte" },
      { text: "Organizar documentos por categorias temáticas" },
    ],
    warnings: [
      { text: "Acumular fontes sem critério de seleção" },
      { text: "Confiar em fontes sem verificar sua procedência" },
      { text: "Misturar informações de qualidade desigual sem contexto" },
    ],
    example: {
      weak: "Baixar 30 PDFs sobre IA sem ler títulos nem autores",
      strong:
        "Selecionar 8 papers revisados por pares, organizados por tema: 3 de ética, 3 técnicos, 2 de aplicações práticas",
    },
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "synthesis",
    title: "Síntese Cruzada entre Fontes",
    subtitle: "Conectar ideias entre múltiplos documentos",
    objective: "Gerar sínteses que integrem informações de diversas fontes",
    valerioText:
      "O verdadeiro poder da análise documental está na capacidade de conectar ideias entre diferentes fontes. Uma síntese cruzada permite identificar padrões, contradições e complementos entre documentos que, vistos separadamente, não seriam evidentes. O NotebookLM facilita esse processo ao permitir fazer perguntas que abrangem todas as suas fontes simultaneamente.",
    achievements: [
      { text: "Identificar pontos em comum entre diferentes autores" },
      { text: "Detectar contradições e debates acadêmicos" },
      { text: "Construir uma visão integral do tema pesquisado" },
    ],
    warnings: [
      { text: "Citar fontes sem tê-las lido completamente" },
      { text: "Ignorar achados que contradizem a sua hipótese" },
      { text: "Sintetizar sem manter o contexto original" },
    ],
    example: {
      weak: "Resumir cada paper separadamente, sem relacioná-los entre si",
      strong:
        "Criar uma matriz comparativa que mostre convergências e divergências entre 5 autores sobre o mesmo tema, com citações textuais de respaldo",
    },
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "analysis",
    title: "Análise Crítica de Conteúdo",
    subtitle: "Avaliar e questionar a informação",
    objective: "Desenvolver pensamento crítico ao analisar documentos",
    valerioText:
      "A análise crítica é a habilidade mais importante que você pode desenvolver. Não se trata apenas de entender o que um documento diz, mas de questioná-lo, avaliar seus argumentos e determinar sua validade. Pergunte-se sempre: Quem escreveu isso? Com que propósito? Que evidência respalda suas afirmações? Que vieses ele pode ter?",
    achievements: [
      { text: "Avaliar a solidez dos argumentos apresentados" },
      { text: "Identificar vieses e limitações nas fontes" },
      { text: "Formular perguntas críticas sobre o conteúdo" },
    ],
    warnings: [
      { text: "Aceitar informações sem questionar sua validade" },
      { text: "Confundir correlação com causalidade" },
      { text: "Generalizar conclusões a partir de amostras pequenas" },
    ],
    example: {
      weak: "Aceitar como verdade absoluta um estudo com amostra de 20 pessoas",
      strong:
        "Analisar criticamente: identificar o tamanho da amostra, a metodologia, os possíveis vieses e as limitações antes de tirar conclusões",
    },
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
  },
];

export const questionsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question:
      "Qual é o primeiro passo recomendado antes de enviar documentos ao NotebookLM para análise?",
    options: [
      "Enviar todos os documentos disponíveis sem revisá-los.",
      "Selecionar e fazer a curadoria das fontes de acordo com relevância e qualidade.",
      "Traduzir todos os documentos para o mesmo idioma.",
      "Comprimir os arquivos para ocuparem menos espaço.",
    ],
    correct: 1,
    explanation:
      "Correto. A curadoria de fontes é fundamental. Você deve selecionar documentos relevantes, confiáveis e atualizados antes de enviá-los ao seu notebook.",
    hint: "Pense em qualidade em vez de quantidade. Não se trata de acumular, mas de selecionar.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question: "O que significa fazer uma 'síntese cruzada' entre fontes?",
    options: [
      "Ler os documentos em ordem alfabética.",
      "Comparar e contrastar informações de múltiplos documentos para encontrar padrões e diferenças.",
      "Copiar textualmente todas as conclusões em um único arquivo.",
      "Traduzir cada fonte para vários idiomas para comparar.",
    ],
    correct: 1,
    explanation:
      "Exato. A síntese cruzada permite conectar ideias entre diferentes documentos, identificando onde os autores concordam e onde existem divergências.",
    hint: "Não se trata de resumir cada fonte separadamente, mas de encontrar conexões entre elas.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question:
      "O que você deve fazer se encontrar duas fontes que se contradizem na sua pesquisa?",
    options: [
      "Ignorar as duas fontes e buscar outras.",
      "Excluir a fonte mais antiga e ficar com a nova.",
      "Analisar as duas, identificar as razões da contradição e documentá-la na sua análise.",
      "Escolher a fonte que confirma a sua hipótese inicial.",
    ],
    correct: 2,
    explanation:
      "Excelente! As contradições são oportunidades de aprendizado. Você deve analisar por que elas divergem, considerando metodologias, contextos e datas.",
    hint: "As controvérsias acadêmicas são comuns; enfrentá-las criticamente fortalece a sua pesquisa.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question: "Qual é a melhor prática ao organizar fontes no NotebookLM?",
    options: [
      "Enviar as 50 fontes permitidas em um único notebook, sem classificar.",
      "Criar notebooks separados por temas ou categorias, com fontes afins.",
      "Enviar apenas o resumo de cada documento, e não o documento completo.",
      "Misturar fontes acadêmicas com blogs, sem distinção.",
    ],
    correct: 1,
    explanation:
      "Correto. Organizar suas fontes por temas ou categorias permite fazer perguntas mais precisas e obter respostas mais relevantes da IA.",
    hint: "A organização temática ajuda a manter o contexto e a fazer perguntas mais específicas.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question:
      "Por que é importante verificar as citações fornecidas pelo NotebookLM?",
    options: [
      "Porque a IA às vezes pode alucinar ou interpretar incorretamente o contexto.",
      "Porque as citações estão sempre erradas.",
      "Porque o NotebookLM só funciona se você verificar cada citação manualmente.",
      "Porque as citações são decorativas e não precisam de verificação.",
    ],
    correct: 0,
    explanation:
      "Muito bem! Embora o NotebookLM seja muito preciso ao citar, você deve sempre verificar se a citação corresponde ao contexto correto dentro do documento original.",
    hint: "A IA é uma ferramenta poderosa, mas a verificação humana continua sendo essencial.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "Qual estratégia é mais eficaz ao fazer perguntas ao NotebookLM sobre múltiplas fontes?",
    options: [
      "Fazer perguntas muito gerais, como 'sobre o que tratam esses documentos?'",
      "Formular perguntas específicas que exijam comparar informações entre fontes.",
      "Pedir que a IA adivinhe informações que não estão nos documentos.",
      "Fazer todas as perguntas de uma só vez em um parágrafo extenso.",
    ],
    correct: 1,
    explanation:
      "Correto. Perguntas específicas que exigem comparação entre fontes aproveitam ao máximo a capacidade do NotebookLM de fazer sínteses cruzadas.",
    hint: "Quanto mais específica for a sua pergunta, mais útil será a resposta da IA.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question:
      "Qual é o principal benefício de usar o NotebookLM para análise documental?",
    options: [
      "Substitui completamente a leitura dos documentos originais.",
      "Permite processar e consultar múltiplas fontes simultaneamente, com respostas fundamentadas.",
      "Escreve automaticamente a sua tese, sem necessidade de pesquisa.",
      "Traduz todos os documentos para qualquer idioma em segundos.",
    ],
    correct: 1,
    explanation:
      "Exato! O NotebookLM é um assistente que amplifica a sua capacidade de análise, permitindo trabalhar com múltiplas fontes ao mesmo tempo, mas sempre exige a sua supervisão e pensamento crítico.",
    hint: "A IA é uma ferramenta de aumento, não um substituto do pensamento crítico humano.",
  },
];
