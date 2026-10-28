export const PT_PART1 = {
  "intro-video-1": [
    {
      q: "O que caracteriza a IA generativa?",
      options: [
        "Cria texto, imagem ou áudio novos",
        "Apenas classifica dados em categorias fixas",
        "Substitui toda decisão humana",
      ],
      correct: 0,
      feedback: "A IA generativa produz conteúdo novo; não apenas classifica.",
    },
    {
      q: "Se um prompt é vago e genérico, o que costuma faltar?",
      options: [
        "Mais velocidade do servidor",
        "Dar contexto específico",
        "Mudar de idioma",
      ],
      correct: 1,
      feedback: "Contexto e especificidade evitam respostas genéricas.",
    },
    {
      q: "Qual é o papel do estudante diante da IA?",
      options: [
        "Aceitar sempre a primeira resposta",
        "Delegar totalmente as decisões",
        "Revisar e validar antes de usar",
      ],
      correct: 2,
      feedback: "A revisão e a decisão final são suas.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Qual fórmula estrutura um prompt claro?",
      options: [
        "RTF: Papel + Tarefa + Formato",
        "HTML",
        "SQL, linguagem para bancos de dados",
      ],
      correct: 0,
      feedback: "RTF (Papel, Tarefa, Formato) organiza a instrução.",
    },
    {
      q: "Por que iterar o prompt?",
      options: [
        "Porque é preciso acertar de primeira",
        "Porque cada ajuste aproxima da meta",
        "Porque a IA se cansa",
      ],
      correct: 1,
      feedback: "Iterar faz parte do processo.",
    },
    {
      q: "O que define melhor a 'clareza' de um prompt?",
      options: [
        "Usar o máximo de palavras",
        "Mais precisão no pedido",
        "Escrever em maiúsculas",
      ],
      correct: 1,
      feedback: "Clareza = menos ambiguidade, mais precisão.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "O que é o ChatGPT?",
      options: ["Um buscador de links", "Um redator digital", "Uma planilha"],
      correct: 1,
      feedback: "ChatGPT é um assistente conversacional.",
    },
    {
      q: "O que ajuda a obter melhores respostas?",
      options: [
        "Dar papel, contexto e objetivo",
        "Escrever uma única palavra",
        "Repetir o mesmo prompt sem mudança",
      ],
      correct: 0,
      feedback: "Papel, contexto e objetivo orientam a resposta.",
    },
    {
      q: "Boa prática de segurança com ChatGPT?",
      options: [
        "Compartilhar dados confidenciais sem revisar",
        "Não enviar dados sensíveis sem necessidade",
        "Confiar sem verificar dados críticos",
      ],
      correct: 1,
      feedback: "Evite expor dados sensíveis e verifique o crítico.",
    },
  ],
  "gemini-video-1": [
    {
      q: "O que significa o Gemini ser multimodal?",
      options: [
        "Que só lê texto e faz isso rápido",
        "Que lê texto, imagens, áudio e vídeo ao mesmo tempo",
        "Que só funciona com documentos do Google",
      ],
      correct: 1,
      feedback:
        "Multimodal quer dizer que ele processa vários tipos de material na mesma conversa.",
    },
    {
      q: "O que você pede ao Gemini para conferir um dado de uma imagem?",
      options: [
        "Que confirme que tem razão",
        "O lugar exato onde o dado aparece",
        "Que deixe a imagem mais bonita",
      ],
      correct: 1,
      feedback:
        "Pedir o lugar do dado permite abri-lo e conferi-lo na evidência.",
    },
    {
      q: "O Gemini dá uma resposta muito segura sobre uma imagem borrada. O que você faz?",
      options: [
        "Aceito, porque parece segura",
        "Peço que diga o que não se consegue ler",
        "Compartilho na hora",
      ],
      correct: 1,
      feedback:
        "Uma resposta segura sobre algo borrado é um sinal de alerta: peça o que não pode ser confirmado.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "Qual é a principal vantagem do Deep Research?",
      options: [
        "Responde com dados de treinamento",
        "Analisa centenas de fontes",
        "Evita ler documentos",
      ],
      correct: 1,
      feedback: "Rastreia e cita fontes: ideal para relatórios verificáveis.",
    },
    {
      q: "Diante de duas respostas distintas, o que é mais crítico?",
      options: [
        "Escolher a mais longa",
        "Contrastar com a fonte",
        "Ficar só com a primeira",
      ],
      correct: 1,
      feedback: "Contrastar com evidência dá rigor à decisão.",
    },
    {
      q: "O que melhora um relatório de pesquisa?",
      options: [
        "Delimitar e citar fontes",
        "Evitar fontes",
        "Copiar e colar sem revisar",
      ],
      correct: 0,
      feedback: "Pergunta delimitada + citações = relatório rigoroso.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "Em que o Gemini Notebook baseia suas respostas?",
      options: ["Em toda a internet", "Nas suas fontes", "No acaso"],
      correct: 1,
      feedback: "Responde estritamente sobre os documentos que você envia.",
    },
    {
      q: "O que há de especial nas respostas?",
      options: ["Cita seus textos", "Ignora seus arquivos", "Gera imagens"],
      correct: 0,
      feedback: "Cita suas fontes, facilitando verificar cada dado.",
    },
    {
      q: "Se não encontra um dado, o que significa?",
      options: [
        "Que o dado não aparece no texto",
        "Que a ferramenta está quebrada",
        "Que deve pedir para inventar algo",
      ],
      correct: 0,
      feedback:
        "O Gemini Notebook não inventa: se não está nas fontes, não responde.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "O que é um Audio Overview no Gemini Notebook?",
      options: [
        "Um resumo em áudio",
        "Um documento PDF",
        "Uma tabela de dados",
      ],
      correct: 0,
      feedback:
        "Transforma suas fontes em um resumo conversacional para ouvir.",
    },
    {
      q: "Quando o áudio é mais útil?",
      options: [
        "Para ouvir no trajeto",
        "Para editar imagens",
        "Para instalar software",
      ],
      correct: 0,
      feedback: "Ideal para revisão passiva em trânsito.",
    },
    {
      q: "O que fazer antes de gerar o áudio?",
      options: [
        "Curar fontes relevantes",
        "Não carregar nada",
        "Enviar arquivos aleatórios",
      ],
      correct: 0,
      feedback: "A qualidade do áudio depende da curadoria das fontes.",
    },
  ],
  "privacy-video-1": [
    {
      q: "Qual dado NÃO se deve compartilhar com uma IA pública?",
      options: [
        "Dados pessoais sensíveis",
        "Uma pergunta geral e aberta",
        "Um texto público",
      ],
      correct: 0,
      feedback: "Evite expor dados pessoais ou confidenciais.",
    },
    {
      q: "O que significa minimização de dados?",
      options: [
        "Coletar só o necessário",
        "Coletar o máximo possível",
        "Guardar sem limites",
      ],
      correct: 0,
      feedback: "Minimizar = usar apenas os dados estritamente necessários.",
    },
    {
      q: "Quem é responsável por proteger os dados do estudante?",
      options: [
        "Ninguém, nunca",
        "A instituição e o usuário com boas práticas",
        "Só a IA, sem nenhum controle humano ou revisão possível",
      ],
      correct: 1,
      feedback: "A proteção é corresponsabilidade.",
    },
  ],
  "ethics-video-1": [
    {
      q: "O que implica o princípio de transparência?",
      options: [
        "Ocultar que se usa IA",
        "Avisar quando se usa IA",
        "Esconder as decisões da IA",
      ],
      correct: 1,
      feedback: "Transparência é informar claramente o uso de IA.",
    },
    {
      q: "O que significa 'accountability' (responsabilidade)?",
      options: [
        "Que a IA é a única responsável",
        "Que há pessoas que respondem",
        "Que ninguém responde",
      ],
      correct: 1,
      feedback: "Deve haver responsáveis humanos e processos claros.",
    },
    {
      q: "O que busca a explicabilidade?",
      options: [
        "Que sejam justificáveis",
        "Que o sistema nunca falhe",
        "Que seja mais rápido",
      ],
      correct: 0,
      feedback: "Explicabilidade = entender e justificar as decisões.",
    },
  ],
  "claude-video-intro-1": [
    {
      q: "O que é o Claude no dia a dia?",
      options: [
        "Um buscador que só devolve links",
        "Um assistente que escreve e analisa",
        "Um programa que substitui a revisão humana",
      ],
      correct: 1,
      feedback:
        "O Claude cria e analisa a partir das suas instruções; a revisão continua sendo sua.",
    },
    {
      q: "O que mais melhora o resultado de um pedido?",
      options: [
        "Escrever tudo em maiúsculas",
        "Dar contexto e objetivo",
        "Pedir mais rápido",
      ],
      correct: 1,
      feedback:
        "Sem contexto ele precisa adivinhar. Com objetivo, público e formato acerta mais.",
    },
    {
      q: "Quando convém revisar com mais cuidado o que o Claude entrega?",
      options: [
        "Quando é um rascunho de estilo",
        "Quando traz números ou nomes",
        "Nunca precisa revisar",
      ],
      correct: 1,
      feedback:
        "Números, nomes e decisões devem ser sempre conferidos na fonte.",
    },
  ],
  "claude-artifacts-video-1": [
    {
      q: "O que é um Artifact?",
      options: [
        "Uma peça ao lado do chat, para editar",
        "Um arquivo que é apagado ao fechar o chat",
        "Uma senha para compartilhar chats",
      ],
      correct: 0,
      feedback:
        "Um Artifact fica ao lado do chat: você vê, edita e compartilha.",
    },
    {
      q: "Qual é o melhor pedido para um guia de professores?",
      options: [
        "Faça algo para professores.",
        "Guia de 2 páginas para docentes",
        "Faça bonito, longo e bem completo.",
      ],
      correct: 1,
      feedback: "Um pedido completo diz formato, público, tom e limites.",
    },
    {
      q: "O Claude te dá um número. O que você faz antes de compartilhar?",
      options: [
        "Compartilho como está, o Claude calculou",
        "Confiro o dado na fonte original",
        "Mudo para que pareça melhor",
      ],
      correct: 1,
      feedback:
        "Números devem ser conferidos em uma fonte antes de compartilhar.",
    },
  ],
};
