export const CONTENT_PT_PART4 = {
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
        "O Alquimista Digital: Gemini Notebook — Onde seus Documentos se Transformam em Conhecimento",
      description:
        "Neste módulo, você se tornará um alquimista digital: seus PDFs, artigos e anotações têm um potencial oculto que você nem imagina. Aprenda a extraí-lo, transformá-lo e compartilhá-lo em formatos que cativam, educam e transformam.",
      mission:
        "Torne-se um alquimista digital: seus PDFs, artigos e anotações têm um potencial oculto que você nem imagina. Aprenda a extraí-lo, transformá-lo e compartilhá-lo de formas que cativam, educam e transformam.",
      topics: [
        {
          title:
            "O Alquimista de Documentos: Seu Primeiro Feitiço com o Gemini Notebook",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
          outcome:
            "Criar seu primeiro caderno com seus documentos e fazer perguntas que ele responde com citações.",
        },
        {
          title: "A Arte da Curadoria: Como Escolher e Sintetizar Fontes",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
          outcome:
            "Escolher boas fontes e transformá-las em um resumo ou guia de estudo que você possa verificar.",
        },
        {
          title: "A Fórmula Secreta: Audio Overviews e Gestão Documental",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
          outcome:
            "Gerar um resumo em áudio dos seus documentos e organizar seus cadernos para encontrar tudo.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title:
          "O Alquimista de Documentos: Seu Primeiro Feitiço com o Gemini Notebook",
        description: "Onde os PDFs ganham vida",
        detailedDescription:
          "Conheça o Gemini Notebook, a ferramenta do Google que transforma seus PDFs, artigos e anotações em um assistente pessoal que responde com citações que você pode verificar. Reduz o risco de erro, mas não o elimina: cada afirmação é conferida com a sua citação. Se você perguntar algo que não está nas suas fontes, acrescente uma fonte confiável; para ideias gerais sem documentos, um chat geral funciona melhor. É o seu bibliotecário com superpoderes.",
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
          "Aprenda a selecionar as melhores fontes como um joalheiro escolhe gemas, organizá-las por temas e conectar ideias entre documentos para criar resumos e análises de nível profissional. Uma fonte confiável tem autor identificável, data e referências que você pode conferir. Inclua fontes com posições diferentes, para que sua síntese não mostre um só olhar.",
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
          "Transforme seus documentos em conversas de podcast com duas vozes de IA. Uma experiência sonora que parece rádio profissional. Ideal para aprender enquanto você se movimenta. Gerencie sua biblioteca digital com inteligência sobre-humana: um caderno por projeto, com um nome claro, para encontrar tudo. Antes de compartilhar um caderno, retire dados pessoais ou sensíveis (anonimize listas de pessoas) e decida quem pode vê-lo e quem pode editá-lo.",
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
          "O Gemini Notebook responde com base nas suas fontes e mostra de onde sai cada resposta. A IA que transforma a gestão do conhecimento.",
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
            text: "Distinguir um bibliotecário especialista (Gemini Notebook) de um chatbot genérico",
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
          "Converta seus documentos em conversas de áudio geradas por IA, como um programa feito sob medida para você. 🧪 O Mestre Alquimista: domine o fluxo completo, de seus documentos a um podcast pronto para compartilhar.",
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
    },
  },
};
