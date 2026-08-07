export const dilemmas = [
  {
    id: 1,
    scenario:
      "Você é estudante de medicina e usa uma IA para redigir um diagnóstico. A IA sugere um tratamento que você não conhece. O que você faz?",
    opts: [
      "Copio o diagnóstico e apresento como meu, a IA nunca erra.",
      "Verifico o tratamento em fontes médicas atualizadas e consulto meu professor antes de decidir.",
      "Modifico levemente o texto para que não pareça de IA e o entrego.",
    ],
    correct: 1,
    feedback:
      "A IA é uma ferramenta de apoio, não um substituto do critério profissional. Verificar fontes é a sua responsabilidade ética.",
  },
  {
    id: 2,
    scenario:
      "Um colega pede que você use IA para gerar um ensaio acadêmico completo que ele apresentará como próprio. Como você responde?",
    opts: [
      "Ajudo, afinal, hoje todo mundo usa IA.",
      "Explico que o plágio acadêmico também se aplica a conteúdo gerado por IA e ofereço ensiná-lo a usá-la como ferramenta de apoio.",
      "Faço, mas peço que ele não conte para ninguém.",
    ],
    correct: 1,
    feedback:
      "Usar IA para gerar conteúdo apresentado como próprio é plágio. A IA deve ser uma ferramenta de aprendizado, não um atalho para enganar.",
  },
  {
    id: 3,
    scenario:
      "Uma empresa de recrutamento usa um algoritmo de IA para filtrar currículos. O sistema rejeita sistematicamente mulheres para cargos técnicos. Qual é o principal problema ético?",
    opts: [
      "Não há problema, o algoritmo apenas segue dados históricos.",
      "O algoritmo perpetua vieses históricos de gênero e deve ser auditado e corrigido para garantir equidade.",
      "O problema é que as mulheres não se candidatam a esses cargos.",
    ],
    correct: 1,
    feedback:
      "Os algoritmos podem perpetuar e amplificar vieses históricos. É responsabilidade ética auditar os sistemas de IA para garantir equidade.",
  },
  {
    id: 4,
    scenario:
      "Você está desenvolvendo um aplicativo educacional com IA para crianças. Qual consideração ética é PRIORITÁRIA?",
    opts: [
      "Que o aplicativo seja visualmente atraente e tenha muitas cores.",
      "Garantir a privacidade dos dados infantis, a transparência sobre como a IA funciona e a supervisão dos pais.",
      "Que a IA responda o mais rápido possível.",
    ],
    correct: 1,
    feedback:
      "Ao trabalhar com menores, privacidade, segurança e transparência são obrigações éticas e legais prioritárias.",
  },
  {
    id: 5,
    scenario:
      "Seu chefe pede que você implemente um chatbot de IA para atendimento ao cliente, mas diz: 'Não conte aos clientes que estão falando com uma IA'. O que você faz?",
    opts: [
      "Implemento sem dizer nada, é o que o chefe pediu.",
      "Explico que ocultar que é uma IA viola princípios de transparência e confiança, e proponho informar claramente no início da interação.",
      "Implemento, mas conto a um colega em confiança.",
    ],
    correct: 1,
    feedback:
      "A transparência é um princípio ético fundamental na IA. Os usuários têm o direito de saber se interagem com um humano ou com uma máquina.",
  },
  {
    id: 6,
    scenario:
      "Você usa IA para gerar avaliações falsas do seu produto e melhorar sua reputação online. Isso é ético?",
    opts: [
      "Sim, todas as empresas fazem isso para competir.",
      "Não, gerar avaliações falsas é enganoso, viola princípios de honestidade e pode ter consequências legais.",
      "Apenas algumas avaliações falsas não fazem mal a ninguém.",
    ],
    correct: 1,
    feedback:
      "Gerar conteúdo falso ou enganoso viola princípios éticos de transparência e honestidade, além de ser ilegal em muitos países.",
  },
];

export const accordionData = [
  {
    id: "ac1",
    title: "Princípio da Transparência",
    icon: "🔍",
    content:
      "Os usuários devem saber quando estão interagindo com uma IA. Ocultar a natureza da interação corrói a confiança e viola princípios éticos fundamentais.",
  },
  {
    id: "ac2",
    title: "Responsabilidade Humana",
    icon: "👤",
    content:
      "Deve haver sempre um humano responsável pelas decisões tomadas com o auxílio da IA. Você não pode delegar a responsabilidade moral a uma máquina.",
  },
  {
    id: "ac3",
    title: "Equidade e Não Discriminação",
    icon: "⚖️",
    content:
      "Os sistemas de IA devem ser auditados regularmente para detectar e corrigir vieses que possam discriminar por gênero, raça, idade ou outras características.",
  },
];

export const learningObjectives = [
  "Analisar dilemas éticos no uso da inteligência artificial",
  "Desenvolver critérios para a tomada de decisões éticas com IA",
  "Compreender os princípios de transparência e responsabilidade na IA",
  "Avaliar o impacto social das decisões automatizadas",
];

export const furtherReading = [
  {
    title: "AI Ethics Guidelines — European Commission",
    url: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    description:
      "Diretrizes éticas para uma IA confiável da Comissão Europeia.",
  },
  {
    title: "MIT Moral Machine",
    url: "https://www.moralmachine.net/",
    description:
      "Experimento interativo sobre dilemas éticos em veículos autônomos.",
  },
];
