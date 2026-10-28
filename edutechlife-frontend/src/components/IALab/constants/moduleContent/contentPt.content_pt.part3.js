export const CONTENT_PT_PART3 = {
  3: {
    objective:
      "Ajuste sua lupa digital: investigue com o Gemini, revise cada pista e confira cada dado na fonte antes de usá-lo.",
    learningPoints: [
      {
        text: "Analisar texto, imagem e código como um único corpo de evidências",
        icon: "fa-cubes",
      },
      {
        text: "Pedir respostas com fontes atuais da web e abri-las para conferir",
        icon: "fa-signal",
      },
      {
        text: "Cavar até a verdade: investigações passo a passo, com fontes que você pode revisar",
        icon: "fa-search",
      },
      {
        text: "Separar os fatos das alucinações: conferir cada dado na fonte",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "O Detetive de Dados: Investigue e Verifique com o Gemini",
      description:
        "Bem-vindo à academia de detetives digitais. Aqui você aprenderá a cruzar pistas em tempo real, analisar qualquer tipo de evidência (texto, imagem, áudio, vídeo) e conferir cada dado na fonte antes de usá-lo.",
      mission:
        "Sua missão: investigar como um detetive de dados. Use o Google Gemini para cruzar pistas, verificar cada fonte e apresentar um relatório breve em que cada dado-chave tenha sua fonte. Cada lição o aproxima do seu distintivo de detetive digital.",
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
          "Imagine uma lupa que não só vê imagens, mas também lê documentos, escuta áudios e analisa vídeos — tudo ao mesmo tempo. Esse é o Gemini. Nesta lição, você aprenderá a pedir que ele analise uma foto, um documento ou um áudio na mesma conversa e a conferir o que ele entendeu. Use-o também como tutor: que ele explique, faça perguntas e coloque você para praticar. Diferente de um buscador, que dá uma lista de links, o Gemini redige uma resposta à sua pergunta; por isso você a confere. Com um áudio, peça a transcrição e compare com a gravação as frases que vai citar. Mais dois recursos do app (conforme seu plano; veja na sua conta): o Canvas abre um espaço ao lado do chat onde você edita com o Gemini um documento ou um código, parte por parte. Os Gems são assistentes personalizados que guardam suas instruções para reutilizá-las; o Google está convertendo os Gems em «skills» (instruções reutilizáveis), então talvez você os veja com esse nome.",
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
          "De que adianta uma lupa se você não pode verificar o que vê? O grounding (conectar a IA a fontes verificáveis: a web em tempo real e seus próprios arquivos do Workspace) faz o Gemini responder com dados vivos, não com conhecimento congelado. Aprenda a combinar imagens, documentos e dados em tempo real para obter respostas que não são apenas inteligentes — são verificáveis. Peça também que explique uma fórmula do Sheets passo a passo e teste-a com um caso cujo resultado você conhece. Antes de enviar dados internos, revise a política da sua organização e anonimize o confidencial; declare quais partes vêm do Gemini.",
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
          "Para perguntas que precisam de muitas fontes, o Gemini tem o Deep Research: ele pesquisa em muitas páginas e entrega um relatório com links. Você aprenderá a encomendá-lo, a revisar as fontes uma por uma e a transformar o resultado em um relatório breve que você possa defender. Antes de começar, o Deep Research mostra o plano de pesquisa: revise-o e ajuste-o. Se ele não aparecer na sua conta, faça o mesmo pedido em uma conversa normal e verifique cada fonte. Uma alucinação é um dado que a IA inventa com segurança: marque cada afirmação sem respaldo e confira. Apresente as projeções como estimativas, com a fonte em que se baseiam. Para tarefas de várias etapas existe o agente do Gemini (no app pode aparecer como «Task» ou «Tarefa», conforme o idioma): ele mostra os passos que segue, pede confirmação antes de ações sensíveis como enviar uma mensagem ou fazer uma compra, e você pode interrompê-lo quando quiser. É para maiores de 18 anos com um plano pago (conforme seu plano; veja na sua conta).",
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
          "O Gemini processa texto, imagens, áudio e vídeo como um único idioma. Uma só conversa para revisar vários tipos de evidência.",
        achievements: [
          {
            icon: "fa-check",
            text: "Compreender como o Gemini processa texto, imagens, áudio e vídeo como um único idioma",
          },
          {
            icon: "fa-check",
            text: "Configurar seu arsenal: no app, o seletor oferece seleção automática de modelo, Flash-Lite, Flash e Pro (conforme seu plano; veja na sua conta) e níveis de raciocínio Baixo, Médio e Alto (por padrão, Baixo). Aumente-o para problemas de vários passos",
          },
          {
            icon: "fa-check",
            text: "Decidir quando o Gemini é a melhor opção e quando é outra ferramenta, conforme a tarefa",
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
            "✅ Detetive: Enviar a foto de um gráfico, pedir que descreva a tendência, buscar na web um dado atual que a explique (com o link) e pedir um resumo de 5 linhas que você confere antes de compartilhar",
        },
      },
      2: {
        objective: "🔬 Raciocínio Multimodal",
        objectiveDesc:
          "Processe vários tipos de evidência ao mesmo tempo: texto, imagens, áudio e código. Quatro detetives em uma única mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Pedir ao Gemini que descreva uma imagem ou um documento e conferir o que ele entendeu",
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
            text: "Confiar no grounding sem verificar — até a melhor fonte pode errar ou estar desatualizada: confira a data",
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
            "✅ Detetive: 'Esta é a foto da minha conta de luz. Me dê numa tabela o total, a data de vencimento e o consumo do mês. Se algum dado não estiver legível, me avise em vez de adivinhar.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "Para casos complexos: investigações profundas com fontes verificáveis e verificação de fontes. Confirme cada dado-chave com uma fonte independente. Antes de citar um autor, confira quem ele é e se o dado está no texto dele.",
        achievements: [
          {
            icon: "fa-check",
            text: "Encomendar uma pesquisa ao Deep Research e revisar o plano antes que ela comece",
          },
          {
            icon: "fa-check",
            text: "Conferir os dados-chave abrindo a fonte — sua rede de segurança contra a desinformação",
          },
          {
            icon: "fa-check",
            text: "Redigir um relatório breve em que cada dado-chave leva o seu link",
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
            text: "Não contrastar com fontes primárias (quem produziu o dado, não quem o comenta) — pesquisa de qualidade é feita com documentos originais",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: 'Quais são as tendências de IA em 2026?' — uma pergunta que qualquer um pode responder com o Google",
          strong:
            "✅ Detetive: 'Pesquise 3 usos da IA em escolas da Colômbia em 2026. Para cada um: o que é, um exemplo real com a fonte e um risco. Termine com uma tabela e marque o que você não conseguiu confirmar.'",
        },
      },
    },
  },
};
