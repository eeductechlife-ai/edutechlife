export const MODULE_1_PT = [
  {
    id: "m1q1",
    question: "Qual é o propósito principal da engenharia de prompts?",
    options: [
      { id: "m1q1_a", label: "Fazer perguntas mais longas à IA" },
      {
        id: "m1q1_b",
        label: "Dar instruções claras e eficazes para obter resultados úteis",
      },
      { id: "m1q1_c", label: "Usar palavras técnicas complicadas" },
      {
        id: "m1q1_d",
        label: "Fazer com que a IA escreva código automaticamente",
      },
    ],
    correctAnswer: "m1q1_b",
    topic: "Engenharia de Prompts",
    difficulty: "fácil",
    feedback:
      'Revise o tópico "IA Generativa: Seu Primeiro Passo" nos recursos do módulo.',
  },
  {
    id: "m1q2",
    question:
      'Um estudante escreve: "Escreva um texto sobre inteligência artificial para estudantes." Segundo o método RTF (Papel, Tarefa, Formato), quais componentes estão presentes e quais estão faltando?',
    options: [
      {
        id: "m1q2_a",
        label:
          "A Tarefa está presente; faltam o Papel e o Formato — não define qual perfil a IA deve adotar nem como estruturar a resposta",
      },
      {
        id: "m1q2_b",
        label: "Todos os componentes do RTF estão presentes no prompt",
      },
      {
        id: "m1q2_c",
        label: "Só falta o Papel; a Tarefa e o Formato estão bem definidos",
      },
      {
        id: "m1q2_d",
        label: "Só falta o Formato; o Papel e a Tarefa estão bem definidos",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "médio",
    feedback:
      'O prompt tem uma Tarefa clara ("escrever um texto") mas não define o Papel da IA (divulgador? professor?) nem o Formato (lista? ensaio? quantas palavras?). Revise o guia "Anatomia de um Prompt" (PDF) e o vídeo "Como criar um bom prompt".',
  },
  {
    id: "m1q3",
    question:
      "Qual é uma vantagem fundamental do método RTF (Papel, Tarefa, Formato)?",
    options: [
      { id: "m1q3_a", label: "Deixa as perguntas mais curtas" },
      {
        id: "m1q3_b",
        label:
          "Estrutura as instruções para obter respostas organizadas e alinhadas",
      },
      { id: "m1q3_c", label: "Elimina a necessidade de contexto" },
      { id: "m1q3_d", label: "Automatiza completamente o processo" },
    ],
    correctAnswer: "m1q3_b",
    topic: "Estrutura de Maestria",
    difficulty: "fácil",
    feedback: 'Revise "A Fórmula do Prompt Perfeito" nos recursos do módulo.',
  },
  {
    id: "m1q4",
    question:
      'Segundo o guia "Anatomia de um Prompt" (PDF do módulo) e o vídeo "Como criar um bom prompt", qual destes prompts está MELHOR estruturado para obter uma resposta precisa e útil?',
    options: [
      { id: "m1q4_a", label: '"Me conte tudo sobre a mudança climática"' },
      {
        id: "m1q4_b",
        label:
          '"Atue como um divulgador científico. Explique 3 causas da mudança climática e seus efeitos concretos. Use um tom acessível para o público geral e termine com uma conclusão de 2 linhas."',
      },
      { id: "m1q4_c", label: '"Mudança climática: causas e efeitos"' },
      {
        id: "m1q4_d",
        label:
          '"Preciso de informações sobre a mudança climática para um trabalho escolar"',
      },
    ],
    correctAnswer: "m1q4_b",
    topic: "Estrutura de Prompts",
    difficulty: "médio",
    feedback:
      "O prompt B segue a estrutura recomendada no PDF e no vídeo: define um Papel (divulgador científico), uma Tarefa específica (explicar 3 causas e efeitos) e um Formato claro (tom acessível, conclusão de 2 linhas).",
  },
  {
    id: "m1q5",
    question:
      'Um estudante precisa de um resumo executivo de um artigo sobre redes neurais para apresentar a executivos sem formação técnica. Ele escreve: "Resuma este artigo sobre redes neurais." A IA devolve um texto técnico de 3 páginas. Qual é a causa do problema e como o prompt deveria ser modificado?',
    options: [
      {
        id: "m1q5_a",
        label:
          "O artigo é extenso demais; ele deveria dividir o texto em partes menores",
      },
      {
        id: "m1q5_b",
        label:
          'Faltam o Papel, o Público-alvo e o Formato. Deveria ser: "Atue como um consultor de tecnologia. Resumo executivo em 5 tópicos para executivos sem formação técnica. Máximo 200 palavras."',
      },
      {
        id: "m1q5_c",
        label:
          "A IA não entende o tema; ele deveria usar outra ferramenta de IA",
      },
      {
        id: "m1q5_d",
        label:
          'O problema é a palavra "resuma"; ele deveria usar "sintetize" no lugar',
      },
    ],
    correctAnswer: "m1q5_b",
    topic: "Aplicação RTF",
    difficulty: "difícil",
    feedback:
      'O prompt original só tem uma Tarefa genérica. Para um resultado útil, é preciso definir o Papel (consultor de tecnologia), o Público-alvo (executivos sem formação técnica) e o Formato (5 tópicos, 200 palavras). Revise o OVA "Como se comunicar com a IA" e o guia em PDF.',
  },
  {
    id: "m1q6",
    question:
      "Quais considerações éticas são fundamentais ao usar IA generativa?",
    options: [
      { id: "m1q6_a", label: "Apenas a velocidade de resposta" },
      {
        id: "m1q6_b",
        label: "Vieses, privacidade, transparência e uso responsável",
      },
      { id: "m1q6_c", label: "O custo da API" },
      { id: "m1q6_d", label: "A quantidade de tokens usados" },
    ],
    correctAnswer: "m1q6_b",
    topic: "Ética em IA",
    difficulty: "médio",
    feedback: "Revise os recursos do módulo sobre o uso responsável de IA.",
  },
  {
    id: "m1q7",
    question:
      'Compare estes dois prompts para a mesma tarefa:\n\nPrompt A: "Fale sobre o ciclo da água."\nPrompt B: "Atue como um professor de ciências naturais. Explique o ciclo da água em 4 etapas-chave para estudantes de 10 a 12 anos. Inclua uma analogia simples para cada etapa e termine com uma pergunta de verificação."\n\nQual é a principal razão pela qual o Prompt B obterá um resultado melhor?',
    options: [
      {
        id: "m1q7_a",
        label:
          "O Prompt B é mais longo; portanto, a IA se esforça mais na resposta",
      },
      {
        id: "m1q7_b",
        label:
          "O Prompt B usa o método RTF completo (Papel + Tarefa + Formato + Público-alvo), dando instruções claras e específicas",
      },
      {
        id: "m1q7_c",
        label: "O Prompt A usa palavras simples demais para a IA",
      },
      { id: "m1q7_d", label: "O Prompt B usa um tom mais formal e técnico" },
    ],
    correctAnswer: "m1q7_b",
    topic: "Análise Comparativa RTF",
    difficulty: "difícil",
    feedback:
      'O Prompt B segue o método RTF: define um Papel (professor de ciências), uma Tarefa específica (explicar em 4 etapas), um Público-alvo (estudantes de 10 a 12 anos) e um Formato (analogias + pergunta). O Prompt A é genérico e carece de estrutura. Revise o PDF "Anatomia de um Prompt".',
  },
  {
    id: "m1q8",
    question:
      "Como você estrutura um prompt usando RTF para análise de mercado?",
    options: [
      { id: "m1q8_a", label: 'Pedindo diretamente "analise o mercado"' },
      {
        id: "m1q8_b",
        label:
          "Definindo Papel, Tarefa e Formato para orientar a resposta da IA",
      },
      { id: "m1q8_c", label: "Usando a menor quantidade de palavras possível" },
      { id: "m1q8_d", label: "Copiando prompts da internet" },
    ],
    correctAnswer: "m1q8_b",
    topic: "Estrutura de Maestria",
    difficulty: "difícil",
    feedback:
      "Pratique com os modelos JSON do módulo para dominar a estrutura RTF.",
  },
  {
    id: "m1q9",
    question:
      "Você trabalha em uma empresa que lança um novo produto todo mês. Precisa que o ChatGPT redija e-mails promocionais consistentes com a voz da marca. Qual é a estratégia mais eficiente para manter a consistência sem reescrever instruções a cada vez?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Criar um GPT personalizado com instruções de tom, voz e exemplos da marca na base de conhecimento",
      },
      {
        id: "m1q9_b",
        label: "Copiar e colar as instruções manualmente em cada nova conversa",
      },
      {
        id: "m1q9_c",
        label: "Usar o chat padrão e pedir que ele lembre o tom a cada vez",
      },
      {
        id: "m1q9_d",
        label: "Escrever os e-mails manualmente sem ajuda de IA",
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    feedback:
      "Um GPT personalizado com instruções persistentes e base de conhecimento é a forma mais eficiente de manter a consistência. Revise o tópico de GPTs personalizados nos recursos do módulo.",
  },
  {
    id: "m1q10",
    question:
      "Você escreve um prompt pedindo um plano de marketing. A IA dá algo genérico. Qual é o melhor próximo passo?",
    options: [
      {
        id: "m1q10_a",
        label:
          "Aceitar o resultado genérico porque a IA já deu o melhor que podia",
      },
      {
        id: "m1q10_b",
        label:
          "Refinar o prompt adicionando contexto específico: setor, orçamento, público-alvo e exemplos de campanhas anteriores",
      },
      {
        id: "m1q10_c",
        label: "Mudar completamente de tema e começar do zero",
      },
      { id: "m1q10_d", label: "Reclamar com a equipe de suporte da IA" },
    ],
    correctAnswer: "m1q10_b",
    topic: "Refinamento Iterativo",
    difficulty: "fácil",
    feedback:
      'A engenharia de prompts é um processo iterativo. Cada refinamento adiciona o contexto que a IA precisa para dar resultados específicos e úteis. Revise o tópico "Refinamento de Prompts" nos recursos do módulo.',
  },
  {
    id: "m1q11",
    question:
      "Qual é a diferença fundamental entre um prompt zero-shot e um few-shot?",
    options: [
      {
        id: "m1q11_a",
        label:
          "Zero-shot não usa exemplos; few-shot inclui exemplos no prompt para orientar a IA",
      },
      {
        id: "m1q11_b",
        label: "Zero-shot funciona sem internet; few-shot precisa de conexão",
      },
      {
        id: "m1q11_c",
        label: "Zero-shot só funciona com imagens; few-shot só com texto",
      },
      {
        id: "m1q11_d",
        label: "Não há diferença, são termos intercambiáveis",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Estratégias de Prompting",
    difficulty: "médio",
    feedback:
      "No zero-shot você dá uma instrução direta (uma única vez). No few-shot você fornece exemplos (várias amostras) para estabelecer o padrão de resposta desejado. Revise o tópico de estratégias de prompting nos recursos do módulo.",
  },
  {
    id: "m1q12",
    question:
      "Qual vantagem há em usar um system prompt (instrução do sistema) em vez de incluir instruções em cada mensagem?",
    options: [
      {
        id: "m1q12_a",
        label:
          "O system prompt define o comportamento base da IA para toda a conversa, evitando repetir instruções",
      },
      {
        id: "m1q12_b",
        label: "O system prompt faz a IA responder mais rápido",
      },
      {
        id: "m1q12_c",
        label: "O system prompt só funciona na versão paga do ChatGPT",
      },
      {
        id: "m1q12_d",
        label: "Não há diferença, os dois métodos funcionam igual",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "System Prompts",
    difficulty: "médio",
    feedback:
      "Os system prompts definem o papel, o tom e as regras base para toda a interação. Isso é especialmente útil em GPTs personalizados e aplicações onde a consistência é essencial. Revise o tópico de system prompts nos recursos do módulo.",
  },
];
