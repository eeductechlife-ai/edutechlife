// Contenido del OVA "El Primer Pedido" (Módulo 5). Tres idiomas, misma estructura.
export const FIRST_REQUEST_DATA = {
  es: {
    title: "El Primer Pedido",
    intro:
      "Claude responde a lo que lee. Aquí entenderás cómo procesa tu pedido, por qué un pedido vago produce un resultado genérico y cómo escribir uno que funcione a la primera.",
    stages: [
      "1 · Cómo funciona",
      "2 · Simulador",
      "3 · Mejora por capas",
      "4 · Practica",
      "5 · Tu pedido",
    ],
    next: "Siguiente",
    back: "Atrás",
    flowTitle: "Así procesa Claude tu pedido",
    flowStep: "Paso {n} de {total}",
    next2: "Siguiente paso",
    cards: [
      {
        t: "Solo ve lo que escribes",
        d: "No conoce tu empresa, tus clientes ni tu contexto si no se lo dices.",
      },
      {
        t: "Llena los vacíos",
        d: "Cuando falta un dato, lo supone. Esas suposiciones son las que hacen que un resultado salga genérico.",
      },
      {
        t: "Infiere lo que no dices",
        d: "Claude entiende la intención general, pero los detalles que no escribes los supone. Describe el resultado que quieres.",
      },
      {
        t: "Tiene una ventana de trabajo",
        d: "Solo puede tener en cuenta cierta cantidad de texto a la vez. En chats muy largos olvida detalles del inicio: resume y empieza de nuevo con el pedido clave.",
      },
      {
        t: "Los Proyectos guardan el contexto",
        d: "Instrucciones y archivos quedan disponibles en cada conversación del Proyecto, para no repetirlos. La memoria se revisa en Configuración > Memoria; el modo incógnito no guarda nada en memoria.",
      },
    ],
    simTitle: "Simulador: quita partes del pedido y mira qué supone Claude",
    simHint:
      "Activa o desactiva cada parte. Verás qué recibe Claude, qué tiene que adivinar y qué calidad es probable.",
    base: "Escribe un correo a mis clientes.",
    built: "Pedido que recibe Claude",
    assumeTitle: "Lo que Claude supone",
    noAssume: "No le falta nada. Claude tiene lo necesario para trabajar.",
    qualityTitle: "Calidad probable del resultado",
    quality: ["Genérico", "Poco útil", "Útil con cambios", "Listo para usar"],
    ready: "Pedido completo: 5 de 5 partes.",
    notReady: "Faltan {n} partes. Claude adivinará esos datos.",
    parts: [
      {
        key: "obj",
        label: "Objetivo",
        text: "Avisa del nuevo horario de clases.",
        assume: "Un correo genérico, sin propósito claro.",
      },
      {
        key: "aud",
        label: "Audiencia",
        text: "Para alumnos adultos.",
        assume: "Público general: no sabe a quién le escribes.",
      },
      {
        key: "fmt",
        label: "Formato",
        text: "Un correo de 120 palabras.",
        assume: "Una extensión que decide él solo.",
      },
      {
        key: "tone",
        label: "Tono",
        text: "Con tono cercano.",
        assume: "Tono neutro y formal.",
      },
      {
        key: "lim",
        label: "Límites",
        text: "No prometas fechas sin confirmar.",
        assume: "Puede inventar fechas o condiciones.",
      },
    ],
    iterTitle: "Mejora por capas: el mismo pedido, cuatro versiones",
    iterHint:
      "Pulsa 'Siguiente versión' y compara qué agrega cada cambio y qué resultado produce.",
    nextVersion: "Siguiente versión",
    resultLabel: "Resultado probable",
    quizTitle: "Practica: elige el pedido completo",
    quizCorrect: "Acertaste {correct} de {total}.",
    quizPassed: "Vas muy bien: distingues un pedido completo de uno vago.",
    quizFailed: "Revisa la explicación de cada opción. Necesitas 4 de 5.",
    why: "Por qué",
    weak: "Pedido original",
    seeResult: "Ver resultado",
    retry: "Reintentar",
    builderTitle: "Escribe tu primer pedido",
    builderHint:
      "Completa las cinco partes con tu propio trabajo. El texto se arma solo y puedes copiarlo para usarlo en Claude.",
    fields: [
      {
        key: "obj",
        label: "Objetivo",
        placeholder: "Qué quieres lograr con este resultado",
      },
      {
        key: "aud",
        label: "Audiencia",
        placeholder: "Quién lo va a leer o usar",
      },
      {
        key: "fmt",
        label: "Formato",
        placeholder: "Tipo de pieza, extensión o número de partes",
      },
      {
        key: "tone",
        label: "Tono",
        placeholder: "Cómo debe sonar: cercano, formal, directo",
      },
      {
        key: "lim",
        label: "Límites",
        placeholder: "Qué no debe incluir o prometer",
      },
    ],
    checkTitle: "Revisa tu pedido antes de usarlo",
    checks: [
      "Cada parte tiene al menos 3 palabras.",
      "Puedes verificar el resultado: sabes qué cifra, fecha o dato debe comprobar.",
      "Si falta un dato, pediste a Claude que pregunte antes de escribir.",
    ],
    output: "Tu pedido listo",
    copy: "Copiar pedido",
    copied: "Copiado",
    builderReady: "Listo: tu pedido tiene las cinco partes.",
    builderNotReady: "Completa las cinco partes (mínimo 3 palabras cada una).",
    done: "Ya sabes escribir un primer pedido completo.",
    levels: {
      beginner:
        "Inicial: ya conoces la idea. Antes de pedir, practica con un pedido completo cada vez.",
      competent:
        "Competente: armas pedidos de cinco partes y reconoces los que dejan cosas al azar.",
      expert:
        "Experto: diseñas el pedido, lo pruebas, mejoras por capas y revisas antes de usarlo.",
    },
    windowCard:
      "Puede perder el foco en conversaciones muy largas. Si el chat se alarga, resume lo importante y empieza uno nuevo con el pedido clave.",
  },
  en: {
    title: "The First Request",
    intro:
      "Claude responds to what it reads. Here you will understand how it processes your request, why a vague request gives a generic result, and how to write one that works the first time.",
    stages: [
      "1 · How it works",
      "2 · Simulator",
      "3 · Layered improvement",
      "4 · Practice",
      "5 · Your request",
    ],
    next: "Next",
    back: "Back",
    flowTitle: "How Claude processes your request",
    flowStep: "Step {n} of {total}",
    next2: "Next step",
    cards: [
      {
        t: "It only sees what you write",
        d: "It does not know your company, customers or context unless you tell it.",
      },
      {
        t: "It fills the gaps",
        d: "When a detail is missing, it assumes one. Those assumptions are what make a result generic.",
      },
      {
        t: "It infers what you leave out",
        d: "It understands the general intent, but the details you do not write, it assumes. Describe the result you want.",
      },
      {
        t: "It has a working window",
        d: "It can only consider a certain amount of text at once. In very long chats it forgets early details: summarize and start again with the key request.",
      },
      {
        t: "Projects keep the context",
        d: "Instructions and files stay available in every conversation of the Project, so you do not repeat them. Memory is reviewed in Settings > Memory; incognito chats are not saved to memory.",
      },
    ],
    simTitle:
      "Simulator: remove parts of the request and see what Claude assumes",
    simHint:
      "Turn each part on or off. You will see what Claude receives, what it has to guess and the likely quality.",
    base: "Write an email to my customers.",
    built: "Request Claude receives",
    assumeTitle: "What Claude assumes",
    noAssume: "Nothing is missing. Claude has what it needs to work.",
    qualityTitle: "Likely result quality",
    quality: [
      "Generic",
      "Not very useful",
      "Useful with changes",
      "Ready to use",
    ],
    ready: "Complete request: 5 of 5 parts.",
    notReady: "{n} parts are missing. Claude will guess those details.",
    parts: [
      {
        key: "obj",
        label: "Goal",
        text: "Announce the new class schedule.",
        assume: "A generic email with no clear purpose.",
      },
      {
        key: "aud",
        label: "Audience",
        text: "For adult students.",
        assume: "A general audience: it does not know who you are writing to.",
      },
      {
        key: "fmt",
        label: "Format",
        text: "A 120-word email.",
        assume: "A length it decides on its own.",
      },
      {
        key: "tone",
        label: "Tone",
        text: "With a warm tone.",
        assume: "A neutral, formal tone.",
      },
      {
        key: "lim",
        label: "Limits",
        text: "Do not promise dates that are not confirmed.",
        assume: "It may invent dates or conditions.",
      },
    ],
    iterTitle: "Layered improvement: the same request, four versions",
    iterHint:
      "Press 'Next version' and compare what each change adds and the result it produces.",
    nextVersion: "Next version",
    resultLabel: "Likely result",
    quizTitle: "Practice: choose the complete request",
    quizCorrect: "You got {correct} of {total}.",
    quizPassed: "Great: you can tell a complete request from a vague one.",
    quizFailed: "Review the explanation of each option. You need 4 of 5.",
    why: "Why",
    weak: "Original request",
    seeResult: "See result",
    retry: "Try again",
    builderTitle: "Write your first request",
    builderHint:
      "Complete the five parts with your own work. The text assembles itself and you can copy it to use in Claude.",
    fields: [
      {
        key: "obj",
        label: "Goal",
        placeholder: "What you want this result to achieve",
      },
      {
        key: "aud",
        label: "Audience",
        placeholder: "Who will read or use it",
      },
      {
        key: "fmt",
        label: "Format",
        placeholder: "Type of piece, length or number of parts",
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "How it should sound: warm, formal, direct",
      },
      {
        key: "lim",
        label: "Limits",
        placeholder: "What it must not include or promise",
      },
    ],
    checkTitle: "Check your request before using it",
    checks: [
      "Each part has at least 3 words.",
      "You can verify the result: you know which figure, date or fact to check.",
      "If a detail is missing, you asked Claude to ask before writing.",
    ],
    output: "Your request",
    copy: "Copy request",
    copied: "Copied",
    builderReady: "Ready: your request has all five parts.",
    builderNotReady: "Complete the five parts (at least 3 words each).",
    done: "You now know how to write a complete first request.",
    levels: {
      beginner:
        "Beginner: you know the idea. Before asking, practice with a complete request every time.",
      competent:
        "Competent: you build five-part requests and spot the ones that leave things to chance.",
      expert:
        "Expert: you design the request, test it, improve it in layers and review it before using it.",
    },
    windowCard:
      "It can lose focus in very long conversations. If a chat gets long, summarize the key points and start a new one with the key request.",
  },
  pt: {
    title: "O Primeiro Pedido",
    intro:
      "O Claude responde ao que lê. Aqui você vai entender como ele processa o seu pedido, por que um pedido vago gera um resultado genérico e como escrever um que funcione logo na primeira vez.",
    stages: [
      "1 · Como funciona",
      "2 · Simulador",
      "3 · Melhoria em camadas",
      "4 · Pratique",
      "5 · Seu pedido",
    ],
    next: "Próximo",
    back: "Voltar",
    flowTitle: "Como o Claude processa o seu pedido",
    flowStep: "Passo {n} de {total}",
    next2: "Próximo passo",
    cards: [
      {
        t: "Ele só vê o que você escreve",
        d: "Não conhece a sua empresa, os seus clientes nem o seu contexto, a menos que você diga.",
      },
      {
        t: "Ele preenche as lacunas",
        d: "Quando falta um dado, ele supõe. Essas suposições é que deixam o resultado genérico.",
      },
      {
        t: "Ele infere o que você não diz",
        d: "O Claude entende a intenção geral, mas os detalhes que você não escreve ele supõe. Descreva o resultado que quer.",
      },
      {
        t: "Ele tem uma janela de trabalho",
        d: "Só consegue considerar certa quantidade de texto de cada vez. Em conversas muito longas esquece detalhes do início: resuma e recomece com o pedido principal.",
      },
      {
        t: "Os Projetos guardam o contexto",
        d: "Instruções e arquivos ficam disponíveis em todas as conversas do Projeto, para você não repeti-los. A memória se revisa em Configurações > Memória; o modo incógnito não salva nada na memória.",
      },
    ],
    simTitle: "Simulador: tire partes do pedido e veja o que o Claude supõe",
    simHint:
      "Ligue ou desligue cada parte. Você verá o que o Claude recebe, o que precisa adivinhar e a qualidade provável.",
    base: "Escreva um e-mail para os meus clientes.",
    built: "Pedido que o Claude recebe",
    assumeTitle: "O que o Claude supõe",
    noAssume: "Nada está faltando. O Claude tem o necessário para trabalhar.",
    qualityTitle: "Qualidade provável do resultado",
    quality: ["Genérico", "Pouco útil", "Útil com ajustes", "Pronto para usar"],
    ready: "Pedido completo: 5 de 5 partes.",
    notReady: "Faltam {n} partes. O Claude vai adivinhar esses dados.",
    parts: [
      {
        key: "obj",
        label: "Objetivo",
        text: "Avise sobre o novo horário das aulas.",
        assume: "Um e-mail genérico, sem propósito claro.",
      },
      {
        key: "aud",
        label: "Público",
        text: "Para alunos adultos.",
        assume: "Público geral: não sabe para quem você escreve.",
      },
      {
        key: "fmt",
        label: "Formato",
        text: "Um e-mail de 120 palavras.",
        assume: "Uma extensão que ele decide sozinho.",
      },
      {
        key: "tone",
        label: "Tom",
        text: "Com tom cordial.",
        assume: "Tom neutro e formal.",
      },
      {
        key: "lim",
        label: "Limites",
        text: "Não prometa datas sem confirmar.",
        assume: "Pode inventar datas ou condições.",
      },
    ],
    iterTitle: "Melhoria em camadas: o mesmo pedido, quatro versões",
    iterHint:
      "Clique em 'Próxima versão' e compare o que cada mudança acrescenta e o resultado que produz.",
    nextVersion: "Próxima versão",
    resultLabel: "Resultado provável",
    quizTitle: "Pratique: escolha o pedido completo",
    quizCorrect: "Você acertou {correct} de {total}.",
    quizPassed:
      "Você está indo muito bem: distingue um pedido completo de um vago.",
    quizFailed: "Revise a explicação de cada opção. São necessárias 4 de 5.",
    why: "Por quê",
    weak: "Pedido original",
    seeResult: "Ver resultado",
    retry: "Tentar de novo",
    builderTitle: "Escreva o seu primeiro pedido",
    builderHint:
      "Complete as cinco partes com o seu próprio trabalho. O texto se monta sozinho e você pode copiá-lo para usar no Claude.",
    fields: [
      {
        key: "obj",
        label: "Objetivo",
        placeholder: "O que você quer alcançar com este resultado",
      },
      {
        key: "aud",
        label: "Público",
        placeholder: "Quem vai ler ou usar",
      },
      {
        key: "fmt",
        label: "Formato",
        placeholder: "Tipo de peça, extensão ou número de partes",
      },
      {
        key: "tone",
        label: "Tom",
        placeholder: "Como deve soar: cordial, formal, direto",
      },
      {
        key: "lim",
        label: "Limites",
        placeholder: "O que não deve incluir ou prometer",
      },
    ],
    checkTitle: "Revise o seu pedido antes de usar",
    checks: [
      "Cada parte tem pelo menos 3 palavras.",
      "Você consegue verificar o resultado: sabe qual número, data ou fato conferir.",
      "Se faltar um dado, você pediu ao Claude para perguntar antes de escrever.",
    ],
    output: "Seu pedido pronto",
    copy: "Copiar pedido",
    copied: "Copiado",
    builderReady: "Pronto: o seu pedido tem as cinco partes.",
    builderNotReady: "Complete as cinco partes (no mínimo 3 palavras cada).",
    done: "Você já sabe escrever um primeiro pedido completo.",
    levels: {
      beginner:
        "Inicial: você conhece a ideia. Antes de pedir, pratique com um pedido completo sempre.",
      competent:
        "Competente: você monta pedidos de cinco partes e percebe os que deixam coisas ao acaso.",
      expert:
        "Especialista: você desenha o pedido, testa, melhora por camadas e revisa antes de usar.",
    },
    windowCard:
      "Ele pode perder o foco em conversas muito longas. Se o chat ficar extenso, resuma o essencial e comece outro com o pedido principal.",
  },
};
