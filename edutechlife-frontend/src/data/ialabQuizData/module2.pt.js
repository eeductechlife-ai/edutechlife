export const MODULE_2_PT = [
  {
    id: "m2q1",
    question:
      "Você é analista de dados em uma startup de e-commerce. Recebe um CSV com 10.000 registros de vendas do último trimestre e precisa identificar quais produtos crescem mais. Também deve comparar os resultados com as tendências atuais do mercado. Qual é a melhor estratégia combinando ferramentas do ChatGPT?",
    options: [
      {
        id: "m2q1_a",
        label:
          "Usar o Interpretador de Código para analisar o CSV e a Pesquisa Web para investigar tendências do setor",
      },
      {
        id: "m2q1_b",
        label:
          "Usar o Canvas para colar os dados manualmente e o DALL-E para gerar os gráficos",
      },
      {
        id: "m2q1_c",
        label:
          "Usar apenas a Pesquisa Web para encontrar artigos sobre tendências de mercado",
      },
      {
        id: "m2q1_d",
        label:
          "Usar o DALL-E 3 para gerar a análise automaticamente a partir do CSV",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "Ferramentas do ChatGPT",
    difficulty: "médio",
    feedback:
      'O Interpretador de Código executa Python sobre o CSV para cálculos e gráficos, enquanto a Pesquisa Web obtém dados atuais do mercado. Combiná-los dá uma análise completa. Revise o OVA "Laboratório: Ferramentas do ChatGPT".',
  },
  {
    id: "m2q2",
    question:
      "Qual ferramenta do ChatGPT você deve usar para analisar um arquivo Excel com dados de vendas e criar gráficos?",
    options: [
      { id: "m2q2_a", label: "DALL-E 3" },
      { id: "m2q2_b", label: "Interpretador de Código (Análise de Dados)" },
      { id: "m2q2_c", label: "Canvas" },
      { id: "m2q2_d", label: "Pesquisa Web" },
    ],
    correctAnswer: "m2q2_b",
    topic: "Análise de Dados",
    difficulty: "médio",
    feedback:
      'O Interpretador de Código executa Python para processar arquivos e criar visualizações. Revise o OVA "Laboratório: Ferramentas do ChatGPT".',
  },
  {
    id: "m2q3",
    question:
      "Um escritório de advocacia pede que você crie um GPT personalizado para ajudar os advogados a redigir contratos. Ele deve acessar modelos jurídicos, verificar jurisprudência atualizada e gerar cláusulas conforme o caso. Qual configuração é a mais adequada?",
    options: [
      {
        id: "m2q3_a",
        label:
          "System prompt com instruções jurídicas detalhadas + base de conhecimento com modelos + Function Calling para uma base de jurisprudência",
      },
      {
        id: "m2q3_b",
        label:
          'Apenas um system prompt genérico dizendo "você é um assistente jurídico"',
      },
      {
        id: "m2q3_c",
        label:
          "Ativar a Pesquisa Web e o DALL-E 3 para buscar exemplos visuais de contratos",
      },
      {
        id: "m2q3_d",
        label:
          "Um GPT sem instruções personalizadas, apenas com análise de dados ativada",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    feedback:
      'Um GPT personalizado eficaz combina: system prompt especializado, base de conhecimento com documentos relevantes e Function Calling para dados externos. Revise o vídeo "Crie seu Primeiro GPT em 18 Minutos" e o guia visual de GPTs.',
  },
  {
    id: "m2q4",
    question:
      'Você tem um GPT de atendimento ao cliente conectado a uma API de pedidos via Function Calling. A função registrada extrai automaticamente dados como número do pedido e e-mail da conversa. Quando um usuário escreve "Onde está meu pedido #789? Meu e-mail é ana@exemplo.com", o que acontece internamente?',
    options: [
      {
        id: "m2q4_a",
        label:
          "O ChatGPT identifica os dados relevantes (#789, ana@exemplo.com) e executa a função automaticamente na API de pedidos",
      },
      {
        id: "m2q4_b",
        label:
          "O usuário precisa preencher um formulário separado com seus dados antes de receber ajuda",
      },
      {
        id: "m2q4_c",
        label: "O ChatGPT busca na internet o número do pedido para rastreá-lo",
      },
      {
        id: "m2q4_d",
        label:
          "O Function Calling envia a mensagem completa do usuário para a API sem processamento",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "difícil",
    feedback:
      'O Function Calling permite que o ChatGPT extraia parâmetros estruturados da linguagem natural e execute funções automaticamente. Revise o tópico "Conecte o ChatGPT com o Mundo Real" e a Lição 3 do módulo.',
  },
  {
    id: "m2q5",
    question: "O que o Function Calling com a API da OpenAI permite fazer?",
    options: [
      { id: "m2q5_a", label: "Ligar para o suporte técnico" },
      {
        id: "m2q5_b",
        label:
          "Conectar o ChatGPT a serviços externos como bancos de dados, APIs de clima ou sistemas de e-mail",
      },
      { id: "m2q5_c", label: "Criar funções matemáticas mais rápidas" },
      {
        id: "m2q5_d",
        label: "Baixar automaticamente todos os plugins disponíveis",
      },
    ],
    correctAnswer: "m2q5_b",
    topic: "Function Calling",
    difficulty: "difícil",
    feedback:
      'O Function Calling conecta o ChatGPT com o mundo real. Revise os recursos do tópico "Conecte o ChatGPT com o Mundo Real".',
  },
  {
    id: "m2q6",
    question:
      "Você está preparando uma tese e precisa que o ChatGPT lembre do seu referencial teórico em cada sessão. Qual recurso você deve usar?",
    options: [
      { id: "m2q6_a", label: "Pesquisa Web" },
      { id: "m2q6_b", label: "DALL-E 3" },
      { id: "m2q6_c", label: "Projetos e Memória" },
      { id: "m2q6_d", label: "Interpretador de Código" },
    ],
    correctAnswer: "m2q6_c",
    topic: "Projetos ChatGPT",
    difficulty: "difícil",
    feedback:
      "Os Projetos agrupam conversas sob instruções comuns e a Memória guarda o contexto. Revise o guia do ChatGPT.",
  },
  {
    id: "m2q7",
    question:
      "Um community manager recebe mais de 200 comentários diários nas redes sociais. Muitos são perguntas frequentes (horários, preços, disponibilidade). Ele quer automatizar as respostas com um GPT personalizado. Qual é o fluxo de trabalho mais eficaz?",
    options: [
      {
        id: "m2q7_a",
        label:
          "Criar um GPT com instruções sobre o tom da marca, subir uma base de conhecimento com FAQs e conectá-lo por API à plataforma de redes sociais",
      },
      {
        id: "m2q7_b",
        label:
          "Pedir ao ChatGPT padrão que responda cada comentário manualmente, um a um",
      },
      {
        id: "m2q7_c",
        label:
          "Configurar a Pesquisa Web para encontrar respostas automáticas na internet",
      },
      {
        id: "m2q7_d",
        label:
          "Usar o DALL-E 3 para gerar imagens que respondam visualmente aos comentários",
      },
    ],
    correctAnswer: "m2q7_a",
    topic: "Automação",
    difficulty: "médio",
    feedback:
      'Um GPT personalizado com instruções e base de conhecimento, conectado por API, automatiza as respostas mantendo a consistência. Revise o OVA "Laboratório: Construa um GPT" e o tópico de automação do módulo.',
  },
  {
    id: "m2q8",
    question:
      "Uma empresa implementa um GPT automatizado para responder reclamações de clientes nas redes sociais. O GPT é rápido, mas ocasionalmente dá informações incorretas sobre políticas de devolução. Qual é a melhor prática para usar a IA com responsabilidade neste caso?",
    options: [
      {
        id: "m2q8_a",
        label:
          "Implementar supervisão humana com alertas automáticos quando o GPT tiver baixa confiança, e auditar as respostas periodicamente",
      },
      {
        id: "m2q8_b",
        label:
          "Desativar o GPT e fazer toda a equipe responder manualmente sem ajuda de IA",
      },
      {
        id: "m2q8_c",
        label:
          "Ignorar os erros porque a velocidade de resposta é o mais importante",
      },
      {
        id: "m2q8_d",
        label:
          "Configurar o GPT para dar sempre respostas genéricas, sem informações específicas",
      },
    ],
    correctAnswer: "m2q8_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    feedback:
      "A IA deve ampliar a capacidade humana, não substituí-la sem supervisão. A melhor prática é um sistema híbrido: IA para velocidade + supervisão humana para precisão. Revise as boas práticas do módulo sobre o uso responsável de IA.",
  },
  {
    id: "m2q9",
    question:
      "Uma equipe de 5 vendedores quer usar o ChatGPT para manter atualizada a base de conhecimentos de produtos. Cada vendedor tem conversas diferentes com clientes distintos. Qual é a melhor estratégia para que todos compartilhem informações atualizadas?",
    options: [
      {
        id: "m2q9_a",
        label:
          "Criar um Projeto compartilhado com instruções de produto e atualizar a base de conhecimento centralizada",
      },
      {
        id: "m2q9_b",
        label:
          "Cada vendedor mantém seu próprio chat com as instruções que lembrar",
      },
      { id: "m2q9_c", label: "Usar um GPT público que todos possam baixar" },
      {
        id: "m2q9_d",
        label: "Compartilhar capturas de tela dos chats por e-mail",
      },
    ],
    correctAnswer: "m2q9_a",
    topic: "Projetos ChatGPT",
    difficulty: "médio",
    feedback:
      "Os Projetos no ChatGPT permitem agrupar conversas sob instruções e arquivos compartilhados. Revise o tópico de Projetos nos recursos do módulo.",
  },
  {
    id: "m2q10",
    question:
      "Você está criando um GPT de atendimento ao cliente. Quer que ele consulte o catálogo de produtos atualizado diariamente. Qual funcionalidade você deve ativar?",
    options: [
      {
        id: "m2q10_a",
        label:
          "Subir o catálogo como base de conhecimento e usar Actions (API) para consultar atualizações em tempo real",
      },
      {
        id: "m2q10_b",
        label: "Pedir ao usuário que copie e cole o catálogo a cada vez",
      },
      { id: "m2q10_c", label: "Usar o DALL-E para gerar imagens do catálogo" },
      {
        id: "m2q10_d",
        label: "Não é possível consultar dados atualizados em um GPT",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "GPTs Personalizados",
    difficulty: "difícil",
    feedback:
      'Os GPTs podem ter base de conhecimento estática + Actions (chamadas de API) para dados dinâmicos. Isso permite consultar informações atualizadas em tempo real. Revise o tópico "Conecte o ChatGPT com o Mundo Real".',
  },
  {
    id: "m2q11",
    question:
      "Um GPT que você criou para a sua startup está funcionando muito bem internamente. Seu sócio sugere publicá-lo na GPT Store para que outras startups também o usem. Qual consideração de privacidade você deve avaliar PRIMEIRO?",
    options: [
      {
        id: "m2q11_a",
        label:
          "Se o GPT contém dados sensíveis da sua empresa na base de conhecimento ou nas instruções do sistema",
      },
      {
        id: "m2q11_b",
        label: "Se o nome do GPT é chamativo o suficiente",
      },
      {
        id: "m2q11_c",
        label:
          "Se o GPT tem funcionalidades suficientes para justificar seu preço",
      },
      { id: "m2q11_d", label: "Se o logotipo do GPT parece profissional" },
    ],
    correctAnswer: "m2q11_a",
    topic: "Privacidade em GPT",
    difficulty: "médio",
    feedback:
      "Antes de publicar um GPT, verifique se ele não contém dados confidenciais (segredos comerciais, dados de clientes, estratégias internas). O que funciona internamente nem sempre é seguro para publicação pública. Revise o tópico de privacidade em GPTs.",
  },
  {
    id: "m2q12",
    question:
      "Você quer criar um fluxo automatizado em que o ChatGPT analise comentários de redes sociais, identifique reclamações urgentes e envie notificações à equipe de suporte. Qual combinação de ferramentas você precisa?",
    options: [
      {
        id: "m2q12_a",
        label:
          "Um GPT personalizado com Actions (API) conectado à rede social + webhook para o sistema de tickets da equipe",
      },
      {
        id: "m2q12_b",
        label: "ChatGPT padrão com Pesquisa Web ativada",
      },
      {
        id: "m2q12_c",
        label: "DALL-E 3 para gerar respostas visuais automáticas",
      },
      {
        id: "m2q12_d",
        label: "Canvas para editar manualmente cada comentário",
      },
    ],
    correctAnswer: "m2q12_a",
    topic: "Automação",
    difficulty: "difícil",
    feedback:
      "A automação com IA exige: um GPT preparado para a tarefa + Actions (API) para se conectar a serviços externos + um webhook ou API para disparar ações. Revise o tópico de automação e Function Calling no módulo.",
  },
];
