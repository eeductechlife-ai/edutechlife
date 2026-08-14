/**
 * CONSTANTES: contentPt.js
 *
 * Dados de conteúdo educacional em português (Brasil) para os módulos 2-5 do IALab
 * O Módulo 1 permanece intacto com seus dados originais embutidos
 *
 * Estrutura por módulo:
 * - objective: Objetivo central do módulo
 * - learningPoints: 4 pontos de aprendizagem { text, icon }
 * - overviewData: { title, description, mission, topics[] }
 * - lessons: 3 lições { id, title, description, detailedDescription, duration, format, icon, badgeColor, themeColor }
 * - accordionContent: { 1: {...}, 2: {...}, 3: {...} }
 */

const CONTENT_PT = {
  // ============================================================================
  // MÓDULO 1: O ARTESÃO DIGITAL — ENGENHARIA DE PROMPTS
  // ============================================================================
  1: {
    objective:
      "Domine a arte de forjar instruções precisas com a IA como aprendiz de artesão digital, criando prompts que qualquer modelo entenda perfeitamente.",
    learningPoints: [
      {
        text: "Forjar instruções claras como um mestre artesão",
        icon: "fa-bullseye",
      },
      {
        text: "Aperfeiçoar perguntas e respostas com precisão milimétrica",
        icon: "fa-wand-magic-sparkles",
      },
      {
        text: "Detectar e corrigir imperfeições nas suas criações",
        icon: "fa-exclamation-triangle",
      },
      {
        text: "Aplicar seu ofício artesanal nos estudos e no trabalho",
        icon: "fa-rocket",
      },
    ],
    overviewData: {
      title:
        "O Artesão Digital: Engenharia de Prompts — A Base de Toda Interação com IA",
      description:
        "Todo artesão começa com as ferramentas básicas e, com prática, torna-se mestre. Aqui você aprenderá a esculpir instruções que a IA entende perfeitamente. Dos fundamentos até técnicas avançadas que transformarão sua forma de trabalhar com inteligência artificial.",
      mission:
        "Sua missão como artesão: complete cada lição e recurso multimídia (vídeos, guias e laboratórios). Cada ferramenta que você dominar o aproxima 20% mais da sua certificação. Instruções precisas são o seu selo de qualidade!",
      topics: [
        {
          title: "Os Fundamentos do Artesão: O que é IA Generativa?",
          icon: "fa-brain",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "O Cinzel do Artesão: O que é um Prompt?",
          icon: "fa-comments",
          resources: 4,
          duration: "20 min",
        },
      ],
    },
    lessons: [],
    accordionContent: {
      1: {
        objective: "🎯 Os Fundamentos do Artesão",
        objectiveDesc:
          "Entenda o que é IA generativa e como ela cria conteúdo novo. Aqui começa seu ofício digital.",
      },
      2: {
        objective: "🎯 O Cinzel do Artesão",
        objectiveDesc:
          "Um prompt bem forjado é sua ferramenta mais poderosa: aprenda a escrever instruções que a IA entende de primeira.",
      },
    },
  },

  // ============================================================================
  // MÓDULO 2: O ARQUITETO DE AUTOMAÇÃO — POTÊNCIA DO CHATGPT
  // ============================================================================
  2: {
    objective:
      "Projete e construa sistemas inteligentes com o ChatGPT: dos alicerces até a automação completa do seu trabalho diário como um verdadeiro arquiteto digital.",
    learningPoints: [
      {
        text: "Projetar plantas-mestre com System Prompts avançados",
        icon: "fa-sliders",
      },
      { text: "Conectar estruturas com APIs externas", icon: "fa-code" },
      {
        text: "Construir seu próprio GPT como um módulo arquitetônico",
        icon: "fa-robot",
      },
      { text: "Automatizar fluxos de obra completos", icon: "fa-cog" },
    ],
    overviewData: {
      title:
        "O Arquiteto Digital: ChatGPT e Automação — Construa seu Próprio Ecossistema de Trabalho",
      description:
        "Bem-vindo à obra-prima da automação. Aqui você não apenas usará o ChatGPT — você construirá com ele. Aprenderá a projetar system prompts como se traçasse plantas, a usar ferramentas integradas como andaimes, a criar GPTs como módulos de construção e a conectar tudo com APIs externas para erguer estruturas digitais que trabalham sozinhas.",
      mission:
        "Sua missão como arquiteto: complete cada lição e domine a arte de construir com o ChatGPT. Cada estrutura que você projetar o aproxima da sua certificação como arquiteto de automação. Construa sua obra-prima digital!",
      topics: [
        {
          title: "As Plantas do Arquiteto: Guia Completo do ChatGPT",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "O Andaime do Arquiteto: Ferramentas Integradas",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "O Fluxo do Arquiteto: Automação no Mundo Real",
          icon: "fa-robot",
          resources: 1,
          duration: "22 min",
        },
        {
          title: "A Fachada do Edifício: GPTs e Function Calling",
          icon: "fa-code",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "As Plantas do Arquiteto: Guia Completo do ChatGPT",
        description: "Os alicerces de toda grande construção digital",
        detailedDescription:
          "Todo edifício começa com uma planta. Nesta lição, você conhecerá a arquitetura completa do ChatGPT: desde os modelos disponíveis até as melhores práticas de prompt engineering. Aprenda a selecionar a ferramenta certa para cada fase da sua construção e sente as bases dos seus projetos de automação.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC",
      },
      {
        id: 2,
        title: "O Andaime do Arquiteto: Ferramentas Integradas",
        description: "As ferramentas que erguem sua construção digital",
        detailedDescription:
          "Um arquiteto não constrói só com as mãos — usa guindastes, andaimes e ferramentas especializadas. Descubra o arsenal do ChatGPT: Pesquisa na Web, Análise de Dados com Python, DALL-E 3, Canvas e Projetos. Aprenda a combiná-los para erguer automações poderosas que multiplicam sua produtividade.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "A Fachada do Edifício: GPTs e Function Calling",
        description: "Conecte sua obra ao mundo real",
        detailedDescription:
          "A fachada é o que o mundo vê, mas por trás há uma estrutura complexa que a sustenta. Leve suas construções ao próximo nível: conecte GPTs personalizados com APIs, bancos de dados e serviços externos. Crie fluxos automatizados que resolvem problemas reais enquanto você projeta o próximo projeto.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Os Alicerces do Arquiteto",
        objectiveDesc:
          "Domine os fundamentos do ChatGPT: modelos, limites e técnicas profissionais de prompt engineering.",
        achievements: [
          {
            icon: "fa-check",
            text: "Compreender a arquitetura e a evolução dos modelos GPT como uma planta-mestre",
          },
          {
            icon: "fa-check",
            text: "Aplicar técnicas profissionais de prompt engineering como ferramentas de construção",
          },
          {
            icon: "fa-check",
            text: "Selecionar o modelo ideal conforme custo e capacidade — o material certo para cada obra",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar o modelo mais caro para tarefas simples — como usar uma britadeira para pendurar um quadro",
          },
          {
            icon: "fa-times",
            text: "Ignorar os limites de contexto — como construir sem medir o terreno",
          },
          {
            icon: "fa-times",
            text: "Não conhecer as atualizações de novos modelos — um arquiteto ignorante constrói castelos de cartas",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Aficionado: Usar GPT-4 para tudo, até para tarefas que o GPT-3.5 resolve em segundos",
          strong:
            "✅ Arquiteto: GPT-3.5 para rascunhos rápidos e resumos, GPT-4 para análises estruturais complexas e raciocínio profundo — o material certo para cada camada da construção",
        },
      },
      2: {
        objective: "🏗️ O Andaime do Arquiteto",
        objectiveDesc:
          "Domine o ecossistema de ferramentas do ChatGPT: Pesquisa na Web, Código, DALL-E 3, Canvas e Projetos.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar quando usar cada ferramenta como um arquiteto escolhe sua ferramenta precisa",
          },
          {
            icon: "fa-check",
            text: "Combinar múltiplas ferramentas em um único fluxo de trabalho como fases de uma construção",
          },
          {
            icon: "fa-check",
            text: "Criar automações que resolvem problemas reais — sua obra finalizada",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar DALL-E 3 para texto longo ou logotipos — como usar um cinzel para martelar",
          },
          {
            icon: "fa-times",
            text: "Confiar na base de treinamento para dados atuais — como construir com plantas desatualizadas",
          },
          {
            icon: "fa-times",
            text: "Não organizar projetos por objetivos específicos — como misturar materiais de 5 obras diferentes",
          },
        ],
        example: {
          label: "Exemplo de fluxo integrado",
          weak: "❌ Isolado: Pedir dados atualizados sem ativar Pesquisa na Web → resultado desatualizado como um edifício sem alicerces",
          strong:
            "✅ Integrado: Buscar dados atuais (Browse) → analisá-los com Python (Code Interpreter) → gerar infográfico (DALL-E 3) → editar no Canvas — uma construção em 4 fases perfeitamente orquestradas",
        },
      },
      3: {
        objective: "⚡ O Fluxo do Arquiteto",
        objectiveDesc:
          "Conecte suas construções ao mundo exterior via APIs: dados, ações e automação total.",
        achievements: [
          {
            icon: "fa-check",
            text: "Configurar Function Calling com a API da OpenAI como sistemas de encanamento digital",
          },
          {
            icon: "fa-check",
            text: "Definir funções com esquemas JSON claros — as plantas das suas conexões",
          },
          {
            icon: "fa-check",
            text: "Criar fluxos automatizados de múltiplas etapas que funcionam 24/7",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Não validar as respostas da API antes de usá-las — como não inspecionar os materiais de construção",
          },
          {
            icon: "fa-times",
            text: "Enviar dados sensíveis sem autenticação — como deixar as portas abertas na sua obra",
          },
          {
            icon: "fa-times",
            text: "Não gerenciar erros de conexão adequadamente — como não ter plano de contingência para terremotos",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Prompt básico: Qual é o clima hoje? — como perguntar o clima olhando pela janela",
          strong:
            "✅ Function Calling: O ChatGPT detecta a intenção, chama a API do clima, recebe dados JSON e gera: O clima atual em Bogotá é 18°C com 65% de umidade. Recomendamos levar guarda-chuva pela probabilidade de 80% de chuva à tarde. Uma fachada elegante que se conecta a dados vivos do mundo real.",
        },
      },
      4: {
        objective: "⚡ A Fachada do Edifício",
        objectiveDesc:
          "Crie GPTs sob medida e conecte-os ao mundo real com Function Calling: automatize seu trabalho diário.",
      },
    },
  },

  // ============================================================================
  // MÓDULO 3: RASTREIO PROFUNDO COM GEMINI
  // ============================================================================
  3: {
    objective:
      "Ajuste sua lupa digital: investigue a fundo, verifique cada pista e analise informações com a precisão de um detetive profissional.",
    learningPoints: [
      {
        text: "Analisar texto, imagem e código como um único corpo de evidências",
        icon: "fa-cubes",
      },
      { text: "Obter pistas frescas do mundo real na hora", icon: "fa-signal" },
      {
        text: "Cavar até a verdade: investigações que nenhum outro detetive faz",
        icon: "fa-search",
      },
      {
        text: "Separar os fatos das alucinações: verificação forense com IA",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "O Detetive de Dados: Investigação de Elite com Gemini",
      description:
        "Bem-vindo à academia de detetives digitais. Aqui você aprenderá a cruzar pistas em tempo real, analisar qualquer tipo de evidência (texto, imagem, áudio, vídeo) e verificar cada fato com a precisão de um perito forense de dados.",
      mission:
        "Sua missão: tornar-se o melhor detetive de dados do mundo. Domine o Google Gemini para cruzar pistas, verificar cada fonte e apresentar relatórios que qualquer diretor-executivo assinaria. Cada lição o aproxima do seu distintivo de detetive digital.",
      topics: [
        {
          title: "O Despertar do Detetive Multimodal",
          icon: "fa-google",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "Grounding: Quando a Evidência Toca o Chão",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "Deep Research: A Caixa de Ferramentas Forenses",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "O Despertar do Detetive Multimodal",
        description:
          "Gemini: sua lupa versátil que vê, lê e escuta ao mesmo tempo",
        detailedDescription:
          "Imagine uma lupa que não só vê imagens, mas também lê documentos, escuta áudios e analisa vídeos — tudo ao mesmo tempo. Esse é o Gemini. Nesta lição, você aprenderá a usar esse superpoder multimodal para analisar, criar e resolver casos que antes exigiam 4 ferramentas diferentes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Grounding: Quando a IA Toca o Mundo Real",
        description:
          "Conecte sua lupa ao solo firme: dados vivos do mundo real",
        detailedDescription:
          "De que adianta uma lupa se você não pode verificar o que vê? O grounding conecta o Gemini a informações vivas da internet. Aprenda a combinar imagens, documentos e dados em tempo real para obter respostas que não são apenas inteligentes — são verificáveis.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research: A Caixa de Ferramentas Forenses",
        description:
          "Cave até encontrar a verdade com ferramentas de pesquisa profunda",
        detailedDescription:
          "Os casos mais complexos exigem as ferramentas mais poderosas. Domine a pesquisa profunda com IA: Deep Research para explorar temas em sua totalidade, fact-checking automático para verificar cada fonte e geração de relatórios técnicos que qualquer especialista assinaria.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Ative sua Lupa Multimodal",
        objectiveDesc:
          "O Gemini processa texto, imagens, áudio e vídeo como um único idioma. Sua nova arma secreta de investigação.",
        achievements: [
          {
            icon: "fa-check",
            text: "Compreender como o Gemini processa texto, imagens, áudio e vídeo como um único idioma",
          },
          {
            icon: "fa-check",
            text: "Configurar seu arsenal: Gemini Advanced, Google AI Studio e todas as ferramentas do detetive",
          },
          {
            icon: "fa-check",
            text: "Saber exatamente quando usar Gemini vs. outros modelos — a ferramenta certa para cada caso",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Tratar o Gemini como um chatbot comum — é como usar um bisturi para cortar pão",
          },
          {
            icon: "fa-times",
            text: "Ignorar sua capacidade de análise visual — a evidência mais rica costuma estar nas imagens",
          },
          {
            icon: "fa-times",
            text: "Não usar o grounding — é como investigar com os olhos fechados",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: Perguntar 'O que é o Gemini?' — como um turista perguntando as horas",
          strong:
            "✅ Detetive: Enviar um gráfico financeiro, pedir análise de tendências com correlação de dados históricos, cruzar com pesquisa em tempo real de indicadores econômicos e receber um relatório executivo pronto para apresentar ao conselho de administração",
        },
      },
      2: {
        objective: "🔬 Raciocínio Multimodal",
        objectiveDesc:
          "Processe vários tipos de evidência ao mesmo tempo: texto, imagens, áudio e código. Quatro detetives em uma única mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analisar imagens e documentos como um perito forense digital",
          },
          {
            icon: "fa-check",
            text: "Usar grounding para obter dados frescos da internet — informação viva, não conhecimento congelado",
          },
          {
            icon: "fa-check",
            text: "Fundir texto, imagem, áudio e código em uma única análise coerente",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Enviar evidências borradas sem contexto — detetives trabalham com pistas claras",
          },
          {
            icon: "fa-times",
            text: "Confiar no grounding sem verificar — até a melhor fonte pode errar",
          },
          {
            icon: "fa-times",
            text: "Não dizer ao Gemini que tipo de análise você precisa — é como pedir a um perito 'olha isso'",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: 'Analise esta imagem' — sem contexto, sem instruções, sem direção",
          strong:
            "✅ Detetive: 'Analise este diagrama de arquitetura como se você fosse um auditor de sistemas. Identifique cada componente, trace o fluxo de dados, aponte vulnerabilidades de escalabilidade e compare com o padrão AWS 2024. Entregue um relatório executivo de 3 parágrafos com prioridades de ação.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "Para casos complexos: investigações profundas com fontes verificáveis e fact-checking automático.",
        achievements: [
          {
            icon: "fa-check",
            text: "Executar investigações profundas que cruzam dezenas de fontes automaticamente",
          },
          {
            icon: "fa-check",
            text: "Verificar cada fato na hora — sua rede de segurança contra a desinformação",
          },
          {
            icon: "fa-check",
            text: "Produzir relatórios de nível consultoria com referências verificáveis e citações exatas",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceitar fontes sem verificar — até o melhor detetive verifica duas vezes",
          },
          {
            icon: "fa-times",
            text: "Se contentar com a primeira resposta — a verdade costuma estar na segunda camada",
          },
          {
            icon: "fa-times",
            text: "Não contrastar com fontes primárias — pesquisa de qualidade é feita com documentos originais",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Novato: 'Quais são as tendências de IA em 2026?' — uma pergunta que qualquer um pode responder com o Google",
          strong:
            "✅ Detetive: 'Realize uma investigação forense das 5 principais tendências de IA generativa em 2026. Para cada tendência: fonte primária verificada, dados quantitativos de adoção empresarial, 2 casos de uso reais com nomes de empresas, riscos identificados com nível de criticidade e projeção de 3 anos com fontes. Apresente como relatório executivo com links verificáveis para cada fonte.'",
        },
      },
    },
  },

  // ============================================================================
  // MÓDULO 4: O ALQUIMISTA DO CONHECIMENTO — NOTEBOOKLM
  // ============================================================================
  4: {
    objective:
      "Converta documentos em ouro: podcasts que soam como rádio profissional, resumos diretos ao ponto e respostas que citam cada fonte sem inventar nada.",
    learningPoints: [
      {
        text: "Selecionar suas fontes como um joalheiro escolhe gemas",
        icon: "fa-book-open",
      },
      {
        text: "Destilar documentos em conhecimento puro com IA",
        icon: "fa-file-alt",
      },
      {
        text: "Criar podcasts que parecem programa de rádio a partir dos seus arquivos",
        icon: "fa-microphone",
      },
      {
        text: "Gerenciar sua biblioteca digital com inteligência sobre-humana",
        icon: "fa-folder-open",
      },
    ],
    overviewData: {
      title:
        "O Alquimista Digital: NotebookLM — Onde seus Documentos se Transformam em Conhecimento",
      description:
        "Neste módulo, você se tornará um alquimista digital: seus PDFs, artigos e anotações têm um potencial oculto que você nem imagina. Aprenda a extraí-lo, transformá-lo e compartilhá-lo em formatos que cativam, educam e transformam.",
      mission:
        "Torne-se um alquimista digital: seus PDFs, artigos e anotações têm um potencial oculto que você nem imagina. Aprenda a extraí-lo, transformá-lo e compartilhá-lo de formas que cativam, educam e transformam.",
      topics: [
        {
          title:
            "O Alquimista de Documentos: Seu Primeiro Feitiço com o NotebookLM",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "A Arte da Curadoria: Como Escolher e Sintetizar Fontes",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "A Fórmula Secreta: Audio Overviews e Gestão Documental",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "O Mestre Alquimista: Fluxo Completo Documento-Podcast",
          icon: "fa-headphones",
          resources: 1,
          duration: "24 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title:
          "O Alquimista de Documentos: Seu Primeiro Feitiço com o NotebookLM",
        description: "Onde os PDFs ganham vida",
        detailedDescription:
          "Conheça o NotebookLM, a ferramenta do Google que transforma seus PDFs, artigos e anotações em um assistente pessoal que responde com citações exatas. Ele não alucina. Não inventa. É o seu bibliotecário com superpoderes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B",
      },
      {
        id: 2,
        title: "A Arte da Curadoria: Como Escolher e Sintetizar Fontes",
        description: "Qualidade sobre quantidade, sempre",
        detailedDescription:
          "Aprenda a selecionar as melhores fontes como um joalheiro escolhe gemas, organizá-las por temas e conectar ideias entre documentos para criar resumos e análises de nível profissional.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981",
      },
      {
        id: 3,
        title: "A Fórmula Secreta: Audio Overviews e Gestão Documental",
        description: "Seus documentos falam por si só",
        detailedDescription:
          "Transforme seus documentos em conversas de podcast com duas vozes de IA. Uma experiência sonora que parece rádio profissional. Ideal para aprender enquanto você se movimenta. Gerencie sua biblioteca digital com inteligência sobre-humana.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 O Feitiço Inicial",
        objectiveDesc:
          "O NotebookLM só fala do que sabe: suas fontes. A IA que revoluciona a gestão do conhecimento.",
        achievements: [
          {
            icon: "fa-check",
            text: "Compreender por que a IA baseada nas suas próprias fontes é mais confiável",
          },
          {
            icon: "fa-check",
            text: "Criar seu primeiro notebook e ver os documentos ganharem vida",
          },
          {
            icon: "fa-check",
            text: "Distinguir um bibliotecário especialista (NotebookLM) de um chatbot genérico",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Enviar documentos sem ordem nem critério, como quem enche uma gaveta",
          },
          {
            icon: "fa-times",
            text: "Esperar magia sem colocar fontes de qualidade no caldeirão",
          },
          {
            icon: "fa-times",
            text: "Esquecer que ele só responde com o que VOCÊ dá — lixo entra, lixo sai",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Catalina enviou 50 PDFs desorganizados e obteve respostas confusas. Lixo entra, lixo sai.",
          strong:
            "✅ Felipe selecionou 5 artigos-chave, organizou-os por tema, adicionou contexto — e seu notebook se tornou um assistente especialista que respondia com citações exatas. A diferença: qualidade sobre quantidade.",
        },
      },
      2: {
        objective: "📚 Curadoria: A Arte de Escolher Bem",
        objectiveDesc:
          "Descubra por que um punhado de fontes bem selecionadas vale mais do que uma biblioteca inteira sem ordem.",
        achievements: [
          {
            icon: "fa-check",
            text: "Selecionar fontes como um degustador de vinhos escolhe sua safra",
          },
          {
            icon: "fa-check",
            text: "Organizar documentos por temas para que as conexões surjam sozinhas",
          },
          {
            icon: "fa-check",
            text: "Criar sínteses que cruzam ideias entre múltiplas fontes como uma ponte de conhecimento",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Enviar 50 documentos sem filtro — mais não é melhor, é ruído",
          },
          {
            icon: "fa-times",
            text: "Misturar fontes contraditórias sem contexto, como juntar água e óleo",
          },
          {
            icon: "fa-times",
            text: "Deixar as fontes envelhecerem sem atualizá-las — o conhecimento expira",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Sem curadoria: Enviar tudo o que encontro sobre IA — sem filtro, sem ordem, sem critério",
          strong:
            "✅ Com curadoria: 10 artigos selecionados por relevância, organizados por tema (ética, técnica, aplicações), com notas de contexto para cada grupo — como uma biblioteca projetada por um especialista",
        },
      },
      3: {
        objective: "🎙️ Audio Overviews",
        objectiveDesc:
          "Converta seus documentos em conversas de áudio geradas por IA, como um programa feito sob medida para você.",
        achievements: [
          {
            icon: "fa-check",
            text: "Gerar Audio Overviews a partir dos seus documentos e ouvi-los ganhar vida",
          },
          {
            icon: "fa-check",
            text: "Personalizar o tom: acadêmico profundo ou conversa casual, você escolhe",
          },
          {
            icon: "fa-check",
            text: "Transformar o estudo em experiência auditiva para aprender em qualquer lugar",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Esperar um podcast de 30 minutos com apenas 2 parágrafos de fonte",
          },
          {
            icon: "fa-times",
            text: "Não revisar o conteúdo antes de compartilhar — o alquimista sempre verifica sua poção",
          },
          {
            icon: "fa-times",
            text: "Usar apenas áudio sem complementar com resumos escritos — os dois formatos se potencializam",
          },
        ],
        example: {
          label: "Exemplo prático",
          weak: "❌ Áudio genérico: Duas vozes lendo o documento sem brilho nem estrutura",
          strong:
            "✅ Áudio focado: Podcast de 15 minutos em que dois apresentadores discutem os principais achados de 5 artigos sobre neuroplasticidade, com exemplos práticos, analogias e até um momento 'ahá!' que o torna inesquecível",
        },
      },
      4: {
        objective: "🧪 O Mestre Alquimista",
        objectiveDesc:
          "Domine o fluxo completo: de seus documentos a um podcast pronto para compartilhar.",
      },
    },
  },

  // ============================================================================
  // MÓDULO 5: ÉTICA APLICADA À IA GENERATIVA
  // ============================================================================
  5: {
    objective:
      "Domine os 4 pilares éticos que as empresas buscam hoje e torne-se o guardião que garante que a IA sirva à humanidade.",
    learningPoints: [
      {
        text: "Detectar vieses algorítmicos como um guardião",
        icon: "fa-shield-check",
      },
      {
        text: "Conhecer a regulamentação de IA que protege milhões",
        icon: "fa-briefcase",
      },
      { text: "Blindar dados e privacidade contra ameaças", icon: "fa-lock" },
      {
        text: "Criar protocolos éticos que salvam reputações",
        icon: "fa-clipboard-check",
      },
    ],
    overviewData: {
      title:
        "O Guardião Digital: Ética e Governança de IA — O Selo do Profissional Responsável",
      description:
        "Cada vez que você usa IA, está tomando decisões éticas — mesmo sem saber. Os dados que você envia estão protegidos? O resultado é justo para todos? Você sabe quem é responsável se algo der errado? Este módulo não é só teoria: é o seu treinamento para se tornar um guardião da IA.",
      mission:
        "Tornar-se o guardião que a IA precisa. Este módulo encerra sua certificação com as competências éticas que separam os profissionais responsáveis dos que colocam sua carreira em risco.",
      topics: [
        {
          title: "O Voto do Guardião: Os 4 Princípios Sagrados",
          icon: "fa-balance-scale",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "O Espelho da Verdade: Sua IA é Justa?",
          icon: "fa-exclamation-triangle",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "O Legado do Guardião: Navegando pela Lei",
          icon: "fa-shield-alt",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "O Voto do Guardião: Os 4 Princípios Sagrados",
        description:
          "Os fundamentos éticos que todo guardião de IA deve conhecer",
        detailedDescription:
          "Bem-vindo ao treinamento de guardiões. Antes de usar qualquer ferramenta de IA, há 4 princípios que você deve gravar no seu DNA profissional: transparência, equidade, responsabilidade e privacidade. Não são teoria abstrata — são o escudo que protege seus usuários, sua organização e sua reputação.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444",
      },
      {
        id: 2,
        title: "O Espelho da Verdade: Sua IA é Justa?",
        description: "Detecte e destrua os vieses ocultos nos algoritmos",
        detailedDescription:
          "Cada algoritmo herda os preconceitos de seus criadores e de seus dados. Nesta lição, você se tornará um caçador de vieses: aprenderá a detectar discriminação algorítmica, entender suas causas profundas e aplicar estratégias de justiça que tornem seus sistemas verdadeiramente inclusivos.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316",
      },
      {
        id: 3,
        title: "O Legado do Guardião: Navegando pela Lei",
        description:
          "O marco legal e as melhores práticas que todo guardião deve dominar",
        detailedDescription:
          "Não basta querer fazer o certo — é preciso conhecer a lei. Do AI Act da UE às regulamentações locais, passando por proteção de dados e governança corporativa. Esta lição lhe dá o mapa legal para navegar a IA sem colocar ninguém em risco.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B",
      },
    ],
    accordionContent: {
      1: {
        objective: "🛡️ O Juramento do Guardião Ético",
        objectiveDesc:
          "Construa um marco ético blindado para a IA generativa: proteja usuários, organizações e sociedade.",
        achievements: [
          {
            icon: "fa-check",
            text: "Internalizar os 4 pilares sagrados do guardião de IA",
          },
          {
            icon: "fa-check",
            text: "Detectar dilemas éticos em casos reais antes que causem dano",
          },
          {
            icon: "fa-check",
            text: "Aplicar um checklist ético infalível antes de cada uso de IA",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar IA como uma arma sem escudo: ignorar o impacto nas pessoas",
          },
          {
            icon: "fa-times",
            text: "Acreditar que a IA é neutra — tecnologia sem vigilância é perigosa",
          },
          {
            icon: "fa-times",
            text: "Ignorar as consequências não intencionais até que seja tarde demais",
          },
        ],
        example: {
          label: "O Guardião vs. O Imprudente",
          weak: "❌ O imprudente: Um estudante usou IA para gerar uma redação completa sem verificar nada. A IA inventou dados, citações falsas e referências inexistentes. O professor descobriu tudo e o estudante perdeu toda a credibilidade acadêmica.",
          strong:
            "✅ O guardião: Um estudante usou IA como assistente, verificou cada fonte com dados reais, informou o uso da IA ao professor e entregou um trabalho impecável. O resultado: aprendizado profundo + confiança do professor + nota perfeita.",
        },
      },
      2: {
        objective: "🔍 O Caçador de Vieses",
        objectiveDesc:
          "Detecte e elimine os vieses que a IA herda de seus dados antes que causem dano.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar 7 tipos de vieses algorítmicos como um especialista forense",
          },
          {
            icon: "fa-check",
            text: "Analisar casos reais em que a IA discriminou — e entender por quê",
          },
          {
            icon: "fa-check",
            text: "Aplicar técnicas cirúrgicas de mitigação de vieses",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Confiar cegamente nos resultados de IA sem verificar equidade",
          },
          {
            icon: "fa-times",
            text: "Alimentar a IA com dados de treinamento que excluem grupos inteiros",
          },
          {
            icon: "fa-times",
            text: "Nunca auditar os resultados de IA — o silêncio não é segurança",
          },
        ],
        example: {
          label: "A IA que Discriminava sem Saber",
          weak: "❌ Viesada: Uma IA de recrutamento aprendeu com 10 anos de dados históricos em que apenas homens ocupavam certos cargos. Automaticamente começou a filtrar mulheres — não por malícia, mas por dados corrompidos.",
          strong:
            "✅ Equitativa: A equipe de auditoria detectou o viés na fase de testes, re-treinou o modelo com dados balanceados, incluiu variáveis de equidade e estabeleceu auditorias trimestrais. A IA agora seleciona sem preconceitos.",
        },
      },
      3: {
        objective: "📜 O Código do Guardião",
        objectiveDesc:
          "Conheça as leis que regem a IA e projete protocolos que blindem sua organização.",
        achievements: [
          {
            icon: "fa-check",
            text: "Dominar o AI Act da União Europeia como um especialista em conformidade",
          },
          {
            icon: "fa-check",
            text: "Entender as obrigações legais de privacidade e transparência",
          },
          {
            icon: "fa-check",
            text: "Projetar um protocolo ético de IA digno de um guardião",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Ignorar a regulamentação vigente — a ignorância não isenta de multas",
          },
          {
            icon: "fa-times",
            text: "Processar dados pessoais com IA sem proteção legal",
          },
          {
            icon: "fa-times",
            text: "Implementar IA na sua organização sem políticas de governança",
          },
        ],
        example: {
          label: "Dois Mundos, um Único Algoritmo",
          weak: "❌ Sem protocolo: Uma startup implementou chatbots de atendimento ao cliente sem supervisão ética. Em 48 horas, o chatbot insultou clientes em 3 idiomas, violou normas de privacidade e gerou uma crise de relações públicas.",
          strong:
            "✅ Com protocolo: Um comitê de ética de IA aprovou cada implementação, auditorias trimestrais detectaram problemas antes que chegassem ao público, checklist de privacidade obrigatório antes de cada implantação e divulgação transparente ao usuário final. Resultado: confiança do cliente, zero incidentes.",
        },
      },
    },
  },
};

export { CONTENT_PT };
