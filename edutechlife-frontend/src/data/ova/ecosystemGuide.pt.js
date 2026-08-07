export const learningObjectives = [
  "Compreender a evolução dos modelos GPT e suas capacidades",
  "Identificar os diferentes modos de operação do ChatGPT",
  "Analisar as ferramentas integradas do ecossistema ChatGPT",
  "Aplicar estratégias avançadas para otimizar o uso da IA",
];

export const furtherReading = [
  {
    title: "OpenAI Model Reference",
    url: "https://platform.openai.com/docs/models",
    description: "Documentação oficial de todos os modelos OpenAI.",
  },
  {
    title: "ChatGPT Ecosystem Evolution",
    url: "https://openai.com/blog/",
    description: "Blog oficial da OpenAI com anúncios de novos recursos.",
  },
];

export const infographicData = {
  header: {
    title: "Dominando o Ecossistema ChatGPT",
    subtitle: "Da Teoria à Ação Profissional",
  },
  sections: [
    {
      id: "evolution",
      title: "Evolução do Motor de IA (Modelos GPT)",
      icon: "TrendingUp",
      content:
        "O ChatGPT se tornou o aplicativo de crescimento mais rápido da história após o seu lançamento em novembro de 2022, alcançando 100 Milhões de Usuários em 2 meses.",
      details: [
        {
          title: "GPT-4o",
          date: "Maio 2024",
          text: "Multimodal omni (texto, imagem, áudio).",
          extendedText:
            "Este modelo quebrou as barreiras de latência. Permite interações de voz em tempo real sem os atrasos típicos, pode 'ver' através da câmera de um smartphone e analisar o ambiente instantaneamente, e processa áudio de forma nativa em vez de convertê-lo previamente em texto.",
        },
        {
          title: "GPT-5",
          date: "Agosto 2025",
          text: "Sistema otimizado, redução drástica das alucinações.",
          extendedText:
            "Um salto qualitativo rumo à confiabilidade empresarial. Foca em fluxos de trabalho orientados a agentes (Agentic Workflows), em que a IA pode interagir com mais segurança com bancos de dados externos e cometer significativamente menos erros lógicos ou inventar dados.",
        },
        {
          title: "GPT-5.5",
          date: "Abril 2026",
          text: "Raciocínio autônomo e planejamento passo a passo.",
          extendedText:
            "Representa o modelo mais inteligente da década. Pode receber um objetivo complexo (ex.: 'Crie uma campanha de marketing completa'), desdobrá-lo em tarefas pequenas, executar o código necessário, corrigir os próprios erros e usar múltiplas ferramentas web sem intervenção humana constante.",
        },
      ],
    },
    {
      id: "modes",
      title: "Modos de Operação",
      icon: "Cpu",
      content:
        "A IA adapta a sua capacidade de processamento e o tempo de resposta conforme a complexidade da tarefa.",
      details: [
        {
          title: "Modo Fast (Rápido)",
          text: "Respostas instantâneas para tarefas simples e diretas.",
          extendedText:
            "Ideal para a produtividade diária: resumir longas cadeias de e-mails, gerar ideias rápidas de conteúdo (brainstorming), redigir respostas para clientes ou corrigir a gramática de um texto em segundos. Prioriza a velocidade em vez da análise profunda.",
        },
        {
          title: "Modo Thinking (Profundo)",
          text: "Análises detalhadas e decisões estratégicas. Requer tempo de processamento.",
          extendedText:
            "A IA investe tempo em 'pensar' antes de escrever. É essencial para resolver bugs complexos de código, projetar arquiteturas de software, escrever ensaios acadêmicos analíticos ou modelar cenários financeiros em que um erro superficial seria custoso.",
        },
      ],
    },
    {
      id: "tools",
      title: "A Caixa de Ferramentas Integrada",
      icon: "Wrench",
      content:
        "O ChatGPT evoluiu de um simples chatbot para se tornar um ambiente de trabalho digital (Workspace) completo.",
      details: [
        {
          title: "Busca na Web e Intérprete de Código",
          text: "Acesso a dados ao vivo e execução de scripts em Python.",
          icon: "Search",
          extendedText:
            "Você pode enviar um arquivo Excel bruto e pedir para limpar os dados, fazer análises estatísticas (como regressões) e gerar gráficos interativos. A IA escreve o código Python em segundo plano, executa-o e entrega o resultado visual.",
        },
        {
          title: "Canvas: Edição Colaborativa",
          text: "Um ambiente de trabalho conjunto em uma janela lateral.",
          icon: "Layout",
          extendedText:
            "Em vez de regenerar um texto inteiro no chat, o Canvas abre um documento lateral. Você pode selecionar um único parágrafo e pedir 'deixe este parágrafo mais profissional', ou editar o código diretamente enquanto a IA revisa as suas alterações. Ideal para projetos longos.",
        },
        {
          title: "Memória e Projetos",
          text: "Lembra preferências e organiza contextos complexos em 'Projetos'.",
          icon: "Database",
          extendedText:
            "Se você configurar um 'Projeto' para a Edutechlife, pode enviar o manual da marca e as diretrizes. A partir daí, qualquer chat dentro desse projeto lembrará de usar as suas cores, o tom institucional e os formatos preferidos, sem ter que repetir tudo.",
        },
      ],
    },
    {
      id: "automation",
      title: "Conectividade e Automação",
      icon: "Share2",
      content:
        "O verdadeiro poder surge ao conectar a sua IA com o mundo exterior e com os seus aplicativos do dia a dia.",
      details: [
        {
          title: "Zapier",
          text: "Automações simples e intuitivas.",
          icon: "Zap",
          extendedText:
            "Excelente para iniciantes. Exemplo: 'Sempre que eu receber um e-mail rotulado como Fatura no Gmail, use a IA para extrair o valor e adicione-o automaticamente a uma linha no Google Sheets'.",
        },
        {
          title: "Make (Integromat)",
          text: "Fluxos complexos e potentes (1.000 operações/mês gratuitas).",
          icon: "Settings",
          extendedText:
            "Permite ramificações lógicas avançadas. Exemplo: 'Se entrar um lead pelo Facebook, analise a mensagem dele com IA. Se estiver irritado, notifique no Slack com urgência. Se for uma dúvida comum, envie um e-mail automático usando o manual da empresa'.",
        },
        {
          title: "Integração Nativa: Workspace e Slack",
          text: "Capacidade de atuar diretamente nas suas plataformas corporativas.",
          icon: "MessageSquare",
          extendedText:
            "A IA já não vive apenas no seu aplicativo. Você pode usar @ChatGPT no Slack para resumir uma thread de 50 mensagens dos seus colegas enquanto estava em uma reunião, economizando minutos vitais de leitura.",
        },
      ],
    },
  ],
  quiz: {
    questions: [
      {
        question: "Qual é a principal vantagem do Modo Thinking do ChatGPT?",
        options: [
          {
            text: "Respostas mais rápidas que o modo normal",
            score: 1,
            feedback:
              "O Modo Thinking prioriza profundidade, não velocidade. Ele é projetado para ser mais lento, porém mais rigoroso.",
          },
          {
            text: "Análises detalhadas e raciocínio passo a passo antes de responder",
            score: 3,
            feedback:
              "Correto! O Thinking investe tempo em raciocinar antes de responder, ideal para tarefas complexas.",
          },
          {
            text: "Consome menos recursos do servidor",
            score: 1,
            feedback:
              "Na verdade, consome mais recursos porque realiza um processamento mais profundo antes de responder.",
          },
        ],
      },
      {
        question: "Qual função o Canvas exerce no ChatGPT?",
        options: [
          {
            text: "Gera imagens a partir de texto",
            score: 1,
            feedback:
              "Isso quem faz é o DALL-E, não o Canvas. O Canvas é um editor colaborativo de texto e código.",
          },
          {
            text: "Permite editar documentos de forma colaborativa em uma janela lateral",
            score: 3,
            feedback:
              "Exato! O Canvas abre um documento lateral em que você pode editar e a IA revisa as alterações em tempo real.",
          },
          {
            text: "Conecta o ChatGPT às redes sociais",
            score: 1,
            feedback:
              "Não, o Canvas nada tem a ver com redes sociais. É um espaço de trabalho colaborativo.",
          },
        ],
      },
      {
        question:
          "Como um docente se beneficiaria ao usar a função de Projetos no ChatGPT?",
        options: [
          {
            text: "Pode enviar o plano de ensino e os guias do curso para que a IA lembre o contexto",
            score: 3,
            feedback:
              "Correto! Os Projetos permitem carregar documentos de referência que a IA usará em todos os chats.",
          },
          {
            text: "Cria provas automaticamente sem revisão",
            score: 1,
            feedback:
              "A IA pode ajudar a criar provas, mas elas sempre exigem revisão humana para garantir precisão.",
          },
          {
            text: "Substitui o docente em sessões ao vivo",
            score: 1,
            feedback:
              "O ChatGPT é uma ferramenta de apoio, não um substituto. O critério do docente é insubstituível.",
          },
        ],
      },
      {
        question:
          "Qual é a principal diferença entre o Zapier e o Make (Integromat)?",
        options: [
          {
            text: "O Make permite fluxos mais complexos com ramificações lógicas avançadas",
            score: 3,
            feedback:
              "Correto! O Make oferece ramificações lógicas (if/else) e transformações de dados mais potentes que o Zapier.",
          },
          {
            text: "O Zapier é mais caro que o Make",
            score: 1,
            feedback:
              "Não necessariamente. Ambos têm modelos de preço diferentes. O Make oferece 1.000 operações gratuitas por mês.",
          },
          {
            text: "O Make só funciona com o Google Workspace",
            score: 1,
            feedback:
              "O Make se integra a centenas de aplicativos, não apenas ao Google Workspace.",
          },
        ],
      },
      {
        question:
          "Qual é a forma mais eficiente de começar a usar IA generativa na sala de aula?",
        options: [
          {
            text: "Implementar a IA em todas as áreas de uma vez",
            score: 1,
            feedback:
              "Implementar tudo de uma vez pode ser avassalador. É melhor começar por uma área específica.",
          },
          {
            text: "Começar com uma tarefa específica (resumir, criar material) e ir expandindo",
            score: 3,
            feedback:
              "Exato! A melhor estratégia é começar com uma tarefa concreta, dominá-la e depois expandir gradualmente.",
          },
          {
            text: "Esperar a tecnologia amadurecer antes de usá-la",
            score: 1,
            feedback:
              "A IA já está madura o suficiente para muitas tarefas educacionais. Começar agora permite aprender progressivamente.",
          },
        ],
      },
    ],
  },
};

