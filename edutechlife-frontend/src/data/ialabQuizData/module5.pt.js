export const MODULE_5_PT = [
  {
    id: "m5q1",
    question:
      'Um sistema de contratação baseado em IA foi treinado com dados históricos de uma empresa de tecnologia em que 78% dos funcionários eram homens. O sistema aprendeu a priorizar currículos com palavras como "engenheiro" e "líder técnico", e penalizava termos como "voluntariado" ou "licença parental". Candidatas mulheres com qualificações equivalentes recebiam pontuações mais baixas. Que tipo de viés está presente e em que etapa do pipeline de IA ele se originou?',
    options: [
      {
        id: "m5q1_a",
        label:
          "Viés de amostragem — os dados de treinamento não representavam a população de forma equitativa, originado na coleta de dados",
      },
      {
        id: "m5q1_b",
        label:
          "Viés de automação — o sistema decidiu por conta própria sem supervisão humana",
      },
      {
        id: "m5q1_c",
        label:
          "Viés de confirmação — os recrutadores buscavam confirmar suas próprias crenças",
      },
      {
        id: "m5q1_d",
        label:
          "Viés de rotulagem — os rótulos foram colocados incorretamente por anotadores externos",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Vieses em IA",
    difficulty: "médio",
    feedback:
      'Este é um caso clássico de viés de amostragem (sampling bias). Os dados históricos de uma empresa com 78% de homens não representam a população geral de candidatos. O viés se originou na coleta de dados, antes do treinamento. Revise o OVA "Laboratório: Detecte o Viés" e o PDF "Guia de Detecção de Vieses".',
  },
  {
    id: "m5q2",
    question:
      'Você usa o ChatGPT para pesquisar um tratamento contra a ansiedade. A IA responde: "Segundo um estudo de Harvard de 2023, 89% dos pacientes reduziram os sintomas com esta terapia". Você tenta encontrar o estudo e não encontra nada. Os números e a fonte parecem inventados. Qual é a ação mais responsável?',
    options: [
      {
        id: "m5q2_a",
        label:
          "Não usar essa informação até verificá-la com fontes confiáveis, relatar o possível erro e documentar que a IA alucinou",
      },
      {
        id: "m5q2_b",
        label:
          "Usar a informação mesmo assim, porque a IA raramente erra dados concretos",
      },
      {
        id: "m5q2_c",
        label:
          "Pedir à própria IA que busque a fonte novamente e confiar no que ela responder",
      },
      {
        id: "m5q2_d",
        label:
          "Ignorar o incidente porque as alucinações são raras e não têm impacto",
      },
    ],
    correctAnswer: "m5q2_a",
    topic: "Alucinações",
    difficulty: "médio",
    feedback:
      'As alucinações são informações falsas com aparência de verdade. São especialmente perigosas em contextos de saúde, onde podem ter consequências graves. Sempre verifique as fontes de informações críticas. Revise o laboratório "Detecte o Viés".',
  },
  {
    id: "m5q3",
    question:
      "Você está usando IA para um diagnóstico médico e o resultado contradiz seu julgamento profissional. Como você age eticamente?",
    options: [
      {
        id: "m5q3_a",
        label: "Aceita a IA sem questionar, porque ela é mais inteligente",
      },
      {
        id: "m5q3_b",
        label:
          "Questiona o possível viés de automação, verifica com outros especialistas e usa seu julgamento profissional",
      },
      { id: "m5q3_c", label: "Deixa a IA decidir o tratamento" },
      { id: "m5q3_d", label: "Desliga o computador e recomeça do zero" },
    ],
    correctAnswer: "m5q3_b",
    topic: "Responsabilidade",
    difficulty: "médio",
    feedback:
      'O viés de automação nos faz confiar cegamente na IA. Seu julgamento profissional é insubstituível. Revise o tópico "Ética em IA: O Essencial".',
  },
  {
    id: "m5q4",
    question:
      "Qual das alternativas NÃO é uma boa prática de privacidade ao usar IA?",
    options: [
      {
        id: "m5q4_a",
        label:
          "Subir dados pessoais de clientes para um chatbot público para que ele os analise",
      },
      {
        id: "m5q4_b",
        label:
          "Ler as políticas de privacidade antes de usar uma ferramenta de IA",
      },
      {
        id: "m5q4_c",
        label: "Não compartilhar informações confidenciais em conversas com IA",
      },
      {
        id: "m5q4_d",
        label: "Usar versões empresariais que oferecem proteção de dados",
      },
    ],
    correctAnswer: "m5q4_a",
    topic: "Privacidade",
    difficulty: "médio",
    feedback:
      'Nunca suba dados sensíveis em ferramentas públicas. Revise o PDF "Manual de Privacidade em IA" e o vídeo do módulo.',
  },
  {
    id: "m5q5",
    question:
      'Um banco implementa um sistema de IA para aprovar ou rejeitar solicitações de crédito. Um cliente é rejeitado e pede para saber o motivo. O banco responde: "É uma decisão da IA, não podemos explicar como ela funciona internamente". Qual princípio ético é violado e o que o banco deveria fazer?',
    options: [
      {
        id: "m5q5_a",
        label:
          "Transparência e explicabilidade — o banco deveria auditar o modelo e fornecer explicações compreensíveis ao cliente",
      },
      {
        id: "m5q5_b",
        label:
          "Privacidade — o banco deveria ocultar o uso de IA para proteger o cliente",
      },
      {
        id: "m5q5_c",
        label:
          "Velocidade — o banco deveria processar as solicitações mais rápido",
      },
      {
        id: "m5q5_d",
        label: "Eficiência — o banco deveria substituir os analistas humanos",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Transparência",
    difficulty: "médio",
    feedback:
      'A transparência é um pilar ético fundamental. Os cidadãos têm direito a entender decisões automatizadas que os afetam. O AI Act da UE exige explicabilidade em decisões de alto risco, como créditos. Revise o vídeo "IA Ética: Princípios e Prática" e o PDF "Código de Ética para Uso de IA".',
  },
  {
    id: "m5q6",
    question:
      "Você é designer de UX em uma agência digital. Seu chefe pede que você use IA para gerar 50 avaliações falsas positivas de um produto que ainda não foi lançado, para melhorar sua reputação inicial nas redes. Qual é a postura mais ética?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Recusar-se a gerar avaliações falsas, explicar que isso viola princípios éticos de transparência e propor alternativas legítimas de divulgação",
      },
      {
        id: "m5q6_b",
        label:
          "Gerar as avaliações porque seu chefe pediu e faz parte do seu trabalho",
      },
      {
        id: "m5q6_c",
        label:
          "Gerar as avaliações, mas modificar alguns detalhes para que pareçam menos falsas",
      },
      {
        id: "m5q6_d",
        label: "Pedir demissão imediatamente, sem dar explicações",
      },
    ],
    correctAnswer: "m5q6_a",
    topic: "Uso Responsável",
    difficulty: "médio",
    feedback:
      'Gerar avaliações falsas viola princípios éticos de transparência e honestidade, e pode ter consequências legais (publicidade enganosa). O melhor caminho é propor alternativas éticas. Revise o OVA "Laboratório: Dilemas Éticos" e o decálogo do usuário ético.',
  },
  {
    id: "m5q7",
    question:
      "Um motorista com piloto automático vem distraído, olhando para o celular. O sistema detecta um obstáculo e freia a tempo. O motorista confia que isso sempre vai funcionar. Semanas depois, com pouca luz, o sistema não detecta um objeto pequeno e ocorre um acidente. Que viés descreve essa situação e como preveni-lo?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Viés de automação — o motorista delegou sua atenção sem supervisão crítica. Previne-se com treinamento sobre os limites do sistema e supervisão ativa",
      },
      {
        id: "m5q7_b",
        label:
          "Viés de amostragem — os dados de treinamento não incluíam objetos pequenos com pouca luz",
      },
      {
        id: "m5q7_c",
        label:
          "Viés algorítmico — o sistema discriminava certos tipos de objetos",
      },
      {
        id: "m5q7_d",
        label:
          "Erro humano normal — acidentes acontecem, não há viés envolvido",
      },
    ],
    correctAnswer: "m5q7_a",
    topic: "Viés de Automação",
    difficulty: "difícil",
    feedback:
      'O viés de automação é a tendência humana de confiar excessivamente em sistemas automatizados, abandonando o pensamento crítico. O motorista assumiu que o sistema era infalível. Revise o OVA "Laboratório: Detecte o Viés" e o tópico "Vieses Algorítmicos e Equidade".',
  },
  {
    id: "m5q8",
    question:
      "Você quer usar IA para um projeto, mas está preocupado com a privacidade dos dados. Segundo o módulo, qual é a estratégia mais responsável?",
    options: [
      { id: "m5q8_a", label: "Nunca usar IA para nada relacionado a dados" },
      {
        id: "m5q8_b",
        label:
          "Usar ferramentas com proteção empresarial de dados, anonimizar informações sensíveis e nunca compartilhar dados pessoais em chats públicos",
      },
      {
        id: "m5q8_c",
        label:
          "Compartilhar os dados nas redes sociais para a comunidade ajudar",
      },
      {
        id: "m5q8_d",
        label: "Confiar que a IA protege automaticamente todos os dados",
      },
    ],
    correctAnswer: "m5q8_b",
    topic: "Proteção de Dados",
    difficulty: "difícil",
    feedback:
      'A proteção de dados é sua responsabilidade. Use ferramentas seguras, anonimize e nunca compartilhe informações sensíveis. Revise "Proteja seus Dados na Era da IA".',
  },
  {
    id: "m5q9",
    question:
      'A União Europeia classifica os sistemas de IA por nível de risco (mínimo, limitado, alto, inaceitável). Um sistema que determina o acesso a serviços financeiros essenciais (como a aprovação de uma hipoteca) entraria na categoria de "alto risco". Que obrigação essa classificação impõe?',
    options: [
      {
        id: "m5q9_a",
        label:
          "Avaliações de conformidade, documentação técnica, transparência e supervisão humana obrigatória",
      },
      {
        id: "m5q9_b",
        label: "Proibição total do uso de IA em serviços financeiros",
      },
      {
        id: "m5q9_c",
        label: "Registro voluntário, sem obrigações específicas",
      },
      {
        id: "m5q9_d",
        label: "Apenas pagar uma taxa anual pelo uso do sistema",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Marco Regulatório",
    difficulty: "difícil",
    feedback:
      'O AI Act europeu é o primeiro marco regulatório abrangente de IA. Os sistemas de alto risco exigem avaliações de conformidade, documentação, transparência e supervisão humana. É importante conhecer o marco regulatório ao desenvolver soluções de IA. Revise o tópico "Marco Legal e Regulatório da IA".',
  },
  {
    id: "m5q10",
    question:
      "Uma equipe de cientistas de dados treina um modelo para prever sucesso acadêmico. Eles descobrem que o modelo atribui pontuações mais baixas a estudantes de certas regiões geográficas, mesmo controlando notas e recursos. Qual métrica de equidade eles deveriam priorizar para diagnosticar o problema?",
    options: [
      {
        id: "m5q10_a",
        label:
          "Paridade demográfica — verificar se a taxa de previsão positiva é semelhante entre os grupos geográficos",
      },
      {
        id: "m5q10_b",
        label: "Precisão geral do modelo, sem desmembrar por grupos",
      },
      { id: "m5q10_c", label: "Velocidade de treinamento do modelo" },
      { id: "m5q10_d", label: "Quantidade total de dados de treinamento" },
    ],
    correctAnswer: "m5q10_a",
    topic: "Equidade Algorítmica",
    difficulty: "difícil",
    feedback:
      'A paridade demográfica (demographic parity) mede se as previsões do modelo são equitativas entre grupos. Se o modelo prevê sucesso com menor frequência para certas regiões, há um viés que deve ser investigado e corrigido. Revise o OVA "Laboratório: Detecte o Viés".',
  },
  {
    id: "m5q11",
    question:
      "Você está desenvolvendo um aplicativo educacional com IA que coleta dados de desempenho dos estudantes. Seguindo o princípio da minimização de dados, qual é a prática correta?",
    options: [
      {
        id: "m5q11_a",
        label:
          "Coletar apenas os dados estritamente necessários para a funcionalidade educacional, com consentimento informado e uma política de exclusão clara",
      },
      {
        id: "m5q11_b",
        label:
          'Coletar todos os dados possíveis, "por via das dúvidas", caso sejam necessários depois',
      },
      {
        id: "m5q11_c",
        label:
          "Compartilhar os dados automaticamente com terceiros, sem notificar os usuários",
      },
      {
        id: "m5q11_d",
        label: "Armazenar os dados indefinidamente, sem plano de exclusão",
      },
    ],
    correctAnswer: "m5q11_a",
    topic: "Privacidade por Design",
    difficulty: "médio",
    feedback:
      'A minimização de dados é um princípio fundamental de privacidade: colete apenas o necessário, com consentimento, e tenha um plano claro de exclusão. Revise o tópico "Proteja seus Dados na Era da IA" e o PDF "Manual de Privacidade em IA".',
  },
  {
    id: "m5q12",
    question:
      "Uma equipe de IA documenta seu modelo com uma model card (cartão do modelo). Segundo as melhores práticas, qual informação DEVE ser incluída?",
    options: [
      {
        id: "m5q12_a",
        label:
          "Propósito do modelo, dados de treinamento, métricas de desempenho por subgrupos, limitações conhecidas e considerações éticas",
      },
      { id: "m5q12_b", label: "Apenas o nome do modelo e a versão" },
      {
        id: "m5q12_c",
        label: "Os nomes completos dos desenvolvedores e seus salários",
      },
      { id: "m5q12_d", label: "O código-fonte completo do modelo" },
    ],
    correctAnswer: "m5q12_a",
    topic: "Documentação Ética",
    difficulty: "médio",
    feedback:
      "As model cards são um padrão de transparência em IA. Incluem propósito, dados, métricas por subgrupo, limitações e considerações éticas. Permitem que os usuários entendam as capacidades e limitações do modelo antes de usá-lo. Revise o tópico de transparência em IA nos recursos do módulo.",
  },
];
