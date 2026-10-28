export const MODULE_5_PT_PART1 = [
  {
    id: "m5q1",
    question:
      "Você vai pedir ao Claude uma proposta para um cliente. Qual pedido evita que o Claude tenha de supor dados-chave?",
    options: [
      {
        id: "m5q1_a",
        label:
          "Objetivo, cliente que vai ler, formato, tom e o que não prometer",
      },
      {
        id: "m5q1_b",
        label:
          "O objetivo e o formato; o tom e os limites o Claude decide por conta própria",
      },
      {
        id: "m5q1_c",
        label: "Uma proposta anterior e a frase 'faça uma igual'",
      },
      {
        id: "m5q1_d",
        label:
          "Uma lista de adjetivos: profissional, criativa, completa e persuasiva",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Conhecer o Claude",
    difficulty: "fácil",
    source: "Lição 1 · Conheça o Claude: a IA que trabalha com você",
    feedback:
      "Um pedido completo tem cinco partes: objetivo, público, formato, tom e limites. Cada parte que falta é uma suposição que o Claude faz por você.",
  },
  {
    id: "m5q2",
    question: "O que um Artifact permite fazer no Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Guardar instruções fixas que valem para todos os seus chats",
      },
      {
        id: "m5q2_b",
        label:
          "Conectar o Claude ao Gmail ou ao Drive para que ele leia os seus arquivos",
      },
      {
        id: "m5q2_c",
        label: "Ver e melhorar uma peça ao lado do chat sem começar do zero",
      },
      {
        id: "m5q2_d",
        label: "Lembrar o seu tom preferido de uma conversa para outra",
      },
    ],
    correctAnswer: "m5q2_c",
    topic: "Criar com o Claude",
    difficulty: "fácil",
    source:
      "Lição 2 · Crie com o Claude: Artifacts, documentos e apresentações",
    feedback:
      "Um Artifact é uma peça (documento, tabela ou pequeno app) que fica ao lado do chat: você a vê e a melhora por partes. As instruções fixas vão em um Projeto, as preferências na memória e o acesso aos seus apps nos conectores.",
  },
  {
    id: "m5q3",
    question:
      "Hoje você precisa corrigir a ortografia de 20 e-mails curtos e, à parte, analisar um contrato longo com cláusulas complexas. Como escolhe o modelo do Claude?",
    options: [
      {
        id: "m5q3_a",
        label:
          "O mais capaz para as duas tarefas, para garantir a melhor qualidade",
      },
      {
        id: "m5q3_b",
        label: "Um rápido para os e-mails e um mais capaz para o contrato",
      },
      {
        id: "m5q3_c",
        label: "Um rápido para as duas, porque ambas são tarefas de texto",
      },
      {
        id: "m5q3_d",
        label:
          "O mais capaz para os e-mails, porque são mais, e um rápido para o contrato",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Conhecer o Claude",
    difficulty: "médio",
    source: "Lição 1 · Conheça o Claude: a IA que trabalha com você",
    feedback:
      "Um modelo rápido basta para tarefas simples e repetidas, como corrigir e-mails curtos; um mais capaz convém para um texto longo que exige raciocínio, como o contrato. Usar o mais potente para tudo gasta sem ganhar, e um rápido pode ficar aquém no contrato.",
  },
  {
    id: "m5q4",
    question: "Qual é a melhor forma de usar um Projeto no Claude?",
    options: [
      {
        id: "m5q4_a",
        label:
          "Um único Projeto para todo o seu trabalho, assim o Claude tem todo o contexto",
      },
      {
        id: "m5q4_b",
        label: "Colar as mesmas instruções no início de cada chat do Projeto",
      },
      {
        id: "m5q4_c",
        label: "Subir todos os arquivos da empresa caso algum seja necessário",
      },
      {
        id: "m5q4_d",
        label:
          "Um Projeto por trabalho que se repete, com suas regras e arquivos",
      },
    ],
    correctAnswer: "m5q4_d",
    topic: "Projetos e memória",
    difficulty: "fácil",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Um Projeto guarda as instruções e os arquivos de um trabalho concreto que se repete, para você não repeti-los em cada chat. Misturar temas ou subir arquivos demais dá contexto inútil e pode expor dados.",
  },
  {
    id: "m5q5",
    question:
      "Você quer que o Claude leia o seu e-mail para preparar a resposta a um cliente. O que você faz?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Conectar só o e-mail, revisar as permissões e aprovar você a resposta",
      },
      {
        id: "m5q5_b",
        label:
          "Conectar e-mail, Drive e Agenda de uma vez para não repetir o processo",
      },
      {
        id: "m5q5_c",
        label:
          "Copiar no chat os e-mails completos do cliente, com os dados dele",
      },
      {
        id: "m5q5_d",
        label: "Conectar o e-mail e deixar o Claude enviar a resposta",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Com um conector você dá acesso só ao que a tarefa precisa e aprova as permissões. Você pode desconectá-lo ao terminar, e a resposta você revisa e envia.",
  },
  {
    id: "m5q6",
    question:
      "Para o Claude revisar a sua plataforma de vendas, um colega sugere escrever no chat o seu usuário e a sua senha. O que você faz?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Compartilho e troco a senha assim que o Claude terminar a revisão",
      },
      {
        id: "m5q6_b",
        label: "Escrevo em um chat incógnito para que não fique salva",
      },
      {
        id: "m5q6_c",
        label:
          "Uso um conector para essa plataforma e leio que permissões ele pede",
      },
      {
        id: "m5q6_d",
        label: "Passo a senha ao Claude nas instruções de um Projeto privado",
      },
    ],
    correctAnswer: "m5q6_c",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Uma senha abre toda a sua conta e não se escreve em um chat, seja incógnito ou de um Projeto. Para dar acesso a uma ferramenta usa-se um conector, e antes de aprová-lo você lê que permissões ele pede. Trocá-la depois não desfaz que você já a compartilhou.",
  },
  {
    id: "m5q7",
    question:
      "Toda segunda-feira você prepara o mesmo relatório de pendências e sempre explica ao Claude os mesmos passos. O que convém fazer?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Continuar escrevendo os passos completos em cada chat para que não se percam",
      },
      {
        id: "m5q7_b",
        label:
          "Salvar esses passos em uma Skill, usá-la toda segunda e revisar o relatório",
      },
      {
        id: "m5q7_c",
        label:
          "Usar um chat incógnito para o Claude começar do zero cada segunda",
      },
      {
        id: "m5q7_d",
        label: "Criar um Projeto novo toda segunda com os mesmos passos",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Um procedimento que você faz sempre igual é salvo como Skill: o Claude aplica os mesmos passos todas as vezes e você só revisa o resultado. O incógnito não guarda o procedimento para a semana seguinte, e criar um Projeto por semana repete o trabalho.",
  },
  {
    id: "m5q8",
    question:
      "Você pede ao Claude uma tarefa de várias etapas: revisar a sua agenda, redigir convites e enviá-los a 30 clientes. Onde você coloca o ponto de controle?",
    options: [
      {
        id: "m5q8_a",
        label: "No final: reviso o resumo do que ele fez quando terminar",
      },
      {
        id: "m5q8_b",
        label: "No início: dou instruções detalhadas e deixo ele trabalhar",
      },
      {
        id: "m5q8_c",
        label: "Na redação: aprovo o texto modelo e deixo que envie o restante",
      },
      {
        id: "m5q8_d",
        label:
          "Antes de enviar: reviso os convites e confirmo eu mesmo o envio",
      },
    ],
    correctAnswer: "m5q8_d",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Em uma tarefa de várias etapas, as ações importantes, como enviar algo a clientes, são confirmadas antes de acontecer, porque depois não se desfazem. Revisar no final chega tarde, boas instruções não substituem a revisão e aprovar o modelo não revisa cada convite.",
  },
  {
    id: "m5q9",
    question:
      "O Claude parece lembrar detalhes de conversas anteriores. O que você faz se quiser controlar essa informação?",
    options: [
      {
        id: "m5q9_a",
        label:
          "Revisar a memória nas configurações e editar ou apagar o que não quiser",
      },
      {
        id: "m5q9_b",
        label: "Criar um Projeto, porque os Projetos apagam a memória geral",
      },
      {
        id: "m5q9_c",
        label:
          "Passar o seu trabalho para chats incógnitos, mesmo querendo que lembre o seu tom",
      },
      {
        id: "m5q9_d",
        label:
          "Pedir que guarde tudo, porque com mais memória dá respostas melhores",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 1 · Conheça o Claude: a IA que trabalha com você",
    feedback:
      "A memória é revisada e ajustada nas configurações: você decide o que convém que ela lembre. O incógnito serve para um chat pontual que você não quer na memória, não para todo o seu trabalho.",
  },
  {
    id: "m5q10",
    question:
      "Você vai subir ao Claude um contrato com dados pessoais de clientes. O que é mais prudente?",
    options: [
      {
        id: "m5q10_a",
        label: "Subi-lo completo, porque é um documento interno da empresa",
      },
      {
        id: "m5q10_b",
        label: "Subi-lo completo e apagar o chat assim que terminar",
      },
      {
        id: "m5q10_c",
        label:
          "Anonimizar os dados pessoais e compartilhar só as cláusulas necessárias",
      },
      {
        id: "m5q10_d",
        label:
          "Subi-lo completo e pedir ao Claude que não considere os nomes nem os telefones",
      },
    ],
    correctAnswer: "m5q10_c",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Minimize os dados que você compartilha: anonimize ou tenha autorização antes de subir, e respeite a política da sua organização e a lei (no Brasil, a LGPD; na Colômbia, a Lei 1581 de 2012). Apagar o chat depois ou pedir que ignore os nomes não desfaz o compartilhamento.",
  },
  {
    id: "m5q11",
    question: "Qual é a diferença entre um Projeto e a memória do Claude?",
    options: [
      {
        id: "m5q11_a",
        label:
          "O Projeto lembra as suas preferências em todos os chats; a memória, só dentro de um",
      },
      {
        id: "m5q11_b",
        label:
          "O Projeto guarda regras e arquivos de um trabalho; a memória, dados entre chats",
      },
      {
        id: "m5q11_c",
        label: "Nenhuma: os dois guardam o mesmo, só muda onde aparecem",
      },
      {
        id: "m5q11_d",
        label:
          "A memória guarda arquivos de referência; o Projeto, o seu tom preferido",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 1 · Conheça o Claude: a IA que trabalha com você",
    feedback:
      "O Projeto é o contexto de um trabalho concreto: instruções e arquivos. A memória lembra preferências e dados úteis entre conversas. Por exemplo, a sua marca vai em um Projeto e a sua preferência de tom, na memória.",
  },
  {
    id: "m5q12",
    question:
      "O Claude propõe um dado com uma citação a um estudo. Qual é o passo correto?",
    options: [
      {
        id: "m5q12_a",
        label: "Pedir o link do estudo e citá-lo se o Claude der um",
      },
      {
        id: "m5q12_b",
        label: "Citá-lo se o autor e a revista parecerem conhecidos",
      },
      {
        id: "m5q12_c",
        label:
          "Perguntar ao Claude se tem certeza do dado e citar se ele confirmar",
      },
      {
        id: "m5q12_d",
        label: "Buscar o estudo original e confirmar que diz o mesmo",
      },
    ],
    correctAnswer: "m5q12_d",
    topic: "Limites e erros",
    difficulty: "fácil",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "Uma citação pode parecer real e não existir ou dizer outra coisa; um link ou uma confirmação do Claude não provam nada. Confira sempre na fonte primária.",
  },
  {
    id: "m5q13",
    question:
      "Qual tarefa é mais adequada para delegar ao Claude com revisão mínima?",
    options: [
      {
        id: "m5q13_a",
        label: "Formatar um modelo de ata que você já tinha aprovado",
      },
      {
        id: "m5q13_b",
        label: "Redigir e enviar a resposta à reclamação de um cliente",
      },
      {
        id: "m5q13_c",
        label: "Classificar 200 e-mails de clientes com nomes e telefones",
      },
      {
        id: "m5q13_d",
        label: "Resumir para a diretoria um relatório com números",
      },
    ],
    correctAnswer: "m5q13_a",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3 · Delegue com o Claude: Projetos, conectores e Skills",
    feedback:
      "As tarefas de forma, sem decisão de fundo, são ideais para delegar. O que vai para terceiros, contém dados pessoais ou números para decidir é delegado e revisado.",
  },
];
