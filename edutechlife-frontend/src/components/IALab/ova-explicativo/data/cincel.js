// OVA «El Cincel» (ILAB-M1-OVA2). Qué es un prompt, sus partes y cómo lee la IA lo que escribes.
export default {
  es: {
    badge: "Módulo 1 · Explicación",
    title: "El Cincel",
    subtitle:
      "Qué es un prompt, cómo se arma y por qué la IA responde mejor a una instrucción clara",
    intro:
      "El prompt es la instrucción que escribes para la IA. Como el cincel del artesano, da forma al resultado: cuanto más preciso el golpe, mejor la pieza. Aquí aprenderás las partes de un prompt y cómo la IA interpreta lo que escribes.",
    objectives: [
      "Definir qué es un prompt y para qué sirve",
      "Identificar sus partes: rol, tarea, formato, contexto y restricciones",
      "Explicar qué es un token y la ventana de contexto",
      "Corregir un prompt vago paso a paso",
    ],
    sections: [
      {
        title: "1. Qué es un prompt",
        explain: [
          "Un prompt es todo lo que escribes para pedirle algo a la IA: una pregunta, una orden, un texto de ejemplo o una combinación de estos.",
          "La IA no lee tu intención: lee tus palabras. Lo que no escribes, no lo sabe. Por eso un buen prompt dice lo que quieres con claridad.",
        ],
        terms: [
          {
            term: "Prompt",
            def: "La instrucción o pregunta que escribes para obtener una respuesta de la IA.",
          },
          {
            term: "Respuesta",
            def: "Lo que la IA genera a partir de tu prompt; puede variar aunque repitas la pregunta.",
          },
        ],
        how: [
          "Escribes tu pedido.",
          "La IA lo interpreta con las palabras que usaste.",
          "Genera una respuesta. Si no te sirve, ajustas el prompt y repites.",
        ],
        example:
          "«Escribe algo sobre el agua» da una respuesta general. «Explica a estudiantes de 10 años por qué el agua se evapora, en cinco frases» da una respuesta útil.",
        mistake:
          "Pensar que la IA sabe el contexto que tienes en la cabeza. Si no lo escribes, no existe para ella.",
      },
      {
        title: "2. Las cinco partes de un prompt",
        explain: [
          "Un prompt completo suele tener cinco partes. No todas son obligatorias, pero cuantas más incluyas, menos supondrá la IA.",
          "Rol: el papel que debe asumir. Tarea: la acción concreta. Formato: cómo debe verse la respuesta. Contexto: para quién y para qué. Restricciones: lo que no debe hacer.",
        ],
        terms: [
          {
            term: "Rol",
            def: "El papel que la IA asume, por ejemplo «profesor de primaria» o «editor».",
          },
          {
            term: "Tarea",
            def: "La acción concreta que debe realizar: resumir, comparar, redactar, explicar.",
          },
          {
            term: "Formato",
            def: "La forma de la respuesta: lista, tabla, tres párrafos, extensión máxima.",
          },
          {
            term: "Contexto",
            def: "La información sobre la situación: público, propósito, datos que sí debe usar.",
          },
          {
            term: "Restricción",
            def: "Un límite: lo que no debe incluir o hacer.",
          },
        ],
        how: [
          "Empieza por la tarea: qué quieres que haga.",
          "Añade el contexto: para quién es.",
          "Define el formato y las restricciones.",
          "Si quieres un tono o un punto de vista, agrega el rol.",
        ],
        example:
          "«Actúa como editor escolar. Resume este texto para padres de familia en tres párrafos, sin tecnicismos ni nombres de estudiantes.» Tiene rol, tarea, contexto, formato y restricción.",
        mistake:
          "Escribir solo la tarea, sin contexto ni formato, y luego quejarse de que la respuesta es genérica.",
      },
      {
        title: "3. Cómo lee la IA tu prompt",
        explain: [
          "La IA procesa el texto en tokens, fragmentos de palabras. Trabaja con una cantidad limitada de texto a la vez: la ventana de contexto. Lo que queda fuera puede perderse.",
          "Además, muchas herramientas tienen cierta aleatoriedad: la misma pregunta puede dar respuestas distintas. Por eso conviene revisar y comparar, no confiar en una sola respuesta.",
        ],
        terms: [
          {
            term: "Token",
            def: "Fragmento de texto que la IA procesa; una palabra puede ser uno o varios tokens.",
          },
          {
            term: "Ventana de contexto",
            def: "Cantidad de texto que la IA puede considerar a la vez.",
          },
          {
            term: "Aleatoriedad",
            def: "Variación natural de las respuestas aunque el prompt sea el mismo.",
          },
        ],
        how: [
          "Pon lo más importante al principio del prompt.",
          "En conversaciones largas, recuerda las instrucciones clave.",
          "Compara dos respuestas antes de decidir.",
        ],
        example:
          "Si pegas diez páginas y al final pides «usa solo la sección 2», la IA puede no recordar bien la sección 2. Pide la sección por su título.",
        mistake:
          "Creer que la respuesta es siempre la misma. Cambia con cada intento y con la longitud del texto.",
      },
      {
        title: "4. Corregir un prompt vago",
        explain: [
          "Un prompt vago deja demasiado a la suposición. Corregirlo es agregar lo que falta: la tarea clara, el público, el formato y un límite.",
          "Este método sirve para cualquier pedido: pregúntate qué falta y añádelo.",
        ],
        terms: [
          {
            term: "Prompt vago",
            def: "Instrucción sin tarea clara, sin contexto o sin formato.",
          },
          {
            term: "Iterar",
            def: "Mejorar el prompt paso a paso según lo que la respuesta te devuelve.",
          },
        ],
        how: [
          "Lee la respuesta y di qué te falta.",
          "Añade la parte que falta al prompt.",
          "Repite hasta que la respuesta sirva para tu fin.",
        ],
        example:
          "«Hazme un plan» → «Hazme un plan de estudio de cuatro semanas para álgebra, con dos horas diarias, en tabla semanal».",
        mistake:
          "Dar muchas órdenes en un solo mensaje: la IA puede cumplir solo una parte. Pide una cosa por vez o numera las tareas.",
      },
    ],
    summary: [
      "Un prompt es la instrucción que escribes; la IA solo sabe lo que escribes.",
      "Un prompt completo tiene tarea, rol, formato, contexto y restricciones.",
      "La IA trabaja con tokens y una ventana de contexto limitada; pon lo importante claro y al inicio.",
      "La respuesta puede variar: compara y revisa antes de usarla.",
      "Para corregir un prompt vago, agrega lo que falta y repite.",
    ],
    check: [
      {
        q: "¿Qué son las cinco partes de un prompt completo?",
        options: [
          "Rol, tarea, formato, contexto y restricciones.",
          "Título, fecha, autor, precio y correo.",
          "Inicio, medio, final, firma y número de página.",
        ],
        correct: 0,
        feedback:
          "Rol, tarea, formato, contexto y restricciones son las piezas que hacen que la respuesta sea precisa.",
      },
      {
        q: "¿Qué es la ventana de contexto?",
        options: [
          "La pantalla donde se muestra la respuesta.",
          "La cantidad de texto que la IA puede considerar a la vez.",
          "El tiempo que tarda la IA en responder.",
        ],
        correct: 1,
        feedback:
          "La ventana de contexto es el límite de texto que la IA procesa a la vez; lo que queda fuera puede perderse.",
      },
      {
        q: "Tu prompt dice solo «haz un resumen». ¿Qué debes hacer para mejorarlo?",
        options: [
          "Dejarlo así, la IA sabe qué hacer.",
          "Agregar para quién es, la extensión y el formato que necesitas.",
          "Repetirlo tres veces seguidas.",
        ],
        correct: 1,
        feedback:
          "Agregar público, extensión y formato le da a la IA lo que le falta para acertar.",
      },
    ],
  },
  en: {
    badge: "Module 1 · Explanation",
    title: "The Chisel",
    subtitle:
      "What a prompt is, how it is built, and why AI answers better to a clear instruction",
    intro:
      "A prompt is the instruction you write for the AI. Like the artisan's chisel, it shapes the result: the more precise the stroke, the better the piece. Here you will learn the parts of a prompt and how the AI interprets what you write.",
    objectives: [
      "Define what a prompt is and what it is for",
      "Identify its parts: role, task, format, context and constraints",
      "Explain what a token and the context window are",
      "Fix a vague prompt step by step",
    ],
    sections: [
      {
        title: "1. What a prompt is",
        explain: [
          "A prompt is everything you write to ask the AI for something: a question, an instruction, an example text, or a mix of these.",
          "The AI does not read your intention: it reads your words. What you do not write, it does not know. That is why a good prompt states what you want clearly.",
        ],
        terms: [
          {
            term: "Prompt",
            def: "The instruction or question you write to get an answer from the AI.",
          },
          {
            term: "Response",
            def: "What the AI generates from your prompt; it can vary even if you repeat the question.",
          },
        ],
        how: [
          "You write your request.",
          "The AI interprets it using the words you used.",
          "It generates a response. If it does not serve you, you adjust the prompt and repeat.",
        ],
        example:
          "«Write something about water» gives a general answer. «Explain to 10-year-olds why water evaporates, in five sentences» gives a useful one.",
        mistake:
          "Thinking the AI knows the context in your head. If you do not write it, it does not exist for the AI.",
      },
      {
        title: "2. The five parts of a prompt",
        explain: [
          "A complete prompt usually has five parts. Not all are mandatory, but the more you include, the less the AI has to guess.",
          "Role: the part it plays. Task: the concrete action. Format: how the answer should look. Context: for whom and why. Constraints: what it must not do.",
        ],
        terms: [
          {
            term: "Role",
            def: "The part the AI plays, for example «primary school teacher» or «editor».",
          },
          {
            term: "Task",
            def: "The concrete action to carry out: summarize, compare, draft, explain.",
          },
          {
            term: "Format",
            def: "The shape of the answer: list, table, three paragraphs, maximum length.",
          },
          {
            term: "Context",
            def: "Information about the situation: audience, purpose, data it may use.",
          },
          {
            term: "Constraint",
            def: "A limit: what it must not include or do.",
          },
        ],
        how: [
          "Start with the task: what you want it to do.",
          "Add the context: who it is for.",
          "Define the format and the constraints.",
          "If you want a tone or a point of view, add the role.",
        ],
        example:
          "«Act as a school editor. Summarize this text for parents in three paragraphs, with no jargon and no student names.» It has role, task, context, format and a constraint.",
        mistake:
          "Writing only the task, with no context or format, and then complaining that the answer is generic.",
      },
      {
        title: "3. How the AI reads your prompt",
        explain: [
          "The AI processes text in tokens, fragments of words. It works with a limited amount of text at a time: the context window. What falls outside it can be lost.",
          "Many tools also have some randomness: the same question can get different answers. So review and compare, rather than trusting a single answer.",
        ],
        terms: [
          {
            term: "Token",
            def: "A text fragment the AI processes; one word can be one or several tokens.",
          },
          {
            term: "Context window",
            def: "The amount of text the AI can consider at once.",
          },
          {
            term: "Randomness",
            def: "The natural variation in answers even when the prompt is the same.",
          },
        ],
        how: [
          "Put the most important thing at the start of the prompt.",
          "In long conversations, restate the key instructions.",
          "Compare two answers before you decide.",
        ],
        example:
          "If you paste ten pages and then ask «use only section 2», the AI may not recall section 2 well. Ask for the section by its title.",
        mistake:
          "Believing the answer is always the same. It changes with each attempt and with the length of the text.",
      },
      {
        title: "4. Fixing a vague prompt",
        explain: [
          "A vague prompt leaves too much to guessing. Fixing it means adding what is missing: a clear task, the audience, the format and a limit.",
          "This method works for any request: ask yourself what is missing and add it.",
        ],
        terms: [
          {
            term: "Vague prompt",
            def: "An instruction with no clear task, no context or no format.",
          },
          {
            term: "Iterate",
            def: "To improve the prompt step by step based on what the answer returns.",
          },
        ],
        how: [
          "Read the answer and say what is missing.",
          "Add the missing part to the prompt.",
          "Repeat until the answer serves your purpose.",
        ],
        example:
          "«Make me a plan» → «Make a four-week study plan for algebra, two hours a day, as a weekly table».",
        mistake:
          "Giving many orders in one message: the AI may do only part of them. Ask for one thing at a time, or number the tasks.",
      },
    ],
    summary: [
      "A prompt is the instruction you write; the AI only knows what you write.",
      "A complete prompt has a task, a role, a format, a context and constraints.",
      "The AI works with tokens and a limited context window; put what matters clearly and first.",
      "The answer can vary: compare and review before using it.",
      "To fix a vague prompt, add what is missing and repeat.",
    ],
    check: [
      {
        q: "What are the five parts of a complete prompt?",
        options: [
          "Role, task, format, context and constraints.",
          "Title, date, author, price and email.",
          "Start, middle, end, signature and page number.",
        ],
        correct: 0,
        feedback:
          "Role, task, format, context and constraints are the pieces that make the answer precise.",
      },
      {
        q: "What is the context window?",
        options: [
          "The screen where the answer is shown.",
          "The amount of text the AI can consider at once.",
          "The time the AI takes to answer.",
        ],
        correct: 1,
        feedback:
          "The context window is the limit of text the AI processes at once; what falls outside can be lost.",
      },
      {
        q: "Your prompt only says «make a summary». How do you improve it?",
        options: [
          "Leave it as is, the AI knows what to do.",
          "Add who it is for, the length and the format you need.",
          "Repeat it three times in a row.",
        ],
        correct: 1,
        feedback:
          "Adding audience, length and format gives the AI what it needs to get it right.",
      },
    ],
  },
  pt: {
    badge: "Módulo 1 · Explicação",
    title: "O Cinzel",
    subtitle:
      "O que é um prompt, como ele se monta e por que a IA responde melhor a uma instrução clara",
    intro:
      "O prompt é a instrução que você escreve para a IA. Como o cinzel do artesão, ele dá forma ao resultado: quanto mais preciso o golpe, melhor a peça. Aqui você vai aprender as partes de um prompt e como a IA interpreta o que você escreve.",
    objectives: [
      "Definir o que é um prompt e para que serve",
      "Identificar as partes: papel, tarefa, formato, contexto e restrições",
      "Explicar o que é um token e a janela de contexto",
      "Corrigir um prompt vago passo a passo",
    ],
    sections: [
      {
        title: "1. O que é um prompt",
        explain: [
          "Um prompt é tudo o que você escreve para pedir algo à IA: uma pergunta, uma ordem, um texto de exemplo ou uma mistura disso.",
          "A IA não lê a sua intenção: lê as suas palavras. O que você não escreve, ela não sabe. Por isso um bom prompt diz com clareza o que você quer.",
        ],
        terms: [
          {
            term: "Prompt",
            def: "A instrução ou pergunta que você escreve para obter uma resposta da IA.",
          },
          {
            term: "Resposta",
            def: "O que a IA gera a partir do seu prompt; pode variar mesmo se você repetir a pergunta.",
          },
        ],
        how: [
          "Você escreve o seu pedido.",
          "A IA o interpreta com as palavras que você usou.",
          "Ela gera uma resposta. Se não servir, você ajusta o prompt e repete.",
        ],
        example:
          "«Escreva algo sobre a água» dá uma resposta geral. «Explique a crianças de 10 anos por que a água evapora, em cinco frases» dá uma resposta útil.",
        mistake:
          "Achar que a IA conhece o contexto que está na sua cabeça. Se você não escreve, ele não existe para ela.",
      },
      {
        title: "2. As cinco partes de um prompt",
        explain: [
          "Um prompt completo costuma ter cinco partes. Nem todas são obrigatórias, mas quanto mais você incluir, menos a IA precisa supor.",
          "Papel: o que ela deve ser. Tarefa: a ação concreta. Formato: como a resposta deve aparecer. Contexto: para quem e para quê. Restrições: o que ela não deve fazer.",
        ],
        terms: [
          {
            term: "Papel",
            def: "O papel que a IA assume, por exemplo «professor do fundamental» ou «editor».",
          },
          {
            term: "Tarefa",
            def: "A ação concreta: resumir, comparar, redigir, explicar.",
          },
          {
            term: "Formato",
            def: "A forma da resposta: lista, tabela, três parágrafos, extensão máxima.",
          },
          {
            term: "Contexto",
            def: "Informações sobre a situação: público, finalidade, dados que ela pode usar.",
          },
          {
            term: "Restrição",
            def: "Um limite: o que não deve incluir ou fazer.",
          },
        ],
        how: [
          "Comece pela tarefa: o que você quer que ela faça.",
          "Acrescente o contexto: para quem é.",
          "Defina o formato e as restrições.",
          "Se quiser um tom ou um ponto de vista, acrescente o papel.",
        ],
        example:
          "«Aja como editor escolar. Resuma este texto para pais em três parágrafos, sem jargão e sem nomes de estudantes.» Tem papel, tarefa, contexto, formato e restrição.",
        mistake:
          "Escrever só a tarefa, sem contexto nem formato, e depois reclamar que a resposta é genérica.",
      },
      {
        title: "3. Como a IA lê o seu prompt",
        explain: [
          "A IA processa o texto em tokens, fragmentos de palavras. Ela trabalha com uma quantidade limitada de texto de cada vez: a janela de contexto. O que fica fora dela pode se perder.",
          "Além disso, muitas ferramentas têm alguma aleatoriedade: a mesma pergunta pode gerar respostas diferentes. Por isso convém revisar e comparar, em vez de confiar em uma única resposta.",
        ],
        terms: [
          {
            term: "Token",
            def: "Fragmento de texto que a IA processa; uma palavra pode ser um ou vários tokens.",
          },
          {
            term: "Janela de contexto",
            def: "Quantidade de texto que a IA pode considerar ao mesmo tempo.",
          },
          {
            term: "Aleatoriedade",
            def: "Variação natural das respostas mesmo com o mesmo prompt.",
          },
        ],
        how: [
          "Coloque o mais importante no início do prompt.",
          "Em conversas longas, repita as instruções-chave.",
          "Compare duas respostas antes de decidir.",
        ],
        example:
          "Se você cola dez páginas e no fim pede «use só a seção 2», a IA pode não lembrar bem da seção 2. Peça a seção pelo título.",
        mistake:
          "Achar que a resposta é sempre a mesma. Ela muda a cada tentativa e com o tamanho do texto.",
      },
      {
        title: "4. Corrigir um prompt vago",
        explain: [
          "Um prompt vago deixa muita coisa para a suposição. Corrigi-lo é acrescentar o que falta: uma tarefa clara, o público, o formato e um limite.",
          "Esse método serve para qualquer pedido: pergunte o que falta e acrescente.",
        ],
        terms: [
          {
            term: "Prompt vago",
            def: "Instrução sem tarefa clara, sem contexto ou sem formato.",
          },
          {
            term: "Iterar",
            def: "Melhorar o prompt passo a passo conforme a resposta devolve.",
          },
        ],
        how: [
          "Leia a resposta e diga o que falta.",
          "Acrescente a parte que falta ao prompt.",
          "Repita até a resposta servir para o seu fim.",
        ],
        example:
          "«Faça um plano para mim» → «Faça um plano de estudos de quatro semanas para álgebra, duas horas por dia, em tabela semanal».",
        mistake:
          "Dar muitas ordens em uma única mensagem: a IA pode cumprir só parte delas. Peça uma coisa por vez ou numere as tarefas.",
      },
    ],
    summary: [
      "Um prompt é a instrução que você escreve; a IA só sabe o que você escreve.",
      "Um prompt completo tem tarefa, papel, formato, contexto e restrições.",
      "A IA trabalha com tokens e uma janela de contexto limitada; coloque o que importa de forma clara e no início.",
      "A resposta pode variar: compare e revise antes de usar.",
      "Para corrigir um prompt vago, acrescente o que falta e repita.",
    ],
    check: [
      {
        q: "Quais são as cinco partes de um prompt completo?",
        options: [
          "Papel, tarefa, formato, contexto e restrições.",
          "Título, data, autor, preço e e-mail.",
          "Início, meio, fim, assinatura e número de página.",
        ],
        correct: 0,
        feedback:
          "Papel, tarefa, formato, contexto e restrições são as peças que deixam a resposta precisa.",
      },
      {
        q: "O que é a janela de contexto?",
        options: [
          "A tela onde a resposta aparece.",
          "A quantidade de texto que a IA pode considerar ao mesmo tempo.",
          "O tempo que a IA leva para responder.",
        ],
        correct: 1,
        feedback:
          "A janela de contexto é o limite de texto que a IA processa de uma vez; o que fica fora pode se perder.",
      },
      {
        q: "Seu prompt diz apenas «faça um resumo». Como melhorá-lo?",
        options: [
          "Deixar assim, a IA sabe o que fazer.",
          "Acrescentar para quem é, a extensão e o formato que você precisa.",
          "Repetir três vezes seguidas.",
        ],
        correct: 1,
        feedback:
          "Acrescentar público, extensão e formato dá à IA o que falta para acertar.",
      },
    ],
  },
};
