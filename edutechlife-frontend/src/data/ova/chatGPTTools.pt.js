export const tools = [
  {
    id: "browse",
    title: "Busca na Web (Browse)",
    icon: "Globe",
    iconColor: "text-blue-500",
    desc: "Conecta o ChatGPT ao mundo real em tempo real. É a sua janela para a atualidade acadêmica e profissional.",
    pros: ["Notícias 2025/2026", "Estatísticas atuais", "Verificação de fatos"],
    cons: ["Conceitos teóricos básicos", "Redação criativa simples"],
    prompt:
      "Busque as regulamentações mais recentes de IA na Colômbia para 2025 e resuma os pontos principais.",
    audio:
      "A busca na web permite que o ChatGPT acesse a internet em tempo real. Use-a para dados atualizados, notícias recentes ou para verificar informações que mudam rapidamente.",
    useCases: [
      "Revisão de literatura recente",
      "Atualização de marcos legais",
      "Busca de cotações ao vivo",
    ],
  },
  {
    id: "code",
    title: "Intérprete de Código",
    icon: "Code",
    iconColor: "text-emerald-500",
    desc: "Um motor Python real dentro do chat. Ideal para cientistas de dados, engenheiros e estudantes de finanças.",
    pros: [
      "Análise de Excel/CSV",
      "Gráficos profissionais",
      "Cálculos matemáticos complexos",
    ],
    cons: ["Não gera imagens artísticas", "Não acessa URLs privadas"],
    prompt:
      "Analise este Excel de vendas, gere um gráfico de barras por trimestre e identifique o produto destaque.",
    audio:
      "O intérprete de código executa Python real. É perfeito para analisar arquivos de dados, criar visualizações e realizar cálculos estatísticos avançados.",
    useCases: [
      "Limpeza de bancos de dados",
      "Modelos matemáticos",
      "Conversão de formatos de arquivo",
    ],
  },
  {
    id: "dalle",
    title: "DALL-E 3",
    icon: "ImageIcon",
    iconColor: "text-purple-500",
    desc: "Transforme as suas ideias visuais em realidade. Crie material educacional e ilustrações personalizadas com precisão.",
    pros: [
      "Infográficos educacionais",
      "Logos e conceitos",
      "Fundos para apresentações",
    ],
    cons: ["Texto denso dentro de imagens", "Marcas registradas exatas"],
    prompt:
      "Gere uma ilustração em estilo infográfico do ciclo da água com as etapas claramente rotuladas.",
    audio:
      "O DALL-E é o sistema de geração de imagens. Permite criar material visual original para as suas apresentações ou projetos acadêmicos.",
    useCases: [
      "Material didático visual",
      "Capas para relatórios",
      "Visualização de conceitos abstratos",
    ],
  },
  {
    id: "canvas",
    title: "Canvas",
    icon: "Layout",
    iconColor: "text-orange-500",
    desc: "Um espaço de trabalho colaborativo. Edite texto e código em paralelo com a IA, como se tivesse um editor humano.",
    pros: [
      "Edição direta de documentos",
      "Sugestões em tempo real",
      "Ajuste de tom e extensão",
    ],
    cons: ["Disponível apenas nos modelos 4o", "Não é um editor de vídeo"],
    prompt:
      "Abra o Canvas e ajude-me a estruturar uma redação sobre o impacto da IA na saúde mental.",
    audio:
      "O Canvas é um ambiente de edição colaborativa. Abre um editor ao lado do chat, onde você e a inteligência artificial podem trabalhar no mesmo documento simultaneamente.",
    useCases: [
      "Redação iterativa de redações",
      "Revisão passo a passo de código",
      "Adaptação de manuais técnicos",
    ],
  },
  {
    id: "memory",
    title: "Memória e Projetos",
    icon: "Cpu",
    iconColor: "text-indigo-500",
    desc: "Personalização e organização de longo prazo. O ChatGPT aprende as suas preferências e agrupa o seu trabalho por objetivos.",
    pros: [
      "Lembra o seu perfil acadêmico",
      "Organiza teses e arquivos",
      "Contexto compartilhado persistente",
    ],
    cons: [
      "Requer configuração de privacidade",
      "Uso otimizado nos planos Plus",
    ],
    prompt:
      "Lembre-se de que sou estudante de Medicina e prefiro explicações técnicas com exemplos clínicos.",
    audio:
      "A memória permite que a inteligência artificial lembre as suas preferências. Os Projetos organizam vários chats e arquivos sob o mesmo contexto de trabalho.",
    useCases: [
      "Tutor personalizado",
      "Gestão de pesquisa",
      "Manutenção do estilo de redação",
    ],
  },
];