export const pricingSection = {
  title: "Planos do ChatGPT: Qual escolher de acordo com o seu perfil?",
  subtitle:
    "Cada plano é projetado para um tipo de usuário. Compare e escolha o que melhor se adapta às suas necessidades.",
  plans: [
    {
      name: "Gratuito",
      price: "/tmp/agent_c_work.sh",
      period: "/mês",
      description:
        "Ideal para iniciar no mundo da IA e explorar capacidades básicas.",
      features: [
        "Acesso ao GPT-4o mini",
        "Limite de mensagens reduzido",
        "Sem acesso a ferramentas avançadas",
        "Sem DALL-E nem navegação na web",
      ],
      color: "from-gray-400 to-gray-500",
      icon: "fa-rocket",
    },
    {
      name: "ChatGPT Plus",
      price: "0",
      period: "/mês",
      description:
        "Perfeito para estudantes e profissionais que usam IA diariamente.",
      features: [
        "Acesso completo ao GPT-4o",
        "Mensagens ilimitadas",
        "Acesso a DALL-E, Browse e Análise de Dados",
        "Criação de GPTs personalizados",
        "Limite reduzido de voz e vídeo",
      ],
      popular: true,
      color: "from-corporate to-petroleum",
      icon: "fa-star",
    },
    {
      name: "ChatGPT Pro",
      price: "00",
      period: "/mês",
      description:
        "Para pesquisadores e profissionais que precisam de capacidade de processamento ilimitada.",
      features: [
        "Tudo do Plus, sem limites",
        "Acesso ilimitado a GPT-4o, o1 e o1-pro",
        "Modo de voz e vídeo avançado",
        "Prioridade em novos recursos",
        "Suporte prioritário",
      ],
      color: "from-amber-500 to-orange-600",
      icon: "fa-crown",
    },
  ],
};
