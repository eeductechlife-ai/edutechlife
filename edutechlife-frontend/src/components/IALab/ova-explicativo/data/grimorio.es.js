export default {
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
};
