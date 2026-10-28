// OVA «El Tablero de Delegación» (ILAB-M5-OVA3). Delegar en Claude: qué tareas delegar, cómo definir el encargo y cómo supervisar el resultado.
export default {
  es: {
    badge: "Módulo 5 · Explicación",
    title: "El Tablero de Delegación",
    subtitle:
      "Qué tareas conviene delegar en Claude, cómo definir un encargo claro y cómo supervisar el resultado",
    intro:
      "Delegar no es entregar y olvidar. Un buen encargo tiene objetivo, contexto, límites y criterio de revisión, igual que cuando delegas en una persona del equipo. Aquí aprenderás el vocabulario de la delegación y a decidir qué tarea entregar, cómo hacerlo y cómo comprobar el resultado.",
    objectives: [
      "Decidir qué tareas conviene delegar y cuáles no",
      "Redactar un encargo con objetivo, contexto y límites",
      "Definir criterios para revisar el resultado",
      "Reconocer los errores frecuentes al delegar",
    ],
    sections: [
      {
        title: "1. Qué conviene delegar",
        explain: [
          "Conviene delegar tareas repetitivas, de borrador o de transformación: resumir, reescribir, ordenar datos, proponer opciones. Son tareas donde el resultado se revisa rápido.",
          "No conviene delegar sin supervisión decisiones que tienen consecuencias graves, datos confidenciales sin permiso o asuntos legales y médicos sin revisión de un experto.",
        ],
        terms: [
          {
            term: "Delegar",
            def: "Encargar una tarea a Claude y definir qué resultado se espera.",
          },
          {
            term: "Supervisión",
            def: "Revisión humana del resultado antes de usarlo.",
          },
        ],
        how: [
          "Pregunta si la tarea es de borrador o de decisión.",
          "Si es de decisión, reserva la última palabra para ti.",
          "Si es de borrador, delega y revisa.",
        ],
        example:
          "Delegas la redacción de tres versiones de un anuncio. Eliges una tú. No delegas la decisión de precio.",
        mistake:
          "Delegar la decisión final de algo con consecuencias sin revisarla.",
      },
      {
        title: "2. Cómo redactar un encargo",
        explain: [
          "Un encargo claro indica el objetivo, el contexto que Claude necesita, los límites y el formato del resultado. Un encargo vago produce un resultado vago.",
          "El contexto incluye quién lo lee, para qué y qué ya se sabe. Los límites incluyen lo que no debe hacer, como inventar cifras.",
        ],
        terms: [
          {
            term: "Encargo",
            def: "Instrucción completa que describe la tarea, el contexto y el resultado esperado.",
          },
          {
            term: "Límite",
            def: "Restricción explícita, como no inventar datos o no usar nombres reales.",
          },
        ],
        how: [
          "Escribe el objetivo en una frase.",
          "Agrega el contexto y el destinatario.",
          "Indica el formato y los límites.",
        ],
        example:
          "«Redacta tres asuntos de correo para clientes que no pagaron. Tono cordial. No inventes fechas: usa [fecha] para completarlas.»",
        mistake:
          "Escribir «hazme un correo» y esperar que Claude adivine el tono, el destinatario y el caso.",
      },
      {
        title: "3. Cómo revisar el resultado",
        explain: [
          "Revisa el resultado contra el criterio que definiste en el encargo: ¿cumple el formato?, ¿respeta los límites?, ¿tiene datos que no estaban en el contexto?",
          "Si el resultado no cumple, no lo arregles a ciegas: indica qué falló y pide una nueva versión.",
        ],
        terms: [
          {
            term: "Criterio de revisión",
            def: "Lista de condiciones que el resultado debe cumplir para aceptarse.",
          },
          {
            term: "Alucinación",
            def: "Dato que el modelo produce con seguridad y que no está en el contexto.",
          },
        ],
        how: [
          "Compara el resultado con el criterio.",
          "Marca los datos que no estaban en el contexto.",
          "Pide una corrección concreta, no una versión nueva genérica.",
        ],
        example:
          "El correo trae una fecha que no diste. La marcas, la verificas y pides que use [fecha] en su lugar.",
        mistake:
          "Aceptar el resultado porque «suena bien» sin contrastarlo con el encargo.",
      },
      {
        title: "4. Errores frecuentes",
        explain: [
          "Tres errores aparecen casi siempre: encargos sin contexto, ausencia de límites y falta de revisión final. Cada uno produce resultados que parecen buenos y no lo son.",
          "Delegar bien es un hábito: escribe el encargo como si lo leyera alguien nuevo en el equipo.",
        ],
        terms: [
          {
            term: "Contexto",
            def: "Información previa que Claude necesita para responder bien.",
          },
          {
            term: "Revisión final",
            def: "Última comprobación humana antes de usar o enviar.",
          },
        ],
        how: [
          "Relee el encargo como si fuera de otra persona.",
          "Confirma que tiene límites.",
          "Reserva siempre la revisión final.",
        ],
        example:
          "Un encargo que dice «mejora este texto» sin decir para quién. Lo corriges con el destinatario y el tono.",
        mistake:
          "Enviar el resultado delegado sin releerlo porque el encargo se entregó bien.",
      },
    ],
    summary: [
      "Delega borradores y transformaciones; reserva para ti las decisiones con consecuencias.",
      "Un encargo claro tiene objetivo, contexto, límites y formato.",
      "Revisa el resultado contra el criterio que definiste antes de aceptarlo.",
      "Si algo no cumple, pide una corrección concreta, no una versión genérica.",
      "La revisión final siempre es humana.",
    ],
    check: [
      {
        q: "¿Qué tarea conviene delegar sin reservarte la revisión?",
        options: [
          "Decidir el precio final de un producto.",
          "Redactar tres versiones de un anuncio para que tú elijas.",
          "Aceptar un contrato legal sin leerlo.",
        ],
        correct: 1,
        feedback:
          "Los borradores se delegan y se revisan; las decisiones con consecuencias quedan contigo.",
      },
      {
        q: "¿Qué debe incluir un buen encargo?",
        options: [
          "Solo la palabra «hazme» seguida del tema.",
          "Objetivo, contexto, límites y formato del resultado.",
          "Solo la longitud del texto.",
        ],
        correct: 1,
        feedback:
          "Un encargo claro indica objetivo, contexto, límites y formato; así el resultado tiene un criterio.",
      },
      {
        q: "El resultado trae una fecha que no diste en el encargo. ¿Qué haces?",
        options: [
          "La acepto, porque suena bien.",
          "La marco, la verifico y pido que use un espacio para completarla.",
          "La cambio a ojo por una fecha que me parezca razonable.",
        ],
        correct: 1,
        feedback:
          "Un dato que no estaba en el contexto debe verificarse; no se acepta ni se inventa.",
      },
    ],
  },
  en: {
    badge: "Module 5 · Explanation",
    title: "The Delegation Board",
    subtitle:
      "Which tasks to delegate to Claude, how to write a clear brief and how to supervise the result",
    intro:
      "Delegating is not handing over and forgetting. A good brief has an objective, context, limits and a review criterion, just as when you delegate to a member of your team. Here you will learn the vocabulary of delegation and how to decide which task to hand over, how to do it and how to check the result.",
    objectives: [
      "Decide which tasks are worth delegating and which are not",
      "Write a brief with objective, context and limits",
      "Define criteria for reviewing the result",
      "Recognize common mistakes when delegating",
    ],
    sections: [
      {
        title: "1. What is worth delegating",
        explain: [
          "It is worth delegating repetitive, drafting or transformation tasks: summarizing, rewriting, organizing data, proposing options. These are tasks where the result is quick to review.",
          "Do not delegate, without supervision, decisions with serious consequences, confidential data without permission, or legal and medical matters without review by an expert.",
        ],
        terms: [
          {
            term: "Delegate",
            def: "Assigning a task to Claude and defining the result you expect.",
          },
          {
            term: "Supervision",
            def: "Human review of the result before using it.",
          },
        ],
        how: [
          "Ask whether the task is drafting or decision-making.",
          "If it is a decision, keep the final say for yourself.",
          "If it is drafting, delegate and review.",
        ],
        example:
          "You delegate writing three versions of an ad. You choose one yourself. You do not delegate the pricing decision.",
        mistake:
          "Delegating the final decision on something with consequences without reviewing it.",
      },
      {
        title: "2. How to write a brief",
        explain: [
          "A clear brief states the objective, the context Claude needs, the limits and the format of the result. A vague brief produces a vague result.",
          "Context includes who reads it, what for and what is already known. Limits include what must not be done, such as inventing figures.",
        ],
        terms: [
          {
            term: "Brief",
            def: "Complete instruction describing the task, the context and the expected result.",
          },
          {
            term: "Limit",
            def: "An explicit constraint, such as not inventing data or not using real names.",
          },
        ],
        how: [
          "Write the objective in one sentence.",
          "Add the context and the reader.",
          "State the format and the limits.",
        ],
        example:
          "«Write three email subject lines for clients who have not paid. Warm tone. Do not invent dates: use [date] as a placeholder.»",
        mistake:
          "Writing «make me an email» and expecting Claude to guess the tone, reader and situation.",
      },
      {
        title: "3. How to review the result",
        explain: [
          "Review the result against the criterion you defined in the brief: does it meet the format, respect the limits, and contain data that was not in the context?",
          "If the result does not meet it, do not fix it blindly: say what failed and ask for a new version.",
        ],
        terms: [
          {
            term: "Review criterion",
            def: "The list of conditions the result must meet to be accepted.",
          },
          {
            term: "Hallucination",
            def: "Data the model produces with confidence that is not in the context.",
          },
        ],
        how: [
          "Compare the result with the criterion.",
          "Mark any data that was not in the context.",
          "Ask for a specific correction, not a generic new version.",
        ],
        example:
          "The email includes a date you did not give. You mark it, verify it and ask it to use [date] instead.",
        mistake:
          "Accepting the result because it «sounds good» without checking it against the brief.",
      },
      {
        title: "4. Common mistakes",
        explain: [
          "Three mistakes come up almost always: briefs without context, missing limits and no final review. Each one produces results that look good and are not.",
          "Delegating well is a habit: write the brief as if someone new on the team were going to read it.",
        ],
        terms: [
          {
            term: "Context",
            def: "Background information Claude needs to answer well.",
          },
          {
            term: "Final review",
            def: "The last human check before using or sending.",
          },
        ],
        how: [
          "Reread the brief as if it were someone else's.",
          "Confirm it has limits.",
          "Always keep the final review for yourself.",
        ],
        example:
          "A brief that says «improve this text» without saying for whom. You fix it by adding the reader and the tone.",
        mistake:
          "Sending the delegated result without rereading it because the brief was well written.",
      },
    ],
    summary: [
      "Delegate drafts and transformations; keep decisions with consequences for yourself.",
      "A clear brief has an objective, context, limits and format.",
      "Review the result against the criterion you defined before accepting it.",
      "If something does not meet it, ask for a specific correction, not a generic version.",
      "The final review is always human.",
    ],
    check: [
      {
        q: "Which task is worth delegating without keeping the review for yourself?",
        options: [
          "Deciding the final price of a product.",
          "Drafting three versions of an ad for you to choose from.",
          "Accepting a legal contract without reading it.",
        ],
        correct: 1,
        feedback:
          "Drafts are delegated and reviewed; decisions with consequences stay with you.",
      },
      {
        q: "What should a good brief include?",
        options: [
          "Only the word «make me» followed by the topic.",
          "Objective, context, limits and the format of the result.",
          "Only the length of the text.",
        ],
        correct: 1,
        feedback:
          "A clear brief states objective, context, limits and format, so the result has a criterion.",
      },
      {
        q: "The result includes a date you did not give in the brief. What do you do?",
        options: [
          "I accept it, because it sounds good.",
          "I mark it, verify it and ask for a placeholder to complete it.",
          "I change it to a date I think is reasonable.",
        ],
        correct: 1,
        feedback:
          "A data point that was not in the context must be verified; it is neither accepted nor invented.",
      },
    ],
  },
  pt: {
    badge: "Módulo 5 · Explicação",
    title: "O Quadro de Delegação",
    subtitle:
      "Quais tarefas delegar ao Claude, como definir um pedido claro e como supervisionar o resultado",
    intro:
      "Delegar não é entregar e esquecer. Um bom encargo tem objetivo, contexto, limites e critério de revisão, como quando você delega a alguém da equipe. Aqui você vai aprender o vocabulário da delegação e a decidir qual tarefa entregar, como fazer e como conferir o resultado.",
    objectives: [
      "Decidir quais tarefas vale delegar e quais não",
      "Redigir um encargo com objetivo, contexto e limites",
      "Definir critérios para revisar o resultado",
      "Reconhecer os erros frequentes ao delegar",
    ],
    sections: [
      {
        title: "1. O que vale delegar",
        explain: [
          "Vale delegar tarefas repetitivas, de rascunho ou de transformação: resumir, reescrever, organizar dados, propor opções. São tarefas em que o resultado é rápido de revisar.",
          "Não delegue sem supervisão decisões com consequências graves, dados confidenciais sem permissão ou assuntos jurídicos e médicos sem revisão de um especialista.",
        ],
        terms: [
          {
            term: "Delegar",
            def: "Encarregar uma tarefa ao Claude e definir o resultado que se espera.",
          },
          {
            term: "Supervisão",
            def: "Revisão humana do resultado antes de usar.",
          },
        ],
        how: [
          "Pergunte se a tarefa é de rascunho ou de decisão.",
          "Se for de decisão, reserve a última palavra para você.",
          "Se for de rascunho, delegue e revise.",
        ],
        example:
          "Você delega a redação de três versões de um anúncio e escolhe uma. Não delega a decisão de preço.",
        mistake:
          "Delegar a decisão final de algo com consequências sem revisá-la.",
      },
      {
        title: "2. Como redigir um encargo",
        explain: [
          "Um encargo claro indica o objetivo, o contexto de que o Claude precisa, os limites e o formato do resultado. Um encargo vago gera um resultado vago.",
          "O contexto inclui quem lê, para que e o que já se sabe. Os limites incluem o que não deve ser feito, como inventar números.",
        ],
        terms: [
          {
            term: "Encargo",
            def: "Instrução completa que descreve a tarefa, o contexto e o resultado esperado.",
          },
          {
            term: "Limite",
            def: "Restrição explícita, como não inventar dados ou não usar nomes reais.",
          },
        ],
        how: [
          "Escreva o objetivo em uma frase.",
          "Acrescente o contexto e o destinatário.",
          "Indique o formato e os limites.",
        ],
        example:
          "«Redija três assuntos de e-mail para clientes que não pagaram. Tom cordial. Não invente datas: use [data] para completar.»",
        mistake:
          "Escrever «faça um e-mail» e esperar que o Claude adivinhe o tom, o destinatário e o caso.",
      },
      {
        title: "3. Como revisar o resultado",
        explain: [
          "Revise o resultado contra o critério que você definiu no encargo: cumpre o formato? respeita os limites? tem dados que não estavam no contexto?",
          "Se o resultado não cumpre, não corrija às cegas: diga o que falhou e peça uma nova versão.",
        ],
        terms: [
          {
            term: "Critério de revisão",
            def: "Lista de condições que o resultado deve cumprir para ser aceito.",
          },
          {
            term: "Alucinação",
            def: "Dado que o modelo produz com segurança e que não está no contexto.",
          },
        ],
        how: [
          "Compare o resultado com o critério.",
          "Marque os dados que não estavam no contexto.",
          "Peça uma correção específica, não uma versão nova genérica.",
        ],
        example:
          "O e-mail traz uma data que você não deu. Você marca, confere e pede que use [data] no lugar.",
        mistake:
          "Aceitar o resultado porque «soa bem» sem confrontá-lo com o encargo.",
      },
      {
        title: "4. Erros frequentes",
        explain: [
          "Três erros aparecem quase sempre: encargos sem contexto, falta de limites e ausência de revisão final. Cada um gera resultados que parecem bons e não são.",
          "Delegar bem é um hábito: escreva o encargo como se fosse lido por alguém novo na equipe.",
        ],
        terms: [
          {
            term: "Contexto",
            def: "Informação prévia de que o Claude precisa para responder bem.",
          },
          {
            term: "Revisão final",
            def: "A última conferência humana antes de usar ou enviar.",
          },
        ],
        how: [
          "Releia o encargo como se fosse de outra pessoa.",
          "Confirme que ele tem limites.",
          "Reserve sempre a revisão final para você.",
        ],
        example:
          "Um encargo que diz «melhore este texto» sem dizer para quem. Você corrige acrescentando o destinatário e o tom.",
        mistake:
          "Enviar o resultado delegado sem reler, porque o encargo estava bem escrito.",
      },
    ],
    summary: [
      "Delegue rascunhos e transformações; reserve para você as decisões com consequências.",
      "Um encargo claro tem objetivo, contexto, limites e formato.",
      "Revise o resultado contra o critério que definiu antes de aceitar.",
      "Se algo não cumpre, peça uma correção específica, não uma versão genérica.",
      "A revisão final é sempre humana.",
    ],
    check: [
      {
        q: "Qual tarefa vale delegar sem reservar a revisão para você?",
        options: [
          "Decidir o preço final de um produto.",
          "Redigir três versões de um anúncio para você escolher.",
          "Aceitar um contrato jurídico sem lê-lo.",
        ],
        correct: 1,
        feedback:
          "Rascunhos se delegam e se revisam; decisões com consequências ficam com você.",
      },
      {
        q: "O que deve incluir um bom encargo?",
        options: [
          "Só a palavra «faça» seguida do tema.",
          "Objetivo, contexto, limites e formato do resultado.",
          "Só a extensão do texto.",
        ],
        correct: 1,
        feedback:
          "Um encargo claro indica objetivo, contexto, limites e formato; assim o resultado tem um critério.",
      },
      {
        q: "O resultado traz uma data que você não deu no encargo. O que faz?",
        options: [
          "Aceito, porque soa bem.",
          "Marco, confiro e peço um espaço para completá-la.",
          "Troco por uma data que acho razoável.",
        ],
        correct: 1,
        feedback:
          "Um dado que não estava no contexto precisa ser conferido; não se aceita nem se inventa.",
      },
    ],
  },
};
