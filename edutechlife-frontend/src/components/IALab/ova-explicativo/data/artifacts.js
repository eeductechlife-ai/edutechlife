// OVA «El Taller de Artifacts» (ILAB-M5-OVA2). Artifacts de Claude: qué son, cómo se usan y cómo revisar lo que generan.
export default {
  es: {
    badge: "Módulo 5 · Explicación",
    title: "El Taller de Artifacts",
    subtitle:
      "Qué es un artifact, qué tipos existen, cómo se edita y cómo revisar lo que Claude construye",
    intro:
      "Un artifact es un resultado que Claude crea aparte de la conversación: un documento, una página, un gráfico o una pequeña aplicación que puedes ver, editar y descargar. Es como pasar de un borrador escrito en un chat a una pieza de trabajo con forma propia. Aquí aprenderás el vocabulario para pedirlo, editarlo y revisarlo.",
    objectives: [
      "Explicar qué es un artifact y en qué se diferencia de un mensaje",
      "Identificar los tipos de artifact más comunes",
      "Pedir cambios sobre un artifact de forma precisa",
      "Revisar un artifact antes de usarlo o compartirlo",
    ],
    sections: [
      {
        title: "1. Qué es un artifact",
        explain: [
          "Un artifact es un contenido autónomo que Claude muestra en un panel al lado de la conversación. Puede ser un texto largo, un documento, un gráfico, un código o una página interactiva.",
          "Lo importante: el artifact se puede editar y reutilizar. No se pierde en el historial del chat como un mensaje.",
        ],
        terms: [
          {
            term: "Artifact",
            def: "Resultado autónomo que Claude crea y muestra aparte de la conversación.",
          },
          {
            term: "Panel",
            def: "Espacio lateral donde se ve y se edita el artifact.",
          },
        ],
        how: [
          "Pide el contenido con su formato, por ejemplo «una página» o «un documento».",
          "Revísalo en el panel.",
          "Pide cambios concretos sobre el artifact.",
        ],
        example:
          "Pides una tabla de precios para tu tienda. Claude la muestra como artifact; luego pides agregar una columna y el artifact se actualiza.",
        mistake: "Pedir un artifact y no revisarlo porque «ya está hecho».",
      },
      {
        title: "2. Tipos de artifact",
        explain: [
          "Los tipos más comunes son el documento de texto, el código, la página web, el gráfico o diagrama y la aplicación pequeña. Cada tipo se revisa de forma distinta.",
          "Elige el tipo según el uso: un documento para leer, una página para publicar, un gráfico para mostrar datos.",
        ],
        terms: [
          {
            term: "Documento",
            def: "Artifact de texto para leer, editar o descargar.",
          },
          {
            term: "Código",
            def: "Artifact con instrucciones que una computadora ejecuta, como una página o un script.",
          },
        ],
        how: [
          "Define para qué será el resultado.",
          "Pide el tipo que corresponde a ese uso.",
          "Revisa el resultado con el criterio de ese tipo.",
        ],
        example:
          "Para una presentación de ventas pides un documento; para mostrar el crecimiento mensual pides un gráfico.",
        mistake:
          "Pedir una aplicación completa cuando solo necesitabas una tabla.",
      },
      {
        title: "3. Cómo pedir cambios",
        explain: [
          "Pide cambios precisos sobre el artifact: qué sección cambiar, qué dato agregar y en qué tono. Un cambio concreto evita que Claude reescriba todo.",
          "Cuando un artifact crece mucho, conviene pedir cambios por partes y revisar cada una.",
        ],
        terms: [
          {
            term: "Versión",
            def: "Estado del artifact después de cada cambio.",
          },
          {
            term: "Iterar",
            def: "Mejorar el resultado por pasos pequeños y revisados.",
          },
        ],
        how: [
          "Señala la parte exacta que cambia.",
          "Describe el cambio con datos.",
          "Revisa la nueva versión antes de seguir.",
        ],
        example:
          "«En la sección de precios, cambia el plan básico a 45.000 pesos y no toques lo demás.»",
        mistake:
          "Pedir «mejóralo» sin decir qué, y terminar con un texto distinto al que querías.",
      },
      {
        title: "4. Cómo revisar antes de usar",
        explain: [
          "Revisa que el contenido sea correcto: cifras, nombres, fechas y enlaces. Si el artifact es código o una página, prueba que funcione en la práctica, no solo que se vea bien.",
          "Un artifact bonito puede contener datos inventados. La revisión es tu responsabilidad.",
        ],
        terms: [
          {
            term: "Verificar",
            def: "Comprobar que lo que dice el artifact es correcto y que funciona.",
          },
          {
            term: "Prueba",
            def: "Usar el resultado como lo usaría una persona real antes de publicarlo.",
          },
        ],
        how: [
          "Compara los datos con su fuente.",
          "Prueba el resultado en uso real.",
          "Publica o comparte solo después de revisar.",
        ],
        example:
          "La página del artifact tiene un botón. Lo pulsas en la vista previa y compruebas que lleva al destino correcto.",
        mistake: "Publicar una página o una cifra sin probarla ni confirmarla.",
      },
    ],
    summary: [
      "Un artifact es un resultado autónomo que puedes ver, editar y reutilizar.",
      "Elige el tipo según el uso: documento para leer, página para publicar, gráfico para datos.",
      "Pide cambios precisos y por partes, indicando la sección y el dato.",
      "Revisa datos, enlaces y funcionamiento antes de usar o compartir.",
      "Un artifact bien presentado puede contener datos inventados: la revisión es tuya.",
    ],
    check: [
      {
        q: "¿Qué distingue a un artifact de un mensaje del chat?",
        options: [
          "Que es más largo.",
          "Que es un resultado autónomo que se puede editar y reutilizar aparte.",
          "Que solo lo puede leer Claude.",
        ],
        correct: 1,
        feedback:
          "El artifact es un resultado autónomo que se edita y reutiliza, no se pierde en el historial del chat.",
      },
      {
        q: "Quieres cambiar solo el precio de un plan en un artifact. ¿Cómo lo pides?",
        options: [
          "«Mejóralo todo.»",
          "«En la sección de precios, cambia el plan básico a 45.000 y no toques lo demás.»",
          "«Hazlo de nuevo desde cero.»",
        ],
        correct: 1,
        feedback:
          "Un cambio preciso, con sección y dato, evita que Claude reescriba lo que ya estaba bien.",
      },
      {
        q: "Una página generada como artifact se ve bien. ¿Qué haces antes de publicarla?",
        options: [
          "La publico, porque se ve bien.",
          "La pruebo en uso real y confirmo sus datos y enlaces.",
          "Le pido que la haga más bonita.",
        ],
        correct: 1,
        feedback:
          "Que se vea bien no basta: hay que probar que funciona y que sus datos son correctos.",
      },
    ],
  },
  en: {
    badge: "Module 5 · Explanation",
    title: "The Artifacts Workshop",
    subtitle:
      "What an artifact is, which types exist, how to edit it and how to review what Claude builds",
    intro:
      "An artifact is a result Claude creates apart from the conversation: a document, a page, a chart or a small application you can view, edit and download. It is like moving from a draft written in a chat to a work piece with its own shape. Here you will learn the vocabulary to request it, edit it and review it.",
    objectives: [
      "Explain what an artifact is and how it differs from a message",
      "Identify the most common artifact types",
      "Request changes on an artifact precisely",
      "Review an artifact before using or sharing it",
    ],
    sections: [
      {
        title: "1. What an artifact is",
        explain: [
          "An artifact is standalone content that Claude shows in a panel next to the conversation. It can be a long text, a document, a chart, code or an interactive page.",
          "The key point: the artifact can be edited and reused. It does not get lost in the chat history like a message does.",
        ],
        terms: [
          {
            term: "Artifact",
            def: "Standalone result that Claude creates and shows apart from the conversation.",
          },
          {
            term: "Panel",
            def: "The side space where the artifact is viewed and edited.",
          },
        ],
        how: [
          "Ask for the content in its format, for example «a page» or «a document».",
          "Review it in the panel.",
          "Request specific changes on the artifact.",
        ],
        example:
          "You ask for a price table for your shop. Claude shows it as an artifact; then you ask for an extra column and the artifact updates.",
        mistake:
          "Requesting an artifact and not reviewing it because it «is already done».",
      },
      {
        title: "2. Types of artifact",
        explain: [
          "The most common types are the text document, code, the web page, the chart or diagram and the small application. Each type is reviewed in a different way.",
          "Choose the type by its use: a document to read, a page to publish, a chart to show data.",
        ],
        terms: [
          {
            term: "Document",
            def: "A text artifact to read, edit or download.",
          },
          {
            term: "Code",
            def: "An artifact with instructions a computer runs, such as a page or a script.",
          },
        ],
        how: [
          "Define what the result is for.",
          "Ask for the type that fits that use.",
          "Review the result with that type's criteria.",
        ],
        example:
          "For a sales presentation you ask for a document; to show monthly growth you ask for a chart.",
        mistake: "Asking for a full application when you only needed a table.",
      },
      {
        title: "3. How to request changes",
        explain: [
          "Ask for precise changes on the artifact: which section to change, which data to add and in what tone. A concrete change keeps Claude from rewriting everything.",
          "When an artifact grows large, request changes in parts and review each one.",
        ],
        terms: [
          {
            term: "Version",
            def: "The state of the artifact after each change.",
          },
          {
            term: "Iterate",
            def: "Improving the result in small, reviewed steps.",
          },
        ],
        how: [
          "Point to the exact part that changes.",
          "Describe the change with data.",
          "Review the new version before continuing.",
        ],
        example:
          "«In the pricing section, change the basic plan to 45,000 pesos and leave the rest untouched.»",
        mistake:
          "Asking «improve it» without saying what, and ending with a text different from the one you wanted.",
      },
      {
        title: "4. How to review before using",
        explain: [
          "Check that the content is correct: figures, names, dates and links. If the artifact is code or a page, test that it works in practice, not just that it looks right.",
          "A polished artifact can contain invented data. The review is your responsibility.",
        ],
        terms: [
          {
            term: "Verify",
            def: "Checking that what the artifact says is correct and that it works.",
          },
          {
            term: "Test",
            def: "Using the result as a real person would before publishing it.",
          },
        ],
        how: [
          "Compare the data with its source.",
          "Test the result in real use.",
          "Publish or share only after reviewing.",
        ],
        example:
          "The artifact page has a button. You press it in the preview and check that it leads to the right destination.",
        mistake:
          "Publishing a page or a figure without testing or confirming it.",
      },
    ],
    summary: [
      "An artifact is a standalone result you can view, edit and reuse.",
      "Choose the type by its use: document to read, page to publish, chart for data.",
      "Request precise, step-by-step changes, naming the section and the data.",
      "Review data, links and behavior before using or sharing.",
      "A well-presented artifact can contain invented data: the review is yours.",
    ],
    check: [
      {
        q: "What sets an artifact apart from a chat message?",
        options: [
          "That it is longer.",
          "That it is a standalone result that can be edited and reused separately.",
          "That only Claude can read it.",
        ],
        correct: 1,
        feedback:
          "An artifact is a standalone result you edit and reuse; it does not get lost in the chat history.",
      },
      {
        q: "You want to change only the price of one plan in an artifact. How do you ask?",
        options: [
          "«Improve all of it.»",
          "«In the pricing section, change the basic plan to 45,000 and leave the rest untouched.»",
          "«Do it again from scratch.»",
        ],
        correct: 1,
        feedback:
          "A precise change, with section and data, keeps Claude from rewriting what was already right.",
      },
      {
        q: "A page generated as an artifact looks good. What do you do before publishing it?",
        options: [
          "I publish it, because it looks good.",
          "I test it in real use and confirm its data and links.",
          "I ask it to make it prettier.",
        ],
        correct: 1,
        feedback:
          "Looking good is not enough: you must test that it works and that its data is correct.",
      },
    ],
  },
  pt: {
    badge: "Módulo 5 · Explicação",
    title: "A Oficina de Artifacts",
    subtitle:
      "O que é um artifact, quais tipos existem, como editá-lo e como revisar o que o Claude constrói",
    intro:
      "Um artifact é um resultado que o Claude cria fora da conversa: um documento, uma página, um gráfico ou um pequeno aplicativo que você pode ver, editar e baixar. É como passar de um rascunho escrito em um chat para uma peça de trabalho com forma própria. Aqui você vai aprender o vocabulário para pedir, editar e revisar.",
    objectives: [
      "Explicar o que é um artifact e como ele difere de uma mensagem",
      "Identificar os tipos de artifact mais comuns",
      "Pedir alterações em um artifact de forma precisa",
      "Revisar um artifact antes de usar ou compartilhar",
    ],
    sections: [
      {
        title: "1. O que é um artifact",
        explain: [
          "Um artifact é um conteúdo autônomo que o Claude mostra em um painel ao lado da conversa. Pode ser um texto longo, um documento, um gráfico, um código ou uma página interativa.",
          "O ponto importante: o artifact pode ser editado e reutilizado. Não se perde no histórico do chat como uma mensagem.",
        ],
        terms: [
          {
            term: "Artifact",
            def: "Resultado autônomo que o Claude cria e mostra fora da conversa.",
          },
          {
            term: "Painel",
            def: "Espaço lateral onde o artifact é visto e editado.",
          },
        ],
        how: [
          "Peça o conteúdo no formato, por exemplo «uma página» ou «um documento».",
          "Revise no painel.",
          "Peça alterações concretas no artifact.",
        ],
        example:
          "Você pede uma tabela de preços para a sua loja. O Claude a mostra como artifact; depois você pede uma coluna a mais e o artifact se atualiza.",
        mistake: "Pedir um artifact e não revisá-lo porque «já está pronto».",
      },
      {
        title: "2. Tipos de artifact",
        explain: [
          "Os tipos mais comuns são o documento de texto, o código, a página web, o gráfico ou diagrama e o pequeno aplicativo. Cada tipo é revisado de um jeito diferente.",
          "Escolha o tipo pelo uso: um documento para ler, uma página para publicar, um gráfico para mostrar dados.",
        ],
        terms: [
          {
            term: "Documento",
            def: "Artifact de texto para ler, editar ou baixar.",
          },
          {
            term: "Código",
            def: "Artifact com instruções que um computador executa, como uma página ou um script.",
          },
        ],
        how: [
          "Defina para que será o resultado.",
          "Peça o tipo que corresponde a esse uso.",
          "Revise o resultado com o critério daquele tipo.",
        ],
        example:
          "Para uma apresentação de vendas você pede um documento; para mostrar o crescimento mensal, pede um gráfico.",
        mistake:
          "Pedir um aplicativo completo quando só precisava de uma tabela.",
      },
      {
        title: "3. Como pedir alterações",
        explain: [
          "Peça alterações precisas no artifact: qual seção mudar, qual dado acrescentar e em que tom. Uma mudança concreta evita que o Claude reescreva tudo.",
          "Quando um artifact cresce muito, convém pedir as mudanças por partes e revisar cada uma.",
        ],
        terms: [
          {
            term: "Versão",
            def: "Estado do artifact depois de cada alteração.",
          },
          {
            term: "Iterar",
            def: "Melhorar o resultado em passos pequenos e revisados.",
          },
        ],
        how: [
          "Aponte a parte exata que muda.",
          "Descreva a mudança com dados.",
          "Revise a nova versão antes de continuar.",
        ],
        example:
          "«Na seção de preços, troque o plano básico para 45.000 pesos e não mexa no resto.»",
        mistake:
          "Pedir «melhore» sem dizer o quê, e terminar com um texto diferente do que queria.",
      },
      {
        title: "4. Como revisar antes de usar",
        explain: [
          "Confira se o conteúdo está correto: números, nomes, datas e links. Se o artifact for código ou uma página, teste se funciona na prática, não só se parece bem.",
          "Um artifact bonito pode conter dados inventados. A revisão é sua responsabilidade.",
        ],
        terms: [
          {
            term: "Conferir",
            def: "Verificar se o que o artifact diz está correto e se funciona.",
          },
          {
            term: "Teste",
            def: "Usar o resultado como usaria uma pessoa real antes de publicar.",
          },
        ],
        how: [
          "Compare os dados com a fonte.",
          "Teste o resultado em uso real.",
          "Publique ou compartilhe só depois de revisar.",
        ],
        example:
          "A página do artifact tem um botão. Você clica na visualização e confere se leva ao destino certo.",
        mistake: "Publicar uma página ou um número sem testar ou confirmar.",
      },
    ],
    summary: [
      "Um artifact é um resultado autônomo que você pode ver, editar e reutilizar.",
      "Escolha o tipo pelo uso: documento para ler, página para publicar, gráfico para dados.",
      "Peça alterações precisas e por partes, indicando a seção e o dado.",
      "Revise dados, links e funcionamento antes de usar ou compartilhar.",
      "Um artifact bem apresentado pode conter dados inventados: a revisão é sua.",
    ],
    check: [
      {
        q: "O que diferencia um artifact de uma mensagem do chat?",
        options: [
          "Que é mais longo.",
          "Que é um resultado autônomo que pode ser editado e reutilizado à parte.",
          "Que só o Claude consegue lê-lo.",
        ],
        correct: 1,
        feedback:
          "O artifact é um resultado autônomo que você edita e reutiliza; não se perde no histórico do chat.",
      },
      {
        q: "Você quer mudar só o preço de um plano em um artifact. Como pede?",
        options: [
          "«Melhore tudo.»",
          "«Na seção de preços, troque o plano básico para 45.000 e não mexa no resto.»",
          "«Faça de novo do zero.»",
        ],
        correct: 1,
        feedback:
          "Uma mudança precisa, com seção e dado, evita que o Claude reescreva o que já estava certo.",
      },
      {
        q: "Uma página gerada como artifact está bonita. O que faz antes de publicar?",
        options: [
          "Publico, porque está bonita.",
          "Testo em uso real e confirmo os dados e links.",
          "Peço que fique ainda mais bonita.",
        ],
        correct: 1,
        feedback:
          "Estar bonita não basta: é preciso testar se funciona e se os dados estão corretos.",
      },
    ],
  },
};
