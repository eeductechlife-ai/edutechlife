// Contenido del OVA "El Tablero de Delegación" (Módulo 5). Tres idiomas, misma estructura.
// Cada tarea tiene una respuesta correcta y la razón que se muestra después de decidir.
export const DELEGATION_DATA = {
  es: {
    title: "El Tablero de Delegación",
    intro:
      "Delegar a Claude no significa soltar el trabajo. Aquí aprenderás qué puedes entregar, qué debes revisar y qué nunca debes delegar.",
    stages: [
      "1 · Las tres reglas",
      "2 · Tablero",
      "3 · Tu propia tarea",
      "4 · Tu Proyecto y tu Skill",
      "5 · Resumen",
    ],
    next: "Siguiente",
    back: "Atrás",
    rulesTitle: "Antes de clasificar: tres reglas",
    rules: [
      {
        key: "delegate",
        label: "Delegar",
        criteria:
          "Es de forma o repetitiva, no decide por nadie, no sale a terceros y no contiene datos personales ni cifras para decidir.",
        examples:
          "Dar formato a una plantilla aprobada, clasificar textos sin datos personales, generar ideas para revisar.",
      },
      {
        key: "review",
        label: "Delegar y revisar",
        criteria:
          "Claude prepara el trabajo, pero alguien comprueba cifras, fuentes o tono antes de usarlo, porque sale a terceros, contiene datos personales o cifras para decidir.",
        examples:
          "Resumir un informe, redactar borradores de correos, preparar una presentación para un cliente.",
      },
      {
        key: "never",
        label: "No delegar",
        criteria:
          "Decide algo sobre personas o dinero, o compromete legalmente a la empresa. Esa decisión y la firma son tuyas.",
        examples:
          "Despedir a alguien, firmar un contrato, aprobar un reembolso.",
      },
    ],
    questionsTitle: "Tres preguntas que te ayudan a decidir",
    questions: [
      "¿La tarea, por sí misma, decide algo sobre personas o dinero, como contratar, despedir o aprobar un pago?",
      "¿Compromete legalmente a la empresa, como firmar un contrato?",
      "¿El resultado sale a terceros, contiene datos personales o cifras que alguien usará para decidir?",
    ],
    boardTitle: "Clasifica cada tarea",
    boardHint:
      "Elige una categoría. Verás la razón al instante. Si dudas, usa las tres preguntas.",
    tasks: [
      {
        id: "t1",
        task: "Resumir un informe de 30 páginas para la junta directiva",
        answer: "review",
        why: "Claude resume rápido, pero las cifras y conclusiones se comprueban contra la fuente original antes de presentarlas.",
      },
      {
        id: "t2",
        task: "Dar formato a una plantilla de acta de reunión que ya aprobaste",
        answer: "delegate",
        why: "Es una tarea de forma, sin decisión de fondo. Es ideal para delegar.",
      },
      {
        id: "t3",
        task: "Decidir si despides a un colaborador con base en un análisis automático",
        answer: "never",
        why: "Las decisiones sobre personas exigen criterio, responsabilidad y contexto humano.",
      },
      {
        id: "t4",
        task: "Preparar borradores de respuesta a correos de clientes para que tú los revises",
        answer: "review",
        why: "Delegas el borrador. La respuesta final y su envío siguen siendo tuyos.",
      },
      {
        id: "t5",
        task: "Clasificar 200 correos de clientes por tema y prioridad",
        answer: "review",
        why: "Contienen datos personales: anonimízalos o ten autorización antes de compartirlos con Claude (Ley 1581 de 2012) y revisa una muestra del resultado.",
      },
      {
        id: "t6",
        task: "Firmar un contrato o enviar una oferta legal en nombre de la empresa",
        answer: "never",
        why: "Las obligaciones legales requieren firma y revisión de una persona responsable.",
      },
      {
        id: "t7",
        task: "Redactar la respuesta a una queja de cliente que pide reembolso",
        answer: "review",
        why: "Claude puede redactar la respuesta; el reembolso y su monto los apruebas tú, porque es una decisión sobre dinero.",
      },
      {
        id: "t8",
        task: "Crear 10 ideas de publicaciones para redes sociales de tu tienda",
        answer: "delegate",
        why: "Son ideas para revisar: el riesgo es bajo y tú eliges cuáles publicar.",
      },
    ],
    taskHint: "Pista",
    hintLabel: "Pregúntate",
    correctLabel: "Correcto",
    wrongLabel: "Revisa",
    categories: {
      delegate: "Delegar",
      review: "Delegar y revisar",
      never: "No delegar",
    },
    ownTitle: "Tu propia tarea",
    ownHint:
      "Escribe una tarea real de tu semana y responde las tres preguntas.",
    ownPlaceholder: "Por ejemplo: preparar la respuesta a un cliente molesto",
    yes: "Sí",
    no: "No",
    ownResult: "Recomendación",
    ownExplain: {
      never:
        "Decides tú y el impacto es en personas, dinero o obligaciones: no la delegues. Puedes usar Claude solo para ordenar información previa.",
      review:
        "Claude puede preparar el trabajo, pero antes de usarlo debes revisar cifras, tono y consecuencias.",
      delegate:
        "Es una tarea de forma o de bajo riesgo. Delégala y revisa una muestra para comprobar el resultado.",
    },
    summaryTitle: "Tu resultado",
    score: "Acertaste {n} de {total} tareas.",
    summaryGood:
      "Dominas la delegación: entregas la forma y conservas la decisión.",
    summaryMore:
      "Repasa las reglas: la pregunta clave es quién decide y quién responde por el resultado.",
    goldenRule:
      "Regla de oro: delega el trabajo de forma y el borrador; nunca delegues la decisión ni la firma.",
    retry: "Reintentar tablero",
    done: "Completaste el tablero y tu propia clasificación.",
    levels: {
      beginner:
        "Inicial: identificas las tareas de forma, pero aún dudas en las de revisión. Repasa las tres preguntas.",
      competent:
        "Competente: clasificas bien la mayoría de las tareas y reconoces cuándo no delegar.",
      expert:
        "Experto: delegas la forma, revisas lo que sale de tu empresa y nunca delegas la decisión ni la firma.",
    },
  },
  en: {
    title: "The Delegation Board",
    intro:
      "Delegating to Claude does not mean letting go of the work. Here you will learn what you can hand over, what you must review and what you must never delegate.",
    stages: [
      "1 · Three rules",
      "2 · Board",
      "3 · Your own task",
      "4 · Your Project and Skill",
      "5 · Summary",
    ],
    next: "Next",
    back: "Back",
    rulesTitle: "Before sorting: three rules",
    rules: [
      {
        key: "delegate",
        label: "Delegate",
        criteria:
          "It is about form or is repetitive, decides nothing for anyone, does not go to third parties and holds no personal data or figures for decisions.",
        examples:
          "Formatting an approved template, sorting texts without personal data, generating ideas to review.",
      },
      {
        key: "review",
        label: "Delegate and review",
        criteria:
          "Claude prepares the work, but someone checks figures, sources or tone before use, because it goes to third parties or holds personal data or figures for decisions.",
        examples:
          "Summarizing a report, drafting client emails, preparing a presentation for a client.",
      },
      {
        key: "never",
        label: "Never delegate",
        criteria:
          "It decides something about people or money, or legally commits the company. That decision and the signature are yours.",
        examples: "Dismissing someone, signing a contract, approving a refund.",
      },
    ],
    questionsTitle: "Three questions to help you decide",
    questions: [
      "Does the task itself decide something about people or money, like hiring, dismissing or approving a payment?",
      "Does it legally commit the company, like signing a contract?",
      "Does the result go to third parties, or contain personal data or figures someone will use to decide?",
    ],
    boardTitle: "Sort each task",
    boardHint:
      "Pick a category. You will see the reason right away. If you hesitate, use the three questions.",
    tasks: [
      {
        id: "t1",
        task: "Summarize a 30-page report for the board of directors",
        answer: "review",
        why: "Claude summarizes fast, but figures and conclusions must be checked against the original source before presenting them.",
      },
      {
        id: "t2",
        task: "Format a meeting-minutes template you already approved",
        answer: "delegate",
        why: "It is a formatting task with no substantive decision. Ideal to delegate.",
      },
      {
        id: "t3",
        task: "Decide whether to dismiss an employee based on an automated analysis",
        answer: "never",
        why: "Decisions about people require human judgment, accountability and context.",
      },
      {
        id: "t4",
        task: "Draft replies to client emails for you to review",
        answer: "review",
        why: "You delegate the draft. The final reply and sending it remain yours.",
      },
      {
        id: "t5",
        task: "Sort 200 customer emails by topic and priority",
        answer: "review",
        why: "They contain personal data: anonymize them or have authorization before sharing with Claude and review a sample of the result.",
      },
      {
        id: "t6",
        task: "Sign a contract or send a legal offer on behalf of the company",
        answer: "never",
        why: "Legal obligations require signature and review by a responsible person.",
      },
      {
        id: "t7",
        task: "Draft the reply to a customer complaint that asks for a refund",
        answer: "review",
        why: "Claude can draft the reply; you approve the refund and its amount, because that is a decision about money.",
      },
      {
        id: "t8",
        task: "Create 10 social media post ideas for your shop",
        answer: "delegate",
        why: "These are ideas to review: the risk is low and you choose which ones to publish.",
      },
    ],
    taskHint: "Hint",
    hintLabel: "Ask yourself",
    correctLabel: "Correct",
    wrongLabel: "Review",
    categories: {
      delegate: "Delegate",
      review: "Delegate and review",
      never: "Never delegate",
    },
    ownTitle: "Your own task",
    ownHint: "Write a real task from your week and answer the three questions.",
    ownPlaceholder: "For example: prepare a reply to an upset client",
    yes: "Yes",
    no: "No",
    ownResult: "Recommendation",
    ownExplain: {
      never:
        "You make the decision and the impact is on people, money or obligations: do not delegate it. You can use Claude only to organize information you already have.",
      review:
        "Claude can prepare the work, but before using it you must review figures, tone and consequences.",
      delegate:
        "It is a form or low-risk task. Delegate it and review a sample to check the result.",
    },
    summaryTitle: "Your result",
    score: "You got {n} of {total} tasks right.",
    summaryGood:
      "You have mastered delegation: you hand over the form and keep the decision.",
    summaryMore:
      "Review the rules: the key question is who decides and who answers for the result.",
    goldenRule:
      "Golden rule: delegate form and drafts; never delegate the decision or the signature.",
    retry: "Retry the board",
    done: "You completed the board and your own sorting.",
    levels: {
      beginner:
        "Beginner: you spot form tasks, but still hesitate on review tasks. Go over the three questions again.",
      competent:
        "Competent: you sort most tasks well and recognize when not to delegate.",
      expert:
        "Expert: you delegate form, review what leaves your company and never delegate the decision or the signature.",
    },
  },
  pt: {
    title: "O Quadro de Delegação",
    intro:
      "Delegar ao Claude não significa soltar o trabalho. Aqui você vai aprender o que pode entregar, o que deve revisar e o que nunca deve delegar.",
    stages: [
      "1 · As três regras",
      "2 · Quadro",
      "3 · Sua própria tarefa",
      "4 · Seu Projeto e sua Skill",
      "5 · Resumo",
    ],
    next: "Próximo",
    back: "Voltar",
    rulesTitle: "Antes de classificar: três regras",
    rules: [
      {
        key: "delegate",
        label: "Delegar",
        criteria:
          "É de forma ou repetitiva, não decide por ninguém, não vai para terceiros e não contém dados pessoais nem números para decidir.",
        examples:
          "Formatar um modelo aprovado, classificar textos sem dados pessoais, gerar ideias para revisar.",
      },
      {
        key: "review",
        label: "Delegar e revisar",
        criteria:
          "O Claude prepara o trabalho, mas alguém confere números, fontes ou tom antes de usar, porque vai para terceiros ou contém dados pessoais ou números para decidir.",
        examples:
          "Resumir um relatório, redigir rascunhos de e-mails, preparar uma apresentação para um cliente.",
      },
      {
        key: "never",
        label: "Não delegar",
        criteria:
          "Decide algo sobre pessoas ou dinheiro, ou compromete legalmente a empresa. Essa decisão e a assinatura são suas.",
        examples: "Demitir alguém, assinar um contrato, aprovar um reembolso.",
      },
    ],
    questionsTitle: "Três perguntas que ajudam a decidir",
    questions: [
      "A tarefa, por si só, decide algo sobre pessoas ou dinheiro, como contratar, demitir ou aprovar um pagamento?",
      "Compromete legalmente a empresa, como assinar um contrato?",
      "O resultado vai para terceiros, ou contém dados pessoais ou números que alguém usará para decidir?",
    ],
    boardTitle: "Classifique cada tarefa",
    boardHint:
      "Escolha uma categoria. Você verá o motivo na hora. Se tiver dúvida, use as três perguntas.",
    tasks: [
      {
        id: "t1",
        task: "Resumir um relatório de 30 páginas para o conselho",
        answer: "review",
        why: "O Claude resume rápido, mas números e conclusões devem ser conferidos na fonte original antes de apresentar.",
      },
      {
        id: "t2",
        task: "Dar formato a um modelo de ata de reunião que você já aprovou",
        answer: "delegate",
        why: "É uma tarefa de forma, sem decisão de fundo. Ideal para delegar.",
      },
      {
        id: "t3",
        task: "Decidir demitir um colaborador com base em uma análise automática",
        answer: "never",
        why: "Decisões sobre pessoas exigem critério, responsabilidade e contexto humano.",
      },
      {
        id: "t4",
        task: "Preparar rascunhos de resposta a e-mails de clientes para você revisar",
        answer: "review",
        why: "Você delega o rascunho. A resposta final e o envio continuam sendo seus.",
      },
      {
        id: "t5",
        task: "Classificar 200 e-mails de clientes por tema e prioridade",
        answer: "review",
        why: "Contêm dados pessoais: anonimize-os ou tenha autorização antes de compartilhar com o Claude e revise uma amostra do resultado.",
      },
      {
        id: "t6",
        task: "Assinar um contrato ou enviar uma proposta legal em nome da empresa",
        answer: "never",
        why: "Obrigações legais exigem assinatura e revisão de uma pessoa responsável.",
      },
      {
        id: "t7",
        task: "Redigir a resposta a uma reclamação de cliente que pede reembolso",
        answer: "review",
        why: "O Claude pode redigir a resposta; o reembolso e o valor você aprova, porque é uma decisão sobre dinheiro.",
      },
      {
        id: "t8",
        task: "Criar 10 ideias de publicações para as redes sociais da sua loja",
        answer: "delegate",
        why: "São ideias para revisar: o risco é baixo e você escolhe quais publicar.",
      },
    ],
    taskHint: "Dica",
    hintLabel: "Pergunte-se",
    correctLabel: "Correto",
    wrongLabel: "Revise",
    categories: {
      delegate: "Delegar",
      review: "Delegar e revisar",
      never: "Não delegar",
    },
    ownTitle: "Sua própria tarefa",
    ownHint:
      "Escreva uma tarefa real da sua semana e responda às três perguntas.",
    ownPlaceholder: "Por exemplo: preparar a resposta a um cliente irritado",
    yes: "Sim",
    no: "Não",
    ownResult: "Recomendação",
    ownExplain: {
      never:
        "Você decide e o impacto é sobre pessoas, dinheiro ou obrigações: não delegue. Use o Claude só para organizar informações que você já tem.",
      review:
        "O Claude pode preparar o trabalho, mas antes de usar você deve revisar números, tom e consequências.",
      delegate:
        "É uma tarefa de forma ou de baixo risco. Delegue e revise uma amostra para conferir o resultado.",
    },
    summaryTitle: "Seu resultado",
    score: "Você acertou {n} de {total} tarefas.",
    summaryGood: "Você domina a delegação: entrega a forma e mantém a decisão.",
    summaryMore:
      "Revise as regras: a pergunta-chave é quem decide e quem responde pelo resultado.",
    goldenRule:
      "Regra de ouro: delegue a forma e os rascunhos; nunca delegue a decisão nem a assinatura.",
    retry: "Refazer o quadro",
    done: "Você concluiu o quadro e a sua própria classificação.",
    levels: {
      beginner:
        "Inicial: você identifica tarefas de forma, mas ainda hesita nas de revisão. Releia as três perguntas.",
      competent:
        "Competente: você classifica bem a maioria das tarefas e reconhece quando não delegar.",
      expert:
        "Especialista: você delega a forma, revisa o que sai da empresa e nunca delega a decisão nem a assinatura.",
    },
  },
};
