export const tools = [
  {
    id: "browse",
    title: "Pesquisa na web",
    icon: "Globe",
    iconColor: "text-blue-500",
    desc: "Conecta o ChatGPT a informações recentes e mostra as fontes. Confira: abra pelo menos uma fonte e confirme a data antes de usar um número.",
    pros: [
      "Notícias e preços recentes",
      "Normas e dados vigentes",
      "Fontes que você pode abrir",
    ],
    cons: [
      "Não serve para conceitos básicos que você já conhece",
      "Uma resposta sem fontes é só uma hipótese",
    ],
    prompt:
      "Busque o preço atual de [produto] na minha cidade e me dê os links das fontes com a data.",
    audio:
      "A pesquisa na web permite ao ChatGPT consultar informações recentes. Peça sempre as fontes e abra pelo menos uma antes de usar um número.",
    useCases: [
      "Comparar preços",
      "Conferir normas vigentes",
      "Confirmar uma notícia",
    ],
  },
  {
    id: "files",
    title: "Análise de arquivos e dados",
    icon: "Code",
    iconColor: "text-emerald-500",
    desc: "Lê seus PDFs, planilhas e tabelas para resumir, organizar ou transformar em gráfico. Confira: refaça uma linha à mão e peça a página de cada dado.",
    pros: [
      "Resumir documentos longos",
      "Organizar e graficar uma tabela",
      "Responder perguntas sobre o seu arquivo",
    ],
    cons: [
      "Pode errar com tabelas muito bagunçadas",
      "Não envie dados pessoais de terceiros",
    ],
    prompt:
      "Revise esta planilha de vendas, faça uma tabela por mês e um gráfico de barras e me diga como calculou cada total.",
    audio:
      "A análise de arquivos permite enviar um documento ou uma tabela e pedir um resumo ou um gráfico. Refaça uma linha à mão para conferir o resultado.",
    useCases: [
      "Resumir um relatório",
      "Graficar as vendas do mês",
      "Organizar uma lista de contatos sem dados sensíveis",
    ],
  },
  {
    id: "images",
    title: "Criação de imagens",
    icon: "ImageIcon",
    iconColor: "text-purple-500",
    desc: "Transforma uma descrição em uma ilustração. Confira: revise os textos dentro da imagem e os direitos; uma imagem ilustra, não prova.",
    pros: ["Ilustrar uma ideia", "Fundos e capas", "Ideias visuais rápidas"],
    cons: [
      "Falha com textos longos dentro da imagem",
      "Não copia logotipos nem marcas com exatidão",
    ],
    prompt:
      "Crie uma ilustração simples do ciclo da água com etapas claras e sem texto dentro da imagem.",
    audio:
      "A criação de imagens serve para ilustrar ideias. Revise os detalhes, os textos e os direitos antes de publicar.",
    useCases: ["Material didático visual", "Capas", "Visualizar um conceito"],
  },
  {
    id: "canvas",
    title: "Canvas",
    icon: "Layout",
    iconColor: "text-orange-500",
    desc: "Um painel ao lado do chat para editar um texto com você. Confira: leia cada mudança antes de aceitá-la.",
    pros: [
      "Editar só um parágrafo",
      "Ajustar tom e extensão",
      "Manter o resto do documento",
    ],
    cons: [
      "Mais útil em textos longos",
      "As mudanças precisam ser revisadas uma a uma",
    ],
    prompt:
      "Abra o Canvas e me ajude a organizar um texto sobre o meu negócio; mude só o segundo parágrafo.",
    audio:
      "O Canvas abre um painel ao lado do chat onde você e o ChatGPT trabalham no mesmo documento. Revise cada mudança antes de aceitá-la.",
    useCases: [
      "Reescrever uma seção",
      "Melhorar um e-mail longo",
      "Adaptar um manual",
    ],
  },
  {
    id: "voice",
    title: "Voz",
    icon: "Mic",
    iconColor: "text-indigo-500",
    desc: "Converse com o ChatGPT falando: serve para praticar, ditar e pensar em voz alta. Confira: confirme a transcrição antes de enviar algo importante.",
    pros: [
      "Praticar um idioma",
      "Ditar ideias enquanto caminha",
      "Brainstorming rápido",
    ],
    cons: [
      "Pode entender mal nomes e números",
      "Depende do seu plano e dispositivo",
    ],
    prompt:
      "Vamos conversar em inglês sobre o meu dia de trabalho e me corrija quando eu errar.",
    audio:
      "A voz permite conversar com o ChatGPT. Confirme sempre a transcrição antes de usar algo importante.",
    useCases: [
      "Praticar um idioma",
      "Ditar uma ideia",
      "Preparar uma apresentação falando",
    ],
  },
];

