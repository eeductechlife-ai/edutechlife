export const MODULE_2_PT = [
  {
    id: "m2q1",
    question:
      "Você tem um CSV de vendas e quer descobrir quais produtos crescem mais. Qual combinação de ferramentas é a mais útil?",
    options: [
      {
        id: "m2q1_a",
        label: "Interpretador de Código no CSV e Busca na Web para tendências",
      },
      {
        id: "m2q1_b",
        label: "Canvas para colar os dados e DALL-E para os gráficos",
      },
      { id: "m2q1_c", label: "Só Busca na Web para ler artigos do mercado" },
      {
        id: "m2q1_d",
        label: "DALL-E 3 para analisar o arquivo automaticamente",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "Ferramentas ChatGPT",
    difficulty: "médio",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "O Interpretador analisa o CSV e a Busca na Web traz dados do mercado. Pratique no laboratório.",
  },
  {
    id: "m2q2",
    question:
      "Um escritório quer um GPT para redigir contratos com modelos e jurisprudência atual. Qual configuração é a adequada?",
    options: [
      {
        id: "m2q2_a",
        label: "Prompt jurídico + base de conhecimento + function calling",
      },
      {
        id: "m2q2_b",
        label: "Um prompt que só diga que você é um assistente jurídico",
      },
      {
        id: "m2q2_c",
        label: "Ativar Busca na Web e DALL-E para procurar contratos",
      },
      { id: "m2q2_d", label: "Um GPT sem instruções, só com análise de dados" },
    ],
    correctAnswer: "m2q2_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "Um GPT útil combina prompt especializado, base de conhecimento e function calling.",
  },
  {
    id: "m2q3",
    question:
      'Um GPT usa function calling para ler pedidos. O usuário escreve "Onde vai o pedido #789, email ana@exemplo.com?" O que acontece internamente?',
    options: [
      {
        id: "m2q3_a",
        label: "Extrai #789 e o email e executa a função do pedido",
      },
      {
        id: "m2q3_b",
        label: "Pede ao usuário para preencher um formulário separado",
      },
      { id: "m2q3_c", label: "Procura o número do pedido na internet" },
      { id: "m2q3_d", label: "Envia a mensagem completa à API sem processar" },
    ],
    correctAnswer: "m2q3_a",
    topic: "Function Calling",
    difficulty: "difícil",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "Function calling extrai os parâmetros e executa a função. Reveja o tema no módulo.",
  },
  {
    id: "m2q4",
    question: "O que o function calling permite com a API do ChatGPT?",
    options: [
      {
        id: "m2q4_a",
        label: "Conectar o ChatGPT a APIs, bancos de dados e serviços externos",
      },
      {
        id: "m2q4_b",
        label: "Ligar por telefone para o suporte técnico do usuário",
      },
      { id: "m2q4_c", label: "Criar funções matemáticas mais rápidas no chat" },
      {
        id: "m2q4_d",
        label: "Baixar automaticamente todos os plugins disponíveis",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Function calling conecta o ChatGPT ao mundo real. Reveja o guia de GPTs.",
  },
  {
    id: "m2q5",
    question:
      "Um community manager recebe muitas perguntas frequentes por dia. Como automatizar melhor as respostas com um GPT?",
    options: [
      { id: "m2q5_a", label: "GPT com tom da marca, FAQs e conexão por API" },
      {
        id: "m2q5_b",
        label: "Responder cada comentário à mão com o ChatGPT padrão",
      },
      { id: "m2q5_c", label: "Deixar a Busca na Web responder os comentários" },
      { id: "m2q5_d", label: "Gerar imagens e publicá-las como respostas" },
    ],
    correctAnswer: "m2q5_a",
    topic: "Automação",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "Um GPT com instruções, base de conhecimento e API automatiza respostas. Pratique no laboratório.",
  },
  {
    id: "m2q6",
    question:
      "Um GPT de reclamações às vezes dá dados errados sobre devoluções. Qual é a melhor prática responsável?",
    options: [
      {
        id: "m2q6_a",
        label: "Revisão humana e alertas quando a IA tiver dúvida",
      },
      { id: "m2q6_b", label: "Desligar a IA e responder tudo à mão" },
      { id: "m2q6_c", label: "Ignorar os erros por causa da velocidade" },
      { id: "m2q6_d", label: "Dar só respostas genéricas sem dados" },
    ],
    correctAnswer: "m2q6_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "A IA acelera e a pessoa confere. Reveja as boas práticas de uso responsável.",
  },
  {
    id: "m2q7",
    question:
      "Uma equipe de vendas quer compartilhar conhecimento atualizado de produtos. Qual estratégia é a melhor?",
    options: [
      {
        id: "m2q7_a",
        label: "Um Projeto compartilhado com uma base de conhecimento comum",
      },
      { id: "m2q7_b", label: "Cada vendedor guarda as próprias instruções" },
      { id: "m2q7_c", label: "Usar um GPT público que todos baixem" },
      { id: "m2q7_d", label: "Compartilhar capturas de chats por e-mail" },
    ],
    correctAnswer: "m2q7_a",
    topic: "Projetos ChatGPT",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Projetos agrupam conversas com instruções e arquivos compartilhados. Reveja o guia.",
  },
  {
    id: "m2q8",
    question:
      "Você quer que um GPT consulte um catálogo que atualiza diariamente. O que você ativa?",
    options: [
      {
        id: "m2q8_a",
        label: "Base de conhecimento e Actions (API) para dados vivos",
      },
      {
        id: "m2q8_b",
        label: "Pedir ao usuário para colar o catálogo toda vez",
      },
      { id: "m2q8_c", label: "Gerar imagens do catálogo com DALL-E" },
      { id: "m2q8_d", label: "Não é possível consultar dados atualizados" },
    ],
    correctAnswer: "m2q8_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "A base guarda o estático e as Actions trazem o que muda. Reveja o laboratório de GPTs.",
  },
  {
    id: "m2q9",
    question:
      "Você vai publicar na GPT Store um GPT que usa na sua empresa. O que você verifica primeiro?",
    options: [
      { id: "m2q9_a", label: "Se ele guarda dados sensíveis da sua empresa" },
      { id: "m2q9_b", label: "Se o nome é chamativo o bastante" },
      { id: "m2q9_c", label: "Se tem funções para justificar o preço" },
      { id: "m2q9_d", label: "Se o logotipo parece profissional" },
    ],
    correctAnswer: "m2q9_a",
    topic: "Privacidade GPT",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Antes de publicar, confira se não há dados confidenciais. Reveja o tema de privacidade.",
  },
  {
    id: "m2q10",
    question:
      "Você quer que o ChatGPT detecte reclamações urgentes nas redes e avise o suporte. Qual combinação você usa?",
    options: [
      {
        id: "m2q10_a",
        label: "Um GPT com Actions (API) conectado a um webhook",
      },
      { id: "m2q10_b", label: "ChatGPT padrão com a Busca na Web ativada" },
      {
        id: "m2q10_c",
        label: "DALL-E para responder aos comentários com imagens",
      },
      {
        id: "m2q10_d",
        label: "Canvas para revisar e editar cada comentário à mão",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "Automação",
    difficulty: "difícil",
    source: "OVA: Fluxos de Automação no Mundo Real",
    feedback:
      "Um GPT com Actions e um webhook automatiza o aviso. Reveja a OVA de automação.",
  },
];
