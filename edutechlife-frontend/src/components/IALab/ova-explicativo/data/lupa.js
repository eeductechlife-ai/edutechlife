// OVA «La Lupa Multimodal» (ILAB-M3-OVA2). Gemini en Google Workspace: qué lee del correo, Drive y documentos, y cómo revisar el resultado.
export default {
  es: {
    badge: "Módulo 3 · Explicación",
    title: "La Lupa Multimodal",
    subtitle:
      "Gemini dentro de Google Workspace: qué puede leer de tus correos, documentos y archivos, y cómo revisar lo que propone",
    intro:
      "Gemini trabaja dentro de Gmail, Drive, Docs y Sheets. Puede resumir un hilo, redactar desde un documento o buscar en tus archivos. Eso ahorra tiempo, pero también significa que la IA lee información que puede ser privada. Aquí aprenderás qué tiene acceso, cómo pedir mejor y cómo revisar el resultado.",
    objectives: [
      "Explicar qué significa que Gemini trabaje dentro de Workspace",
      "Identificar qué contenido puede leer y qué no",
      "Pedir resúmenes y redacciones con contexto preciso",
      "Revisar el resultado antes de enviarlo o compartirlo",
    ],
    sections: [
      {
        title: "1. Gemini dentro de Workspace",
        explain: [
          "Gemini en Workspace es la IA integrada en las aplicaciones de Google que usa tu organización o tu cuenta. Puede trabajar sobre el contenido que tienes abierto o sobre los archivos a los que le das permiso.",
          "No todas las aplicaciones tienen las mismas funciones. Revisa en tu cuenta qué aplicaciones tienen Gemini activo y con qué datos.",
        ],
        terms: [
          {
            term: "Workspace",
            def: "Conjunto de aplicaciones de Google para trabajo: Gmail, Drive, Docs, Sheets y otras.",
          },
          {
            term: "Permiso de acceso",
            def: "Autorización que das para que la IA lea un archivo o correo.",
          },
        ],
        how: [
          "Identifica en qué aplicación estás trabajando.",
          "Revisa qué archivos o correos tiene disponibles.",
          "Pide solo lo que la tarea necesita.",
        ],
        example:
          "En Gmail pides el resumen de un hilo de clientes. Gemini lee ese hilo, no todo tu correo.",
        mistake:
          "Dar acceso amplio a todo el Drive para una tarea que usa un solo documento.",
      },
      {
        title: "2. Qué puede leer y qué no",
        explain: [
          "Gemini lee el contenido al que tiene acceso: el correo abierto, el documento seleccionado o los archivos que incluyes. No lee lo que no le has dado. Pero sí puede leer datos personales dentro de esos archivos.",
          "Antes de pedir un resumen, pregúntate si hay datos personales o confidenciales en el contenido. Si los hay y no son necesarios, quítalos.",
        ],
        terms: [
          {
            term: "Dato personal",
            def: "Información que identifica a una persona, como nombre, teléfono o documento.",
          },
          {
            term: "Contexto",
            def: "Lo que le muestras a la IA para que responda con la información correcta.",
          },
        ],
        how: [
          "Revisa si el contenido tiene datos personales.",
          "Quítalos si no son necesarios para la tarea.",
          "Pide el resultado solo con lo que hace falta.",
        ],
        example:
          "Pides un resumen de un hilo con teléfonos de clientes. Pides que lo resuma sin incluir teléfonos.",
        mistake:
          "Pedir el resumen de un hilo con datos de menores o de pacientes sin que sea necesario.",
      },
      {
        title: "3. Pedir con contexto preciso",
        explain: [
          "Cuanto más preciso es el pedido, mejor es el resultado. Indica qué parte del contenido importa, para quién es, en qué tono y cuál es el resultado esperado.",
          "Un pedido sin contexto produce un texto genérico que luego debes reescribir.",
        ],
        terms: [
          {
            term: "Resumen",
            def: "Versión corta del contenido con sus puntos principales.",
          },
          {
            term: "Tono",
            def: "Forma de escribir: formal, cercana, técnica, según el destinatario.",
          },
        ],
        how: [
          "Di qué parte importa.",
          "Di para quién es el texto.",
          "Di el formato y la longitud que necesitas.",
        ],
        example:
          "«Resume este hilo en tres puntos para la directora, en tono formal, con las fechas de entrega.»",
        mistake: "Pedir «haz un resumen» sin decir para qué ni a quién.",
      },
      {
        title: "4. Revisar antes de enviar",
        explain: [
          "Lo que Gemini redacta o resume es un borrador. Antes de enviarlo o compartirlo, compara los datos con el original: fechas, cifras, nombres y compromisos.",
          "Si algo no está en el original, no lo mantengas, aunque suene bien.",
        ],
        terms: [
          {
            term: "Borrador",
            def: "Versión inicial que aún debe revisarse antes de usarse.",
          },
          {
            term: "Compromiso",
            def: "Acción o fecha que alguien acepta; debe coincidir con el original.",
          },
        ],
        how: [
          "Compara fechas, cifras y nombres con el original.",
          "Revisa los compromisos y las responsabilidades.",
          "Envía solo después de revisar.",
        ],
        example:
          "El resumen dice «entrega el viernes». El hilo original dice «el jueves». Corriges antes de enviar.",
        mistake:
          "Enviar el correo redactado por la IA sin leerlo contra el original.",
      },
    ],
    summary: [
      "Gemini en Workspace trabaja sobre el contenido al que le das acceso.",
      "Pide solo lo que la tarea necesita: no des acceso amplio si no hace falta.",
      "Quita los datos personales que no son necesarios antes de pedir un resumen.",
      "Un pedido con contexto preciso produce un mejor resultado.",
      "Todo borrador se compara con el original antes de enviarse.",
    ],
    check: [
      {
        q: "¿Qué contenido lee Gemini en Workspace?",
        options: [
          "Todo tu correo y todo tu Drive, siempre.",
          "El contenido al que le diste acceso para esa tarea.",
          "Solo lo que escribes en el chat, nunca los archivos.",
        ],
        correct: 1,
        feedback:
          "Gemini trabaja sobre el contenido y los archivos a los que le das acceso para la tarea.",
      },
      {
        q: "Vas a pedir un resumen de un hilo con teléfonos de clientes. ¿Qué haces?",
        options: [
          "Lo pido tal cual, para que salga completo.",
          "Pido el resumen sin incluir datos personales que no son necesarios.",
          "Lo comparto con todo el equipo primero.",
        ],
        correct: 1,
        feedback:
          "Los datos personales que no son necesarios para la tarea deben quedar fuera.",
      },
      {
        q: "El resumen de Gemini dice una fecha distinta a la del hilo original. ¿Qué haces?",
        options: [
          "La envío, porque la IA la escribió.",
          "La corrijo con la fecha del original antes de enviar.",
          "Pido que la cambie a la que suene mejor.",
        ],
        correct: 1,
        feedback:
          "Cualquier borrador se compara con el original; la fecha correcta es la del hilo.",
      },
    ],
  },
  en: {
    badge: "Module 3 · Explanation",
    title: "The Multimodal Lens",
    subtitle:
      "Gemini inside Google Workspace: what it can read from your emails, documents and files, and how to review what it proposes",
    intro:
      "Gemini works inside Gmail, Drive, Docs and Sheets. It can summarize a thread, draft from a document or search your files. That saves time, but it also means the AI reads information that may be private. Here you will learn what it can access, how to ask better and how to review the result.",
    objectives: [
      "Explain what it means for Gemini to work inside Workspace",
      "Identify what content it can read and what it cannot",
      "Ask for summaries and drafts with precise context",
      "Review the result before sending or sharing it",
    ],
    sections: [
      {
        title: "1. Gemini inside Workspace",
        explain: [
          "Gemini in Workspace is the AI built into Google's apps that your organization or account uses. It can work on the content you have open or on the files you give it permission to access.",
          "Not every app has the same features. Check in your account which apps have Gemini active and with which data.",
        ],
        terms: [
          {
            term: "Workspace",
            def: "Google's suite of work apps: Gmail, Drive, Docs, Sheets and others.",
          },
          {
            term: "Access permission",
            def: "Authorization you give so the AI can read a file or email.",
          },
        ],
        how: [
          "Identify which app you are working in.",
          "Check which files or emails it has available.",
          "Ask only for what the task needs.",
        ],
        example:
          "In Gmail you ask for a summary of a client thread. Gemini reads that thread, not your whole mailbox.",
        mistake:
          "Giving broad access to your whole Drive for a task that uses a single document.",
      },
      {
        title: "2. What it can read and what it cannot",
        explain: [
          "Gemini reads the content it can access: the open email, the selected document or the files you include. It does not read what you have not given it. But it can read personal data inside those files.",
          "Before asking for a summary, ask yourself whether the content holds personal or confidential data. If it does and it is not needed, remove it.",
        ],
        terms: [
          {
            term: "Personal data",
            def: "Information that identifies a person, such as name, phone or ID number.",
          },
          {
            term: "Context",
            def: "What you show the AI so it answers with the right information.",
          },
        ],
        how: [
          "Check whether the content has personal data.",
          "Remove it if it is not needed for the task.",
          "Ask for the result with only what is necessary.",
        ],
        example:
          "You ask for a summary of a thread with client phone numbers. You ask for it without including the phone numbers.",
        mistake:
          "Asking for a summary of a thread with minors' or patients' data when it is not needed.",
      },
      {
        title: "3. Asking with precise context",
        explain: [
          "The more precise the request, the better the result. Say which part matters, who it is for, in what tone and what result you expect.",
          "A request without context produces generic text that you then have to rewrite.",
        ],
        terms: [
          {
            term: "Summary",
            def: "A short version of the content with its main points.",
          },
          {
            term: "Tone",
            def: "The way of writing: formal, friendly, technical, depending on the reader.",
          },
        ],
        how: [
          "Say which part matters.",
          "Say who the text is for.",
          "Say the format and length you need.",
        ],
        example:
          "«Summarize this thread in three points for the director, in a formal tone, with the delivery dates.»",
        mistake: "Asking for «a summary» without saying what for or for whom.",
      },
      {
        title: "4. Review before sending",
        explain: [
          "What Gemini drafts or summarizes is a draft. Before you send or share it, compare the data with the original: dates, figures, names and commitments.",
          "If something is not in the original, do not keep it, even if it sounds good.",
        ],
        terms: [
          {
            term: "Draft",
            def: "An initial version that must be reviewed before use.",
          },
          {
            term: "Commitment",
            def: "An action or date someone agrees to; it must match the original.",
          },
        ],
        how: [
          "Compare dates, figures and names with the original.",
          "Check commitments and responsibilities.",
          "Send only after reviewing.",
        ],
        example:
          "The summary says «deliver on Friday». The original thread says «Thursday». You correct it before sending.",
        mistake:
          "Sending the email drafted by the AI without reading it against the original.",
      },
    ],
    summary: [
      "Gemini in Workspace works on the content you give it access to.",
      "Ask only for what the task needs: do not grant broad access if it is not necessary.",
      "Remove personal data that is not needed before asking for a summary.",
      "A request with precise context produces a better result.",
      "Every draft is compared with the original before it is sent.",
    ],
    check: [
      {
        q: "What content does Gemini read in Workspace?",
        options: [
          "All your email and all your Drive, always.",
          "The content you gave it access to for that task.",
          "Only what you type in the chat, never the files.",
        ],
        correct: 1,
        feedback:
          "Gemini works on the content and files you give it access to for the task.",
      },
      {
        q: "You are going to ask for a summary of a thread with client phone numbers. What do you do?",
        options: [
          "I ask for it as it is, so it comes out complete.",
          "I ask for the summary without the personal data that is not needed.",
          "I share it with the whole team first.",
        ],
        correct: 1,
        feedback:
          "Personal data that the task does not need should be left out.",
      },
      {
        q: "Gemini's summary gives a different date from the original thread. What do you do?",
        options: [
          "I send it, because the AI wrote it.",
          "I correct it with the date from the original before sending.",
          "I ask it to change it to the one that sounds better.",
        ],
        correct: 1,
        feedback:
          "Every draft is compared with the original; the correct date is the one in the thread.",
      },
    ],
  },
  pt: {
    badge: "Módulo 3 · Explicação",
    title: "A Lupa Multimodal",
    subtitle:
      "O Gemini dentro do Google Workspace: o que pode ler dos seus e-mails, documentos e arquivos, e como revisar o que propõe",
    intro:
      "O Gemini trabalha dentro do Gmail, Drive, Docs e Sheets. Pode resumir uma conversa, redigir a partir de um documento ou buscar nos seus arquivos. Isso economiza tempo, mas também significa que a IA lê informações que podem ser privadas. Aqui você vai aprender a que ela tem acesso, como pedir melhor e como revisar o resultado.",
    objectives: [
      "Explicar o que significa o Gemini trabalhar dentro do Workspace",
      "Identificar que conteúdo ele pode ler e o que não pode",
      "Pedir resumos e redações com contexto preciso",
      "Revisar o resultado antes de enviar ou compartilhar",
    ],
    sections: [
      {
        title: "1. O Gemini dentro do Workspace",
        explain: [
          "O Gemini no Workspace é a IA integrada aos aplicativos do Google que sua organização ou sua conta usa. Pode trabalhar sobre o conteúdo que está aberto ou sobre os arquivos a que você dá permissão.",
          "Nem todos os aplicativos têm as mesmas funções. Confira na sua conta quais aplicativos têm o Gemini ativo e com quais dados.",
        ],
        terms: [
          {
            term: "Workspace",
            def: "Conjunto de aplicativos de trabalho do Google: Gmail, Drive, Docs, Sheets e outros.",
          },
          {
            term: "Permissão de acesso",
            def: "Autorização que você dá para a IA ler um arquivo ou e-mail.",
          },
        ],
        how: [
          "Identifique em qual aplicativo está trabalhando.",
          "Confira quais arquivos ou e-mails ele tem disponíveis.",
          "Peça apenas o que a tarefa precisa.",
        ],
        example:
          "No Gmail você pede o resumo de uma conversa com clientes. O Gemini lê essa conversa, não toda a sua caixa de entrada.",
        mistake:
          "Dar acesso amplo a todo o Drive para uma tarefa que usa um único documento.",
      },
      {
        title: "2. O que pode ler e o que não pode",
        explain: [
          "O Gemini lê o conteúdo a que tem acesso: o e-mail aberto, o documento selecionado ou os arquivos que você inclui. Não lê o que você não deu a ele. Mas pode ler dados pessoais dentro desses arquivos.",
          "Antes de pedir um resumo, pergunte-se se o conteúdo tem dados pessoais ou confidenciais. Se tiver e não for necessário, retire.",
        ],
        terms: [
          {
            term: "Dado pessoal",
            def: "Informação que identifica uma pessoa, como nome, telefone ou documento.",
          },
          {
            term: "Contexto",
            def: "O que você mostra à IA para ela responder com a informação certa.",
          },
        ],
        how: [
          "Confira se o conteúdo tem dados pessoais.",
          "Retire-os se não forem necessários para a tarefa.",
          "Peça o resultado só com o que é preciso.",
        ],
        example:
          "Você pede o resumo de uma conversa com telefones de clientes. Pede que seja resumida sem incluir os telefones.",
        mistake:
          "Pedir o resumo de uma conversa com dados de menores ou de pacientes sem que seja necessário.",
      },
      {
        title: "3. Pedir com contexto preciso",
        explain: [
          "Quanto mais preciso o pedido, melhor o resultado. Diga qual parte importa, para quem é, em que tom e qual resultado espera.",
          "Um pedido sem contexto gera um texto genérico que depois você precisa reescrever.",
        ],
        terms: [
          {
            term: "Resumo",
            def: "Versão curta do conteúdo com os pontos principais.",
          },
          {
            term: "Tom",
            def: "Maneira de escrever: formal, próxima, técnica, conforme o destinatário.",
          },
        ],
        how: [
          "Diga qual parte importa.",
          "Diga para quem é o texto.",
          "Diga o formato e a extensão que precisa.",
        ],
        example:
          "«Resuma esta conversa em três pontos para a diretora, em tom formal, com as datas de entrega.»",
        mistake: "Pedir «faça um resumo» sem dizer para que nem para quem.",
      },
      {
        title: "4. Revisar antes de enviar",
        explain: [
          "O que o Gemini redige ou resume é um rascunho. Antes de enviar ou compartilhar, compare os dados com o original: datas, números, nomes e compromissos.",
          "Se algo não estiver no original, não o mantenha, mesmo que soe bem.",
        ],
        terms: [
          {
            term: "Rascunho",
            def: "Versão inicial que ainda deve ser revisada antes de usar.",
          },
          {
            term: "Compromisso",
            def: "Ação ou data que alguém aceita; deve coincidir com o original.",
          },
        ],
        how: [
          "Compare datas, números e nomes com o original.",
          "Revise compromissos e responsabilidades.",
          "Envie só depois de revisar.",
        ],
        example:
          "O resumo diz «entrega na sexta». A conversa original diz «quinta». Você corrige antes de enviar.",
        mistake:
          "Enviar o e-mail redigido pela IA sem lê-lo contra o original.",
      },
    ],
    summary: [
      "O Gemini no Workspace trabalha sobre o conteúdo a que você dá acesso.",
      "Peça só o que a tarefa precisa: não dê acesso amplo se não for necessário.",
      "Retire os dados pessoais que não são necessários antes de pedir um resumo.",
      "Um pedido com contexto preciso gera um resultado melhor.",
      "Todo rascunho é comparado com o original antes de ser enviado.",
    ],
    check: [
      {
        q: "Que conteúdo o Gemini lê no Workspace?",
        options: [
          "Todo o seu e-mail e todo o seu Drive, sempre.",
          "O conteúdo a que você deu acesso para aquela tarefa.",
          "Só o que você digita no chat, nunca os arquivos.",
        ],
        correct: 1,
        feedback:
          "O Gemini trabalha sobre o conteúdo e os arquivos a que você dá acesso para a tarefa.",
      },
      {
        q: "Você vai pedir o resumo de uma conversa com telefones de clientes. O que faz?",
        options: [
          "Peço do jeito que está, para sair completo.",
          "Peço o resumo sem os dados pessoais que não são necessários.",
          "Compartilho com a equipe toda antes.",
        ],
        correct: 1,
        feedback:
          "Dados pessoais que a tarefa não precisa devem ficar de fora.",
      },
      {
        q: "O resumo do Gemini traz uma data diferente da conversa original. O que faz?",
        options: [
          "Envio, porque a IA a escreveu.",
          "Corrijo com a data do original antes de enviar.",
          "Peço que troque pela que soe melhor.",
        ],
        correct: 1,
        feedback:
          "Todo rascunho é comparado com o original; a data correta é a da conversa.",
      },
    ],
  },
};
