export const CONTENT_PT_PART5 = {
  5: {
    objective:
      "Dirija o Claude como um maestro: delegue trabalho real, crie documentos e peças e supervisione cada resultado com critério humano.",
    learningPoints: [
      {
        text: "Escrever instruções que o Claude entende de primeira",
        icon: "fa-comments",
      },
      {
        text: "Criar documentos, apresentações e peças interativas com Artifacts",
        icon: "fa-pen-nib",
      },
      {
        text: "Delegar trabalho recorrente com Projetos, conectores e Skills",
        icon: "fa-diagram-project",
      },
      {
        text: "Supervisionar cada resultado: verificar dados e proteger informações",
        icon: "fa-shield-halved",
      },
    ],
    overviewData: {
      title: "O Maestro: Claude — Delegue com Critério",
      description:
        "O Claude já não é só um chat: cria documentos e apresentações, conecta-se às suas ferramentas de trabalho, lembra contexto e pode executar tarefas de várias etapas. Este módulo ensina a dirigi-lo: o que pedir, como revisar o que ele entrega e o que você nunca deve delegar.",
      mission:
        "Sua missão como maestro: complete cada lição e delegue uma tarefa real do seu trabalho. Um bom maestro não toca todos os instrumentos; define a partitura, escuta e corrige. Dirija com critério!",
      topics: [
        {
          title: "Conheça o Claude: a IA que trabalha com você",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
          outcome:
            "Escrever um primeiro pedido completo para o Claude, com objetivo, público, formato e limites.",
        },
        {
          title: "Crie com o Claude: Artifacts, documentos e apresentações",
          icon: "fa-pen-nib",
          resources: 3,
          duration: "25 min",
          outcome:
            "Pedir ao Claude um documento ou uma apresentação, ajustá-lo com mudanças pequenas e conferir os dados antes de compartilhar.",
        },
        {
          title: "Delegue com o Claude: Projetos, conectores e Skills",
          icon: "fa-diagram-project",
          resources: 3,
          duration: "30 min",
          outcome:
            "Decidir o que delegar ao Claude, o que você revisa e o que nunca delega, e montar um Projeto para o trabalho recorrente.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Conheça o Claude: a IA que trabalha com você",
        description: "Como pensar e pedir como um maestro",
        detailedDescription:
          "Antes de dar instruções, conheça o instrumento. O que é o Claude, em que se diferencia de um buscador, como escrever um pedido com objetivo, público e formato, como funciona a memória e quando escolher um modelo mais rápido ou um mais capaz.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-comments",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#D97757",
      },
      {
        id: 2,
        title: "Crie com o Claude: Artifacts, documentos e apresentações",
        description:
          "De uma ideia a um documento ou peça pronta para compartilhar",
        detailedDescription:
          "Os Artifacts são peças que você vê e edita ao lado da conversa: documentos, gráficos, apresentações e pequenos aplicativos. Aprenda a descrever o resultado, iterar com ajustes pequenos, comparar versões e revisar antes de compartilhar.",
        duration: "25 min",
        format: "Lab",
        icon: "fa-pen-nib",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#E8A33D",
      },
      {
        id: 3,
        title: "Delegue com o Claude: Projetos, conectores e Skills",
        description: "Trabalho recorrente sem perder o controle",
        detailedDescription:
          "Um Projeto guarda o contexto de um trabalho; os conectores dão acesso às suas ferramentas com permissões que você aprova; uma Skill reutiliza um procedimento; as tarefas programadas automatizam o recorrente. Delegar é definir objetivo, limites e revisão: a decisão final continua sendo sua.",
        duration: "30 min",
        format: "Video",
        icon: "fa-diagram-project",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#0097A7",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎼 Conheça seu instrumento",
        objectiveDesc:
          "Entenda o que é o Claude, como ele mantém o contexto e como pedir o que você precisa de primeira.",
        achievements: [
          {
            icon: "fa-check",
            text: "Escrever um pedido com objetivo, público, formato e tom",
          },
          {
            icon: "fa-check",
            text: "Controlar o que o Claude lembra entre conversas",
          },
          {
            icon: "fa-check",
            text: "Escolher o modelo certo para cada tipo de tarefa",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Pedir sem contexto e esperar que ele adivinhe o resultado",
          },
          {
            icon: "fa-times",
            text: "Usar o modelo mais potente para tarefas simples: gasta sem ganhar",
          },
          {
            icon: "fa-times",
            text: "Dar por certo dados recentes sem verificar em uma fonte atual",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Vago: 'Escreva uma proposta para um cliente'. Resultado genérico, sem público nem tom.",
          strong:
            "✅ Claro: 'Proposta de 2 páginas para a reitoria de um colégio em Manizales, tom formal e cordial, com objetivo, plano de 3 meses e preço em pesos'. Útil de primeira.",
        },
      },
      2: {
        objective: "🖋️ Crie com Artifacts",
        objectiveDesc:
          "Transforme uma ideia em documento, apresentação ou peça interativa, e revise antes de compartilhar.",
        achievements: [
          {
            icon: "fa-check",
            text: "Descrever o resultado final antes de pedir o conteúdo",
          },
          {
            icon: "fa-check",
            text: "Iterar com ajustes pequenos em vez de refazer tudo",
          },
          {
            icon: "fa-check",
            text: "Verificar números, nomes e datas antes de apresentar",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceitar uma mudança sem comparar com a sua versão",
          },
          {
            icon: "fa-times",
            text: "Apresentar um número sem revisar a origem",
          },
          {
            icon: "fa-times",
            text: "Compartilhar uma peça interativa sem testá-la",
          },
        ],
        example: {
          label: "Exemplo de iteração",
          weak: "❌ Um pedido só: 'Faça uma apresentação da empresa'. Dez slides genéricos.",
          strong:
            "✅ Iterando: primeiro o roteiro de 6 slides, depois a mensagem de cada um, depois os gráficos com números verificados. Três passos, um resultado pronto para o conselho.",
        },
      },
      3: {
        objective: "🎛️ Delegue com critério",
        objectiveDesc:
          "Use Projetos, conectores e Skills para que o trabalho recorrente avance sem perder o controle das decisões.",
        achievements: [
          {
            icon: "fa-check",
            text: "Criar um Projeto com instruções e arquivos de referência",
          },
          {
            icon: "fa-check",
            text: "Conectar uma ferramenta revisando as permissões que concede",
          },
          {
            icon: "fa-check",
            text: "Transformar um procedimento repetido em uma Skill reutilizável",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Dar senhas no chat ou aceitar permissões sem lê-las",
          },
          {
            icon: "fa-times",
            text: "Deixar uma tarefa de várias etapas agir sem confirmar ações importantes",
          },
          {
            icon: "fa-times",
            text: "Subir dados pessoais de terceiros sem critério nem política clara",
          },
        ],
        example: {
          label: "O maestro vs. o espectador",
          weak: "❌ Espectador: Conectou o e-mail, pediu 'responda a tudo' e enviou respostas sem ler. Um cliente recebeu um número errado.",
          strong:
            "✅ Maestro: Definiu o que responder, revisou cada rascunho e usou uma tarefa programada para o resumo semanal. Ele decide o que é enviado.",
        },
      },
    },
  },
};
