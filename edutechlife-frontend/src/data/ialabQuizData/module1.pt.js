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
      "Pedir exemplos e linguagem simples ajuda a tornar a explicação mais clara e útil.",
  },
  {
    id: "m1q11",
    question:
      "Uma IA generativa produz texto novo em vez de apenas classificar dados. Qual é a diferença-chave?",
    options: [
      {
        id: "m1q11_a",
        label: "Cria conteúdo original a partir de padrões aprendidos",
      },
      { id: "m1q11_b", label: "Só copia e cola textos que já existem na internet" },
      { id: "m1q11_c", label: "Funciona apenas com planilhas eletrônicas" },
      { id: "m1q11_d", label: "Não precisa de dados para aprender" },
    ],
    correctAnswer: "m1q11_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "A IA generativa produz conteúdo novo (texto, imagem, áudio) com base em padrões aprendidos.",
  },
  {
    id: "m1q12",
    question: "Qual afirmação descreve MELHOR a IA generativa?",
    options: [
      {
        id: "m1q12_a",
        label: "Aprende padrões de grandes volumes de dados e gera respostas novas",
      },
      { id: "m1q12_b", label: "É um buscador que só devolve uma lista de links da internet" },
      { id: "m1q12_c", label: "Guarda respostas escritas por pessoas e as reutiliza tal como estão" },
      { id: "m1q12_d", label: "Serve apenas para traduzir textos de um idioma para outro" },
    ],
    correctAnswer: "m1q12_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "Aprende com dados e gera conteúdo novo; não recupera respostas guardadas.",
  },
  {
    id: "m1q13",
    question:
      "O que acrescenta conhecer os primórdios da inteligência artificial ao usá-la hoje?",
    options: [
      {
        id: "m1q13_a",
        label: "Entender de onde vêm suas capacidades e limites atuais",
      },
      { id: "m1q13_b", label: "Memorizar datas para passar sem realmente compreender" },
      { id: "m1q13_c", label: "Programar uma IA do zero em uma tarde" },
      { id: "m1q13_d", label: "Nada, a história não influencia no uso atual" },
    ],
    correctAnswer: "m1q13_a",
    topic: "História da IA",
    difficulty: "médio",
    source: "Vídeo: Primórdios da Inteligência Artificial",
    feedback:
      "A história explica por que a IA chegou a gerar conteúdo e onde estão seus limites.",
  },
  {
    id: "m1q14",
    question: "Qual destas é uma capacidade típica da IA generativa?",
    options: [
      {
        id: "m1q14_a",
        label: "Redigir, resumir e reformular textos a partir de uma instrução",
      },
      { id: "m1q14_b", label: "Garantir que toda a informação entregue esteja verificada e seja verdadeira" },
      { id: "m1q14_c", label: "Tomar decisões legais e médicas sem supervisão humana" },
      { id: "m1q14_d", label: "Acessar suas lembranças pessoais e seus arquivos privados" },
    ],
    correctAnswer: "m1q14_a",
    topic: "IA Generativa",
    difficulty: "médio",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "Gera e transforma texto, mas não garante veracidade nem substitui seu critério.",
  },
  {
    id: "m1q15",
    question:
      "A IA afirma dados com segurança mesmo quando são falsos. Como se chama esse fenômeno?",
    options: [
      {
        id: "m1q15_a",
        label: "Alucinação: gera informação que parece verdadeira mas não é",
      },
      { id: "m1q15_b", label: "Tradução automática: muda o idioma sem revisar o sentido" },
      { id: "m1q15_c", label: "Compactação de dados: reduz o tamanho dos arquivos para enviar" },
      { id: "m1q15_d", label: "Atualização em tempo real: consulta a internet e mostra dados ao vivo" },
    ],
    correctAnswer: "m1q15_a",
    topic: "Limites da IA",
    difficulty: "médio",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "As alucinações são respostas plausíveis mas incorretas. Verifique sempre dados críticos.",
  },
  {
    id: "m1q16",
    question:
      "Antes de usar num trabalho um dado que a IA forneceu, qual é o passo mais responsável?",
    options: [
      {
        id: "m1q16_a",
        label: "Verificá-lo numa fonte confiável antes de usá-lo",
      },
      { id: "m1q16_b", label: "Usá-lo igual, porque a IA quase nunca se engana" },
      { id: "m1q16_c", label: "Copiá-lo tal como está sem revisar nada" },
      { id: "m1q16_d", label: "Pedir à mesma IA que confirme e então confiar" },
    ],
    correctAnswer: "m1q16_a",
    topic: "Uso Responsável",
    difficulty: "fácil",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Você é responsável pelo resultado: verifique dados importantes em fontes confiáveis.",
  },
  {
    id: "m1q17",
    question:
      "Quais três elementos básicos convém incluir num prompt para obter bons resultados?",
    options: [
      {
        id: "m1q17_a",
        label: "Papel, tarefa e formato (ou contexto claro)",
      },
      { id: "m1q17_b", label: "Saudação, emoji e despedida" },
      { id: "m1q17_c", label: "Senha, usuário e data" },
      { id: "m1q17_d", label: "Tema, opinião e assinatura" },
    ],
    correctAnswer: "m1q17_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "Papel (quem é a IA), tarefa (o que você quer) e formato (como você quer).",
  },
  {
    id: "m1q18",
    question: "Para que serve dar contexto num prompt?",
    options: [
      {
        id: "m1q18_a",
        label: "Para que a resposta se ajuste à sua situação real",
      },
      { id: "m1q18_b", label: "Para que a IA escreva mais texto sem sentido" },
      { id: "m1q18_c", label: "Para que a IA demore menos para responder" },
      { id: "m1q18_d", label: "Para não precisar indicar a tarefa" },
    ],
    correctAnswer: "m1q18_a",
    topic: "Estrutura de Prompts",
    difficulty: "médio",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "O contexto (objetivo, público, situação) direciona a resposta ao que você precisa.",
  },
  {
    id: "m1q19",
    question: "Qual prompt é MAIS específico?",
    options: [
      {
        id: "m1q19_a",
        label: '"Resuma em 5 tópicos os riscos do sedentarismo para idosos"',
      },
      { id: "m1q19_b", label: '"Fale sobre a saúde em geral e de outros temas parecidos que ocorrerem"' },
      { id: "m1q19_c", label: '"Dê informação variada e extensa sobre muitos temas de interesse geral"' },
      { id: "m1q19_d", label: '"Escreva algo interessante e útil que eu possa usar no meu trabalho diário"' },
    ],
    correctAnswer: "m1q19_a",
    topic: "Clareza em Prompts",
    difficulty: "fácil",
    source: "Vídeo: Como Criar Prompts Eficazes",
    feedback:
      "A define tema, formato e público; as demais são vagas.",
  },
  {
    id: "m1q20",
    question: "Você precisa da resposta numa tabela. O que deve indicar no prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "O formato de saída: uma tabela com colunas específicas",
      },
      { id: "m1q20_b", label: "Que responda o mais rápido possível" },
      { id: "m1q20_c", label: "Só a primeira letra de cada ideia" },
      { id: "m1q20_d", label: "Que não use números nem detalhes" },
    ],
    correctAnswer: "m1q20_a",
    topic: "Formato de Saída",
    difficulty: "médio",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "Indicar o formato (tabela, tópicos, extensão) faz a IA entregar exatamente o que você precisa.",
  },
  {
    id: "m1q21",
    question:
      "Você vai compartilhar a resposta com alunos do ensino fundamental. O que deve especificar?",
    options: [
      {
        id: "m1q21_a",
        label: "O público e o nível de linguagem adequado",
      },
      { id: "m1q21_b", label: "A cor de fundo da ferramenta" },
      { id: "m1q21_c", label: "A marca do seu computador" },
      { id: "m1q21_d", label: "O idioma do sistema operacional" },
    ],
    correctAnswer: "m1q21_a",
    topic: "Público",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Indicar o público (crianças) e o nível de linguagem ajusta o tom e a complexidade.",
  },
  {
    id: "m1q22",
    question: "A primeira resposta não é a que você quer. Qual é a melhor estratégia?",
    options: [
      {
        id: "m1q22_a",
        label: "Ajustar o prompt com mais detalhe e pedir de novo",
      },
      { id: "m1q22_b", label: "Desistir porque a IA não serve para isso" },
      { id: "m1q22_c", label: "Repetir o mesmo prompt muitas vezes seguidas" },
      { id: "m1q22_d", label: "Trocar de ferramenta sem mudar o prompt" },
    ],
    correctAnswer: "m1q22_a",
    topic: "Refinamento de Prompts",
    difficulty: "fácil",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Iterar o prompt faz parte do trabalho. Pratique no Laboratório de Prompts ao Vivo.",
  },
  {
    id: "m1q23",
    question:
      "Você quer uma explicação curta: 'em no máximo 100 palavras'. O que está usando?",
    options: [
      { id: "m1q23_a", label: "Uma restrição de comprimento no prompt" },
      { id: "m1q23_b", label: "Um erro que quebra a IA" },
      { id: "m1q23_c", label: "Um tipo de arquivo" },
      { id: "m1q23_d", label: "Uma senha da ferramenta" },
    ],
    correctAnswer: "m1q23_a",
    topic: "Restrições",
    difficulty: "médio",
    source: "Vídeo: Como Criar Prompts Eficazes",
    feedback:
      "As restrições (comprimento, tom, público) delimitam a resposta ao resultado desejado.",
  },
  {
    id: "m1q24",
    question:
      "Incluir um exemplo do resultado esperado dentro do prompt serve para…",
    options: [
      {
        id: "m1q24_a",
        label: "Guiar a IA com o estilo e a estrutura que você deseja obter",
      },
      { id: "m1q24_b", label: "Fazer a IA ignorar por completo o exemplo que você deu" },
      { id: "m1q24_c", label: "Obrigar a IA a responder num idioma diferente do seu" },
      { id: "m1q24_d", label: "Não ter nenhum efeito real sobre o resultado entregue" },
    ],
    correctAnswer: "m1q24_a",
    topic: "Exemplos no Prompt",
    difficulty: "difícil",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Dar um exemplo (poucos disparos) ajuda a IA a copiar o estilo/formato esperado.",
  },
  {
    id: "m1q25",
    question: "O texto é para um relatório formal. O que deve indicar no prompt?",
    options: [
      { id: "m1q25_a", label: "O tom: formal e profissional" },
      { id: "m1q25_b", label: "Que use emojis e gírias" },
      { id: "m1q25_c", label: "Que escreva como num chat de amigos" },
      { id: "m1q25_d", label: "Que omita todos os detalhes" },
    ],
    correctAnswer: "m1q25_a",
    topic: "Tom do Prompt",
    difficulty: "fácil",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "O tom (formal/informal, técnico/próximo) ajusta o registro da resposta.",
  },
  {
    id: "m1q26",
    question: 'Prompt: "Faça algo sobre marketing." Qual é o principal problema?',
    options: [
      {
        id: "m1q26_a",
        label: "É ambíguo: não diz tarefa, formato nem objetivo",
      },
      { id: "m1q26_b", label: "É longo demais e contém muitos dados irrelevantes" },
      { id: "m1q26_c", label: "Inclui exemplos demais que acabam confundindo a IA" },
      { id: "m1q26_d", label: "Usa um tom formal demais para o público-alvo" },
    ],
    correctAnswer: "m1q26_a",
    topic: "Evitar Ambiguidade",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Sem tarefa, formato nem objetivo, a IA adivinha. Seja específico e delimite o resultado.",
  },
  {
    id: "m1q27",
    question: "Qual é a diferença entre pedir só a tarefa e pedir papel + tarefa?",
    options: [
      {
        id: "m1q27_a",
        label: "O papel orienta o enfoque e o estilo da resposta",
      },
      { id: "m1q27_b", label: "Não há nenhuma diferença real entre pedir papel ou só a tarefa" },
      { id: "m1q27_c", label: "O papel faz a IA responder com menos detalhe que antes" },
      { id: "m1q27_d", label: "O papel substitui por completo a tarefa que você pediu" },
    ],
    correctAnswer: "m1q27_a",
    topic: "Método RTF",
    difficulty: "médio",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "O papel ('aja como…') dá enfoque; a tarefa diz o que fazer. Juntos melhoram o resultado.",
  },
  {
    id: "m1q28",
    question: "Você quer um resumo para a diretoria. Qual prompt é MAIS adequado?",
    options: [
      {
        id: "m1q28_a",
        label: '"Resuma este relatório em 5 tópicos executivos para a diretoria não técnica"',
      },
      { id: "m1q28_b", label: '"Resuma isto da maneira que achar melhor e sem limites"' },
      { id: "m1q28_c", label: '"Escreva muito texto sobre o relatório e todos os seus detalhes técnicos"' },
      { id: "m1q28_d", label: '"Traduza o relatório para outro idioma para ficar mais claro"' },
    ],
    correctAnswer: "m1q28_a",
    topic: "Aplicação RTF",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "A define formato (tópicos), extensão (5) e público (diretoria). É a mais útil e clara.",
  },
  {
    id: "m1q29",
    question: "Você quer 10 ideias para uma campanha. Qual prompt dará melhores ideias?",
    options: [
      {
        id: "m1q29_a",
        label: '"Gere 10 ideias de campanha para uma cafeteria local, tom próximo, em tópicos"',
      },
      { id: "m1q29_b", label: '"Dê ideias variadas sobre marketing para negócios de qualquer tipo"' },
      { id: "m1q29_c", label: '"O que você acha do marketing e de como as empresas o usam?"' },
      { id: "m1q29_d", label: '"Escreva um ensaio longo e detalhado sobre a publicidade moderna"' },
    ],
    correctAnswer: "m1q29_a",
    topic: "Aplicação de Prompts",
    difficulty: "fácil",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "A especifica quantidade, contexto, tom e formato: isso foca as ideias no que você precisa.",
  },
  {
    id: "m1q30",
    question: "Você quer aprender um tema passo a passo. Qual prompt ajuda mais?",
    options: [
      {
        id: "m1q30_a",
        label: '"Explique passo a passo, com um exemplo em cada passo e linguagem simples"',
      },
      { id: "m1q30_b", label: '"Dê toda a teoria num único parágrafo denso de ler"' },
      { id: "m1q30_c", label: '"Fale sobre vários temas diferentes ao mesmo tempo agora"' },
      { id: "m1q30_d", label: '"Resuma o tema em apenas uma única frase bem curta"' },
    ],
    correctAnswer: "m1q30_a",
    topic: "Aplicação de Prompts",
    difficulty: "médio",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Pedir passos, exemplos e linguagem simples produz uma explicação mais clara.",
  },
  {
    id: "m1q31",
    question: "Qual é um erro comum ao escrever prompts?",
    options: [
      {
        id: "m1q31_a",
        label: "Pedir de forma vaga sem objetivo, público nem formato",
      },
      { id: "m1q31_b", label: "Indicar claramente o papel que a inteligência artificial deve assumir" },
      { id: "m1q31_c", label: "Aclarar o formato e a extensão exata que você espera receber" },
      { id: "m1q31_d", label: "Dar um exemplo concreto do resultado que você quer obter" },
    ],
    correctAnswer: "m1q31_a",
    topic: "Erros Comuns",
    difficulty: "médio",
    source: "Vídeo: Como Criar Prompts Eficazes",
    feedback:
      "A vagueza é o erro mais frequente: sem objetivo, público nem formato a IA adivinha.",
  },
  {
    id: "m1q32",
    question: "Um prompt inclui muita informação irrelevante. Que efeito costuma ter?",
    options: [
      {
        id: "m1q32_a",
        label: "Confunde a IA e desvia a resposta do objetivo",
      },
      { id: "m1q32_b", label: "Melhora sempre a qualidade do resultado que a IA entrega" },
      { id: "m1q32_c", label: "Não tem nenhum efeito real sobre a resposta final" },
      { id: "m1q32_d", label: "Obriga a IA a responder muito mais rápido do que antes" },
    ],
    correctAnswer: "m1q32_a",
    topic: "Estrutura de Prompts",
    difficulty: "difícil",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "Menos é mais: inclua só o relevante (tarefa, contexto, formato) para não diluir o objetivo.",
  },
  {
    id: "m1q33",
    question: "Guardar e reutilizar bons modelos de prompt serve para…",
    options: [
      {
        id: "m1q33_a",
        label: "Economizar tempo e manter resultados consistentes",
      },
      { id: "m1q33_b", label: "Fazer a IA parar de aprender com o passar do tempo" },
      { id: "m1q33_c", label: "Evitar ter que revisar os resultados de algum modo" },
      { id: "m1q33_d", label: "Impedir ajustar o prompt depois de salvá-lo" },
    ],
    correctAnswer: "m1q33_a",
    topic: "Reutilização",
    difficulty: "médio",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Modelos reutilizáveis economizam tempo e tornam os resultados consistentes.",
  },
  {
    id: "m1q34",
    question:
      "A IA dá duas respostas diferentes ao mesmo prompt. Qual é o passo mais crítico?",
    options: [
      {
        id: "m1q34_a",
        label: "Comparar e validar a informação antes de decidir",
      },
      { id: "m1q34_b", label: "Escolher a mais longa sem ler o conteúdo dela" },
      { id: "m1q34_c", label: "Confiar na primeira que aparecer na tela" },
      { id: "m1q34_d", label: "Combinar fragmentos das duas de forma aleatória" },
    ],
    correctAnswer: "m1q34_a",
    topic: "Avaliação Crítica",
    difficulty: "difícil",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "Diante de respostas divergentes, valide os dados e use seu critério.",
  },
  {
    id: "m1q35",
    question:
      "Você vai colar informação confidencial da empresa na IA. O que deve fazer?",
    options: [
      {
        id: "m1q35_a",
        label: "Evitar dados sensíveis ou anonimizá-los antes de usá-los",
      },
      { id: "m1q35_b", label: "Colar tudo igual, sem nenhum problema aparente" },
      { id: "m1q35_c", label: "Pedir à IA que apague tudo depois de responder" },
      { id: "m1q35_d", label: "Compartilhar os dados apenas por um chat privado" },
    ],
    correctAnswer: "m1q35_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "Não compartilhe dados confidenciais: anonimize ou evite informação sensível.",
  },
  {
    id: "m1q36",
    question: "A IA responde com viés ou informação incompleta. Qual é a melhor ação?",
    options: [
      {
        id: "m1q36_a",
        label: "Questionar, pedir outras perspectivas e verificar as fontes",
      },
      { id: "m1q36_b", label: "Aceitar tal como está porque a IA sempre é neutra e objetiva" },
      { id: "m1q36_c", label: "Publicar igual sem revisar porque o tema não é sensível" },
      { id: "m1q36_d", label: "Ignorar o viés detectado e continuar com a próxima tarefa" },
    ],
    correctAnswer: "m1q36_a",
    topic: "Pensamento Crítico",
    difficulty: "difícil",
    source: "Vídeo: O que é a IA e como está mudando o mundo",
    feedback:
      "A IA pode ter viés: contraste, peça outras perspectivas e valide. Você traz o critério.",
  },
  {
    id: "m1q37",
    question: "Qual é o uso mais honesto da IA num trabalho acadêmico?",
    options: [
      {
        id: "m1q37_a",
        label: "Usá-la como apoio e declarar quando você a utilizou",
      },
      { id: "m1q37_b", label: "Entregar a saída dela como sua sem nenhuma revisão" },
      { id: "m1q37_c", label: "Copiar sem citar nenhuma parte do conteúdo gerado" },
      { id: "m1q37_d", label: "Usá-la para se passar por outra pessoa" },
    ],
    correctAnswer: "m1q37_a",
    topic: "Ética e Uso Responsável",
    difficulty: "fácil",
    source: "Guia PDF: Anatomia de um Prompt",
    feedback:
      "A IA é apoio: revise, acrescente valor próprio e seja transparente sobre o uso.",
  },
  {
    id: "m1q38",
    question: "A IA é um assistente, não um substituto. O que isso implica para o estudante?",
    options: [
      {
        id: "m1q38_a",
        label: "Revisar e decidir com critério próprio o resultado final",
      },
      { id: "m1q38_b", label: "Aceitar tudo o que a IA entregar sem revisar antes" },
      { id: "m1q38_c", label: "Delegar por completo à IA todas as decisões importantes" },
      { id: "m1q38_d", label: "Evitar aprender o tema porque a IA já resolve tudo" },
    ],
    correctAnswer: "m1q38_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    source: "OVA: Como conversar com a IA (prompts)",
    feedback:
      "A IA acelera o trabalho, mas a revisão e a decisão final são suas.",
  },
  {
    id: "m1q39",
    question: "Iterar o prompt várias vezes até alcançar o objetivo é uma prática…",
    options: [
      {
        id: "m1q39_a",
        label: "Recomendada: melhora o resultado a cada ajuste feito",
      },
      { id: "m1q39_b", label: "Incorreta: é preciso acertar de primeira" },
      { id: "m1q39_c", label: "Proibida pelas ferramentas usadas" },
      { id: "m1q39_d", label: "Inútil, a IA nunca muda o resultado final" },
    ],
    correctAnswer: "m1q39_a",
    topic: "Refinamento de Prompts",
    difficulty: "médio",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "Iterar é normal e eficaz: cada ajuste aproxima a resposta do que você precisa.",
  },
  {
    id: "m1q40",
    question:
      "Caso: você precisa de um e-mail para lembrar de uma reunião. Qual prompt reúne MAIS elementos de qualidade?",
    options: [
      {
        id: "m1q40_a",
        label:
          '"Aja como assistente executivo; redija um e-mail formal de lembrete para a reunião de quinta às 10h, tom cordial e assunto incluído"',
      },
      { id: "m1q40_b", label: '"Escreva um e-mail curto para lembrar um colega do seu time de uma reunião de trabalho"' },
      { id: "m1q40_c", label: '"Rascunhe uma mensagem simples para avisar que teremos uma reunião em breve, sem mais detalhes"' },
      { id: "m1q40_d", label: '"Escreva um texto sobre reuniões de trabalho e a importância delas nas empresas modernas"' },
    ],
    correctAnswer: "m1q40_a",
    topic: "Aplicação RTF",
    difficulty: "difícil",
    source: "OVA: Laboratório de Prompts ao Vivo",
    feedback:
      "A reúne papel, tarefa, contexto (data/hora), tom, formato/extensão e assunto: um prompt completo.",
  },
];
