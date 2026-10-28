export const learningObjectives = [
  "Compreender o conceito de IA baseada em fontes próprias",
  "Aprender a criar e gerenciar notebooks no Gemini Notebook",
  "Diferenciar o Gemini Notebook de chatbots tradicionais",
  "Aplicar estratégias de pesquisa com documentos próprios",
];

export const furtherReading = [
  {
    title: "Gemini Notebook Guide — Google",
    url: "https://notebooklm.google.com/",
    description: "Plataforma oficial do Gemini Notebook do Google.",
  },
  {
    title: "How to Use Gemini Notebook for Research",
    url: "https://blog.google/technology/ai/notebooklm/",
    description: "Guia oficial do Google sobre como usar o Gemini Notebook.",
  },
];

export const contentScreens = [
  {
    id: "intro",
    title: "O que é o Gemini Notebook e para que serve?",
    subtitle:
      "Exploração guiada do Gemini Notebook: crie seu primeiro caderno com documentos próprios",
    objective:
      "Entender o conceito de IA baseada em fontes próprias e criar seu primeiro notebook",
    maxText:
      "O Gemini Notebook é uma ferramenta do Google que revoluciona a gestão do conhecimento pessoal. Ao contrário dos chatbots tradicionais, ele trabalha exclusivamente com os documentos que você fornece. Isso significa que suas respostas são fundamentadas nas suas fontes, o que reduz o risco de alucinações (não o elimina). Seu objetivo é compreender como ele funciona e por que é diferente dos chatbots genéricos.",
    achievements: [
      { text: "Entender o conceito de IA baseada em fontes próprias" },
      { text: "Criar seu primeiro notebook com documentos" },
      { text: "Diferenciar o Gemini Notebook de chatbots genéricos" },
    ],
    warnings: [
      { text: "Enviar documentos sem curadoria nem organização" },
      { text: "Esperar que funcione sem fontes de qualidade" },
      { text: "Não entender que ele só responde com base nas suas fontes" },
    ],
    example: {
      weak: "Notebook vazio: Sem fontes enviadas, sem contexto",
      strong:
        "Notebook potente: 5 PDFs de pesquisa acadêmica + 3 artigos de mercado = Assistente especialista que responde com citações textuais dos seus documentos",
    },
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "features",
    title: "Curadoria de Fontes e Síntese de Documentos",
    subtitle: "Qualidade em vez de quantidade na sua pesquisa",
    objective:
      "Aprender a selecionar, organizar e sintetizar documentos para maximizar o valor do seu notebook",
    maxText:
      "A curadoria de fontes é a chave para extrair o máximo do Gemini Notebook. Não se trata de enviar o maior número de documentos, mas de selecionar os mais relevantes e organizá-los estrategicamente. Você aprenderá a escolher fontes confiáveis, categorizá-las por temas e gerar sínteses cruzadas que lhe deem uma visão integral da sua pesquisa.",
    achievements: [
      { text: "Selecionar fontes relevantes e confiáveis" },
      { text: "Organizar documentos por categorias temáticas" },
      { text: "Gerar sínteses cruzadas entre múltiplas fontes" },
    ],
    warnings: [
      { text: "Enviar documentos sem filtro de qualidade" },
      { text: "Misturar fontes contraditórias sem contexto" },
      { text: "Não atualizar as fontes regularmente" },
    ],
    example: {
      weak: "Enviar tudo o que encontro sobre IA sem nenhum critério",
      strong:
        "10 papers selecionados por relevância, organizados por tema (ética, técnica, aplicações), com notas de contexto para cada grupo",
    },
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "practices",
    title: "Audio Overviews e Gestão Documental com IA",
    subtitle: "Seu conhecimento em formato de podcast",
    objective:
      "Transformar documentos complexos em conversas em áudio com dois apresentadores virtuais",
    maxText:
      "Uma das funções mais impressionantes do Gemini Notebook é o Audio Overview. Essa ferramenta converte seus documentos em conversas de podcast geradas por IA, com dois apresentadores virtuais que discutem os principais achados. É ideal para revisar conteúdo enquanto você se desloca, mas lembre-se de complementá-la com resumos escritos e sempre revisar o conteúdo gerado.",
    achievements: [
      { text: "Gerar Audio Overviews a partir dos seus documentos" },
      { text: "Personalizar o tom e o enfoque do podcast" },
      { text: "Usar o áudio para revisão e aprendizagem móvel" },
    ],
    warnings: [
      { text: "Esperar áudio perfeito com documentos curtos" },
      { text: "Não revisar o conteúdo gerado antes de compartilhar" },
      { text: "Usar apenas áudio sem complementar com resumos escritos" },
    ],
    example: {
      weak: "Conversa vaga e genérica sobre o tema, sem profundidade",
      strong:
        "Podcast de 15 minutos em que dois apresentadores discutem os principais achados de 5 papers sobre neuroplasticidade, com exemplos práticos e analogias claras",
    },
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
  },
];

