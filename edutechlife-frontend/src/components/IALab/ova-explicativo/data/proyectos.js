// OVA «El Taller de Proyectos» (ILAB-M2-OVA4). Explica Proyectos, instrucciones, plugins y agentes.
export default {
  es: {
    badge: "Módulo 2 · Explicación",
    title: "El Taller de Proyectos",
    subtitle:
      "Proyectos, instrucciones, plugins y agentes: qué es cada uno y cuándo usarlo",
    intro:
      "Cuando repites un mismo tipo de trabajo, no conviene empezar de cero cada vez. En esta lección aprenderás los términos clave para organizar ese trabajo con ChatGPT, qué hace cada herramienta y cómo revisar el resultado antes de usarlo.",
    objectives: [
      "Explicar qué es un Proyecto y qué guarda",
      "Definir qué son instrucciones, plugin y agente, con sus diferencias",
      "Escribir instrucciones claras con rol, contexto y límites",
      "Reconocer el error de guardar datos sensibles en un Proyecto",
    ],
    sections: [
      {
        title: "1. ¿Qué es un Proyecto?",
        explain: [
          "Un Proyecto es un espacio para agrupar un trabajo: guarda sus instrucciones y sus archivos, y cada chat dentro del Proyecto usa ese contexto sin que tengas que pegarlo otra vez.",
          "Piensa en una carpeta de trabajo con una hoja de instrucciones pegada en la portada: todo lo que abras dentro parte de esas mismas reglas.",
        ],
        terms: [
          {
            term: "Proyecto",
            def: "Espacio que agrupa chats, archivos e instrucciones de un mismo trabajo.",
          },
          {
            term: "Contexto",
            def: "Lo que la IA sabe sobre tu situación antes de responder: tu tarea, tu público y tus reglas.",
          },
        ],
        how: [
          "Creas el Proyecto y le das un nombre que describa el trabajo.",
          "Escribes sus instrucciones y subes los archivos que el trabajo necesita.",
          "Cada conversación nueva dentro del Proyecto ya trae ese contexto.",
        ],
        example:
          "Un asesor de propuestas crea un Proyecto «Propuestas de clientes» con su tono, sus precios y sus plantillas.",
        mistake:
          "Subir a un Proyecto datos personales o confidenciales de personas que no te autorizaron a usarlos.",
      },
      {
        title: "2. Instrucciones: la base del Proyecto",
        explain: [
          "Las instrucciones son el texto que describe cómo debe trabajar la IA: qué papel tiene, para quién escribe, con qué tono y qué límites respeta.",
          "Unas buenas instrucciones son concretas. «Responde bien» no dice nada; «Eres asesor de un colegio, escribes para familias con frases cortas y nunca incluyes nombres de estudiantes» sí orienta el resultado.",
        ],
        terms: [
          {
            term: "Instrucciones",
            def: "Reglas escritas que guían cada respuesta del Proyecto.",
          },
          {
            term: "Rol",
            def: "El papel que asumes que tiene la IA, por ejemplo «asesor» o «editor».",
          },
          {
            term: "Límite",
            def: "Algo que la IA no debe hacer, como inventar cifras o pedir datos personales.",
          },
        ],
        how: [
          "Describe el rol: quién es la IA en este trabajo.",
          "Explica el contexto: para quién es el resultado y para qué se usa.",
          "Define el formato y los límites: extensión, tono y lo que nunca debe hacer.",
        ],
        example:
          "«Escribes avisos para familias. Usa tono cercano, tres párrafos como máximo y no incluyas nombres de estudiantes.»",
        mistake:
          "Instrucciones vagas o muy largas que se contradicen. Revísalas cuando el resultado no sea el esperado.",
      },
      {
        title: "3. Plugin, agente y GPT: qué los diferencia",
        explain: [
          "Un plugin es un complemento que conecta la IA con una herramienta o servicio externo para una tarea repetida. Reúne reglas, archivos y accesos a aplicaciones.",
          "Un agente hace varios pasos para llegar a un objetivo, por ejemplo buscar, comparar y armar una tabla. Tú revisas el plan y apruebas las acciones importantes.",
          "Un GPT personalizado es una versión de ChatGPT con sus propias instrucciones y archivos. OpenAI programó retirar los GPT personalizados el 11 de diciembre de 2026, y los plugins son el reemplazo previsto. Revisa en tu cuenta qué tienes disponible.",
        ],
        terms: [
          {
            term: "Plugin",
            def: "Complemento que conecta la IA con una herramienta o servicio para una tarea repetida.",
          },
          {
            term: "Agente",
            def: "Asistente que ejecuta varios pasos bajo tu supervisión.",
          },
          {
            term: "API",
            def: "Forma en que dos programas se comunican para pedir o enviar datos.",
          },
          {
            term: "Webhook",
            def: "Aviso automático que un servicio envía a otro cuando ocurre algo, por ejemplo una nueva queja.",
          },
        ],
        how: [
          "Un Proyecto guarda contexto y archivos para tu trabajo.",
          "Un plugin hace una tarea conectada a una herramienta externa.",
          "Un agente encadena pasos: tú apruebas los importantes antes de seguir.",
        ],
        example:
          "Para responder preguntas frecuentes de una marca, un plugin consulta el catálogo; para comparar cinco proveedores y armar una tabla, un agente hace los pasos.",
        mistake:
          "Pensar que el agente se equivoca menos porque trabajó varios minutos. Un error temprano se propaga a todo el resultado.",
      },
      {
        title: "4. Probar antes de usar",
        explain: [
          "Un resultado puede sonar seguro y estar mal. Antes de usarlo, separa lo que viene de tus archivos de lo que la IA supuso.",
          "Probar significa darle un caso real, revisar los datos que no aparecen en tus archivos y confirmarlos en su fuente.",
        ],
        terms: [
          {
            term: "Verificar",
            def: "Comprobar un dato contra una fuente que puedas abrir.",
          },
          {
            term: "Dato inventado",
            def: "Dato que la IA produce sin que exista en tus archivos ni en una fuente.",
          },
        ],
        how: [
          "Lee la respuesta y marca los datos concretos: fechas, cifras y nombres.",
          "Busca cada dato en tus archivos. Si no está, confírmalo en la fuente original.",
          "Si no puedes confirmarlo, no lo uses.",
        ],
        example:
          "Un aviso dice «la reunión será el jueves 5 a las 7 p. m.». Si la fecha no está en tus archivos ni en el calendario oficial, confírmala antes de enviarla.",
        mistake:
          "Enviar el resultado porque el Proyecto «ya lo revisó». El Proyecto solo conoce lo que tiene en sus instrucciones y archivos.",
      },
    ],
    summary: [
      "Un Proyecto agrupa chats, archivos e instrucciones de un mismo trabajo.",
      "Las instrucciones dicen rol, contexto, formato y límites; cuanto más concretas, mejor el resultado.",
      "Un plugin conecta una herramienta; un agente hace varios pasos bajo tu aprobación.",
      "Los GPT personalizados se retiran el 11 de diciembre de 2026; los plugins son el reemplazo previsto.",
      "Antes de usar un resultado, verifica sus datos concretos en una fuente que puedas abrir.",
    ],
    check: [
      {
        q: "¿Qué guarda un Proyecto?",
        options: [
          "Solo el historial de facturación de tu cuenta.",
          "Las instrucciones y los archivos de un mismo trabajo.",
          "Las respuestas de todos los usuarios de la plataforma.",
        ],
        correct: 1,
        feedback:
          "Un Proyecto agrupa instrucciones, archivos y chats de un mismo trabajo.",
      },
      {
        q: "Necesitas que la IA consulte un catálogo que cambia cada día. ¿Qué es lo más adecuado?",
        options: [
          "Escribir los precios de hoy en las instrucciones y no tocarlos más.",
          "Usar un plugin que consulte la fuente actualizada y verificar la fecha del dato.",
          "Pedirle que adivine los precios de hoy.",
        ],
        correct: 1,
        feedback:
          "Un dato que cambia debe venir de una fuente actualizada, no de una instrucción fija ni de una suposición.",
      },
      {
        q: "Un agente te entrega una tabla de proveedores. ¿Qué haces antes de enviarla?",
        options: [
          "La envío, porque el agente trabajó varios minutos.",
          "Reviso las fuentes y confirmo las cifras que usaré.",
          "Borro las fuentes para que la tabla se vea limpia.",
        ],
        correct: 1,
        feedback:
          "El agente ahorra pasos, pero tú verificas los datos antes de usarlos.",
      },
    ],
  },
  en: {
    badge: "Module 2 · Explanation",
    title: "The Project Workshop",
    subtitle:
      "Projects, instructions, plugins and agents: what each one is and when to use it",
    intro:
      "When you repeat the same kind of work, it is better not to start from zero each time. In this lesson you will learn the key terms for organizing that work with ChatGPT, what each tool does, and how to check the result before you use it.",
    objectives: [
      "Explain what a Project is and what it keeps",
      "Define instructions, plugin and agent, and how they differ",
      "Write clear instructions with a role, context and limits",
      "Recognize the mistake of keeping sensitive data in a Project",
    ],
    sections: [
      {
        title: "1. What is a Project?",
        explain: [
          "A Project is a space that groups one job: it keeps its instructions and files, and every chat inside the Project uses that context without you pasting it again.",
          "Think of a work folder with a sheet of instructions on the cover: everything you open inside follows the same rules.",
        ],
        terms: [
          {
            term: "Project",
            def: "A space that groups chats, files and instructions for one job.",
          },
          {
            term: "Context",
            def: "What the AI knows about your situation before it answers: your task, your audience and your rules.",
          },
        ],
        how: [
          "You create the Project and give it a name that describes the job.",
          "You write its instructions and upload the files the job needs.",
          "Each new conversation inside the Project already has that context.",
        ],
        example:
          "A proposal adviser creates a Project «Client proposals» with their tone, prices and templates.",
        mistake:
          "Uploading personal or confidential data about people who did not authorize you to use it.",
      },
      {
        title: "2. Instructions: the base of a Project",
        explain: [
          "Instructions are the text that describes how the AI should work: what role it plays, who it writes for, what tone to use and which limits to respect.",
          "Good instructions are specific. «Answer well» says nothing; «You are a school adviser, you write for families in short sentences and never include student names» guides the result.",
        ],
        terms: [
          {
            term: "Instructions",
            def: "Written rules that guide every answer in the Project.",
          },
          {
            term: "Role",
            def: "The part the AI plays, for example «adviser» or «editor».",
          },
          {
            term: "Limit",
            def: "Something the AI must not do, such as inventing figures or asking for personal data.",
          },
        ],
        how: [
          "Describe the role: who the AI is in this job.",
          "Explain the context: who the result is for and what it is used for.",
          "Define the format and the limits: length, tone and what it must never do.",
        ],
        example:
          "«You write notices for families. Use a warm tone, three paragraphs at most, and never include student names.»",
        mistake:
          "Vague or very long instructions that contradict each other. Review them when the result is not what you expected.",
      },
      {
        title: "3. Plugin, agent and GPT: what sets them apart",
        explain: [
          "A plugin is an add-on that connects the AI with an external tool or service for a repeated task. It gathers rules, files and access to apps.",
          "An agent carries out several steps toward a goal, for example searching, comparing and building a table. You review the plan and approve the important actions.",
          "A custom GPT is a version of ChatGPT with its own instructions and files. OpenAI has scheduled the retirement of custom GPTs for December 11, 2026, and plugins are the planned replacement. Check in your account what you have available.",
        ],
        terms: [
          {
            term: "Plugin",
            def: "An add-on that connects the AI with a tool or service for a repeated task.",
          },
          {
            term: "Agent",
            def: "An assistant that carries out several steps under your supervision.",
          },
          {
            term: "API",
            def: "The way two programs talk to each other to request or send data.",
          },
          {
            term: "Webhook",
            def: "An automatic notice that one service sends to another when something happens, for example a new complaint.",
          },
        ],
        how: [
          "A Project keeps context and files for your work.",
          "A plugin performs a task connected to an external tool.",
          "An agent chains steps: you approve the important ones before it continues.",
        ],
        example:
          "To answer a brand's frequently asked questions, a plugin checks the catalogue; to compare five suppliers and build a table, an agent does the steps.",
        mistake:
          "Thinking the agent makes fewer mistakes because it worked for several minutes. An early error spreads to the whole result.",
      },
      {
        title: "4. Test before you use it",
        explain: [
          "A result can sound confident and still be wrong. Before you use it, separate what comes from your files from what the AI assumed.",
          "Testing means giving it a real case, reviewing the data that does not appear in your files, and confirming it at the original source.",
        ],
        terms: [
          {
            term: "Verify",
            def: "To check a fact against a source you can open.",
          },
          {
            term: "Invented data",
            def: "Data the AI produces that exists neither in your files nor in a source.",
          },
        ],
        how: [
          "Read the answer and mark the concrete data: dates, figures and names.",
          "Look for each one in your files. If it is not there, confirm it at the original source.",
          "If you cannot confirm it, do not use it.",
        ],
        example:
          "A notice says «the meeting will be on Thursday the 5th at 7 p.m.». If the date is not in your files or in the official calendar, confirm it before sending.",
        mistake:
          "Sending the result because the Project «already checked it». The Project only knows what is in its instructions and files.",
      },
    ],
    summary: [
      "A Project groups chats, files and instructions for one job.",
      "Instructions state role, context, format and limits; the more specific, the better the result.",
      "A plugin connects a tool; an agent carries out several steps under your approval.",
      "Custom GPTs are scheduled for retirement on December 11, 2026; plugins are the planned replacement.",
      "Before using a result, verify its concrete data at a source you can open.",
    ],
    check: [
      {
        q: "What does a Project keep?",
        options: [
          "Only your account's billing history.",
          "The instructions and files of one job.",
          "The answers of every user on the platform.",
        ],
        correct: 1,
        feedback: "A Project groups instructions, files and chats for one job.",
      },
      {
        q: "You need the AI to check a catalogue that changes every day. What is most suitable?",
        options: [
          "Write today's prices in the instructions and never touch them again.",
          "Use a plugin that checks the updated source and verify the date of the data.",
          "Ask it to guess today's prices.",
        ],
        correct: 1,
        feedback:
          "Data that changes must come from an updated source, not from a fixed instruction or a guess.",
      },
      {
        q: "An agent gives you a table of suppliers. What do you do before sending it?",
        options: [
          "I send it, because the agent worked for several minutes.",
          "I review the sources and confirm the figures I will use.",
          "I delete the sources so the table looks clean.",
        ],
        correct: 1,
        feedback:
          "The agent saves steps, but you verify the data before using it.",
      },
    ],
  },
  pt: {
    badge: "Módulo 2 · Explicação",
    title: "A Oficina de Projetos",
    subtitle:
      "Projetos, instruções, plugins e agentes: o que é cada um e quando usar",
    intro:
      "Quando você repete o mesmo tipo de trabalho, não convém começar do zero cada vez. Nesta lição você vai aprender os termos-chave para organizar esse trabalho com o ChatGPT, o que cada ferramenta faz e como conferir o resultado antes de usar.",
    objectives: [
      "Explicar o que é um Projeto e o que ele guarda",
      "Definir instruções, plugin e agente, e como se diferenciam",
      "Escrever instruções claras com papel, contexto e limites",
      "Reconhecer o erro de guardar dados sensíveis em um Projeto",
    ],
    sections: [
      {
        title: "1. O que é um Projeto?",
        explain: [
          "Um Projeto é um espaço que agrupa um trabalho: guarda as suas instruções e arquivos, e cada chat dentro do Projeto usa esse contexto sem que você precise colá-lo de novo.",
          "Pense em uma pasta de trabalho com uma folha de instruções na capa: tudo o que você abre lá dentro segue as mesmas regras.",
        ],
        terms: [
          {
            term: "Projeto",
            def: "Espaço que agrupa chats, arquivos e instruções de um mesmo trabalho.",
          },
          {
            term: "Contexto",
            def: "O que a IA sabe sobre a sua situação antes de responder: a tarefa, o público e as regras.",
          },
        ],
        how: [
          "Você cria o Projeto e dá a ele um nome que descreva o trabalho.",
          "Escreve as instruções e envia os arquivos de que o trabalho precisa.",
          "Cada nova conversa dentro do Projeto já traz esse contexto.",
        ],
        example:
          "Um assessor de propostas cria o Projeto «Propostas de clientes» com o seu tom, os seus preços e os seus modelos.",
        mistake:
          "Enviar para um Projeto dados pessoais ou confidenciais de pessoas que não autorizaram o uso.",
      },
      {
        title: "2. Instruções: a base do Projeto",
        explain: [
          "As instruções são o texto que descreve como a IA deve trabalhar: qual papel ela tem, para quem escreve, com que tom e quais limites respeita.",
          "Boas instruções são específicas. «Responda bem» não diz nada; «Você é assessor de uma escola, escreve para famílias com frases curtas e nunca inclui nomes de estudantes» orienta o resultado.",
        ],
        terms: [
          {
            term: "Instruções",
            def: "Regras escritas que orientam cada resposta do Projeto.",
          },
          {
            term: "Papel",
            def: "O lugar que a IA assume, por exemplo «assessor» ou «editor».",
          },
          {
            term: "Limite",
            def: "Algo que a IA não deve fazer, como inventar números ou pedir dados pessoais.",
          },
        ],
        how: [
          "Descreva o papel: quem é a IA neste trabalho.",
          "Explique o contexto: para quem é o resultado e para que serve.",
          "Defina o formato e os limites: extensão, tom e o que nunca deve fazer.",
        ],
        example:
          "«Você escreve avisos para famílias. Use tom próximo, no máximo três parágrafos, e nunca inclua nomes de estudantes.»",
        mistake:
          "Instruções vagas ou muito longas que se contradizem. Revise-as quando o resultado não for o esperado.",
      },
      {
        title: "3. Plugin, agente e GPT: o que os diferencia",
        explain: [
          "Um plugin é um complemento que conecta a IA a uma ferramenta ou serviço externo para uma tarefa repetida. Reúne regras, arquivos e acesso a aplicativos.",
          "Um agente executa várias etapas para chegar a um objetivo, por exemplo buscar, comparar e montar uma tabela. Você revisa o plano e aprova as ações importantes.",
          "Um GPT personalizado é uma versão do ChatGPT com instruções e arquivos próprios. A OpenAI programou a retirada dos GPT personalizados para 11 de dezembro de 2026, e os plugins são a substituição prevista. Confira na sua conta o que você tem disponível.",
        ],
        terms: [
          {
            term: "Plugin",
            def: "Complemento que conecta a IA a uma ferramenta ou serviço para uma tarefa repetida.",
          },
          {
            term: "Agente",
            def: "Assistente que executa várias etapas sob a sua supervisão.",
          },
          {
            term: "API",
            def: "Forma como dois programas trocam dados: um pede e o outro responde.",
          },
          {
            term: "Webhook",
            def: "Aviso automático que um serviço envia a outro quando algo acontece, por exemplo uma nova reclamação.",
          },
        ],
        how: [
          "Um Projeto guarda contexto e arquivos do seu trabalho.",
          "Um plugin faz uma tarefa ligada a uma ferramenta externa.",
          "Um agente encadeia etapas: você aprova as importantes antes de seguir.",
        ],
        example:
          "Para responder perguntas frequentes de uma marca, um plugin consulta o catálogo; para comparar cinco fornecedores e montar uma tabela, um agente executa as etapas.",
        mistake:
          "Achar que o agente erra menos porque trabalhou vários minutos. Um erro no início se propaga para todo o resultado.",
      },
      {
        title: "4. Testar antes de usar",
        explain: [
          "Um resultado pode parecer seguro e estar errado. Antes de usá-lo, separe o que vem dos seus arquivos do que a IA supôs.",
          "Testar é dar a ela um caso real, revisar os dados que não aparecem nos seus arquivos e confirmá-los na fonte original.",
        ],
        terms: [
          {
            term: "Conferir",
            def: "Comparar um dado com uma fonte que você possa abrir.",
          },
          {
            term: "Dado inventado",
            def: "Dado que a IA produz e que não existe nem nos seus arquivos nem em uma fonte.",
          },
        ],
        how: [
          "Leia a resposta e marque os dados concretos: datas, números e nomes.",
          "Procure cada um nos seus arquivos. Se não estiver, confirme na fonte original.",
          "Se não conseguir confirmar, não use.",
        ],
        example:
          "Um aviso diz «a reunião será na quinta-feira, dia 5, às 19h». Se a data não estiver nos seus arquivos nem no calendário oficial, confirme antes de enviar.",
        mistake:
          "Enviar o resultado porque o Projeto «já revisou». O Projeto só conhece o que está nas instruções e nos arquivos.",
      },
    ],
    summary: [
      "Um Projeto agrupa chats, arquivos e instruções de um mesmo trabalho.",
      "As instruções dizem papel, contexto, formato e limites; quanto mais específicas, melhor o resultado.",
      "Um plugin conecta uma ferramenta; um agente executa várias etapas sob a sua aprovação.",
      "Os GPT personalizados são retirados em 11 de dezembro de 2026; os plugins são a substituição prevista.",
      "Antes de usar um resultado, confira os dados concretos em uma fonte que você possa abrir.",
    ],
    check: [
      {
        q: "O que um Projeto guarda?",
        options: [
          "Apenas o histórico de cobrança da sua conta.",
          "As instruções e os arquivos de um mesmo trabalho.",
          "As respostas de todos os usuários da plataforma.",
        ],
        correct: 1,
        feedback:
          "Um Projeto agrupa instruções, arquivos e chats de um mesmo trabalho.",
      },
      {
        q: "Você precisa que a IA consulte um catálogo que muda todo dia. O que é mais adequado?",
        options: [
          "Escrever os preços de hoje nas instruções e nunca mais mexer.",
          "Usar um plugin que consulte a fonte atualizada e conferir a data do dado.",
          "Pedir que ela adivinhe os preços de hoje.",
        ],
        correct: 1,
        feedback:
          "Um dado que muda precisa vir de uma fonte atualizada, não de uma instrução fixa nem de um palpite.",
      },
      {
        q: "Um agente entrega uma tabela de fornecedores. O que você faz antes de enviar?",
        options: [
          "Envio, porque o agente trabalhou vários minutos.",
          "Reviso as fontes e confirmo os números que vou usar.",
          "Apago as fontes para a tabela ficar limpa.",
        ],
        correct: 1,
        feedback:
          "O agente economiza etapas, mas você confere os dados antes de usá-los.",
      },
    ],
  },
};
