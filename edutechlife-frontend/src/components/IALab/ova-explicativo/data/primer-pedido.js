// OVA «El Primer Pedido» (ILAB-M5-OVA1). Cómo hacer una primera solicitud eficaz a Claude: partes del pedido, ejemplos y errores comunes.
export default {
  es: {
    badge: "Módulo 5 · Explicación",
    title: "El Primer Pedido",
    subtitle:
      "Las partes de una buena solicitud a Claude, cómo se lee una respuesta y cómo mejorarla paso a paso",
    intro:
      "Cada conversación con Claude empieza con un pedido. Un pedido bien construido ahorra tiempo y evita respuestas genéricas. Aquí aprenderás el vocabulario de la solicitud, sus partes y cómo mejorar la respuesta sin empezar de cero.",
    objectives: [
      "Identificar las partes de una solicitud clara",
      "Redactar un primer pedido con rol, tarea y formato",
      "Leer una respuesta y decidir qué pedir a continuación",
      "Reconocer los errores que hacen una respuesta genérica",
    ],
    sections: [
      {
        title: "1. Las partes de un pedido",
        explain: [
          "Un pedido claro tiene tres partes: la tarea (qué quieres que haga), el contexto (para quién y por qué) y el formato (cómo quieres la respuesta). Sin estas partes, Claude tiene que suponer.",
          "No necesitas escribir párrafos largos. Dos o tres frases bien elegidas bastan para cambiar mucho el resultado.",
        ],
        terms: [
          {
            term: "Tarea",
            def: "Lo que quieres que Claude haga: resumir, explicar, redactar, comparar.",
          },
          {
            term: "Formato",
            def: "Cómo quieres la respuesta: lista, tabla, párrafo, número de palabras.",
          },
        ],
        how: [
          "Escribe la tarea en un verbo claro.",
          "Agrega el contexto: quién lo lee y para qué.",
          "Indica el formato que necesitas.",
        ],
        example:
          "«Explica la fotosíntesis (tarea) a estudiantes de secundaria (contexto) en tres puntos con ejemplos cotidianos (formato).»",
        mistake:
          "Pedir «háblame de la fotosíntesis» y esperar una explicación a la medida.",
      },
      {
        title: "2. Cómo leer una respuesta",
        explain: [
          "Antes de aceptar una respuesta, revisa si cumple la tarea, si tiene el formato pedido y si los datos son correctos. Una respuesta puede sonar bien y no cumplir lo que pediste.",
          "Si algo no cuadra, no empieces de cero: indica qué falta o qué sobra y pide ese cambio.",
        ],
        terms: [
          {
            term: "Cumplir",
            def: "Que la respuesta haga exactamente lo que se pidió.",
          },
          {
            term: "Iterar",
            def: "Mejorar la respuesta con cambios pequeños sobre la misma conversación.",
          },
        ],
        how: [
          "Revisa la tarea, el formato y los datos.",
          "Señala lo que falta o sobra.",
          "Pide el cambio concreto, no un «hazlo mejor».",
        ],
        example:
          "La respuesta llega en párrafos y la pediste en tres puntos. Escribes: «Pásalo a tres puntos, sin cambiar el contenido.»",
        mistake:
          "Empezar una conversación nueva cada vez que la respuesta no sale perfecta.",
      },
      {
        title: "3. Mejorar con pasos pequeños",
        explain: [
          "Mejorar una respuesta es iterar: pides una versión, la revisas, pides un ajuste y repites. Cada paso es pequeño y controlado.",
          "Así conservas lo que ya estaba bien y cambias solo lo que no.",
        ],
        terms: [
          {
            term: "Ajuste",
            def: "Cambio pequeño y concreto sobre una parte de la respuesta.",
          },
          {
            term: "Contexto de la conversación",
            def: "Lo que ya se dijo en el chat y que Claude usa para responder.",
          },
        ],
        how: [
          "Pide la primera versión.",
          "Revisa y pide un ajuste concreto.",
          "Repite hasta cumplir el objetivo.",
        ],
        example:
          "Primera versión: un párrafo general. Ajuste: «Agrega un ejemplo de un cultivo de maíz.» Segundo ajuste: «Acorta a 80 palabras.»",
        mistake:
          "Pedir cambios grandes y generales que obligan a reescribir todo.",
      },
      {
        title: "4. Errores frecuentes",
        explain: [
          "Tres errores aparecen casi siempre: pedidos sin contexto, pedidos sin formato y aceptar la primera respuesta sin revisarla. Cada uno produce respuestas genéricas o incompletas.",
          "Un buen pedido se lee como una instrucción a una persona nueva: si no entiende, no puede hacer el trabajo.",
        ],
        terms: [
          {
            term: "Respuesta genérica",
            def: "Respuesta válida en general, pero que no responde a tu caso concreto.",
          },
          {
            term: "Rol",
            def: "Papel que le pides a Claude asumir, como «eres un tutor de matemáticas».",
          },
        ],
        how: [
          "Relee el pedido como si lo leyera otra persona.",
          "Agrega contexto si falta.",
          "Revisa la respuesta antes de usarla.",
        ],
        example:
          "«Escribe un correo» produce algo genérico. «Escribe un correo a un cliente que retrasó un pago, en tono amable, en cinco líneas» produce algo útil.",
        mistake: "Aceptar la primera respuesta porque llegó rápido.",
      },
    ],
    summary: [
      "Un pedido claro tiene tarea, contexto y formato.",
      "Revisa la respuesta contra lo que pediste antes de aceptarla.",
      "Mejora con ajustes concretos y pequeños, no empezando de cero.",
      "Una respuesta genérica casi siempre viene de un pedido sin contexto.",
      "Un buen pedido se lee como una instrucción a una persona nueva.",
    ],
    check: [
      {
        q: "¿Cuáles son las tres partes de una solicitud clara?",
        options: [
          "Saludo, despedida y firma.",
          "Tarea, contexto y formato.",
          "Título, portada y fecha.",
        ],
        correct: 1,
        feedback:
          "Una solicitud clara indica la tarea, el contexto y el formato de la respuesta.",
      },
      {
        q: "La respuesta llegó en párrafos y la pediste en tres puntos. ¿Qué haces?",
        options: [
          "Empiezo una conversación nueva.",
          "Pido el ajuste concreto: pasar a tres puntos sin cambiar el contenido.",
          "La acepto tal cual.",
        ],
        correct: 1,
        feedback:
          "Un ajuste concreto conserva lo que estaba bien y cambia solo lo que faltaba.",
      },
      {
        q: "¿Qué hace que una respuesta sea genérica?",
        options: [
          "Un pedido sin contexto ni formato.",
          "Un pedido con tarea, contexto y formato.",
          "Una conversación muy larga.",
        ],
        correct: 0,
        feedback:
          "Sin contexto ni formato, Claude responde de forma general porque tiene que suponer.",
      },
    ],
  },
  en: {
    badge: "Module 5 · Explanation",
    title: "The First Request",
    subtitle:
      "The parts of a good request to Claude, how to read an answer and how to improve it step by step",
    intro:
      "Every conversation with Claude starts with a request. A well-built request saves time and avoids generic answers. Here you will learn the vocabulary of a request, its parts, and how to improve the answer without starting from scratch.",
    objectives: [
      "Identify the parts of a clear request",
      "Write a first request with role, task and format",
      "Read an answer and decide what to ask next",
      "Recognize the mistakes that produce a generic answer",
    ],
    sections: [
      {
        title: "1. The parts of a request",
        explain: [
          "A clear request has three parts: the task (what you want done), the context (for whom and why) and the format (how you want the answer). Without these, Claude has to guess.",
          "You do not need long paragraphs. Two or three well-chosen sentences can change the result a lot.",
        ],
        terms: [
          {
            term: "Task",
            def: "What you want Claude to do: summarize, explain, draft, compare.",
          },
          {
            term: "Format",
            def: "How you want the answer: list, table, paragraph, word count.",
          },
        ],
        how: [
          "Write the task with a clear verb.",
          "Add the context: who reads it and why.",
          "State the format you need.",
        ],
        example:
          "«Explain photosynthesis (task) to high-school students (context) in three points with everyday examples (format).»",
        mistake:
          "Asking «tell me about photosynthesis» and expecting an explanation tailored to you.",
      },
      {
        title: "2. How to read an answer",
        explain: [
          "Before accepting an answer, check whether it fulfills the task, whether it has the format you asked for and whether the data is correct. An answer can sound good and still not do what you asked.",
          "If something is off, do not start from scratch: say what is missing or extra and ask for that change.",
        ],
        terms: [
          {
            term: "Fulfill",
            def: "The answer does exactly what was requested.",
          },
          {
            term: "Iterate",
            def: "Improving the answer with small changes in the same conversation.",
          },
        ],
        how: [
          "Check the task, the format and the data.",
          "Point out what is missing or extra.",
          "Ask for a specific change, not a «make it better».",
        ],
        example:
          "The answer comes in paragraphs and you asked for three points. You write: «Turn it into three points, without changing the content.»",
        mistake:
          "Starting a new conversation every time an answer is not perfect.",
      },
      {
        title: "3. Improving in small steps",
        explain: [
          "Improving an answer is iterating: you ask for a version, review it, ask for an adjustment and repeat. Each step is small and controlled.",
          "This way you keep what was already right and change only what is not.",
        ],
        terms: [
          {
            term: "Adjustment",
            def: "A small, specific change to one part of the answer.",
          },
          {
            term: "Conversation context",
            def: "What was already said in the chat, which Claude uses to answer.",
          },
        ],
        how: [
          "Ask for the first version.",
          "Review it and ask for one specific adjustment.",
          "Repeat until the goal is met.",
        ],
        example:
          "First version: a general paragraph. Adjustment: «Add an example about a corn crop.» Second adjustment: «Shorten it to 80 words.»",
        mistake: "Asking for big, general changes that force a full rewrite.",
      },
      {
        title: "4. Common mistakes",
        explain: [
          "Three mistakes come up almost always: requests without context, requests without a format and accepting the first answer without reviewing it. Each one produces generic or incomplete answers.",
          "A good request reads like an instruction to a new person: if they do not understand, they cannot do the work.",
        ],
        terms: [
          {
            term: "Generic answer",
            def: "An answer that is valid in general but does not address your specific case.",
          },
          {
            term: "Role",
            def: "The part you ask Claude to play, such as «you are a math tutor».",
          },
        ],
        how: [
          "Reread the request as if someone else wrote it.",
          "Add context if it is missing.",
          "Review the answer before using it.",
        ],
        example:
          "«Write an email» produces something generic. «Write an email to a client who delayed a payment, in a friendly tone, in five lines» produces something useful.",
        mistake: "Accepting the first answer because it arrived quickly.",
      },
    ],
    summary: [
      "A clear request has task, context and format.",
      "Review the answer against what you asked before accepting it.",
      "Improve with small, specific adjustments, not by starting over.",
      "A generic answer almost always comes from a request without context.",
      "A good request reads like an instruction to a new person.",
    ],
    check: [
      {
        q: "What are the three parts of a clear request?",
        options: [
          "Greeting, closing and signature.",
          "Task, context and format.",
          "Title, cover and date.",
        ],
        correct: 1,
        feedback:
          "A clear request states the task, the context and the format of the answer.",
      },
      {
        q: "The answer came in paragraphs and you asked for three points. What do you do?",
        options: [
          "I start a new conversation.",
          "I ask for the specific adjustment: turn it into three points without changing the content.",
          "I accept it as it is.",
        ],
        correct: 1,
        feedback:
          "A specific adjustment keeps what was right and changes only what was missing.",
      },
      {
        q: "What makes an answer generic?",
        options: [
          "A request without context or format.",
          "A request with task, context and format.",
          "A very long conversation.",
        ],
        correct: 0,
        feedback:
          "Without context or format, Claude answers in general terms because it has to guess.",
      },
    ],
  },
  pt: {
    badge: "Módulo 5 · Explicação",
    title: "O Primeiro Pedido",
    subtitle:
      "As partes de uma boa solicitação ao Claude, como ler uma resposta e como melhorá-la passo a passo",
    intro:
      "Cada conversa com o Claude começa com um pedido. Um pedido bem construído economiza tempo e evita respostas genéricas. Aqui você vai aprender o vocabulário da solicitação, suas partes e como melhorar a resposta sem recomeçar do zero.",
    objectives: [
      "Identificar as partes de uma solicitação clara",
      "Redigir um primeiro pedido com papel, tarefa e formato",
      "Ler uma resposta e decidir o que pedir em seguida",
      "Reconhecer os erros que geram uma resposta genérica",
    ],
    sections: [
      {
        title: "1. As partes de um pedido",
        explain: [
          "Um pedido claro tem três partes: a tarefa (o que você quer que ele faça), o contexto (para quem e por quê) e o formato (como você quer a resposta). Sem elas, o Claude precisa supor.",
          "Você não precisa de parágrafos longos. Duas ou três frases bem escolhidas mudam muito o resultado.",
        ],
        terms: [
          {
            term: "Tarefa",
            def: "O que você quer que o Claude faça: resumir, explicar, redigir, comparar.",
          },
          {
            term: "Formato",
            def: "Como você quer a resposta: lista, tabela, parágrafo, número de palavras.",
          },
        ],
        how: [
          "Escreva a tarefa com um verbo claro.",
          "Acrescente o contexto: quem lê e para quê.",
          "Indique o formato de que precisa.",
        ],
        example:
          "«Explique a fotossíntese (tarefa) a estudantes do ensino médio (contexto) em três pontos com exemplos do dia a dia (formato).»",
        mistake:
          "Pedir «fale sobre a fotossíntese» e esperar uma explicação sob medida.",
      },
      {
        title: "2. Como ler uma resposta",
        explain: [
          "Antes de aceitar uma resposta, confira se cumpre a tarefa, se tem o formato pedido e se os dados estão corretos. Uma resposta pode soar bem e não fazer o que você pediu.",
          "Se algo não encaixa, não recomece do zero: diga o que falta ou o que sobra e peça essa mudança.",
        ],
        terms: [
          {
            term: "Cumprir",
            def: "A resposta fazer exatamente o que foi pedido.",
          },
          {
            term: "Iterar",
            def: "Melhorar a resposta com pequenas mudanças na mesma conversa.",
          },
        ],
        how: [
          "Confira a tarefa, o formato e os dados.",
          "Aponte o que falta ou sobra.",
          "Peça a mudança concreta, não um «melhore».",
        ],
        example:
          "A resposta vem em parágrafos e você pediu em três pontos. Escreva: «Passe para três pontos, sem mudar o conteúdo.»",
        mistake:
          "Começar uma conversa nova toda vez que a resposta não sai perfeita.",
      },
      {
        title: "3. Melhorar em passos pequenos",
        explain: [
          "Melhorar uma resposta é iterar: você pede uma versão, a revisa, pede um ajuste e repete. Cada passo é pequeno e controlado.",
          "Assim você mantém o que já estava certo e muda apenas o que não estava.",
        ],
        terms: [
          {
            term: "Ajuste",
            def: "Mudança pequena e concreta em uma parte da resposta.",
          },
          {
            term: "Contexto da conversa",
            def: "O que já foi dito no chat e que o Claude usa para responder.",
          },
        ],
        how: [
          "Peça a primeira versão.",
          "Revise e peça um ajuste concreto.",
          "Repita até cumprir o objetivo.",
        ],
        example:
          "Primeira versão: um parágrafo geral. Ajuste: «Acrescente um exemplo de uma lavoura de milho.» Segundo ajuste: «Reduza para 80 palavras.»",
        mistake:
          "Pedir mudanças grandes e gerais que obrigam a reescrever tudo.",
      },
      {
        title: "4. Erros frequentes",
        explain: [
          "Três erros aparecem quase sempre: pedidos sem contexto, pedidos sem formato e aceitar a primeira resposta sem revisá-la. Cada um gera respostas genéricas ou incompletas.",
          "Um bom pedido se lê como uma instrução a uma pessoa nova: se ela não entende, não consegue fazer o trabalho.",
        ],
        terms: [
          {
            term: "Resposta genérica",
            def: "Resposta válida em geral, mas que não atende ao seu caso específico.",
          },
          {
            term: "Papel",
            def: "O papel que você pede ao Claude assumir, como «você é um tutor de matemática».",
          },
        ],
        how: [
          "Releia o pedido como se outra pessoa o tivesse escrito.",
          "Acrescente contexto se faltar.",
          "Revise a resposta antes de usar.",
        ],
        example:
          "«Escreva um e-mail» gera algo genérico. «Escreva um e-mail a um cliente que atrasou um pagamento, em tom amável, em cinco linhas» gera algo útil.",
        mistake: "Aceitar a primeira resposta só porque chegou rápido.",
      },
    ],
    summary: [
      "Um pedido claro tem tarefa, contexto e formato.",
      "Revise a resposta contra o que pediu antes de aceitá-la.",
      "Melhore com ajustes concretos e pequenos, sem recomeçar do zero.",
      "Uma resposta genérica quase sempre vem de um pedido sem contexto.",
      "Um bom pedido se lê como uma instrução a uma pessoa nova.",
    ],
    check: [
      {
        q: "Quais são as três partes de uma solicitação clara?",
        options: [
          "Saudação, despedida e assinatura.",
          "Tarefa, contexto e formato.",
          "Título, capa e data.",
        ],
        correct: 1,
        feedback:
          "Uma solicitação clara indica a tarefa, o contexto e o formato da resposta.",
      },
      {
        q: "A resposta veio em parágrafos e você pediu em três pontos. O que faz?",
        options: [
          "Começo uma conversa nova.",
          "Peço o ajuste concreto: passar para três pontos sem mudar o conteúdo.",
          "Aceito como está.",
        ],
        correct: 1,
        feedback:
          "Um ajuste concreto mantém o que estava certo e muda só o que faltava.",
      },
      {
        q: "O que torna uma resposta genérica?",
        options: [
          "Um pedido sem contexto nem formato.",
          "Um pedido com tarefa, contexto e formato.",
          "Uma conversa muito longa.",
        ],
        correct: 0,
        feedback:
          "Sem contexto nem formato, o Claude responde de forma geral porque precisa supor.",
      },
    ],
  },
};
