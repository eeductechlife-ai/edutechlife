// Banco del módulo 5 (Claude). Opciones equilibradas: la correcta no se distingue por longitud.
export const MODULE_5_PT = [
  {
    id: "m5q1",
    question:
      "Você quer que o Claude ajude a preparar uma proposta para um cliente. Que informação você dá primeiro para obter um bom resultado?",
    options: [
      {
        id: "m5q1_a",
        label: "Só a palavra 'proposta', para que tenha liberdade criativa",
      },
      {
        id: "m5q1_b",
        label: "O objetivo, o cliente, o tom e o resultado que você espera",
      },
      {
        id: "m5q1_c",
        label: "Um parágrafo copiado da internet, sem contexto",
      },
      {
        id: "m5q1_d",
        label: "Deixar que decida tudo sem perguntar nada a você",
      },
    ],
    correctAnswer: "m5q1_b",
    topic: "Conhecer o Claude",
    difficulty: "fácil",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "O Claude responde melhor quando conhece o objetivo, o público e o formato. Sem contexto, ele adivinha.",
  },
  {
    id: "m5q2",
    question: "O que um Artifact permite fazer no Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Guardar sua senha com segurança",
      },
      {
        id: "m5q2_b",
        label: "Criar e editar documentos ou peças dentro da conversa",
      },
      {
        id: "m5q2_c",
        label: "Conectar o Claude à conta bancária da empresa",
      },
      {
        id: "m5q2_d",
        label: "Apagar o histórico de todas as suas conversas",
      },
    ],
    correctAnswer: "m5q2_b",
    topic: "Criar com o Claude",
    difficulty: "fácil",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Os Artifacts são peças que você vê e edita ao lado da conversa: documentos, gráficos ou pequenos aplicativos.",
  },
  {
    id: "m5q3",
    question:
      "O Claude entrega uma tabela com números de vendas. O que você deve fazer antes de apresentá-la à equipe?",
    options: [
      {
        id: "m5q3_a",
        label: "Apresentar como está, porque o Claude nunca erra com números",
      },
      {
        id: "m5q3_b",
        label: "Conferir os números na fonte original e revisar os cálculos",
      },
      {
        id: "m5q3_c",
        label: "Pedir que mude os números para que batam com a meta",
      },
      {
        id: "m5q3_d",
        label: "Esconder que a tabela foi feita por uma IA",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Supervisão",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O Claude pode errar em números e cálculos. O critério humano verifica o dado antes de usá-lo.",
  },
  {
    id: "m5q4",
    question: "Qual é a melhor forma de usar um Projeto no Claude?",
    options: [
      {
        id: "m5q4_a",
        label: "Misturar temas sem relação no mesmo Projeto",
      },
      {
        id: "m5q4_b",
        label:
          "Criar um Projeto por tema e guardar nele instruções e arquivos de referência",
      },
      {
        id: "m5q4_c",
        label: "Não usar Projetos, porque começar do zero é sempre melhor",
      },
      {
        id: "m5q4_d",
        label: "Subir todos os seus arquivos pessoais em cada Projeto",
      },
    ],
    correctAnswer: "m5q4_b",
    topic: "Projetos e memória",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um Projeto reúne o contexto de um trabalho: instruções e documentos de referência. Assim você não repete tudo em cada conversa.",
  },
  {
    id: "m5q5",
    question:
      "Você quer que o Claude revise seu Gmail antes de responder a um cliente. O que deve considerar?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Conectar o Gmail sem verificar as permissões pedidas, porque é automático",
      },
      {
        id: "m5q5_b",
        label:
          "Conectar a conta por meio de um conector, revisar as permissões concedidas e decidir o que compartilhar",
      },
      {
        id: "m5q5_c",
        label: "Dar sua senha no chat para que o Claude entre por você",
      },
      {
        id: "m5q5_d",
        label: "Pedir que envie a resposta sem que você a revise",
      },
    ],
    correctAnswer: "m5q5_b",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Os conectores dão acesso aos seus apps com permissões que você aprova. Nunca dê senhas no chat e revise sempre antes de enviar.",
  },
  {
    id: "m5q6",
    question: "O que é uma Skill no Claude?",
    options: [
      {
        id: "m5q6_a",
        label: "Um tipo de senha para proteger seus arquivos",
      },
      {
        id: "m5q6_b",
        label:
          "Um pacote de instruções, modelos e referências que o Claude reutiliza em uma tarefa",
      },
      {
        id: "m5q6_c",
        label: "Um modelo de IA diferente do Opus, Sonnet ou Haiku",
      },
      {
        id: "m5q6_d",
        label: "Uma função que desliga a memória do chat",
      },
    ],
    correctAnswer: "m5q6_b",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Uma Skill transforma um procedimento que você repete em algo reutilizável: instruções, modelos e exemplos.",
  },
  {
    id: "m5q7",
    question:
      "Você quer um resumo semanal das suas pendências. Qual modo do Claude serve melhor?",
    options: [
      {
        id: "m5q7_a",
        label: "Pedir à mão toda segunda-feira, sem nenhuma automação",
      },
      {
        id: "m5q7_b",
        label:
          "Programar uma tarefa recorrente no Cowork, com as fontes de que ela precisa",
      },
      {
        id: "m5q7_c",
        label: "Colar todo o seu histórico de e-mails em cada conversa",
      },
      {
        id: "m5q7_d",
        label: "Criar uma conta nova a cada semana",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "As tarefas programadas no Cowork executam trabalhos recorrentes. Você define quais fontes ela usa e revisa o resultado.",
  },
  {
    id: "m5q8",
    question: "O que significa 'delegar com critério' ao Claude?",
    options: [
      {
        id: "m5q8_a",
        label: "Deixar que decida e execute tudo sem revisão humana",
      },
      {
        id: "m5q8_b",
        label: "Definir objetivo e limites, revisar e assumir a decisão final",
      },
      {
        id: "m5q8_c",
        label: "Pedir qualquer coisa sem especificar nada",
      },
      {
        id: "m5q8_d",
        label: "Usá-lo só para tarefas que não importam",
      },
    ],
    correctAnswer: "m5q8_b",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Delegar não é se desentender: você define o objetivo, os limites e a revisão. A responsabilidade final continua sendo sua.",
  },
  {
    id: "m5q9",
    question:
      "O Claude parece lembrar detalhes de conversas anteriores. O que fazer se quiser controlar essa informação?",
    options: [
      {
        id: "m5q9_a",
        label: "Nada: a memória não pode ser revisada",
      },
      {
        id: "m5q9_b",
        label: "Revisar o que o Claude lembra, e editar ou apagar",
      },
      {
        id: "m5q9_c",
        label: "Compartilhar sua senha para que o Claude a guarde",
      },
      {
        id: "m5q9_d",
        label: "Pedir que guarde os dados dos clientes para sempre",
      },
    ],
    correctAnswer: "m5q9_b",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "A memória é um recurso que você pode revisar e ajustar. Decida o que vale a pena lembrar e o que não.",
  },
  {
    id: "m5q10",
    question:
      "Você vai subir ao Claude um contrato com dados pessoais de clientes. Qual é o cuidado mais prudente?",
    options: [
      {
        id: "m5q10_a",
        label: "Subir completo, porque o Claude nunca guarda nada",
      },
      {
        id: "m5q10_b",
        label: "Anonimizar dados pessoais e compartilhar só o necessário",
      },
      {
        id: "m5q10_c",
        label: "Publicar em um blog para que outros revisem",
      },
      {
        id: "m5q10_d",
        label: "Enviar por WhatsApp a um desconhecido para traduzir",
      },
    ],
    correctAnswer: "m5q10_b",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Minimize os dados que compartilha e siga a política da sua organização e a lei de proteção de dados aplicável (na Colômbia, Lei 1581 de 2012).",
  },
  {
    id: "m5q11",
    question: "Qual é a diferença entre um Projeto e a memória do Claude?",
    options: [
      {
        id: "m5q11_a",
        label: "Não há nenhuma diferença entre os dois",
      },
      {
        id: "m5q11_b",
        label: "O Projeto guarda instruções de um tema; a memória, dados úteis",
      },
      {
        id: "m5q11_c",
        label: "A memória serve para subir arquivos de 10 GB",
      },
      {
        id: "m5q11_d",
        label: "O Projeto é um tipo de senha",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "O Projeto é o contexto de um trabalho concreto. A memória lembra preferências e dados úteis entre conversas.",
  },
  {
    id: "m5q12",
    question:
      "O Claude te dá um dado com citação de um estudo. Qual é o passo correto?",
    options: [
      {
        id: "m5q12_a",
        label: "Citar como está, sem buscar o estudo",
      },
      {
        id: "m5q12_b",
        label:
          "Buscar o estudo original e confirmar que diz o que o Claude afirma",
      },
      {
        id: "m5q12_c",
        label: "Trocar o ano da citação para parecer mais recente",
      },
      {
        id: "m5q12_d",
        label: "Supor que está certo porque soa profissional",
      },
    ],
    correctAnswer: "m5q12_b",
    topic: "Limites e erros",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Uma citação pode parecer real e não existir, ou dizer outra coisa. Sempre verifique na fonte primária.",
  },
  {
    id: "m5q13",
    question:
      "Qual tarefa é mais adequada para delegar ao Claude com revisão mínima?",
    options: [
      {
        id: "m5q13_a",
        label: "Assinar um contrato em nome da sua empresa",
      },
      {
        id: "m5q13_b",
        label: "Formatar um rascunho que você revisa depois",
      },
      {
        id: "m5q13_c",
        label: "Decidir sobre a demissão de uma pessoa",
      },
      {
        id: "m5q13_d",
        label: "Fazer um diagnóstico médico de um paciente",
      },
    ],
    correctAnswer: "m5q13_b",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Tarefas de rascunho e formatação são ideais para delegar. Decisões legais, médicas ou sobre pessoas exigem critério humano.",
  },
  {
    id: "m5q14",
    question:
      "Você quer que o Claude gere uma apresentação para o conselho de administração. O que entrega primeiro?",
    options: [
      {
        id: "m5q14_a",
        label: "Nada: o Claude pode deduzir a mensagem sozinho",
      },
      {
        id: "m5q14_b",
        label: "A ideia central, o público, os números verificados e os slides",
      },
      {
        id: "m5q14_c",
        label: "Apenas a palavra 'apresentação', sem mais detalhes",
      },
      {
        id: "m5q14_d",
        label: "Um vídeo de outra empresa para copiar literalmente",
      },
    ],
    correctAnswer: "m5q14_b",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Uma boa apresentação começa pela mensagem e pelo público. Os números precisam estar verificados antes de entrar no slide.",
  },
  {
    id: "m5q15",
    question:
      "O Claude fez uma mudança em um documento que você já tinha editado. O que convém fazer?",
    options: [
      {
        id: "m5q15_a",
        label: "Aceitar tudo sem ler, para economizar tempo",
      },
      {
        id: "m5q15_b",
        label: "Comparar a mudança, aceitar o que melhora e reverter o resto",
      },
      {
        id: "m5q15_c",
        label: "Apagar o documento e começar do zero, sem revisar",
      },
      {
        id: "m5q15_d",
        label: "Pedir que mude também a versão do seu colega",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback: "Editar em conjunto exige revisão. Você decide qual versão fica.",
  },
  {
    id: "m5q16",
    question:
      "Qual modelo do Claude serve para uma tarefa simples e repetitiva, como classificar e-mails?",
    options: [
      {
        id: "m5q16_a",
        label: "Sempre o maior modelo, mesmo quando a tarefa é simples",
      },
      {
        id: "m5q16_b",
        label: "Um modelo rápido para o simples e outro capaz para o complexo",
      },
      {
        id: "m5q16_c",
        label: "Nenhum: deve ser sempre feito à mão",
      },
      {
        id: "m5q16_d",
        label: "O de nome mais longo, sem nenhum outro critério",
      },
    ],
    correctAnswer: "m5q16_b",
    topic: "Limites e erros",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "Escolha o modelo pela tarefa: rápido e econômico para o simples, mais capaz para o complexo. Assim você economiza tempo e custo.",
  },
  {
    id: "m5q17",
    question: "Qual é a melhor prática ao escrever instruções para um Projeto?",
    options: [
      {
        id: "m5q17_a",
        label: "Escrever uma frase genérica sobre o tema",
      },
      {
        id: "m5q17_b",
        label: "Descrever papel, objetivo, regras, tom e exemplos",
      },
      {
        id: "m5q17_c",
        label: "Colar o manual completo da empresa sem resumir",
      },
      {
        id: "m5q17_d",
        label: "Pedir que 'faça o que quiser' sobre o tema",
      },
    ],
    correctAnswer: "m5q17_b",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Boas instruções combinam papel, objetivo, regras e exemplos. Elas são a base para que cada conversa do Projeto seja consistente.",
  },
  {
    id: "m5q18",
    question:
      "Um colega pede que você compartilhe um relatório gerado com o Claude que contém dados confidenciais da empresa. O que você faz?",
    options: [
      {
        id: "m5q18_a",
        label: "Envio completo, porque é meu colega",
      },
      {
        id: "m5q18_b",
        label: "Verifico a classificação e compartilho só o permitido",
      },
      {
        id: "m5q18_c",
        label: "Publico nas redes para que todos vejam",
      },
      {
        id: "m5q18_d",
        label: "Dou minha senha para que abra a pasta",
      },
    ],
    correctAnswer: "m5q18_b",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Uma ferramenta gerar um documento não muda o nível de confidencialidade. Compartilhe só o que a política permite.",
  },
  {
    id: "m5q19",
    question:
      "Que papel tem o 'agente' em uma tarefa de várias etapas, como organizar arquivos e redigir um resumo?",
    options: [
      {
        id: "m5q19_a",
        label:
          "Executa etapas rumo ao objetivo que você definiu, sob supervisão",
      },
      {
        id: "m5q19_b",
        label: "Age sem que ninguém saiba ou revise",
      },
      {
        id: "m5q19_c",
        label: "Substitui sua conta de e-mail",
      },
      {
        id: "m5q19_d",
        label: "Não existe no Claude; é só uma ideia",
      },
    ],
    correctAnswer: "m5q19_a",
    topic: "Delegar com o Claude",
    difficulty: "difícil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um agente executa etapas rumo a um objetivo. A boa prática é definir o alcance, pedir confirmação em ações importantes e revisar o resultado.",
  },
  {
    id: "m5q20",
    question:
      "Por que é útil que o Claude explique seus passos antes de executar uma ação importante?",
    options: [
      {
        id: "m5q20_a",
        label: "Para aumentar o tempo de espera sem motivo",
      },
      {
        id: "m5q20_b",
        label:
          "Para detectar erros de interpretação antes de terem consequências",
      },
      {
        id: "m5q20_c",
        label: "Porque o Claude não pode executar nada",
      },
      {
        id: "m5q20_d",
        label: "Para impedir que o usuário leia a resposta",
      },
    ],
    correctAnswer: "m5q20_b",
    topic: "Supervisão",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Revisar o plano antes da ação evita erros caros. Faz parte de delegar com critério.",
  },
  {
    id: "m5q21",
    question:
      "Que tipo de informação é mais arriscado compartilhar com qualquer ferramenta de IA?",
    options: [
      {
        id: "m5q21_a",
        label: "Uma lista de temas para um blog",
      },
      {
        id: "m5q21_b",
        label: "Senhas, dados bancários e identidades de outras pessoas",
      },
      {
        id: "m5q21_c",
        label: "Um texto de exemplo sem dados reais",
      },
      {
        id: "m5q21_d",
        label: "Um esquema de aula com temas gerais",
      },
    ],
    correctAnswer: "m5q21_b",
    topic: "Privacidade e dados",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Nunca compartilhe senhas nem dados sensíveis de terceiros. Use dados fictícios sempre que puder.",
  },
  {
    id: "m5q22",
    question:
      "O Claude dá uma resposta correta sobre um tema que mudou depois da sua última atualização. O que fazer?",
    options: [
      {
        id: "m5q22_a",
        label: "Confiar sempre no que diz a IA",
      },
      {
        id: "m5q22_b",
        label: "Pedir informação atual ou verificar em uma fonte recente",
      },
      {
        id: "m5q22_c",
        label: "Ignorar qualquer dado recente por completo",
      },
      {
        id: "m5q22_d",
        label: "Trocar a data do documento para parecer recente",
      },
    ],
    correctAnswer: "m5q22_b",
    topic: "Limites e erros",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "Os modelos nem sempre conhecem o mais recente. Para dados que mudam, use busca ou uma fonte atual.",
  },
  {
    id: "m5q23",
    question: "Qual destas é uma boa forma de criar um Artifact interativo?",
    options: [
      {
        id: "m5q23_a",
        label: "Pedir 'algo bonito' sem descrever o que deve fazer",
      },
      {
        id: "m5q23_b",
        label: "Descrever uso, dados de entrada e resultado esperado, e iterar",
      },
      {
        id: "m5q23_c",
        label: "Copiar o código do app de outra empresa",
      },
      {
        id: "m5q23_d",
        label: "Nunca testar antes de compartilhar com a equipe",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Descreva o uso e o resultado, peça ajustes pequenos e teste a peça antes de compartilhá-la.",
  },
  {
    id: "m5q24",
    question:
      "Qual é uma boa prática ao revisar um documento que o Claude escreveu para o seu cliente?",
    options: [
      {
        id: "m5q24_a",
        label: "Ler por cima, porque já está bem escrito",
      },
      {
        id: "m5q24_b",
        label: "Revisar dados, tom, nomes, datas e o sentido",
      },
      {
        id: "m5q24_c",
        label: "Enviar sem trocar o nome do cliente anterior",
      },
      {
        id: "m5q24_d",
        label: "Remover a assinatura para parecer neutro",
      },
    ],
    correctAnswer: "m5q24_b",
    topic: "Supervisão",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um texto bem escrito pode ter dados errados ou um nome trocado. A revisão humana é obrigatória.",
  },
  {
    id: "m5q25",
    question:
      "Você quer reutilizar em vários projetos o mesmo procedimento para redigir atas de reunião. O que criar?",
    options: [
      {
        id: "m5q25_a",
        label: "Uma Skill com instruções, modelo e um exemplo de ata",
      },
      {
        id: "m5q25_b",
        label: "Um chat novo cada vez, pedindo tudo de novo",
      },
      {
        id: "m5q25_c",
        label: "Uma senha para proteger o documento",
      },
      {
        id: "m5q25_d",
        label: "Um e-mail para o Claude com o procedimento completo",
      },
    ],
    correctAnswer: "m5q25_a",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O que você repete vira Skill: o procedimento fica igual a cada vez e você economiza tempo.",
  },
  {
    id: "m5q26",
    question: "Qual afirmação sobre IA e trabalho é a mais responsável?",
    options: [
      {
        id: "m5q26_a",
        label: "A IA substitui por completo a revisão humana",
      },
      {
        id: "m5q26_b",
        label: "A IA acelera o trabalho, mas a decisão é humana",
      },
      {
        id: "m5q26_c",
        label: "Usar IA é sempre uma forma de trapaça",
      },
      {
        id: "m5q26_d",
        label: "Nunca se deve dizer que a IA foi usada",
      },
    ],
    correctAnswer: "m5q26_b",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "A IA acelera o trabalho. A decisão e suas consequências continuam sendo da pessoa.",
  },
  {
    id: "m5q27",
    question:
      "Você quer que o Claude analise um arquivo grande de dados. O que faz para obter um resultado confiável?",
    options: [
      {
        id: "m5q27_a",
        label: "Pedir uma conclusão sem verificar o método",
      },
      {
        id: "m5q27_b",
        label: "Pedir os passos e validar uma amostra com seu próprio cálculo",
      },
      {
        id: "m5q27_c",
        label: "Usar só o primeiro resultado que aparecer",
      },
      {
        id: "m5q27_d",
        label: "Mudar os dados para que deem um resultado bonito",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Limites e erros",
    difficulty: "difícil",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Peça o método e valide uma amostra com um cálculo independente. Assim você detecta erros antes de decidir.",
  },
  {
    id: "m5q28",
    question:
      "O que convém definir primeiro antes de dar uma tarefa complexa ao Claude?",
    options: [
      {
        id: "m5q28_a",
        label: "A cor e a tipografia do documento",
      },
      {
        id: "m5q28_b",
        label: "O resultado, o critério de sucesso e os limites",
      },
      {
        id: "m5q28_c",
        label: "A quantidade de emojis no texto",
      },
      {
        id: "m5q28_d",
        label: "Nada: quanto menos se disser, melhor",
      },
    ],
    correctAnswer: "m5q28_b",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Definir o resultado, o critério de sucesso e os limites é o passo que mais agrega qualidade.",
  },
  {
    id: "m5q29",
    question:
      "Você recebe um e-mail de 'suporte do Claude' pedindo sua senha para 'verificar sua conta'. O que faz?",
    options: [
      {
        id: "m5q29_a",
        label: "Respondo com minha senha para não perder a conta",
      },
      {
        id: "m5q29_b",
        label:
          "Não respondo: verifico diretamente no app oficial e denuncio o e-mail",
      },
      {
        id: "m5q29_c",
        label: "Encaminho o e-mail para todos os meus contatos",
      },
      {
        id: "m5q29_d",
        label: "Clico no link do e-mail e digito minha senha ali",
      },
    ],
    correctAnswer: "m5q29_b",
    topic: "Privacidade e dados",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Nenhuma empresa séria pede sua senha por e-mail. Acesse sempre pelo app ou site oficial.",
  },
  {
    id: "m5q30",
    question:
      "Ao terminar um projeto com o Claude, qual prática deixa a melhor base para o próximo?",
    options: [
      {
        id: "m5q30_a",
        label: "Apagar tudo e não deixar registro",
      },
      {
        id: "m5q30_b",
        label:
          "Guardar instruções, modelos e aprendizados em um Projeto ou Skill",
      },
      {
        id: "m5q30_c",
        label: "Compartilhar o histórico completo com qualquer pessoa",
      },
      {
        id: "m5q30_d",
        label: "Esquecer o que funcionou para não repetir erros",
      },
    ],
    correctAnswer: "m5q30_b",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O que funciona deve ficar guardado em um Projeto ou em uma Skill. Assim cada novo trabalho parte do que você aprendeu.",
  },
];
