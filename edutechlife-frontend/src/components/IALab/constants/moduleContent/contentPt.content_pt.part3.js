export const CONTENT_PT_PART3 = {
  3: {
    objective:
      "Ajuste sua lupa digital: investigue a fundo, verifique cada pista e analise informações com a precisão de um detetive profissional.",
    learningPoints: [
      {
        text: "Analisar texto, imagem e código como um único corpo de evidências",
        icon: "fa-cubes",
      },
      {
        text: "Obter pistas frescas do mundo real na hora",
        icon: "fa-signal",
      },
      {
        text: "Cavar até a verdade: investigações que nenhum outro detetive faz",
        icon: "fa-search",
      },
      {
        text: "Separar os fatos das alucinações: verificação forense com IA",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "O Detetive de Dados: Investigação de Elite com Gemini",
      description:
        "Bem-vindo à academia de detetives digitais. Aqui você aprenderá a cruzar pistas em tempo real, analisar qualquer tipo de evidência (texto, imagem, áudio, vídeo) e verificar cada fato com a precisão de um perito forense de dados.",
      mission:
        "Sua missão: tornar-se o melhor detetive de dados do mundo. Domine o Google Gemini para cruzar pistas, verificar cada fonte e apresentar relatórios que qualquer diretor-executivo assinaria. Cada lição o aproxima do seu distintivo de detetive digital.",
      topics: [
        {
          title: "O Despertar do Detetive Multimodal",
          icon: "fa-google",
          resources: 3,
          duration: "20 min",
          outcome:
            "Pedir ao Gemini que leia uma foto, um documento ou um áudio e conferir o que ele entendeu.",
        },
        {
          title: "Grounding: Quando a Evidência Toca o Chão",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
          outcome:
            "Distinguir uma resposta com fontes de uma que só parece boa, e abrir as fontes para conferir.",
        },
        {
          title: "Deep Research: A Caixa de Ferramentas Forenses",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
          outcome:
            "Encomendar uma pesquisa ao Gemini e revisar o relatório fonte por fonte.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "O Despertar do Detetive Multimodal",
        description:
          "Gemini: sua lupa versátil que vê, lê e escuta ao mesmo tempo",
        detailedDescription:
          "Imagine uma lupa que não só vê imagens, mas também lê documentos, escuta áudios e analisa vídeos — tudo ao mesmo tempo. Esse é o Gemini. Nesta lição, você aprenderá a usar esse superpoder multimodal para analisar, criar e resolver casos que antes exigiam 4 ferramentas diferentes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Grounding: Quando a Evidência Toca o Chão",
        description:
          "Conecte sua lupa ao solo firme: dados vivos do mundo real",
        detailedDescription:
          "De que adianta uma lupa se você não pode verificar o que vê? O grounding conecta o Gemini a informações vivas da internet. Aprenda a combinar imagens, documentos e dados em tempo real para obter respostas que não são apenas inteligentes — são verificáveis.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research: A Caixa de Ferramentas Forenses",
        description:
          "Cave até encontrar a verdade com ferramentas de pesquisa profunda",
        detailedDescription:
          "Os casos mais complexos exigem as ferramentas mais poderosas. Domine a pesquisa profunda com IA: Deep Research para explorar temas em sua totalidade, verificação de fontes para verificar cada fonte e geração de relatórios técnicos que qualquer especialista assinaria.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Ative sua Lupa Multimodal",
        objectiveDesc:
          "O Gemini processa texto, imagens, áudio e vídeo como um único idioma. Sua nova arma secreta de investigação.",
        achievements: [
          {
            icon: "fa-check",
            text: "Compreender como o Gemini processa texto, imagens, áudio e vídeo como um único idioma",
          },
          {
            icon: "fa-check",
            text: "Configurar seu arsenal: Gemini Advanced, Google AI Studio e todas as ferramentas do detetive",
          },
          {
            icon: "fa-check",
            text: "Saber exatamente quando usar Gemini vs. outros modelos — a ferramenta certa para cada caso",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Tratar o Gemini como um chatbot comum — é como usar um bisturi para cortar pão",
          },
          {
            icon: "fa-times",
            text: "Ignorar sua capacidade de análise visual — a evidência mais rica costuma estar nas imagens",
          },
          {
            icon: "fa-times",
            text: "Não usar o grounding — é como investigar com os olhos fechados",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: Perguntar 'O que é o Gemini?' — como um turista perguntando as horas",
          strong:
            "✅ Detetive: Enviar um gráfico financeiro, pedir análise de tendências com correlação de dados históricos, cruzar com pesquisa em tempo real de indicadores econômicos e receber um relatório executivo pronto para apresentar ao conselho de administração",
        },
      },
      2: {
        objective: "🔬 Raciocínio Multimodal",
        objectiveDesc:
          "Processe vários tipos de evidência ao mesmo tempo: texto, imagens, áudio e código. Quatro detetives em uma única mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analisar imagens e documentos como um perito forense digital",
          },
          {
            icon: "fa-check",
            text: "Usar grounding para obter dados frescos da internet — informação viva, não conhecimento congelado",
          },
          {
            icon: "fa-check",
            text: "Fundir texto, imagem, áudio e código em uma única análise coerente",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Enviar evidências borradas sem contexto — detetives trabalham com pistas claras",
          },
          {
            icon: "fa-times",
            text: "Confiar no grounding sem verificar — até a melhor fonte pode errar",
          },
          {
            icon: "fa-times",
            text: "Não dizer ao Gemini que tipo de análise você precisa — é como pedir a um perito 'olha isso'",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: 'Analise esta imagem' — sem contexto, sem instruções, sem direção",
          strong:
            "✅ Detetive: 'Analise este diagrama de arquitetura como se você fosse um auditor de sistemas. Identifique cada componente, trace o fluxo de dados, aponte vulnerabilidades de escalabilidade e compare com o padrão AWS 2024. Entregue um relatório executivo de 3 parágrafos com prioridades de ação.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "Para casos complexos: investigações profundas com fontes verificáveis e verificação de fontes.",
        achievements: [
          {
            icon: "fa-check",
            text: "Executar investigações profundas que cruzam dezenas de fontes automaticamente",
          },
          {
            icon: "fa-check",
            text: "Verificar cada fato na hora — sua rede de segurança contra a desinformação",
          },
          {
            icon: "fa-check",
            text: "Produzir relatórios de nível consultoria com referências verificáveis e citações exatas",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceitar fontes sem verificar — até o melhor detetive verifica duas vezes",
          },
          {
            icon: "fa-times",
            text: "Se contentar com a primeira resposta — a verdade costuma estar na segunda camada",
          },
          {
            icon: "fa-times",
            text: "Não contrastar com fontes primárias — pesquisa de qualidade é feita com documentos originais",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: 'Quais são as tendências de IA em 2026?' — uma pergunta que qualquer um pode responder com o Google",
          strong:
            "✅ Detetive: 'Realize uma investigação forense das 5 principais tendências de IA generativa em 2026. Para cada tendência: fonte primária verificada, dados quantitativos de adoção empresarial, 2 casos de uso reais com nomes de empresas, riscos identificados com nível de criticidade e projeção de 3 anos com fontes. Apresente como relatório executivo com links verificáveis para cada fonte.'",
        },
      },
    },
  },
};
