export const MODULE_3_PT = [
  {
    id: "pp-m3-1",
    question:
      "Qual característica distingue o Google Gemini de outros LLMs baseados principalmente em texto?",
    options: [
      {
        id: "pp-m3-1_a",
        label: "É o único modelo que funciona sem conexão com a internet",
      },
      {
        id: "pp-m3-1_b",
        label:
          "É nativamente multimodal: processa texto, imagens, áudio e vídeo simultaneamente",
      },
      { id: "pp-m3-1_c", label: "Só processa imagens, não texto" },
      {
        id: "pp-m3-1_d",
        label: "É treinado exclusivamente com dados do Google Scholar",
      },
    ],
    correctAnswer: "pp-m3-1_b",
    topic: "Gemini Multimodal",
    difficulty: "easy",
    feedback:
      "O Google Gemini foi projetado do zero como um modelo multimodal, capaz de raciocinar sobre texto, imagens, áudio, vídeo e código de forma integrada, e não como módulos separados.",
    relatedFlashcardId: "m3-f1",
  },
  {
    id: "pp-m3-2",
    question:
      'Um estudante pede ao Gemini: "Explique a fotossíntese". A resposta é genérica. Qual técnica de prompting ajudaria a obter uma explicação mais detalhada e passo a passo?',
    options: [
      { id: "pp-m3-2_a", label: "Aumentar a temperatura do modelo ao máximo" },
      {
        id: "pp-m3-2_b",
        label:
          'Usar chain-of-thought: "Explique a fotossíntese passo a passo, raciocinando sobre cada etapa"',
      },
      {
        id: "pp-m3-2_c",
        label: "Reduzir o context window para forçar respostas concisas",
      },
      {
        id: "pp-m3-2_d",
        label:
          "Usar um modelo diferente, já que o Gemini não consegue explicar conceitos",
      },
    ],
    correctAnswer: "pp-m3-2_b",
    topic: "Chain-of-Thought",
    difficulty: "medium",
    feedback:
      "O chain-of-thought prompting orienta o modelo a decompor o raciocínio em etapas intermediárias, melhorando a qualidade das respostas em tarefas que exigem análise sequencial.",
    relatedFlashcardId: "m3-f2",
  },
  {
    id: "pp-m3-3",
    question:
      'O que é "grounding" no contexto do Gemini e por que é importante?',
    options: [
      {
        id: "pp-m3-3_a",
        label:
          "É a capacidade do Gemini de executar código em várias linguagens de programação",
      },
      {
        id: "pp-m3-3_b",
        label:
          "É conectar as respostas da IA a fontes verificáveis para reduzir alucinações e melhorar a precisão",
      },
      {
        id: "pp-m3-3_c",
        label: "É o processo de treinar o Gemini do zero com novos dados",
      },
      {
        id: "pp-m3-3_d",
        label: "É a interface gráfica que o Gemini usa para mostrar resultados",
      },
    ],
    correctAnswer: "pp-m3-3_b",
    topic: "Grounding",
    difficulty: "medium",
    feedback:
      "Grounding (ancoragem) é a técnica de vincular as respostas do modelo a fontes externas verificáveis, permitindo que o usuário valide as informações e reduzindo significativamente as alucinações.",
    relatedFlashcardId: "m3-f4",
  },
  {
    id: "pp-m3-4",
    question:
      "Se você precisa que o Gemini classifique o sentimento de avaliações de produtos sem fornecer exemplos, qual técnica você está usando?",
    options: [
      { id: "pp-m3-4_a", label: "Few-shot prompting (com exemplos)" },
      { id: "pp-m3-4_b", label: "Zero-shot prompting (sem exemplos)" },
      { id: "pp-m3-4_c", label: "Fine-tuning supervisionado" },
      { id: "pp-m3-4_d", label: "Transfer learning não supervisionado" },
    ],
    correctAnswer: "pp-m3-4_b",
    topic: "Zero-Shot vs Few-Shot",
    difficulty: "easy",
    feedback:
      "Zero-shot prompting consiste em pedir ao modelo que realize uma tarefa sem fornecer exemplos, apenas com a instrução. Funciona bem com modelos grandes como o Gemini, que foram treinados com uma ampla variedade de tarefas.",
    relatedFlashcardId: "m3-f6",
  },
  {
    id: "pp-m3-5",
    question:
      "No Gemini, se você definir temperature=0.0 e depois temperature=1.0 para o mesmo prompt, o que você esperaria?",
    options: [
      {
        id: "pp-m3-5_a",
        label: "Não há diferença porque a temperatura só afeta modelos menores",
      },
      {
        id: "pp-m3-5_b",
        label:
          "Com 0.0 você obtém respostas determinísticas (sempre a mesma); com 1.0, respostas mais variadas e criativas",
      },
      {
        id: "pp-m3-5_c",
        label: "Com 0.0 as respostas são mais longas; com 1.0, mais curtas",
      },
      {
        id: "pp-m3-5_d",
        label:
          "A temperatura no Gemini funciona ao contrário: 0.0 é mais criativo",
      },
    ],
    correctAnswer: "pp-m3-5_b",
    topic: "Temperatura no Gemini",
    difficulty: "easy",
    feedback:
      "A temperatura controla a aleatoriedade da distribuição de probabilidade. Em 0.0, o modelo sempre escolhe o token mais provável (determinístico). Em 1.0, explora opções menos prováveis (criativo).",
    relatedFlashcardId: "m3-f7",
  },
  {
    id: "pp-m3-6",
    question:
      "O que é multimodalidade e por que ela representa um avanço significativo em modelos como o Gemini?",
    options: [
      {
        id: "pp-m3-6_a",
        label:
          "É a capacidade de rodar em múltiplos dispositivos simultaneamente",
      },
      {
        id: "pp-m3-6_b",
        label:
          "É a capacidade de processar e raciocinar sobre múltiplos tipos de dados (texto, imagens, áudio) em uma única arquitetura",
      },
      {
        id: "pp-m3-6_c",
        label:
          "É a habilidade de traduzir entre múltiplos idiomas em tempo real",
      },
      {
        id: "pp-m3-6_d",
        label:
          "É a capacidade de usar múltiplas GPUs para acelerar o treinamento",
      },
    ],
    correctAnswer: "pp-m3-6_b",
    topic: "Multimodalidade",
    difficulty: "medium",
    feedback:
      "A multimodalidade permite que o modelo compreenda e raciocine sobre diferentes formatos de dados (texto, imagens, áudio, vídeo) de forma integrada, imitando a capacidade humana de processar informações multimodais.",
    relatedFlashcardId: "m3-f5",
  },
  {
    id: "pp-m3-7",
    question:
      "Qual é a principal vantagem do few-shot prompting em relação ao zero-shot em tarefas complexas?",
    options: [
      { id: "pp-m3-7_a", label: "Few-shot exige menos tokens que zero-shot" },
      {
        id: "pp-m3-7_b",
        label:
          "Few-shot fornece exemplos que orientam o modelo sobre o padrão esperado, melhorando a precisão em tarefas especializadas",
      },
      {
        id: "pp-m3-7_c",
        label: "Few-shot só funciona com o Gemini, não com outros modelos",
      },
      {
        id: "pp-m3-7_d",
        label: "Few-shot elimina a necessidade de um system prompt",
      },
    ],
    correctAnswer: "pp-m3-7_b",
    topic: "Few-Shot Prompting",
    difficulty: "hard",
    feedback:
      "O few-shot prompting fornece exemplos de entrada-saída no prompt, o que ajuda o modelo a compreender o padrão esperado sem necessidade de fine-tuning. É especialmente útil para tarefas com formatos específicos ou domínios especializados.",
    relatedFlashcardId: "m3-f3",
  },
];
