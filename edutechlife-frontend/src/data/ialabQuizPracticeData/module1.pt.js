export const MODULE_1_PT = [
  {
    id: "pp-m1-1",
    question: "Qual é a função principal de um prompt na interação com um LLM?",
    options: [
      {
        id: "pp-m1-1_a",
        label: "Limitar a capacidade do modelo para evitar erros",
      },
      {
        id: "pp-m1-1_b",
        label: "Instruir o modelo sobre qual tarefa realizar e como responder",
      },
      {
        id: "pp-m1-1_c",
        label: "Treinar o modelo com novos dados em tempo real",
      },
      {
        id: "pp-m1-1_d",
        label: "Aumentar automaticamente a temperatura do modelo",
      },
    ],
    correctAnswer: "pp-m1-1_b",
    topic: "Fundamentos de Prompts",
    difficulty: "easy",
    feedback:
      "Um prompt é uma instrução que define a tarefa, o papel e o formato esperado da resposta do modelo. Sem um prompt claro, o modelo não consegue gerar uma saída útil.",
    relatedFlashcardId: "m1-f1",
  },
  {
    id: "pp-m1-2",
    question: "Em que o fine-tuning difere do prompt engineering?",
    options: [
      {
        id: "pp-m1-2_a",
        label:
          "O fine-tuning modifica os pesos do modelo com dados específicos; o prompt engineering apenas projeta a entrada",
      },
      {
        id: "pp-m1-2_b",
        label:
          "O fine-tuning é mais rápido e econômico que o prompt engineering",
      },
      {
        id: "pp-m1-2_c",
        label:
          "O prompt engineering exige acesso aos pesos do modelo; o fine-tuning não",
      },
      {
        id: "pp-m1-2_d",
        label: "Não há diferença: ambos os termos significam a mesma coisa",
      },
    ],
    correctAnswer: "pp-m1-2_a",
    topic: "Fine-Tuning vs Prompt Engineering",
    difficulty: "medium",
    feedback:
      "O fine-tuning ajusta os parâmetros do modelo com dados específicos para uma tarefa, enquanto o prompt engineering otimiza as instruções de entrada sem modificar o modelo.",
    relatedFlashcardId: "m1-f2",
  },
  {
    id: "pp-m1-3",
    question:
      "Se você precisa que um LLM gere respostas muito precisas e factuais, qual valor de temperatura você deve usar?",
    options: [
      {
        id: "pp-m1-3_a",
        label: "Temperatura alta (próxima de 1.0) para máxima criatividade",
      },
      {
        id: "pp-m1-3_b",
        label:
          "Temperatura baixa (próxima de 0.0) para respostas determinísticas e precisas",
      },
      {
        id: "pp-m1-3_c",
        label: "Temperatura média (0.5) para um equilíbrio justo",
      },
      {
        id: "pp-m1-3_d",
        label: "A temperatura não afeta a precisão das respostas",
      },
    ],
    correctAnswer: "pp-m1-3_b",
    topic: "Temperatura em LLMs",
    difficulty: "easy",
    feedback:
      "Uma temperatura baixa (0.0-0.3) reduz a aleatoriedade, fazendo com que o modelo selecione as palavras mais prováveis. Isso é ideal para tarefas que exigem precisão e fatos concretos.",
    relatedFlashcardId: "m1-f3",
  },
  {
    id: "pp-m1-4",
    question:
      "Um sistema RAG (Retrieval-Augmented Generation) é útil principalmente porque:",
    options: [
      {
        id: "pp-m1-4_a",
        label: "Substitui completamente o treinamento do modelo",
      },
      {
        id: "pp-m1-4_b",
        label:
          "Permite que o modelo acesse informações atualizadas sem necessidade de re-treinamento",
      },
      {
        id: "pp-m1-4_c",
        label: "Aumenta automaticamente o número de parâmetros do modelo",
      },
      { id: "pp-m1-4_d", label: "Elimina a necessidade de escrever prompts" },
    ],
    correctAnswer: "pp-m1-4_b",
    topic: "RAG (Recuperação Aumentada)",
    difficulty: "medium",
    feedback:
      "O RAG combina a recuperação de documentos relevantes com a geração de texto, permitindo que o modelo acesse informações externas atualizadas sem modificar seus pesos. É ideal para dados dinâmicos ou conhecimento especializado.",
    relatedFlashcardId: "m1-f4",
  },
  {
    id: "pp-m1-5",
    question:
      "Qual dos seguintes NÃO é um componente do método RTF (Papel, Tarefa, Formato)?",
    options: [
      { id: "pp-m1-5_a", label: "Papel: definir qual perfil a IA adota" },
      { id: "pp-m1-5_b", label: "Tarefa: especificar o que a IA deve fazer" },
      {
        id: "pp-m1-5_c",
        label: "Formato: indicar como a resposta deve ser estruturada",
      },
      {
        id: "pp-m1-5_d",
        label: "Temperatura: ajustar a criatividade da resposta",
      },
    ],
    correctAnswer: "pp-m1-5_d",
    topic: "Método RTF",
    difficulty: "easy",
    feedback:
      "O método RTF é composto por três partes: Papel (quem é a IA), Tarefa (o que deve fazer) e Formato (como deve responder). A temperatura é um parâmetro técnico do modelo, não um componente do método RTF.",
  },
  {
    id: "pp-m1-6",
    question:
      "O que são os parâmetros em um modelo de linguagem e como eles se relacionam com a capacidade dele?",
    options: [
      {
        id: "pp-m1-6_a",
        label: "São instruções escritas pelo usuário para guiar o modelo",
      },
      {
        id: "pp-m1-6_b",
        label:
          "São valores numéricos que o modelo ajusta durante o treinamento; mais parâmetros geralmente significam maior capacidade",
      },
      {
        id: "pp-m1-6_c",
        label: "São arquivos de entrada carregados no início de cada sessão",
      },
      {
        id: "pp-m1-6_d",
        label: "São métricas de desempenho que medem a velocidade do modelo",
      },
    ],
    correctAnswer: "pp-m1-6_b",
    topic: "Parâmetros e Capacidade",
    difficulty: "medium",
    feedback:
      "Os parâmetros são os pesos e vieses que o modelo aprende durante o treinamento. Modelos com mais parâmetros (como o GPT-4, com trilhões) podem capturar padrões mais complexos, mas exigem mais dados e computação.",
    relatedFlashcardId: "m1-f7",
  },
  {
    id: "pp-m1-7",
    question:
      'No contexto dos LLMs, o que significa um modelo ser "pré-treinado" e como isso difere do treinamento tradicional?',
    options: [
      {
        id: "pp-m1-7_a",
        label:
          "O pré-treinamento usa dados não rotulados para aprender padrões da linguagem; o treinamento tradicional usa dados rotulados para tarefas específicas",
      },
      {
        id: "pp-m1-7_b",
        label:
          "O pré-treinamento é opcional; os modelos podem funcionar sem ele",
      },
      {
        id: "pp-m1-7_c",
        label:
          "O pré-treinamento só é usado para modelos pequenos; os grandes usam treinamento direto",
      },
      {
        id: "pp-m1-7_d",
        label:
          "Ambos os termos são sinônimos e são usados de forma intercambiável",
      },
    ],
    correctAnswer: "pp-m1-7_a",
    topic: "Pré-treinamento",
    difficulty: "hard",
    feedback:
      "O pré-treinamento é uma fase em que o modelo aprende padrões linguísticos a partir de enormes quantidades de texto não rotulado (auto-supervisionado). Em seguida, o fine-tuning o adapta a tarefas específicas com dados rotulados.",
    relatedFlashcardId: "m1-f6",
  },
];
