export const MODULE_4 = [
  {
    id: "m4q1",
    question:
      'Eres investigador en biología marina y necesitas analizar 15 papers académicos sobre el impacto del cambio climático en arrecifes de coral para una publicación. Tu supervisor te pregunta: "¿Por qué usarías NotebookLM en lugar de ChatGPT para esta investigación?" ¿Cuál es la razón más convincente?',
    options: [
      {
        id: "m4q1_a",
        label:
          "NotebookLM trabaja exclusivamente con tus documentos y cita textualmente de cada fuente, eliminando el riesgo de que invente datos que no están en tus papers",
      },
      {
        id: "m4q1_b",
        label:
          "ChatGPT no puede leer PDFs académicos, solo documentos de texto simple",
      },
      {
        id: "m4q1_c",
        label:
          "NotebookLM es más rápido porque no requiere conexión a internet para funcionar",
      },
      {
        id: "m4q1_d",
        label:
          "ChatGPT solo procesa información en inglés y los papers pueden estar en otros idiomas",
      },
    ],
    correctAnswer: "m4q1_a",
    topic: "NotebookLM",
    difficulty: "medio",
    feedback:
      'NotebookLM está diseñado para investigación basada en fuentes propias: cero alucinaciones, citas verificables y análisis contextual profundo. ChatGPT es excelente para tareas generales, pero para investigación académica con fuentes específicas, NotebookLM es la herramienta correcta. Repasa el video "Primeros Pasos con NotebookLM".',
  },
  {
    id: "m4q2",
    question:
      "Eres estudiante de ciencias ambientales y encuentras 30 documentos sobre cambio climático: 10 papers académicos revisados por pares, 5 artículos de noticias verificados, 8 blogs de opinión personal, 4 datasets gubernamentales y 3 documentales científicos. Tu notebook en NotebookLM acepta hasta 50 fuentes. ¿Cuál es la estrategia de curación más inteligente?",
    options: [
      {
        id: "m4q2_a",
        label:
          "Seleccionar los 10 papers + 4 datasets + 3 documentales como fuentes prioritarias, dejando fuera los blogs de opinión no verificados",
      },
      {
        id: "m4q2_b",
        label:
          "Subir los 30 documentos completos porque hay espacio disponible en el notebook",
      },
      {
        id: "m4q2_c",
        label:
          "Subir solo los 8 blogs porque usan un lenguaje más sencillo de entender",
      },
      {
        id: "m4q2_d",
        label:
          "Subir solo los 5 artículos de noticias porque tienen la fecha más reciente",
      },
    ],
    correctAnswer: "m4q2_a",
    topic: "NotebookLM",
    difficulty: "medio",
    feedback:
      'La curación no es cuestión de espacio — es seleccionar fuentes confiables y relevantes. Los papers académicos y datasets gubernamentales son verificables; los blogs de opinión añaden ruido y sesgo no fundamentado. Repasa la lección "Selecciona Fuentes como Experto" y el OVA "Simulador: Análisis de Documentos".',
  },
  {
    id: "m4q3",
    question:
      "Eres estudiante de medicina y tienes 3 PDFs de fisiología cardíaca que debes estudiar para un examen. Mañana tienes un viaje de 45 minutos en bus y quieres aprovechar ese tiempo para repasar. ¿Cuál es la mejor estrategia usando NotebookLM?",
    options: [
      {
        id: "m4q3_a",
        label:
          "Subir los 3 PDFs a un notebook, generar un Audio Overview que los analice y escucharlo durante el viaje",
      },
      {
        id: "m4q3_b",
        label:
          "Leer los 3 PDFs completos en el bus aunque haya movimiento y poca luz",
      },
      {
        id: "m4q3_c",
        label:
          "Pedirle a ChatGPT que haga un resumen general y leerlo en el bus",
      },
      {
        id: "m4q3_d",
        label: "Esperar a llegar a casa para leer los PDFs con calma",
      },
    ],
    correctAnswer: "m4q3_a",
    topic: "Audio Overview",
    difficulty: "medio",
    feedback:
      'Audio Overview convierte tus documentos en un podcast conversacional con dos voces IA que analizan el contenido. Es ideal para repasar material denso cuando no puedes leer, como durante un viaje. Repasa el video "Audio Overview: Tu Contenido en Podcast".',
  },
  {
    id: "m4q4",
    question:
      'NotebookLM responde: "La neuroplasticidad ocurre principalmente en la infancia (Fuente: neuroplasticidad.pdf, página 5)". Haces clic en la cita y en el PDF lees textual: "La neuroplasticidad es más activa durante la infancia, pero continúa durante toda la vida". ¿Qué concluyes?',
    options: [
      {
        id: "m4q4_a",
        label:
          "La IA interpretó correctamente pero simplificó el matiz — la cita original dice algo más preciso, demostrando por qué siempre debes verificar las citas textuales",
      },
      {
        id: "m4q4_b",
        label:
          "NotebookLM se equivocó completamente, la fuente original no dice nada parecido",
      },
      {
        id: "m4q4_c",
        label: "El PDF está mal escrito y deberías eliminarlo del notebook",
      },
      {
        id: "m4q4_d",
        label:
          "La respuesta de la IA es correcta porque citó el PDF correctamente, no necesitas leer la fuente original",
      },
    ],
    correctAnswer: "m4q4_a",
    topic: "Precisión",
    difficulty: "difícil",
    feedback:
      'Este es un caso clásico de por qué verificar citas es esencial. La IA no alucinó — interpretó correctamente pero perdió un matiz importante ("más activa" ≠ "ocurre principalmente"). La IA te da velocidad; tú le das precisión. Revisa la infografía "Resúmenes Inteligentes con NotebookLM".',
  },
  {
    id: "m4q5",
    question:
      "¿Cuál es la mejor práctica al organizar tus fuentes en NotebookLM para una investigación?",
    options: [
      { id: "m4q5_a", label: "Subir las 50 fuentes de una vez sin organizar" },
      {
        id: "m4q5_b",
        label:
          "Seleccionar fuentes relevantes y confiables, organizarlas por temas y categorías para obtener mejores resultados",
      },
      {
        id: "m4q5_c",
        label: "Subir solo resúmenes, nunca los documentos completos",
      },
      {
        id: "m4q5_d",
        label: "Mezclar fuentes académicas con blogs sin distinción",
      },
    ],
    correctAnswer: "m4q5_b",
    topic: "Curaduría",
    difficulty: "medio",
    feedback:
      'La calidad de tus fuentes determina la calidad de las respuestas. Repasa el tema "Selecciona Fuentes como Experto".',
  },
  {
    id: "m4q6",
    question:
      "Si encuentras dos fuentes que se contradicen en NotebookLM, ¿qué debes hacer?",
    options: [
      { id: "m4q6_a", label: "Eliminar ambas fuentes y buscar otras nuevas" },
      {
        id: "m4q6_b",
        label:
          "Analizar ambas, identificar las razones de la contradicción y documentarlo como parte de tu investigación",
      },
      { id: "m4q6_c", label: "Quedarte solo con la fuente más reciente" },
      { id: "m4q6_d", label: "Ignorar la contradicción y seguir adelante" },
    ],
    correctAnswer: "m4q6_b",
    topic: "Análisis Crítico",
    difficulty: "difícil",
    feedback:
      "Las contradicciones son oportunidades de aprendizaje. Analizarlas fortalece tu investigación. Repasa el simulador de análisis documental.",
  },
  {
    id: "m4q7",
    question:
      "Según las mejores prácticas del módulo, ¿qué debes hacer SIEMPRE que NotebookLM te da una respuesta con citas?",
    options: [
      {
        id: "m4q7_a",
        label:
          "Verificar las citas haciendo clic en ellas para confirmar que la información es correcta y está en contexto",
      },
      { id: "m4q7_b", label: "Copiar y pegar la respuesta sin revisar" },
      {
        id: "m4q7_c",
        label: "Borrar el documento original porque ya no lo necesitas",
      },
      {
        id: "m4q7_d",
        label: "Traducir la respuesta a otro idioma para verificar su calidad",
      },
    ],
    correctAnswer: "m4q7_a",
    topic: "Verificación",
    difficulty: "medio",
    feedback:
      "Siempre verifica las citas. La IA es tu asistente, pero tú eres el responsable final. Repasa el OVA del módulo.",
  },
  {
    id: "m4q8",
    question:
      "Un equipo de 4 estudiantes investiga el mismo tema para un proyecto integrador. Cada uno tiene documentos diferentes y quieren aprovechar NotebookLM para trabajar juntos. ¿Cuál es el flujo de trabajo colaborativo más eficiente?",
    options: [
      {
        id: "m4q8_a",
        label:
          "Cada estudiante crea su notebook con sus fuentes y comparte el enlace con el equipo; todos pueden consultar y hacer preguntas sobre las fuentes de los demás",
      },
      {
        id: "m4q8_b",
        label:
          "Un solo estudiante crea un notebook y los demás le piden que haga las preguntas por ellos",
      },
      {
        id: "m4q8_c",
        label:
          "Cada estudiante trabaja por separado y al final del proyecto comparan resultados manualmente",
      },
      {
        id: "m4q8_d",
        label:
          "Los 4 estudiantes se turnan para usar una misma computadora con un solo notebook abierto",
      },
    ],
    correctAnswer: "m4q8_a",
    topic: "Colaboración",
    difficulty: "medio",
    feedback:
      'NotebookLM permite compartir notebooks como Google Docs. Cada miembro puede tener su notebook temático y compartirlo, dando acceso a todo el equipo para consultar fuentes y hacer preguntas de forma independiente. Repasa el OVA "Laboratorio: Crea tu Notebook".',
  },
  {
    id: "m4q9",
    question:
      'Tienes 10 fuentes en tu notebook y quieres extraer solo las conclusiones principales sobre un tema específico (ej: "eficiencia energética"). ¿Cuál es la forma más eficiente de hacerlo?',
    options: [
      {
        id: "m4q9_a",
        label:
          'Hacer una pregunta específica a NotebookLM como "Según mis fuentes, ¿cuáles son las conclusiones principales sobre eficiencia energética? Las respuestas deben citar textualmente las fuentes"',
      },
      {
        id: "m4q9_b",
        label:
          "Leer las 10 fuentes completas una por una y tomar notas manualmente",
      },
      {
        id: "m4q9_c",
        label: "Pedirle a ChatGPT que haga el análisis sin subir las fuentes",
      },
      {
        id: "m4q9_d",
        label: "Usar la Guía de Estudio automática y copiar todo sin filtrar",
      },
    ],
    correctAnswer: "m4q9_a",
    topic: "NotebookLM",
    difficulty: "medio",
    feedback:
      'La ventaja de NotebookLM es que puedes hacer preguntas específicas y obtienes respuestas citadas de tus fuentes. No necesitas leer todo — la IA encuentra las secciones relevantes por ti. Repasa el video "Primeros Pasos con NotebookLM".',
  },
  {
    id: "m4q10",
    question:
      "¿Cuál es el límite actual de fuentes que puedes agregar a un solo notebook en NotebookLM?",
    options: [
      {
        id: "m4q10_a",
        label:
          "Hasta 50 fuentes por notebook, cada fuente puede tener hasta 500,000 palabras aproximadamente",
      },
      {
        id: "m4q10_b",
        label:
          "Ilimitado, puedes subir todas las fuentes que quieras sin restricción",
      },
      {
        id: "m4q10_c",
        label: "Máximo 10 fuentes por notebook, sin importar su tamaño",
      },
      {
        id: "m4q10_d",
        label: "Máximo 100 fuentes pero cada una de solo 10 páginas",
      },
    ],
    correctAnswer: "m4q10_a",
    topic: "Límites NotebookLM",
    difficulty: "medio",
    feedback:
      "Conocer los límites técnicos de las herramientas es parte del uso profesional. NotebookLM permite hasta 50 fuentes con un límite de palabras considerable. Revisa la documentación y los recursos del módulo sobre NotebookLM.",
  },
  {
    id: "m4q11",
    question:
      "Generas un Audio Overview desde tu notebook y los anfitriones IA conversan sobre tus fuentes. ¿Qué control tienes sobre el contenido del audio generado?",
    options: [
      {
        id: "m4q11_a",
        label:
          "Puedes personalizar los temas a cubrir y regenerar si no te gusta el resultado, pero el formato es conversacional entre dos voces IA",
      },
      {
        id: "m4q11_b",
        label:
          "No tienes ningún control, el audio se genera automáticamente sin opciones",
      },
      {
        id: "m4q11_c",
        label:
          "Puedes elegir la voz exacta, el tono y escribir el guion completo manualmente",
      },
      {
        id: "m4q11_d",
        label: "Solo puedes decidir si incluir música de fondo o no",
      },
    ],
    correctAnswer: "m4q11_a",
    topic: "Audio Overview",
    difficulty: "fácil",
    feedback:
      'Audio Overview genera un podcast conversacional automático. Puedes regenerarlo si no se ajusta a lo que necesitas y orientarlo con las instrucciones del notebook. Revisa el video "Audio Overview: Tu Contenido en Podcast".',
  },
  {
    id: "m4q12",
    question:
      'Un abogado sube 30 contratos legales a un notebook y pregunta: "¿Qué contratos tienen cláusulas de confidencialidad que expiran en menos de 2 años?" NotebookLM responde citando 5 contratos específicos con números de página. ¿Qué validación adicional debería hacer el abogado?',
    options: [
      {
        id: "m4q12_a",
        label:
          "Hacer clic en cada cita para verificar que la interpretación de la IA coincide con el texto completo de la cláusula, no solo el fragmento citado",
      },
      {
        id: "m4q12_b",
        label:
          "Confiar en la respuesta porque NotebookLM cita textualmente las fuentes",
      },
      {
        id: "m4q12_c",
        label: "Revisar solo 1 de los 5 contratos citados para ahorrar tiempo",
      },
      {
        id: "m4q12_d",
        label: "Pedirle a ChatGPT que verifique si NotebookLM tenía razón",
      },
    ],
    correctAnswer: "m4q12_a",
    topic: "Validación Legal",
    difficulty: "difícil",
    feedback:
      "En contextos legales, la verificación humana es obligatoria. Aunque NotebookLM cita textualmente, el contexto completo de la cláusula puede cambiar la interpretación. La IA acelera la revisión, pero el profesional legal es el responsable final. Repasa el tema de verificación de fuentes en el módulo.",
  },
];
