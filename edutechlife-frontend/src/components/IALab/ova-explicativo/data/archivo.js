// OVA «El Archivo Forense» (ILAB-M3-OVA3). Deep Research, grounding, fuentes primarias y cifras sin respaldo.
export default {
  es: {
    badge: "Módulo 3 · Explicación",
    title: "El Archivo Forense",
    subtitle:
      "Deep Research, grounding y fuentes: investigar sin creer lo primero que aparece",
    intro:
      "Un informe con fuentes parece sólido, pero solo lo es si puedes comprobar cada dato. En esta lección aprenderás qué hace Deep Research, qué significa grounding, cómo separar una fuente primaria de una secundaria y qué hacer con una cifra sin respaldo.",
    objectives: [
      "Explicar qué es Deep Research y en qué consiste",
      "Definir grounding y fuente primaria",
      "Comprobar una cita abriendo la fuente",
      "Decidir qué hacer con una cifra sin respaldo",
    ],
    sections: [
      {
        title: "1. Qué es Deep Research",
        explain: [
          "Deep Research es una investigación en varios pasos: la herramienta plantea un plan, busca fuentes, las lee y entrega un informe con referencias. No responde de memoria: investiga.",
          "Su disponibilidad depende de tu plan y de la versión que uses. Revisa en tu cuenta qué opciones tienes antes de planear un trabajo.",
        ],
        terms: [
          {
            term: "Deep Research",
            def: "Investigación automática en varios pasos que termina en un informe con fuentes.",
          },
          {
            term: "Plan de investigación",
            def: "Lista de preguntas y búsquedas que la herramienta propone antes de empezar.",
          },
        ],
        how: [
          "Escribes una pregunta de investigación clara.",
          "Revisas el plan que propone y ajustas lo que sobra o falta.",
          "Lees el informe con sus fuentes antes de usarlo.",
        ],
        example:
          "«Compara la regulación de datos de salud en tres países, con fuentes oficiales y fecha de vigencia» da un plan más útil que «investiga sobre salud».",
        mistake:
          "Tomar el informe como verdad porque es largo y tiene referencias.",
      },
      {
        title: "2. Grounding: respuesta apoyada en fuentes",
        explain: [
          "Grounding significa apoyar una respuesta en fuentes reales que se consultaron, en lugar de responder solo con lo que el modelo recuerda. Cuando hay grounding, la respuesta suele incluir enlaces o referencias.",
          "Grounding reduce el riesgo, pero no lo elimina: una fuente puede existir y decir otra cosa, o estar desactualizada.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "Respuesta apoyada en fuentes consultadas que puedes abrir y comprobar.",
          },
          {
            term: "Fuente actualizada",
            def: "Fuente con fecha reciente, adecuada para datos que cambian.",
          },
        ],
        how: [
          "Identifica qué afirmaciones tienen una fuente vinculada.",
          "Abre la fuente y busca el dato exacto.",
          "Confirma la fecha: un dato viejo puede ya no valer.",
        ],
        example:
          "La respuesta cita un informe de 2019 para un precio actual. Antes de usarlo, busca la fuente vigente.",
        mistake:
          "Pensar que, porque hay un enlace, el dato es correcto. El enlace solo indica dónde buscar.",
      },
      {
        title: "3. Fuente primaria y secundaria",
        explain: [
          "Una fuente primaria es el documento original: el estudio, la norma, el dato oficial. Una fuente secundaria lo comenta, resume o interpreta.",
          "Cuando sea posible, usa la primaria. Una secundaria puede simplificar mal o citar una cifra sin revisar el original.",
        ],
        terms: [
          {
            term: "Fuente primaria",
            def: "Documento original: un estudio, una norma, un registro oficial.",
          },
          {
            term: "Fuente secundaria",
            def: "Texto que comenta o resume una fuente primaria.",
          },
        ],
        how: [
          "Pregunta: ¿quién produjo este dato por primera vez?",
          "Busca el documento original en la fuente indicada.",
          "Si solo hay secundarias, indícalo en tu trabajo.",
        ],
        example:
          "Un artículo dice «según una encuesta». La encuesta original es la fuente primaria: búscala antes de citar el artículo.",
        mistake: "Citar la fuente secundaria como si fuera el origen del dato.",
      },
      {
        title: "4. Cifras sin respaldo",
        explain: [
          "Una cifra sin respaldo es un número que no aparece en una fuente que puedas abrir. Puede ser un error, un dato viejo o una invención que suena creíble.",
          "Regla práctica: sin fuente abierta y comprobada, la cifra no entra en tu trabajo. Puedes marcarla como «no verificada» o descartarla.",
        ],
        terms: [
          {
            term: "Cifra no verificada",
            def: "Dato que no pudiste comprobar en una fuente abierta.",
          },
          {
            term: "Hipótesis",
            def: "Afirmación que se propone para comprobarla después.",
          },
        ],
        how: [
          "Marca cada cifra que no tenga fuente abierta.",
          "Busca la fuente original; si no aparece, descarta o marca el dato.",
          "Escribe en tu trabajo solo lo que pudiste comprobar.",
        ],
        example:
          "«El 94 % de precisión» aparece en un resultado de muestra sin fuente. No se usa: no se puede comprobar.",
        mistake:
          "Redondear o ajustar una cifra para que encaje con tu argumento.",
      },
    ],
    summary: [
      "Deep Research investiga en varios pasos y entrega un informe con fuentes; revisa qué plan tienes.",
      "Grounding significa apoyarse en fuentes que puedes abrir, no en la memoria del modelo.",
      "La fuente primaria es el documento original; prefiérela a la secundaria.",
      "Una cifra sin fuente abierta no entra en tu trabajo: se verifica o se descarta.",
      "Un informe con referencias solo es sólido si cada dato se puede comprobar.",
    ],
    check: [
      {
        q: "¿Qué significa grounding?",
        options: [
          "Que la IA responde solo con su memoria.",
          "Que la respuesta se apoya en fuentes consultadas que puedes abrir.",
          "Que la respuesta es más corta.",
        ],
        correct: 1,
        feedback:
          "Grounding es apoyar la respuesta en fuentes reales que puedes comprobar.",
      },
      {
        q: "Un informe cita un dato con fuente, pero la fuente es de 2019 y el dato cambia cada año. ¿Qué haces?",
        options: [
          "Lo uso, porque tiene fuente.",
          "Busco una fuente vigente antes de usar el dato.",
          "Cambio la fecha de la fuente.",
        ],
        correct: 1,
        feedback:
          "Un dato que cambia necesita una fuente actual; una referencia antigua puede ya no valer.",
      },
      {
        q: "Un artículo dice «según una encuesta». ¿Qué debes hacer?",
        options: [
          "Citar el artículo como si fuera el origen.",
          "Buscar la encuesta original, que es la fuente primaria.",
          "Creer el dato porque lo repite un artículo.",
        ],
        correct: 1,
        feedback:
          "La encuesta original es la fuente primaria; el artículo es secundario.",
      },
    ],
  },
  en: {
    badge: "Module 3 · Explanation",
    title: "The Forensic Archive",
    subtitle:
      "Deep Research, grounding and sources: investigate without believing the first thing that appears",
    intro:
      "A report with sources looks solid, but it only is if you can check every fact. In this lesson you will learn what Deep Research does, what grounding means, how to tell a primary source from a secondary one, and what to do with a figure that has no support.",
    objectives: [
      "Explain what Deep Research is and how it works",
      "Define grounding and primary source",
      "Check a citation by opening the source",
      "Decide what to do with an unsupported figure",
    ],
    sections: [
      {
        title: "1. What Deep Research is",
        explain: [
          "Deep Research is a multi-step investigation: the tool proposes a plan, searches for sources, reads them and delivers a report with references. It does not answer from memory: it investigates.",
          "Its availability depends on your plan and version. Check in your account what you have before planning a job.",
        ],
        terms: [
          {
            term: "Deep Research",
            def: "Automatic multi-step investigation that ends in a report with sources.",
          },
          {
            term: "Research plan",
            def: "The list of questions and searches the tool proposes before it starts.",
          },
        ],
        how: [
          "You write a clear research question.",
          "You review the plan it proposes and adjust what is missing or unnecessary.",
          "You read the report and its sources before using it.",
        ],
        example:
          "«Compare health data regulation in three countries, with official sources and effective dates» gives a far more useful plan than «research health».",
        mistake:
          "Taking the report as truth because it is long and has references.",
      },
      {
        title: "2. Grounding: an answer backed by sources",
        explain: [
          "Grounding means backing an answer with real sources that were consulted, instead of answering only from what the model remembers. When there is grounding, the answer usually includes links or references.",
          "Grounding lowers the risk but does not remove it: a source can exist and say something else, or be out of date.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "An answer backed by consulted sources that you can open and check.",
          },
          {
            term: "Current source",
            def: "A source with a recent date, suitable for data that changes.",
          },
        ],
        how: [
          "Identify which statements have a linked source.",
          "Open the source and look for the exact figure.",
          "Check the date: an old figure may no longer hold.",
        ],
        example:
          "The answer cites a 2019 report for a current price. Before using it, find the current source.",
        mistake:
          "Thinking that, because there is a link, the fact is correct. The link only shows where to look.",
      },
      {
        title: "3. Primary and secondary sources",
        explain: [
          "A primary source is the original document: the study, the regulation, the official record. A secondary source comments on, summarizes or interprets it.",
          "When possible, use the primary source. A secondary source can oversimplify or cite a figure without checking the original.",
        ],
        terms: [
          {
            term: "Primary source",
            def: "The original document: a study, a regulation, an official record.",
          },
          {
            term: "Secondary source",
            def: "A text that comments on or summarizes a primary source.",
          },
        ],
        how: [
          "Ask: who first produced this data?",
          "Look for the original document at the source indicated.",
          "If only secondary sources exist, say so in your work.",
        ],
        example:
          "An article says «according to a survey». The original survey is the primary source: find it before citing the article.",
        mistake:
          "Citing the secondary source as if it were the origin of the data.",
      },
      {
        title: "4. Figures without support",
        explain: [
          "A figure without support is a number that does not appear in a source you can open. It can be an error, outdated data or an invention that sounds credible.",
          "Practical rule: without an open, checked source, the figure does not go into your work. You can mark it as «unverified» or discard it.",
        ],
        terms: [
          {
            term: "Unverified figure",
            def: "A data point you could not check in an open source.",
          },
          {
            term: "Hypothesis",
            def: "A statement proposed to be checked later.",
          },
        ],
        how: [
          "Mark every figure that has no open source.",
          "Look for the original source; if it does not appear, discard or mark the figure.",
          "Write in your work only what you could check.",
        ],
        example:
          "«94% accuracy» appears in a sample result with no source. It is not used: it cannot be checked.",
        mistake: "Rounding or adjusting a figure so it fits your argument.",
      },
    ],
    summary: [
      "Deep Research investigates in several steps and delivers a report with sources; check which plan you have.",
      "Grounding means relying on sources you can open, not on the model's memory.",
      "The primary source is the original document; prefer it over the secondary one.",
      "A figure without an open source does not go into your work: verify it or discard it.",
      "A report with references is only solid if every fact can be checked.",
    ],
    check: [
      {
        q: "What does grounding mean?",
        options: [
          "That the AI answers only from its memory.",
          "That the answer is backed by consulted sources you can open.",
          "That the answer is shorter.",
        ],
        correct: 1,
        feedback:
          "Grounding means backing the answer with real sources you can check.",
      },
      {
        q: "A report cites a figure with a source, but the source is from 2019 and the figure changes every year. What do you do?",
        options: [
          "I use it, because it has a source.",
          "I look for a current source before using the figure.",
          "I change the date of the source.",
        ],
        correct: 1,
        feedback:
          "Changing data needs a current source; an old reference may no longer hold.",
      },
      {
        q: "An article says «according to a survey». What should you do?",
        options: [
          "Cite the article as if it were the origin.",
          "Find the original survey, which is the primary source.",
          "Believe the figure because an article repeats it.",
        ],
        correct: 1,
        feedback:
          "The original survey is the primary source; the article is secondary.",
      },
    ],
  },
  pt: {
    badge: "Módulo 3 · Explicação",
    title: "O Arquivo Forense",
    subtitle:
      "Deep Research, grounding e fontes: pesquisar sem acreditar no primeiro resultado",
    intro:
      "Um relatório com fontes parece sólido, mas só é se você consegue conferir cada dado. Nesta lição você vai aprender o que faz o Deep Research, o que significa grounding, como separar fonte primária de secundária e o que fazer com um número sem respaldo.",
    objectives: [
      "Explicar o que é o Deep Research e como funciona",
      "Definir grounding e fonte primária",
      "Conferir uma citação abrindo a fonte",
      "Decidir o que fazer com um número sem respaldo",
    ],
    sections: [
      {
        title: "1. O que é o Deep Research",
        explain: [
          "O Deep Research é uma pesquisa em várias etapas: a ferramenta propõe um plano, busca fontes, as lê e entrega um relatório com referências. Ela não responde de memória: pesquisa.",
          "A disponibilidade depende do seu plano e da versão. Confira na sua conta o que você tem antes de planejar um trabalho.",
        ],
        terms: [
          {
            term: "Deep Research",
            def: "Pesquisa automática em várias etapas que termina em um relatório com fontes.",
          },
          {
            term: "Plano de pesquisa",
            def: "Lista de perguntas e buscas que a ferramenta propõe antes de começar.",
          },
        ],
        how: [
          "Você escreve uma pergunta de pesquisa clara.",
          "Revisa o plano proposto e ajusta o que sobra ou falta.",
          "Lê o relatório e as fontes antes de usar.",
        ],
        example:
          "«Compare a regulação de dados de saúde em três países, com fontes oficiais e data de vigência» gera um plano bem mais útil que «pesquise sobre saúde».",
        mistake:
          "Tomar o relatório como verdade só porque é longo e tem referências.",
      },
      {
        title: "2. Grounding: resposta apoiada em fontes",
        explain: [
          "Grounding significa apoiar a resposta em fontes reais que foram consultadas, em vez de responder só com o que o modelo lembra. Quando há grounding, a resposta costuma trazer links ou referências.",
          "O grounding reduz o risco, mas não o elimina: uma fonte pode existir e dizer outra coisa, ou estar desatualizada.",
        ],
        terms: [
          {
            term: "Grounding",
            def: "Resposta apoiada em fontes consultadas que você pode abrir e conferir.",
          },
          {
            term: "Fonte atualizada",
            def: "Fonte com data recente, adequada para dados que mudam.",
          },
        ],
        how: [
          "Identifique quais afirmações têm uma fonte vinculada.",
          "Abra a fonte e procure o dado exato.",
          "Confira a data: um dado antigo pode já não valer.",
        ],
        example:
          "A resposta cita um relatório de 2019 para um preço atual. Antes de usar, procure a fonte vigente.",
        mistake:
          "Achar que, por haver um link, o dado está correto. O link só indica onde procurar.",
      },
      {
        title: "3. Fonte primária e secundária",
        explain: [
          "Fonte primária é o documento original: o estudo, a norma, o registro oficial. Uma fonte secundária comenta, resume ou interpreta.",
          "Quando for possível, use a primária. Uma secundária pode simplificar demais ou citar um número sem revisar o original.",
        ],
        terms: [
          {
            term: "Fonte primária",
            def: "Documento original: um estudo, uma norma, um registro oficial.",
          },
          {
            term: "Fonte secundária",
            def: "Texto que comenta ou resume uma fonte primária.",
          },
        ],
        how: [
          "Pergunte: quem produziu este dado pela primeira vez?",
          "Procure o documento original na fonte indicada.",
          "Se só houver secundárias, diga isso no seu trabalho.",
        ],
        example:
          "Um artigo diz «segundo uma pesquisa». A pesquisa original é a fonte primária: encontre-a antes de citar o artigo.",
        mistake: "Citar a fonte secundária como se fosse a origem do dado.",
      },
      {
        title: "4. Números sem respaldo",
        explain: [
          "Um número sem respaldo é um valor que não aparece em uma fonte que você possa abrir. Pode ser um erro, um dado antigo ou uma invenção que soa crível.",
          "Regra prática: sem fonte aberta e conferida, o número não entra no seu trabalho. Você pode marcá-lo como «não verificado» ou descartá-lo.",
        ],
        terms: [
          {
            term: "Número não verificado",
            def: "Dado que você não conseguiu conferir em uma fonte aberta.",
          },
          { term: "Hipótese", def: "Afirmação proposta para conferir depois." },
        ],
        how: [
          "Marque cada número que não tenha fonte aberta.",
          "Procure a fonte original; se ela não aparecer, descarte ou marque o dado.",
          "Escreva no seu trabalho só o que conseguiu conferir.",
        ],
        example:
          "«94 % de precisão» aparece em um resultado de amostra sem fonte. Não se usa: não dá para conferir.",
        mistake:
          "Arredondar ou ajustar um número para encaixar no seu argumento.",
      },
    ],
    summary: [
      "O Deep Research pesquisa em várias etapas e entrega um relatório com fontes; confira qual plano você tem.",
      "Grounding significa apoiar-se em fontes que você pode abrir, não na memória do modelo.",
      "A fonte primária é o documento original; prefira-a à secundária.",
      "Um número sem fonte aberta não entra no seu trabalho: confira ou descarte.",
      "Um relatório com referências só é sólido se cada dado puder ser conferido.",
    ],
    check: [
      {
        q: "O que significa grounding?",
        options: [
          "Que a IA responde só com a memória dela.",
          "Que a resposta se apoia em fontes consultadas que você pode abrir.",
          "Que a resposta é mais curta.",
        ],
        correct: 1,
        feedback:
          "Grounding é apoiar a resposta em fontes reais que você pode conferir.",
      },
      {
        q: "Um relatório cita um número com fonte, mas a fonte é de 2019 e o número muda todo ano. O que você faz?",
        options: [
          "Uso, porque tem fonte.",
          "Procuro uma fonte atual antes de usar o número.",
          "Troco a data da fonte.",
        ],
        correct: 1,
        feedback:
          "Um dado que muda precisa de uma fonte atual; uma referência antiga pode já não valer.",
      },
      {
        q: "Um artigo diz «segundo uma pesquisa». O que você deve fazer?",
        options: [
          "Citar o artigo como se fosse a origem.",
          "Encontrar a pesquisa original, que é a fonte primária.",
          "Acreditar no dado porque um artigo o repete.",
        ],
        correct: 1,
        feedback:
          "A pesquisa original é a fonte primária; o artigo é secundário.",
      },
    ],
  },
};
