// Contenido adicional de "El Primer Pedido": recorrido, versiones, resultados probables y diagnóstico.
// Claves de las partes = las de FIRST_REQUEST_DATA (obj, aud, fmt, tone, lim).
export const FIRST_REQUEST_EXTRA = {
  es: {
    outputsTitle: "Así se ve el resultado según tu pedido",
    outputs: [
      "Un correo general que podría enviar cualquiera. No se nota de quién es ni para quién.",
      "Un correo bien escrito, pero el lector no sabe a quién va dirigido ni qué debe hacer.",
      "Un correo claro, con tono y extensión, pero puede prometer fechas que no has confirmado.",
      "Un correo listo para revisar, con tu tono y un límite que reduce la invención de datos.",
    ],
    diagTitle: "Diagnóstico: ¿qué le falta a este pedido?",
    diagWeak: "Haz un informe sobre las ventas del trimestre.",
    diagHint:
      "Marca todas las partes que faltan. Luego compara con lo que Claude tendría que adivinar.",
    diagCheck: "Comprobar diagnóstico",
    diagOk:
      "Diagnóstico correcto: falta el objetivo (el tema «ventas» no dice para qué sirve el informe), y también la audiencia, el formato, el tono y los límites.",
    diagBad:
      "Revisa de nuevo. «Ventas» es el tema, no el objetivo: el pedido no dice para qué sirve el informe, para quién es, en qué formato, con qué tono ni con qué límites.",
    diagCorrect: ["obj", "aud", "fmt", "tone", "lim"],
    flowSteps: [
      {
        t: "Lee todo lo que escribes",
        d: "Claude toma las instrucciones, los archivos y tu pedido como un solo texto. Lo que no está escrito, para él no existe.",
      },
      {
        t: "Separa tarea, contexto y ejemplos",
        d: "Identifica qué debe hacer, qué información tiene como referencia y qué ejemplo debe imitar. Si el pedido no distingue estas partes, la tarea queda borrosa.",
      },
      {
        t: "Elige la respuesta más probable",
        d: "Genera el texto palabra por palabra, eligiendo lo que mejor encaja con todo lo que leyó. Si el pedido es genérico, la respuesta más probable también es genérica.",
      },
      {
        t: "Te entrega un borrador",
        d: "La primera respuesta es un punto de partida. Cada corrección que pides es una nueva instrucción, y con cada una el resultado se afina.",
      },
    ],
    iterations: [
      {
        text: "Escribe un correo a mis clientes.",
        note: "Pedido original. No dice ni de qué trata ni para quién.",
        result: "Un correo general que podría servir para cualquiera.",
      },
      {
        text: "Escribe un correo a mis alumnos sobre el nuevo horario.",
        note: "Agrega el tema y la audiencia. Ya no adivina de qué trata, aunque aún no dice para qué sirve.",
        result: "Un correo claro, pero sin tono ni extensión definidos.",
      },
      {
        text: "Escribe un correo a mis alumnos adultos sobre el nuevo horario, de unas 120 palabras, con tono cercano.",
        note: "Agrega formato y tono. Ahora controla la forma.",
        result:
          "Bien escrito, pero puede prometer fechas que no has confirmado.",
      },
      {
        text: "Eres asistente de una escuela de idiomas. Escribe un correo a mis alumnos adultos sobre el nuevo horario, de unas 120 palabras, tono cercano. No prometas fechas sin confirmar; si falta un dato, pregúntame antes de escribir.",
        note: "Agrega rol y un límite con una acción: pedir el dato. Así evita inventar.",
        result: "Listo para revisar. Lo que queda es tu verificación.",
      },
    ],
    compare: {
      title: "Practica: compara dos resultados",
      weak: "Escribe un correo a mis clientes.",
      strongLabel: "Pedido completo",
      strong:
        "Eres asistente de una escuela de idiomas. Escribe un correo breve a mis alumnos adultos sobre el nuevo horario, tono cercano. Si falta un dato, déjalo entre corchetes y avísame.",
      a: "Estimado cliente: le escribimos para informarle sobre cambios en nuestros servicios. Agradecemos su confianza y quedamos atentos a cualquier consulta.",
      b: "Hola, somos la escuela de idiomas. Te escribimos porque el horario de tus clases va a cambiar. El nuevo horario empieza el [día] a las [hora]. Si tienes dudas sobre tu grupo, escríbenos.\n\nNota: faltan el día y la hora. Confírmalos antes de enviar.",
      ask: "¿Cuál enviarías a tus alumnos?",
      whyA: "Es el resultado del pedido vago: sirve para cualquiera y no dice qué cambió ni para quién.",
      whyB: "Usa solo lo que le diste, deja entre corchetes el [día] y la [hora] y te avisa qué falta, como pediste.",
      chooseA: "Enviaría A",
      chooseB: "Enviaría B",
      done: "Ya comparaste: un pedido completo produce un resultado que puedes usar, sin datos inventados.",
    },
  },
  en: {
    outputsTitle: "What the result looks like for your request",
    outputs: [
      "A generic email anyone could send. It does not show who it is from or who it is for.",
      "A well-written email, but the reader does not know who it is for or what they should do.",
      "A clear email, with tone and length, but it may promise dates you have not confirmed.",
      "An email ready to review, with your tone and a limit that reduces made-up data.",
    ],
    diagTitle: "Diagnosis: what is missing from this request?",
    diagWeak: "Write a report on the quarter's sales.",
    diagHint:
      "Mark every part that is missing. Then compare with what Claude would have to guess.",
    diagCheck: "Check diagnosis",
    diagOk:
      "Correct: the goal is missing ('sales' is the topic, not what the report is for), and so are the audience, format, tone and limits.",
    diagBad:
      "Look again. 'Sales' is the topic, not the goal: the request does not say what the report is for, who it is for, its format, tone or limits.",
    diagCorrect: ["obj", "aud", "fmt", "tone", "lim"],
    flowSteps: [
      {
        t: "It reads everything you write",
        d: "Claude takes the instructions, files and your request as one text. What is not written does not exist for it.",
      },
      {
        t: "It separates task, context and examples",
        d: "It works out what to do, what information is reference and which example to imitate. If the request does not separate these, the task is blurry.",
      },
      {
        t: "It picks the most likely answer",
        d: "It generates the text word by word, choosing what best fits everything it read. A generic request leads to a generic answer.",
      },
      {
        t: "It gives you a draft",
        d: "The first answer is a starting point. Each correction you ask for is a new instruction, and with each one the result improves.",
      },
    ],
    iterations: [
      {
        text: "Write an email to my customers.",
        note: "Original request. It does not say what it is about or for whom.",
        result: "A general email that could fit anyone.",
      },
      {
        text: "Write an email to my students about the new schedule.",
        note: "Adds the topic and the audience. It no longer guesses the subject, but it still does not say what it is for.",
        result: "A clear email, but without a defined tone or length.",
      },
      {
        text: "Write an email to my adult students about the new schedule, about 120 words, with a warm tone.",
        note: "Adds format and tone. Now it controls the form.",
        result:
          "Well written, but it may promise dates you have not confirmed.",
      },
      {
        text: "You are an assistant at a language school. Write an email to my adult students about the new schedule, about 120 words, warm tone. Do not promise unconfirmed dates; if a detail is missing, ask me before writing.",
        note: "Adds a role and a limit with an action: asking for the detail. This stops it from inventing.",
        result: "Ready to review. What remains is your verification.",
      },
    ],
    compare: {
      title: "Practice: compare two results",
      weak: "Write an email to my customers.",
      strongLabel: "Complete request",
      strong:
        "You are an assistant at a language school. Write a short email to my adult students about the new schedule, warm tone. If a detail is missing, leave it in brackets and tell me.",
      a: "Dear customer: we are writing to inform you about changes to our services. We appreciate your trust and remain at your disposal for any question.",
      b: "Hi, we are the language school. Your class schedule is going to change. The new schedule starts on [day] at [time]. If you have questions about your group, write to us.\n\nNote: the day and time are missing. Confirm them before sending.",
      ask: "Which one would you send to your students?",
      whyA: "It is the result of the vague request: it could fit anyone and does not say what changed or for whom.",
      whyB: "It uses only what you gave it, leaves [day] and [time] in brackets and tells you what is missing, as you asked.",
      chooseA: "I would send A",
      chooseB: "I would send B",
      done: "You compared: a complete request gives a result you can use, without invented data.",
    },
  },
  pt: {
    outputsTitle: "Como fica o resultado para o seu pedido",
    outputs: [
      "Um e-mail geral que qualquer pessoa poderia enviar. Não mostra de quem é nem para quem é.",
      "Um e-mail bem escrito, mas o leitor não sabe para quem é nem o que deve fazer.",
      "Um e-mail claro, com tom e extensão, mas pode prometer datas que você não confirmou.",
      "Um e-mail pronto para revisar, com o seu tom e um limite que reduz a invenção de dados.",
    ],
    diagTitle: "Diagnóstico: o que falta neste pedido?",
    diagWeak: "Faça um relatório sobre as vendas do trimestre.",
    diagHint:
      "Marque todas as partes que faltam. Depois compare com o que o Claude teria que adivinhar.",
    diagCheck: "Conferir diagnóstico",
    diagOk:
      "Correto: falta o objetivo («vendas» é o tema, não para que serve o relatório), além do público, do formato, do tom e dos limites.",
    diagBad:
      "Revise. «Vendas» é o tema, não o objetivo: o pedido não diz para que serve o relatório, para quem é, em que formato, com que tom nem com que limites.",
    diagCorrect: ["obj", "aud", "fmt", "tone", "lim"],
    flowSteps: [
      {
        t: "Ele lê tudo o que você escreve",
        d: "O Claude toma as instruções, os arquivos e o seu pedido como um único texto. O que não está escrito não existe para ele.",
      },
      {
        t: "Separa tarefa, contexto e exemplos",
        d: "Identifica o que deve fazer, qual informação é referência e qual exemplo deve imitar. Se o pedido não separa essas partes, a tarefa fica confusa.",
      },
      {
        t: "Escolhe a resposta mais provável",
        d: "Gera o texto palavra por palavra, escolhendo o que melhor combina com tudo o que leu. Um pedido genérico leva a uma resposta genérica.",
      },
      {
        t: "Entrega um rascunho",
        d: "A primeira resposta é um ponto de partida. Cada correção que você pede é uma nova instrução, e a cada uma o resultado melhora.",
      },
    ],
    iterations: [
      {
        text: "Escreva um e-mail para os meus clientes.",
        note: "Pedido original. Não diz do que trata nem para quem.",
        result: "Um e-mail geral que serviria para qualquer um.",
      },
      {
        text: "Escreva um e-mail para os meus alunos sobre o novo horário.",
        note: "Acrescenta o tema e o público. Já não adivinha o assunto, mas ainda não diz para que serve.",
        result: "Um e-mail claro, mas sem tom nem extensão definidos.",
      },
      {
        text: "Escreva um e-mail para os meus alunos adultos sobre o novo horário, com cerca de 120 palavras, tom cordial.",
        note: "Acrescenta formato e tom. Agora controla a forma.",
        result: "Bem escrito, mas pode prometer datas que você não confirmou.",
      },
      {
        text: "Você é assistente de uma escola de idiomas. Escreva um e-mail para os meus alunos adultos sobre o novo horário, com cerca de 120 palavras, tom cordial. Não prometa datas sem confirmar; se faltar um dado, pergunte antes de escrever.",
        note: "Acrescenta um papel e um limite com uma ação: pedir o dado. Assim ele deixa de inventar.",
        result: "Pronto para revisar. O que resta é a sua verificação.",
      },
    ],
    compare: {
      title: "Pratique: compare dois resultados",
      weak: "Escreva um e-mail para os meus clientes.",
      strongLabel: "Pedido completo",
      strong:
        "Você é assistente de uma escola de idiomas. Escreva um e-mail curto para os meus alunos adultos sobre o novo horário, com tom cordial. Se faltar um dado, deixe entre colchetes e me avise.",
      a: "Prezado cliente: escrevemos para informar sobre mudanças nos nossos serviços. Agradecemos a sua confiança e estamos à disposição para qualquer dúvida.",
      b: "Olá, somos a escola de idiomas. Seu horário de aulas vai mudar. O novo horário começa no [dia] às [hora]. Se tiver dúvidas sobre a sua turma, escreva para nós.\n\nNota: faltam o dia e a hora. Confirme-os antes de enviar.",
      ask: "Qual você enviaria aos seus alunos?",
      whyA: "É o resultado do pedido vago: serve para qualquer pessoa e não diz o que mudou nem para quem.",
      whyB: "Usa só o que você deu, deixa [dia] e [hora] entre colchetes e avisa o que falta, como você pediu.",
      chooseA: "Enviaria A",
      chooseB: "Enviaria B",
      done: "Você comparou: um pedido completo gera um resultado que você pode usar, sem dados inventados.",
    },
  },
};
