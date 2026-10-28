// Escenarios de la Guía de selección de modelos.
export const SCENARIOS_PT = [
  {
    id: "customer-service",
    title: "Suporte ao Cliente 24/7 em Tempo Real",
    context:
      "Sua empresa recebe 1000+ perguntas diárias. Precisa responder em menos de 2 segundos, o custo por resposta é crítico, e alguns clientes exigem que dados não sejam compartilhados com terceiros.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "CRÍTICA", reason: "<2s por resposta" },
      { name: "Custo", importance: "ALTA", reason: "1000+ consultas/dia" },
      {
        name: "Privacidade",
        importance: "MÉDIA",
        reason: "Alguns clientes exigem",
      },
      {
        name: "Capacidades",
        importance: "MÉDIA",
        reason: "Perguntas rotineiras",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según plan",
        latency: "~800ms",
        privacy: "Nuvem",
        note: "Caro mas confiável",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Nuvem",
        note: "Mais barato, latência melhor",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~5s",
        privacy: "Nuvem",
        note: "Lento, inadequado",
      },
      {
        model: "Llama 3.1 (auto-hospedado)",
        cost: "Según proveedor",
        latency: "~300ms",
        privacy: "On-premises",
        note: "Privacidade total, complexo",
      },
    ],
    expert: [
      "Latência é o primeiro critério: Gemini Notebook está descartado (5s mínimo).",
      "Entre ChatGPT, Gemini e Llama auto-hospedado: Gemini vence em latência (600ms) e custo (costo bajo). ChatGPT é mais confiável mas caro.",
      "Se privacidade é exigência legal: Llama auto-hospedado na sua infraestrutura, embora exija gerenciar GPUs.",
      "Recomendação: Gemini como padrão (equilíbrio custo-latência), com caminho para Llama auto-hospedado se regulação exigir.",
    ],
  },
  {
    id: "research-analysis",
    title: "Análise Profunda de Documentos para Pesquisa",
    context:
      "Você analisa 500+ artigos acadêmicos por mês. Precisa extração precisa de dados, análise comparativa, e pode processar documentos de 50+ páginas. Orçamento é flexível.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "BAIXA", reason: "Pode levar minutos" },
      {
        name: "Custo",
        importance: "MÉDIA",
        reason: "500+ docs, mas orçamento existe",
      },
      {
        name: "Privacidade",
        importance: "BAIXA",
        reason: "Documentos públicos ou internos sensíveis?",
      },
      {
        name: "Capacidades",
        importance: "CRÍTICA",
        reason: "Análise profunda, extração precisa",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según plan",
        latency: "2-5s",
        privacy: "Nuvem",
        note: "Melhor raciocínio, preciso",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "1-2s",
        privacy: "Nuvem",
        note: "Rápido, mas menos profundo",
      },
      {
        model: "Gemini Notebook",
        cost: "Según plan",
        latency: "~2min/doc",
        privacy: "Nuvem",
        note: "Feito para isso: análise + áudio",
      },
      {
        model: "Claude (via API)",
        cost: "Según plan",
        latency: "2-4s",
        privacy: "Nuvem",
        note: "Bom em análise longa",
      },
    ],
    expert: [
      "Gemini Notebook é projetado exatamente para isto: toma documento longo e gera automaticamente resumo + áudio + insights.",
      "Se precisa extração de dados estruturados: Claude ou ChatGPT são opções sólidas (sempre verifique). Se só resumo: Gemini Notebook é a opção clara.",
      "Custo: depende do plano e do volume; compare os preços vigentes antes de decidir.",
      "Recomendação: Gemini Notebook como fluxo principal (resumo + áudio para pesquisadores), com opção manual a Claude se precisar dados estruturados.",
    ],
  },
  {
    id: "personalized-learning",
    title: "Sistema de Tutoria Personalizada em Tempo Real",
    context:
      "Professor usa IA para dar feedback personalizado a 30 alunos. Cada sessão dura 15 min, o modelo deve lembrar contexto do aluno (erros prévios, ritmo), e dados não podem sair do seu servidor.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      {
        name: "Latência",
        importance: "ALTA",
        reason: "Sessão ao vivo, feedback imediato",
      },
      {
        name: "Custo",
        importance: "MÉDIA",
        reason: "30 alunos × 15 min/semana",
      },
      {
        name: "Privacidade",
        importance: "CRÍTICA",
        reason: "Dados sensíveis de menores",
      },
      {
        name: "Capacidades",
        importance: "ALTA",
        reason: "Personalização e continuidade",
      },
    ],
    options: [
      {
        model: "ChatGPT (API)",
        cost: "Según uso",
        latency: "~800ms",
        privacy: "Nuvem",
        note: "Falha privacidade (dados para OpenAI)",
      },
      {
        model: "Gemini Advanced",
        cost: "Según plan",
        latency: "~600ms",
        privacy: "Nuvem",
        note: "Mesma restrição privacidade",
      },
      {
        model: "Llama 2/3.1 (auto-hospedado)",
        cost: "Según proveedor",
        latency: "~300-500ms",
        privacy: "On-premises",
        note: "Atende privacidade, latência boa",
      },
      {
        model: "Mistral 7B (auto-hospedado)",
        cost: "Según proveedor",
        latency: "~200-300ms",
        privacy: "On-premises",
        note: "Mais rápido, menos contexto",
      },
    ],
    expert: [
      "Privacidade é inegociável: qualquer nuvem (ChatGPT, Gemini, Gemini Notebook) viola regulações de proteção de menores na maioria dos países.",
      "Opção obrigatória: auto-hospedado (Llama ou Mistral) na sua infraestrutura própria.",
      "Entre Llama e Mistral: Llama melhor para tarefas complexas (mais contexto), Mistral mais rápido e usa menos GPU (melhor custo).",
      "Recomendação: Mistral 7B auto-hospedado (equilíbrio custo-latência-privacidade), avaliar Llama 13B se precisar melhor compreensão de contexto.",
    ],
  },
  {
    id: "bulk-content",
    title: "Geração de Conteúdo em Lotes: 1000+ textos/mês",
    context:
      "Você gera descrições de produtos, emails, posts de redes sociais. Volume alto, qualidade média-alta, mudanças frequentes em tom/estilo. Custo é muito importante.",
    decision: "Qual modelo você escolheria e por quê?",
    criteria: [
      { name: "Latência", importance: "BAIXA", reason: "Lote, não tempo real" },
      {
        name: "Custo",
        importance: "CRÍTICA",
        reason: "1000+ textos/mês, orçamento limitado",
      },
      {
        name: "Privacidade",
        importance: "BAIXA",
        reason: "Conteúdo público, não sensível",
      },
      {
        name: "Capacidades",
        importance: "MÉDIA",
        reason: "Geração de texto, versatilidade",
      },
    ],
    options: [
      {
        model: "ChatGPT",
        cost: "Según uso",
        latency: "Lote OK",
        privacy: "Nuvem",
        note: "Melhor qualidade, caro",
      },
      {
        model: "Gemini",
        cost: "Según plan",
        latency: "Lote OK",
        privacy: "Nuvem",
        note: "Mais barato, boa qualidade",
      },
      {
        model: "Llama 3.1 70B (auto-hospedado)",
        cost: "Según proveedor",
        latency: "Lote OK",
        privacy: "On-premises",
        note: "Caro compute, não rentável",
      },
      {
        model: "Open-source local (Mistral/Zephyr)",
        cost: "Según proveedor",
        latency: "Lote OK",
        privacy: "On-premises",
        note: "Muito barato, qualidade média",
      },
    ],
    expert: [
      "Volume alto + custo crítico → Gemini vence (0.075/1M vs 0.50/1M é 6-7x mais barato).",
      "Auto-hospedado para lotes não é rentável: custo GPU rental por horas supera rápido API nuvem.",
      "Qualidade: Gemini é suficiente para descrição de produtos/emails. Melhor qualidade de ChatGPT só vale se margem do produto permite.",
      "Recomendação: Gemini API com processamento em lotes (ainda mais barato), teste A/B ChatGPT só em casos alta conversão.",
    ],
  },
];
