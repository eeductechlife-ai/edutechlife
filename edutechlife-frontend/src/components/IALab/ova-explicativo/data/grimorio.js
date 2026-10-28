// OVA «El Grimorio» (ILAB-M4-OVA1). Explica el cuaderno basado en fuentes de Gemini Notebook.
export default {
  es: {
    badge: "Módulo 4 · Explicación",
    title: "El Grimorio",
    subtitle:
      "Gemini Notebook: un cuaderno que responde con tus fuentes y muestra de dónde sale cada dato",
    intro:
      "Gemini Notebook (antes NotebookLM) responde a partir de los documentos que subes. Aquí aprenderás los términos que necesitas para usarlo bien: fuente, cita, curaduría y alucinación, y por qué el cuaderno no reemplaza tu verificación.",
    objectives: [
      "Explicar qué es un cuaderno basado en fuentes",
      "Definir fuente, cita, curaduría y alucinación",
      "Verificar una cita abriendo el fragmento original",
      "Reconocer cuándo una respuesta no se sostiene",
    ],
    sections: [
      {
        title: "1. Qué es un cuaderno basado en fuentes",
        explain: [
          "Un chat general responde con lo que aprendió durante su entrenamiento. Un cuaderno basado en fuentes responde con los documentos que tú subes: apuntes, artículos, informes.",
          "Por eso puede citar de dónde sale cada afirmación. La cita no garantiza que la respuesta sea verdadera: garantiza que puedes ir a comprobarla.",
        ],
        terms: [
          {
            term: "Cuaderno",
            def: "Espacio de trabajo con un conjunto de fuentes y un chat para preguntarles.",
          },
          {
            term: "Fuente",
            def: "Documento que subes al cuaderno, con autor y fecha cuando los tiene.",
          },
          {
            term: "IA basada en fuentes",
            def: "Sistema que apoya su respuesta en los textos que le diste, no solo en lo que recuerda.",
          },
        ],
        how: [
          "Subes tus fuentes al cuaderno.",
          "Haces una pregunta concreta sobre ellas.",
          "La respuesta aparece con números de cita que llevan al fragmento del documento.",
        ],
        example:
          "Subes tres artículos sobre energía solar y preguntas «¿qué costo inicial mencionan?». Cada cifra llega con su cita al artículo.",
        mistake:
          "Creer que, por tener citas, la respuesta ya es correcta. Hay que abrir la cita y leer el fragmento original.",
      },
      {
        title: "2. Fuentes y curaduría",
        explain: [
          "Curar es elegir con criterio qué entra al cuaderno. Más fuentes no significa mejor respuesta: un cuaderno con documentos desordenados o de calidad dudosa responde peor.",
          "Una fuente confiable tiene autor identificable, fecha y referencias que puedes comprobar. Las fuentes primarias son el documento original; las secundarias lo comentan o resumen.",
        ],
        terms: [
          {
            term: "Curaduría",
            def: "Elegir, revisar y ordenar las fuentes antes de sintetizarlas.",
          },
          {
            term: "Fuente primaria",
            def: "El documento original: un estudio, una norma, un dato oficial.",
          },
          {
            term: "Fuente secundaria",
            def: "Un texto que comenta o resume una fuente primaria.",
          },
        ],
        how: [
          "Reúne pocas fuentes del mismo tema.",
          "Revisa autor, fecha y referencias de cada una.",
          "Agrupa las fuentes por subtema para preguntar con más precisión.",
        ],
        example:
          "Para un trabajo sobre salud, prefieres el informe de un ministerio con fecha y autor a un blog sin firma.",
        mistake:
          "Subir todo lo que encuentras. Un cuaderno con demasiado ruido responde de forma genérica o mezcla contradicciones.",
      },
      {
        title: "3. Cita y verificación",
        explain: [
          "Una cita es la referencia que une una afirmación con el fragmento exacto de la fuente. Verificar significa abrir ese fragmento y confirmar que dice lo que la respuesta afirma.",
          "Si la cita no existe, o el fragmento dice otra cosa, la afirmación no está respaldada.",
        ],
        terms: [
          {
            term: "Cita",
            def: "Número o referencia que lleva al fragmento de la fuente de donde sale una afirmación.",
          },
          {
            term: "Verificar",
            def: "Comprobar que el fragmento citado dice lo que la respuesta afirma.",
          },
        ],
        how: [
          "Toca el número de cita.",
          "Lee el fragmento en el documento original.",
          "Confirma que coinciden. Si no coinciden, no uses la afirmación.",
        ],
        example:
          "La respuesta dice «el 30 % de los hogares…». Al abrir la cita, el documento dice «el 3 %». Ese dato se corrige o se descarta.",
        mistake: "Copiar una cifra solo porque tiene cita, sin abrirla.",
      },
      {
        title: "4. Alucinación y límites",
        explain: [
          "Una alucinación es una respuesta que suena segura y no está respaldada por la fuente: una cifra inventada, una cita que no existe o una conclusión que nadie escribió.",
          "Reducir el riesgo ayuda, pero no lo elimina. Por eso el cuaderno no reemplaza tu lectura ni tu criterio.",
        ],
        terms: [
          {
            term: "Alucinación",
            def: "Dato o afirmación que la IA produce con seguridad y que no está en sus fuentes.",
          },
          {
            term: "Síntesis",
            def: "Resumen que une ideas de varias fuentes en una conclusión propia.",
          },
        ],
        how: [
          "Si una afirmación no tiene cita, trátala como hipótesis.",
          "Si la cita no dice lo mismo, descarta la afirmación.",
          "Escribe la conclusión con tus palabras y cita tus fuentes.",
        ],
        example:
          "Pides «un resumen de los tres artículos» y aparece un cuarto autor que no subiste. Es una alucinación: se descarta y se revisa el cuaderno.",
        mistake:
          "Pedirle datos que no están en tus fuentes y usarlos porque «la IA los encontró».",
      },
    ],
    summary: [
      "Un cuaderno basado en fuentes responde con los documentos que tú subes.",
      "Curar es elegir pocas fuentes confiables, del mismo tema, con autor y fecha.",
      "Una cita lleva al fragmento original: ábrela y confirma que dice lo mismo.",
      "Una alucinación es una afirmación segura sin respaldo en tus fuentes.",
      "El cuaderno ayuda a estudiar, pero la conclusión y la verificación son tuyas.",
    ],
    check: [
      {
        q: "¿Qué hace que una respuesta de un cuaderno sea verificable?",
        options: [
          "Que sea larga y bien redactada.",
          "Que tenga una cita que puedas abrir y comprobar.",
          "Que la IA diga que está segura.",
        ],
        correct: 1,
        feedback:
          "La cita te lleva al fragmento original; abrirla es lo que permite comprobar el dato.",
      },
      {
        q: "Una cifra de la respuesta no aparece en ninguna de tus fuentes. ¿Qué haces?",
        options: [
          "La uso, porque suena creíble.",
          "La descarto o la confirmo en una fuente original antes de usarla.",
          "Pido que la redondee para que parezca más precisa.",
        ],
        correct: 1,
        feedback:
          "Un dato que no está en tus fuentes no es verificable: no lo uses hasta confirmarlo.",
      },
      {
        q: "¿Qué es una fuente primaria?",
        options: [
          "Un documento que comenta a otro documento.",
          "El documento original, como un estudio o un dato oficial.",
          "La fuente que aparece primero en la búsqueda.",
        ],
        correct: 1,
        feedback:
          "La fuente primaria es el documento original; las secundarias lo comentan o resumen.",
      },
    ],
  },
  en: {
    badge: "Module 4 · Explanation",
    title: "The Grimoire",
    subtitle:
      "Gemini Notebook: a notebook that answers from your sources and shows where each fact comes from",
    intro:
      "Gemini Notebook (formerly NotebookLM) answers from the documents you upload. Here you will learn the terms you need to use it well: source, citation, curation and hallucination, and why the notebook does not replace your own verification.",
    objectives: [
      "Explain what a source-based notebook is",
      "Define source, citation, curation and hallucination",
      "Verify a citation by opening the original passage",
      "Recognize when an answer is not supported",
    ],
    sections: [
      {
        title: "1. What a source-based notebook is",
        explain: [
          "A general chat answers with what it learned during training. A source-based notebook answers with the documents you upload: notes, articles, reports.",
          "That is why it can cite where each statement comes from. A citation does not guarantee the answer is true; it guarantees you can go and check it.",
        ],
        terms: [
          {
            term: "Notebook",
            def: "A workspace with a set of sources and a chat to ask them questions.",
          },
          {
            term: "Source",
            def: "A document you upload to the notebook, with author and date when it has them.",
          },
          {
            term: "Source-based AI",
            def: "A system that grounds its answer in the texts you gave it, not only in what it remembers.",
          },
        ],
        how: [
          "You upload your sources to the notebook.",
          "You ask a concrete question about them.",
          "The answer shows citation numbers that lead to the passage in the document.",
        ],
        example:
          "You upload three articles on solar energy and ask «what initial cost do they mention?». Each figure comes with a citation to the article.",
        mistake:
          "Believing that, because it has citations, the answer is already correct. Open the citation and read the original passage.",
      },
      {
        title: "2. Sources and curation",
        explain: [
          "Curation means choosing, with judgement, what goes into the notebook. More sources do not mean a better answer: a notebook full of disorganized or doubtful documents answers worse.",
          "A reliable source has an identifiable author, a date and references you can check. Primary sources are the original document; secondary sources comment on or summarize it.",
        ],
        terms: [
          {
            term: "Curation",
            def: "Choosing, reviewing and organizing sources before you synthesize them.",
          },
          {
            term: "Primary source",
            def: "The original document: a study, a regulation, an official dataset.",
          },
          {
            term: "Secondary source",
            def: "A text that comments on or summarizes a primary source.",
          },
        ],
        how: [
          "Gather a few sources on the same topic.",
          "Check the author, date and references of each one.",
          "Group the sources by subtopic so you can ask more precise questions.",
        ],
        example:
          "For a health assignment you prefer a ministry report with date and author over an unsigned blog.",
        mistake:
          "Uploading everything you find. A notebook full of noise answers generically or mixes contradictions.",
      },
      {
        title: "3. Citation and verification",
        explain: [
          "A citation is the reference that links a statement to the exact passage of the source it came from. Verifying means opening that passage and confirming it says what the answer claims.",
          "If the citation does not exist, or the passage says something else, the statement is not supported.",
        ],
        terms: [
          {
            term: "Citation",
            def: "A number or reference that leads to the passage of the source a statement comes from.",
          },
          {
            term: "Verify",
            def: "To check that the cited passage says what the answer states.",
          },
        ],
        how: [
          "Tap the citation number.",
          "Read the passage in the original document.",
          "Confirm they match. If they do not, do not use the statement.",
        ],
        example:
          "The answer says «30% of households…». Opening the citation, the document says «3%». That figure is corrected or discarded.",
        mistake:
          "Copying a figure just because it has a citation, without opening it.",
      },
      {
        title: "4. Hallucination and limits",
        explain: [
          "A hallucination is an answer that sounds certain but is not supported by the source: an invented figure, a citation that does not exist, or a conclusion nobody wrote.",
          "Reducing the risk helps, but does not remove it. That is why the notebook does not replace your reading or your judgement.",
        ],
        terms: [
          {
            term: "Hallucination",
            def: "A fact the AI produces with confidence that is not in its sources.",
          },
          {
            term: "Synthesis",
            def: "A summary that joins ideas from several sources into your own conclusion.",
          },
        ],
        how: [
          "If a statement has no citation, treat it as a hypothesis.",
          "If the citation says something different, discard the statement.",
          "Write the conclusion in your own words and cite your sources.",
        ],
        example:
          "You ask for «a summary of the three articles» and a fourth author you did not upload appears. That is a hallucination: discard it and review the notebook.",
        mistake:
          "Asking for data that is not in your sources and using it because «the AI found it».",
      },
    ],
    summary: [
      "A source-based notebook answers from the documents you upload.",
      "Curating means choosing few reliable sources, on the same topic, with author and date.",
      "A citation leads to the original passage: open it and confirm it says the same.",
      "A hallucination is a confident statement with no support in your sources.",
      "The notebook helps you study, but the conclusion and the verification are yours.",
    ],
    check: [
      {
        q: "What makes a notebook answer verifiable?",
        options: [
          "That it is long and well written.",
          "That it has a citation you can open and check.",
          "That the AI says it is confident.",
        ],
        correct: 1,
        feedback:
          "The citation leads to the original passage; opening it is what lets you check the fact.",
      },
      {
        q: "A figure in the answer does not appear in any of your sources. What do you do?",
        options: [
          "I use it, because it sounds credible.",
          "I discard it or confirm it at an original source before using it.",
          "I ask it to round it so it looks more precise.",
        ],
        correct: 1,
        feedback:
          "A figure that is not in your sources is not verifiable: do not use it until you confirm it.",
      },
      {
        q: "What is a primary source?",
        options: [
          "A document that comments on another document.",
          "The original document, such as a study or an official dataset.",
          "The source that appears first in the search.",
        ],
        correct: 1,
        feedback:
          "The primary source is the original document; secondary sources comment on or summarize it.",
      },
    ],
  },
  pt: {
    badge: "Módulo 4 · Explicação",
    title: "O Grimório",
    subtitle:
      "Gemini Notebook: um caderno que responde com as suas fontes e mostra de onde vem cada dado",
    intro:
      "O Gemini Notebook (antes NotebookLM) responde a partir dos documentos que você envia. Aqui você vai aprender os termos necessários para usá-lo bem: fonte, citação, curadoria e alucinação, e por que o caderno não substitui a sua verificação.",
    objectives: [
      "Explicar o que é um caderno baseado em fontes",
      "Definir fonte, citação, curadoria e alucinação",
      "Conferir uma citação abrindo o trecho original",
      "Reconhecer quando uma resposta não se sustenta",
    ],
    sections: [
      {
        title: "1. O que é um caderno baseado em fontes",
        explain: [
          "Um chat geral responde com o que aprendeu no treinamento. Um caderno baseado em fontes responde com os documentos que você envia: anotações, artigos, relatórios.",
          "Por isso ele pode citar de onde vem cada afirmação. A citação não garante que a resposta seja verdadeira; garante que você pode ir conferir.",
        ],
        terms: [
          {
            term: "Caderno",
            def: "Espaço de trabalho com um conjunto de fontes e um chat para perguntar sobre elas.",
          },
          {
            term: "Fonte",
            def: "Documento que você envia ao caderno, com autor e data quando os tem.",
          },
          {
            term: "IA baseada em fontes",
            def: "Sistema que apoia a resposta nos textos que você deu, não só no que lembra.",
          },
        ],
        how: [
          "Você envia as suas fontes ao caderno.",
          "Faz uma pergunta concreta sobre elas.",
          "A resposta mostra números de citação que levam ao trecho do documento.",
        ],
        example:
          "Você envia três artigos sobre energia solar e pergunta «qual custo inicial mencionam?». Cada número vem com uma citação para o artigo.",
        mistake:
          "Achar que, por ter citações, a resposta já está correta. É preciso abrir a citação e ler o trecho original.",
      },
      {
        title: "2. Fontes e curadoria",
        explain: [
          "Curar é escolher com critério o que entra no caderno. Mais fontes não significam melhor resposta: um caderno cheio de documentos desorganizados ou duvidosos responde pior.",
          "Uma fonte confiável tem autor identificável, data e referências que você pode conferir. As fontes primárias são o documento original; as secundárias comentam ou resumem.",
        ],
        terms: [
          {
            term: "Curadoria",
            def: "Escolher, revisar e organizar as fontes antes de sintetizá-las.",
          },
          {
            term: "Fonte primária",
            def: "O documento original: um estudo, uma norma, um dado oficial.",
          },
          {
            term: "Fonte secundária",
            def: "Um texto que comenta ou resume uma fonte primária.",
          },
        ],
        how: [
          "Reúna poucas fontes do mesmo tema.",
          "Confira autor, data e referências de cada uma.",
          "Agrupe as fontes por subtema para perguntar com mais precisão.",
        ],
        example:
          "Para um trabalho de saúde, você prefere o relatório de um ministério, com data e autor, a um blog sem assinatura.",
        mistake:
          "Enviar tudo o que encontra. Um caderno cheio de ruído responde de forma genérica ou mistura contradições.",
      },
      {
        title: "3. Citação e verificação",
        explain: [
          "Uma citação é a referência que liga uma afirmação ao trecho exato da fonte de onde ela vem. Verificar é abrir esse trecho e confirmar que ele diz o que a resposta afirma.",
          "Se a citação não existir, ou o trecho disser outra coisa, a afirmação não está respaldada.",
        ],
        terms: [
          {
            term: "Citação",
            def: "Número ou referência que leva ao trecho da fonte de onde sai uma afirmação.",
          },
          {
            term: "Conferir",
            def: "Verificar que o trecho citado diz o que a resposta afirma.",
          },
        ],
        how: [
          "Toque no número da citação.",
          "Leia o trecho no documento original.",
          "Confirme que coincidem. Se não coincidirem, não use a afirmação.",
        ],
        example:
          "A resposta diz «30 % dos domicílios…». Ao abrir a citação, o documento diz «3 %». Esse dado é corrigido ou descartado.",
        mistake: "Copiar um número só porque tem citação, sem abri-la.",
      },
      {
        title: "4. Alucinação e limites",
        explain: [
          "Uma alucinação é uma resposta que soa segura, mas não está respaldada pela fonte: um número inventado, uma citação que não existe ou uma conclusão que ninguém escreveu.",
          "Reduzir o risco ajuda, mas não o elimina. Por isso o caderno não substitui a sua leitura nem o seu critério.",
        ],
        terms: [
          {
            term: "Alucinação",
            def: "Dado ou afirmação que a IA produz com segurança e que não está nas suas fontes.",
          },
          {
            term: "Síntese",
            def: "Resumo que une ideias de várias fontes em uma conclusão própria.",
          },
        ],
        how: [
          "Se uma afirmação não tem citação, trate-a como hipótese.",
          "Se a citação disser outra coisa, descarte a afirmação.",
          "Escreva a conclusão com as suas palavras e cite as suas fontes.",
        ],
        example:
          "Você pede «um resumo dos três artigos» e aparece um quarto autor que você não enviou. Isso é uma alucinação: descarte e revise o caderno.",
        mistake:
          "Pedir dados que não estão nas suas fontes e usá-los porque «a IA os encontrou».",
      },
    ],
    summary: [
      "Um caderno baseado em fontes responde com os documentos que você envia.",
      "Curar é escolher poucas fontes confiáveis, do mesmo tema, com autor e data.",
      "Uma citação leva ao trecho original: abra-a e confirme que diz o mesmo.",
      "Uma alucinação é uma afirmação segura sem respaldo nas suas fontes.",
      "O caderno ajuda a estudar, mas a conclusão e a verificação são suas.",
    ],
    check: [
      {
        q: "O que torna uma resposta do caderno verificável?",
        options: [
          "Ser longa e bem escrita.",
          "Ter uma citação que você pode abrir e conferir.",
          "A IA dizer que está segura.",
        ],
        correct: 1,
        feedback:
          "A citação leva ao trecho original; abri-la é o que permite conferir o dado.",
      },
      {
        q: "Um número da resposta não aparece em nenhuma das suas fontes. O que você faz?",
        options: [
          "Uso, porque parece confiável.",
          "Descarto ou confirmo em uma fonte original antes de usar.",
          "Peço que arredonde para parecer mais preciso.",
        ],
        correct: 1,
        feedback:
          "Um dado que não está nas suas fontes não é verificável: não use até confirmar.",
      },
      {
        q: "O que é uma fonte primária?",
        options: [
          "Um documento que comenta outro documento.",
          "O documento original, como um estudo ou um dado oficial.",
          "A fonte que aparece primeiro na busca.",
        ],
        correct: 1,
        feedback:
          "A fonte primária é o documento original; as secundárias comentam ou resumem.",
      },
    ],
  },
};
