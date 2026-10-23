// Banco del módulo 5 (Claude), en portugués: mismo contenido, ids, orden de opciones y correctAnswer que module5.js.
// La correcta nunca es la opción más larga ni la más corta. La clave vive en src/data/ialab.js.
export const MODULE_5_PT = [
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
    source: "Lição 1: Conheça o Claude",
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
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Um Artifact é uma peça (documento, tabela ou pequeno app) que fica ao lado do chat: você a vê, melhora por partes e exporta. As instruções fixas vão em um Projeto, as preferências na memória e o acesso aos seus apps nos conectores.",
  },
  {
    id: "m5q3",
    question:
      "O Claude entrega uma tabela com números de vendas. O que você faz antes de apresentá-la à equipe?",
    options: [
      {
        id: "m5q3_a",
        label:
          "Pedir ao Claude que revise os próprios números e confiar na resposta",
      },
      {
        id: "m5q3_b",
        label: "Comparar cada número com a fonte original e refazer um cálculo",
      },
      {
        id: "m5q3_c",
        label: "Revisar ortografia e formato, porque os números vêm do arquivo",
      },
      {
        id: "m5q3_d",
        label: "Pedir que acrescente a fonte de cada dado e apresentar assim",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Supervisão",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O Claude pode errar números e soar seguro, mesmo quando revisa a si mesmo. Citar uma fonte não é conferi-la: compare com o dado original antes de apresentar.",
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
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um Projeto guarda as instruções e os arquivos de um trabalho concreto que se repete, para você não repeti-los em cada chat. Misturar temas ou subir arquivos demais dá contexto inútil e pode expor dados.",
  },
  {
    id: "m5q5",
    question:
      "Você quer que o Claude leia o seu correo para preparar a resposta a um cliente. O que você faz?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Conectar só o correo, revisar as permissões e aprovar você a resposta",
      },
      {
        id: "m5q5_b",
        label:
          "Conectar correo, Drive e Agenda de uma vez para não repetir o processo",
      },
      {
        id: "m5q5_c",
        label:
          "Copiar no chat os e-mails completos do cliente, com os dados dele",
      },
      {
        id: "m5q5_d",
        label: "Conectar o correo e deixar o Claude enviar a resposta",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Com um conector você dá acesso só ao que a tarefa precisa e aprova as permissões. Você pode desconectá-lo ao terminar, e a resposta você revisa e envia.",
  },
  {
    id: "m5q6",
    question: "Qual é a diferença entre uma Skill e um Projeto?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Uma Skill guarda os arquivos de um trabalho; um Projeto guarda os passos de um procedimento que se repete",
      },
      {
        id: "m5q6_b",
        label:
          "Uma Skill guarda as conversas de um trabalho; um Projeto guarda seu tom e suas preferências",
      },
      {
        id: "m5q6_c",
        label:
          "Uma Skill guarda um procedimento com passos e modelos; um Projeto, o contexto de um trabalho",
      },
      {
        id: "m5q6_d",
        label:
          "São a mesma coisa com outro nome: ambos guardam instruções e arquivos de um trabalho",
      },
    ],
    correctAnswer: "m5q6_c",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Uma Skill guarda um procedimento que você faz sempre igual: passos, modelos e exemplos. Um Projeto guarda o contexto de um trabalho que se repete, com suas instruções e arquivos. Os conectores dão acesso aos seus apps.",
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
        label: "Usar um chat incógnito para o Claude começar sempre do zero",
      },
      {
        id: "m5q7_d",
        label: "Criar um Projeto novo toda segunda com os mesmos passos",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um procedimento que você faz sempre igual é salvo como Skill: o Claude aplica os mesmos passos todas as vezes e você só revisa o resultado. O incógnito não guarda o procedimento para a semana seguinte, e criar um Projeto por semana repete o trabalho.",
  },
  {
    id: "m5q8",
    question: "O que significa 'delegar com critério' ao Claude?",
    options: [
      {
        id: "m5q8_a",
        label: "Delegar só o fácil e fazer você todo o importante",
      },
      {
        id: "m5q8_b",
        label:
          "Delegar tudo o que o Claude faz bem e revisar só se algo falhar",
      },
      {
        id: "m5q8_c",
        label:
          "Entregar a tarefa e a decisão se o pedido tiver as cinco partes",
      },
      {
        id: "m5q8_d",
        label: "Entregar o rascunho, revisar o que sai e manter a decisão",
      },
    ],
    correctAnswer: "m5q8_d",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Delegar não é se desligar: você entrega a forma e o rascunho, revisa o que vai para terceiros e mantém a decisão. Um bom pedido melhora o resultado, mas não transfere a responsabilidade.",
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
          "Escrever sempre no incógnito, mesmo precisando que lembre o seu tom",
      },
      {
        id: "m5q9_d",
        label:
          "Pedir que guarde tudo, porque mais memória sempre dá respostas melhores em todos os chats",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
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
    source: "Lição 3: Delegue com o Claude",
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
    source: "Lição 1: Conheça o Claude",
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
    source: "Lição 3: Delegue com o Claude",
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
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "As tarefas de forma, sem decisão de fundo, são ideais para delegar. O que vai para terceiros, contém dados pessoais ou números para decidir é delegado e revisado.",
  },
  {
    id: "m5q14",
    question:
      "Você quer que o Claude gere uma apresentação para a diretoria. O que você entrega primeiro?",
    options: [
      {
        id: "m5q14_a",
        label: "O tema e o número de slides; a mensagem o Claude decide",
      },
      {
        id: "m5q14_b",
        label: "Os números do trimestre para o Claude escolher o que destacar",
      },
      {
        id: "m5q14_c",
        label:
          "A mensagem central, quem vai ver, os números conferidos e a extensão",
      },
      {
        id: "m5q14_d",
        label:
          "Uma apresentação anterior de outra empresa para copiar o design e o conteúdo",
      },
    ],
    correctAnswer: "m5q14_c",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Uma boa apresentação começa pela mensagem e pelo público. Se o Claude escolhe o que destacar, a decisão é dele e não sua; e os números são conferidos antes de entrar no slide.",
  },
  {
    id: "m5q15",
    question:
      "O Claude fez uma mudança em um documento que você já tinha editado. O que convém fazer?",
    options: [
      {
        id: "m5q15_a",
        label: "Aceitar a nova versão, porque cada mudança melhora a anterior",
      },
      {
        id: "m5q15_b",
        label: "Comparar com a versão anterior e ficar com o que melhora",
      },
      {
        id: "m5q15_c",
        label: "Pedir que refaça tudo do zero com um pedido mais longo",
      },
      {
        id: "m5q15_d",
        label: "Voltar à sua versão sem revisar o que mudou",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Cada mudança deixa uma versão diferente: compare o antes e o depois e decida você o que fica. Começar do zero ou descartar sem olhar desperdiça o que já funcionava.",
  },
  {
    id: "m5q16",
    question:
      "Você escreve ao Claude: «Escreva um e-mail para as famílias sobre a reunião de sábado, com tom cordial e sem nomes de estudantes». Qual parte do pedido está faltando?",
    options: [
      {
        id: "m5q16_a",
        label: "Nenhuma: o pedido já tem as cinco partes completas",
      },
      {
        id: "m5q16_b",
        label: "O tom: como o e-mail deve soar e quais palavras evitar",
      },
      {
        id: "m5q16_c",
        label:
          "Os limites: quais dados o e-mail não deve incluir e o que evitar na redação",
      },
      {
        id: "m5q16_d",
        label: "O formato: como o e-mail vai se ver e quão longo deve ser",
      },
    ],
    correctAnswer: "m5q16_d",
    topic: "Limites e erros",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "Um pedido completo tem cinco partes: objetivo, público, formato, tom e limites. Este pedido não diz o formato, então o Claude decidiria a extensão e a estrutura por conta própria.",
  },
  {
    id: "m5q17",
    question:
      "Qual é a melhor prática ao escrever as instruções de um Projeto?",
    options: [
      {
        id: "m5q17_a",
        label:
          "Dizer o papel do Claude, para que serve, o tom e o que nunca fazer",
      },
      {
        id: "m5q17_b",
        label: "Colar o manual completo da empresa no lugar das instruções",
      },
      {
        id: "m5q17_c",
        label:
          "Escrever só o tom, porque o resto o Claude deduz dos arquivos que você enviar",
      },
      {
        id: "m5q17_d",
        label:
          "Incluir os telefones dos clientes para personalizar cada resposta",
      },
    ],
    correctAnswer: "m5q17_a",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "As instruções do Projeto dizem quem é o Claude, para que serve, como soa e o que nunca deve fazer. Os arquivos complementam, e dados pessoais não são enviados sem autorização.",
  },
  {
    id: "m5q18",
    question:
      "Um colega pede um relatório feito com o Claude que contém dados confidenciais da empresa. O que você faz?",
    options: [
      {
        id: "m5q18_a",
        label: "Publicá-lo com link aberto, porque só o meu colega vai tê-lo",
      },
      {
        id: "m5q18_b",
        label:
          "Compartilhá-lo completo, porque foi feito por uma IA e não é oficial",
      },
      {
        id: "m5q18_c",
        label: "Verificar se ele pode vê-lo e compartilhar só o permitido",
      },
      {
        id: "m5q18_d",
        label: "Pedir um resumo ao Claude e enviá-lo sem revisar",
      },
    ],
    correctAnswer: "m5q18_c",
    topic: "Privacidade e dados",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Uma ferramenta gerar um documento não muda o seu nível de confidencialidade. Qualquer pessoa que receba um link aberto pode vê-lo: compartilhe só o que a política permite e com quem deve.",
  },
  {
    id: "m5q19",
    question:
      "Você trabalha há semanas no Projeto de uma escola e pedem um texto para outro cliente, sem relação. Onde você faz?",
    options: [
      {
        id: "m5q19_a",
        label: "No mesmo Projeto, porque o Claude já conhece bem o seu estilo",
      },
      {
        id: "m5q19_b",
        label:
          "Fora desse Projeto, para não carregar as regras nem os arquivos dele",
      },
      {
        id: "m5q19_c",
        label: "No mesmo Projeto, pedindo que ignore as instruções",
      },
      {
        id: "m5q19_d",
        label:
          "No Projeto, depois de apagar as instruções e escrevê-las de novo ao terminar",
      },
    ],
    correctAnswer: "m5q19_b",
    topic: "Delegar com o Claude",
    difficulty: "difícil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Cada Projeto aplica suas instruções e arquivos a todos os seus chats. Um trabalho sem relação vai em outro Projeto ou em um chat à parte, assim você não carrega regras nem dados que não se aplicam.",
  },
  {
    id: "m5q20",
    question:
      "O Claude comparou os currículos de uma vaga e recomenda uma candidata. O que você faz com essa recomendação?",
    options: [
      {
        id: "m5q20_a",
        label: "Contratá-la se a análise citar bem os dados de cada currículo",
      },
      {
        id: "m5q20_b",
        label: "Pedir ao Claude que confirme a escolha e segui-la",
      },
      {
        id: "m5q20_c",
        label: "Aceitá-la, porque o pedido tinha as cinco partes completas",
      },
      {
        id: "m5q20_d",
        label: "Revisar a análise como insumo e decidir você quem contratar",
      },
    ],
    correctAnswer: "m5q20_d",
    topic: "Supervisão",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Escolher quem contratar é decidir sobre uma pessoa: essa decisão não se delega. O Claude pode ordenar e comparar; você revisa a análise e decide. Nem uma confirmação do Claude nem um bom pedido transferem a responsabilidade.",
  },
  {
    id: "m5q21",
    question:
      "Você vai pedir ao Claude um relatório de frequência de um curso. Que versão dos dados você compartilha?",
    options: [
      {
        id: "m5q21_a",
        label: "A frequência por código de aluno, sem nomes nem telefones",
      },
      {
        id: "m5q21_b",
        label: "A lista completa com nomes, porque o relatório é interno",
      },
      {
        id: "m5q21_c",
        label:
          "A lista completa em um chat incógnito, porque assim não fica salva",
      },
      {
        id: "m5q21_d",
        label: "A lista completa dentro de um Projeto privado",
      },
    ],
    correctAnswer: "m5q21_a",
    topic: "Privacidade e dados",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Compartilhe só o necessário: com códigos no lugar de nomes o relatório sai igual. Nem o incógnito nem um Projeto privado autorizam compartilhar dados pessoais (no Brasil, a LGPD; na Colômbia, a Lei 1581 de 2012).",
  },
  {
    id: "m5q22",
    question:
      "Você pede ao Claude 'escreva um e-mail para um cliente' e o resultado sai longo e formal demais. O que explica melhor o que aconteceu?",
    options: [
      {
        id: "m5q22_a",
        label: "O Claude escreve longo por padrão e sempre é preciso cortar",
      },
      {
        id: "m5q22_b",
        label:
          "Você usou um modelo rápido; com um mais potente o e-mail sairia curto e cordial",
      },
      {
        id: "m5q22_c",
        label:
          "O pedido não dizia público, formato nem tom, e o Claude os supôs",
      },
      {
        id: "m5q22_d",
        label:
          "O Claude imita e-mails formais da internet e esse estilo não pode ser mudado",
      },
    ],
    correctAnswer: "m5q22_c",
    topic: "Limites e erros",
    difficulty: "médio",
    source: "Lição 1: Conheça o Claude",
    feedback:
      "Cada parte que falta no pedido é algo que o Claude supõe por você. Se você não diz para que serve, quem lê, qual a extensão e qual tom usar, o Claude escolhe, e pode não ser o que você queria. Um pedido completo tem objetivo, público, formato, tom e limites.",
  },
  {
    id: "m5q23",
    question: "Qual destas é uma boa forma de criar um Artifact interativo?",
    options: [
      {
        id: "m5q23_a",
        label:
          "Pedir todas as funções em uma única mensagem bem longa para não precisar iterar",
      },
      {
        id: "m5q23_b",
        label:
          "Dizer para que serve, que dados recebe e o que mostra; depois iterar",
      },
      {
        id: "m5q23_c",
        label: "Pedir 'um app interativo' e deixar o Claude escolher o resto",
      },
      {
        id: "m5q23_d",
        label:
          "Compartilhá-lo com a equipe assim que aparecer e corrigir depois",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Criar com o Claude",
    difficulty: "médio",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Descreva o uso, os dados de entrada e o resultado, melhore com mudanças pequenas e teste a peça antes de compartilhar.",
  },
  {
    id: "m5q24",
    question:
      "O que é uma boa prática ao revisar um documento que o Claude escreveu para o seu cliente?",
    options: [
      {
        id: "m5q24_a",
        label: "Revisar só a ortografia, porque o conteúdo você já pediu bem",
      },
      {
        id: "m5q24_b",
        label:
          "Pedir ao Claude que o revise e enviar se ele não encontrar nenhum erro",
      },
      {
        id: "m5q24_c",
        label: "Ler a introdução e o fechamento, que é o que o cliente olha",
      },
      {
        id: "m5q24_d",
        label: "Revisar dados, nomes, datas e tom contra o que você quer dizer",
      },
    ],
    correctAnswer: "m5q24_d",
    topic: "Supervisão",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Um texto bem escrito pode ter dados incorretos ou um nome errado, e o Claude nem sempre detecta os próprios erros. A revisão humana completa é obrigatória.",
  },
  {
    id: "m5q25",
    question:
      "Você quer reutilizar em vários projetos o mesmo procedimento para redigir atas de reunião. O que convém criar?",
    options: [
      {
        id: "m5q25_a",
        label: "Uma Skill com os passos, o modelo e uma ata de exemplo",
      },
      {
        id: "m5q25_b",
        label:
          "Um Projeto novo para cada reunião, com o procedimento colado nas instruções",
      },
      {
        id: "m5q25_c",
        label: "Nada: deixar que a memória lembre e aplique sozinha",
      },
      {
        id: "m5q25_d",
        label: "Um Artifact com a ata anterior para copiar toda vez",
      },
    ],
    correctAnswer: "m5q25_a",
    topic: "Conectores e Skills",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O que você repete vira Skill: o procedimento fica igual todas as vezes, serve em qualquer trabalho e economiza tempo.",
  },
  {
    id: "m5q26",
    question: "Qual destas afirmações sobre IA e trabalho é mais responsável?",
    options: [
      {
        id: "m5q26_a",
        label: "Se o pedido estiver bem feito, a revisão humana sobra",
      },
      {
        id: "m5q26_b",
        label: "A IA serve para ideias, mas não para trabalho profissional",
      },
      {
        id: "m5q26_c",
        label: "A IA acelera o trabalho, mas a decisão continua sendo humana",
      },
      {
        id: "m5q26_d",
        label:
          "Se o Claude errar, a responsabilidade pelo erro é da ferramenta",
      },
    ],
    correctAnswer: "m5q26_c",
    topic: "Delegar com o Claude",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "A IA acelera o trabalho, inclusive o profissional. A decisão e as consequências continuam sendo da pessoa, por melhor que seja o pedido.",
  },
  {
    id: "m5q27",
    question:
      "Você quer que o Claude analise um arquivo grande de dados. O que faz para ter um resultado confiável?",
    options: [
      {
        id: "m5q27_a",
        label: "Pedir direto a conclusão final para economizar tempo",
      },
      {
        id: "m5q27_b",
        label: "Pedir os passos da análise e validar uma amostra à mão",
      },
      {
        id: "m5q27_c",
        label: "Pedir ao Claude que confirme o resultado duas vezes",
      },
      {
        id: "m5q27_d",
        label:
          "Pedir um gráfico: se ele parecer coerente, então o dado está certo",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Limites e erros",
    difficulty: "difícil",
    source: "Lição 2: Crie com o Claude",
    feedback:
      "Peça o método e valide uma amostra com um cálculo independente. O Claude confirmar ou o gráfico parecer bom não prova que o dado está certo.",
  },
  {
    id: "m5q28",
    question:
      "O Claude redigiu o rascunho de um relatório para um cliente e você o revisou e ajustou. O que você faz sobre o uso de IA ao entregá-lo?",
    options: [
      {
        id: "m5q28_a",
        label: "Nada: se eu revisei e ajustei, o relatório agora é só meu",
      },
      {
        id: "m5q28_b",
        label: "Menciono só se o cliente perguntar como foi feito",
      },
      {
        id: "m5q28_c",
        label: "Coloco o Claude como autor, porque ele escreveu a maior parte",
      },
      {
        id: "m5q28_d",
        label: "Declaro como usei a IA e quem responde pelo conteúdo final",
      },
    ],
    correctAnswer: "m5q28_d",
    topic: "Delegar com o Claude",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "Declarar o uso de IA faz parte de entregar com honestidade: você diz em que ela ajudou e quem revisou e responde pelo resultado. Revisar não apaga que você usou IA, e a responsabilidade é de uma pessoa, não da ferramenta.",
  },
  {
    id: "m5q29",
    question:
      "Você quer fazer ao Claude uma consulta pontual que não fique no seu histórico nem na memória dele. O que você faz?",
    options: [
      {
        id: "m5q29_a",
        label:
          "Abrir um chat incógnito e compartilhar só os dados realmente necessários",
      },
      {
        id: "m5q29_b",
        label:
          "Fazer no seu Projeto de trabalho, que já tem todas as suas instruções salvas",
      },
      {
        id: "m5q29_c",
        label: "Fazer em um chat normal, porque a memória é privada",
      },
      {
        id: "m5q29_d",
        label:
          "Usar o incógnito e colar dados de clientes, porque ali é permitido",
      },
    ],
    correctAnswer: "m5q29_a",
    topic: "Privacidade e dados",
    difficulty: "fácil",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O incógnito serve para um chat pontual: não fica no seu histórico nem é usado para a memória. A Anthropic, porém, pode guardar essas conversas por um tempo por segurança, e o incógnito não autoriza você a compartilhar dados pessoais: compartilhe só o necessário. Um chat normal ou um Projeto conservam esse contexto.",
  },
  {
    id: "m5q30",
    question:
      "Ao terminar um projeto com o Claude, qual prática deixa uma base melhor para o próximo?",
    options: [
      {
        id: "m5q30_a",
        label: "Apagar o Projeto para começar o próximo sem contexto",
      },
      {
        id: "m5q30_b",
        label: "Deixar tudo na memória para o Claude lembrar sozinho",
      },
      {
        id: "m5q30_c",
        label:
          "Guardar instruções, exemplos e aprendizados em um Projeto ou Skill",
      },
      {
        id: "m5q30_d",
        label:
          "Guardar o histórico completo de chats e relê-lo inteiro da próxima vez",
      },
    ],
    correctAnswer: "m5q30_c",
    topic: "Projetos e memória",
    difficulty: "médio",
    source: "Lição 3: Delegue com o Claude",
    feedback:
      "O que funciona deve ficar salvo em um Projeto ou uma Skill: assim cada novo trabalho parte do que foi aprendido, sem depender de reler chats nem do que a memória guarda.",
  },
];
