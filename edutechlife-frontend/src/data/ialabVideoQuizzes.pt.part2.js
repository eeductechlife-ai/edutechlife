export const PT_PART2 = {
  "claude-video-proyectos-1": [
    {
      q: "Para que serve um Projeto?",
      options: [
        "Para guardar instruções e arquivos do trabalho",
        "Para subir arquivos sem nenhum limite de tamanho",
        "Para substituir a memória do Claude",
      ],
      correct: 0,
      feedback: "Um Projeto reúne o contexto de um trabalho específico.",
    },
    {
      q: "O que revisar antes de conectar uma ferramenta?",
      options: [
        "Só se tem um logo bonito",
        "Que permissões ela pede",
        "Nada: é sempre seguro",
      ],
      correct: 1,
      feedback:
        "Os conectores funcionam com permissões que você aprova. Revise-as antes.",
    },
    {
      q: "O que pode ser uma Skill?",
      options: [
        "Um processo que se repete",
        "Uma senha de backup",
        "Um modelo diferente do Claude",
      ],
      correct: 0,
      feedback:
        "Uma Skill transforma um procedimento repetido em algo reutilizável.",
    },
  ],
  "herramientas-video-1": [
    {
      q: "O que você faz com um número da análise de dados?",
      options: [
        "Uso direto, é um cálculo automático",
        "Recalculo à mão algumas linhas e comparo",
        "Peço outro número até gostar",
      ],
      correct: 1,
      feedback:
        "Recalcular à mão algumas linhas confirma que a análise está correta.",
    },
    {
      q: "Qual pergunta convém fazer antes de ativar uma ferramenta?",
      options: [
        "Quantas ferramentas posso ativar ao mesmo tempo?",
        "Qual é a mais nova do menu?",
        "Como vou verificar o resultado?",
      ],
      correct: 2,
      feedback:
        "Se você não tem como conferir o resultado, repense a ferramenta ou a tarefa.",
    },
    {
      q: "Que dados convém enviar a uma ferramenta?",
      options: [
        "Só o que você mostraria em um documento público",
        "Tudo que der mais contexto",
        "Dados pessoais, para personalizar",
      ],
      correct: 0,
      feedback: "Remova antes os dados pessoais e confidenciais.",
    },
  ],
  "fachada-video-1": [
    {
      q: "Com o que convém começar em um trabalho que se repete?",
      options: [
        "Com um agente que faça sozinho",
        "Com um Projeto com suas instruções e arquivos",
        "Com um GPT, sem checar sua conta",
      ],
      correct: 1,
      feedback:
        "O Projeto guarda instruções e arquivos; além disso, a OpenAI programou a retirada dos GPTs personalizados para 11 de dezembro de 2026 (data sujeita a mudanças).",
    },
    {
      q: "Qual teste verifica que um GPT não repete dados de menores?",
      options: ["Coerência", "Caso normal", "Dado sensível"],
      correct: 2,
      feedback:
        "No teste de dado sensível, o GPT não deve pedir nem repetir dados pessoais ou de menores.",
    },
    {
      q: "Qual é o seu papel quando um agente executa vários passos?",
      options: [
        "Revisar o plano e aprovar as ações importantes",
        "Aprovar o resultado final sem olhar os passos",
        "Deixá-lo sozinho para ganhar tempo",
      ],
      correct: 0,
      feedback:
        "Um erro inicial se propaga a todo o resultado: supervisione o plano e os passos.",
    },
  ],
  "grounding-video-1": [
    {
      q: "O que significa ancorar uma resposta (grounding)?",
      options: [
        "A IA responde mais rápido",
        "A IA apoia o que diz em fontes reais que você pode abrir",
        "A IA guarda suas perguntas",
      ],
      correct: 1,
      feedback:
        "Ancorar é apoiar a resposta em fontes reais que você pode abrir e conferir.",
    },
    {
      q: "Uma resposta traz um número sem fonte. O que você faz?",
      options: [
        "Uso se parecer seguro",
        "Arredondo para parecer exato",
        "Peço a fonte e abro o link antes de usar",
      ],
      correct: 2,
      feedback: "Um número sem fonte não é evidência: peça a fonte e abra.",
    },
    {
      q: "Quantas fontes convém abrir para sustentar as conclusões-chave?",
      options: ["Pelo menos três", "Só uma", "Nenhuma, se parecer seguro"],
      correct: 0,
      feedback:
        "Abra pelo menos três fontes que sustentem as conclusões-chave.",
    },
  ],
  "curaduria-video-1": [
    {
      q: "Qual caderno costuma responder melhor?",
      options: [
        "Um com cinquenta documentos bagunçados",
        "Um com cinco fontes bem escolhidas",
        "Um com fontes de datas misturadas",
      ],
      correct: 1,
      feedback:
        "Poucas fontes bem escolhidas dão melhores respostas que muitas bagunçadas.",
    },
    {
      q: "Qual é uma boa fonte para o seu caderno?",
      options: [
        "Um texto anônimo sem data",
        "Anotações soltas que se contradizem",
        "Um relatório oficial com data e autor",
      ],
      correct: 2,
      feedback: "Uma boa fonte tem autor, data e respaldo verificável.",
    },
    {
      q: "Uma resposta do caderno traz citações. O que você faz?",
      options: [
        "Abro pelo menos uma para conferir o trecho",
        "Ignoro, já são confiáveis",
        "Apago para ficar limpo",
      ],
      correct: 0,
      feedback:
        "Uma resposta com citações ainda precisa do seu critério: abra uma e confirme.",
    },
  ],
};
