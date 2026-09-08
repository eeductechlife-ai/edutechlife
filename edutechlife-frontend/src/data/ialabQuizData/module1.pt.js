export const MODULE_1_PT = [
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
      { id: "m1q1_c", label: "Para que a IA funcione mais rápido sem erros" },
      { id: "m1q1_d", label: "Para que a IA escreva o código por mim" },
    ],
    correctAnswer: "m1q1_b",
    topic: "Engenharia de Prompts",
    difficulty: "fácil",
    source: "Vídeo: Como Criar Prompts Eficazes",
    feedback:
      "Um bom prompt é uma instrução clara. Reveja o vídeo e o guia de anatomia do prompt.",
  },
  {
    id: "m1q2",
    question:
      'Um estudante escreve: "Escreva um texto sobre inteligência artificial para estudantes." Com o método RTF (Papel, Tarefa, Formato), o que ele tem e o que falta?',
    options: [
      { id: "m1q2_a", label: "Tem a Tarefa, mas faltam o Papel e o Formato" },
      { id: "m1q2_b", label: "Tem o Papel, mas faltam a Tarefa e o Formato" },
      { id: "m1q2_c", label: "Tem o Formato, mas faltam o Papel e a Tarefa" },
      { id: "m1q2_d", label: "Já inclui os três componentes do RTF" },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "médio",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      'Esse prompt pede para "escrever um texto" (Tarefa), mas não define o papel da IA nem o formato. Reveja a anatomia do prompt.',
  },
  {
    id: "m1q3",
    question: "O que o método RTF (Papel, Tarefa, Formato) proporciona?",
    options: [
      { id: "m1q3_a", label: "Transforma a instrução em um prompt mais curto" },
      {
        id: "m1q3_b",
        label: "Organiza o pedido para uma resposta clara e objetiva",
      },
      {
        id: "m1q3_c",
        label: "Elimina a necessidade de qualquer contexto extra",
      },
      { id: "m1q3_d", label: "Garante que a IA responda sem revisão" },
    ],
    correctAnswer: "m1q3_b",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "O RTF organiza o pedido em Papel, Tarefa e Formato. Pratique na OVA.",
  },
  {
    id: "m1q4",
    question:
      "Você precisa de um resumo sobre o ciclo da água. Qual prompt dá o melhor resultado?",
    options: [
      {
        id: "m1q4_a",
        label:
          '"Atue como professor de ciências e resuma o ciclo em 4 etapas."',
      },
      {
        id: "m1q4_b",
        label:
          '"Explique tudo o que você sabe sobre o ciclo da água, sem limites."',
      },
      {
        id: "m1q4_c",
        label: '"Ciclo da água. Dê informações gerais e variadas."',
      },
      {
        id: "m1q4_d",
        label: '"Fale sobre a água e sobre outros temas da natureza."',
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Estrutura de Prompts",
    difficulty: "médio",
    source: "Vídeo: Como Criar Prompts Eficazes",
    feedback:
      "A opção A define papel, tarefa e formato. As demais são vagas ou misturam temas.",
  },
  {
    id: "m1q5",
    question:
      'Você pede um resumo executivo para diretores sem conhecimento técnico. O prompt é: "Resuma este artigo." A IA devolve um texto muito técnico. O que falta?',
    options: [
      { id: "m1q5_a", label: "Dizer para quem é e o estilo do resumo" },
      { id: "m1q5_b", label: "Dividir o artigo em partes menores" },
      {
        id: "m1q5_c",
        label: "Trocar de ferramenta porque a IA não entendeu o tema",
      },
      { id: "m1q5_d", label: "Usar sinônimos da palavra resumo" },
    ],
    correctAnswer: "m1q5_a",
    topic: "Aplicação RTF",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Um prompt genérico não indica público nem formato. Acrescente papel, público e extensão.",
  },
  {
    id: "m1q6",
    question: "O que é a inteligência artificial generativa?",
    options: [
      {
        id: "m1q6_a",
        label: "Um sistema que cria conteúdo novo a partir do que aprendeu",
      },
      {
        id: "m1q6_b",
        label: "Um banco de dados que guarda respostas já escritas",
      },
      { id: "m1q6_c", label: "Um programa que só classifica imagens e textos" },
      { id: "m1q6_d", label: "Um buscador que devolve páginas da internet" },
    ],
    correctAnswer: "m1q6_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "A IA generativa produz texto, imagens ou outro conteúdo novo. Assista ao vídeo.",
  },
  {
    id: "m1q7",
    question: "O que é um prompt?",
    options: [
      {
        id: "m1q7_a",
        label: "A instrução ou mensagem que você escreve para a IA",
      },
      { id: "m1q7_b", label: "A resposta automática que a IA gera" },
      { id: "m1q7_c", label: "O design visual da interface da ferramenta" },
      { id: "m1q7_d", label: "Um tipo de arquivo que a IA pode abrir" },
    ],
    correctAnswer: "m1q7_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Um prompt é o que você pede à IA. O guia de anatomia explica como montá-lo.",
  },
  {
    id: "m1q8",
    question:
      'Por que é útil dar um papel à IA (por exemplo, "aja como um tutor")?',
    options: [
      { id: "m1q8_a", label: "Porque ajusta o estilo e o foco da resposta" },
      { id: "m1q8_b", label: "Porque faz a IA responder sempre mais curto" },
      { id: "m1q8_c", label: "Porque impede a IA de precisar de contexto" },
      { id: "m1q8_d", label: "Porque é obrigatório para a IA funcionar" },
    ],
    correctAnswer: "m1q8_a",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "O papel dá foco e tom à IA, deixando a resposta mais adequada ao objetivo.",
  },
  {
    id: "m1q9",
    question:
      "A IA devolve uma resposta genérica ou fora do tema. Qual é a melhor próxima ação?",
    options: [
      {
        id: "m1q9_a",
        label: "Acrescentar contexto claro: objetivo, público e formato",
      },
      { id: "m1q9_b", label: "Repetir o mesmo prompt sem mudar nada" },
      { id: "m1q9_c", label: "Escolher outra IA sem entender o problema" },
      { id: "m1q9_d", label: "Perguntar de novo até melhorar sozinha" },
    ],
    correctAnswer: "m1q9_a",
    topic: "Refinamento de Prompts",
    difficulty: "fácil",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Refine o prompt acrescentando contexto. Pratique no laboratório ao vivo.",
  },
  {
    id: "m1q10",
    question:
      "Você quer que a IA explique um tema difícil. Qual prompt pede uma explicação mais clara?",
    options: [
      {
        id: "m1q10_a",
        label: '"Explique com exemplos simples e linguagem do dia a dia."',
      },
      {
        id: "m1q10_b",
        label: '"Dê toda a teoria sobre o tema em uma só resposta."',
      },
      { id: "m1q10_c", label: '"Fale do tema e também de outros parecidos."' },
      {
        id: "m1q10_d",
        label: '"Explique como faria um especialista avançado."',
      },
    ],
    correctAnswer: "m1q10_a",
    topic: "Clareza em Prompts",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Pedir exemplos e linguagem simples torna a explicação mais clara.",
  },
];