export const quizScenarios = [
  {
    question:
      "Você é um docente preparando um manual de laboratório de 20 páginas. Precisa que a IA ajude a reescrever apenas a seção de 'Normas de Segurança', ajustando o tom para adolescentes, sem alterar o restante do documento. Qual ambiente oferece o fluxo mais otimizado?",
    options: [
      "Projetos e Memória",
      "Canvas",
      "Intérprete de Código",
      "Busca na Web",
    ],
    correct: 1,
    explanation:
      "O Canvas permite editar seções específicas de um documento longo de forma paralela em um editor lateral, mantendo o contexto sem regenerar todo o texto.",
  },
  {
    question:
      "Você tem um arquivo Excel com as notas de 3.000 estudantes, desorganizadas e com formatos inconsistentes. Quer limpar a base e prever a evasão. Qual ferramenta é indispensável?",
    options: ["DALL-E 3", "Canvas", "Busca na Web", "Intérprete de Código"],
    correct: 3,
    explanation:
      "O Intérprete de Código executa Python, o que permite processar arquivos massivos, limpar dados e realizar cálculos estatísticos exatos.",
  },
  {
    question:
      "Você orienta um estudante na sua tese de graduação. Quer que o ChatGPT lembre a metodologia, as correções e o referencial teórico em cada sessão, sem ter que explicar o contexto novamente. Qual função você usaria?",
    options: [
      "Memória e Projetos",
      "Intérprete de Código",
      "Canvas",
      "Busca na Web",
    ],
    correct: 0,
    explanation:
      "Os Projetos agrupam conversas sob instruções comuns, e a Memória salva o contexto de forma persistente no longo prazo.",
  },
  {
    question:
      "Um estudante menciona uma flutuação do dólar que ocorreu há apenas uma hora. Você precisa que o ChatGPT gere uma análise sobre as causas imediatas. Qual ferramenta você ativa?",
    options: [
      "Canvas",
      "Busca na Web (Browse)",
      "Memória",
      "Intérprete de Código",
    ],
    correct: 1,
    explanation:
      "Para analisar eventos em tempo real ou notícias de última hora, é obrigatório usar a Busca na Web para acessar dados atuais fora do treinamento base.",
  },
  {
    question:
      "Você quer projetar o pôster da feira de ciências. Pede ao ChatGPT uma imagem com um parágrafo longo das bases do concurso e logos exatos dos patrocinadores. O que acontecerá?",
    options: [
      "O pôster ficará perfeito e pronto para imprimir.",
      "O intérprete de código bloqueará a solicitação por privacidade.",
      "A imagem terá erros no texto longo e logos imprecisos.",
      "O Canvas abrirá um editor gráfico manual.",
    ],
    correct: 2,
    explanation:
      "O DALL-E 3 é excelente para arte conceitual, mas tem dificuldades com textos longos e logos de marcas registradas exatos, devido a restrições legais e técnicas.",
  },
  {
    question:
      "Você é pesquisador e precisa gerar gráficos estatísticos a partir de dados de uma pesquisa em CSV. Além disso, quer que a IA valide os cálculos. Qual combinação de ferramentas é mais eficiente?",
    options: [
      "Apenas o Canvas para editar o CSV visualmente.",
      "Intérprete de Código para analisar e gerar gráficos, mais Busca na Web para contrastar metodologias.",
      "DALL-E 3 para criar um infográfico dos resultados.",
      "Memória e Projetos para salvar os resultados.",
    ],
    correct: 1,
    explanation:
      "O Intérprete de Código executa Python para uma análise estatística exata, e o Browse complementa com referências metodológicas atualizadas. É a combinação mais potente.",
  },
  {
    question:
      "Você está desenvolvendo um projeto de pesquisa de longo prazo. Precisa que a IA lembre o formato dos seus relatórios, as fontes já consultadas e mantenha tudo organizado por tema. Qual é a melhor configuração?",
    options: [
      "Usar o Canvas para editar os relatórios.",
      "Criar um Projeto com instruções personalizadas e ativar a Memória para lembrar preferências.",
      "Usar o DALL-E 3 para ilustrar os relatórios.",
      "Depender apenas da Busca na Web a cada vez.",
    ],
    correct: 1,
    explanation:
      "Os Projetos mantêm instruções e arquivos agrupados, enquanto a Memória lembra as suas preferências no longo prazo. É a configuração ideal para pesquisa contínua.",
  },
];

export const learningObjectives = [
  "Identificar as ferramentas-chave do ecossistema ChatGPT",
  "Selecionar a ferramenta adequada para cada tarefa acadêmica ou profissional",
  "Avaliar as vantagens e limitações de cada ferramenta",
  "Aplicar estratégias de uso combinado de ferramentas para maximizar resultados",
];

export const furtherReading = [
  {
    title: "OpenAI Documentation — Tools Overview",
    url: "https://platform.openai.com/docs/overview",
    description: "Documentação oficial de ferramentas e APIs da OpenAI.",
  },
  {
    title: "ChatGPT Guide for Educators",
    url: "https://openai.com/education/",
    description: "Guia oficial da OpenAI para uso educacional do ChatGPT.",
  },
  {
    title: "Prompt Engineering Guide",
    url: "https://www.promptingguide.ai/",
    description:
      "Guia completo de engenharia de prompts com exemplos práticos.",
  },
];
