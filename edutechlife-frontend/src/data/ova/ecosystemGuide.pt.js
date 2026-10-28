export const learningObjectives = [
  "Entender o que o ChatGPT faz e como constrói uma resposta",
  "Distinguir as formas de responder: rápida ou com mais raciocínio",
  "Escolher a ferramenta certa para cada tarefa (pesquisa, arquivos, Canvas, Projetos)",
  "Pedir uma tarefa do dia a dia e revisar a resposta antes de usá-la",
];

export const furtherReading = [
  {
    title: "Central de Ajuda da OpenAI",
    url: "https://help.openai.com/",
    description:
      "Documentação oficial: funções, planos e disponibilidade conforme a sua conta.",
  },
];

export const infographicData = {
  header: {
    title: "A Planta Mestra: seu mapa do ChatGPT",
    subtitle: "Do seu primeiro pedido a uma resposta útil",
  },
  sections: [
    {
      id: "evolution",
      title: "Como o ChatGPT responde",
      icon: "TrendingUp",
      content:
        "O ChatGPT é um assistente de conversa: você lê a resposta, ajusta com a sua próxima mensagem e confere antes de usar.",
      details: [
        {
          title: "1 · Seu pedido",
          date: "Passo 1",
          text: "Você escreve o que precisa, para quem e em que formato.",
          extendedText:
            "Quanto mais claro o pedido, menos ele adivinha. Exemplo: “Me ajude a escrever uma mensagem de WhatsApp para confirmar uma consulta, tom amável, no máximo 3 linhas”.",
        },
        {
          title: "2 · A resposta dele",
          date: "Passo 2",
          text: "O ChatGPT constrói a resposta peça por peça.",
          extendedText:
            "Ele não busca uma resposta guardada: constrói a partir de padrões. Por isso pode soar muito seguro mesmo errando.",
        },
        {
          title: "3 · Sua revisão",
          date: "Passo 3",
          text: "Você ajusta e confere.",
          extendedText:
            "Peça mudanças pequenas (“deixe mais curto”) e confira datas, números e nomes antes de usar o resultado.",
        },
      ],
    },
    {
      id: "modes",
      title: "Formas de responder",
      icon: "Cpu",
      content:
        "Conforme a sua conta, o ChatGPT pode oferecer diferentes formas de responder. Os nomes e as opções mudam: confira o seletor da sua.",
      details: [
        {
          title: "Resposta rápida",
          text: "Para tarefas simples e diretas.",
          extendedText:
            "Ideal para resumir um e-mail, propor ideias, corrigir a redação ou traduzir. Prioriza a agilidade sobre a análise profunda.",
        },
        {
          title: "Resposta com mais raciocínio",
          text: "Para tarefas que exigem análise. Demora um pouco mais.",
          extendedText:
            "Útil quando há vários fatores: comparar opções, planejar uma viagem com restrições ou revisar um documento longo. É mais lenta, mas costuma ser mais cuidadosa.",
        },
      ],
    },
    {
      id: "tools",
      title: "A caixa de ferramentas",
      icon: "Wrench",
      content:
        "O ChatGPT é mais que um chat: traz ferramentas para pesquisar, ler seus arquivos, editar e guardar contexto. Quais você vê depende do seu plano.",
      details: [
        {
          title: "Pesquisa na web e arquivos",
          icon: "Search",
          text: "Dados recentes com fontes e leitura dos seus documentos.",
          extendedText:
            "Ative a pesquisa para preços, notícias ou normas vigentes e abra as fontes. Envie um PDF ou uma planilha para pedir um resumo ou uma tabela, e refaça uma linha à mão para conferir.",
        },
        {
          title: "Canvas",
          icon: "Layout",
          text: "Um painel ao lado do chat para editar um texto com você.",
          extendedText:
            "Em vez de gerar o texto todo de novo, você seleciona um parágrafo e pede “deixe mais formal”. Útil para documentos longos.",
        },
        {
          title: "Projetos e memória",
          icon: "Database",
          text: "Guardam instruções e arquivos de um trabalho.",
          extendedText:
            "Um Projeto reúne o contexto de um trabalho (tom, regras, arquivos) para não repeti-lo em cada chat. Revise a memória de vez em quando e apague o que você não quer que ela guarde.",
        },
      ],
    },
    {
      id: "automation",
      title: "Aplicativos e agentes, com a sua permissão",
      icon: "Share2",
      content:
        "O ChatGPT pode se conectar a outros aplicativos e fazer tarefas de vários passos, sempre com permissões que você aprova.",
      details: [
        {
          title: "Conectores",
          icon: "Zap",
          text: "Permissões para o ChatGPT usar seus aplicativos.",
          extendedText:
            "Um conector é uma permissão para o ChatGPT ler uma ferramenta sua, como a agenda ou os documentos. Leia quais permissões ele pede, conceda só as necessárias e desconecte o que não usa mais.",
        },
        {
          title: "Agente",
          icon: "Settings",
          text: "Tarefas de vários passos com a sua supervisão.",
          extendedText:
            "Você dá uma meta (por exemplo, comparar três opções e montar uma tabela). Revisa o plano, aprova as ações importantes e abre as fontes antes de usar o resultado.",
        },
        {
          title: "Compartilhar com cuidado",
          icon: "MessageSquare",
          text: "Antes de compartilhar um chat, veja o que ele contém.",
          extendedText:
            "Um link compartilhado mostra toda a conversa. Não inclua dados pessoais de terceiros, de menores nem documentos confidenciais.",
        },
      ],
    },
  ],
  quiz: {
    questions: [
      {
        question: "Quando vale a pena a opção com mais raciocínio?",
        options: [
          {
            text: "Para tarefas simples, como corrigir uma frase",
            score: 1,
            feedback:
              "Para isso basta a resposta rápida: o raciocínio extra demora mais e não acrescenta nada.",
          },
          {
            text: "Quando há vários fatores para comparar, como planejar uma viagem com restrições",
            score: 3,
            feedback:
              "Correto! Essa opção costuma ser mais cuidadosa em tarefas com vários fatores.",
          },
          {
            text: "Sempre, porque é melhor em tudo",
            score: 1,
            feedback:
              "Nem sempre: é mais lenta e tarefas simples não precisam dela.",
          },
        ],
      },
      {
        question: "Qual a função do Canvas no ChatGPT?",
        options: [
          {
            text: "Gera imagens a partir de texto",
            score: 1,
            feedback:
              "A criação de imagens é outra ferramenta. O Canvas é um editor ao lado do chat.",
          },
          {
            text: "Conecta o ChatGPT às redes sociais",
            score: 1,
            feedback: "Não: o Canvas não tem relação com redes sociais.",
          },
          {
            text: "Permite editar um documento junto ao chat, em um painel lateral",
            score: 3,
            feedback:
              "Exato! Você pode selecionar um parágrafo e pedir uma mudança sem gerar tudo de novo.",
          },
        ],
      },
      {
        question: "Como um professor se beneficiaria dos Projetos no ChatGPT?",
        options: [
          {
            text: "Pode guardar o plano de estudos e os guias do curso para não repetir o contexto em cada chat",
            score: 3,
            feedback:
              "Correto! Um Projeto reúne as instruções e os arquivos de um trabalho.",
          },
          {
            text: "Cria provas automaticamente sem revisão",
            score: 1,
            feedback:
              "A IA ajuda a preparar provas, mas elas sempre precisam de revisão humana.",
          },
          {
            text: "Substitui o professor nas aulas",
            score: 1,
            feedback:
              "O ChatGPT apoia, não substitui: o critério do professor é insubstituível.",
          },
        ],
      },
      {
        question: "Antes de aprovar um conector, o que você faz?",
        options: [
          {
            text: "Leio quais permissões ele pede e concedo só as necessárias",
            score: 3,
            feedback:
              "Correto! As permissões são suas: dê o mínimo e desconecte o que não usa mais.",
          },
          {
            text: "Aprovo tudo para não repetir a etapa",
            score: 1,
            feedback:
              "Conceder mais permissões do que o necessário aumenta o risco.",
          },
          {
            text: "Compartilho minha senha no chat para ele acessar",
            score: 1,
            feedback: "Nunca dê senhas no chat.",
          },
        ],
      },
      {
        question: "Qual a melhor forma de começar com o ChatGPT?",
        options: [
          {
            text: "Testar todas as funções no primeiro dia",
            score: 1,
            feedback: "É cansativo e você não saberá o que ajudou.",
          },
          {
            text: "Começar com uma tarefa do dia a dia, revisar a resposta e melhorá-la",
            score: 3,
            feedback:
              "Exato! Uma tarefa concreta, uma revisão e um ajuste: assim se aprende.",
          },
          {
            text: "Esperar a tecnologia amadurecer",
            score: 1,
            feedback:
              "Ela já serve para muitas tarefas cotidianas; começar agora permite aprender aos poucos.",
          },
        ],
      },
    ],
  },
};
