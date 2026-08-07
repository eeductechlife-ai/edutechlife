export const challenges = [
  {
    id: 1,
    title: "Pesquisa de Mercado",
    scenario:
      "Você é consultor de negócios e seu cliente pede uma análise competitiva do mercado de veículos elétricos na América Latina para 2025. Você precisa de dados atualizados, tendências e projeções. Qual é a melhor estratégia usando o Gemini?",
    context:
      "Você tem acesso ao Gemini Advanced com Deep Research e integração com o Google Workspace.",
    options: [
      "Pedir ao Gemini que gere um relatório completo com base apenas no seu conhecimento de treinamento.",
      "Usar o Gemini com Deep Research para buscar em tempo real fontes atualizadas, analisá-las e entregar um relatório com citações verificáveis.",
      "Buscar manualmente no Google, copiar os dados para um documento e depois pedir ao Gemini que os resuma.",
    ],
    correct: 1,
    feedback:
      "O Deep Research é ideal para este caso: busca ativamente na web, cruza fontes e entrega um relatório com citações verificáveis. Os dados de treinamento podem estar desatualizados e a busca manual é ineficiente.",
    tip: 'Ative o Deep Research pelo Gemini Advanced e especifique: "Analise o mercado de veículos elétricos na América Latina, incluindo principais players, projeções de crescimento e barreiras de entrada. Cite todas as fontes."',
  },
  {
    id: 2,
    title: "Análise de Documentos",
    scenario:
      "Você recebe um contrato de 45 páginas em PDF com termos complexos. Precisa identificar cláusulas de risco, datas-chave e obrigações antes de uma reunião em 2 horas. Como você usa o Gemini para maximizar seu tempo?",
    context:
      "Você pode enviar arquivos ao Gemini e fazer perguntas sobre o conteúdo deles.",
    options: [
      "Ler o contrato inteiro e fazer anotações manuais, depois fazer ao Gemini perguntas específicas.",
      "Enviar o PDF ao Gemini e pedir um resumo executivo, e depois fazer perguntas específicas sobre cláusulas de risco, datas e obrigações.",
      "Pedir ao Gemini que redija uma contraproposta diretamente, sem ler o original.",
    ],
    correct: 1,
    feedback:
      "O Gemini pode processar documentos extensos em segundos. Enviar o PDF e fazer perguntas direcionadas permite extrair as informações críticas em minutos, não em horas.",
    tip: 'Use o prompt: "Analise este contrato e extraia: 1) Cláusulas de risco, 2) Datas e prazos críticos, 3) Obrigações de cada parte, 4) Recomendações de negociação."',
  },
  {
    id: 3,
    title: "Automação com o Workspace",
    scenario:
      "Você é líder de projeto e precisa enviar um relatório de avanço semanal a 15 stakeholders, cada um com dados personalizados de acordo com o seu departamento. Você tem os dados em uma planilha do Sheets. Qual é o fluxo mais eficiente com o Gemini no Google Workspace?",
    context:
      "O Gemini está integrado ao Gmail, Docs, Sheets e Meet do Google Workspace.",
    options: [
      "Copiar e colar manualmente cada relatório no Gmail, ajustando os dados um a um.",
      "Usar o Gemini no Sheets para analisar os dados, depois o Gemini no Docs para redigir o relatório-base e o Gemini no Gmail para personalizar e enviar cada e-mail.",
      "Enviar o mesmo e-mail genérico a todos, com os dados gerais.",
    ],
    correct: 1,
    feedback:
      "A integração do Gemini no Workspace permite um fluxo contínuo: analisar no Sheets, redigir no Docs e personalizar no Gmail, sem sair do ecossistema. Isso economiza horas de trabalho repetitivo.",
    tip: 'No Gmail, use "Ajude-me a escrever" e especifique: "Redija um e-mail para o departamento de [nome] com os seguintes dados de avanço: [colar dados relevantes]. Tom profissional e conciso."',
  },
  {
    id: 4,
    title: "Análise Multimodal",
    scenario:
      "Sua equipe de marketing recebeu 50 capturas de tela da concorrência mostrando as novas campanhas. Você precisa de uma análise visual rápida de tendências: cores, mensagens-chave, formatos e CTAs. Como você aproveita as capacidades multimodais do Gemini?",
    context:
      "O Gemini pode analisar imagens, extrair texto delas e reconhecer padrões visuais.",
    options: [
      "Revisar cada captura manualmente e fazer anotações em uma planilha.",
      "Enviar todas as imagens ao Gemini e pedir uma análise visual comparativa: paletas de cores, tipos de mensagem, formatos e chamadas para ação detectadas.",
      "Ler apenas o texto visível em cada captura e ignorar os elementos visuais.",
    ],
    correct: 1,
    feedback:
      "A capacidade multimodal do Gemini analisa simultaneamente texto, cores, composição e elementos visuais. Pode identificar padrões que uma análise manual deixaria passar, e entrega resultados em segundos.",
    tip: 'Prompt sugerido: "Analise estas 50 capturas de campanhas da concorrência. Identifique: 1) Paletas de cores dominantes, 2) Estruturas de mensagem recorrentes, 3) Formatos mais usados, 4) CTAs comuns. Apresente um resumo com tendências."',
  },
  {
    id: 5,
    title: "Depuração de Código",
    scenario:
      "Você tem um script em Python de 300 linhas que processa dados financeiros, mas está dando erros intermitentes e demora 45 minutos para executar. Você precisa identificar bugs e otimizá-lo. Você não é especialista em Python. Como você usa o Gemini?",
    context:
      "O Gemini tem capacidades avançadas de geração e análise de código em múltiplas linguagens.",
    options: [
      "Modificar o código ao acaso, esperando que funcione, já que você não entende Python.",
      "Copiar o código completo para o Gemini, pedir que ele identifique os erros, explique cada problema e sugira otimizações de desempenho com explicações.",
      "Contratar um desenvolvedor externo para revisar o código.",
    ],
    correct: 1,
    feedback:
      "O Gemini pode analisar código completo, identificar erros, sugerir otimizações e explicar cada alteração. É como ter um desenvolvedor sênior disponível instantaneamente, sem precisar ser especialista na linguagem.",
    tip: 'Prompt: "Analise este script Python de processamento financeiro. Identifique: 1) Erros que causam falhas intermitentes, 2) Gargalos de desempenho, 3) Sugira otimizações específicas com código. Explique cada alteração em linguagem simples."',
  },
  {
    id: 6,
    title: "Insights de Dados",
    scenario:
      "Você tem um arquivo CSV com 10.000 linhas de dados de vendas do último trimestre: produtos, regiões, datas, valores e canais. Você precisa identificar tendências, anomalias e oportunidades de crescimento antes da reunião do conselho em 3 horas. Qual é a sua estratégia com o Gemini?",
    context:
      "O Gemini pode analisar arquivos de dados, gerar visualizações conceituais e encontrar padrões.",
    options: [
      "Abrir o CSV no Excel e criar gráficos manualmente para cada variável.",
      "Enviar o CSV ao Gemini e pedir: análise de tendências por região e produto, detecção de anomalias em vendas, identificação dos canais com melhor desempenho e recomendações acionáveis.",
      "Calcular apenas a média das vendas totais e apresentar esse número.",
    ],
    correct: 1,
    feedback:
      "O Gemini processa grandes volumes de dados em segundos, identifica padrões que o olho humano não detecta e entrega recomendações acionáveis. O que levaria horas no Excel, o Gemini faz em minutos.",
    tip: 'Prompt: "Analise este CSV de vendas trimestrais. Preciso de: 1) Top 5 produtos por região, 2) Canais com maior crescimento mês a mês, 3) Anomalias ou outliers, 4) Correlações entre variáveis, 5) 3 recomendações acionáveis para o conselho."',
  },
];

export const learningObjectives = [
  "Aplicar ferramentas de IA a casos de uso profissional reais",
  "Avaliar a estratégia ideal de IA para cada cenário",
  "Desenvolver habilidades de engenharia de prompts para tarefas específicas",
  "Integrar múltiplas capacidades de IA em fluxos de trabalho eficientes",
];

export const furtherReading = [
  {
    title: "Gemini for Google Workspace Guide",
    url: "https://workspace.google.com/solutions/ai/",
    description: "Guia oficial de integração do Gemini no Google Workspace.",
  },
  {
    title: "Deep Research in Gemini",
    url: "https://blog.google/products/gemini/google-gemini-deep-research/",
    description: "Como usar a função Deep Research do Gemini para pesquisa.",
  },
];
