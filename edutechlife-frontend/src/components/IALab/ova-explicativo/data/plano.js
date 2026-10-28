// OVA «El Plano Maestro» (ILAB-M2-OVA1). Cómo responde un modelo, modos, conectores y memoria.
export default {
  es: {
    badge: "Módulo 2 · Explicación",
    title: "El Plano Maestro",
    subtitle:
      "Cómo responde ChatGPT, qué significan sus modos y qué permiso das cuando conectas una cuenta",
    intro:
      "Antes de elegir una herramienta, conviene entender cómo funciona el sistema que la sostiene. Aquí aprenderás los términos del ecosistema de ChatGPT: modelo, modo, conector y memoria, y qué debes revisar en cada caso.",
    objectives: [
      "Explicar qué es un modelo de lenguaje y cómo construye una respuesta",
      "Distinguir modelo, modo y plan",
      "Entender qué es un conector y qué permiso concede",
      "Controlar qué recuerda la memoria de tu cuenta",
    ],
    sections: [
      {
        title: "1. Cómo construye una respuesta un modelo",
        explain: [
          "Un modelo de lenguaje no busca una respuesta guardada: escribe una pieza tras otra, eligiendo la que tiene más sentido después de la anterior. Por eso una misma pregunta puede tener respuestas distintas.",
          "Trabaja con fragmentos de texto llamados tokens. Lo que cabe en una conversación tiene un límite: la ventana de contexto. Si el texto es muy largo, las partes lejanas pueden perderse.",
        ],
        terms: [
          {
            term: "Modelo de lenguaje",
            def: "Sistema entrenado con grandes cantidades de texto para predecir y generar lenguaje.",
          },
          {
            term: "Token",
            def: "Fragmento de texto (una palabra, parte de una palabra o un signo) que el modelo procesa.",
          },
          {
            term: "Ventana de contexto",
            def: "Cantidad de texto que el modelo puede considerar a la vez en una conversación.",
          },
        ],
        how: [
          "Recibe tu pedido y lo divide en tokens.",
          "Predice la siguiente pieza, una tras otra.",
          "Entrega la respuesta completa. Puede equivocarse aunque suene segura.",
        ],
        example:
          "Si pegas un documento muy largo y luego preguntas por su primera página, el modelo puede no tenerla en cuenta si queda fuera de la ventana de contexto.",
        mistake:
          "Pensar que la IA «busca» en una base de datos interna. Genera la respuesta en el momento, por eso debes verificarla.",
      },
      {
        title: "2. Modelo, modo y plan",
        explain: [
          "El modelo es el motor que responde. Los modos son formas de usarlo: unos priorizan la velocidad y otros razonan más despacio para tareas complejas.",
          "El plan define qué modelos y qué funciones tienes disponibles. Los nombres y las opciones cambian con frecuencia, así que revisa el selector de tu cuenta.",
        ],
        terms: [
          {
            term: "Modo",
            def: "Forma de usar un modelo: más rápido para tareas simples, más detenido para problemas complejos.",
          },
          {
            term: "Plan",
            def: "Conjunto de modelos y funciones que incluye tu cuenta.",
          },
        ],
        how: [
          "Abre el selector de modelo de tu cuenta.",
          "Usa el modo rápido para borradores y resúmenes simples.",
          "Usa el modo más detenido para análisis con varios pasos.",
        ],
        example:
          "Para resumir un correo, basta el modo rápido. Para comparar tres contratos con cláusulas distintas, conviene el modo más detenido.",
        mistake:
          "Creer que el modo más potente siempre es mejor. Para una tarea simple tarda más y no mejora el resultado.",
      },
      {
        title: "3. Herramientas y conectores",
        explain: [
          "Las herramientas integradas amplían lo que el modelo puede hacer: buscar en la web, analizar archivos, generar imágenes o trabajar con documentos.",
          "Un conector es un permiso para que la IA lea o use una cuenta externa, por ejemplo un correo o un calendario. Antes de conectar, revisa qué datos podrá ver.",
        ],
        terms: [
          {
            term: "Herramienta",
            def: "Función que permite al modelo hacer algo más que escribir texto.",
          },
          {
            term: "Conector",
            def: "Permiso que da acceso a una cuenta o servicio externo.",
          },
          {
            term: "Permiso",
            def: "Lo que la app puede leer o hacer en tu nombre. Se concede al conectar.",
          },
        ],
        how: [
          "Elige la herramienta según la tarea: buscar, analizar, crear imagen o leer archivos.",
          "Antes de conectar una cuenta, revisa qué permisos pide.",
          "Desconecta lo que no uses.",
        ],
        example:
          "Conectar tu calendario permite preguntar «¿qué tengo el jueves?». Pero también le da acceso a tus eventos: concédelo solo si lo necesitas.",
        mistake:
          "Aceptar todos los permisos sin leerlos, o conectar una cuenta con datos de otras personas.",
      },
      {
        title: "4. Memoria y control",
        explain: [
          "La memoria es lo que la cuenta recuerda de tus conversaciones para responder mejor en el futuro. Puedes revisarla, editarla y decidir qué se guarda.",
          "Recordar más no siempre es mejor: una preferencia útil ayuda, pero un dato sensible guardado sin necesidad es un riesgo.",
        ],
        terms: [
          {
            term: "Memoria",
            def: "Lo que la cuenta conserva de tus conversaciones para usarlo en otras.",
          },
          {
            term: "Instrucciones personalizadas",
            def: "Preferencias que defines una vez y se aplican a tus chats.",
          },
        ],
        how: [
          "Revisa en la configuración qué recuerda la memoria.",
          "Borra lo que no quieras que se conserve.",
          "Para un trabajo puntual, usa un chat sin memoria o un Proyecto.",
        ],
        example:
          "Guardar «respóndeme en tono formal» es útil. Guardar la cédula de un cliente no lo es.",
        mistake:
          "Olvidar que la memoria existe y compartir datos pensando que cada chat empieza de cero.",
      },
    ],
    summary: [
      "Un modelo escribe la respuesta pieza por pieza; puede equivocarse aunque suene seguro.",
      "El modelo es el motor, el modo es la forma de usarlo y el plan define qué tienes.",
      "Una herramienta amplía lo que hace el modelo; un conector le da acceso a una cuenta externa.",
      "La memoria conserva lo que decides; revísala y bórrala cuando sea necesario.",
      "Antes de conectar o guardar algo, pregúntate qué permiso das y qué datos quedan.",
    ],
    check: [
      {
        q: "¿Qué es un token?",
        options: [
          "Un pago que se hace por cada respuesta.",
          "Un fragmento de texto que el modelo procesa.",
          "La contraseña de tu cuenta.",
        ],
        correct: 1,
        feedback:
          "Un token es un fragmento de texto (una palabra, parte de una palabra o un signo) que el modelo procesa.",
      },
      {
        q: "Quieres que la IA lea tu calendario para avisarte de citas. ¿Qué debes revisar primero?",
        options: [
          "Nada: conectar siempre es seguro.",
          "Qué permisos pide el conector y si necesitas darle ese acceso.",
          "Que el logo de la app sea bonito.",
        ],
        correct: 1,
        feedback:
          "Un conector concede permisos reales sobre tu cuenta: revisa qué puede ver antes de conectarlo.",
      },
      {
        q: "Resumir un correo corto. ¿Qué modo conviene?",
        options: [
          "El más detenido, porque siempre es mejor.",
          "El rápido, porque la tarea es simple.",
          "Ninguno: la IA no resume correos.",
        ],
        correct: 1,
        feedback:
          "Para una tarea simple, el modo rápido basta y responde antes.",
      },
    ],
  },
  en: {
    badge: "Module 2 · Explanation",
    title: "The Master Blueprint",
    subtitle:
      "How ChatGPT answers, what its modes mean, and what permission you give when you connect an account",
    intro:
      "Before choosing a tool, it helps to understand the system behind it. Here you will learn the terms of the ChatGPT ecosystem: model, mode, connector and memory, and what to check in each case.",
    objectives: [
      "Explain what a language model is and how it builds an answer",
      "Tell apart model, mode and plan",
      "Understand what a connector is and what permission it grants",
      "Control what your account's memory keeps",
    ],
    sections: [
      {
        title: "1. How a model builds an answer",
        explain: [
          "A language model does not look up a stored answer: it writes one piece after another, choosing the piece that makes most sense after the previous one. That is why the same question can get different answers.",
          "It works with text fragments called tokens. What fits in a conversation has a limit: the context window. If the text is very long, the distant parts can be lost.",
        ],
        terms: [
          {
            term: "Language model",
            def: "A system trained on large amounts of text to predict and generate language.",
          },
          {
            term: "Token",
            def: "A text fragment (a word, part of a word or a sign) that the model processes.",
          },
          {
            term: "Context window",
            def: "The amount of text the model can consider at once in a conversation.",
          },
        ],
        how: [
          "It receives your request and splits it into tokens.",
          "It predicts the next piece, one after another.",
          "It delivers the full answer. It can be wrong even when it sounds sure.",
        ],
        example:
          "If you paste a very long document and then ask about its first page, the model may not take it into account if it falls outside the context window.",
        mistake:
          "Thinking the AI «searches» an internal database. It generates the answer on the spot, which is why you must verify it.",
      },
      {
        title: "2. Model, mode and plan",
        explain: [
          "The model is the engine that answers. Modes are ways of using it: some prioritize speed, others reason more slowly for complex tasks.",
          "Your plan defines which models and features you have. Names and options change often, so check the model selector in your account.",
        ],
        terms: [
          {
            term: "Mode",
            def: "A way of using a model: faster for simple tasks, more deliberate for complex problems.",
          },
          {
            term: "Plan",
            def: "The set of models and features your account includes.",
          },
        ],
        how: [
          "Open the model selector in your account.",
          "Use the fast mode for drafts and simple summaries.",
          "Use the more deliberate mode for multi-step analysis.",
        ],
        example:
          "To summarize an email, the fast mode is enough. To compare three contracts with different clauses, the more deliberate mode is better.",
        mistake:
          "Believing the most powerful mode is always better. For a simple task it takes longer and does not improve the result.",
      },
      {
        title: "3. Tools and connectors",
        explain: [
          "Built-in tools extend what the model can do: searching the web, analyzing files, generating images or working with documents.",
          "A connector is a permission that lets the AI read or use an external account, for example an email or a calendar. Before you connect, check what data it will see.",
        ],
        terms: [
          {
            term: "Tool",
            def: "A feature that lets the model do more than write text.",
          },
          {
            term: "Connector",
            def: "A permission that gives access to an external account or service.",
          },
          {
            term: "Permission",
            def: "What the app can read or do on your behalf. You grant it when you connect.",
          },
        ],
        how: [
          "Choose the tool for the task: search, analyze, create an image or read files.",
          "Before connecting an account, check which permissions it asks for.",
          "Disconnect what you do not use.",
        ],
        example:
          "Connecting your calendar lets you ask «what do I have on Thursday?». But it also gives access to your events: grant it only if you need it.",
        mistake:
          "Accepting every permission without reading them, or connecting an account that holds other people's data.",
      },
      {
        title: "4. Memory and control",
        explain: [
          "Memory is what the account keeps from your conversations so it can answer better in the future. You can review it, edit it and decide what is kept.",
          "Remembering more is not always better: a useful preference helps, but a sensitive detail kept without need is a risk.",
        ],
        terms: [
          {
            term: "Memory",
            def: "What the account keeps from your conversations to use in others.",
          },
          {
            term: "Custom instructions",
            def: "Preferences you define once and that apply to your chats.",
          },
        ],
        how: [
          "Check in the settings what the memory keeps.",
          "Delete what you do not want kept.",
          "For a one-off job, use a chat without memory or a Project.",
        ],
        example:
          "Saving «answer me in a formal tone» is useful. Saving a client's ID number is not.",
        mistake:
          "Forgetting that memory exists and sharing data as if every chat started from zero.",
      },
    ],
    summary: [
      "A model writes the answer piece by piece; it can be wrong even when it sounds sure.",
      "The model is the engine, the mode is how you use it, and the plan defines what you have.",
      "A tool extends what the model does; a connector gives it access to an external account.",
      "Memory keeps what you decide; review it and delete when needed.",
      "Before you connect or save anything, ask what permission you give and what data stays.",
    ],
    check: [
      {
        q: "What is a token?",
        options: [
          "A payment made for each answer.",
          "A text fragment that the model processes.",
          "Your account password.",
        ],
        correct: 1,
        feedback:
          "A token is a text fragment (a word, part of a word or a sign) that the model processes.",
      },
      {
        q: "You want the AI to read your calendar to remind you of appointments. What should you check first?",
        options: [
          "Nothing: connecting is always safe.",
          "What permissions the connector asks for and whether you need that access.",
          "That the app's logo looks nice.",
        ],
        correct: 1,
        feedback:
          "A connector grants real permissions over your account: check what it can see before connecting.",
      },
      {
        q: "You need to summarize a short email. Which mode fits?",
        options: [
          "The most deliberate one, because it is always better.",
          "The fast one, because the task is simple.",
          "None: AI cannot summarize emails.",
        ],
        correct: 1,
        feedback:
          "For a simple task, the fast mode is enough and responds sooner.",
      },
    ],
  },
  pt: {
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
  },
};
