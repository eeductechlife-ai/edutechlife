export const MODULE_5_PT = [
  {
    id: "pp-m5-1",
    question: 'O que o princípio de "IA responsável" busca garantir?',
    options: [
      {
        id: "pp-m5-1_a",
        label: "Que a IA seja mais rápida que os humanos em todas as tarefas",
      },
      {
        id: "pp-m5-1_b",
        label:
          "Que o desenvolvimento de IA priorize equidade, transparência, privacidade e prestação de contas",
      },
      {
        id: "pp-m5-1_c",
        label: "Que todos os modelos tenham a mesma quantidade de parâmetros",
      },
      {
        id: "pp-m5-1_d",
        label: "Que a IA substitua completamente a tomada de decisão humana",
      },
    ],
    correctAnswer: "pp-m5-1_b",
    topic: "IA Responsável",
    difficulty: "easy",
    feedback:
      "A IA responsável é um framework ético que garante que os sistemas de IA sejam desenvolvidos e usados de forma justa, transparente, respeitosa com a privacidade e com mecanismos claros de prestação de contas.",
    relatedFlashcardId: "m5-f1",
  },
  {
    id: "pp-m5-2",
    question:
      "Como o viés (bias) é introduzido em um modelo de IA durante o treinamento?",
    options: [
      {
        id: "pp-m5-2_a",
        label:
          "O viés é inerente à arquitetura do transformer e não pode ser evitado",
      },
      {
        id: "pp-m5-2_b",
        label:
          "Por dados de treinamento desbalanceados, rotulagem incorreta ou preconceitos históricos nos dados",
      },
      {
        id: "pp-m5-2_c",
        label:
          "O viés só aparece quando o modelo é usado em produção, não durante o treinamento",
      },
      {
        id: "pp-m5-2_d",
        label: "O viés é um parâmetro ajustável como a temperatura",
      },
    ],
    correctAnswer: "pp-m5-2_b",
    topic: "Viés em IA",
    difficulty: "easy",
    feedback:
      "O viés algorítmico surge principalmente de dados de treinamento que refletem desequilíbrios históricos ou sociais. Se os dados super-representam certos grupos, o modelo aprenderá e amplificará esses vieses.",
    relatedFlashcardId: "m5-f2",
  },
  {
    id: "pp-m5-3",
    question:
      "Qual técnica permite proteger a privacidade individual enquanto padrões úteis são extraídos de um dataset?",
    options: [
      { id: "pp-m5-3_a", label: "Eliminar todos os dados pessoais do dataset" },
      {
        id: "pp-m5-3_b",
        label:
          "Privacidade diferencial: adicionar ruído controlado aos dados para impossibilitar a identificação individual",
      },
      {
        id: "pp-m5-3_c",
        label: "Criptografar o modelo inteiro para que ninguém possa usá-lo",
      },
      {
        id: "pp-m5-3_d",
        label: "Reduzir o tamanho do dataset a apenas dados anônimos",
      },
    ],
    correctAnswer: "pp-m5-3_b",
    topic: "Privacidade Diferencial",
    difficulty: "hard",
    feedback:
      "A privacidade diferencial adiciona ruído matematicamente calibrado aos dados ou gradientes de treinamento, de modo que os padrões agregados sejam úteis, mas seja impossível inferir informações de indivíduos específicos.",
    relatedFlashcardId: "m5-f3",
  },
  {
    id: "pp-m5-4",
    question: "Qual é o objetivo principal da IA explicável (XAI)?",
    options: [
      {
        id: "pp-m5-4_a",
        label: "Tornar os modelos mais rápidos em suas previsões",
      },
      {
        id: "pp-m5-4_b",
        label:
          "Tornar as decisões dos modelos de IA interpretáveis e compreensíveis para os humanos",
      },
      { id: "pp-m5-4_c", label: "Reduzir o número de parâmetros do modelo" },
      {
        id: "pp-m5-4_d",
        label: "Eliminar a necessidade de dados de treinamento",
      },
    ],
    correctAnswer: "pp-m5-4_b",
    topic: "IA Explicável",
    difficulty: "medium",
    feedback:
      'A XAI (eXplainable AI) busca abrir a "caixa-preta" dos modelos complexos, fornecendo explicações compreensíveis sobre por que um modelo tomou uma determinada decisão. É crucial para aplicações em saúde, justiça e finanças.',
    relatedFlashcardId: "m5-f4",
  },
  {
    id: "pp-m5-5",
    question:
      "Um sistema de IA para seleção de pessoal rejeita candidatas mulheres em maior proporção do que homens para cargos técnicos. Qual princípio de IA responsável está sendo violado?",
    options: [
      { id: "pp-m5-5_a", label: "Privacidade diferencial" },
      { id: "pp-m5-5_b", label: "Equidade (fairness)" },
      { id: "pp-m5-5_c", label: "Prestação de contas" },
      { id: "pp-m5-5_d", label: "Eficiência computacional" },
    ],
    correctAnswer: "pp-m5-5_b",
    topic: "Equidade em IA",
    difficulty: "medium",
    feedback:
      "A equidade em IA exige que os sistemas não discriminem por características protegidas, como gênero, raça, idade ou religião. Este caso mostra um viés de gênero que viola o princípio de equidade.",
    relatedFlashcardId: "m5-f5",
  },
  {
    id: "pp-m5-6",
    question: 'O que significa "transparência" no contexto de sistemas de IA?',
    options: [
      {
        id: "pp-m5-6_a",
        label: "Que o código do modelo seja open source e gratuito",
      },
      {
        id: "pp-m5-6_b",
        label:
          "Tornar visível como o modelo funciona, quais dados usa, como toma decisões e quem é o responsável",
      },
      {
        id: "pp-m5-6_c",
        label:
          "Que o modelo possa explicar suas decisões em menos de 100 caracteres",
      },
      {
        id: "pp-m5-6_d",
        label:
          "Que os dados de treinamento sejam acessíveis ao público em geral",
      },
    ],
    correctAnswer: "pp-m5-6_b",
    topic: "Transparência",
    difficulty: "medium",
    feedback:
      "Transparência implica revelar o propósito do sistema, os dados utilizados, as limitações conhecidas e o processo de tomada de decisão. Permite auditoria externa e gera confiança nos usuários.",
    relatedFlashcardId: "m5-f6",
  },
  {
    id: "pp-m5-7",
    question:
      "Qual é a diferença entre vieses algorítmicos e vieses nos dados de treinamento?",
    options: [
      {
        id: "pp-m5-7_a",
        label: "Não há diferença; ambos os termos são sinônimos",
      },
      {
        id: "pp-m5-7_b",
        label:
          "Os vieses nos dados vêm de amostras não representativas; os algorítmicos incluem também erros no design do modelo ou na métrica de otimização",
      },
      {
        id: "pp-m5-7_c",
        label:
          "Os vieses algorítmicos só afetam modelos pequenos; os de dados afetam todos",
      },
      {
        id: "pp-m5-7_d",
        label:
          "Os vieses nos dados são intencionais; os algorítmicos são acidentais",
      },
    ],
    correctAnswer: "pp-m5-7_b",
    topic: "Vieses Algorítmicos",
    difficulty: "hard",
    feedback:
      "Os vieses nos dados vêm de amostras não representativas ou rotulagem incorreta. Os vieses algorítmicos são mais amplos: incluem os vieses de dados mais erros introduzidos pela arquitetura do modelo, pela função de perda ou pela métrica de avaliação.",
    relatedFlashcardId: "m5-f7",
  },
];
