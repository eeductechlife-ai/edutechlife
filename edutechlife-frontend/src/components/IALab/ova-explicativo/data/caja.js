// OVA «La Caja de Herramientas» (ILAB-M2-OVA2). Herramientas integradas de ChatGPT: para qué sirve cada una y cómo comprobarla.
export default {
  es: {
    badge: "Módulo 2 · Explicación",
    title: "La Caja de Herramientas",
    subtitle:
      "Búsqueda, análisis, imágenes, lienzo y voz: qué hace cada herramienta y cómo comprobar lo que entrega",
    intro:
      "Un arquitecto no usa la grúa para clavar un clavo. ChatGPT trae herramientas integradas que amplían lo que puede hacer, y cada una resuelve un problema distinto y falla de forma distinta. Aquí aprenderás el vocabulario y cómo elegir y revisar cada una.",
    objectives: [
      "Explicar qué es una herramienta integrada",
      "Elegir la herramienta adecuada para una tarea",
      "Describir cómo comprobar el resultado de cada tipo",
      "Reconocer los errores más comunes al usar herramientas",
    ],
    sections: [
      {
        title: "1. Qué es una herramienta integrada",
        explain: [
          "Una herramienta integrada es una función que el modelo puede activar para hacer algo que por sí solo no hace bien: buscar información actual, ejecutar un cálculo sobre un archivo, crear una imagen o editar un documento largo.",
          "Las herramientas disponibles dependen de tu plan y del modelo. Revisa en tu cuenta cuáles tienes antes de planear un trabajo.",
        ],
        terms: [
          {
            term: "Herramienta integrada",
            def: "Función que el modelo activa para tareas concretas, como buscar o calcular.",
          },
          {
            term: "Activar",
            def: "Encender una herramienta para la tarea y apagarla cuando termines.",
          },
        ],
        how: [
          "Describe la tarea con claridad.",
          "Elige la herramienta que la resuelve.",
          "Revisa el resultado con el método propio de esa herramienta.",
        ],
        example:
          "Para saber el precio actual de un producto, activas la búsqueda web. Para sacar el promedio de un archivo de ventas, activas el análisis de datos.",
        mistake:
          "Dejar todas las herramientas activas «por si acaso». Menos herramientas activas significan menos sorpresas.",
      },
      {
        title: "2. Cinco herramientas, cinco usos",
        explain: [
          "Búsqueda web: datos recientes, noticias y documentos oficiales. Análisis de datos: cálculos y gráficos a partir de hojas de cálculo. Imágenes: ilustraciones y maquetas de concepto. Lienzo: edición conjunta de un documento largo o de código. Voz: práctica y dictado.",
          "Cada una responde a una necesidad distinta. Elegir mal la herramienta lleva a un resultado que parece bueno y no lo es.",
        ],
        terms: [
          {
            term: "Búsqueda web",
            def: "Consulta de información actual en internet, con fuentes.",
          },
          {
            term: "Análisis de datos",
            def: "Cálculo y gráfico sobre un archivo que subes.",
          },
          {
            term: "Lienzo",
            def: "Espacio de edición conjunta de un documento o código, con cambios visibles.",
          },
        ],
        how: [
          "¿Necesitas datos actuales? Búsqueda web.",
          "¿Necesitas cifras de un archivo? Análisis de datos.",
          "¿Necesitas editar un texto largo? Lienzo.",
        ],
        example:
          "Un informe de precios de la semana: búsqueda web para las fuentes; análisis de datos para comparar la tabla; lienzo para redactar.",
        mistake:
          "Usar la generación de imágenes para «probar» un dato. Una imagen ilustra; no demuestra nada.",
      },
      {
        title: "3. Cómo comprobar cada resultado",
        explain: [
          "Cada herramienta tiene su forma de comprobarse. En la búsqueda, abre las fuentes y confirma la fecha. En el análisis, recalcula unas filas a mano. En las imágenes, revisa textos, logotipos y derechos. En el lienzo, revisa cada cambio antes de aceptarlo.",
          "La regla general: si no puedes comprobar el resultado, no lo uses.",
        ],
        terms: [
          {
            term: "Fuente primaria",
            def: "Documento original al que conviene llegar para verificar un dato.",
          },
          {
            term: "Recalcular",
            def: "Repetir a mano un cálculo para confirmar el resultado.",
          },
        ],
        how: [
          "Búsqueda: abre dos fuentes y revisa su fecha.",
          "Análisis: recalcula dos filas a mano y compara.",
          "Imagen: revisa textos, logotipos y que no reproduzca a una persona real.",
        ],
        example:
          "La tabla dice que las ventas subieron 12 %. Recalculas dos meses a mano y el resultado no coincide: no usas el total.",
        mistake: "Aceptar el total de un análisis sin revisar ninguna fila.",
      },
      {
        title: "4. Errores comunes",
        explain: [
          "Tres errores aparecen casi siempre: confiar en la búsqueda sin abrir la fuente, usar una herramienta para una tarea que no le corresponde y subir datos personales a un archivo sin necesidad.",
          "Antes de subir un archivo, quita los datos personales y confidenciales que no necesitas para la tarea.",
        ],
        terms: [
          {
            term: "Dato personal",
            def: "Información que identifica a una persona; no debe subirse sin necesidad.",
          },
          {
            term: "Alucinación",
            def: "Dato que la IA produce con seguridad y que no existe en la fuente.",
          },
        ],
        how: [
          "Revisa qué datos del archivo son necesarios.",
          "Quita los personales y confidenciales.",
          "Comprueba el resultado antes de usarlo.",
        ],
        example:
          "Vas a analizar una lista de estudiantes para ver asistencia: basta el código de estudiante, no el nombre ni el teléfono.",
        mistake: "Subir el archivo completo «porque así sale mejor».",
      },
    ],
    summary: [
      "Una herramienta integrada es una función para una tarea concreta; revisa cuáles tienes en tu plan.",
      "Búsqueda para datos actuales, análisis para cifras, imágenes para ilustrar, lienzo para editar.",
      "Cada herramienta tiene su forma de comprobarse: abre fuentes, recalcula, revisa cambios.",
      "Una imagen ilustra, no prueba.",
      "Quita los datos personales que no necesitas antes de subir un archivo.",
    ],
    check: [
      {
        q: "¿Qué herramienta conviene para un dato de precios de esta semana?",
        options: [
          "La generación de imágenes.",
          "La búsqueda web, con fuentes que puedas abrir.",
          "La voz, para dictarlo.",
        ],
        correct: 1,
        feedback:
          "Para datos actuales, la búsqueda web con fuentes abiertas es la herramienta adecuada.",
      },
      {
        q: "El análisis de datos te da un total. ¿Cómo lo compruebas?",
        options: [
          "Lo acepto, porque la herramienta calcula sola.",
          "Recalculo unas filas a mano y comparo el resultado.",
          "Cambio el total para que sea redondo.",
        ],
        correct: 1,
        feedback:
          "Recalcular unas filas a mano confirma el resultado antes de usarlo.",
      },
      {
        q: "Vas a subir una lista con nombres y teléfonos para calcular asistencia. ¿Qué haces?",
        options: [
          "La subo completa, por si acaso.",
          "Quito los datos que no necesito y dejo solo el código y la asistencia.",
          "La comparto con todo el curso.",
        ],
        correct: 1,
        feedback:
          "Solo se sube lo que la tarea necesita: el dato personal sobra para calcular asistencia.",
      },
    ],
  },
  en: {
    badge: "Module 2 · Explanation",
    title: "The Toolbox",
    subtitle:
      "Search, analysis, images, canvas and voice: what each tool does and how to check what it returns",
    intro:
      "An architect does not use a crane to hang a nail. ChatGPT includes built-in tools that extend what it can do; each one solves a different problem and fails in its own way. Here you will learn the vocabulary and how to choose and check each one.",
    objectives: [
      "Explain what a built-in tool is",
      "Choose the right tool for a task",
      "Describe how to check the result of each type",
      "Recognize the most common mistakes when using tools",
    ],
    sections: [
      {
        title: "1. What a built-in tool is",
        explain: [
          "A built-in tool is a function the model can switch on to do something it does not do well on its own: look up current information, run a calculation on a file, create an image or edit a long document.",
          "The tools available depend on your plan and model. Check in your account which ones you have before planning a job.",
        ],
        terms: [
          {
            term: "Built-in tool",
            def: "A function the model activates for specific tasks, such as searching or calculating.",
          },
          {
            term: "Switch on",
            def: "To turn a tool on for the task and off when you finish.",
          },
        ],
        how: [
          "Describe the task clearly.",
          "Choose the tool that solves it.",
          "Check the result with that tool's method.",
        ],
        example:
          "To find today's price of a product, you turn on web search. To average a sales file, you turn on data analysis.",
        mistake:
          "Leaving every tool on «just in case». Fewer active tools mean fewer surprises.",
      },
      {
        title: "2. Five tools, five uses",
        explain: [
          "Web search: current data, news and official documents. Data analysis: calculations and charts from spreadsheets. Images: illustrations and concept mock-ups. Canvas: joint editing of a long document or code. Voice: practice and dictation.",
          "Each answers a different need. Choosing the wrong tool gives a result that looks good and is not.",
        ],
        terms: [
          {
            term: "Web search",
            def: "Looking up current information on the internet, with sources.",
          },
          {
            term: "Data analysis",
            def: "Calculation and charts on a file you upload.",
          },
          {
            term: "Canvas",
            def: "A joint editing space for a document or code, with visible changes.",
          },
        ],
        how: [
          "Need current data? Web search.",
          "Need figures from a file? Data analysis.",
          "Need to edit a long text? Canvas.",
        ],
        example:
          "A weekly price report: web search for the sources; data analysis to compare the table; canvas to write it.",
        mistake:
          "Using image generation to «test» a figure. An image illustrates; it proves nothing.",
      },
      {
        title: "3. How to check each result",
        explain: [
          "Each tool has its own way of being checked. In search, open the sources and confirm the date. In analysis, recalculate a few rows by hand. In images, check text, logos and rights. In canvas, review each change before accepting it.",
          "The general rule: if you cannot check the result, do not use it.",
        ],
        terms: [
          {
            term: "Primary source",
            def: "The original document you should reach to verify a figure.",
          },
          {
            term: "Recalculate",
            def: "Repeating a calculation by hand to confirm the result.",
          },
        ],
        how: [
          "Search: open two sources and check their date.",
          "Analysis: recalculate two rows by hand and compare.",
          "Image: check text, logos, and that it does not reproduce a real person.",
        ],
        example:
          "The table says sales rose 12%. You recalculate two months by hand and it does not match: you do not use the total.",
        mistake: "Accepting an analysis total without checking a single row.",
      },
      {
        title: "4. Common mistakes",
        explain: [
          "Three mistakes come up almost always: trusting search without opening the source, using a tool for a task it is not built for, and uploading personal data to a file when it is not needed.",
          "Before you upload a file, remove the personal and confidential data the task does not need.",
        ],
        terms: [
          {
            term: "Personal data",
            def: "Information that identifies a person; do not upload it unless it is needed.",
          },
          {
            term: "Hallucination",
            def: "A confident AI output that does not exist in the source.",
          },
        ],
        how: [
          "Check which data in the file is necessary.",
          "Remove personal and confidential data.",
          "Check the result before using it.",
        ],
        example:
          "You want to analyze attendance from a list of students: the student code is enough, not the name or phone number.",
        mistake:
          "Uploading the whole file «because the result comes out better».",
      },
    ],
    summary: [
      "A built-in tool is a function for a specific task; check which ones your plan includes.",
      "Search for current data, analysis for figures, images to illustrate, canvas to edit.",
      "Each tool has its own way of being checked: open sources, recalculate, review changes.",
      "An image illustrates; it does not prove.",
      "Remove the personal data you do not need before uploading a file.",
    ],
    check: [
      {
        q: "Which tool fits a price figure for this week?",
        options: [
          "Image generation.",
          "Web search, with sources you can open.",
          "Voice, to dictate it.",
        ],
        correct: 1,
        feedback:
          "For current data, web search with open sources is the right tool.",
      },
      {
        q: "Data analysis gives you a total. How do you check it?",
        options: [
          "I accept it, because the tool calculates by itself.",
          "I recalculate a few rows by hand and compare.",
          "I change the total so it is a round number.",
        ],
        correct: 1,
        feedback:
          "Recalculating a few rows by hand confirms the result before you use it.",
      },
      {
        q: "You are going to upload a list with names and phone numbers to calculate attendance. What do you do?",
        options: [
          "I upload it in full, just in case.",
          "I remove the data I do not need and keep only the code and attendance.",
          "I share it with the whole course.",
        ],
        correct: 1,
        feedback:
          "Upload only what the task needs: personal data is not needed to calculate attendance.",
      },
    ],
  },
  pt: {
    badge: "Módulo 2 · Explicação",
    title: "A Caixa de Ferramentas",
    subtitle:
      "Busca, análise, imagens, tela de edição e voz: o que cada ferramenta faz e como conferir o que ela entrega",
    intro:
      "Um arquiteto não usa o guindaste para pregar um prego. O ChatGPT traz ferramentas integradas que ampliam o que ele faz; cada uma resolve um problema diferente e falha de um jeito próprio. Aqui você vai aprender o vocabulário e como escolher e conferir cada uma.",
    objectives: [
      "Explicar o que é uma ferramenta integrada",
      "Escolher a ferramenta adequada para uma tarefa",
      "Descrever como conferir o resultado de cada tipo",
      "Reconhecer os erros mais comuns ao usar ferramentas",
    ],
    sections: [
      {
        title: "1. O que é uma ferramenta integrada",
        explain: [
          "Uma ferramenta integrada é uma função que o modelo pode ativar para fazer algo que, sozinho, não faz bem: buscar informação atual, executar um cálculo sobre um arquivo, criar uma imagem ou editar um documento longo.",
          "As ferramentas disponíveis dependem do seu plano e do modelo. Confira na sua conta quais você tem antes de planejar um trabalho.",
        ],
        terms: [
          {
            term: "Ferramenta integrada",
            def: "Função que o modelo ativa para tarefas específicas, como buscar ou calcular.",
          },
          {
            term: "Ativar",
            def: "Ligar uma ferramenta para a tarefa e desligá-la quando terminar.",
          },
        ],
        how: [
          "Descreva a tarefa com clareza.",
          "Escolha a ferramenta que a resolve.",
          "Confira o resultado com o método daquela ferramenta.",
        ],
        example:
          "Para saber o preço atual de um produto, você ativa a busca na web. Para tirar a média de um arquivo de vendas, ativa a análise de dados.",
        mistake:
          "Deixar todas as ferramentas ativas «por via das dúvidas». Menos ferramentas ativas significam menos surpresas.",
      },
      {
        title: "2. Cinco ferramentas, cinco usos",
        explain: [
          "Busca na web: dados recentes, notícias e documentos oficiais. Análise de dados: cálculos e gráficos a partir de planilhas. Imagens: ilustrações e maquetes de conceito. Tela de edição: edição conjunta de um documento longo ou de código. Voz: prática e ditado.",
          "Cada uma atende a uma necessidade diferente. Escolher a ferramenta errada leva a um resultado que parece bom e não é.",
        ],
        terms: [
          {
            term: "Busca na web",
            def: "Consulta de informação atual na internet, com fontes.",
          },
          {
            term: "Análise de dados",
            def: "Cálculo e gráfico sobre um arquivo que você envia.",
          },
          {
            term: "Tela de edição",
            def: "Espaço de edição conjunta de um documento ou código, com alterações visíveis.",
          },
        ],
        how: [
          "Precisa de dados atuais? Busca na web.",
          "Precisa de números de um arquivo? Análise de dados.",
          "Precisa editar um texto longo? Tela de edição.",
        ],
        example:
          "Um relatório de preços da semana: busca na web para as fontes; análise de dados para comparar a tabela; tela de edição para redigir.",
        mistake:
          "Usar a geração de imagens para «testar» um dado. Uma imagem ilustra; não prova nada.",
      },
      {
        title: "3. Como conferir cada resultado",
        explain: [
          "Cada ferramenta tem a sua forma de conferência. Na busca, abra as fontes e confirme a data. Na análise, recalcule algumas linhas à mão. Nas imagens, revise textos, logotipos e direitos. Na tela de edição, revise cada alteração antes de aceitar.",
          "A regra geral: se você não consegue conferir o resultado, não o use.",
        ],
        terms: [
          {
            term: "Fonte primária",
            def: "Documento original que convém alcançar para verificar um dado.",
          },
          {
            term: "Recalcular",
            def: "Refazer um cálculo à mão para confirmar o resultado.",
          },
        ],
        how: [
          "Busca: abra duas fontes e revise a data.",
          "Análise: recalcule duas linhas à mão e compare.",
          "Imagem: revise textos, logotipos e se não reproduz uma pessoa real.",
        ],
        example:
          "A tabela diz que as vendas subiram 12 %. Você recalcula dois meses à mão e não bate: não usa o total.",
        mistake: "Aceitar o total de uma análise sem conferir nenhuma linha.",
      },
      {
        title: "4. Erros comuns",
        explain: [
          "Três erros aparecem quase sempre: confiar na busca sem abrir a fonte, usar uma ferramenta para uma tarefa que não é dela e enviar dados pessoais a um arquivo sem necessidade.",
          "Antes de enviar um arquivo, retire os dados pessoais e confidenciais que a tarefa não precisa.",
        ],
        terms: [
          {
            term: "Dado pessoal",
            def: "Informação que identifica uma pessoa; não deve ser enviada sem necessidade.",
          },
          {
            term: "Alucinação",
            def: "Dado que a IA produz com segurança e que não existe na fonte.",
          },
        ],
        how: [
          "Confira quais dados do arquivo são necessários.",
          "Retire os pessoais e confidenciais.",
          "Confira o resultado antes de usar.",
        ],
        example:
          "Você quer analisar a frequência de uma lista de estudantes: basta o código do estudante, não o nome nem o telefone.",
        mistake: "Enviar o arquivo completo «porque o resultado sai melhor».",
      },
    ],
    summary: [
      "Uma ferramenta integrada é uma função para uma tarefa específica; confira quais estão no seu plano.",
      "Busca para dados atuais, análise para números, imagens para ilustrar, tela de edição para editar.",
      "Cada ferramenta tem a sua forma de conferência: abra fontes, recalcule, revise alterações.",
      "Uma imagem ilustra; não prova.",
      "Retire os dados pessoais que não precisa antes de enviar um arquivo.",
    ],
    check: [
      {
        q: "Qual ferramenta serve para um dado de preços desta semana?",
        options: [
          "A geração de imagens.",
          "A busca na web, com fontes que você possa abrir.",
          "A voz, para ditar.",
        ],
        correct: 1,
        feedback:
          "Para dados atuais, a busca na web com fontes abertas é a ferramenta adequada.",
      },
      {
        q: "A análise de dados dá um total. Como conferir?",
        options: [
          "Aceito, porque a ferramenta calcula sozinha.",
          "Recalculo algumas linhas à mão e comparo o resultado.",
          "Troco o total para ficar redondo.",
        ],
        correct: 1,
        feedback:
          "Recalcular algumas linhas à mão confirma o resultado antes de usá-lo.",
      },
      {
        q: "Você vai enviar uma lista com nomes e telefones para calcular frequência. O que faz?",
        options: [
          "Envio completa, por via das dúvidas.",
          "Retiro os dados que não preciso e deixo só o código e a frequência.",
          "Compartilho com a turma inteira.",
        ],
        correct: 1,
        feedback:
          "Envie só o que a tarefa precisa: dado pessoal não é necessário para calcular frequência.",
      },
    ],
  },
};
