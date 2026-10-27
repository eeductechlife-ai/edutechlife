// Conceptos clave de los OVA del Módulo 5. Cada concepto: qué es, un ejemplo y por qué importa.
// icon = nombre de un ícono de lucide-react (ver ConceptCards.jsx).
export const CONCEPTS = {
  first: {
    es: {
      title: "Conceptos clave antes de empezar",
      items: [
        {
          t: "Contexto",
          icon: "Layers",
          what: "Todo lo que Claude sabe de tu caso: lo que escribes, los archivos y las instrucciones.",
          example:
            "Si no lo escribes en el chat, Claude no lo sabe, salvo que esté en un Proyecto o en la memoria.",
          why: "Sin contexto, el resultado sale genérico.",
        },
        {
          t: "Instrucción e intención",
          icon: "MessageSquare",
          what: "La instrucción es lo que escribes; la intención es lo que quieres lograr.",
          example: "«Haz un resumen» no dice para quién ni para qué.",
          why: "Describe el resultado, no solo la tarea.",
        },
        {
          t: "Suposición",
          icon: "Brain",
          what: "Lo que Claude completa cuando no le das un dato.",
          example: "Si no dices el tono, asume uno formal y neutro.",
          why: "Cada suposición es una decisión que no tomaste tú.",
        },
        {
          t: "Ventana de trabajo",
          icon: "Clock",
          what: "Cantidad de texto que Claude puede tener en cuenta a la vez.",
          example: "En un chat muy largo, lo del inicio pierde peso.",
          why: "Si el chat se alarga, resume y empieza uno nuevo con el pedido clave.",
        },
        {
          t: "Proyecto, memoria e incógnito",
          icon: "Bookmark",
          what: "Tres formas de manejar el contexto: un Proyecto guarda instrucciones y archivos; la memoria recuerda datos entre chats; un chat de incógnito no usa ni guarda memoria.",
          example:
            "Tu marca va en un Proyecto; tu preferencia de tono, en la memoria.",
          why: "Elegir la correcta evita repetir y evita arrastrar contexto viejo.",
        },
        {
          t: "Elegir modelo",
          icon: "Scale",
          what: "En el selector de modelo eliges entre modelos más potentes, para tareas complejas, y más rápidos, para tareas simples. Las opciones dependen de tu plan.",
          example:
            "Para ordenar 50 ideas basta uno rápido; para analizar un contrato largo conviene uno más potente.",
          why: "Elegir bien ahorra tiempo y mejora las respuestas en lo difícil.",
        },
      ],
    },
    en: {
      title: "Key concepts before you start",
      items: [
        {
          t: "Context",
          icon: "Layers",
          what: "Everything Claude knows about your case: what you write, the files and the instructions.",
          example:
            "If you do not write it in the chat, Claude does not know it, unless it is in a Project or in memory.",
          why: "Without context, the result comes out generic.",
        },
        {
          t: "Instruction and intention",
          icon: "MessageSquare",
          what: "The instruction is what you write; the intention is what you want to achieve.",
          example: "'Make a summary' does not say for whom or for what.",
          why: "Describe the result, not just the task.",
        },
        {
          t: "Assumption",
          icon: "Brain",
          what: "What Claude fills in when you do not give it a detail.",
          example:
            "If you do not state the tone, it assumes a formal, neutral one.",
          why: "Every assumption is a decision you did not make.",
        },
        {
          t: "Working window",
          icon: "Clock",
          what: "How much text Claude can keep in mind at once.",
          example: "In a very long chat, what came at the start loses weight.",
          why: "If the chat gets long, summarize and start a new one with the key request.",
        },
        {
          t: "Project, memory and incognito",
          icon: "Bookmark",
          what: "Three ways to handle context: a Project stores instructions and files; memory remembers details across chats; an incognito chat neither uses nor saves memory.",
          example:
            "Your brand goes in a Project; your tone preference, in memory.",
          why: "Choosing the right one avoids repeating yourself and avoids carrying old context.",
        },
        {
          t: "Choosing a model",
          icon: "Scale",
          what: "In the model selector you choose between more powerful models, for complex tasks, and faster ones, for simple tasks. The options depend on your plan.",
          example:
            "To sort 50 ideas a fast one is enough; to analyze a long contract a more powerful one is better.",
          why: "Choosing well saves time and improves answers on hard tasks.",
        },
      ],
    },
    pt: {
      title: "Conceitos-chave antes de começar",
      items: [
        {
          t: "Contexto",
          icon: "Layers",
          what: "Tudo o que o Claude sabe sobre o seu caso: o que você escreve, os arquivos e as instruções.",
          example:
            "Se você não escrever no chat, o Claude não sabe, a menos que esteja em um Projeto ou na memória.",
          why: "Sem contexto, o resultado sai genérico.",
        },
        {
          t: "Instrução e intenção",
          icon: "MessageSquare",
          what: "A instrução é o que você escreve; a intenção é o que você quer alcançar.",
          example: "«Faça um resumo» não diz para quem nem para quê.",
          why: "Descreva o resultado, não só a tarefa.",
        },
        {
          t: "Suposição",
          icon: "Brain",
          what: "O que o Claude completa quando você não dá um dado.",
          example: "Se você não disser o tom, ele assume um formal e neutro.",
          why: "Cada suposição é uma decisão que você não tomou.",
        },
        {
          t: "Janela de trabalho",
          icon: "Clock",
          what: "Quanto texto o Claude consegue considerar ao mesmo tempo.",
          example: "Em um chat muito longo, o que está no início perde peso.",
          why: "Se o chat ficar longo, resuma e comece outro com o pedido principal.",
        },
        {
          t: "Projeto, memória e incógnito",
          icon: "Bookmark",
          what: "Três formas de lidar com o contexto: um Projeto guarda instruções e arquivos; a memória lembra dados entre chats; um chat incógnito não usa nem salva memória.",
          example:
            "A sua marca vai em um Projeto; a sua preferência de tom, na memória.",
          why: "Escolher a certa evita repetir e evita carregar contexto antigo.",
        },
        {
          t: "Escolher o modelo",
          icon: "Scale",
          what: "No seletor de modelo você escolhe entre modelos mais potentes, para tarefas complexas, e mais rápidos, para tarefas simples. As opções dependem do seu plano.",
          example:
            "Para organizar 50 ideias basta um rápido; para analisar um contrato longo convém um mais potente.",
          why: "Escolher bem economiza tempo e melhora as respostas nas tarefas difíceis.",
        },
      ],
    },
  },
  artifacts: {
    es: {
      title: "Conceptos clave antes de empezar",
      items: [
        {
          t: "Artifact",
          icon: "Box",
          what: "Pieza que Claude crea junto al chat para que la veas, edites y compartas.",
          example:
            "Una guía de 2 páginas que puedes ajustar sin copiar y pegar.",
          why: "Iteras sobre la misma pieza en lugar de empezar de cero.",
        },
        {
          t: "Versión",
          icon: "GitBranch",
          what: "Cada cambio deja la pieza distinta; compara el antes y el después para saber qué funcionó.",
          example:
            "Pides acortar y la guía queda más corta; comparas con la anterior.",
          why: "Comparar revela qué cambio mejoró la pieza.",
        },
        {
          t: "Alucinación",
          icon: "AlertTriangle",
          what: "Cuando Claude escribe algo falso con un tono muy seguro.",
          example: "Una cifra o una cita que no existe en la fuente.",
          why: "Por eso cada cifra se verifica antes de compartir.",
        },
        {
          t: "Exportar",
          icon: "FileDown",
          what: "Convertir la pieza en un archivo Word, Excel, PowerPoint o PDF.",
          example: "Pedir «como .docx editable».",
          why: "La pieza entra en tu flujo de trabajo.",
        },
        {
          t: "Permisos al compartir",
          icon: "Share2",
          what: "Quién puede ver o editar la pieza: solo tú, personas invitadas o cualquiera con el enlace.",
          example: "Un enlace público con datos de estudiantes es un riesgo.",
          why: "Compartir mal expone datos que no debían salir.",
        },
      ],
    },
    en: {
      title: "Key concepts before you start",
      items: [
        {
          t: "Artifact",
          icon: "Box",
          what: "A piece Claude creates next to the chat so you can see, edit and share it.",
          example: "A 2-page guide you can adjust without copy and paste.",
          why: "You iterate on the same piece instead of starting over.",
        },
        {
          t: "Version",
          icon: "GitBranch",
          what: "Each change makes the piece different; compare before and after to see what worked.",
          example:
            "You ask to shorten it and the guide gets shorter; you compare with the previous one.",
          why: "Comparing shows which change improved the piece.",
        },
        {
          t: "Hallucination",
          icon: "AlertTriangle",
          what: "When Claude writes something false in a very confident tone.",
          example: "A figure or a quote that does not exist in the source.",
          why: "That is why every figure is checked before sharing.",
        },
        {
          t: "Export",
          icon: "FileDown",
          what: "Turning the piece into a Word, Excel, PowerPoint or PDF file.",
          example: "Ask for 'as an editable .docx'.",
          why: "The piece fits into your workflow.",
        },
        {
          t: "Sharing permissions",
          icon: "Share2",
          what: "Who can see or edit the piece: only you, invited people or anyone with the link.",
          example: "A public link with student data is a risk.",
          why: "Sharing badly exposes data that should not leave.",
        },
      ],
    },
    pt: {
      title: "Conceitos-chave antes de começar",
      items: [
        {
          t: "Artifact",
          icon: "Box",
          what: "Peça que o Claude cria ao lado do chat para você ver, editar e compartilhar.",
          example: "Um guia de 2 páginas que você ajusta sem copiar e colar.",
          why: "Você melhora a mesma peça em vez de começar do zero.",
        },
        {
          t: "Versão",
          icon: "GitBranch",
          what: "Cada mudança deixa a peça diferente; compare o antes e o depois para saber o que funcionou.",
          example:
            "Você pede para encurtar e o guia fica menor; compara com a anterior.",
          why: "Comparar mostra qual mudança melhorou a peça.",
        },
        {
          t: "Alucinação",
          icon: "AlertTriangle",
          what: "Quando o Claude escreve algo falso com um tom muito seguro.",
          example: "Um número ou uma citação que não existe na fonte.",
          why: "Por isso cada número é conferido antes de compartilhar.",
        },
        {
          t: "Exportar",
          icon: "FileDown",
          what: "Transformar a peça em um arquivo Word, Excel, PowerPoint ou PDF.",
          example: "Peça «como .docx editável».",
          why: "A peça entra no seu fluxo de trabalho.",
        },
        {
          t: "Permissões ao compartilhar",
          icon: "Share2",
          what: "Quem pode ver ou editar a peça: só você, pessoas convidadas ou qualquer pessoa com o link.",
          example: "Um link público com dados de estudantes é um risco.",
          why: "Compartilhar mal expõe dados que não deveriam sair.",
        },
      ],
    },
  },
  delegation: {
    es: {
      title: "Conceptos clave antes de empezar",
      items: [
        {
          t: "Delegar",
          icon: "UserCheck",
          what: "Entregar a Claude una tarea de forma o de bajo riesgo, que solo requiere una revisión rápida.",
          example: "Dar formato a una plantilla que ya aprobaste.",
          why: "Ahorras tiempo sin ceder la decisión.",
        },
        {
          t: "Revisar",
          icon: "ShieldCheck",
          what: "Comprobar el resultado antes de usarlo.",
          example: "Verificar las cifras de un informe antes de presentarlo.",
          why: "Claude puede equivocarse y sonar seguro.",
        },
        {
          t: "Responsabilidad",
          icon: "Signature",
          what: "Quien firma o decide responde por el resultado, no Claude.",
          example: "Firmar un contrato o enviar una oferta legal.",
          why: "La responsabilidad legal no se delega.",
        },
        {
          t: "Datos personales",
          icon: "Lock",
          what: "Información que identifica a una persona: nombre, correo, teléfono o notas.",
          example: "Una lista de 200 clientes con sus correos.",
          why: "En Colombia la Ley 1581 de 2012 regula el uso de datos personales: antes de compartirlos con una herramienta de IA, anonimízalos o pide autorización.",
        },
        {
          t: "Decisión",
          icon: "Scale",
          what: "Elegir qué hacer con el resultado.",
          example: "Aprobar un reembolso o despedir a alguien.",
          why: "Las decisiones sobre personas y dinero no se delegan.",
        },
        {
          t: "Declarar el uso de IA",
          icon: "MessageSquare",
          what: "Decir cuándo y cómo usaste IA en un trabajo que entregas o publicas.",
          example:
            "Una nota al final: «Borrador preparado con Claude y revisado por [nombre]».",
          why: "Da transparencia y deja claro quién responde por el contenido.",
        },
      ],
    },
    en: {
      title: "Key concepts before you start",
      items: [
        {
          t: "Delegate",
          icon: "UserCheck",
          what: "Handing Claude a form or low-risk task that only needs a quick check.",
          example: "Formatting a template you have already approved.",
          why: "You save time without giving up the decision.",
        },
        {
          t: "Review",
          icon: "ShieldCheck",
          what: "Checking the result before using it.",
          example: "Verifying the figures in a report before presenting it.",
          why: "Claude can be wrong and still sound sure.",
        },
        {
          t: "Accountability",
          icon: "Signature",
          what: "Whoever signs or decides answers for the result, not Claude.",
          example: "Signing a contract or sending a legal offer.",
          why: "Legal responsibility cannot be delegated.",
        },
        {
          t: "Personal data",
          icon: "Lock",
          what: "Information that identifies a person: name, email, phone or notes.",
          example: "A list of 200 customers with their emails.",
          why: "In Colombia Law 1581 of 2012 regulates personal data: before sharing it with an AI tool, anonymize it or get authorization.",
        },
        {
          t: "Decision",
          icon: "Scale",
          what: "Choosing what to do with the result.",
          example: "Approving a refund or dismissing someone.",
          why: "Decisions about people and money are not delegated.",
        },
        {
          t: "Disclosing AI use",
          icon: "MessageSquare",
          what: "Saying when and how you used AI in work you deliver or publish.",
          example:
            "A note at the end: 'Draft prepared with Claude and reviewed by [name]'.",
          why: "It brings transparency and makes clear who answers for the content.",
        },
      ],
    },
    pt: {
      title: "Conceitos-chave antes de começar",
      items: [
        {
          t: "Delegar",
          icon: "UserCheck",
          what: "Entregar ao Claude uma tarefa de forma ou de baixo risco, que só exige uma revisão rápida.",
          example: "Formatar um modelo que você já aprovou.",
          why: "Você economiza tempo sem abrir mão da decisão.",
        },
        {
          t: "Revisar",
          icon: "ShieldCheck",
          what: "Conferir o resultado antes de usar.",
          example: "Verificar os números de um relatório antes de apresentar.",
          why: "O Claude pode errar e ainda soar seguro.",
        },
        {
          t: "Responsabilidade",
          icon: "Signature",
          what: "Quem assina ou decide responde pelo resultado, não o Claude.",
          example: "Assinar um contrato ou enviar uma proposta legal.",
          why: "A responsabilidade legal não pode ser delegada.",
        },
        {
          t: "Dados pessoais",
          icon: "Lock",
          what: "Informação que identifica uma pessoa: nome, e-mail, telefone ou anotações.",
          example: "Uma lista de 200 clientes com os e-mails.",
          why: "No Brasil a LGPD protege esses dados, e na Colômbia a Lei 1581 de 2012 regula o uso de dados pessoais: anonimize-os ou tenha autorização antes de compartilhar com uma IA.",
        },
        {
          t: "Decisão",
          icon: "Scale",
          what: "Escolher o que fazer com o resultado.",
          example: "Aprovar um reembolso ou demitir alguém.",
          why: "Decisões sobre pessoas e dinheiro não se delegam.",
        },
        {
          t: "Declarar o uso de IA",
          icon: "MessageSquare",
          what: "Dizer quando e como você usou IA em um trabalho que entrega ou publica.",
          example:
            "Uma nota no final: «Rascunho preparado com o Claude e revisado por [nome]».",
          why: "Dá transparência e deixa claro quem responde pelo conteúdo.",
        },
      ],
    },
  },
};