export const quizScenarios = [
  {
    question:
      "Você é professor e prepara um manual de laboratório de 20 páginas. Precisa reescrever só a seção “Normas de segurança” com um tom para adolescentes, sem mexer no resto. Qual ferramenta serve melhor?",
    options: ["Pesquisa na web", "Canvas", "Criação de imagens", "Voz"],
    correct: 1,
    explanation:
      "O Canvas permite editar uma seção específica de um documento longo em um painel lateral sem gerar todo o texto de novo. Revise cada mudança antes de aceitá-la.",
  },
  {
    question:
      "Você tem uma planilha com as notas de um curso, bagunçadas. Quer uma tabela por matéria e um gráfico. Qual ferramenta usa?",
    options: [
      "Criação de imagens",
      "Canvas",
      "Pesquisa na web",
      "Análise de arquivos e dados",
    ],
    correct: 3,
    explanation:
      "A análise de arquivos lê sua planilha, organiza e faz o gráfico. Confira o resultado refazendo uma linha à mão.",
  },
  {
    question:
      "Um estudante menciona uma mudança de preço de uma hora atrás e você quer uma análise das causas imediatas. O que ativa?",
    options: [
      "Canvas",
      "Voz",
      "Pesquisa na web, e abro as fontes",
      "Criação de imagens",
    ],
    correct: 2,
    explanation:
      "Para fatos recentes você precisa da pesquisa na web. Uma resposta sem fontes é só uma hipótese: abra pelo menos uma antes de usá-la.",
  },
  {
    question:
      "Você quer um pôster para a feira de ciências com um parágrafo longo de regras e os logotipos exatos dos patrocinadores, tudo dentro da imagem. O que vai acontecer?",
    options: [
      "O pôster ficará perfeito e pronto para imprimir.",
      "A análise de arquivos bloqueará o pedido por privacidade.",
      "A imagem terá erros no texto longo e logotipos inexatos.",
      "O Canvas abrirá um editor gráfico manual.",
    ],
    correct: 2,
    explanation:
      "A criação de imagens ilustra bem, mas falha com textos longos e logotipos exatos. Coloque o texto à parte e revise a imagem antes de publicar.",
  },
  {
    question:
      "Você quer praticar inglês conversando e ditar ideias para um trabalho enquanto caminha. Qual ferramenta combina?",
    options: [
      "Voz",
      "Canvas",
      "Análise de arquivos e dados",
      "Criação de imagens",
    ],
    correct: 0,
    explanation:
      "A voz serve para conversar e ditar. Confirme a transcrição antes de usar algo importante, sobretudo nomes e números.",
  },
  {
    question:
      "Você tem uma pesquisa em uma planilha e precisa de um gráfico e de contexto sobre como se fazem essas pesquisas. Qual combinação é melhor?",
    options: [
      "Só o Canvas para editar a planilha.",
      "Análise de arquivos para a tabela e o gráfico, e pesquisa na web para o contexto, conferindo uma linha à mão e as fontes.",
      "Criação de imagens para desenhar os resultados.",
      "Só voz para ditar os dados.",
    ],
    correct: 1,
    explanation:
      "Combinar ferramentas funciona se você conferir cada passo: refaça uma linha da análise e abra as fontes da pesquisa.",
  },
  {
    question:
      "Você tem um PDF de 80 páginas e precisa das ideias principais com a localização. Como faz?",
    options: [
      "Colo o PDF e aceito o resumo porque soa seguro.",
      "Envio o arquivo, peço o resumo com a página de cada ideia e abro duas páginas para conferir.",
      "Peço que invente as páginas.",
      "Resumo só com a pesquisa na web.",
    ],
    correct: 1,
    explanation:
      "Em arquivos longos peça a página de cada dado e abra algumas para conferir se dizem o que o resumo afirma.",
  },
];

export const learningObjectives = [
  "Identificar as ferramentas do ChatGPT: pesquisa, arquivos, imagens, Canvas e voz",
  "Escolher a ferramenta certa para a tarefa",
  "Reconhecer os limites de cada ferramenta",
  "Conferir o que cada ferramenta entrega antes de usar",
];

export const furtherReading = [
  {
    title: "Central de Ajuda da OpenAI",
    url: "https://help.openai.com/",
    description:
      "Documentação oficial: funções e disponibilidade conforme a sua conta.",
  },
  {
    title: "ChatGPT para educação",
    url: "https://openai.com/education/",
    description: "Informações oficiais sobre o uso do ChatGPT na educação.",
  },
];
