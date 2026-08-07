export const MODULE_4_PT = [
  {
    id: "pp-m4-1",
    question: "O que define um AI agent no contexto de sistemas autônomos?",
    options: [
      {
        id: "pp-m4-1_a",
        label: "Um programa que executa comandos predefinidos sem desvios",
      },
      {
        id: "pp-m4-1_b",
        label:
          "Um sistema que percebe o ambiente, decide ações e as executa para alcançar um objetivo",
      },
      {
        id: "pp-m4-1_c",
        label: "Um modelo de linguagem sem capacidade de interação",
      },
      {
        id: "pp-m4-1_d",
        label: "Um assistente que exige aprovação humana para cada ação",
      },
    ],
    correctAnswer: "pp-m4-1_b",
    topic: "AI Agents",
    difficulty: "easy",
    feedback:
      "Um AI agent é um sistema autônomo com um ciclo percepção→decisão→ação. Ele pode observar o ambiente, raciocinar sobre o melhor curso de ação e executá-lo para alcançar um objetivo definido.",
    relatedFlashcardId: "m4-f1",
  },
  {
    id: "pp-m4-2",
    question: 'O que são "tool calls" no contexto dos AI agents?',
    options: [
      {
        id: "pp-m4-2_a",
        label: "São funções de depuração para encontrar erros no modelo",
      },
      {
        id: "pp-m4-2_b",
        label:
          "É a capacidade do LLM de invocar APIs externas, bancos de dados ou executar código como parte do seu fluxo",
      },
      { id: "pp-m4-2_c", label: "São comandos de voz que o agente reconhece" },
      {
        id: "pp-m4-2_d",
        label: "É um método para comprimir o modelo e torná-lo mais portátil",
      },
    ],
    correctAnswer: "pp-m4-2_b",
    topic: "Tool Calls",
    difficulty: "medium",
    feedback:
      "As tool calls permitem que o LLM atue além de gerar texto: ele pode consultar APIs, pesquisar em bancos de dados, executar código ou enviar e-mails. Isso transforma o LLM de um simples chat em um agente autônomo.",
    relatedFlashcardId: "m4-f2",
  },
  {
    id: "pp-m4-3",
    question:
      "Qual é a diferença fundamental entre um agente com memória e um sem memória?",
    options: [
      {
        id: "pp-m4-3_a",
        label:
          "O agente com memória é mais rápido porque armazena respostas em cache",
      },
      {
        id: "pp-m4-3_b",
        label:
          "O agente com memória pode lembrar informações entre sessões usando vetores ou bancos de dados",
      },
      {
        id: "pp-m4-3_c",
        label: "O agente sem memória não pode usar tool calls",
      },
      {
        id: "pp-m4-3_d",
        label: "Não há diferença; todos os agentes têm memória por padrão",
      },
    ],
    correctAnswer: "pp-m4-3_b",
    topic: "Memória em Agents",
    difficulty: "medium",
    feedback:
      "A memória em agents permite persistir informações relevantes entre sessões usando vetores de embeddings e bancos de dados vetoriais. Sem memória, cada interação começa do zero, limitando a continuidade.",
    relatedFlashcardId: "m4-f3",
  },
  {
    id: "pp-m4-4",
    question:
      "Em um sistema multi-agent, como os agentes se organizam para resolver um problema complexo?",
    options: [
      {
        id: "pp-m4-4_a",
        label:
          "Todos os agentes executam a mesma tarefa em paralelo e o resultado é calculado pela média",
      },
      {
        id: "pp-m4-4_b",
        label:
          "Cada agente se especializa em uma tarefa específica e eles colaboram compartilhando informações",
      },
      {
        id: "pp-m4-4_c",
        label:
          "Um único agente controla os demais por meio de comandos diretos",
      },
      {
        id: "pp-m4-4_d",
        label: "Os agentes competem entre si e o melhor vence",
      },
    ],
    correctAnswer: "pp-m4-4_b",
    topic: "Sistemas Multi-Agent",
    difficulty: "hard",
    feedback:
      "Em sistemas multi-agent, cada agente tem um papel especializado (pesquisador, escritor, validador) e eles colaboram compartilhando informações para resolver tarefas complexas que um único agente não conseguiria abordar de forma eficiente.",
    relatedFlashcardId: "m4-f4",
  },
  {
    id: "pp-m4-5",
    question: 'Qual é o papel do "planning" na arquitetura de um AI agent?',
    options: [
      { id: "pp-m4-5_a", label: "Substitui a necessidade de tool calls" },
      {
        id: "pp-m4-5_b",
        label: "Decompõe um objetivo complexo em etapas menores e executáveis",
      },
      { id: "pp-m4-5_c", label: "Otimiza o uso de tokens em cada interação" },
      { id: "pp-m4-5_d", label: "Gera respostas mais criativas e diversas" },
    ],
    correctAnswer: "pp-m4-5_b",
    topic: "Planning",
    difficulty: "medium",
    feedback:
      "O planning é essencial para agentes autônomos: divide um objetivo grande em sub-tarefas gerenciáveis, as ordena logicamente e permite que o agente as execute sequencialmente ou em paralelo, conforme as dependências.",
    relatedFlashcardId: "m4-f5",
  },
  {
    id: "pp-m4-6",
    question:
      "Como o raciocínio (reasoning) se diferencia da execução em um agente autônomo?",
    options: [
      {
        id: "pp-m4-6_a",
        label:
          "O raciocínio analisa informações e decide; a execução implementa a decisão por meio de ações concretas",
      },
      { id: "pp-m4-6_b", label: "O raciocínio é mais rápido que a execução" },
      { id: "pp-m4-6_c", label: "A execução ocorre antes do raciocínio" },
      { id: "pp-m4-6_d", label: "Ambos os termos descrevem o mesmo processo" },
    ],
    correctAnswer: "pp-m4-6_a",
    topic: "Raciocínio vs Execução",
    difficulty: "hard",
    feedback:
      "Em um agente, o raciocínio (analisar, avaliar opções) precede a execução (tool calls, ações). Um bom agente itera entre ambos: raciocina, age, observa o resultado e raciocina novamente.",
    relatedFlashcardId: "m4-f6",
  },
  {
    id: "pp-m4-7",
    question:
      "Qual nível de autonomia tem um agente que exige aprovação humana antes de cada tool call?",
    options: [
      {
        id: "pp-m4-7_a",
        label: "Autonomia total: o agente decide e executa sem intervenção",
      },
      {
        id: "pp-m4-7_b",
        label:
          'Autonomia parcial ("human-in-the-loop"): o agente sugere, mas exige validação humana',
      },
      { id: "pp-m4-7_c", label: "Sem autonomia: é apenas um gerador de texto" },
      {
        id: "pp-m4-7_d",
        label: "Autonomia supervisionada: executa primeiro, reporta depois",
      },
    ],
    correctAnswer: "pp-m4-7_b",
    topic: "Autonomia",
    difficulty: "medium",
    feedback:
      'O nível de autonomia define o quanto de independência o agente tem. "Human-in-the-loop" significa que o agente propõe ações, mas um humano deve aprová-las antes de serem executadas, equilibrando eficiência e controle.',
    relatedFlashcardId: "m4-f7",
  },
];
