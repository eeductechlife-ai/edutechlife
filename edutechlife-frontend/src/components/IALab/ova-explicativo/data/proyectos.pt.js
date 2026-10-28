export default {
  badge: "Módulo 2 · Explicação",
  title: "A Oficina de Projetos",
  subtitle:
    "Projetos, instruções, plugins e agentes: o que é cada um e quando usar",
  intro:
    "Quando você repete o mesmo tipo de trabalho, não convém começar do zero cada vez. Nesta lição você vai aprender os termos-chave para organizar esse trabalho com o ChatGPT, o que cada ferramenta faz e como conferir o resultado antes de usar.",
  objectives: [
    "Explicar o que é um Projeto e o que ele guarda",
    "Definir instruções, plugin e agente, e como se diferenciam",
    "Escrever instruções claras com papel, contexto e limites",
    "Reconhecer o erro de guardar dados sensíveis em um Projeto",
  ],
  sections: [
    {
      title: "1. O que é um Projeto?",
      explain: [
        "Um Projeto é um espaço que agrupa um trabalho: guarda as suas instruções e arquivos, e cada chat dentro do Projeto usa esse contexto sem que você precise colá-lo de novo.",
        "Pense em uma pasta de trabalho com uma folha de instruções na capa: tudo o que você abre lá dentro segue as mesmas regras.",
      ],
      terms: [
        {
          term: "Projeto",
          def: "Espaço que agrupa chats, arquivos e instruções de um mesmo trabalho.",
        },
        {
          term: "Contexto",
          def: "O que a IA sabe sobre a sua situação antes de responder: a tarefa, o público e as regras.",
        },
      ],
      how: [
        "Você cria o Projeto e dá a ele um nome que descreva o trabalho.",
        "Escreve as instruções e envia os arquivos de que o trabalho precisa.",
        "Cada nova conversa dentro do Projeto já traz esse contexto.",
      ],
      example:
        "Um assessor de propostas cria o Projeto «Propostas de clientes» com o seu tom, os seus preços e os seus modelos.",
      mistake:
        "Enviar para um Projeto dados pessoais ou confidenciais de pessoas que não autorizaram o uso.",
    },
    {
      title: "2. Instruções: a base do Projeto",
      explain: [
        "As instruções são o texto que descreve como a IA deve trabalhar: qual papel ela tem, para quem escreve, com que tom e quais limites respeita.",
        "Boas instruções são específicas. «Responda bem» não diz nada; «Você é assessor de uma escola, escreve para famílias com frases curtas e nunca inclui nomes de estudantes» orienta o resultado.",
      ],
      terms: [
        {
          term: "Instruções",
          def: "Regras escritas que orientam cada resposta do Projeto.",
        },
        {
          term: "Papel",
          def: "O lugar que a IA assume, por exemplo «assessor» ou «editor».",
        },
        {
          term: "Limite",
          def: "Algo que a IA não deve fazer, como inventar números ou pedir dados pessoais.",
        },
      ],
      how: [
        "Descreva o papel: quem é a IA neste trabalho.",
        "Explique o contexto: para quem é o resultado e para que serve.",
        "Defina o formato e os limites: extensão, tom e o que nunca deve fazer.",
      ],
      example:
        "«Você escreve avisos para famílias. Use tom próximo, no máximo três parágrafos, e nunca inclua nomes de estudantes.»",
      mistake:
        "Instruções vagas ou muito longas que se contradizem. Revise-as quando o resultado não for o esperado.",
    },
    {
      title: "3. Plugin, agente e GPT: o que os diferencia",
      explain: [
        "Um plugin é um complemento que conecta a IA a uma ferramenta ou serviço externo para uma tarefa repetida. Reúne regras, arquivos e acesso a aplicativos.",
        "Um agente executa várias etapas para chegar a um objetivo, por exemplo buscar, comparar e montar uma tabela. Você revisa o plano e aprova as ações importantes.",
        "Um GPT personalizado é uma versão do ChatGPT com instruções e arquivos próprios. A OpenAI programou a retirada dos GPT personalizados para 11 de dezembro de 2026, e os plugins são a substituição prevista. Confira na sua conta o que você tem disponível.",
      ],
      terms: [
        {
          term: "Plugin",
          def: "Complemento que conecta a IA a uma ferramenta ou serviço para uma tarefa repetida.",
        },
        {
          term: "Agente",
          def: "Assistente que executa várias etapas sob a sua supervisão.",
        },
        {
          term: "API",
          def: "Forma como dois programas trocam dados: um pede e o outro responde.",
        },
        {
          term: "Webhook",
          def: "Aviso automático que um serviço envia a outro quando algo acontece, por exemplo uma nova reclamação.",
        },
      ],
      how: [
        "Um Projeto guarda contexto e arquivos do seu trabalho.",
        "Um plugin faz uma tarefa ligada a uma ferramenta externa.",
        "Um agente encadeia etapas: você aprova as importantes antes de seguir.",
      ],
      example:
        "Para responder perguntas frequentes de uma marca, um plugin consulta o catálogo; para comparar cinco fornecedores e montar uma tabela, um agente executa as etapas.",
      mistake:
        "Achar que o agente erra menos porque trabalhou vários minutos. Um erro no início se propaga para todo o resultado.",
    },
    {
      title: "4. Testar antes de usar",
      explain: [
        "Um resultado pode parecer seguro e estar errado. Antes de usá-lo, separe o que vem dos seus arquivos do que a IA supôs.",
        "Testar é dar a ela um caso real, revisar os dados que não aparecem nos seus arquivos e confirmá-los na fonte original.",
      ],
      terms: [
        {
          term: "Conferir",
          def: "Comparar um dado com uma fonte que você possa abrir.",
        },
        {
          term: "Dado inventado",
          def: "Dado que a IA produz e que não existe nem nos seus arquivos nem em uma fonte.",
        },
      ],
      how: [
        "Leia a resposta e marque os dados concretos: datas, números e nomes.",
        "Procure cada um nos seus arquivos. Se não estiver, confirme na fonte original.",
        "Se não conseguir confirmar, não use.",
      ],
      example:
        "Um aviso diz «a reunião será na quinta-feira, dia 5, às 19h». Se a data não estiver nos seus arquivos nem no calendário oficial, confirme antes de enviar.",
      mistake:
        "Enviar o resultado porque o Projeto «já revisou». O Projeto só conhece o que está nas instruções e nos arquivos.",
    },
  ],
  summary: [
    "Um Projeto agrupa chats, arquivos e instruções de um mesmo trabalho.",
    "As instruções dizem papel, contexto, formato e limites; quanto mais específicas, melhor o resultado.",
    "Um plugin conecta uma ferramenta; um agente executa várias etapas sob a sua aprovação.",
    "Os GPT personalizados são retirados em 11 de dezembro de 2026; os plugins são a substituição prevista.",
    "Antes de usar um resultado, confira os dados concretos em uma fonte que você possa abrir.",
  ],
  check: [
    {
      q: "O que um Projeto guarda?",
      options: [
        "Apenas o histórico de cobrança da sua conta.",
        "As instruções e os arquivos de um mesmo trabalho.",
        "As respostas de todos os usuários da plataforma.",
      ],
      correct: 1,
      feedback:
        "Um Projeto agrupa instruções, arquivos e chats de um mesmo trabalho.",
    },
    {
      q: "Você precisa que a IA consulte um catálogo que muda todo dia. O que é mais adequado?",
      options: [
        "Escrever os preços de hoje nas instruções e nunca mais mexer.",
        "Usar um plugin que consulte a fonte atualizada e conferir a data do dado.",
        "Pedir que ela adivinhe os preços de hoje.",
      ],
      correct: 1,
      feedback:
        "Um dado que muda precisa vir de uma fonte atualizada, não de uma instrução fixa nem de um palpite.",
    },
    {
      q: "Um agente entrega uma tabela de fornecedores. O que você faz antes de enviar?",
      options: [
        "Envio, porque o agente trabalhou vários minutos.",
        "Reviso as fontes e confirmo os números que vou usar.",
        "Apago as fontes para a tabela ficar limpa.",
      ],
      correct: 1,
      feedback:
        "O agente economiza etapas, mas você confere os dados antes de usá-los.",
    },
  ],
};
