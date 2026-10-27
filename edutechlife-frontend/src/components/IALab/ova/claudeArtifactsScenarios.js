// Escenarios del quiz del "Taller de Artifacts". La respuesta correcta no se distingue por longitud ni por posición.
export const ARTIFACTS_SCENARIOS = {
  es: [
    {
      weak: "Quiero una presentación para directivos.",
      options: [
        "Presentación de 6 diapositivas para directivos sobre el trimestre, con una cifra y su fuente por diapositiva.",
        "Presentación de 6 diapositivas para directivos.",
        "Presentación para directivos sobre los resultados del trimestre, con un diseño moderno, colores de la marca y muchas gráficas.",
      ],
      correct: 0,
      why: "Define el tipo de pieza, el lector, el número de diapositivas y una regla de contenido.",
    },
    {
      weak: "¿Cómo mejoro mi Artifact sin perder lo bueno?",
      options: [
        "Pide que mejore la pieza en general.",
        "Pide un cambio a la vez, compara la versión nueva con la anterior y confirma qué mejoró y qué se conservó.",
        "Pide en un solo mensaje que acorte el texto, cambie el tono y lo convierta en tabla, para revisar el resultado final de una vez.",
      ],
      correct: 1,
      why: "Un cambio a la vez permite saber qué mejoró la pieza y conserva lo que ya funciona.",
    },
    {
      weak: "Claude te entregó una tabla con datos que no reconoces.",
      options: [
        "Le pido a Claude que revise sus propias cifras.",
        "La comparto con una nota que diga que fue hecha con IA, porque así cualquier error en las cifras queda bajo su responsabilidad.",
        "Verifico cada cifra con su fuente y pido a Claude que indique de dónde sale cada dato antes de compartir.",
      ],
      correct: 2,
      why: "Claude puede equivocarse. Antes de compartir, cada cifra debe comprobarse con una fuente.",
    },
    {
      weak: "¿Qué debe tener un buen pedido de Artifact?",
      options: [
        "El tema y el formato del documento.",
        "Objetivo, audiencia, formato, tono y límites: así la pieza tiene dirección y Claude no adivina.",
        "El tema, un ejemplo de un documento que te guste y la instrucción de que sea creativo, para que Claude encuentre el mejor enfoque.",
      ],
      correct: 1,
      why: "Son las cinco partes que dan dirección a la pieza y evitan que Claude adivine.",
    },
  ],
  en: [
    {
      weak: "I want a presentation for directors.",
      options: [
        "A 6-slide presentation for directors on this quarter's results, with one figure and its source per slide.",
        "A 6-slide presentation for directors.",
        "A presentation for directors on this quarter's results, with a modern design, brand colors and plenty of charts.",
      ],
      correct: 0,
      why: "It defines the piece type, the reader, the number of slides and a content rule.",
    },
    {
      weak: "How do I improve my Artifact without losing what works?",
      options: [
        "Ask it to improve the piece in general.",
        "Ask for one change at a time, compare with the previous version and confirm what improved.",
        "Ask in one message to shorten the text, change the tone and turn it into a table, so you review the final result at once.",
      ],
      correct: 1,
      why: "One change at a time shows what improved the piece and keeps what already works.",
    },
    {
      weak: "Claude gave you a table with data you do not recognize.",
      options: [
        "I ask Claude to check its own figures.",
        "I share it with a note saying it was made with AI, so any error in the figures is the tool's responsibility.",
        "I check each figure against its source and ask Claude where each data point comes from before sharing.",
      ],
      correct: 2,
      why: "Claude can make mistakes. Before sharing, every figure must be checked against a source.",
    },
    {
      weak: "What should a good Artifact request include?",
      options: [
        "The topic and the format of the document.",
        "Goal, audience, format, tone and limits: this gives the piece direction so Claude does not have to guess.",
        "The topic, an example of a document you like and an instruction to be creative, so Claude finds the best approach.",
      ],
      correct: 1,
      why: "These five parts give the piece direction and stop Claude from guessing.",
    },
  ],
  pt: [
    {
      weak: "Quero uma apresentação para diretores.",
      options: [
        "Apresentação de 6 slides para diretores sobre o trimestre, com um número e sua fonte por slide.",
        "Apresentação de 6 slides para diretores.",
        "Apresentação para diretores sobre os resultados do trimestre, com design moderno, cores da marca e muitos gráficos.",
      ],
      correct: 0,
      why: "Define o tipo de peça, o leitor, o número de slides e uma regra de conteúdo.",
    },
    {
      weak: "Como melhoro o meu Artifact sem perder o que funciona?",
      options: [
        "Peça que melhore a peça de forma geral.",
        "Peça uma mudança de cada vez, compare com a versão anterior e confirme o que melhorou.",
        "Peça em uma só mensagem que encurte o texto, mude o tom e transforme em tabela, para revisar o resultado final de uma vez.",
      ],
      correct: 1,
      why: "Uma mudança de cada vez mostra o que melhorou a peça e mantém o que já funciona.",
    },
    {
      weak: "O Claude entregou uma tabela com dados que você não reconhece.",
      options: [
        "Peço ao Claude que revise os próprios números.",
        "Compartilho com uma nota dizendo que foi feita com IA, para que qualquer erro nos números seja responsabilidade da ferramenta.",
        "Confiro cada número com a fonte e peço ao Claude que indique de onde vem cada dado antes de compartilhar.",
      ],
      correct: 2,
      why: "O Claude pode errar. Antes de compartilhar, cada número deve ser conferido em uma fonte.",
    },
    {
      weak: "O que um bom pedido de Artifact deve ter?",
      options: [
        "O tema e o formato do documento.",
        "Objetivo, público, formato, tom e limites: assim a peça tem direção e o Claude não precisa adivinhar.",
        "O tema, um exemplo de documento de que você gosta e a instrução de ser criativo, para que o Claude encontre a melhor abordagem.",
      ],
      correct: 1,
      why: "Essas cinco partes dão direção à peça e evitam que o Claude adivinhe.",
    },
  ],
};
