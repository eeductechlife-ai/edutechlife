/**
 * courseKnowledgePt.js
 *
 * Base de conhecimento consolidada de todo o curso IALab (tradução pt-BR).
 * Utilizada pelo Valerio para responder perguntas dos estudantes
 * com contexto real do conteúdo do curso.
 *
 * Gerado automaticamente a partir de moduleContent.js + moduleResources.js
 */

const COURSE_KNOWLEDGE_PT = [
  {
    id: 1,
    title: "O Artesão Digital: A Arte de Forjar Prompts",
    objective:
      "Domine a arte de forjar instruções precisas com a IA como aprendiz de artesão digital, criando prompts que qualquer modelo entenda perfeitamente.",
    description:
      "Bem-vindo à oficina do artesão digital. Aqui você não memorizará teoria abstrata — aprenderá a esculpir instruções com a precisão de um mestre ourives. Cada prompt é uma ferramenta, e cada ferramenta tem a sua técnica. Dos fundamentos da IA Generativa ao domínio de instruções de alto impacto, este módulo é a sua bancada de trabalho.",
    challenge:
      "MISSÃO DO ARTESÃO: 'A Obra-Prima'. Chegou o momento de provar o seu ofício. Pegue um problema real da sua vida profissional ou acadêmica e projete uma sequência de prompts tão precisa que qualquer modelo de IA execute a tarefa perfeitamente, sem necessidade de correções. A marca do verdadeiro artesão.",
    topics: [
      {
        title: "Os Fundamentos do Artesão: O que é a IA Generativa?",
        description:
          "Antes de esculpir, é preciso conhecer o material. Assim como um carpinteiro entende a madeira ou um ferreiro o aço, você aprenderá os fundamentos da IA Generativa: a sua história, as suas capacidades e os seus limites. Este é o primeiro golpe de cinzel na sua jornada como artesão digital.",
        difficulty: "Principiante",
        learningObjectives: [
          "Compreender o que é a IA Generativa e como ela funciona — a matéria-prima do artesão",
          "Diferenciar entre IA fraca (estreita) e IA forte (geral) como um mestre distingue as suas ferramentas",
          "Identificar aplicações práticas na educação e nos negócios para saber onde aplicar o seu ofício",
          "Reconhecer os limites éticos e técnicos atuais — todo artesão conhece o alcance das suas ferramentas",
        ],
        resources: [
          {
            type: "video",
            title: "Explicação Visual: Anatomia de um Prompt",
            duration: "6:06",
          },
          {
            type: "ova",
            title: "Laboratório: Ética na I.A.",
            estimatedTime: "10 minutos",
          },
        ],
      },
      {
        title: "O Cinzel do Artesão: O que é um Prompt?",
        description:
          "Um prompt é o seu cinzel — a ferramenta fundamental com a qual você dá forma às respostas da IA. Assim como um escultor não culpa o mármore, um artesão digital não culpa o modelo: aprenda a talhar instruções com precisão milimétrica para que a IA execute exatamente o que você precisa.",
        difficulty: "Principiante",
        learningObjectives: [
          "Compreender o que é um prompt e como usá-lo como a ferramenta principal do artesão digital",
          "Dominar a anatomia de uma instrução: contexto, intenção, formato e restrições",
          "Praticar a arte da clareza — menos ambiguidade, mais precisão, melhores resultados",
        ],
        resources: [
          {
            type: "video",
            title: "Vídeo Introdutório: O que é a IA Generativa?",
            duration: "4:30",
          },
          { type: "pdf", title: "Guia: Anatomia de um Prompt", pages: 12 },
          { type: "ova", title: "Infografia Interativa: Prompt Engineering" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "O Arquiteto de Automação: Potencialize o ChatGPT",
    objective:
      "Projete e construa sistemas inteligentes com o ChatGPT: dos alicerces à automação completa do seu trabalho diário como um verdadeiro arquiteto digital.",
    description:
      "Bem-vindo à obra. Aqui você não só usará o ChatGPT — você o construirá. Assim como um arquiteto desenha plantas antes de erguer um prédio, você aprenderá a estruturar soluções de IA desde os alicerces: prompts de sistema profissionais, ferramentas integradas, GPTs personalizados e conexões com o mundo real por meio de APIs.",
    challenge:
      "MISSÃO DO ARQUITETO: 'O Prédio Inteligente'. Sua missão é projetar e construir um sistema completo de automação usando o ChatGPT: combine prompts de sistema, ferramentas integradas, um GPT personalizado e conexão com API externa. O resultado deve ser um fluxo de trabalho autônomo que resolva um problema real da sua área profissional.",
    topics: [
      {
        title: "As Plantas do Arquiteto: Guia Completo do ChatGPT",
        description:
          "Todo grande prédio começa com uma planta-mestra. Nesta lição, você conhecerá os alicerces do ChatGPT: a sua arquitetura, os seus modelos, a sua interface e as melhores práticas para lançar as bases das suas construções digitais.",
        difficulty: "Principiante",
        learningObjectives: [
          "Navegar pela interface do ChatGPT como um arquiteto conhece o seu estúdio",
          "Configurar conversas como plantas detalhadas para cada propósito",
          "Aplicar técnicas de prompt engineering como ferramentas de construção profissional",
        ],
        resources: [
          {
            type: "video",
            title: "Tutorial: Primeiros Passos com o ChatGPT",
            duration: "5:43",
          },
          { type: "pdf", title: "Guia Completo do ChatGPT", pages: 25 },
          { type: "ova_interactive", title: "Dominando o Ecossistema ChatGPT" },
        ],
      },
      {
        title: "O Andaime do Arquiteto: Ferramentas Integradas",
        description:
          "Um arquiteto não constrói apenas com as próprias mãos — usa andaimes, guindastes e ferramentas especializadas. Descubra o arsenal de ferramentas integradas do ChatGPT: Pesquisa na Web, Análise de Dados, DALL-E 3, Canvas e muito mais. Aprenda a combiná-las como um mestre de obras para construir fluxos de trabalho que multiplicam a sua produtividade.",
        difficulty: "Intermediário",
        learningObjectives: [
          "Identificar as 5 ferramentas-chave do ecossistema ChatGPT e quando usar cada uma",
          "Selecionar a ferramenta correta como um arquiteto escolhe o material adequado",
          "Combinar múltiplas ferramentas em fluxos de trabalho eficientes e automatizados",
        ],
        resources: [
          {
            type: "pdf",
            title: "As Ferramentas Integradas do ChatGPT",
            pages: 20,
          },
          {
            type: "ova_interactive",
            title: "Simulador: Crie o Seu Primeiro Fluxo",
          },
        ],
      },
      {
        title: "A Fachada do Prédio: GPTs e Function Calling",
        description:
          "A fachada é o que o mundo vê — mas por trás há uma estrutura complexa que a sustenta. Aprenda a construir GPTs personalizados com ações que se conectam ao mundo real por meio de APIs. A sua obra-prima de arquitetura digital, pronta para interagir com qualquer sistema externo.",
        difficulty: "Avançado",
        learningObjectives: [
          "Criar GPTs personalizados como módulos de construção reutilizáveis",
          "Configurar ações de Function Calling para conectar a APIs externas",
          "Compartilhar as suas criações e aprender com a comunidade de arquitetos digitais",
        ],
        resources: [
          {
            type: "video",
            title: "Tutorial: Criando o Seu Primeiro GPT",
            duration: "18:45",
          },
          { type: "image", title: "Guia de GPTs e Ações" },
          { type: "ova", title: "Laboratório: Construa um GPT" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "O Detetive de Dados: Investigação Profunda com o Gemini",
    objective:
      "Empunhe a lupa da IA: investigue, verifique e analise com o Gemini como o melhor detetive digital do mundo.",
    description:
      "Gire a lupa do Google Gemini e descubra como os dados ganham vida. Aprenda a cruzar pistas em tempo real, analisar qualquer formato e separar a verdade da ficção com precisão de detetive.",
    challenge:
      "MISSÃO: 'A Investigação Definitiva'. O mundo está cheio de informações contraditórias. Sua missão: usar o Gemini Deep Research para separar os fatos da ficção, verificar cada fonte e apresentar um relatório que qualquer CEO assinaria sem hesitar.",
    topics: [
      {
        title: "O Superpoder Multimodal: Veja o que Ninguém Mais Consegue Ver",
        description:
          "E se a sua lupa pudesse ler, ouvir e ver ao mesmo tempo? O Gemini processa texto, imagens, áudio e vídeo como um investigador sobre-humano. Uma única ferramenta. Múltiplas dimensões.",
        difficulty: "Principiante",
        learningObjectives: [
          "Desbloquear o poder de processar texto, imagens, áudio e vídeo em uma única conversa",
          "Interrogar o Gemini com qualquer tipo de evidência: texto, imagem, áudio ou vídeo",
          "Descobrir por que o Gemini enxerga o mundo de forma diferente do ChatGPT, do Claude e de outros modelos",
        ],
        resources: [
          {
            type: "video",
            title: "Gemini: Sua Primeira Imersão",
            duration: "7:34",
          },
          {
            type: "pdf",
            title: "O Compêndio do Detetive: 16 Páginas de Poder Multimodal",
            pages: 16,
          },
          {
            type: "ova",
            title: "Laboratório: Coloque a Sua Lupa Multimodal à Prova",
          },
        ],
      },
      {
        title: "Grounding: Quando a IA Toca o Mundo Real",
        description:
          "O Gemini não apenas pensa — ele também pisa em terra firme. Aprenda a enraizá-lo no Google Docs, Sheets, Gmail e em todo o Workspace. Dados vivos. Respostas frescas. Zero suposições.",
        difficulty: "Intermediário",
        learningObjectives: [
          "Redigir documentos impecáveis com o Gemini como o seu coautor invisível",
          "Transformar planilhas em pistas visuais que revelam padrões ocultos",
          "Dominar a sua caixa de entrada: o Gemini resume, redige e prioriza por você",
        ],
        resources: [
          {
            type: "video",
            title:
              "O Gemini no Seu Escritório: Tutorial Definitivo do Workspace",
            duration: "20:15",
          },
          {
            type: "document",
            title: "Kit de Sobrevivência: Modelos para o Google Workspace",
          },
          {
            type: "ova",
            title: "O Gemini: Missão Interativa — Explore e Domine",
          },
        ],
      },
      {
        title: "A Arte da Investigação: Transforme Dados em Verdades Ocultas",
        description:
          "Os melhores detetives do mundo digital já usam o Gemini. Descubra casos reais em marketing, programação, educação e pesquisa em que a IA resolveu o que parecia impossível.",
        difficulty: "Avançado",
        learningObjectives: [
          "Projetar campanhas que a concorrência não vê chegar, respaldadas por dados em tempo real",
          "Depurar, otimizar e documentar código como se você tivesse um desenvolvedor sênior ao seu lado 24/7",
          "Transformar qualquer tema em uma investigação interativa que os seus alunos vão lembrar",
        ],
        resources: [
          {
            type: "video",
            title: "Casos que Inspiram: Detetives Reais, Resultados Reais",
            duration: "16:30",
          },
          {
            type: "pdf",
            title: "Arquivo de Casos: 24 Páginas de Missões Cumpridas",
            pages: 24,
          },
          {
            type: "ova",
            title: "Laboratório: Resolva o Caso — 6 Desafios Reais",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "O Alquimista do Conhecimento: NotebookLM",
    objective:
      "Transforme documentos em ouro: podcasts que encantam, resumos que iluminam e um assistente que só fala do que sabe.",
    description:
      "Imagine um bibliotecário que leu cada palavra dos seus PDFs, os entende em profundidade e responde com citações exatas. Sem alucinações. Sem invenções. Isso é o NotebookLM: a ferramenta do Google que transforma documentos em conhecimento vivo.",
    challenge:
      "MISSÃO: Crie um programa de rádio científico. Transforme 5 artigos sobre neuroplasticidade em um podcast de 15 minutos que até a sua avó entenderia.",
    topics: [
      {
        title:
          "O Alquimista de Documentos: Transforme PDFs em Ouro de Conhecimento",
        description:
          "Conheça o seu novo superpoder: o NotebookLM, o assistente do Google que lê todas as suas fontes e responde apenas com informações verificadas. Não é um chatbot qualquer — é o seu bibliotecário pessoal com memória impecável.",
        difficulty: "Principiante",
        learningObjectives: [
          "Construir a sua primeira biblioteca inteligente onde os documentos ganham vida",
          "Interrogar as suas fontes como um detetive que busca a verdade",
          "Destilar montanhas de texto em resumos objetivos",
        ],
        resources: [
          {
            type: "video",
            title: "Primeiros Passos com o NotebookLM",
            duration: "10:15",
          },
          { type: "pdf", title: "Guia do NotebookLM", pages: 14 },
          { type: "ova", title: "Laboratório: Crie o Seu Notebook" },
        ],
      },
      {
        title: "A Arte da Curadoria: Qualidade em vez de Quantidade",
        description:
          "Aprenda a selecionar fontes como um joalheiro escolhe gemas, a organizá-las por temas e a conectar ideias entre documentos para criar resumos e análises de nível profissional.",
        difficulty: "Intermediário",
        learningObjectives: [
          "Gerar resumos executivos que parecem escritos por uma equipe de analistas",
          "Criar FAQs que antecipam cada pergunta antes mesmo de você formulá-la",
          "Conectar cada resposta à sua fonte original com precisão cirúrgica",
        ],
        resources: [
          {
            type: "video",
            title: "Resumos Inteligentes com o NotebookLM",
            duration: "3:33",
          },
          { type: "document", title: "Modelos de Resumo" },
          { type: "ova", title: "Simulador: Análise de Documentos" },
        ],
      },
      {
        title: "A Magia do Áudio: Seus Documentos Falam por Si Mesmos",
        description:
          "Explore o recurso de Audio Overview que transforma as suas anotações em conversas de podcast geradas por IA. Duas vozes, uma conversa, zero jargão desnecessário.",
        difficulty: "Avançado",
        learningObjectives: [
          "Dar vida aos seus documentos com Audio Overviews que parecem programa de rádio",
          "Ajustar o tom: seja acadêmico, conversacional ou didático de acordo com o seu público",
          "Aprender em movimento: transformar o estudo em uma experiência auditiva",
        ],
        resources: [
          {
            type: "video",
            title: "Crie o seu próprio podcast",
            duration: "2:16",
          },
          { type: "pdf", title: "Notebook LM", pages: 10 },
          { type: "ova", title: "Laboratório: Crie o Seu Podcast de IA" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "O Escudo do Guardião: Ética Aplicada à IA Generativa",
    objective:
      "Domine os 4 pilares éticos que as empresas buscam hoje e torne-se o guardião que garante que a IA sirva à humanidade.",
    description:
      "Cada decisão que você toma com IA tem um impacto real. Neste módulo final, você vai se treinar para identificar vieses ocultos, navegar por regulamentações complexas e construir frameworks éticos que protejam usuários, organizações e a você mesmo.",
    challenge:
      "MISSÃO CRÍTICA: O Algoritmo Invisível. Em algum lugar do mundo, um algoritmo está tomando decisões que arruínam vidas — negando empréstimos, filtrando currículos, decidindo sentenças. Sua missão: localizar um caso real de viés algorítmico, dissecá-lo com evidências e projetar um protocolo ético blindado que impeça que volte a acontecer.",
    topics: [
      {
        title: "O Voto do Guardião: Os 4 Princípios Sagrados",
        description:
          "Antes de tocar uma linha de código ou escrever um prompt, há 4 princípios que separam um profissional ético de um imprudente. Transparência, equidade, responsabilidade e privacidade — não são teoria, são o seu escudo.",
        difficulty: "Intermediário",
        learningObjectives: [
          "Internalizar os 4 pilares éticos que definem um guardião de IA",
          "Detectar dilemas éticos em casos reais antes que eles escalem",
          "Aplicar um checklist ético infalível antes de cada uso de IA",
        ],
        resources: [
          { type: "video", title: "Os Pilares da I.A", duration: "1:56" },
          {
            type: "pdf",
            title: "Ética da Inteligência Artificial",
            pages: 9,
          },
          { type: "ova", title: "Laboratório: Detecte o Viés" },
        ],
      },
      {
        title: "O Espelho da Verdade: A Sua IA é Justa para Todos?",
        description:
          "A sua IA só é tão boa quanto os dados que a alimentam. E os dados têm preconceitos. Aprenda a proteger os seus dados pessoais e corporativos como um guardião blindaria a sua fortaleza.",
        difficulty: "Intermediário",
        learningObjectives: [
          "Decifrar como as IAs processam e armazenam os seus dados",
          "Identificar vulnerabilidades de privacidade antes que outros as explorem",
          "Implementar blindagens de proteção que superem os padrões da indústria",
        ],
        resources: [
          {
            type: "video",
            title: "Privacidade e IA: O que Você Precisa Saber",
            duration: "9:20",
          },
          { type: "pdf", title: "Manual de Privacidade em IA", pages: 13 },
          { type: "ova", title: "Simulador: Avaliação de Riscos" },
        ],
      },
      {
        title: "O Legado do Guardião: Construindo um Futuro Ético",
        description:
          "A IA não é boa nem má — é poder. E poder sem ética é perigoso. Este framework vai ensiná-lo a usar a IA na educação, no trabalho e na vida com a responsabilidade de quem sabe que as suas decisões importam.",
        difficulty: "Avançado",
        learningObjectives: [
          "Aplicar princípios éticos como um guardião em cada interação com IA",
          "Reconhecer e deter usos inadequados de IA antes que causem danos",
          "Liderar pelo exemplo: promover transparência e prestação de contas",
        ],
        resources: [
          {
            type: "video",
            title: "IA Ética: Princípios e Prática",
            duration: "6:05",
          },
          { type: "ova", title: "Laboratório: Dilemas Éticos" },
        ],
      },
    ],
  },
];

export default COURSE_KNOWLEDGE_PT;
