export const learningObjectives = [
  "Identificar vieses em sistemas de IA",
  "Desenvolver estratégias de mitigação de vieses",
  "Avaliar o impacto social dos vieses algorítmicos",
];

export const gameData = [
  {
    q: "Um sistema de IA gera uma lista de 'Personagens Históricos Importantes' e todos são homens europeus. Que viés você identifica?",
    opts: [
      "Viés de dados históricos e de representação.",
      "Viés de automação.",
      "Erro de rede da internet.",
    ],
    correct: 0,
    feedback:
      "Correto! Isso reflete a falta de diversidade e o viés cultural nos dados de treinamento.",
  },
  {
    q: "Você está usando IA para um diagnóstico e ela produz um resultado que contradiz o seu critério profissional. Como você age?",
    opts: [
      "Aceito a IA porque ela é mais inteligente do que eu.",
      "Questiono o viés de automação e verifico com especialistas.",
      "Deixo a IA decidir a medicação.",
    ],
    correct: 1,
    feedback:
      "Excelente! Você não deve delegar a responsabilidade moral a um sistema que não pode assumi-la.",
  },
  {
    q: "Você quer que a IA escreva um conto sobre liderança. Para evitar estereótipos de gênero, o que você faz?",
    opts: [
      "Excluo o aplicativo.",
      "Gero o conto e confio que a IA será justa.",
      "Reformulo o prompt pedindo explicitamente inclusão e equidade de gênero.",
    ],
    correct: 2,
    feedback:
      "Muito bem! Instruir a IA de forma explícita é uma ótima estratégia de mitigação.",
  },
];

export const accordionData = [
  {
    id: "acc1",
    title: "Viés Geográfico e Cultural",
    icon: "🌍",
    content:
      "Modelos treinados principalmente com dados do Norte Global geram respostas com marcos culturais alheios. Exemplo: exemplos sobre história, política ou cultura que ignoram perspectivas latino-americanas ou africanas.",
  },
  {
    id: "acc2",
    title: "Viés de Representação e Gênero (Experimento de Stanford)",
    icon: "👥",
    content:
      'Em 2023, pesquisadores pediram a modelos de linguagem: "Escreva a história de um CEO de sucesso." Em 78% dos casos, gerou um homem. Ao pedir histórias de "enfermeiras", 91% foram mulheres. Isso mostra como os vieses históricos se replicam automaticamente.',
  },
  {
    id: "acc3",
    title: "Viés de Automação",
    icon: "🤖",
    content:
      "As pessoas tendem a confiar mais nas respostas de uma IA do que nas de um humano. Exemplo: aceitar sem questionar um diagnóstico ou recomendação de IA, mesmo quando contradiz o critério especializado.",
  },
];

export const mitigations = [
  {
    title: "Pensamento Crítico",
    icon: "💡",
    desc: "Não aceite nenhuma resposta de IA sem avaliar sua coerência, verificar dados-chave e comparar com outras fontes. Pergunte-se: De onde vem essa afirmação?",
  },
  {
    title: "Diversificar Fontes",
    icon: "📚",
    desc: "Complemente as respostas da IA com fontes acadêmicas, perspectivas de autores latino-americanos e dados locais. A IA tem um viés em relação ao mundo anglófono.",
  },
  {
    title: "Assumir Responsabilidade",
    icon: "🛡️",
    desc: "Qualquer conteúdo que você publique ou entregue, gerado com IA, é sua responsabilidade. Se contiver vieses ou erros, é você quem o respalda.",
  },
];
