export const MODULE_2_PT = [
  {
    id: "pp-m2-1",
    question: "Qual arquitetura de modelo o ChatGPT usa como base?",
    options: [
      { id: "pp-m2-1_a", label: "Redes neurais convolucionais (CNN)" },
      { id: "pp-m2-1_b", label: "Generative Pre-trained Transformer (GPT)" },
      { id: "pp-m2-1_c", label: "Long Short-Term Memory (LSTM)" },
      { id: "pp-m2-1_d", label: "Support Vector Machines (SVM)" },
    ],
    correctAnswer: "pp-m2-1_b",
    topic: "Arquitetura GPT",
    difficulty: "easy",
    feedback:
      "O ChatGPT é baseado na arquitetura GPT (Generative Pre-trained Transformer), que utiliza mecanismos de atenção para processar e gerar texto coerente.",
    relatedFlashcardId: "m2-f1",
  },
  {
    id: "pp-m2-2",
    question: "O que são tokens e por que eles são importantes no ChatGPT?",
    options: [
      {
        id: "pp-m2-2_a",
        label: "São credenciais de acesso que limitam o uso da API",
      },
      {
        id: "pp-m2-2_b",
        label:
          "São unidades de texto em que a entrada é dividida; determinam o custo e o limite da interação",
      },
      {
        id: "pp-m2-2_c",
        label:
          "São parâmetros de configuração que ajustam a velocidade do modelo",
      },
      {
        id: "pp-m2-2_d",
        label: "São rótulos de segurança que classificam o conteúdo gerado",
      },
    ],
    correctAnswer: "pp-m2-2_b",
    topic: "Tokens",
    difficulty: "easy",
    feedback:
      "Os tokens são as unidades mínimas em que o texto é dividido (1 token ≈ 0,75 palavras em inglês). O modelo tem um limite máximo de tokens por interação (context window), e o uso da API é cobrado por token.",
    relatedFlashcardId: "m2-f2",
  },
  {
    id: "pp-m2-3",
    question:
      "Se você está desenvolvendo um assistente virtual que deve manter uma personalidade consistente durante toda a conversa, qual técnica do ChatGPT você usaria?",
    options: [
      {
        id: "pp-m2-3_a",
        label: "Alterar a temperatura para 0.0 após cada resposta",
      },
      {
        id: "pp-m2-3_b",
        label:
          "Usar um system prompt que defina o papel, o tom e as regras do assistente",
      },
      {
        id: "pp-m2-3_c",
        label: "Aumentar o context window ao máximo permitido",
      },
      {
        id: "pp-m2-3_d",
        label: "Re-treinar o modelo com dados de conversas anteriores",
      },
    ],
    correctAnswer: "pp-m2-3_b",
    topic: "System Prompts",
    difficulty: "medium",
    feedback:
      "O system prompt é uma instrução inicial que define o papel, a personalidade e as regras do assistente para toda a conversa. É a forma mais eficaz de manter a consistência sem modificar o modelo.",
    relatedFlashcardId: "m2-f4",
  },
  {
    id: "pp-m2-4",
    question: "O que é RLHF e como ele melhora o comportamento do ChatGPT?",
    options: [
      {
        id: "pp-m2-4_a",
        label: "É um algoritmo que reduz o consumo de tokens em cada resposta",
      },
      {
        id: "pp-m2-4_b",
        label:
          "É uma técnica que usa feedback humano para alinhar as respostas com preferências e valores humanos",
      },
      {
        id: "pp-m2-4_c",
        label: "É um sistema de cache que acelera as respostas do modelo",
      },
      {
        id: "pp-m2-4_d",
        label: "É um método para comprimir o modelo e torná-lo mais eficiente",
      },
    ],
    correctAnswer: "pp-m2-4_b",
    topic: "RLHF",
    difficulty: "hard",
    feedback:
      "RLHF (Reinforcement Learning from Human Feedback) treina um modelo de recompensa com base em preferências humanas e, em seguida, reforça o LLM para alinhar suas respostas com essas preferências. É fundamental para tornar a IA útil e segura.",
    relatedFlashcardId: "m2-f6",
  },
  {
    id: "pp-m2-5",
    question:
      "Um usuário escreve um prompt de 10.000 tokens, mas o modelo só aceita 8.000. Qual conceito explica essa limitação?",
    options: [
      { id: "pp-m2-5_a", label: "Limite de tokens por minuto (TPM)" },
      { id: "pp-m2-5_b", label: "Context window (janela de contexto)" },
      { id: "pp-m2-5_c", label: "Taxa de amostragem do modelo" },
      { id: "pp-m2-5_d", label: "Cota gratuita da API" },
    ],
    correctAnswer: "pp-m2-5_b",
    topic: "Context Window",
    difficulty: "medium",
    feedback:
      "O context window é o máximo de tokens (entrada + saída) que o modelo consegue processar em uma única interação. Modelos como o GPT-3.5 têm 4K-16K; o GPT-4 chega a 32K-128K tokens.",
    relatedFlashcardId: "m2-f3",
  },
  {
    id: "pp-m2-6",
    question:
      "O que os embeddings representam no contexto de modelos de linguagem?",
    options: [
      {
        id: "pp-m2-6_a",
        label: "São resumos automáticos de textos longos gerados pelo modelo",
      },
      {
        id: "pp-m2-6_b",
        label:
          "São representações numéricas (vetores) que capturam o significado semântico de palavras ou textos",
      },
      {
        id: "pp-m2-6_c",
        label:
          "São metadados que descrevem a fonte e a data dos dados de treinamento",
      },
      {
        id: "pp-m2-6_d",
        label: "São regras gramaticais que o modelo aplica ao gerar texto",
      },
    ],
    correctAnswer: "pp-m2-6_b",
    topic: "Embeddings",
    difficulty: "hard",
    feedback:
      "Os embeddings transformam palavras ou textos em vetores numéricos em que a distância entre vetores reflete a similaridade semântica. São usados para busca semântica, clustering e sistemas RAG.",
    relatedFlashcardId: "m2-f7",
  },
  {
    id: "pp-m2-7",
    question:
      "Qual é a diferença principal entre um modelo GPT-3.5 e um GPT-4 em termos de capacidades?",
    options: [
      {
        id: "pp-m2-7_a",
        label:
          "O GPT-4 tem um context window maior e melhor raciocínio, mas é mais lento e mais caro",
      },
      {
        id: "pp-m2-7_b",
        label: "O GPT-4 é gratuito, enquanto o GPT-3.5 é pago",
      },
      {
        id: "pp-m2-7_c",
        label: "O GPT-4 só funciona com imagens, não com texto",
      },
      {
        id: "pp-m2-7_d",
        label: "Não há diferenças significativas entre os dois modelos",
      },
    ],
    correctAnswer: "pp-m2-7_a",
    topic: "Modelos GPT",
    difficulty: "medium",
    feedback:
      "O GPT-4 oferece melhor raciocínio, maior context window (32K vs 4-16K) e respostas mais precisas, porém a um custo maior e velocidade mais lenta que o GPT-3.5.",
  },
];
