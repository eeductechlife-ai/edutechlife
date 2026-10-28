// OVA «El Ancla de Evidencia» (ILAB-M3-OVA5). Grounding: qué es, por qué una cita no prueba la verdad y cómo abrir una fuente.
// La interfaz exacta de Gemini cambia con el tiempo: el OVA describe el método, no los menús.
export default {
  es: {
    badge: "Módulo 3 · Explicación",
    title: "El Ancla de Evidencia",
    subtitle:
      "Grounding: qué es, por qué una cita no prueba que algo sea verdad y cómo abrir la fuente para comprobarla",
    intro:
      "Cuando Gemini responde con datos de la web o de tus archivos, puede mostrar fuentes. Eso se llama grounding: anclar la respuesta a fuentes verificables. Pero una fuente citada no garantiza que la respuesta sea correcta. Aquí aprenderás a distinguir una cita que respalda de una cita que solo decora.",
    objectives: [
      "Explicar qué es el grounding con una frase",
      "Distinguir una cita que respalda de una que solo decora",
      "Abrir una fuente y comprobar el dato",
      "Decidir qué hacer con una respuesta que no se sostiene",
    ],
    sections: [
      {
        title: "1. Qué es el grounding",
        explain: [
          "Grounding significa anclar la respuesta de la IA a fuentes reales: páginas web actuales o documentos que tú compartes. Sin grounding, la IA responde desde lo que aprendió durante su entrenamiento, que puede estar desactualizado.",
          "Con grounding, la respuesta puede traer fuentes. Ese es el punto de partida para comprobar, no el final.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "Conectar la respuesta de la IA con fuentes verificables, como la web actual o tus archivos.",
          },
          {
            term: "Conocimiento congelado",
            def: "Lo que la IA aprendió en su entrenamiento, que no se actualiza solo.",
          },
        ],
        how: [
          "Pide una respuesta con fuentes para un dato reciente.",
          "Revisa si la respuesta trae fuentes visibles.",
          "Trata las fuentes como el punto de partida para comprobar.",
        ],
        example:
          "Preguntas por el precio actual de un servicio. Sin fuentes, la cifra puede ser vieja. Con fuentes, puedes abrir la página y comprobar la fecha.",
        mistake:
          "Creer que cualquier respuesta con fuentes ya está comprobada.",
      },
      {
        title: "2. Cita que respalda y cita que decora",
        explain: [
          "Una cita respalda cuando la fuente dice exactamente lo que la respuesta afirma. Decora cuando la fuente existe, pero habla de otra cosa, de otra fecha o de otro dato.",
          "La presencia de una cita no prueba nada por sí sola. Lo que prueba es que el contenido de la fuente coincide con la afirmación.",
        ],
        terms: [
          {
            term: "Cita que respalda",
            def: "Fuente cuyo contenido coincide con la afirmación de la respuesta.",
          },
          {
            term: "Cita que decora",
            def: "Fuente real que no dice lo que la respuesta afirma.",
          },
        ],
        how: [
          "Lee la frase de la respuesta que quieres comprobar.",
          "Abre la fuente citada y busca ese dato.",
          "Si la fuente no lo dice, marca la cita como decorativa.",
        ],
        example:
          "La respuesta dice «el plazo es de 30 días» y cita un artículo. El artículo habla de 30 días para otro trámite. La cita decora.",
        mistake:
          "Aceptar la afirmación porque la fuente tiene un nombre conocido.",
      },
      {
        title: "3. Cómo abrir una fuente y comprobar",
        explain: [
          "Para comprobar, abre la fuente y busca el dato con las palabras exactas de la respuesta. Confirma la fecha de publicación y si la fuente es primaria (el original) o secundaria (quien lo cuenta).",
          "Una fuente secundaria puede ser útil, pero para un dato importante intenta llegar a la primaria.",
        ],
        terms: [
          {
            term: "Fuente primaria",
            def: "El documento u origen original del dato.",
          },
          {
            term: "Fuente secundaria",
            def: "Texto que cuenta o resume un dato tomado de otra parte.",
          },
        ],
        how: [
          "Abre la fuente y busca el dato exacto.",
          "Revisa la fecha de publicación.",
          "Si es secundaria, busca la primaria.",
        ],
        example:
          "Un blog cita una cifra de un informe oficial. Abres el informe, confirmas la cifra y usas el informe como fuente.",
        mistake: "Citar el blog como si fuera el origen del dato.",
      },
      {
        title: "4. Qué hacer si la respuesta no se sostiene",
        explain: [
          "Si el dato no aparece en la fuente, o aparece distinto, no lo uses. Pide a Gemini que corrija con la fuente real o que indique que no pudo confirmarlo.",
          "Una buena respuesta reconoce lo que no pudo comprobar. Esa honestidad vale más que una cifra segura y falsa.",
        ],
        terms: [
          {
            term: "Verificar",
            def: "Comprobar que el dato coincide con la fuente original.",
          },
          {
            term: "Incertidumbre",
            def: "Lo que la respuesta reconoce que no pudo confirmar.",
          },
        ],
        how: [
          "Marca el dato que no se sostiene.",
          "Pide una corrección con la fuente real.",
          "Si no hay fuente, descarta el dato o indica que no está confirmado.",
        ],
        example:
          "Gemini responde «el 40 % de las escuelas lo usa». La fuente no da ese número. Pides que lo corrija o que indique que no pudo confirmarlo.",
        mistake: "Usar la cifra porque la respuesta sonaba segura.",
      },
    ],
    summary: [
      "Grounding ancla la respuesta de la IA a fuentes verificables, como la web actual o tus archivos.",
      "Una cita respalda solo si la fuente dice exactamente lo que la respuesta afirma.",
      "Para comprobar, abre la fuente, busca el dato exacto y revisa la fecha.",
      "Si la fuente no sostiene el dato, no lo uses: pide corrección o descártalo.",
      "Una respuesta honesta reconoce lo que no pudo comprobar.",
    ],
    check: [
      {
        q: "¿Qué es el grounding?",
        options: [
          "Escribir la respuesta más rápido.",
          "Anclar la respuesta de la IA a fuentes verificables.",
          "Hacer que la IA hable con otra voz.",
        ],
        correct: 1,
        feedback:
          "El grounding conecta la respuesta con fuentes verificables, como la web actual o tus archivos.",
      },
      {
        q: "La respuesta cita un artículo, pero el artículo habla de otro dato. ¿Cómo lo llamas?",
        options: [
          "Una cita que respalda.",
          "Una cita que decora: la fuente existe, pero no sostiene la afirmación.",
          "Una fuente primaria.",
        ],
        correct: 1,
        feedback:
          "Una cita decora cuando la fuente existe pero no dice lo que la respuesta afirma.",
      },
      {
        q: "El dato no aparece en la fuente citada. ¿Qué haces?",
        options: [
          "Lo uso, porque la respuesta tenía fuente.",
          "Lo descarto o pido una corrección con la fuente real.",
          "Lo cambio por una cifra parecida.",
        ],
        correct: 1,
        feedback:
          "Un dato que la fuente no sostiene no se usa; se corrige con la fuente real o se descarta.",
      },
    ],
  },
  en: {
    badge: "Module 3 · Explanation",
    title: "The Evidence Anchor",
    subtitle:
      "Grounding: what it is, why a citation does not prove something is true and how to open the source to check it",
    intro:
      "When Gemini answers with data from the web or your files, it can show sources. That is called grounding: anchoring the answer to verifiable sources. But a cited source does not guarantee the answer is correct. Here you will learn to tell a citation that backs a claim from one that only decorates it.",
    objectives: [
      "Explain what grounding is in one sentence",
      "Tell a citation that backs a claim from one that only decorates it",
      "Open a source and check the fact",
      "Decide what to do with an answer that does not hold up",
    ],
    sections: [
      {
        title: "1. What grounding is",
        explain: [
          "Grounding means anchoring the AI's answer to real sources: current web pages or documents you share. Without grounding, the AI answers from what it learned during training, which may be out of date.",
          "With grounding, the answer can come with sources. That is the starting point for checking, not the end.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "Connecting the AI's answer to verifiable sources, such as the current web or your files.",
          },
          {
            term: "Frozen knowledge",
            def: "What the AI learned in training, which does not update on its own.",
          },
        ],
        how: [
          "Ask for an answer with sources for a recent fact.",
          "Check whether the answer shows visible sources.",
          "Treat the sources as the starting point for checking.",
        ],
        example:
          "You ask for the current price of a service. Without sources, the figure may be old. With sources, you can open the page and check the date.",
        mistake: "Believing that any answer with sources is already verified.",
      },
      {
        title: "2. Citation that backs and citation that decorates",
        explain: [
          "A citation backs a claim when the source says exactly what the answer states. It decorates when the source exists but talks about something else, another date or another figure.",
          "A citation proves nothing on its own. What proves something is that the source's content matches the claim.",
        ],
        terms: [
          {
            term: "Citation that backs",
            def: "A source whose content matches the claim in the answer.",
          },
          {
            term: "Citation that decorates",
            def: "A real source that does not say what the answer claims.",
          },
        ],
        how: [
          "Read the sentence in the answer you want to check.",
          "Open the cited source and look for that fact.",
          "If the source does not say it, mark the citation as decorative.",
        ],
        example:
          "The answer says «the deadline is 30 days» and cites an article. The article talks about 30 days for a different procedure. The citation decorates.",
        mistake:
          "Accepting the claim because the source has a well-known name.",
      },
      {
        title: "3. How to open a source and check",
        explain: [
          "To check, open the source and look for the fact using the exact words of the answer. Confirm the publication date and whether the source is primary (the original) or secondary (someone who reports it).",
          "A secondary source can be useful, but for an important fact, try to reach the primary one.",
        ],
        terms: [
          {
            term: "Primary source",
            def: "The original document or origin of the fact.",
          },
          {
            term: "Secondary source",
            def: "A text that reports or summarizes a fact taken from elsewhere.",
          },
        ],
        how: [
          "Open the source and look for the exact fact.",
          "Check the publication date.",
          "If it is secondary, find the primary one.",
        ],
        example:
          "A blog cites a figure from an official report. You open the report, confirm the figure and use the report as your source.",
        mistake: "Citing the blog as if it were the origin of the fact.",
      },
      {
        title: "4. What to do if the answer does not hold up",
        explain: [
          "If the fact does not appear in the source, or appears differently, do not use it. Ask Gemini to correct it with the real source or to say that it could not confirm it.",
          "A good answer admits what it could not check. That honesty is worth more than a confident, false figure.",
        ],
        terms: [
          {
            term: "Verify",
            def: "To check that the fact matches the original source.",
          },
          {
            term: "Uncertainty",
            def: "What the answer admits it could not confirm.",
          },
        ],
        how: [
          "Mark the fact that does not hold up.",
          "Ask for a correction using the real source.",
          "If there is no source, discard the fact or label it as unconfirmed.",
        ],
        example:
          "Gemini answers «40% of schools use it». The source does not give that number. You ask it to correct the figure or to say it could not confirm it.",
        mistake: "Using the figure because the answer sounded confident.",
      },
    ],
    summary: [
      "Grounding anchors the AI's answer to verifiable sources, such as the current web or your files.",
      "A citation backs a claim only if the source says exactly what the answer states.",
      "To check, open the source, look for the exact fact and review the date.",
      "If the source does not support the fact, do not use it: ask for a correction or discard it.",
      "An honest answer admits what it could not check.",
    ],
    check: [
      {
        q: "What is grounding?",
        options: [
          "Writing the answer faster.",
          "Anchoring the AI's answer to verifiable sources.",
          "Making the AI speak with a different voice.",
        ],
        correct: 1,
        feedback:
          "Grounding connects the answer to verifiable sources, such as the current web or your files.",
      },
      {
        q: "The answer cites an article, but the article talks about a different fact. What do you call it?",
        options: [
          "A citation that backs.",
          "A citation that decorates: the source exists but does not support the claim.",
          "A primary source.",
        ],
        correct: 1,
        feedback:
          "A citation decorates when the source exists but does not say what the answer claims.",
      },
      {
        q: "The fact does not appear in the cited source. What do you do?",
        options: [
          "I use it, because the answer had a source.",
          "I discard it or ask for a correction using the real source.",
          "I swap it for a similar figure.",
        ],
        correct: 1,
        feedback:
          "A fact the source does not support is not used; it is corrected with the real source or discarded.",
      },
    ],
  },
  pt: {
    badge: "Módulo 3 · Explicação",
    title: "A Âncora de Evidência",
    subtitle:
      "Grounding: o que é, por que uma citação não prova que algo é verdade e como abrir a fonte para conferir",
    intro:
      "Quando o Gemini responde com dados da web ou dos seus arquivos, pode mostrar fontes. Isso se chama grounding: ancorar a resposta em fontes verificáveis. Mas uma fonte citada não garante que a resposta esteja correta. Aqui você vai aprender a distinguir uma citação que respalda de uma que apenas enfeita.",
    objectives: [
      "Explicar o que é grounding em uma frase",
      "Distinguir uma citação que respalda de uma que apenas enfeita",
      "Abrir uma fonte e conferir o dado",
      "Decidir o que fazer com uma resposta que não se sustenta",
    ],
    sections: [
      {
        title: "1. O que é grounding",
        explain: [
          "Grounding significa ancorar a resposta da IA em fontes reais: páginas da web atuais ou documentos que você compartilha. Sem grounding, a IA responde com o que aprendeu no treinamento, que pode estar desatualizado.",
          "Com grounding, a resposta pode trazer fontes. Esse é o ponto de partida para conferir, não o ponto final.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "Conectar a resposta da IA a fontes verificáveis, como a web atual ou seus arquivos.",
          },
          {
            term: "Conhecimento congelado",
            def: "O que a IA aprendeu no treinamento, que não se atualiza sozinho.",
          },
        ],
        how: [
          "Peça uma resposta com fontes para um dado recente.",
          "Confira se a resposta mostra fontes visíveis.",
          "Trate as fontes como ponto de partida para conferir.",
        ],
        example:
          "Você pergunta o preço atual de um serviço. Sem fontes, o valor pode ser antigo. Com fontes, você abre a página e confere a data.",
        mistake: "Achar que qualquer resposta com fontes já está conferida.",
      },
      {
        title: "2. Citação que respalda e citação que enfeita",
        explain: [
          "Uma citação respalda quando a fonte diz exatamente o que a resposta afirma. Enfeita quando a fonte existe, mas fala de outra coisa, de outra data ou de outro dado.",
          "A presença de uma citação não prova nada por si só. O que prova é que o conteúdo da fonte coincide com a afirmação.",
        ],
        terms: [
          {
            term: "Citação que respalda",
            def: "Fonte cujo conteúdo coincide com a afirmação da resposta.",
          },
          {
            term: "Citação que enfeita",
            def: "Fonte real que não diz o que a resposta afirma.",
          },
        ],
        how: [
          "Leia a frase da resposta que quer conferir.",
          "Abra a fonte citada e procure esse dado.",
          "Se a fonte não disser, marque a citação como decorativa.",
        ],
        example:
          "A resposta diz «o prazo é de 30 dias» e cita um artigo. O artigo fala de 30 dias para outro trâmite. A citação enfeita.",
        mistake: "Aceitar a afirmação porque a fonte tem um nome conhecido.",
      },
      {
        title: "3. Como abrir uma fonte e conferir",
        explain: [
          "Para conferir, abra a fonte e procure o dado com as palavras exatas da resposta. Confirme a data de publicação e se a fonte é primária (o original) ou secundária (quem reporta).",
          "Uma fonte secundária pode ser útil, mas, para um dado importante, tente chegar à primária.",
        ],
        terms: [
          {
            term: "Fonte primária",
            def: "O documento ou a origem original do dado.",
          },
          {
            term: "Fonte secundária",
            def: "Texto que relata ou resume um dado tirado de outro lugar.",
          },
        ],
        how: [
          "Abra a fonte e procure o dado exato.",
          "Confira a data de publicação.",
          "Se for secundária, procure a primária.",
        ],
        example:
          "Um blog cita um número de um relatório oficial. Você abre o relatório, confirma o número e usa o relatório como fonte.",
        mistake: "Citar o blog como se fosse a origem do dado.",
      },
      {
        title: "4. O que fazer se a resposta não se sustenta",
        explain: [
          "Se o dado não aparece na fonte, ou aparece diferente, não o use. Peça ao Gemini que corrija com a fonte real ou que diga que não conseguiu confirmá-lo.",
          "Uma boa resposta reconhece o que não pôde conferir. Essa honestidade vale mais do que um número seguro e falso.",
        ],
        terms: [
          {
            term: "Conferir",
            def: "Verificar se o dado coincide com a fonte original.",
          },
          {
            term: "Incerteza",
            def: "O que a resposta admite não ter conseguido confirmar.",
          },
        ],
        how: [
          "Marque o dado que não se sustenta.",
          "Peça uma correção com a fonte real.",
          "Se não houver fonte, descarte o dado ou indique que não está confirmado.",
        ],
        example:
          "O Gemini responde «40 % das escolas usam». A fonte não traz esse número. Você pede que corrija ou que diga que não conseguiu confirmar.",
        mistake: "Usar o número porque a resposta soava segura.",
      },
    ],
    summary: [
      "Grounding ancora a resposta da IA em fontes verificáveis, como a web atual ou seus arquivos.",
      "Uma citação respalda só se a fonte disser exatamente o que a resposta afirma.",
      "Para conferir, abra a fonte, procure o dado exato e revise a data.",
      "Se a fonte não sustenta o dado, não o use: peça correção ou descarte.",
      "Uma resposta honesta reconhece o que não pôde conferir.",
    ],
    check: [
      {
        q: "O que é o grounding?",
        options: [
          "Escrever a resposta mais rápido.",
          "Ancorar a resposta da IA em fontes verificáveis.",
          "Fazer a IA falar com outra voz.",
        ],
        correct: 1,
        feedback:
          "O grounding conecta a resposta a fontes verificáveis, como a web atual ou seus arquivos.",
      },
      {
        q: "A resposta cita um artigo, mas o artigo fala de outro dado. Como chamar isso?",
        options: [
          "Uma citação que respalda.",
          "Uma citação que enfeita: a fonte existe, mas não sustenta a afirmação.",
          "Uma fonte primária.",
        ],
        correct: 1,
        feedback:
          "Uma citação enfeita quando a fonte existe, mas não diz o que a resposta afirma.",
      },
      {
        q: "O dado não aparece na fonte citada. O que você faz?",
        options: [
          "Uso, porque a resposta tinha fonte.",
          "Descarto ou peço uma correção com a fonte real.",
          "Troco por um número parecido.",
        ],
        correct: 1,
        feedback:
          "Um dado que a fonte não sustenta não se usa; corrige-se com a fonte real ou descarta-se.",
      },
    ],
  },
};
