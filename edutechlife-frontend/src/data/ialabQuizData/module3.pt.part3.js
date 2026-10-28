export const MODULE_3_PT_PART3 = [
  {
    id: "m3q29",
    question:
      "Você precisa que o Gemini responda com os acordos da ata que guardou no seu Drive. O que faz?",
    options: [
      {
        id: "m3q29_a",
        label: "Entrego a ata e peço que responda com ela",
      },
      {
        id: "m3q29_b",
        label: "Peço que busque na web atas parecidas",
      },
      {
        id: "m3q29_c",
        label: "Conto de memória o que diz a ata",
      },
      {
        id: "m3q29_d",
        label: "Peço que responda com o que já sabe",
      },
    ],
    correctAnswer: "m3q29_a",
    topic: "Grounding",
    difficulty: "médio",
    source: "Manual de Campo: Introdução ao Gemini",
    feedback:
      "O grounding também pode usar seus próprios arquivos do Workspace. Se a resposta deve sair da ata, entregue-a como fonte: nem a web nem a memória do modelo conhecem esse documento. Veja na sua conta como anexar arquivos do Drive.",
  },
  {
    id: "m3q30",
    question: "Qual é a melhor forma de pedir ao Gemini uma análise de dados?",
    options: [
      {
        id: "m3q30_a",
        label: "Indicar seus dados, seu objetivo e o formato",
      },
      {
        id: "m3q30_b",
        label: "Enviar o arquivo sem explicar o que você precisa dele",
      },
      {
        id: "m3q30_c",
        label: "Pedir 'analisa isto' e aceitar a resposta",
      },
      {
        id: "m3q30_d",
        label: "Solicitar uma conclusão sem mostrar os dados de base",
      },
    ],
    correctAnswer: "m3q30_a",
    topic: "Análise com Gemini",
    difficulty: "médio",
    source: "Gemini na Prática: Exercícios de Campo",
    feedback:
      "Precise dados, objetivo e formato para uma análise realmente útil. Revise os exercícios.",
  },
  {
    id: "m3q31",
    question:
      "O Gemini dá duas respostas diferentes para a mesma pergunta de pesquisa. O que faz?",
    options: [
      {
        id: "m3q31_a",
        label: "Pedir uma terceira resposta e ficar com a que se repete",
      },
      {
        id: "m3q31_b",
        label: "Comparar as duas com fontes e decidir depois",
      },
      {
        id: "m3q31_c",
        label: "Ficar com a que cita mais fontes",
      },
      {
        id: "m3q31_d",
        label: "Pedir ao Gemini que compare as respostas e escolha",
      },
    ],
    correctAnswer: "m3q31_b",
    topic: "Pensamento Crítico",
    difficulty: "difícil",
    source:
      "Pesquisa acadêmica com IA em minutos: Gemini e Deep Research sem perder o rigor",
    feedback:
      "Duas respostas diferentes se comparam com fontes que você abre. Nem a que se repete, nem a que cita mais, nem a escolha do Gemini provam qual está certa.",
  },
  {
    id: "m3q32",
    question:
      "Você vai enviar ao Gemini dados internos da empresa. O que é mais prudente?",
    options: [
      {
        id: "m3q32_a",
        label: "Revisar a política de dados e anonimizar o confidencial",
      },
      {
        id: "m3q32_b",
        label: "Enviar tudo sem revisar porque a ferramenta é corporativa",
      },
      {
        id: "m3q32_c",
        label: "Enviar só o que depois você não possa apagar do histórico",
      },
      {
        id: "m3q32_d",
        label: "Compartilhar os acessos do sistema dentro do chat",
      },
    ],
    correctAnswer: "m3q32_a",
    topic: "Privacidade",
    difficulty: "médio",
    source: "Manual de Campo: Introdução ao Gemini",
    feedback:
      "Revise a política e anonimize antes de enviar dados internos. Revise o manual.",
  },
  {
    id: "m3q33",
    question: "Para que serve o Deep Research, e não uma busca normal?",
    options: [
      {
        id: "m3q33_a",
        label: "Para um tema com muitas fontes e um relatório citado",
      },
      {
        id: "m3q33_b",
        label: "Para uma pergunta rápida com uma única resposta",
      },
      {
        id: "m3q33_c",
        label: "Para gerar imagens de apoio ao relatório",
      },
      {
        id: "m3q33_d",
        label: "Para responder mais rápido que qualquer busca",
      },
    ],
    correctAnswer: "m3q33_a",
    topic: "Deep Research",
    difficulty: "médio",
    source: "Manual de Campo: Introdução ao Gemini",
    feedback:
      "O Deep Research reúne várias fontes e entrega um relatório com citações. Uma pergunta rápida se resolve com uma busca normal.",
  },
  {
    id: "m3q34",
    question:
      "Você quer que o Gemini analise um gráfico de vendas que está na sua tela. O que faz?",
    options: [
      {
        id: "m3q34_a",
        label: "Envio uma captura do gráfico e peço a análise",
      },
      {
        id: "m3q34_b",
        label: "Descrevo o gráfico com minhas próprias palavras",
      },
      {
        id: "m3q34_c",
        label: "Copio só o título e a legenda do gráfico",
      },
      {
        id: "m3q34_d",
        label: "Dito os números que lembro do gráfico",
      },
    ],
    correctAnswer: "m3q34_a",
    topic: "Multimodalidade",
    difficulty: "fácil",
    source:
      "Gemini multimodal: sua lupa para imagens, documentos, áudio e vídeo",
    feedback:
      "O Gemini pode ler a imagem do gráfico diretamente. Descrevê-lo, copiar só o título ou ditar números de memória deixa de fora parte da evidência ou soma os seus erros.",
  },
  {
    id: "m3q35",
    question:
      "Qual norma um trabalho acadêmico com apoio do Gemini deve cumprir?",
    options: [
      {
        id: "m3q35_a",
        label: "Declarar o uso e citar as fontes consultadas",
      },
      {
        id: "m3q35_b",
        label: "Esconder que usou IA para evitar suspeitas",
      },
      {
        id: "m3q35_c",
        label: "Não citar, porque a IA já resume tudo",
      },
      {
        id: "m3q35_d",
        label: "Entregar como está, mesmo que o professor não peça",
      },
    ],
    correctAnswer: "m3q35_a",
    topic: "Uso Responsável",
    difficulty: "fácil",
    source: "Manual de Campo: Introdução ao Gemini",
    feedback:
      "Declarar o uso e citar as fontes consultadas é a norma honesta. Esconder a IA ou não citar não é.",
  },
  {
    id: "m3q36",
    question:
      "Quando é melhor o Gemini consultar a web em vez de responder de memória?",
    options: [
      {
        id: "m3q36_a",
        label: "Quando a pergunta é uma piada sem dados",
      },
      {
        id: "m3q36_b",
        label: "Quando depende de dados que mudam, como preços",
      },
      {
        id: "m3q36_c",
        label: "Para toda pergunta, mesmo sobre um poema",
      },
      {
        id: "m3q36_d",
        label: "Quando a pergunta é longa e tem várias partes",
      },
    ],
    correctAnswer: "m3q36_b",
    topic: "Grounding",
    difficulty: "médio",
    source: "Gemini na Prática: Exercícios de Campo",
    feedback:
      "Dados que mudam exigem fontes atuais. Uma pergunta longa não exige isso por si só, e um poema ou uma piada não precisam de consulta à web.",
  },
  {
    id: "m3q37",
    question:
      "Você precisa entregar uma pesquisa e o Deep Research não aparece na sua conta. O que faz?",
    options: [
      {
        id: "m3q37_a",
        label: "Uso o mesmo pedido no chat e verifico cada fonte",
      },
      {
        id: "m3q37_b",
        label: "Espero ter o Deep Research para começar",
      },
      {
        id: "m3q37_c",
        label: "Peço um relatório no chat e entrego com as citações",
      },
      {
        id: "m3q37_d",
        label: "Peço o relatório a outra IA que pesquise",
      },
    ],
    correctAnswer: "m3q37_a",
    topic: "Deep Research",
    difficulty: "difícil",
    source: "Guia: Deep Research passo a passo",
    feedback:
      "Se o Deep Research não aparece na sua conta, o mesmo pedido funciona na conversa normal; o que não muda é a sua verificação de cada fonte. Esperar ou entregar citações que você não abriu não resolve o caso. Reveja o Guia: Deep Research passo a passo.",
  },
  {
    id: "m3q38",
    question:
      "Qual uso do Gemini para planejar uma viagem é o mais responsável?",
    options: [
      {
        id: "m3q38_a",
        label: "Reservar sem conferir nada, só com a resposta do Gemini",
      },
      {
        id: "m3q38_b",
        label: "Compartilhar o seu passaporte para ele guardar",
      },
      {
        id: "m3q38_c",
        label: "Consultar opções e confirmar os preços na página oficial",
      },
      {
        id: "m3q38_d",
        label: "Evitar qualquer outro site para sempre",
      },
    ],
    correctAnswer: "m3q38_c",
    topic: "Verificação de fontes",
    difficulty: "fácil",
    source: "Manual de Campo: Introdução ao Gemini",
    feedback:
      "O Gemini ajuda a comparar opções; a reserva e os seus dados pessoais se confirmam no site oficial.",
  },
  {
    id: "m3q39",
    question: "O que você observa antes de citar um autor no seu relatório?",
    options: [
      {
        id: "m3q39_a",
        label: "Que seja identificável e o dado esteja no texto dele",
      },
      {
        id: "m3q39_b",
        label: "Que vários blogs do tema o citem",
      },
      {
        id: "m3q39_c",
        label: "Que o Gemini o mencione com link",
      },
      {
        id: "m3q39_d",
        label: "Que tenha um cargo reconhecido numa instituição",
      },
    ],
    correctAnswer: "m3q39_a",
    topic: "Verificação de Fontes",
    difficulty: "difícil",
    source: "Guia: Deep Research passo a passo",
    feedback:
      "Para citar, você precisa saber quem é o autor e encontrar o dado no próprio texto dele. Ser citado por blogs, ter link do Gemini ou ter um cargo não prova que o dado é dele.",
  },
  {
    id: "m3q40",
    question:
      "Caso: um relatório com dados de um tema recente. O que confere antes de entregar?",
    options: [
      {
        id: "m3q40_a",
        label: "Que cada número tenha uma fonte citada pelo Gemini",
      },
      {
        id: "m3q40_b",
        label: "Que cada número tenha uma fonte que você abriu e a data",
      },
      {
        id: "m3q40_c",
        label: "Que os números coincidam com o relatório de um colega",
      },
      {
        id: "m3q40_d",
        label: "Que as fontes sejam dos últimos cinco anos",
      },
    ],
    correctAnswer: "m3q40_b",
    topic: "Pesquisa Profissional",
    difficulty: "difícil",
    source:
      "Pesquisa acadêmica com IA em minutos: Gemini e Deep Research sem perder o rigor",
    feedback:
      "Em um tema recente, cada número precisa de uma fonte que você abriu e da data. Uma citação do Gemini sem abrir, o relatório de um colega ou uma faixa de anos não confirmam que o número esteja correto e vigente.",
  },
];
