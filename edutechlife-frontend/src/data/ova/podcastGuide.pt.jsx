import {
  Brain,
  FileText,
  Play,
  Headphones,
  Star,
  AlertTriangle,
  BookOpen,
  Link as LinkIcon,
  Lightbulb,
} from "lucide-react";

export const MODULE_DATA = [
  {
    id: 1,
    title: "O que é o NotebookLM?",
    icon: <Brain className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Seu Assistente de Pesquisa",
        text: "O NotebookLM é uma ferramenta experimental do Google impulsionada por inteligência artificial. Ao contrário de um chatbot tradicional que busca em toda a web, o NotebookLM se torna um especialista personalizado apenas nos documentos que você fornece.",
      },
      {
        type: "comparison",
        title: "NotebookLM vs ChatGPT",
        text: "É crucial entender a diferença para usar a ferramenta certa:",
        items: [
          {
            name: "Fonte de dados",
            nb: "Seus próprios documentos enviados.",
            gpt: "Toda a internet.",
          },
          {
            name: "Alucinações (Erros)",
            nb: "Quase nulas. Inclui citações diretas ao seu texto.",
            gpt: "Possíveis. Pode inventar informações.",
          },
          {
            name: "Objetivo principal",
            nb: "Sintetizar e estudar material próprio.",
            gpt: "Gerar ideias, redação e consultas gerais.",
          },
        ],
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Imagine que você tem um PDF de 200 páginas sobre História da Colômbia e precisa de um resumo detalhado com referências exatas às páginas. Qual ferramenta você escolhe?",
        options: [
          {
            text: "ChatGPT, porque ele sabe muito de história.",
            correct: false,
            feedback:
              "Incorreto. O ChatGPT poderia resumir conceitos gerais, mas não fornecerá as citações exatas daquele PDF específico.",
          },
          {
            text: "NotebookLM, porque trabalhará exclusivamente com o meu PDF.",
            correct: true,
            feedback:
              "Excelente! O NotebookLM analisará seu documento e dará respostas com citações diretas ao texto original.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Ferramentas e Fontes",
    icon: <FileText className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Múltiplos Formatos",
        text: "Para que o NotebookLM funcione, você deve criar um 'Caderno' (Notebook) e adicionar 'Fontes' a ele. Você pode enviar vários tipos de arquivos para enriquecer sua pesquisa.",
      },
      {
        type: "grid",
        title: "Tipos de Fontes Aceitas",
        items: [
          {
            title: "Arquivos Locais",
            desc: "PDFs, Arquivos de texto (.txt) e Markdown.",
            icon: <FileText className="w-8 h-8 text-corporate" />,
          },
          {
            title: "Google Drive",
            desc: "Google Docs e Google Slides diretamente da sua nuvem.",
            icon: <BookOpen className="w-8 h-8 text-corporate" />,
          },
          {
            title: "Links da Web",
            desc: "URLs de artigos ou páginas web públicas.",
            icon: <LinkIcon className="w-8 h-8 text-corporate" />,
          },
          {
            title: "Multimídia",
            desc: "Áudios (mp3) e Vídeos do YouTube.",
            icon: <Headphones className="w-8 h-8 text-corporate" />,
          },
        ],
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Qual é a principal vantagem de enviar diferentes tipos de fontes (ex.: um PDF e um vídeo do YouTube) para o mesmo caderno?",
        options: [
          {
            text: "A IA pode cruzar informações e encontrar conexões entre o texto e o vídeo.",
            correct: true,
            feedback:
              "Exato! Ao misturar fontes, o NotebookLM sintetiza as informações de todas elas, dando a você uma visão global.",
          },
          {
            text: "Faz a interface do aplicativo ficar mais bonita.",
            correct: false,
            feedback:
              "Incorreto. A verdadeira vantagem é o cruzamento de informações para uma melhor análise.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Guia Passo a Passo",
    icon: <Play className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Seu Primeiro Caderno",
        text: "Criar o seu espaço de estudo é muito simples. Você só precisa de uma conta do Google e seguir estes 3 passos fundamentais.",
      },
      {
        type: "steps",
        title: "Fluxo de Trabalho",
        items: [
          "1. Criar: Clique em 'Novo Caderno' na página principal.",
          "2. Alimentar: Envie seus PDFs, anotações de aula ou links da web na seção de fontes.",
          "3. Interagir: Use a barra de chat para fazer perguntas, pedir resumos ou criar guias de estudo.",
        ],
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Depois de enviar suas fontes, a IA dá uma resposta, mas você quer saber de onde ela tirou aquela informação. O que você deve fazer?",
        options: [
          {
            text: "Buscar a resposta no Google manualmente.",
            correct: false,
            feedback: "Incorreto. O NotebookLM já faz esse trabalho por você.",
          },
          {
            text: "Clicar nos números de 'Citações' que aparecem ao final do texto gerado.",
            correct: true,
            feedback:
              "Correto! Esses números levam você diretamente à linha exata do seu documento original.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Audio Overview (Podcasts)",
    icon: <Headphones className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Suas Anotações em Áudio",
        text: "Uma das ferramentas mais inovadoras do NotebookLM é o 'Audio Overview' (Resumo em Áudio). Com um único clique, a IA converte todos os seus documentos em uma conversa estilo podcast entre dois apresentadores virtuais.",
      },
      {
        type: "text",
        title: "Para que serve?",
        text: "É ideal para estudantes auditivos ou para aproveitar tempos ociosos (como no transporte público). Os apresentadores virtuais debatem os temas dos seus documentos, fazem brincadeiras e explicam conceitos complexos com analogias fáceis de entender.",
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Qual seria o melhor momento para usar a função de Audio Overview?",
        options: [
          {
            text: "Quando tenho que entregar um ensaio escrito em 10 minutos.",
            correct: false,
            feedback:
              "Incorreto. Para isso, seria melhor pedir ao chat um esquema escrito.",
          },
          {
            text: "Quando vou no ônibus a caminho da universidade e quero revisar minhas leituras.",
            correct: true,
            feedback:
              "Perfeito! O formato podcast é ideal para aprender enquanto você está em movimento, sem olhar para uma tela.",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Aplicações Acadêmicas",
    icon: <Star className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Casos de Uso Reais",
        text: "O NotebookLM se adapta a qualquer carreira. Vejamos como diferentes estudantes o usam.",
      },
      {
        type: "grid",
        title: "Exemplos por Faculdade",
        items: [
          {
            title: "Direito",
            desc: "Enviar dezenas de sentenças judiciais para encontrar jurisprudência cruzada.",
            icon: <BookOpen className="w-8 h-8 text-corporate" />,
          },
          {
            title: "Medicina",
            desc: "Enviar papers científicos médicos para extrair sintomas e tratamentos em uma tabela.",
            icon: <Brain className="w-8 h-8 text-corporate" />,
          },
          {
            title: "Engenharia",
            desc: "Enviar extensos manuais técnicos para buscar especificações precisas.",
            icon: <Lightbulb className="w-8 h-8 text-corporate" />,
          },
        ],
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Você é estudante de Humanas e precisa ler 3 livros diferentes sobre a Revolução Francesa. Como o NotebookLM ajuda você?",
        options: [
          {
            text: "Ele lê os livros por mim e eu não tenho que fazer nada.",
            correct: false,
            feedback:
              "Incorreto. A IA auxilia, mas o aprendizado exige a sua análise crítica.",
          },
          {
            text: "Posso enviar os 3 livros e pedir que ele mostre em quais pontos os autores discordam.",
            correct: true,
            feedback:
              "Excelente! A análise comparativa de múltiplas fontes é o superpoder do NotebookLM.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Dicas e Limitações",
    icon: <AlertTriangle className="w-5 h-5" />,
    content: [
      {
        type: "text",
        title: "Boas Práticas",
        text: "Lembre-se: a IA é um assistente, não um substituto do seu intelecto. Sempre verifique as informações clicando nas citações.",
      },
      {
        type: "text",
        title: "Limitações Atuais",
        text: "O NotebookLM não busca na internet em tempo real (usa apenas o que você envia). Além disso, tem um limite de fontes por caderno (atualmente 50) e um limite de palavras por documento.",
      },
      {
        type: "activity",
        title: "Verifique o seu aprendizado",
        text: "Você está fazendo uma pesquisa sobre uma notícia de última hora que ocorreu hoje de manhã. O NotebookLM é a sua melhor opção?",
        options: [
          {
            text: "Não, porque o NotebookLM não tem conexão com a internet para buscar notícias recentes.",
            correct: true,
            feedback:
              "Correto! Para eventos em tempo real, é melhor um buscador web tradicional ou o ChatGPT com navegação na web.",
          },
          {
            text: "Sim, é sempre a melhor opção para qualquer coisa.",
            correct: false,
            feedback:
              "Incorreto. Conheça as limitações das suas ferramentas para usá-las adequadamente.",
          },
        ],
      },
    ],
  },
];

export const FINAL_CHALLENGE = [
  {
    question:
      "Um estudante tem 20 PDFs, 3 vídeos do YouTube e anotações pessoais para preparar a sua tese. Qual estratégia com o NotebookLM seria mais eficiente e por quê?",
    options: [
      {
        text: "Criar um caderno diferente para cada tipo de arquivo, para não confundir a IA.",
        correct: false,
      },
      {
        text: "Enviar tudo para o mesmo caderno, para que a IA cruze as informações, encontre padrões e gere conexões entre os PDFs e os vídeos.",
        correct: true,
      },
      {
        text: "Ler os PDFs por conta própria e enviar apenas os vídeos para a plataforma.",
        correct: false,
      },
    ],
    feedback:
      "Agrupar fontes relacionadas permite análises complexas e abrangentes.",
  },
  {
    question:
      "Um colega usa respostas de IA sem verificar fontes. Como o NotebookLM ajuda a reduzir esse problema específico?",
    options: [
      {
        text: "O NotebookLM bloqueia automaticamente as respostas incorretas.",
        correct: false,
      },
      {
        text: "O NotebookLM obriga você a ler o documento inteiro antes de responder.",
        correct: false,
      },
      {
        text: "O NotebookLM inclui hiperlinks (citações) em cada resposta, que levam você diretamente ao parágrafo exato do documento original.",
        correct: true,
      },
    ],
    feedback:
      "As citações verificáveis são a chave da confiança acadêmica no NotebookLM.",
  },
  {
    question:
      "Qual seria a melhor forma de usar o 'Audio Overview' para um estudante com longos deslocamentos diários?",
    options: [
      {
        text: "Gerar um podcast com todas as suas leituras complexas da semana, para ouvi-las e assimilar conceitos de forma conversacional no ônibus.",
        correct: true,
      },
      {
        text: "Usá-lo para que a IA dite o texto exato do livro de forma robótica enquanto ele dorme.",
        correct: false,
      },
      {
        text: "Gravar a própria voz lendo e enviá-la para a IA editar.",
        correct: false,
      },
    ],
    feedback:
      "O Audio Overview transforma textos densos em conversas agradáveis, ideais para períodos de deslocamento.",
  },
  {
    question:
      "Por que misturar diferentes tipos de fontes (ex.: artigos científicos + vídeos de entrevistas) melhora a análise no NotebookLM?",
    options: [
      {
        text: "Porque faz o caderno parecer mais profissional e organizado.",
        correct: false,
      },
      {
        text: "Porque fornece diferentes perspectivas sobre o mesmo tema, permitindo que a IA dê respostas mais ricas e multidimensionais.",
        correct: true,
      },
      {
        text: "Porque a plataforma exige enviar pelo menos 3 formatos diferentes.",
        correct: false,
      },
    ],
    feedback:
      "A diversidade de fontes enriquece o contexto e a qualidade das respostas da IA.",
  },
  {
    question:
      "Analise este cenário: Um estudante deve entregar um relatório sobre o impacto econômico do clima da semana atual. Por que o NotebookLM NÃO seria a ferramenta principal?",
    options: [
      {
        text: "Porque o NotebookLM é ruim para analisar temas de economia e matemática.",
        correct: false,
      },
      {
        text: "Porque a interface não suporta números nem gráficos financeiros.",
        correct: false,
      },
      {
        text: "Porque o NotebookLM se baseia em documentos enviados e estáticos, e não faz buscas na web ao vivo para obter dados climáticos da semana atual.",
        correct: true,
      },
    ],
    feedback:
      "É vital saber quando usar IA de análise fechada versus IA conectada à web em tempo real.",
  },
];

export const learningObjectives = [
  "Compreender como o NotebookLM transforma documentos em conteúdo de áudio",
  "Aprender a selecionar e organizar fontes para gerar podcasts",
  "Identificar os tipos de conteúdo ideais para Audio Overviews",
  "Avaliar a qualidade e a utilidade dos podcasts gerados por IA",
];

export const furtherReading = [
  {
    title: "NotebookLM Audio Overview Guide",
    url: "https://blog.google/technology/ai/notebooklm-audio-overviews/",
    description: "Guia oficial sobre a função Audio Overview do NotebookLM.",
  },
  {
    title: "AI Podcast Creation Best Practices",
    url: "https://www.edutechlife.com/blog/ai-podcast-creation",
    description: "Melhores práticas para criar podcasts com IA.",
  },
];
