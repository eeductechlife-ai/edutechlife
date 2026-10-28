export const MODULE_1_PT_PART1 = [
  {
    id: "m1q1",
    question: "Para que serve dar bons prompts a uma IA generativa?",
    options: [
      {
        id: "m1q1_a",
        label: "Para que as respostas sejam mais longas e detalhadas",
      },
      {
        id: "m1q1_b",
        label: "Para obter respostas úteis e alinhadas ao que preciso",
      },
      {
        id: "m1q1_c",
        label: "Para que a IA funcione mais rápido sem erros",
      },
      {
        id: "m1q1_d",
        label: "Para que a IA escreva o código por mim",
      },
    ],
    correctAnswer: "m1q1_b",
    topic: "Engenharia de Prompts",
    difficulty: "fácil",
    source: "Como Criar Prompts Eficazes: A Fórmula para Dominar a IA",
    feedback:
      "Um bom prompt diz à IA o que você precisa, para quem e como você quer; por isso a resposta se ajusta ao seu objetivo. Ser mais longo ou mais rápido não é o que melhora.",
  },
  {
    id: "m1q2",
    question:
      'Um estudante escreve: "Escreva um texto sobre inteligência artificial para estudantes." Com o método RTF (Papel, Tarefa, Formato), o que ele tem e o que falta?',
    options: [
      {
        id: "m1q2_a",
        label: "Tem a Tarefa; faltam o Papel e o Formato",
      },
      {
        id: "m1q2_b",
        label: "Tem o Papel, mas faltam a Tarefa e o Formato",
      },
      {
        id: "m1q2_c",
        label: "Tem o Formato, mas faltam o Papel e a Tarefa",
      },
      {
        id: "m1q2_d",
        label: "Já inclui os três componentes do RTF",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "médio",
    source: "Guia: Anatomia de um Prompt",
    feedback:
      'Esse prompt pede para "escrever um texto" (Tarefa), mas não define o papel da IA nem o formato. Reveja a anatomia do prompt.',
  },
  {
    id: "m1q3",
    question: "O que significam as três partes do método RTF?",
    options: [
      {
        id: "m1q3_a",
        label: "Papel, Tom e Formato",
      },
      {
        id: "m1q3_b",
        label: "Papel, Tarefa e Formato",
      },
      {
        id: "m1q3_c",
        label: "Resposta, Tema e Formato",
      },
      {
        id: "m1q3_d",
        label: "Papel, Tarefa e Fonte",
      },
    ],
    correctAnswer: "m1q3_b",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "O Cinzel",
    feedback:
      "RTF significa Papel (o ponto de vista com que a IA responde), Tarefa (a ação concreta) e Formato (como ela entrega a resposta). O tom e a extensão se somam à parte. Pratique na OVA O Cinzel.",
  },
  {
    id: "m1q4",
    question:
      "Você suspeita que uma IA descreve as pessoas de forma diferente conforme a origem delas. Que teste simples você pode fazer?",
    options: [
      {
        id: "m1q4_a",
        label: "Pedir a mesma tarefa com perfis diferentes e comparar",
      },
      {
        id: "m1q4_b",
        label: "Perguntar à IA se ela tem viés e acreditar nela",
      },
      {
        id: "m1q4_c",
        label: "Repetir o mesmo prompt várias vezes com o mesmo perfil",
      },
      {
        id: "m1q4_d",
        label: "Pedir que responda mais curto para reduzir o viés",
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Detectar Vieses",
    difficulty: "médio",
    source: "PDF: Ética da Inteligência Artificial",
    feedback:
      "Se você muda só o perfil e a resposta trata cada pessoa de forma diferente, encontrou um viés. Perguntar à IA se ela é neutra ou repetir o mesmo perfil não mostra essa diferença. Revise o guia de ética, seção 4.",
  },
  {
    id: "m1q5",
    question:
      'Você pede um resumo executivo para diretores sem conhecimento técnico. O prompt é: "Resuma este artigo." A IA devolve um texto muito técnico. O que falta?',
    options: [
      {
        id: "m1q5_a",
        label: "Dizer para quem é e o estilo do resumo",
      },
      {
        id: "m1q5_b",
        label: "Dividir o artigo em partes menores",
      },
      {
        id: "m1q5_c",
        label: "Trocar de ferramenta porque a IA não entendeu o tema",
      },
      {
        id: "m1q5_d",
        label: "Usar sinônimos da palavra resumo",
      },
    ],
    correctAnswer: "m1q5_a",
    topic: "Aplicação RTF",
    difficulty: "médio",
    source: "O Cinzel",
    feedback:
      "Um prompt genérico não indica público nem formato. Acrescente papel, público e extensão.",
  },
  {
    id: "m1q6",
    question: "O que é a inteligência artificial generativa?",
    options: [
      {
        id: "m1q6_a",
        label: "Um sistema que cria textos e imagens inéditos",
      },
      {
        id: "m1q6_b",
        label: "Um banco de dados que guarda respostas já escritas",
      },
      {
        id: "m1q6_c",
        label: "Um programa que só classifica imagens e textos",
      },
      {
        id: "m1q6_d",
        label: "Um buscador que devolve páginas da internet",
      },
    ],
    correctAnswer: "m1q6_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "O que é a IA e como ela está mudando o mundo",
    feedback:
      "A IA generativa produz texto, imagens ou outro conteúdo novo. Assista ao vídeo.",
  },
  {
    id: "m1q7",
    question: "O que é um prompt?",
    options: [
      {
        id: "m1q7_a",
        label: "A instrução que você escreve para a IA",
      },
      {
        id: "m1q7_b",
        label: "A resposta automática que a IA gera",
      },
      {
        id: "m1q7_c",
        label: "O design visual da interface da ferramenta",
      },
      {
        id: "m1q7_d",
        label: "Um tipo de arquivo que a IA pode abrir",
      },
    ],
    correctAnswer: "m1q7_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "O Cinzel",
    feedback:
      "Um prompt é o que você pede à IA. O guia de anatomia explica como montá-lo.",
  },
  {
    id: "m1q8",
    question:
      'Por que é útil dar um papel à IA (por exemplo, "aja como um tutor")?',
    options: [
      {
        id: "m1q8_a",
        label: "Porque ajusta o estilo e o foco do pedido",
      },
      {
        id: "m1q8_b",
        label: "Porque faz a IA responder sempre mais curto",
      },
      {
        id: "m1q8_c",
        label: "Porque impede a IA de precisar de contexto",
      },
      {
        id: "m1q8_d",
        label: "Porque é obrigatório para a IA funcionar",
      },
    ],
    correctAnswer: "m1q8_a",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "Guia: Anatomia de um Prompt",
    feedback:
      "O papel dá foco e tom à IA, deixando a resposta mais adequada ao objetivo.",
  },
  {
    id: "m1q9",
    question:
      "Você pede à IA um plano de estudo e ela dá um genérico que não serve. O que falta ao prompt?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Sua situação: quanto tempo você tem, seu nível e a data da prova",
      },
      {
        id: "m1q9_b",
        label: 'Um papel mais chamativo, como "aja como um gênio"',
      },
      {
        id: "m1q9_c",
        label: "Que o plano fique mais longo e com muito mais detalhes",
      },
      {
        id: "m1q9_d",
        label: 'Palavras gentis como "por favor" para que se esforce',
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "Contexto",
    difficulty: "fácil",
    source: "Guia: Anatomia de um Prompt",
    feedback:
      'A IA não conhece a sua situação. O contexto (seu tempo, seu nível e seu prazo) é o que transforma um plano genérico em um útil. Um papel chamativo, mais extensão ou palavras gentis não dão essa informação. Revise o "Guia: Anatomia de um Prompt".',
  },
  {
    id: "m1q10",
    question:
      "Você quer que a IA escreva mensagens no seu estilo. O que lhe dá?",
    options: [
      {
        id: "m1q10_a",
        label: "Duas mensagens que você já escreveu e gostou",
      },
      {
        id: "m1q10_b",
        label: "Uma frase vaga: escreva bem",
      },
      {
        id: "m1q10_c",
        label: "Só o nome da empresa",
      },
      {
        id: "m1q10_d",
        label: "Nada: a IA já conhece o seu estilo",
      },
    ],
    correctAnswer: "m1q10_a",
    topic: "Clareza em Prompts",
    difficulty: "médio",
    source: "O Cinzel",
    feedback:
      "Exemplos reais do seu estilo dão à IA um modelo concreto. Uma frase vaga ou nada não dão referência.",
  },
  {
    id: "m1q11",
    question:
      "Você pede exemplos de profissões e todos mostram homens da cidade. Nenhum dado é falso. Que pergunta ajuda você a ver o problema?",
    options: [
      {
        id: "m1q11_a",
        label: "Que pessoas ou perspectivas ficam de fora?",
      },
      {
        id: "m1q11_b",
        label: "Algum dos dados da resposta é falso?",
      },
      {
        id: "m1q11_c",
        label: "A resposta cita alguma fonte confiável?",
      },
      {
        id: "m1q11_d",
        label: "As profissões da lista existem de verdade?",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Viés por Omissão",
    difficulty: "fácil",
    source: "PDF: Ética da Inteligência Artificial",
    feedback:
      "O viés às vezes não está no que a resposta diz, mas no que ela omite. Perguntar que pessoas ou perspectivas ficam de fora o revela; verificar se os dados são verdadeiros ou se há fontes não o mostra. Revise o guia de ética, seção 4.",
  },
  {
    id: "m1q12",
    question:
      "Caso: uma estudante copia um parágrafo da IA para o trabalho sem revisar. Qual é o principal erro?",
    options: [
      {
        id: "m1q12_a",
        label: "Não verificar dados nem citações antes de usar o texto",
      },
      {
        id: "m1q12_b",
        label: "Usar a IA para escrever",
      },
      {
        id: "m1q12_c",
        label: "Escrever rápido demais para o tempo disponível",
      },
      {
        id: "m1q12_d",
        label: "Usar um tom formal demais em um trabalho escolar de pesquisa",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "O que é a IA e como ela está mudando o mundo",
    feedback:
      "A IA pode inventar dados com segurança. Antes de usar um texto, verifique dados e citações na fonte.",
  },
  {
    id: "m1q13",
    question:
      "O que acrescenta conhecer os primórdios da inteligência artificial ao usá-la hoje?",
    options: [
      {
        id: "m1q13_a",
        label: "Entender suas capacidades e limites atuais",
      },
      {
        id: "m1q13_b",
        label: "Memorizar datas para passar sem realmente compreender",
      },
      {
        id: "m1q13_c",
        label: "Programar uma IA do zero em uma tarde",
      },
      {
        id: "m1q13_d",
        label: "Nada, a história não influencia no uso atual",
      },
    ],
    correctAnswer: "m1q13_a",
    topic: "História da IA",
    difficulty: "médio",
    source: "O que é a IA e como ela está mudando o mundo",
    feedback:
      "A história explica por que a IA chegou a gerar conteúdo e onde estão seus limites. Veja o vídeo 'O que é a IA e como ela está mudando o mundo'.",
  },
  {
    id: "m1q14",
    question: "Qual destas é uma capacidade típica da IA generativa?",
    options: [
      {
        id: "m1q14_a",
        label: "Redigir, resumir e reformular textos a partir de uma instrução",
      },
      {
        id: "m1q14_b",
        label:
          "Garantir que toda a informação entregue esteja verificada e seja verdadeira",
      },
      {
        id: "m1q14_c",
        label: "Tomar decisões legais e médicas sem supervisão humana",
      },
      {
        id: "m1q14_d",
        label: "Acessar suas lembranças pessoais e seus arquivos privados",
      },
    ],
    correctAnswer: "m1q14_a",
    topic: "IA Generativa",
    difficulty: "médio",
    source: "O que é a IA e como ela está mudando o mundo",
    feedback:
      "Gera e transforma texto, mas não garante veracidade nem substitui seu critério. Veja o vídeo 'O que é a IA e como ela está mudando o mundo'.",
  },
];
