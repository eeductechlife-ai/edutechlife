export const MODULE_2_PT = [
  {
    id: "m2q1",
    question:
      "Você tem um CSV de vendas e quer descobrir quais produtos crescem mais. Qual combinação de ferramentas é a mais útil?",
    options: [
      {
        id: "m2q1_a",
        label: "Interpretador de Código no CSV e Busca na Web para tendências",
      },
      {
        id: "m2q1_b",
        label: "Canvas para colar os dados e DALL-E para os gráficos",
      },
      { id: "m2q1_c", label: "Só Busca na Web para ler artigos do mercado" },
      {
        id: "m2q1_d",
        label: "DALL-E 3 para analisar o arquivo automaticamente",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "Ferramentas ChatGPT",
    difficulty: "médio",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "O Interpretador analisa o CSV e a Busca na Web traz dados do mercado. Pratique no laboratório.",
  },
  {
    id: "m2q2",
    question:
      "Um escritório quer um GPT para redigir contratos com modelos e jurisprudência atual. Qual configuração é a adequada?",
    options: [
      {
        id: "m2q2_a",
        label: "Prompt jurídico + base de conhecimento + function calling",
      },
      {
        id: "m2q2_b",
        label: "Um prompt que só diga que você é um assistente jurídico",
      },
      {
        id: "m2q2_c",
        label: "Ativar Busca na Web e DALL-E para procurar contratos",
      },
      { id: "m2q2_d", label: "Um GPT sem instruções, só com análise de dados" },
    ],
    correctAnswer: "m2q2_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "Um GPT útil combina prompt especializado, base de conhecimento e function calling.",
  },
  {
    id: "m2q3",
    question:
      'Um GPT usa function calling para ler pedidos. O usuário escreve "Onde vai o pedido #789, email ana@exemplo.com?" O que acontece internamente?',
    options: [
      {
        id: "m2q3_a",
        label: "Extrai #789 e o email e executa a função do pedido",
      },
      {
        id: "m2q3_b",
        label: "Pede ao usuário para preencher um formulário separado",
      },
      { id: "m2q3_c", label: "Procura o número do pedido na internet" },
      { id: "m2q3_d", label: "Envia a mensagem completa à API sem processar" },
    ],
    correctAnswer: "m2q3_a",
    topic: "Function Calling",
    difficulty: "difícil",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "Function calling extrai os parâmetros e executa a função. Reveja o tema no módulo.",
  },
  {
    id: "m2q4",
    question: "O que o function calling permite com a API do ChatGPT?",
    options: [
      {
        id: "m2q4_a",
        label: "Conectar o ChatGPT a APIs, bancos de dados e serviços externos",
      },
      {
        id: "m2q4_b",
        label: "Ligar por telefone para o suporte técnico do usuário",
      },
      { id: "m2q4_c", label: "Criar funções matemáticas mais rápidas no chat" },
      {
        id: "m2q4_d",
        label: "Baixar automaticamente todos os plugins disponíveis",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Function calling conecta o ChatGPT ao mundo real. Reveja o guia de GPTs.",
  },
  {
    id: "m2q5",
    question:
      "Um community manager recebe muitas perguntas frequentes por dia. Como automatizar melhor as respostas com um GPT?",
    options: [
      { id: "m2q5_a", label: "GPT com tom da marca, FAQs e conexão por API" },
      {
        id: "m2q5_b",
        label: "Responder cada comentário à mão com o ChatGPT padrão",
      },
      { id: "m2q5_c", label: "Deixar a Busca na Web responder os comentários" },
      { id: "m2q5_d", label: "Gerar imagens e publicá-las como respostas" },
    ],
    correctAnswer: "m2q5_a",
    topic: "Automação",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "Um GPT com instruções, base de conhecimento e API automatiza respostas. Pratique no laboratório.",
  },
  {
    id: "m2q6",
    question:
      "Um GPT de reclamações às vezes dá dados errados sobre devoluções. Qual é a melhor prática responsável?",
    options: [
      {
        id: "m2q6_a",
        label: "Revisão humana e alertas quando a IA tiver dúvida",
      },
      { id: "m2q6_b", label: "Desligar a IA e responder tudo à mão" },
      { id: "m2q6_c", label: "Ignorar os erros por causa da velocidade" },
      { id: "m2q6_d", label: "Dar só respostas genéricas sem dados" },
    ],
    correctAnswer: "m2q6_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "A IA acelera e a pessoa confere. Reveja as boas práticas de uso responsável.",
  },
  {
    id: "m2q7",
    question:
      "Uma equipe de vendas quer compartilhar conhecimento atualizado de produtos. Qual estratégia é a melhor?",
    options: [
      {
        id: "m2q7_a",
        label: "Um Projeto compartilhado com uma base de conhecimento comum",
      },
      { id: "m2q7_b", label: "Cada vendedor guarda as próprias instruções" },
      { id: "m2q7_c", label: "Usar um GPT público que todos baixem" },
      { id: "m2q7_d", label: "Compartilhar capturas de chats por e-mail" },
    ],
    correctAnswer: "m2q7_a",
    topic: "Projetos ChatGPT",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Projetos agrupam conversas com instruções e arquivos compartilhados. Reveja o guia.",
  },
  {
    id: "m2q8",
    question:
      "Você quer que um GPT consulte um catálogo que atualiza diariamente. O que você ativa?",
    options: [
      {
        id: "m2q8_a",
        label: "Base de conhecimento e Actions (API) para dados vivos",
      },
      {
        id: "m2q8_b",
        label: "Pedir ao usuário para colar o catálogo toda vez",
      },
      { id: "m2q8_c", label: "Gerar imagens do catálogo com DALL-E" },
      { id: "m2q8_d", label: "Não é possível consultar dados atualizados" },
    ],
    correctAnswer: "m2q8_a",
    topic: "GPTs Personalizados",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "A base guarda o estático e as Actions trazem o que muda. Reveja o laboratório de GPTs.",
  },
  {
    id: "m2q9",
    question:
      "Você vai publicar na GPT Store um GPT que usa na sua empresa. O que você verifica primeiro?",
    options: [
      { id: "m2q9_a", label: "Se ele guarda dados sensíveis da sua empresa" },
      { id: "m2q9_b", label: "Se o nome é chamativo o bastante" },
      { id: "m2q9_c", label: "Se tem funções para justificar o preço" },
      { id: "m2q9_d", label: "Se o logotipo parece profissional" },
    ],
    correctAnswer: "m2q9_a",
    topic: "Privacidade GPT",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Antes de publicar, confira se não há dados confidenciais. Reveja o tema de privacidade.",
  },
  {
    id: "m2q10",
    question:
      "Você quer que o ChatGPT detecte reclamações urgentes nas redes e avise o suporte. Qual combinação você usa?",
    options: [
      {
        id: "m2q10_a",
        label: "Um GPT com Actions (API) conectado a um webhook",
      },
      { id: "m2q10_b", label: "ChatGPT padrão com a Busca na Web ativada" },
      {
        id: "m2q10_c",
        label: "DALL-E para responder aos comentários com imagens",
      },
      {
        id: "m2q10_d",
        label: "Canvas para revisar e editar cada comentário à mão",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "Automação",
    difficulty: "difícil",
    source: "OVA: Fluxos de Automação no Mundo Real",
    feedback:
      "Um GPT com Actions e webhook automatiza o alerta. Revise o OVA de automação.",
  },
  {
    id: "m2q11",
    question: "O que é o ChatGPT em essência?",
    options: [
      {
        id: "m2q11_a",
        label: "Um modelo de linguagem conversacional que responde às suas instruções",
      },
      { id: "m2q11_b", label: "Uma planilha eletrônica com funções de inteligência artificial" },
      { id: "m2q11_c", label: "Um buscador que devolve sempre links da internet para você" },
      { id: "m2q11_d", label: "Um programa para desenhar imagens sem escrever absolutamente nada" },
    ],
    correctAnswer: "m2q11_a",
    topic: "ChatGPT Básico",
    difficulty: "fácil",
    source: "Vídeo: ChatGPT do Zero em 6 Minutos",
    feedback:
      "O ChatGPT é um modelo conversacional: você dá instruções e ele gera texto. Veja o vídeo.",
  },
  {
    id: "m2q12",
    question:
      "Por padrão, o que convém lembrar sobre a informação que o ChatGPT fornece?",
    options: [
      {
        id: "m2q12_a",
        label: "Pode estar desatualizada, então verifique os dados críticos antes de usar",
      },
      { id: "m2q12_b", label: "Sempre conhece todas as notícias do dia em tempo real" },
      { id: "m2q12_c", label: "Nunca comete erros com datas exatas nem com números exatos" },
      { id: "m2q12_d", label: "Só responde com links verificados de portais oficiais públicos" },
    ],
    correctAnswer: "m2q12_a",
    topic: "Modelos e Capacidades",
    difficulty: "fácil",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Sem ferramentas de busca, o conhecimento tem uma data de corte: verifique o importante.",
  },
  {
    id: "m2q13",
    question: "Para qual tarefa é mais apropriado ativar a Busca na Web?",
    options: [
      {
        id: "m2q13_a",
        label: "Para consultar notícias, preços ou dados recentes que mudam muito rápido",
      },
      { id: "m2q13_b", label: "Para gerar uma imagem decorativa a partir de uma descrição" },
      { id: "m2q13_c", label: "Para fazer cálculos com um arquivo de vendas local no computador" },
      { id: "m2q13_d", label: "Para criar um GPT personalizado com ações próprias dele" },
    ],
    correctAnswer: "m2q13_a",
    topic: "Busca na Web",
    difficulty: "médio",
    source: "OVA: Explore o Ecossistema ChatGPT",
    feedback:
      "A Busca na Web traz informação atualizada da internet. Explore o OVA do ecossistema.",
  },
  {
    id: "m2q14",
    question: "Você tem um CSV e precisa calcular médias e tendências. O que usa?",
    options: [
      {
        id: "m2q14_a",
        label: "O Interpretador de Código, que executa a análise sobre o arquivo",
      },
      { id: "m2q14_b", label: "A Busca na Web para ler artigos sobre o setor" },
      { id: "m2q14_c", label: "O DALL-E 3 para transformar o CSV em uma imagem de barras" },
      { id: "m2q14_d", label: "O Canvas para reescrever cada linha do arquivo à mão" },
    ],
    correctAnswer: "m2q14_a",
    topic: "Interpretador de Código",
    difficulty: "médio",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "O Interpretador de Código executa o cálculo sobre o arquivo. Pratique no laboratório.",
  },
  {
    id: "m2q15",
    question: "Você precisa de uma imagem ilustrativa para uma publicação. Qual usa?",
    options: [
      {
        id: "m2q15_a",
        label: "O DALL-E 3, descrevendo a cena que você quer gerar em detalhe",
      },
      { id: "m2q15_b", label: "O Interpretador de Código, escrevendo uma fórmula nova no chat" },
      { id: "m2q15_c", label: "A Busca na Web, para copiar qualquer imagem encontrada no portal" },
      { id: "m2q15_d", label: "Um Projeto, agrupando os arquivos da equipe da sua área" },
    ],
    correctAnswer: "m2q15_a",
    topic: "DALL-E",
    difficulty: "médio",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "O DALL-E 3 gera imagens a partir de uma descrição detalhada. Revise o laboratório.",
  },
  {
    id: "m2q16",
    question:
      "Você quer editar um texto longo destacando mudanças sem perder a versão original. O que usa?",
    options: [
      {
        id: "m2q16_a",
        label: "O Canvas, que permite editar e reescrever sobre um documento de trabalho",
      },
      { id: "m2q16_b", label: "O DALL-E 3, para transformar o texto em uma imagem completa" },
      { id: "m2q16_c", label: "A Busca na Web, para achar o mesmo texto já publicado online" },
      { id: "m2q16_d", label: "O Interpretador de Código, para apagar o parágrafo original" },
    ],
    correctAnswer: "m2q16_a",
    topic: "Canvas",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "O Canvas é o espaço para escrever e editar textos e código com controle de mudanças.",
  },
  {
    id: "m2q17",
    question: "Para que serve um Projeto no ChatGPT?",
    options: [
      {
        id: "m2q17_a",
        label: "Para agrupar conversas, arquivos e instruções de um trabalho",
      },
      { id: "m2q17_b", label: "Para publicar um GPT na loja oficial da plataforma" },
      { id: "m2q17_c", label: "Para gerar imagens com estilo consistente de marca" },
      { id: "m2q17_d", label: "Para se conectar à internet com a Busca na Web ativada" },
    ],
    correctAnswer: "m2q17_a",
    topic: "Projetos ChatGPT",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Os Projetos reúnem contexto e arquivos para trabalhar de forma contínua.",
  },
  {
    id: "m2q18",
    question: "Você quer que o ChatGPT analise um PDF que está no seu computador. O que faz?",
    options: [
      {
        id: "m2q18_a",
        label: "Você envia o arquivo na conversa e pede para trabalhar sobre ele",
      },
      { id: "m2q18_b", label: "Você transcreve à mão todo o PDF dentro da sua mensagem" },
      { id: "m2q18_c", label: "Você pede para ele procurar online e resumir sozinho o arquivo" },
      { id: "m2q18_d", label: "Você pede para ele desenhar o PDF com a ferramenta DALL-E" },
    ],
    correctAnswer: "m2q18_a",
    topic: "Arquivos",
    difficulty: "fácil",
    source: "Vídeo: ChatGPT do Zero em 6 Minutos",
    feedback:
      "Você pode anexar arquivos e trabalhar sobre eles. Revise o vídeo de introdução.",
  },
  {
    id: "m2q19",
    question:
      "O Interpretador de Código te dá um gráfico de vendas. Qual é o passo mais responsável?",
    options: [
      {
        id: "m2q19_a",
        label: "Revisar se os dados e o cálculo correspondem ao seu arquivo real",
      },
      { id: "m2q19_b", label: "Publicar o gráfico sem revisar porque o código o fez" },
      { id: "m2q19_c", label: "Assumir que qualquer resultado do código está correto" },
      { id: "m2q19_d", label: "Mudar os eixos até que o gráfico apenas pareça melhor" },
    ],
    correctAnswer: "m2q19_a",
    topic: "Análise de Dados",
    difficulty: "difícil",
    source: "OVA: Laboratório de Ferramentas ChatGPT",
    feedback:
      "Verifique entradas, premissas e resultados antes de decidir com eles. Revise o laboratório.",
  },
  {
    id: "m2q20",
    question:
      "Você deve comparar seu CSV com tendências atuais do setor. Qual combinação é melhor?",
    options: [
      {
        id: "m2q20_a",
        label: "Interpretador de Código para o CSV e Busca na Web para as tendências",
      },
      { id: "m2q20_b", label: "DALL-E 3 para graficar e Canvas para buscar na internet" },
      { id: "m2q20_c", label: "Um Projeto vazio, sem arquivos e sem instruções concretas" },
      { id: "m2q20_d", label: "Só a Busca na Web, ignorando por completo os seus dados" },
    ],
    correctAnswer: "m2q20_a",
    topic: "Ferramentas ChatGPT",
    difficulty: "médio",
    source: "OVA: Fluxos de Automação no Mundo Real",
    feedback:
      "Combine ferramentas: os dados locais com o Interpretador e o contexto atual com a Busca.",
  },
  {
    id: "m2q21",
    question: "O que é um GPT personalizado?",
    options: [
      {
        id: "m2q21_a",
        label: "Uma versão do ChatGPT com instruções, conhecimento e ações próprias",
      },
      { id: "m2q21_b", label: "Um modelo novo treinado do zero por cada estudante do curso" },
      { id: "m2q21_c", label: "Um buscador que só responde sobre um tema bem específico" },
      { id: "m2q21_d", label: "Um arquivo PDF que se carrega sozinho e responde perguntas" },
    ],
    correctAnswer: "m2q21_a",
    topic: "GPTs Personalizados",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Um GPT personalizado define seu papel, seu conhecimento e suas capacidades. Revise a guia.",
  },
  {
    id: "m2q22",
    question: "Onde se definem o papel e as regras de um GPT personalizado?",
    options: [
      {
        id: "m2q22_a",
        label: "Nas suas instruções (system prompt), que orientam o comportamento",
      },
      { id: "m2q22_b", label: "Na cor e no logo escolhidos para a loja oficial" },
      { id: "m2q22_c", label: "Na quantidade de conversas que cada usuário acumula" },
      { id: "m2q22_d", label: "No preço que é atribuído a ele dentro da loja" },
    ],
    correctAnswer: "m2q22_a",
    topic: "Instruções GPT",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "As instruções (papel, tom e regras) definem como o GPT responde. Revise a guia.",
  },
  {
    id: "m2q23",
    question: "Um GPT deve responder com as políticas internas da empresa. O que configura?",
    options: [
      {
        id: "m2q23_a",
        label: "Uma base de conhecimento com esses documentos e regras internas",
      },
      { id: "m2q23_b", label: "Só um tom amável, sem nenhuma fonte de informação" },
      { id: "m2q23_c", label: "O DALL-E 3 ativado para ilustrar cada resposta possível" },
      { id: "m2q23_d", label: "A Busca na Web, mesmo que as políticas não estejam publicadas" },
    ],
    correctAnswer: "m2q23_a",
    topic: "Base de Conhecimento",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "A base de conhecimento é onde vive a informação própria do GPT. Pratique no laboratório.",
  },
  {
    id: "m2q24",
    question: "Um GPT deve consultar um catálogo que muda todos os dias. O que usa?",
    options: [
      {
        id: "m2q24_a",
        label: "Actions (API) para trazer os dados vivos do sistema externo",
      },
      { id: "m2q24_b", label: "Uma base de conhecimento, ainda que fique desatualizada rápido" },
      { id: "m2q24_c", label: "Instruções novas, escrevendo o catálogo à mão dentro do papel" },
      { id: "m2q24_d", label: "O DALL-E 3, para gerar imagens de cada produto do catálogo" },
    ],
    correctAnswer: "m2q24_a",
    topic: "Actions / APIs",
    difficulty: "difícil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Para dados que mudam, as Actions (API) trazem informação viva. Revise a guia.",
  },
  {
    id: "m2q25",
    question: "O que o Function Calling faz quando o usuário pede algo concreto?",
    options: [
      {
        id: "m2q25_a",
        label: "Extrai os parâmetros necessários e executa a função definida",
      },
      { id: "m2q25_b", label: "Gera uma imagem que explica o pedido feito pelo usuário" },
      { id: "m2q25_c", label: "Pede ao usuário que reescreva a mensagem mais devagar" },
      { id: "m2q25_d", label: "Responde sempre com texto genérico sem usar nenhum dado" },
    ],
    correctAnswer: "m2q25_a",
    topic: "Function Calling",
    difficulty: "difícil",
    source: "Guia de GPTs e Ações",
    feedback:
      "O modelo detecta a intenção, extrai parâmetros e chama a função. Revise a guia.",
  },
  {
    id: "m2q26",
    question: "Você compartilha seu GPT com outras pessoas na GPT Store. O que isso implica?",
    options: [
      {
        id: "m2q26_a",
        label: "Definir quem pode usá-lo e se ele guarda informação sensível",
      },
      { id: "m2q26_b", label: "Perder o acesso a todas as suas conversas anteriores do chat" },
      { id: "m2q26_c", label: "O GPT deixar de aceitar arquivos nas suas respostas seguintes" },
      { id: "m2q26_d", label: "As Actions criadas serem apagadas de forma automática" },
    ],
    correctAnswer: "m2q26_a",
    topic: "GPT Store",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "Antes de compartilhar, defina o alcance e proteja dados sensíveis. Revise a guia.",
  },
  {
    id: "m2q27",
    question:
      "Você vai publicar um GPT que construiu com dados do trabalho. O que revisa primeiro?",
    options: [
      {
        id: "m2q27_a",
        label: "Que ele não exponha informação confidencial da empresa nem de clientes",
      },
      { id: "m2q27_b", label: "Que o nome dele seja curto e fácil de todos recordarem" },
      { id: "m2q27_c", label: "Que inclua a maior quantidade de capacidades possível" },
      { id: "m2q27_d", label: "Que a descrição dele tenha muitas palavras-chave da moda" },
    ],
    correctAnswer: "m2q27_a",
    topic: "Privacidade GPT",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "O primeiro é não vazar dados confidenciais. Revise o tema de privacidade de GPTs.",
  },
  {
    id: "m2q28",
    question:
      "Você quer que seu GPT responda só sobre um tema e não invente em outros. O que faz?",
    options: [
      {
        id: "m2q28_a",
        label: "Limita o alcance e as fontes, e orienta dizer 'não sei' se for o caso",
      },
      { id: "m2q28_b", label: "Pede para ele responder com segurança sobre qualquer tema" },
      { id: "m2q28_c", label: "Ativa todas as capacidades para improvisar se faltar dado" },
      { id: "m2q28_d", label: "Orienta preencher as lacunas com informação aproximada e inventada" },
    ],
    correctAnswer: "m2q28_a",
    topic: "Escopo do GPT",
    difficulty: "fácil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Limitar o escopo e permitir 'não sei' reduz as alucinações. Revise a guia.",
  },
  {
    id: "m2q29",
    question: "Um GPT de atendimento deve responder com o tom da marca. O que configura?",
    options: [
      {
        id: "m2q29_a",
        label: "Instruções de tom e estilo, com exemplos de respostas da marca",
      },
      { id: "m2q29_b", label: "Só a Busca na Web, para copiar o tom de outros sites" },
      { id: "m2q29_c", label: "O DALL-E 3, para que as respostas sempre incluam imagens" },
      { id: "m2q29_d", label: "Nada: o tom se ajusta sozinho conforme a primeira mensagem" },
    ],
    correctAnswer: "m2q29_a",
    topic: "Instruções GPT",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Defina tom, regras e exemplos nas instruções para manter a voz da marca.",
  },
  {
    id: "m2q30",
    question: "Depois de criar seu GPT, qual é um bom próximo passo?",
    options: [
      {
        id: "m2q30_a",
        label: "Testá-lo com casos reais e ajustar instruções ou conhecimento",
      },
      { id: "m2q30_b", label: "Publicá-lo de imediato sem fazer nenhum teste antes" },
      { id: "m2q30_c", label: "Apagar as regras, porque limitam as respostas livres dele" },
      { id: "m2q30_d", label: "Adicionar capacidades novas mesmo sem ajudar na tarefa" },
    ],
    correctAnswer: "m2q30_a",
    topic: "Iteração do GPT",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "Iterar com casos reais melhora o GPT. Pratique no laboratório de construção de GPTs.",
  },
  {
    id: "m2q31",
    question:
      "O GPT de suporte responde com muita segurança mas às vezes erra. O que você faz?",
    options: [
      {
        id: "m2q31_a",
        label: "Acrescentar supervisão e passos de verificação no fluxo de atendimento",
      },
      { id: "m2q31_b", label: "Confiar nele porque responde com um tom muito seguro" },
      { id: "m2q31_c", label: "Desligar a IA e responder tudo à mão para sempre" },
      { id: "m2q31_d", label: "Ocultar as fontes para o usuário não perguntar mais nada" },
    ],
    correctAnswer: "m2q31_a",
    topic: "Uso Responsável",
    difficulty: "fácil",
    source: "Guia Completa de ChatGPT",
    feedback:
      "A segurança do tom não garante acerto: acrescente verificação. Revise a guia.",
  },
  {
    id: "m2q32",
    question: "Um GPT deve usar dados de clientes. Qual prática é a mais adequada?",
    options: [
      {
        id: "m2q32_a",
        label: "Minimizar e anonimizar os dados, e limitar quem pode acessar",
      },
      { id: "m2q32_b", label: "Carregar todos os dados disponíveis porque ajudam o contexto" },
      { id: "m2q32_c", label: "Compartilhá-los na GPT Store para melhorar o modelo global" },
      { id: "m2q32_d", label: "Guardá-los nas instruções para não buscá-los depois" },
    ],
    correctAnswer: "m2q32_a",
    topic: "Privacidade GPT",
    difficulty: "médio",
    source: "Guia de GPTs e Ações",
    feedback:
      "Minimize e anonimize os dados e controle o acesso. Revise o tema de privacidade.",
  },
  {
    id: "m2q33",
    question:
      "Você quer automatizar alertas de queixas urgentes sem perder o controle humano. Qual é o melhor desenho?",
    options: [
      {
        id: "m2q33_a",
        label: "Um GPT com Actions que detecta e notifica, deixando a decisão para uma pessoa",
      },
      { id: "m2q33_b", label: "Um GPT que responde e resolve todas as queixas sem supervisão" },
      { id: "m2q33_c", label: "Um GPT que só traduz as queixas para um outro idioma" },
      { id: "m2q33_d", label: "Um GPT que responde com imagens em vez de soluções reais" },
    ],
    correctAnswer: "m2q33_a",
    topic: "Automação",
    difficulty: "difícil",
    source: "OVA: Fluxos de Automação no Mundo Real",
    feedback:
      "Automatize a detecção e o aviso e deixe a decisão-chave para a pessoa. Revise o OVA.",
  },
  {
    id: "m2q34",
    question:
      "Você recebe muitas perguntas repetidas todos os dias. Como automatiza melhor com um GPT?",
    options: [
      {
        id: "m2q34_a",
        label: "Instruções + base de conhecimento + conexão por API para responder",
      },
      { id: "m2q34_b", label: "Responder uma por uma usando o ChatGPT padrão sem configurar" },
      { id: "m2q34_c", label: "Deixar a Busca na Web responder o que encontrar primeiro" },
      { id: "m2q34_d", label: "Gerar uma imagem diferente para cada pergunta frequente" },
    ],
    correctAnswer: "m2q34_a",
    topic: "Automação",
    difficulty: "médio",
    source: "OVA: Construa um GPT",
    feedback:
      "Um GPT com instruções, conhecimento e API automatiza o repetitivo. Pratique no laboratório.",
  },
  {
    id: "m2q35",
    question: "Qual é a melhor maneira de pedir algo ao ChatGPT?",
    options: [
      {
        id: "m2q35_a",
        label: "Com uma instrução clara que indique tarefa, contexto e formato",
      },
      { id: "m2q35_b", label: "Com uma palavra solta e confiando que ele adivinhe bem" },
      { id: "m2q35_c", label: "Repetindo a mesma mensagem muitas vezes seguidas" },
      { id: "m2q35_d", label: "Escrevendo em letras maiúsculas para ele entender melhor" },
    ],
    correctAnswer: "m2q35_a",
    topic: "ChatGPT Básico",
    difficulty: "fácil",
    source: "Vídeo: ChatGPT do Zero em 6 Minutos",
    feedback:
      "Tarefa, contexto e formato: uma instrução clara rende melhor. Revise o vídeo.",
  },
  {
    id: "m2q36",
    question:
      "Qual é a diferença principal entre as ferramentas integradas e um GPT personalizado?",
    options: [
      {
        id: "m2q36_a",
        label: "A ferramenta resolve tarefas pontuais; o GPT reúne papel e regras próprias",
      },
      { id: "m2q36_b", label: "Nenhuma: são exatamente a mesma função com nome diferente" },
      { id: "m2q36_c", label: "A ferramenta é paga e o GPT é sempre gratuito para usar" },
      { id: "m2q36_d", label: "A ferramenta gera imagens e o GPT apenas escreve código" },
    ],
    correctAnswer: "m2q36_a",
    topic: "Ecossistema ChatGPT",
    difficulty: "médio",
    source: "OVA: Explore o Ecossistema ChatGPT",
    feedback:
      "As ferramentas cobrem tarefas pontuais; um GPT empacota papel, conhecimento e ações.",
  },
  {
    id: "m2q37",
    question:
      "A informação do seu GPT muda pouco, mas deve estar sempre disponível. O que escolhe?",
    options: [
      {
        id: "m2q37_a",
        label: "Base de conhecimento para o estável e Actions para o que muda",
      },
      { id: "m2q37_b", label: "Escrever toda a informação dentro das instruções do papel" },
      { id: "m2q37_c", label: "Só a Busca na Web, ignorando os seus próprios documentos" },
      { id: "m2q37_d", label: "Gerar imagens dos documentos com a ferramenta DALL-E" },
    ],
    correctAnswer: "m2q37_a",
    topic: "Arquitetura do GPT",
    difficulty: "difícil",
    source: "Guia de GPTs e Ações",
    feedback:
      "O estável vai na base de conhecimento; o vivo, nas Actions. Revise a guia.",
  },
  {
    id: "m2q38",
    question:
      "Uma equipe quer compartilhar o conhecimento dos produtos com o ChatGPT. Qual opção é melhor?",
    options: [
      {
        id: "m2q38_a",
        label: "Um Projeto compartilhado com arquivos e instruções comuns à equipe",
      },
      { id: "m2q38_b", label: "Que cada pessoa guarde as suas próprias notas separadas" },
      { id: "m2q38_c", label: "Compartilhar capturas de tela dos chats por e-mail" },
      { id: "m2q38_d", label: "Um GPT público que cada vendedor baixe por conta própria" },
    ],
    correctAnswer: "m2q38_a",
    topic: "Projetos ChatGPT",
    difficulty: "médio",
    source: "Guia Completa de ChatGPT",
    feedback:
      "Os Projetos compartilham arquivos e instruções com a equipe. Revise a guia.",
  },
  {
    id: "m2q39",
    question:
      "Um GPT de suporte inventa políticas que não existem. Qual é a melhor correção?",
    options: [
      {
        id: "m2q39_a",
        label: "Ancorar as respostas na base de conhecimento e exigir citar a fonte",
      },
      { id: "m2q39_b", label: "Elevar o tom de confiança para ele responder mais seguro" },
      { id: "m2q39_c", label: "Remover a base de conhecimento para ele ficar mais criativo" },
      { id: "m2q39_d", label: "Desativar a verificação para ele responder muito mais rápido" },
    ],
    correctAnswer: "m2q39_a",
    topic: "Alucinações do GPT",
    difficulty: "difícil",
    source: "Guia de GPTs e Ações",
    feedback:
      "Ancore as respostas nas fontes e peça para citá-las para reduzir invenções. Revise a guia.",
  },
  {
    id: "m2q40",
    question:
      "Caso: montar um GPT de suporte que use dados vivos e encaminhe casos complexos. Qual é o desenho mais completo?",
    options: [
      {
        id: "m2q40_a",
        label: "Instruções + base de conhecimento + Actions por API + encaminhar a um humano",
      },
      { id: "m2q40_b", label: "Só um system prompt que diga que você é um agente de suporte" },
      { id: "m2q40_c", label: "Busca na Web ativada e nenhuma fonte própria da empresa" },
      { id: "m2q40_d", label: "DALL-E 3 para responder com imagens em vez de soluções" },
    ],
    correctAnswer: "m2q40_a",
    topic: "Arquitetura do GPT",
    difficulty: "difícil",
    source: "OVA: Fluxos de Automação no Mundo Real",
    feedback:
      "O fluxo ideal combina papel, conhecimento, dados vivos por API e supervisão humana.",
  },
];
