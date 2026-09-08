export const MODULE_5 = [
  {
    id: "m5q1",
    question:
      "Un sistema de contratación se entrenó con datos de una empresa con mayoría de hombres y penalizaba CVs con ciertos términos. ¿Qué sesgo aparece y dónde se origina?",
    options: [
      {
        id: "m5q1_a",
        label: "Sesgo de muestreo, originado en los datos de entrenamiento",
      },
      {
        id: "m5q1_b",
        label: "Sesgo de automatización, por falta de supervisión humana",
      },
      {
        id: "m5q1_c",
        label: "Sesgo de confirmación, por ideas previas del reclutador",
      },
      {
        id: "m5q1_d",
        label: "Sesgo de etiquetado, por anotadores equivocados",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Los datos históricos no representaban a la población, así que el sesgo nació en la recolección. Repasa el laboratorio de sesgos.",
  },
  {
    id: "m5q2",
    question:
      "ChatGPT cita un estudio de salud que no existe en ningún buscador. ¿Qué haces?",
    options: [
      {
        id: "m5q2_a",
        label: "No usar el dato y verificar la fuente por tu cuenta",
      },
      {
        id: "m5q2_b",
        label: "Usar el dato porque la IA casi nunca se equivoca",
      },
      {
        id: "m5q2_c",
        label: "Preguntar otra vez a la IA y confiar en su respuesta",
      },
      {
        id: "m5q2_d",
        label: "Ignorarlo porque las alucinaciones no son frecuentes",
      },
    ],
    correctAnswer: "m5q2_a",
    topic: "Alucinaciones",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Una alucinación es información falsa con apariencia de verdad. Verifica siempre datos críticos como los de salud.",
  },
  {
    id: "m5q3",
    question:
      "Una IA da un diagnóstico que contradice tu criterio profesional. ¿Cómo actúas?",
    options: [
      { id: "m5q3_a", label: "Cuestiono la IA y consulto con otros expertos" },
      { id: "m5q3_b", label: "Acepto la IA porque es más inteligente" },
      { id: "m5q3_c", label: "Dejo que la IA decida el tratamiento" },
      { id: "m5q3_d", label: "Reinicio el sistema y vuelvo a preguntar" },
    ],
    correctAnswer: "m5q3_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "No caigas en el sesgo de automatización: tu criterio profesional es irremplazable.",
  },
  {
    id: "m5q4",
    question: "¿Cuál de estas NO es una buena práctica de privacidad con IA?",
    options: [
      { id: "m5q4_a", label: "Subir datos de clientes a un chatbot público" },
      {
        id: "m5q4_b",
        label: "Leer las políticas de privacidad de la herramienta",
      },
      {
        id: "m5q4_c",
        label: "Evitar compartir información confidencial con la IA",
      },
      {
        id: "m5q4_d",
        label: "Usar versiones empresariales con protección de datos",
      },
    ],
    correctAnswer: "m5q4_a",
    topic: "Privacidad",
    difficulty: "fácil",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "Nunca subas datos sensibles a herramientas públicas. Repasa el manual de privacidad.",
  },
  {
    id: "m5q5",
    question:
      "Un banco rechaza un crédito con IA y no explica el motivo. ¿Qué principio se viola?",
    options: [
      {
        id: "m5q5_a",
        label: "La transparencia y la explicabilidad de la decisión",
      },
      { id: "m5q5_b", label: "La privacidad por ocultar el uso de la IA" },
      { id: "m5q5_c", label: "La velocidad del proceso de decisión" },
      { id: "m5q5_d", label: "La eficiencia al usar analistas humanos" },
    ],
    correctAnswer: "m5q5_a",
    topic: "Transparencia",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Las personas tienen derecho a entender las decisiones automáticas que las afectan. Revisa el código de ética.",
  },
  {
    id: "m5q6",
    question:
      "Tu jefe pide generar reseñas falsas de un producto con IA. ¿Cuál es la postura ética?",
    options: [
      {
        id: "m5q6_a",
        label: "Negarte y proponer alternativas de promoción honestas",
      },
      { id: "m5q6_b", label: "Hacerlas porque es parte de tu trabajo" },
      {
        id: "m5q6_c",
        label: "Hacerlas cambiando detalles para que no parezcan falsas",
      },
      { id: "m5q6_d", label: "Renunciar sin dar explicaciones" },
    ],
    correctAnswer: "m5q6_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Las reseñas falsas engañan y pueden ser ilegales. Propón alternativas éticas. Repasa el laboratorio de dilemas.",
  },
  {
    id: "m5q7",
    question:
      "Un conductor distraído confía en el piloto automático y sufre un accidente. ¿Qué sesgo describe esto?",
    options: [
      {
        id: "m5q7_a",
        label: "Sesgo de automatización: se confió sin supervisión crítica",
      },
      {
        id: "m5q7_b",
        label: "Sesgo de muestreo en los datos de entrenamiento",
      },
      { id: "m5q7_c", label: "Sesgo algorítmico contra ciertos objetos" },
      { id: "m5q7_d", label: "Un error humano normal sin sesgo alguno" },
    ],
    correctAnswer: "m5q7_a",
    topic: "Sesgo de Automatización",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "El sesgo de automatización es confiar demasiado en la máquina. Mantén la supervisión activa.",
  },
  {
    id: "m5q8",
    question:
      "¿Cuál es la estrategia más responsable para proteger datos al usar IA?",
    options: [
      {
        id: "m5q8_a",
        label: "Usar herramientas seguras y anonimizar la información sensible",
      },
      { id: "m5q8_b", label: "Evitar por completo usar IA con cualquier dato" },
      {
        id: "m5q8_c",
        label: "Publicar los datos en redes para que la comunidad ayude",
      },
      {
        id: "m5q8_d",
        label: "Confiar en que la IA protege todo automáticamente",
      },
    ],
    correctAnswer: "m5q8_a",
    topic: "Protección de Datos",
    difficulty: "medio",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "La protección de los datos es tu responsabilidad: herramientas seguras y datos anonimizados.",
  },
  {
    id: "m5q9",
    question:
      "Un sistema de IA de alto riesgo (por ejemplo, aprobar una hipoteca) según la UE debe cumplir con:",
    options: [
      { id: "m5q9_a", label: "Evaluación de conformidad y supervisión humana" },
      { id: "m5q9_b", label: "Prohibición total de usar IA en ese caso" },
      { id: "m5q9_c", label: "Registro voluntario sin obligaciones" },
      { id: "m5q9_d", label: "Pagar una tasa anual por usarlo" },
    ],
    correctAnswer: "m5q9_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Los sistemas de alto riesgo exigen transparencia, documentación y supervisión humana. Revisa el marco regulatorio.",
  },
  {
    id: "m5q10",
    question:
      "Tu app educativa recopila datos de rendimiento de estudiantes. ¿Qué práctica de minimización es correcta?",
    options: [
      {
        id: "m5q10_a",
        label: "Guardar solo lo necesario con consentimiento informado",
      },
      {
        id: "m5q10_b",
        label: "Recopilar todos los datos por si acaso hacen falta",
      },
      { id: "m5q10_c", label: "Compartir los datos con terceros sin avisar" },
      { id: "m5q10_d", label: "Almacenar los datos sin plan de eliminación" },
    ],
    correctAnswer: "m5q10_a",
    topic: "Privacidad por Diseño",
    difficulty: "medio",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "Minimiza los datos: solo lo necesario, con consentimiento y un plan claro de eliminación.",
  },
];
