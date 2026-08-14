import { Scale, Eye, Lock, Shield, Users, Zap } from "lucide-react";

export const contentData = {
  intro: {
    title: "Introdução à Ética em IA",
    text: "A inteligência artificial chegou para transformar áreas como a medicina, a educação e a justiça. Mas o seu poder não a torna neutra. Os sistemas de IA tomam decisões que afetam milhões de pessoas, e podem ser incorretos ou injustos. Compreender isso é uma competência cidadã urgente.",
    extended:
      "Este módulo oferece ferramentas para usar a IA com responsabilidade, reconhecer riscos e mitigar vieses algorítmicos.",
  },
  cap1: {
    title: "1. Fundamentos Éticos",
    text: "A ética da IA estuda os valores e as normas que devem guiar o seu design e uso, buscando sempre o bem-estar de todas as pessoas.",
    principles: [
      {
        icon: <Scale className="w-5 h-5" />,
        name: "Equidade e justiça",
        desc: "Não deve discriminar nem favorecer grupos específicos.",
      },
      {
        icon: <Eye className="w-5 h-5" />,
        name: "Transparência",
        desc: "Os usuários devem entender como e por que a IA toma decisões.",
      },
      {
        icon: <Lock className="w-5 h-5" />,
        name: "Privacidade",
        desc: "Proteção de dados pessoais e uso com consentimento.",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        name: "Responsabilidade",
        desc: "Sempre deve haver um humano ou instituição responsável.",
      },
      {
        icon: <Users className="w-5 h-5" />,
        name: "Benefício social",
        desc: "Deve melhorar o bem-estar de toda a sociedade.",
      },
    ],
  },
  cap2: {
    title: "2. Uso Adequado da IA",
    text: "O uso adequado é um uso consciente que não substitui o pensamento crítico nem a autoria intelectual.",
    dos: [
      "Usar IA para gerar rascunhos e enriquecê-los com o próprio critério.",
      "Citar explicitamente o uso de IA em trabalhos acadêmicos.",
      "Verificar dados em fontes primárias para evitar alucinações.",
      "Usar a IA como tutor para ampliar o aprendizado.",
    ],
    toolTitle: "Ferramenta em Destaque: NotebookLM",
    toolDesc:
      "O NotebookLM é um exemplo de como usar a IA de forma responsável para a pesquisa, permitindo centralizar fontes e verificar informações com citações diretas.",
  },
  cap3: {
    title: "3. Riscos e Desvantagens",
    text: "Reconhecer os riscos permite usar a tecnologia com maior inteligência e cautela.",
    risks: [
      {
        name: "Alucinações",
        desc: "Geração de informações falsas com aparência de verdade (ex.: citações legais inexistentes).",
      },
      {
        name: "Impacto no Trabalho",
        desc: "Automação de empregos rotineiros e necessidade de requalificação.",
      },
      {
        name: "Privacidade e Vigilância",
        desc: "Riscos do reconhecimento facial e da análise massiva de dados.",
      },
      {
        name: "Concentração de Poder",
        desc: "Decisões globais tomadas por poucas empresas de tecnologia.",
      },
    ],
    critical:
      "Dependência Cognitiva: Delegar o pensamento à IA reduz a capacidade de argumentar e memorizar aprendizados profundos.",
  },
  cap4: {
    title: "4. Vieses na IA",
    text: "Os vieses são erros sistemáticos que refletem desigualdades históricas presentes nos dados de treinamento.",
    biases: [
      {
        name: "Viés de dados históricos",
        desc: "Reflete discriminações passadas (ex.: preferência de gênero em empregos).",
      },
      {
        name: "Viés de representação",
        desc: "Sub-representação de minorias (ex.: erros no reconhecimento facial de peles escuras).",
      },
      {
        name: "Viés de automação",
        desc: "Confiança excessiva na IA em detrimento do critério humano especializado.",
      },
      {
        name: "Viés cultural",
        desc: "Marcos culturais alheios que ignoram perspectivas locais.",
      },
    ],
  },
};

export const learningObjectives = [
  "Compreender os fundamentos éticos da IA",
  "Identificar vieses algorítmicos comuns",
  "Aplicar princípios de uso responsável da IA",
  "Avaliar criticamente decisões automatizadas",
];

export const gameData = [
  {
    id: 1,
    case: "Um advogado usa IA em um julgamento e apresenta leis que não existem.",
    concept: "Alucinação do Modelo",
  },
  {
    id: 2,
    case: "Um sistema de bolsas rejeita candidatos apenas pelo seu código postal.",
    concept: "Viés de Dados Históricos",
  },
  {
    id: 3,
    case: "Um estudante deixa de ler livros porque a IA faz todos os resumos.",
    concept: "Dependência Cognitiva",
  },
  {
    id: 4,
    case: "Um banco não consegue explicar por que seu algoritmo negou um empréstimo.",
    concept: "Falta de Transparência",
  },
  {
    id: 5,
    case: "Um usuário presume que a IA está certa mesmo quando contradiz seu manual técnico.",
    concept: "Viés de Automação",
  },
];