export const questionsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "De acordo com o guia, qual é o principal 'superpoder' do Gemini Notebook?",
    options: [
      "Busca informações em toda a internet para dar respostas mais longas.",
      "Trabalha exclusivamente com as fontes e documentos que você fornece.",
      "Traduz documentos para mais de 100 idiomas automaticamente.",
      "Cria vídeos animados a partir dos seus textos de estudo.",
    ],
    correct: 1,
    explanation:
      "Correto! O Gemini Notebook se diferencia porque usa apenas as informações que você envia. Assim, garante não inventar dados que não estão nas suas anotações.",
    hint: "Leia bem as opções; esse assistente foi projetado para ser totalmente fiel aos seus documentos, não à internet.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "Qual é a diferença mais importante entre usar o ChatGPT e o Gemini Notebook para estudar?",
    options: [
      "O ChatGPT usa 'toda a internet' e o Gemini Notebook usa 'apenas as suas fontes carregadas'.",
      "Usam as mesmas informações: só muda o nome.",
      "O Gemini Notebook usa o mesmo conhecimento geral da internet que o ChatGPT.",
      "O ChatGPT é para matemática e o Gemini Notebook é para história.",
    ],
    correct: 0,
    explanation:
      "Exato. Enquanto o ChatGPT tem conhecimento geral de toda a web, o Gemini Notebook se concentra em ser super preciso e estrito apenas com os documentos que você escolheu.",
    hint: "Pense na origem dos dados de cada um. Um busca no mundo todo e o outro apenas no que você lhe dá.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question:
      "Que função incrível o Gemini Notebook tem para ajudá-lo a 'ouvir' seus documentos?",
    options: [
      "Uma música estilo rap com as palavras-chave mais importantes.",
      "Um audiolivro monótono narrado com a sua própria voz clonada.",
      "Um alarme para acordá-lo recitando o texto principal.",
      "Um 'Podcast' (Audio Overview) gerado por IA com duas vozes que conversam sobre o seu tema.",
    ],
    correct: 3,
    explanation:
      "Muito bem! A ferramenta 'Audio Overview' cria uma simulação de podcast muito realista em que dois anfitriões discutem suas anotações, ideal para estudar ouvindo.",
    hint: "É um formato de áudio muito popular hoje em dia, em que dois anfitriões conversam sobre um tema.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question:
      "O Gemini Notebook costuma responder a partir dos seus documentos. O que isso significa para a conferência?",
    options: [
      "Que não permite enviar documentos sobre temas de ficção científica.",
      "Que bloqueia automaticamente sites com vírus ou anúncios enganosos.",
      "Que ele pode errar do mesmo jeito, então abra a citação e confira o trecho original.",
      "Que corrige sua ortografia e gramática sem que você perceba.",
    ],
    correct: 2,
    explanation:
      "Correto. Reduzir o risco não o elimina: a citação permite conferir cada afirmação.",
    hint: "No mundo da IA, 'alucinar' significa inventar coisas que não são reais.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question:
      "Se você está fazendo um trabalho em grupo para a escola ou universidade, pode usar o Gemini Notebook com seus colegas?",
    options: [
      "Não, é uma ferramenta estritamente para uso individual.",
      "Sim, você pode compartilhar seus 'Cadernos' com a equipe, como um Google Doc.",
      "Somente se todos estiverem conectados à mesma rede Wi-Fi na mesma sala.",
      "Sim, mas a IA só responderá perguntas ao criador do grupo.",
    ],
    correct: 1,
    explanation:
      "Isso mesmo! Vocês podem colaborar em equipe. Todos podem ler o mesmo caderno, fazer perguntas às mesmas fontes e ouvir o mesmo podcast gerado.",
    hint: "Por ser uma ferramenta do Google, o recurso de grupos se parece muito com o compartilhamento de arquivos no Google Drive.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question:
      "De acordo com as 'Boas Práticas' do guia, o que você deve SEMPRE fazer quando o Gemini Notebook dá uma resposta?",
    options: [
      "Verificar sempre a citação ou a parte exata de onde ele tirou a informação.",
      "Excluir o documento original do seu computador, pois não precisa mais dele.",
      "Pedir que ele traduza para outro idioma para garantir boa qualidade.",
      "Copiar e colar a resposta diretamente na sua tarefa, sem precisar lê-la.",
    ],
    correct: 0,
    explanation:
      "Excelente. O Gemini Notebook é um ótimo assistente, mas você é o estudante. Sempre deve verificar clicando nas citações para ver de qual parte do texto original a ideia foi retirada.",
    hint: "Lembre-se de que você é o estudante e a máquina é o assistente. Certifique-se de revisar as fontes.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question:
      "De acordo com o manual, quantos documentos ou fontes diferentes você pode enviar a um mesmo caderno no Gemini Notebook?",
    options: [
      "Apenas 1 fonte muito longa por vez.",
      "Até 5 fontes pequenas.",
      "Depende da sua conta: confira o limite atual e envie poucas fontes do mesmo tema.",
      "Enviar todas as fontes sem escolher, qualquer que seja o tema.",
    ],
    correct: 2,
    explanation:
      "Correto. O melhor são poucas fontes, do mesmo tema, com autor e data. O limite de fontes depende da sua conta: confira lá.",
    hint: "Confira o limite de fontes na sua conta antes de enviar.",
  },
];
