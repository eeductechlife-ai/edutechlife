export const MODULE_4_PT = [
  {
    id: "m4q1",
    question:
      'Você é pesquisador de biologia marinha e precisa analisar 15 artigos acadêmicos sobre o impacto da mudança climática em recifes de coral para uma publicação. Seu supervisor pergunta: "Por que você usaria o NotebookLM em vez do ChatGPT para esta pesquisa?" Qual é a razão mais convincente?',
    options: [
      {
        id: "m4q1_a",
        label:
          "O NotebookLM trabalha exclusivamente com seus documentos e cita textualmente cada fonte, eliminando o risco de inventar dados que não estão nos seus artigos",
      },
      {
        id: "m4q1_b",
        label:
          "O ChatGPT não consegue ler PDFs acadêmicos, apenas documentos de texto simples",
      },
      {
        id: "m4q1_c",
        label:
          "O NotebookLM é mais rápido porque não precisa de conexão com a internet para funcionar",
      },
      {
        id: "m4q1_d",
        label:
          "O ChatGPT só processa informações em inglês e os artigos podem estar em outros idiomas",
      },
    ],
    correctAnswer: "m4q1_a",
    topic: "NotebookLM",
    difficulty: "médio",
    feedback:
      'O NotebookLM foi criado para pesquisas baseadas em fontes próprias: zero alucinações, citações verificáveis e análise contextual aprofundada. O ChatGPT é excelente para tarefas gerais, mas para pesquisa acadêmica com fontes específicas, o NotebookLM é a ferramenta certa. Revise o vídeo "Primeiros Passos com o NotebookLM".',
  },
  {
    id: "m4q2",
    question:
      "Você é estudante de ciências ambientais e encontra 30 documentos sobre mudança climática: 10 artigos acadêmicos revisados por pares, 5 artigos de notícias verificados, 8 blogs de opinião pessoal, 4 conjuntos de dados governamentais e 3 documentários científicos. Seu notebook no NotebookLM aceita até 50 fontes. Qual é a estratégia de curadoria mais inteligente?",
    options: [
      {
        id: "m4q2_a",
        label:
          "Selecionar os 10 artigos + 4 conjuntos de dados + 3 documentários como fontes prioritárias, deixando de fora os blogs de opinião não verificados",
      },
      {
        id: "m4q2_b",
        label:
          "Subir os 30 documentos completos porque há espaço disponível no notebook",
      },
      {
        id: "m4q2_c",
        label:
          "Subir apenas os 8 blogs porque usam uma linguagem mais simples de entender",
      },
      {
        id: "m4q2_d",
        label:
          "Subir apenas os 5 artigos de notícias porque têm a data mais recente",
      },
    ],
    correctAnswer: "m4q2_a",
    topic: "NotebookLM",
    difficulty: "médio",
    feedback:
      'A curadoria não é questão de espaço — é selecionar fontes confiáveis e relevantes. Artigos acadêmicos e conjuntos de dados governamentais são verificáveis; blogs de opinião acrescentam ruído e viés sem fundamento. Revise a lição "Selecione Fontes como um Especialista" e o OVA "Simulador: Análise de Documentos".',
  },
  {
    id: "m4q3",
    question:
      "Você é estudante de medicina e tem 3 PDFs de fisiologia cardíaca para estudar para uma prova. Amanhã você tem uma viagem de 45 minutos de ônibus e quer aproveitar esse tempo para revisar. Qual é a melhor estratégia usando o NotebookLM?",
    options: [
      {
        id: "m4q3_a",
        label:
          "Subir os 3 PDFs em um notebook, gerar um Audio Overview que os analise e ouvi-lo durante a viagem",
      },
      {
        id: "m4q3_b",
        label:
          "Ler os 3 PDFs completos no ônibus, mesmo com movimento e pouca luz",
      },
      {
        id: "m4q3_c",
        label: "Pedir ao ChatGPT um resumo geral e lê-lo no ônibus",
      },
      {
        id: "m4q3_d",
        label: "Esperar chegar em casa para ler os PDFs com calma",
      },
    ],
    correctAnswer: "m4q3_a",
    topic: "Audio Overview",
    difficulty: "médio",
    feedback:
      'O Audio Overview transforma seus documentos em um podcast conversacional com duas vozes de IA que analisam o conteúdo. É ideal para revisar material denso quando você não pode ler, como durante uma viagem. Revise o vídeo "Audio Overview: Seu Conteúdo em Podcast".',
  },
  {
    id: "m4q4",
    question:
      'O NotebookLM responde: "A neuroplasticidade ocorre principalmente na infância (Fonte: neuroplasticidade.pdf, página 5)". Você clica na citação e lê no PDF, textualmente: "A neuroplasticidade é mais ativa durante a infância, mas continua ao longo de toda a vida". O que você conclui?',
    options: [
      {
        id: "m4q4_a",
        label:
          "A IA interpretou corretamente, mas simplificou a nuance — a citação original diz algo mais preciso, mostrando por que você deve sempre verificar as citações textuais",
      },
      {
        id: "m4q4_b",
        label:
          "O NotebookLM errou completamente; a fonte original não diz nada parecido",
      },
      {
        id: "m4q4_c",
        label: "O PDF está mal escrito e você deveria removê-lo do notebook",
      },
      {
        id: "m4q4_d",
        label:
          "A resposta da IA está correta porque citou o PDF adequadamente; você não precisa ler a fonte original",
      },
    ],
    correctAnswer: "m4q4_a",
    topic: "Precisão",
    difficulty: "difícil",
    feedback:
      'Este é um caso clássico de por que verificar citações é essencial. A IA não alucinou — interpretou corretamente, mas perdeu uma nuance importante ("mais ativa" ≠ "ocorre principalmente"). A IA dá velocidade; você dá precisão. Revise a infografia "Resumos Inteligentes com o NotebookLM".',
  },
  {
    id: "m4q5",
    question:
      "Qual é a melhor prática ao organizar suas fontes no NotebookLM para uma pesquisa?",
    options: [
      { id: "m4q5_a", label: "Subir as 50 fontes de uma vez, sem organizar" },
      {
        id: "m4q5_b",
        label:
          "Selecionar fontes relevantes e confiáveis, organizá-las por temas e categorias para obter melhores resultados",
      },
      {
        id: "m4q5_c",
        label: "Subir apenas resumos, nunca os documentos completos",
      },
      {
        id: "m4q5_d",
        label: "Misturar fontes acadêmicas com blogs sem distinção",
      },
    ],
    correctAnswer: "m4q5_b",
    topic: "Curadoria",
    difficulty: "médio",
    feedback:
      'A qualidade das suas fontes determina a qualidade das respostas. Revise o tópico "Selecione Fontes como um Especialista".',
  },
  {
    id: "m4q6",
    question:
      "Se você encontrar duas fontes que se contradizem no NotebookLM, o que deve fazer?",
    options: [
      { id: "m4q6_a", label: "Remover as duas fontes e procurar outras novas" },
      {
        id: "m4q6_b",
        label:
          "Analisar as duas, identificar as razões da contradição e documentá-la como parte da sua pesquisa",
      },
      { id: "m4q6_c", label: "Ficar apenas com a fonte mais recente" },
      { id: "m4q6_d", label: "Ignorar a contradição e seguir em frente" },
    ],
    correctAnswer: "m4q6_b",
    topic: "Análise Crítica",
    difficulty: "difícil",
    feedback:
      "As contradições são oportunidades de aprendizado. Analisá-las fortalece sua pesquisa. Revise o simulador de análise documental.",
  },
  {
    id: "m4q7",
    question:
      "Segundo as melhores práticas do módulo, o que você deve fazer SEMPRE que o NotebookLM der uma resposta com citações?",
    options: [
      {
        id: "m4q7_a",
        label:
          "Verificar as citações clicando nelas para confirmar que a informação está correta e em contexto",
      },
      { id: "m4q7_b", label: "Copiar e colar a resposta sem revisar" },
      {
        id: "m4q7_c",
        label: "Apagar o documento original porque você não precisa mais dele",
      },
      {
        id: "m4q7_d",
        label:
          "Traduzir a resposta para outro idioma para verificar sua qualidade",
      },
    ],
    correctAnswer: "m4q7_a",
    topic: "Verificação",
    difficulty: "médio",
    feedback:
      "Verifique sempre as citações. A IA é seu assistente, mas você é o responsável final. Revise o OVA do módulo.",
  },
  {
    id: "m4q8",
    question:
      "Uma equipe de 4 estudantes pesquisa o mesmo tema para um projeto integrador. Cada um tem documentos diferentes e querem usar o NotebookLM para trabalhar juntos. Qual é o fluxo de trabalho colaborativo mais eficiente?",
    options: [
      {
        id: "m4q8_a",
        label:
          "Cada estudante cria seu notebook com suas fontes e compartilha o link com a equipe; todos podem consultar e fazer perguntas sobre as fontes dos demais",
      },
      {
        id: "m4q8_b",
        label:
          "Apenas um estudante cria um notebook e os outros pedem que ele faça as perguntas por eles",
      },
      {
        id: "m4q8_c",
        label:
          "Cada estudante trabalha separadamente e no final do projeto comparam os resultados manualmente",
      },
      {
        id: "m4q8_d",
        label:
          "Os 4 estudantes se revezam usando o mesmo computador com um único notebook aberto",
      },
    ],
    correctAnswer: "m4q8_a",
    topic: "Colaboração",
    difficulty: "médio",
    feedback:
      'O NotebookLM permite compartilhar notebooks como no Google Docs. Cada membro pode ter seu notebook temático e compartilhá-lo, dando a toda a equipe acesso para consultar fontes e fazer perguntas de forma independente. Revise o OVA "Laboratório: Crie seu Notebook".',
  },
  {
    id: "m4q9",
    question:
      'Você tem 10 fontes no seu notebook e quer extrair apenas as conclusões principais sobre um tema específico (ex.: "eficiência energética"). Qual é a forma mais eficiente de fazer isso?',
    options: [
      {
        id: "m4q9_a",
        label:
          'Fazer uma pergunta específica ao NotebookLM, como "Segundo minhas fontes, quais são as conclusões principais sobre eficiência energética? As respostas devem citar textualmente as fontes"',
      },
      {
        id: "m4q9_b",
        label: "Ler as 10 fontes completas, uma a uma, e anotar manualmente",
      },
      {
        id: "m4q9_c",
        label: "Pedir ao ChatGPT que faça a análise sem subir as fontes",
      },
      {
        id: "m4q9_d",
        label: "Usar o Guia de Estudo automático e copiar tudo sem filtrar",
      },
    ],
    correctAnswer: "m4q9_a",
    topic: "NotebookLM",
    difficulty: "médio",
    feedback:
      'A vantagem do NotebookLM é que você pode fazer perguntas específicas e obter respostas citadas das suas fontes. Você não precisa ler tudo — a IA encontra as seções relevantes para você. Revise o vídeo "Primeiros Passos com o NotebookLM".',
  },
  {
    id: "m4q10",
    question:
      "Qual é o limite atual de fontes que você pode adicionar a um único notebook no NotebookLM?",
    options: [
      {
        id: "m4q10_a",
        label:
          "Até 50 fontes por notebook, e cada fonte pode ter até cerca de 500.000 palavras",
      },
      {
        id: "m4q10_b",
        label:
          "Ilimitado; você pode subir todas as fontes que quiser, sem restrição",
      },
      {
        id: "m4q10_c",
        label: "Máximo de 10 fontes por notebook, independentemente do tamanho",
      },
      {
        id: "m4q10_d",
        label: "Máximo de 100 fontes, mas cada uma com apenas 10 páginas",
      },
    ],
    correctAnswer: "m4q10_a",
    topic: "Limites do NotebookLM",
    difficulty: "médio",
    feedback:
      "Conhecer os limites técnicos das ferramentas faz parte do uso profissional. O NotebookLM permite até 50 fontes com um limite considerável de palavras. Revise a documentação e os recursos do módulo sobre o NotebookLM.",
  },
  {
    id: "m4q11",
    question:
      "Você gera um Audio Overview a partir do seu notebook e os apresentadores de IA conversam sobre suas fontes. Que controle você tem sobre o conteúdo do áudio gerado?",
    options: [
      {
        id: "m4q11_a",
        label:
          "Você pode personalizar os temas a abordar e regenerar se não gostar do resultado, mas o formato é conversacional entre duas vozes de IA",
      },
      {
        id: "m4q11_b",
        label:
          "Você não tem nenhum controle; o áudio é gerado automaticamente, sem opções",
      },
      {
        id: "m4q11_c",
        label:
          "Você pode escolher a voz exata, o tom e escrever o roteiro completo manualmente",
      },
      {
        id: "m4q11_d",
        label: "Você só pode decidir se inclui música de fundo ou não",
      },
    ],
    correctAnswer: "m4q11_a",
    topic: "Audio Overview",
    difficulty: "fácil",
    feedback:
      'O Audio Overview gera um podcast conversacional automático. Você pode regenerá-lo se não atender ao que precisa e orientá-lo com as instruções do notebook. Revise o vídeo "Audio Overview: Seu Conteúdo em Podcast".',
  },
  {
    id: "m4q12",
    question:
      'Um advogado sobe 30 contratos jurídicos em um notebook e pergunta: "Quais contratos têm cláusulas de confidencialidade que expiram em menos de 2 anos?" O NotebookLM responde citando 5 contratos específicos com números de página. Que validação adicional o advogado deveria fazer?',
    options: [
      {
        id: "m4q12_a",
        label:
          "Clicar em cada citação para verificar se a interpretação da IA coincide com o texto completo da cláusula, e não apenas com o trecho citado",
      },
      {
        id: "m4q12_b",
        label:
          "Confiar na resposta porque o NotebookLM cita textualmente as fontes",
      },
      {
        id: "m4q12_c",
        label: "Revisar apenas 1 dos 5 contratos citados para economizar tempo",
      },
      {
        id: "m4q12_d",
        label: "Pedir ao ChatGPT que verifique se o NotebookLM estava certo",
      },
    ],
    correctAnswer: "m4q12_a",
    topic: "Validação Jurídica",
    difficulty: "difícil",
    feedback:
      "Em contextos jurídicos, a verificação humana é obrigatória. Embora o NotebookLM cite textualmente, o contexto completo da cláusula pode mudar a interpretação. A IA acelera a revisão, mas o profissional do direito é o responsável final. Revise o tópico de verificação de fontes no módulo.",
  },
];
