export default {
  badge: "Módulo 2 · Explicação",
  title: "O Plano Mestre",
  subtitle:
    "Como o ChatGPT responde, o que significam os modos e que permissão você dá ao conectar uma conta",
  intro:
    "Antes de escolher uma ferramenta, convém entender o sistema que a sustenta. Aqui você vai aprender os termos do ecossistema do ChatGPT: modelo, modo, conector e memória, e o que conferir em cada caso.",
  objectives: [
    "Explicar o que é um modelo de linguagem e como ele monta uma resposta",
    "Distinguir modelo, modo e plano",
    "Entender o que é um conector e que permissão concede",
    "Controlar o que a memória da sua conta guarda",
  ],
  sections: [
    {
      title: "1. Como um modelo monta uma resposta",
      explain: [
        "Um modelo de linguagem não busca uma resposta guardada: escreve uma peça após a outra, escolhendo a que faz mais sentido depois da anterior. Por isso a mesma pergunta pode ter respostas diferentes.",
        "Ele trabalha com fragmentos de texto chamados tokens. O que cabe em uma conversa tem um limite: a janela de contexto. Se o texto for muito longo, as partes distantes podem se perder.",
      ],
      terms: [
        {
          term: "Modelo de linguagem",
          def: "Sistema treinado com grandes volumes de texto para prever e gerar linguagem.",
        },
        {
          term: "Token",
          def: "Fragmento de texto (uma palavra, parte de uma palavra ou um sinal) que o modelo processa.",
        },
        {
          term: "Janela de contexto",
          def: "Quantidade de texto que o modelo pode considerar ao mesmo tempo em uma conversa.",
        },
      ],
      how: [
        "Recebe o seu pedido e o divide em tokens.",
        "Prevê a próxima peça, uma após a outra.",
        "Entrega a resposta completa. Pode errar mesmo soando segura.",
      ],
      example:
        "Se você cola um documento muito longo e depois pergunta pela primeira página, o modelo pode não considerá-la se ela ficou fora da janela de contexto.",
      mistake:
        "Achar que a IA «procura» em um banco de dados interno. Ela gera a resposta na hora, por isso é preciso conferir.",
    },
    {
      title: "2. Modelo, modo e plano",
      explain: [
        "O modelo é o motor que responde. Os modos são formas de usá-lo: alguns priorizam a velocidade e outros raciocinam com mais calma em tarefas complexas.",
        "O plano define quais modelos e funções você tem. Nomes e opções mudam com frequência, então confira o seletor de modelo da sua conta.",
      ],
      terms: [
        {
          term: "Modo",
          def: "Forma de usar um modelo: mais rápido para tarefas simples, mais detido para problemas complexos.",
        },
        {
          term: "Plano",
          def: "Conjunto de modelos e funções que a sua conta inclui.",
        },
      ],
      how: [
        "Abra o seletor de modelo da sua conta.",
        "Use o modo rápido para rascunhos e resumos simples.",
        "Use o modo mais detido para análises com várias etapas.",
      ],
      example:
        "Para resumir um e-mail, basta o modo rápido. Para comparar três contratos com cláusulas diferentes, convém o modo mais detido.",
      mistake:
        "Achar que o modo mais potente é sempre melhor. Em uma tarefa simples ele demora mais e não melhora o resultado.",
    },
    {
      title: "3. Ferramentas e conectores",
      explain: [
        "As ferramentas integradas ampliam o que o modelo faz: pesquisar na web, analisar arquivos, gerar imagens ou trabalhar com documentos.",
        "Um conector é uma permissão para que a IA leia ou use uma conta externa, por exemplo um e-mail ou uma agenda. Antes de conectar, confira quais dados ela vai ver.",
      ],
      terms: [
        {
          term: "Ferramenta",
          def: "Função que permite ao modelo fazer mais do que escrever texto.",
        },
        {
          term: "Conector",
          def: "Permissão que dá acesso a uma conta ou serviço externo.",
        },
        {
          term: "Permissão",
          def: "O que o aplicativo pode ler ou fazer em seu nome. Você a concede ao conectar.",
        },
      ],
      how: [
        "Escolha a ferramenta pela tarefa: pesquisar, analisar, criar imagem ou ler arquivos.",
        "Antes de conectar uma conta, confira as permissões que ela pede.",
        "Desconecte o que você não usa.",
      ],
      example:
        "Conectar a sua agenda permite perguntar «o que tenho na quinta?». Mas também dá acesso aos seus eventos: conceda só se precisar.",
      mistake:
        "Aceitar todas as permissões sem ler, ou conectar uma conta que tem dados de outras pessoas.",
    },
    {
      title: "4. Memória e controle",
      explain: [
        "A memória é o que a conta guarda das suas conversas para responder melhor no futuro. Você pode revisá-la, editá-la e decidir o que fica.",
        "Lembrar mais nem sempre é melhor: uma preferência útil ajuda, mas um dado sensível guardado sem necessidade é um risco.",
      ],
      terms: [
        {
          term: "Memória",
          def: "O que a conta guarda das suas conversas para usar em outras.",
        },
        {
          term: "Instruções personalizadas",
          def: "Preferências que você define uma vez e se aplicam aos seus chats.",
        },
      ],
      how: [
        "Confira nas configurações o que a memória guarda.",
        "Apague o que não quer que fique guardado.",
        "Para um trabalho pontual, use um chat sem memória ou um Projeto.",
      ],
      example:
        "Guardar «responda em tom formal» é útil. Guardar o número de identidade de um cliente não é.",
      mistake:
        "Esquecer que a memória existe e compartilhar dados achando que cada chat começa do zero.",
    },
  ],
  summary: [
    "Um modelo escreve a resposta peça por peça; pode errar mesmo soando seguro.",
    "O modelo é o motor, o modo é a forma de usá-lo e o plano define o que você tem.",
    "Uma ferramenta amplia o que o modelo faz; um conector dá acesso a uma conta externa.",
    "A memória guarda o que você decide; revise-a e apague quando preciso.",
    "Antes de conectar ou guardar algo, pergunte que permissão está dando e que dados ficam.",
  ],
  check: [
    {
      q: "O que é um token?",
      options: [
        "Um pagamento feito a cada resposta.",
        "Um fragmento de texto que o modelo processa.",
        "A senha da sua conta.",
      ],
      correct: 1,
      feedback:
        "Um token é um fragmento de texto (uma palavra, parte de uma palavra ou um sinal) que o modelo processa.",
    },
    {
      q: "Você quer que a IA leia sua agenda para avisar de compromissos. O que confere primeiro?",
      options: [
        "Nada: conectar é sempre seguro.",
        "Quais permissões o conector pede e se você precisa dar esse acesso.",
        "Se o logo do aplicativo é bonito.",
      ],
      correct: 1,
      feedback:
        "Um conector concede permissões reais sobre a sua conta: confira o que ele pode ver antes de conectar.",
    },
    {
      q: "Você precisa resumir um e-mail curto. Qual modo serve?",
      options: [
        "O mais detido, porque é sempre melhor.",
        "O rápido, porque a tarefa é simples.",
        "Nenhum: a IA não resume e-mails.",
      ],
      correct: 1,
      feedback:
        "Para uma tarefa simples, o modo rápido basta e responde antes.",
    },
  ],
};
