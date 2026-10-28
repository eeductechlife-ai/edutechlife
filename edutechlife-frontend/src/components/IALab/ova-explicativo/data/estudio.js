// OVA «El Estudio Alquímico» (ILAB-M4-OVA2). Resúmenes de audio de NotebookLM: qué es, cómo funciona y cómo comprobarlo.
export default {
  es: {
    badge: "Módulo 4 · Explicación",
    title: "El Estudio Alquímico",
    subtitle:
      "Resúmenes de audio y video en NotebookLM: qué generan, cómo funcionan y cómo comprobar lo que dicen",
    intro:
      "NotebookLM puede convertir tus fuentes en un resumen hablado con dos voces. Suena natural y convincente, pero un audio generado también puede simplificar, exagerar o inventar. Aquí aprenderás el vocabulario de estos resúmenes y la forma de revisarlos antes de estudiar con ellos.",
    objectives: [
      "Explicar qué es un resumen de audio generado por IA",
      "Distinguir entre el audio, el resumen escrito y la fuente",
      "Comprobar un punto del audio contra la fuente",
      "Reconocer las simplificaciones y errores más comunes",
    ],
    sections: [
      {
        title: "1. Qué es un resumen de audio",
        explain: [
          "Un resumen de audio es una conversación generada por IA, en formato de podcast, que explica el contenido de tus fuentes. Se crea a partir de los documentos que tú subes al cuaderno, no de todo internet.",
          "Es una forma de repaso, no el material original. Sirve para entrar al tema; no reemplaza leer las fuentes.",
        ],
        terms: [
          {
            term: "Resumen de audio",
            def: "Conversación generada por IA que explica tus fuentes en formato de podcast.",
          },
          {
            term: "Cuaderno",
            def: "Espacio de NotebookLM donde reúnes las fuentes de un tema.",
          },
        ],
        how: [
          "Reúne las fuentes en el cuaderno.",
          "Genera el resumen de audio.",
          "Escúchalo como primer acercamiento, y luego verifica en las fuentes.",
        ],
        example:
          "Subes tres artículos sobre energía solar y generas el audio. Te da una visión general en 10 minutos; los datos exactos los confirmas en los artículos.",
        mistake: "Estudiar solo con el audio y dar por bueno todo lo que dice.",
      },
      {
        title: "2. Audio, resumen escrito y fuente",
        explain: [
          "Hay tres niveles: el audio (lo que suena), el resumen escrito (el texto que lo acompaña) y la fuente (el documento original). Cada uno es más preciso que el anterior.",
          "La fuente es la referencia. Si el audio y la fuente no coinciden, manda la fuente.",
        ],
        terms: [
          {
            term: "Fuente",
            def: "Documento original que subiste; es la referencia para verificar.",
          },
          {
            term: "Resumen escrito",
            def: "Texto que acompaña al audio con el contenido principal.",
          },
        ],
        how: [
          "Escucha el audio para entender la idea general.",
          "Lee el resumen escrito para los puntos clave.",
          "Confirma los datos en la fuente.",
        ],
        example:
          "El audio dice «el proyecto costó 40 millones». La fuente dice «4 millones». Corriges con la fuente.",
        mistake: "Citar el audio como si fuera la fuente original.",
      },
      {
        title: "3. Cómo se generan y qué simplifican",
        explain: [
          "Para hacer el audio, la IA selecciona lo que considera importante y lo reescribe como diálogo. Al condensar, puede omitir matices, condiciones y excepciones.",
          "Las voces suenan seguras aunque el contenido sea incierto. Ese tono no garantiza que la información sea correcta.",
        ],
        terms: [
          {
            term: "Simplificación",
            def: "Reducir un contenido complejo y perder matices o condiciones.",
          },
          {
            term: "Matiz",
            def: "Condición, excepción o limitación que cambia el sentido de un dato.",
          },
        ],
        how: [
          "Pregunta qué se omitió del tema.",
          "Busca en la fuente las excepciones y condiciones.",
          "Anota los matices antes de estudiar el resumen.",
        ],
        example:
          "El audio dice «la vacuna es segura». La fuente dice «es segura en adultos sanos, con seguimiento». Falta la condición.",
        mistake: "Tomar una afirmación general como si fuera siempre válida.",
      },
      {
        title: "4. Cómo comprobar un punto del audio",
        explain: [
          "Cuando un punto te parezca importante o raro, búscalo en la fuente. Si no aparece, no lo uses. Si aparece con otra cifra o condición, corrige.",
          "Una práctica útil: escribe el punto con tus palabras y pide a NotebookLM la cita de la fuente que lo respalda.",
        ],
        terms: [
          {
            term: "Cita",
            def: "Fragmento exacto de la fuente que respalda un dato.",
          },
          {
            term: "Respaldar",
            def: "Encontrar en la fuente lo que sostiene una afirmación.",
          },
        ],
        how: [
          "Anota el punto con tus palabras.",
          "Pide la cita de la fuente que lo respalda.",
          "Si no hay cita, descarta el punto.",
        ],
        example:
          "Anotas «el reciclaje sube un 30 %». Pides la cita: la fuente habla de un 3 %. Corriges la nota.",
        mistake: "Aceptar una cifra sin pedir su cita en la fuente.",
      },
    ],
    summary: [
      "Un resumen de audio es un repaso generado a partir de tus fuentes, no el material original.",
      "Audio, resumen escrito y fuente: la fuente es la referencia.",
      "Al condensar, la IA puede omitir condiciones, excepciones y matices.",
      "Pide la cita de la fuente para cada punto importante.",
      "Escuchar ayuda a entender; verificar en la fuente es lo que permite estudiar.",
    ],
    check: [
      {
        q: "¿Qué es la fuente en un cuaderno de NotebookLM?",
        options: [
          "El audio que se genera automáticamente.",
          "El documento original que subiste, y la referencia para verificar.",
          "La voz de los presentadores del resumen.",
        ],
        correct: 1,
        feedback:
          "La fuente es el documento original que subiste; es la referencia para verificar lo que dice el audio.",
      },
      {
        q: "El audio dice una cifra y la fuente dice otra. ¿Qué vale?",
        options: [
          "El audio, porque suena más natural.",
          "La fuente, porque es el documento original.",
          "El promedio de las dos.",
        ],
        correct: 1,
        feedback:
          "Cuando el audio y la fuente no coinciden, manda la fuente original.",
      },
      {
        q: "¿Por qué conviene pedir la cita de la fuente para un punto importante?",
        options: [
          "Para que el audio dure más.",
          "Para confirmar que la fuente respalda el dato y no se perdió un matiz.",
          "Para cambiar la voz del resumen.",
        ],
        correct: 1,
        feedback:
          "La cita permite confirmar que el dato está en la fuente y que no se simplificó de más.",
      },
    ],
  },
  en: {
    badge: "Module 4 · Explanation",
    title: "The Alchemist's Study",
    subtitle:
      "Audio and video overviews in NotebookLM: what they produce, how they work and how to check what they say",
    intro:
      "NotebookLM can turn your sources into a spoken overview with two voices. It sounds natural and convincing, but a generated audio can also simplify, exaggerate or invent. Here you will learn the vocabulary of these overviews and how to review them before you study with them.",
    objectives: [
      "Explain what an AI-generated audio overview is",
      "Distinguish between the audio, the written summary and the source",
      "Check a point from the audio against the source",
      "Recognize the most common simplifications and errors",
    ],
    sections: [
      {
        title: "1. What an audio overview is",
        explain: [
          "An audio overview is an AI-generated conversation, in podcast format, that explains the content of your sources. It is built from the documents you upload to the notebook, not from the whole internet.",
          "It is a way to review, not the original material. It helps you get into the topic; it does not replace reading the sources.",
        ],
        terms: [
          {
            term: "Audio overview",
            def: "AI-generated conversation that explains your sources in podcast format.",
          },
          {
            term: "Notebook",
            def: "NotebookLM space where you gather the sources for a topic.",
          },
        ],
        how: [
          "Gather the sources in the notebook.",
          "Generate the audio overview.",
          "Listen as a first approach, then verify in the sources.",
        ],
        example:
          "You upload three articles on solar energy and generate the audio. It gives you an overview in 10 minutes; you confirm the exact data in the articles.",
        mistake:
          "Studying only with the audio and accepting everything it says.",
      },
      {
        title: "2. Audio, written summary and source",
        explain: [
          "There are three levels: the audio (what you hear), the written summary (the text that accompanies it) and the source (the original document). Each one is more precise than the one before.",
          "The source is the reference. If the audio and the source do not match, the source wins.",
        ],
        terms: [
          {
            term: "Source",
            def: "The original document you uploaded; it is the reference for verification.",
          },
          {
            term: "Written summary",
            def: "Text that accompanies the audio with the main content.",
          },
        ],
        how: [
          "Listen to the audio for the general idea.",
          "Read the written summary for the key points.",
          "Confirm the data in the source.",
        ],
        example:
          "The audio says «the project cost 40 million». The source says «4 million». You correct it with the source.",
        mistake: "Citing the audio as if it were the original source.",
      },
      {
        title: "3. How they are generated and what they simplify",
        explain: [
          "To make the audio, the AI selects what it considers important and rewrites it as dialogue. When condensing, it can leave out nuances, conditions and exceptions.",
          "The voices sound confident even when the content is uncertain. That tone does not guarantee the information is correct.",
        ],
        terms: [
          {
            term: "Simplification",
            def: "Reducing complex content and losing nuances or conditions.",
          },
          {
            term: "Nuance",
            def: "A condition, exception or limitation that changes the meaning of a fact.",
          },
        ],
        how: [
          "Ask what was left out of the topic.",
          "Look for exceptions and conditions in the source.",
          "Note the nuances before studying the overview.",
        ],
        example:
          "The audio says «the vaccine is safe». The source says «safe in healthy adults, with follow-up». The condition is missing.",
        mistake: "Taking a general statement as always valid.",
      },
      {
        title: "4. How to check a point from the audio",
        explain: [
          "When a point seems important or odd, search for it in the source. If it does not appear, do not use it. If it appears with a different figure or condition, correct it.",
          "A useful habit: write the point in your own words and ask NotebookLM for the source citation that backs it.",
        ],
        terms: [
          {
            term: "Citation",
            def: "The exact passage from the source that backs a fact.",
          },
          {
            term: "Back up",
            def: "Finding in the source what supports a claim.",
          },
        ],
        how: [
          "Write the point in your own words.",
          "Ask for the citation from the source that supports it.",
          "If there is no citation, discard the point.",
        ],
        example:
          "You note «recycling rose 30%». You ask for the citation: the source talks about 3%. You correct your note.",
        mistake:
          "Accepting a figure without asking for its citation in the source.",
      },
    ],
    summary: [
      "An audio overview is a review generated from your sources, not the original material.",
      "Audio, written summary and source: the source is the reference.",
      "When condensing, the AI can leave out conditions, exceptions and nuances.",
      "Ask for the source citation for every important point.",
      "Listening helps you understand; verifying in the source is what lets you study.",
    ],
    check: [
      {
        q: "What is the source in a NotebookLM notebook?",
        options: [
          "The audio that is generated automatically.",
          "The original document you uploaded, and the reference for verification.",
          "The voices of the presenters in the overview.",
        ],
        correct: 1,
        feedback:
          "The source is the original document you uploaded; it is the reference to verify what the audio says.",
      },
      {
        q: "The audio gives one figure and the source gives another. Which one counts?",
        options: [
          "The audio, because it sounds more natural.",
          "The source, because it is the original document.",
          "The average of the two.",
        ],
        correct: 1,
        feedback:
          "When the audio and the source do not match, the original source prevails.",
      },
      {
        q: "Why is it worth asking for the source citation of an important point?",
        options: [
          "So the audio lasts longer.",
          "To confirm the source backs the fact and that no nuance was lost.",
          "To change the voice of the overview.",
        ],
        correct: 1,
        feedback:
          "The citation lets you confirm the fact is in the source and was not oversimplified.",
      },
    ],
  },
  pt: {
    badge: "Módulo 4 · Explicação",
    title: "O Estúdio Alquímico",
    subtitle:
      "Resumos em áudio e vídeo no NotebookLM: o que geram, como funcionam e como conferir o que dizem",
    intro:
      "O NotebookLM pode transformar suas fontes em um resumo falado com duas vozes. Soa natural e convincente, mas um áudio gerado também pode simplificar, exagerar ou inventar. Aqui você vai aprender o vocabulário desses resumos e como revisá-los antes de estudar com eles.",
    objectives: [
      "Explicar o que é um resumo em áudio gerado por IA",
      "Distinguir entre o áudio, o resumo escrito e a fonte",
      "Conferir um ponto do áudio com a fonte",
      "Reconhecer as simplificações e erros mais comuns",
    ],
    sections: [
      {
        title: "1. O que é um resumo em áudio",
        explain: [
          "Um resumo em áudio é uma conversa gerada por IA, em formato de podcast, que explica o conteúdo das suas fontes. É criado a partir dos documentos que você envia ao caderno, não de toda a internet.",
          "É uma forma de revisão, não o material original. Serve para entrar no tema; não substitui a leitura das fontes.",
        ],
        terms: [
          {
            term: "Resumo em áudio",
            def: "Conversa gerada por IA que explica suas fontes em formato de podcast.",
          },
          {
            term: "Caderno",
            def: "Espaço do NotebookLM onde você reúne as fontes de um tema.",
          },
        ],
        how: [
          "Reúna as fontes no caderno.",
          "Gere o resumo em áudio.",
          "Escute como primeira aproximação e depois confira nas fontes.",
        ],
        example:
          "Você envia três artigos sobre energia solar e gera o áudio. Ele dá uma visão geral em 10 minutos; os dados exatos você confere nos artigos.",
        mistake: "Estudar só com o áudio e aceitar tudo o que ele diz.",
      },
      {
        title: "2. Áudio, resumo escrito e fonte",
        explain: [
          "Há três níveis: o áudio (o que se ouve), o resumo escrito (o texto que o acompanha) e a fonte (o documento original). Cada um é mais preciso que o anterior.",
          "A fonte é a referência. Se o áudio e a fonte não coincidirem, vale a fonte.",
        ],
        terms: [
          {
            term: "Fonte",
            def: "Documento original que você enviou; é a referência para conferir.",
          },
          {
            term: "Resumo escrito",
            def: "Texto que acompanha o áudio com o conteúdo principal.",
          },
        ],
        how: [
          "Ouça o áudio para entender a ideia geral.",
          "Leia o resumo escrito para os pontos-chave.",
          "Confirme os dados na fonte.",
        ],
        example:
          "O áudio diz «o projeto custou 40 milhões». A fonte diz «4 milhões». Você corrige com a fonte.",
        mistake: "Citar o áudio como se fosse a fonte original.",
      },
      {
        title: "3. Como são gerados e o que simplificam",
        explain: [
          "Para criar o áudio, a IA seleciona o que considera importante e reescreve como diálogo. Ao condensar, pode deixar de fora nuances, condições e exceções.",
          "As vozes soam seguras mesmo quando o conteúdo é incerto. Esse tom não garante que a informação esteja correta.",
        ],
        terms: [
          {
            term: "Simplificação",
            def: "Reduzir um conteúdo complexo e perder nuances ou condições.",
          },
          {
            term: "Nuance",
            def: "Condição, exceção ou limitação que muda o sentido de um dado.",
          },
        ],
        how: [
          "Pergunte o que ficou de fora do tema.",
          "Procure na fonte as exceções e condições.",
          "Anote as nuances antes de estudar o resumo.",
        ],
        example:
          "O áudio diz «a vacina é segura». A fonte diz «segura em adultos saudáveis, com acompanhamento». Falta a condição.",
        mistake: "Tomar uma afirmação geral como sempre válida.",
      },
      {
        title: "4. Como conferir um ponto do áudio",
        explain: [
          "Quando um ponto parecer importante ou estranho, procure-o na fonte. Se não aparecer, não o use. Se aparecer com outro número ou condição, corrija.",
          "Um hábito útil: escreva o ponto com suas palavras e peça ao NotebookLM a citação da fonte que o respalda.",
        ],
        terms: [
          {
            term: "Citação",
            def: "Trecho exato da fonte que respalda um dado.",
          },
          {
            term: "Respaldar",
            def: "Encontrar na fonte o que sustenta uma afirmação.",
          },
        ],
        how: [
          "Escreva o ponto com suas palavras.",
          "Peça a citação da fonte que o respalda.",
          "Se não houver citação, descarte o ponto.",
        ],
        example:
          "Você anota «a reciclagem subiu 30 %». Pede a citação: a fonte fala em 3 %. Corrige a anotação.",
        mistake: "Aceitar um número sem pedir a sua citação na fonte.",
      },
    ],
    summary: [
      "Um resumo em áudio é uma revisão gerada a partir das suas fontes, não o material original.",
      "Áudio, resumo escrito e fonte: a fonte é a referência.",
      "Ao condensar, a IA pode deixar de fora condições, exceções e nuances.",
      "Peça a citação da fonte para cada ponto importante.",
      "Ouvir ajuda a entender; conferir na fonte é o que permite estudar.",
    ],
    check: [
      {
        q: "O que é a fonte em um caderno do NotebookLM?",
        options: [
          "O áudio gerado automaticamente.",
          "O documento original que você enviou, e a referência para conferir.",
          "As vozes dos apresentadores do resumo.",
        ],
        correct: 1,
        feedback:
          "A fonte é o documento original que você enviou; é a referência para conferir o que o áudio diz.",
      },
      {
        q: "O áudio dá um número e a fonte dá outro. Qual vale?",
        options: [
          "O áudio, porque soa mais natural.",
          "A fonte, porque é o documento original.",
          "A média dos dois.",
        ],
        correct: 1,
        feedback:
          "Quando o áudio e a fonte não coincidem, vale a fonte original.",
      },
      {
        q: "Por que vale pedir a citação da fonte para um ponto importante?",
        options: [
          "Para que o áudio dure mais.",
          "Para confirmar que a fonte respalda o dado e que não se perdeu uma nuance.",
          "Para trocar a voz do resumo.",
        ],
        correct: 1,
        feedback:
          "A citação permite confirmar que o dado está na fonte e que não foi simplificado demais.",
      },
    ],
  },
};
