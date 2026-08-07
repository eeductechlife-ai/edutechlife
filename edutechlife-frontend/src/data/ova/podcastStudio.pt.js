export const CONTENT_TYPES = [
  {
    id: "academico",
    label: "Acadêmico",
    icon: "📚",
    desc: "Papers, teses, artigos de pesquisa",
  },
  {
    id: "tecnico",
    label: "Técnico",
    icon: "⚙️",
    desc: "Manuais, guias, documentação técnica",
  },
  {
    id: "creativo",
    label: "Criativo",
    icon: "🎨",
    desc: "Guias de design, marketing, conteúdo",
  },
  {
    id: "mixto",
    label: "Misto",
    icon: "📦",
    desc: "Combinação de vários tipos",
  },
];

export const GOALS = [
  {
    id: "estudiar",
    label: "Estudar",
    icon: "📖",
    desc: "Revisar e compreender conceitos-chave",
  },
  {
    id: "resumir",
    label: "Resumir",
    icon: "📝",
    desc: "Extrair o essencial de documentos longos",
  },
  {
    id: "presentar",
    label: "Apresentar",
    icon: "🎤",
    desc: "Preparar material para uma apresentação",
  },
  {
    id: "explorar",
    label: "Explorar",
    icon: "🔍",
    desc: "Pesquisa inicial sobre um tema novo",
  },
];

export const DOC_COUNTS = [
  {
    id: "pocos",
    label: "1-2 docs",
    icon: "📄",
    desc: "Poucos documentos, muito focados",
  },
  {
    id: "medio",
    label: "3-5 docs",
    icon: "📚",
    desc: "Quantidade ideal para um bom debate",
  },
  {
    id: "varios",
    label: "6-10 docs",
    icon: "📚📚",
    desc: "Visão ampla do tema",
  },
  {
    id: "muchos",
    label: "10+ docs",
    icon: "📚📚📚",
    desc: "Pesquisa exaustiva",
  },
];

export const SOURCE_TIPS = {
  academico:
    "Use papers revisados por pares, teses e artigos acadêmicos. A qualidade das fontes define a profundidade da análise.",
  tecnico:
    "Manuais oficiais e documentação técnica geram podcasts precisos. Inclua exemplos práticos.",
  creativo:
    "Guias de estilo, briefs e casos de sucesso. A IA captura bem o tom criativo se as fontes forem descritivas.",
  mixto:
    "Agrupe suas fontes por tema antes de enviá-las. O NotebookLM cruza informações entre todas, por isso a organização importa.",
};

export const GOAL_TIPS = {
  estudiar:
    "Ouça o podcast primeiro para ter o contexto geral e, depois, leia os documentos para aprofundar. O áudio fornece o mapa mental.",
  resumir:
    "Selecione as fontes mais importantes. O Audio Overview será um ótimo resumo conversacional, mas complemente com anotações escritas.",
  presentar:
    "Gere o podcast para obter uma narrativa coerente. Use-o como inspiração para estruturar sua apresentação.",
  explorar:
    "Envie 5-10 fontes diversas. O debate entre os apresentadores dará perspectivas que você não havia considerado.",
};

export const DOC_TIPS = {
  pocos:
    "Com poucos documentos, o podcast será muito focado. Ideal para revisar conceitos específicos antes de uma prova.",
  medio:
    "Quantidade ideal. Os apresentadores terão material suficiente para gerar um debate interessante e com profundidade.",
  varios:
    "Boa variedade de perspectivas. O podcast será mais amplo, porém menos profundo em cada tema.",
  muchos:
    "O podcast cobrirá muitas ideias, mas cada uma superficialmente. Melhor dividir em grupos temáticos e gerar vários podcasts.",
};

export const ESTIMATED_TIME = {
  pocos: "3-5 minutos",
  medio: "5-10 minutos",
  varios: "10-15 minutos",
  muchos: "10-15 minutos",
};

export const IDEAL_SOURCES = {
  pocos: "2-3 fontes",
  medio: "3-5 fontes",
  varios: "6-8 fontes",
  muchos: "6-8 fontes",
};

export const FORMATS = {
  academico: "PDF, Google Docs",
  tecnico: "PDF, TXT, URLs",
  creativo: "PDF, Google Docs, URLs",
  mixto: "PDF, Google Docs, TXT, URLs",
};

export const CHECKLIST_ITEMS = [
  { id: "select", label: "Selecionei e organizei minhas melhores fontes" },
  { id: "create", label: "Criei um notebook novo no NotebookLM" },
  { id: "upload", label: "Enviei todas as minhas fontes para o notebook" },
  { id: "generate", label: "Iniciei a geração do Audio Overview" },
  { id: "listen", label: "Ouvi o resultado completo" },
  { id: "notes", label: "Anotei os pontos-chave" },
];

export const learningObjectives = [
  "Planejar a criação de um podcast educacional com IA",
  "Selecionar fontes de qualidade para a geração de conteúdo",
  "Configurar os parâmetros ideais de acordo com o tipo de conteúdo",
  "Avaliar o resultado final e aplicá-lo ao processo de aprendizagem",
];

export const furtherReading = [
  {
    title: "NotebookLM Audio Overviews — Google Support",
    url: "https://support.google.com/notebooklm/answer/14054503",
    description:
      "Suporte oficial do Google sobre Audio Overviews no NotebookLM.",
  },
  {
    title: "How to Create Educational Podcasts with AI",
    url: "https://www.edutechlife.com/blog/educational-ai-podcasts",
    description:
      "Guia para criar podcasts educacionais com inteligência artificial.",
  },
];
