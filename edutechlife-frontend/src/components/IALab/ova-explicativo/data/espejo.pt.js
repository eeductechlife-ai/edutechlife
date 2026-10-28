export default {
  badge: "Módulo 1 · Explicação",
  title: "O Espelho da Verdade",
  subtitle:
    "O que é um viés na IA, de onde vem, como detectá-lo e como reduzi-lo",
  intro:
    "A IA aprende com textos escritos por pessoas, e esses textos têm preconceitos. Um espelho mostra o que está ali: aqui você vai aprender a enxergar os vieses que a IA pode refletir e repetir, e o que fazer para não amplificá-los.",
  objectives: [
    "Definir viés algorítmico e explicar a sua origem",
    "Reconhecer quatro tipos de viés com exemplos",
    "Aplicar um teste simples para detectar um viés",
    "Propor medidas para reduzir um viés em um resultado",
  ],
  sections: [
    {
      title: "1. De onde vem um viés",
      explain: [
        "Um viés é uma tendência que favorece ou prejudica de forma sistemática um grupo de pessoas. Um sistema de IA pode tê-lo porque aprendeu com dados que já o tinham.",
        "O viés nem sempre é intencional. Pode vir dos dados, de como foram rotulados, ou de quem projetou o sistema e qual problema pretendia resolver.",
      ],
      terms: [
        {
          term: "Viés algorítmico",
          def: "Resultado sistematicamente injusto produzido por um sistema automático.",
        },
        {
          term: "Dados de treinamento",
          def: "Os textos ou registros com que o sistema aprendeu.",
        },
      ],
      how: [
        "Os dados refletem decisões e preconceitos do passado.",
        "O sistema aprende esses padrões como se fossem normais.",
        "Ele repete o padrão nas respostas e decisões.",
      ],
      example:
        "Se os dados de contratação de uma empresa quase nunca têm mulheres em cargos de liderança, um sistema treinado com eles pode associar «liderança» a homens.",
      mistake:
        "Achar que, por ser uma máquina, não pode ser injusta. Se aprende com dados injustos, reproduz a injustiça.",
    },
    {
      title: "2. Quatro tipos de viés",
      explain: [
        "Há várias formas de viés. Saber o tipo ajuda a procurá-lo no lugar certo.",
        "Viés de dados: os dados não representam todos. Viés de amostragem: as pessoas medidas foram mal escolhidas. Viés de rotulagem: quem classificou os dados tinha uma visão enviesada. Viés de confirmação: o sistema tende a dar o que se espera.",
      ],
      terms: [
        {
          term: "Viés de dados",
          def: "Os dados não representam bem a população real.",
        },
        {
          term: "Viés de amostragem",
          def: "A amostra foi escolhida de forma que alguns grupos ficam de fora.",
        },
        {
          term: "Viés de rotulagem",
          def: "Os rótulos dados aos dados refletem preconceitos de quem os atribuiu.",
        },
      ],
      how: [
        "Pergunte a quem os dados representam.",
        "Pergunte quem os rotulou e com que critério.",
        "Verifique se o resultado favorece alguns grupos mais que outros.",
      ],
      example:
        "Um sistema para encontrar «bons candidatos» treinado só com perfis de uma cidade pode penalizar candidatos de outras regiões: viés de amostragem.",
      mistake:
        "Procurar o viés só no resultado final. Às vezes ele começa nos dados ou na forma como foram rotulados.",
    },
    {
      title: "3. Como detectar um viés",
      explain: [
        "Um teste simples é fazer a mesma pergunta mudando só um dado que não deveria importar, como o nome, a idade ou o lugar de origem, e comparar as respostas.",
        "Se a resposta muda de forma injusta, há um viés que vale a pena registrar e corrigir.",
      ],
      terms: [
        {
          term: "Teste contrafactual",
          def: "Mudar um único dado e observar se o resultado muda de forma injusta.",
        },
        {
          term: "Grupo afetado",
          def: "As pessoas que recebem tratamento injusto por causa do viés.",
        },
      ],
      how: [
        "Escolha o dado a mudar (nome, idade, região).",
        "Faça a mesma pergunta duas ou três vezes, mudando só esse dado.",
        "Compare as respostas e anote as diferenças injustas.",
      ],
      example:
        "Você pede uma recomendação de carreira para «Ana» e para «Andrés», com o mesmo perfil acadêmico. Se uma recomendação é mais ambiciosa para um deles, há um viés a revisar.",
      mistake:
        "Testar uma única vez. Um viés se confirma com vários testes e casos diferentes.",
    },
    {
      title: "4. Reduzir o viés",
      explain: [
        "Reduzir um viés é mudar o processo: incluir dados mais representativos, revisar os rótulos, pedir justificativas e deixar uma pessoa responsável pelas decisões que afetam outras.",
        "Nenhum método o elimina por completo. O importante é detectá-lo, registrá-lo e corrigi-lo a tempo.",
      ],
      terms: [
        {
          term: "Mitigação",
          def: "Medidas que reduzem um viés sem pretender eliminá-lo totalmente.",
        },
        {
          term: "Revisão humana",
          def: "Uma pessoa que revisa e decide quando o resultado afeta pessoas.",
        },
      ],
      how: [
        "Peça ao sistema que explique os critérios.",
        "Verifique se faltam grupos nos dados e complete.",
        "Deixe uma pessoa responsável pelas decisões que afetam outros.",
      ],
      example:
        "Antes de usar uma ferramenta de seleção, você pede os critérios e testa com casos de grupos diferentes. Só depois decide como usá-la.",
      mistake:
        "Confiar que um resultado é justo porque o sistema diz que é. É preciso verificar.",
    },
  ],
  summary: [
    "Um viés é uma tendência injusta e sistemática; a IA pode aprendê-la com os dados.",
    "Pode vir dos dados, da amostragem, da rotulagem ou do próprio desenho do sistema.",
    "O teste contrafactual muda um dado para ver se o resultado muda de forma injusta.",
    "Reduzir um viés exige revisar dados, pedir critérios e manter uma pessoa responsável.",
    "Detectar, registrar e corrigir a tempo vale mais do que achar que ele não existe.",
  ],
  check: [
    {
      q: "De onde pode vir um viés na IA?",
      options: [
        "Somente de erros de programação evidentes.",
        "Dos dados, da rotulagem ou do desenho do sistema.",
        "Da cor da tela onde é usada.",
      ],
      correct: 1,
      feedback:
        "O viés pode começar nos dados, nos rótulos ou no desenho, não só no código.",
    },
    {
      q: "O que é um teste contrafactual?",
      options: [
        "Mudar um único dado e observar se o resultado muda de forma injusta.",
        "Pedir que a IA se avalie.",
        "Apagar os dados antes de testar.",
      ],
      correct: 0,
      feedback:
        "Mudar um dado que não deveria importar revela se há tratamento injusto.",
    },
    {
      q: "Um sistema dá respostas diferentes para dois perfis iguais que diferem só no lugar de origem. O que você faz?",
      options: [
        "Aceito, porque a IA não tem preconceitos.",
        "Registro e reviso os dados e critérios que o produzem.",
        "Escolho sempre a resposta mais favorável.",
      ],
      correct: 1,
      feedback:
        "Uma diferença injusta entre perfis iguais é um viés: registre e revise a origem.",
    },
  ],
};
