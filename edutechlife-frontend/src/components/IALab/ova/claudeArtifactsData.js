// Contenido del OVA "El Taller de Artifacts" (Módulo 5). Tres idiomas, misma estructura.
export const ARTIFACTS_DATA = {
  es: {
    title: "El Taller de Artifacts",
    intro:
      "Un Artifact es una pieza que Claude crea al lado del chat. Aquí aprenderás qué pieza pedir, cómo armar el pedido, cómo mejorarla con cambios pequeños y cómo revisarla antes de compartirla.",
    stages: [
      "1 · Qué es",
      "2 · Arma el pedido",
      "3 · Mejora por cambios",
      "4 · Practica",
      "5 · Revisa",
    ],
    next: "Siguiente",
    back: "Atrás",
    typeHint: "Elige una pieza para ver qué pedir y qué recibirás.",
    typeLabels: {
      use: "Sirve para",
      example: "Pedido de ejemplo",
      gets: "Lo que recibes",
    },
    cards: [
      {
        t: "Vive al lado del chat",
        d: "Ves la pieza mientras conversas y puedes pedir cambios sin perder el hilo.",
      },
      {
        t: "Se mejora por partes",
        d: "No hace falta empezar de cero: cada cambio pequeño afina la versión anterior.",
      },
      {
        t: "El tipo de pieza va en el pedido",
        d: "Si no dices si quieres un documento, una tabla o una app, Claude elige por ti.",
      },
    ],
    briefTitle: "Arma tu pedido con las cinco partes",
    briefHint:
      "Escribe cada parte con tus palabras o pulsa 'Ver ejemplo' para ver un pedido completo.",
    example: "Ver ejemplo",
    preview: "Así queda tu pedido",
    quality: [
      "Incompleto",
      "En construcción",
      "Casi listo",
      "Listo para pedir",
    ],
    qualityLabel: "Estado del pedido",
    missing: "Te falta completar",
    parts: [
      {
        key: "obj",
        label: "Objetivo",
        hint: "Qué debe lograr la pieza.",
        placeholder: "Explicar cómo usar la plataforma a docentes nuevos.",
        sample: "Explicar cómo usar la plataforma a docentes nuevos.",
      },
      {
        key: "aud",
        label: "Audiencia",
        hint: "Quién la va a leer o usar.",
        placeholder: "Docentes sin experiencia técnica.",
        sample: "Docentes sin experiencia técnica, de colegios públicos.",
      },
      {
        key: "fmt",
        label: "Formato",
        hint: "Tipo de pieza, extensión y estructura.",
        placeholder: "Documento de 2 páginas con títulos y pasos.",
        sample: "Documento de 2 páginas con títulos y una lista de pasos.",
      },
      {
        key: "tone",
        label: "Tono",
        hint: "Cómo debe sonar.",
        placeholder: "Cercano y claro, sin tecnicismos.",
        sample: "Cercano y claro, sin tecnicismos.",
      },
      {
        key: "lim",
        label: "Límites",
        hint: "Qué no debe incluir o prometer.",
        placeholder: "No incluir precios ni datos de clientes.",
        sample: "No incluir precios ni datos de clientes.",
      },
    ],
    changesTitle: "Mejora un Artifact con cambios pequeños",
    changesHint:
      "Este es el borrador de Claude. Elige un cambio, compara antes y después, y lee la lección que deja.",
    draft:
      "Guía de uso:\n1. Crea tu cuenta.\n2. Elige un curso.\n3. Revisa tu progreso.",
    beforeLabel: "Antes",
    afterLabel: "Después",
    historyLabel: "Cambios probados",
    ruleTitle: "Regla de oro",
    rule: "Pide un cambio a la vez. Si cambias tres cosas, no sabrás cuál mejoró la pieza.",
    quizTitle: "Practica: elige la mejor respuesta",
    quizCorrect: "Acertaste {correct} de {total}.",
    quizPassed: "Vas muy bien: ya sabes pedir y mejorar un Artifact.",
    quizFailed: "Revisa la explicación de cada opción. Necesitas 3 de 4.",
    why: "Por qué",
    seeResult: "Ver resultado",
    retry: "Reintentar",
    reviewTitle: "Revisa antes de compartir",
    reviewHint: "Marca cada punto cuando lo hayas cumplido.",
    checks: [
      "Revisé cada cifra o dato con su fuente.",
      "El tono y el público son los que quería.",
      "Quité datos personales o confidenciales.",
      "Pedí un cambio a la vez y comparé versiones.",
      "Lo leí completo, como lo leerá quien lo recibe.",
    ],
    output: "Tu pedido listo para Claude",
    copy: "Copiar pedido",
    copied: "Copiado",
    done: "Ya dominas el taller: pide con claridad, mejora por partes y revisa antes de compartir.",
    notComplete:
      "Completa el pedido, aprueba el quiz y marca la revisión para terminar.",
    exportTitle: "Exportar y compartir con criterio",
    exportText:
      "Claude puede crear archivos Word (.docx), Excel (.xlsx), PowerPoint (.pptx) y PDF. Pídelo con el formato exacto: «Crea esto como un .docx editable». Si no aparece, revisa la configuración de capacidades de tu cuenta.",
    shareRules: [
      "Para compartir: botón Compartir > «Quién tiene acceso».",
      "En planes Pro y Max: solo tú o cualquiera con el enlace. En Team y Enterprise: solo personas invitadas u organización; «cualquiera con el enlace» lo activa un propietario.",
      "Nunca compartas con «cualquiera con el enlace» un documento con datos de estudiantes.",
      "Al compartir, también se expone lo que está adjunto a la conversación.",
    ],
    levels: {
      beginner:
        "Inicial: sabes qué pieza pedir. Practica un pedido completo y una mejora antes de compartir.",
      competent:
        "Competente: pides, mejoras por partes y verificas las cifras.",
      expert:
        "Experto: diseñas el pedido, mejoras por cambios, verificas y exportas o compartes con criterio.",
    },
    weak: "Situación",
  },
  en: {
    title: "The Artifacts Workshop",
    intro:
      "An Artifact is a piece Claude creates next to the chat. Here you will learn which piece to ask for, how to build the request, how to improve it with small changes and how to review it before sharing.",
    stages: [
      "1 · What it is",
      "2 · Build the request",
      "3 · Improve by changes",
      "4 · Practice",
      "5 · Review",
    ],
    next: "Next",
    back: "Back",
    typeHint: "Pick a piece to see what to ask for and what you will get.",
    typeLabels: {
      use: "Good for",
      example: "Example request",
      gets: "What you get",
    },
    cards: [
      {
        t: "It lives next to the chat",
        d: "You see the piece while you talk and can ask for changes without losing the thread.",
      },
      {
        t: "It improves in parts",
        d: "You do not start from scratch: each small change refines the previous version.",
      },
      {
        t: "The piece type goes in the request",
        d: "If you do not say whether you want a document, a table or an app, Claude chooses for you.",
      },
    ],
    briefTitle: "Build your request with the five parts",
    briefHint:
      "Write each part in your own words, or press 'See example' to see a complete request.",
    example: "See example",
    preview: "This is how your request reads",
    quality: ["Incomplete", "In progress", "Almost ready", "Ready to ask"],
    qualityLabel: "Request status",
    missing: "Still missing",
    parts: [
      {
        key: "obj",
        label: "Goal",
        hint: "What the piece must achieve.",
        placeholder: "Explain how to use the platform to new teachers.",
        sample: "Explain how to use the platform to new teachers.",
      },
      {
        key: "aud",
        label: "Audience",
        hint: "Who will read or use it.",
        placeholder: "Teachers with no technical experience.",
        sample: "Teachers with no technical experience, from public schools.",
      },
      {
        key: "fmt",
        label: "Format",
        hint: "Type of piece, length and structure.",
        placeholder: "2-page document with titles and steps.",
        sample: "A 2-page document with titles and a list of steps.",
      },
      {
        key: "tone",
        label: "Tone",
        hint: "How it should sound.",
        placeholder: "Warm and clear, no jargon.",
        sample: "Warm and clear, no jargon.",
      },
      {
        key: "lim",
        label: "Limits",
        hint: "What it must not include or promise.",
        placeholder: "Do not include prices or customer data.",
        sample: "Do not include prices or customer data.",
      },
    ],
    changesTitle: "Improve an Artifact with small changes",
    changesHint:
      "This is Claude's draft. Pick a change, compare before and after, and read the lesson it leaves.",
    draft:
      "Usage guide:\n1. Create your account.\n2. Choose a course.\n3. Check your progress.",
    beforeLabel: "Before",
    afterLabel: "After",
    historyLabel: "Changes tried",
    ruleTitle: "Golden rule",
    rule: "Ask for one change at a time. If you change three things, you will not know which one improved the piece.",
    quizTitle: "Practice: choose the best answer",
    quizCorrect: "You got {correct} of {total}.",
    quizPassed: "Great: you know how to ask for and improve an Artifact.",
    quizFailed: "Review the explanation of each option. You need 3 of 4.",
    why: "Why",
    seeResult: "See result",
    retry: "Try again",
    reviewTitle: "Review before sharing",
    reviewHint: "Tick each point once you have met it.",
    checks: [
      "I checked every figure or fact against its source.",
      "The tone and audience are the ones I wanted.",
      "I removed personal or confidential data.",
      "I asked for one change at a time and compared versions.",
      "I read it in full, as the recipient will read it.",
    ],
    output: "Your request, ready for Claude",
    copy: "Copy request",
    copied: "Copied",
    done: "You have mastered the workshop: ask clearly, improve in parts and review before sharing.",
    notComplete:
      "Complete the request, pass the quiz and tick the review to finish.",
    exportTitle: "Export and share with judgment",
    exportText:
      "Claude can create Word (.docx), Excel (.xlsx), PowerPoint (.pptx) and PDF files. Ask for the exact format: 'Create this as an editable .docx'. If it does not show up, check the capabilities settings of your account.",
    shareRules: [
      "To share: Share button > 'Who has access'.",
      "On Pro and Max: only you or anyone with the link. On Team and Enterprise: only invited people or your organization; 'anyone with the link' must be enabled by an owner.",
      "Never share a document with student data as 'anyone with the link'.",
      "When you share, anything attached to the conversation is exposed too.",
    ],
    levels: {
      beginner:
        "Beginner: you know which piece to ask for. Practice one complete request and one improvement before sharing.",
      competent: "Competent: you ask, improve in parts and verify figures.",
      expert:
        "Expert: you design the request, improve by changes, verify and export or share with judgment.",
    },
    weak: "Situation",
  },
  pt: {
    title: "A Oficina de Artifacts",
    intro:
      "Um Artifact é uma peça que o Claude cria ao lado do chat. Aqui você vai aprender qual peça pedir, como montar o pedido, como melhorá-la com pequenas mudanças e como revisá-la antes de compartilhar.",
    stages: [
      "1 · O que é",
      "2 · Monte o pedido",
      "3 · Melhore com mudanças",
      "4 · Pratique",
      "5 · Revise",
    ],
    next: "Próximo",
    back: "Voltar",
    typeHint: "Escolha uma peça para ver o que pedir e o que você vai receber.",
    typeLabels: {
      use: "Serve para",
      example: "Pedido de exemplo",
      gets: "O que você recebe",
    },
    cards: [
      {
        t: "Ele fica ao lado do chat",
        d: "Você vê a peça enquanto conversa e pode pedir mudanças sem perder o fio da conversa.",
      },
      {
        t: "Melhora por partes",
        d: "Não é preciso começar do zero: cada pequena mudança refina a versão anterior.",
      },
      {
        t: "O tipo de peça vai no pedido",
        d: "Se você não disser se quer um documento, uma tabela ou um app, o Claude escolhe por você.",
      },
    ],
    briefTitle: "Monte o seu pedido com as cinco partes",
    briefHint:
      "Escreva cada parte com as suas palavras, ou clique em 'Ver exemplo' para ver um pedido completo.",
    example: "Ver exemplo",
    preview: "Assim fica o seu pedido",
    quality: [
      "Incompleto",
      "Em construção",
      "Quase pronto",
      "Pronto para pedir",
    ],
    qualityLabel: "Estado do pedido",
    missing: "Falta completar",
    parts: [
      {
        key: "obj",
        label: "Objetivo",
        hint: "O que a peça deve alcançar.",
        placeholder: "Explicar como usar a plataforma para professores novos.",
        sample: "Explicar como usar a plataforma para professores novos.",
      },
      {
        key: "aud",
        label: "Público",
        hint: "Quem vai ler ou usar.",
        placeholder: "Professores sem experiência técnica.",
        sample: "Professores sem experiência técnica, de escolas públicas.",
      },
      {
        key: "fmt",
        label: "Formato",
        hint: "Tipo de peça, extensão e estrutura.",
        placeholder: "Documento de 2 páginas com títulos e passos.",
        sample: "Documento de 2 páginas com títulos e uma lista de passos.",
      },
      {
        key: "tone",
        label: "Tom",
        hint: "Como deve soar.",
        placeholder: "Cordial e claro, sem jargão.",
        sample: "Cordial e claro, sem jargão.",
      },
      {
        key: "lim",
        label: "Limites",
        hint: "O que não deve incluir ou prometer.",
        placeholder: "Não incluir preços nem dados de clientes.",
        sample: "Não incluir preços nem dados de clientes.",
      },
    ],
    changesTitle: "Melhore um Artifact com pequenas mudanças",
    changesHint:
      "Este é o rascunho do Claude. Escolha uma mudança, compare antes e depois e leia a lição que ela deixa.",
    draft:
      "Guia de uso:\n1. Crie a sua conta.\n2. Escolha um curso.\n3. Acompanhe o seu progresso.",
    beforeLabel: "Antes",
    afterLabel: "Depois",
    historyLabel: "Mudanças testadas",
    ruleTitle: "Regra de ouro",
    rule: "Peça uma mudança de cada vez. Se mudar três coisas, você não saberá qual melhorou a peça.",
    quizTitle: "Pratique: escolha a melhor resposta",
    quizCorrect: "Você acertou {correct} de {total}.",
    quizPassed:
      "Você está indo muito bem: já sabe pedir e melhorar um Artifact.",
    quizFailed: "Revise a explicação de cada opção. São necessárias 3 de 4.",
    why: "Por quê",
    seeResult: "Ver resultado",
    retry: "Tentar de novo",
    reviewTitle: "Revise antes de compartilhar",
    reviewHint: "Marque cada ponto quando tiver cumprido.",
    checks: [
      "Conferi cada número ou dado com a fonte.",
      "O tom e o público são os que eu queria.",
      "Retirei dados pessoais ou confidenciais.",
      "Pedi uma mudança de cada vez e comparei versões.",
      "Li tudo, como vai ler quem vai receber.",
    ],
    output: "Seu pedido pronto para o Claude",
    copy: "Copiar pedido",
    copied: "Copiado",
    done: "Você domina a oficina: peça com clareza, melhore por partes e revise antes de compartilhar.",
    notComplete:
      "Complete o pedido, aprove o quiz e marque a revisão para terminar.",
    exportTitle: "Exportar e compartilhar com critério",
    exportText:
      "O Claude pode criar arquivos Word (.docx), Excel (.xlsx), PowerPoint (.pptx) e PDF. Peça com o formato exato: «Crie isto como um .docx editável». Se não aparecer, confira as configurações de recursos da sua conta.",
    shareRules: [
      "Para compartilhar: botão Compartilhar > «Quem tem acesso».",
      "Nos planos Pro e Max: só você ou qualquer pessoa com o link. Em Team e Enterprise: só pessoas convidadas ou a organização; «qualquer pessoa com o link» é ativado por um proprietário.",
      "Nunca compartilhe com «qualquer pessoa com o link» um documento com dados de estudantes.",
      "Ao compartilhar, também fica exposto o que está anexado à conversa.",
    ],
    levels: {
      beginner:
        "Inicial: você sabe qual peça pedir. Pratique um pedido completo e uma melhoria antes de compartilhar.",
      competent:
        "Competente: você pede, melhora por partes e confere os números.",
      expert:
        "Especialista: você desenha o pedido, melhora por mudanças, verifica e exporta ou compartilha com critério.",
    },
    weak: "Situação",
  },
};
