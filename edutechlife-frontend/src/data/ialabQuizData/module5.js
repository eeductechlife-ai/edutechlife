export const MODULE_5 = [
  {
    id: "m5q1",
    question:
      'Un sistema de contratación basado en IA fue entrenado con datos históricos de una empresa tecnológica donde el 78% de los empleados eran hombres. El sistema aprendió a priorizar CVs con palabras como "ingeniero" y "líder técnico", y penalizaba términos como "voluntariado" o "licencia parental". Las candidatas mujeres con calificaciones equivalentes recibían puntuaciones más bajas. ¿Qué tipo de sesgo está presente y en qué etapa del pipeline de IA se originó?',
    options: [
      {
        id: "m5q1_a",
        label:
          "Sesgo de muestreo — los datos de entrenamiento no representaban equitativamente a la población, originado en la recolección de datos",
      },
      {
        id: "m5q1_b",
        label:
          "Sesgo de automatización — el sistema decidió por sí mismo sin supervisión humana",
      },
      {
        id: "m5q1_c",
        label:
          "Sesgo de confirmación — los reclutadores buscaban confirmar sus propias creencias",
      },
      {
        id: "m5q1_d",
        label:
          "Sesgo de etiquetado — las etiquetas fueron puestas incorrectamente por anotadores externos",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    feedback:
      'Este es un caso clásico de sesgo de muestreo (sampling bias). Los datos históricos de una empresa con 78% de hombres no representan a la población general de candidatos. El sesgo se originó en la recolección de datos, antes del entrenamiento. Repasa el OVA "Laboratorio: Detecta el Sesgo" y el PDF "Guía de Detección de Sesgos".',
  },
  {
    id: "m5q2",
    question:
      'Usas ChatGPT para investigar un tratamiento contra la ansiedad. La IA responde: "Según un estudio de Harvard de 2023, el 89% de los pacientes redujo sus síntomas con esta terapia". Intentas buscar el estudio y no encuentras nada. Las cifras y la fuente parecen inventadas. ¿Cuál es la acción más responsable?',
    options: [
      {
        id: "m5q2_a",
        label:
          "No usar esa información hasta verificarla con fuentes confiables, reportar el posible error y documentar que la IA alucinó",
      },
      {
        id: "m5q2_b",
        label:
          "Usar la información igual porque la IA rara vez se equivoca en datos concretos",
      },
      {
        id: "m5q2_c",
        label:
          "Pedirle a la misma IA que busque la fuente nuevamente y confiar en lo que responda",
      },
      {
        id: "m5q2_d",
        label:
          "Ignorar el incidente porque las alucinaciones son poco comunes y no afectan",
      },
    ],
    correctAnswer: "m5q2_a",
    topic: "Alucinaciones",
    difficulty: "medio",
    feedback:
      'Las alucinaciones son información falsa con apariencia de verdad. Son especialmente peligrosas en contextos de salud donde pueden tener consecuencias graves. Siempre verifica fuentes de información crítica. Repasa el laboratorio "Detecta el Sesgo".',
  },
  {
    id: "m5q3",
    question:
      "Estás usando IA para un diagnóstico médico y el resultado contradice tu criterio profesional. ¿Cómo actúas éticamente?",
    options: [
      {
        id: "m5q3_a",
        label: "Aceptas la IA sin cuestionar porque es más inteligente",
      },
      {
        id: "m5q3_b",
        label:
          "Cuestionas el posible sesgo de automatización, verificas con otros expertos y usas tu criterio profesional",
      },
      { id: "m5q3_c", label: "Dejas que la IA decida el tratamiento" },
      { id: "m5q3_d", label: "Apagas la computadora y empiezas de nuevo" },
    ],
    correctAnswer: "m5q3_b",
    topic: "Responsabilidad",
    difficulty: "medio",
    feedback:
      'El sesgo de automatización nos hace confiar ciegamente en la IA. Tu criterio profesional es irremplazable. Repasa el tema "Ética en IA: Lo Esencial".',
  },
  {
    id: "m5q4",
    question:
      "¿Cuál de las siguientes NO es una buena práctica de privacidad al usar IA?",
    options: [
      {
        id: "m5q4_a",
        label:
          "Subir datos personales de clientes a un chatbot público para que los analice",
      },
      {
        id: "m5q4_b",
        label:
          "Leer las políticas de privacidad antes de usar una herramienta de IA",
      },
      {
        id: "m5q4_c",
        label: "No compartir información confidencial en conversaciones con IA",
      },
      {
        id: "m5q4_d",
        label: "Usar versiones empresariales que ofrecen protección de datos",
      },
    ],
    correctAnswer: "m5q4_a",
    topic: "Privacidad",
    difficulty: "medio",
    feedback:
      'Nunca subas datos sensibles a herramientas públicas. Repasa el PDF "Manual de Privacidad en IA" y el video del módulo.',
  },
  {
    id: "m5q5",
    question:
      'Un banco implementa un sistema de IA para aprobar o rechazar solicitudes de crédito. Un cliente es rechazado y pide saber por qué. El banco responde: "Es una decisión de la IA, no podemos explicar cómo funciona internamente". ¿Qué principio ético se viola y qué debería hacer el banco?',
    options: [
      {
        id: "m5q5_a",
        label:
          "Transparencia y explicabilidad — el banco debería auditar el modelo y proporcionar explicaciones comprensibles al cliente",
      },
      {
        id: "m5q5_b",
        label:
          "Privacidad — el banco debería ocultar el uso de IA para proteger al cliente",
      },
      {
        id: "m5q5_c",
        label:
          "Velocidad — el banco debería procesar las solicitudes más rápido",
      },
      {
        id: "m5q5_d",
        label:
          "Eficiencia — el banco debería reemplazar a los analistas humanos",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Transparencia",
    difficulty: "medio",
    feedback:
      'La transparencia es un pilar ético fundamental. Los ciudadanos tienen derecho a entender decisiones automatizadas que les afectan. El AI Act de la UE exige explicabilidad en decisiones de alto riesgo como créditos. Repasa el video "IA Ética: Principios y Práctica" y el PDF "Código de Ética para Uso de IA".',
  },
  {
    id: "m5q6",
    question:
      "Eres diseñador UX en una agencia digital. Tu jefe te pide usar IA para generar 50 reseñas falsas positivas de un producto que aún no se ha lanzado, para mejorar su reputación inicial en redes. ¿Cuál es la postura más ética?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Negarte a generar reseñas falsas, explicar que viola principios éticos de transparencia y proponer alternativas legítimas de promoción",
      },
      {
        id: "m5q6_b",
        label:
          "Generar las reseñas porque tu jefe lo pidió y es parte de tu trabajo",
      },
      {
        id: "m5q6_c",
        label:
          "Generar las reseñas pero modificar algunos detalles para que parezcan menos falsas",
      },
      { id: "m5q6_d", label: "Renunciar inmediatamente sin dar explicaciones" },
    ],
    correctAnswer: "m5q6_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    feedback:
      'Generar reseñas falsas viola principios éticos de transparencia y honestidad, y puede tener consecuencias legales (publicidad engañosa). El mejor camino es proponer alternativas éticas. Repasa el OVA "Laboratorio: Dilemas Éticos" y el decálogo del usuario ético.',
  },
  {
    id: "m5q7",
    question:
      "Un conductor con piloto automático viene distraído mirando el celular. El sistema detecta un obstáculo y frena a tiempo. El conductor confía en que siempre funcionará. Semanas después, con poca luz, el sistema no detecta un objeto pequeño y ocurre un accidente. ¿Qué sesgo describe esta situación y cómo prevenirla?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Sesgo de automatización — el conductor delegó su atención sin supervisión crítica. Se previene con entrenamiento en límites del sistema y supervisión activa",
      },
      {
        id: "m5q7_b",
        label:
          "Sesgo de muestreo — los datos de entrenamiento no incluían objetos pequeños con poca luz",
      },
      {
        id: "m5q7_c",
        label:
          "Sesgo algorítmico — el sistema discriminaba contra ciertos tipos de objetos",
      },
      {
        id: "m5q7_d",
        label:
          "Error humano normal — los accidentes ocurren, no hay sesgo involucrado",
      },
    ],
    correctAnswer: "m5q7_a",
    topic: "Sesgo de Automatización",
    difficulty: "difícil",
    feedback:
      'El sesgo de automatización es la tendencia humana a confiar excesivamente en sistemas automatizados, abandonando el pensamiento crítico. El conductor asumió que el sistema era infalible. Repasa el OVA "Laboratorio: Detecta el Sesgo" y el tema "Sesgos Algorítmicos y Equidad".',
  },
  {
    id: "m5q8",
    question:
      "Quieres usar IA para un proyecto pero te preocupa la privacidad de los datos. Según el módulo, ¿cuál es la estrategia más responsable?",
    options: [
      {
        id: "m5q8_a",
        label: "No usar IA nunca para nada relacionado con datos",
      },
      {
        id: "m5q8_b",
        label:
          "Usar herramientas con protección de datos empresarial, anonimizar información sensible y nunca compartir datos personales en chats públicos",
      },
      {
        id: "m5q8_c",
        label:
          "Compartir los datos en redes sociales para que la comunidad ayude",
      },
      {
        id: "m5q8_d",
        label: "Confiar en que la IA automáticamente protege todos los datos",
      },
    ],
    correctAnswer: "m5q8_b",
    topic: "Protección de Datos",
    difficulty: "difícil",
    feedback:
      'La protección de datos es responsabilidad tuya. Usa herramientas seguras, anonimiza y nunca compartas información sensible. Repasa "Protege tus Datos en la Era de la IA".',
  },
  {
    id: "m5q9",
    question:
      'La Unión Europea clasifica los sistemas de IA por nivel de riesgo (mínimo, limitado, alto, inaceptable). Un sistema que determina el acceso a servicios financieros esenciales (como aprobar una hipoteca) entraría en la categoría de "alto riesgo". ¿Qué obligación impone esta clasificación?',
    options: [
      {
        id: "m5q9_a",
        label:
          "Evaluaciones de conformidad, documentación técnica, transparencia y supervisión humana obligatoria",
      },
      {
        id: "m5q9_b",
        label: "Prohibición total del uso de IA en servicios financieros",
      },
      {
        id: "m5q9_c",
        label: "Registro voluntario sin obligaciones específicas",
      },
      { id: "m5q9_d", label: "Solo pagar una tasa anual por usar el sistema" },
    ],
    correctAnswer: "m5q9_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    feedback:
      'El AI Act europeo es el primer marco regulatorio integral de IA. Los sistemas de alto riesgo requieren evaluaciones de conformidad, documentación, transparencia y supervisión humana. Es importante conocer el marco regulatorio al desarrollar soluciones de IA. Revisa el tema "Marco Legal y Regulatorio de la IA".',
  },
  {
    id: "m5q10",
    question:
      "Un equipo de data scientists entrena un modelo para predecir éxito académico. Descubren que el modelo asigna puntuaciones más bajas a estudiantes de ciertas regiones geográficas, incluso controlando por calificaciones y recursos. ¿Qué métrica de equidad deberían priorizar para diagnosticar el problema?",
    options: [
      {
        id: "m5q10_a",
        label:
          "Paridad demográfica — verificar si la tasa de predicción positiva es similar entre grupos geográficos",
      },
      {
        id: "m5q10_b",
        label: "Precisión general del modelo sin desglosar por grupos",
      },
      { id: "m5q10_c", label: "Velocidad de entrenamiento del modelo" },
      { id: "m5q10_d", label: "Cantidad total de datos de entrenamiento" },
    ],
    correctAnswer: "m5q10_a",
    topic: "Equidad Algorítmica",
    difficulty: "difícil",
    feedback:
      'La paridad demográfica (demographic parity) mide si las predicciones del modelo son equitativas entre grupos. Si el modelo predice éxito con menor frecuencia para ciertas regiones, hay un sesgo que debe investigarse y corregirse. Revisa el OVA "Laboratorio: Detecta el Sesgo".',
  },
  {
    id: "m5q11",
    question:
      "Estás desarrollando una app educativa con IA que recopila datos de rendimiento de estudiantes. Siguiendo el principio de minimización de datos, ¿cuál es la práctica correcta?",
    options: [
      {
        id: "m5q11_a",
        label:
          "Recopilar solo los datos estrictamente necesarios para la funcionalidad educativa, con consentimiento informado y política de eliminación clara",
      },
      {
        id: "m5q11_b",
        label:
          'Recopilar todos los datos posibles "por si acaso" se necesitan después',
      },
      {
        id: "m5q11_c",
        label:
          "Compartir los datos automáticamente con terceros sin notificar a los usuarios",
      },
      {
        id: "m5q11_d",
        label: "Almacenar los datos indefinidamente sin plan de eliminación",
      },
    ],
    correctAnswer: "m5q11_a",
    topic: "Privacidad por Diseño",
    difficulty: "medio",
    feedback:
      'La minimización de datos es un principio fundamental de privacidad: solo recopila lo necesario, con consentimiento, y ten un plan claro de eliminación. Repasa el tema "Protege tus Datos en la Era de la IA" y el PDF "Manual de Privacidad en IA".',
  },
  {
    id: "m5q12",
    question:
      "Un equipo de IA documenta su modelo con una model card (tarjeta de modelo). Según las mejores prácticas, ¿qué información DEBE incluir?",
    options: [
      {
        id: "m5q12_a",
        label:
          "Propósito del modelo, datos de entrenamiento, métricas de rendimiento por subgrupos, limitaciones conocidas y consideraciones éticas",
      },
      { id: "m5q12_b", label: "Solo el nombre del modelo y la versión" },
      {
        id: "m5q12_c",
        label: "Los nombres completos de los desarrolladores y sus salarios",
      },
      { id: "m5q12_d", label: "El código fuente completo del modelo" },
    ],
    correctAnswer: "m5q12_a",
    topic: "Documentación Ética",
    difficulty: "medio",
    feedback:
      "Las model cards son un estándar de transparencia en IA. Incluyen propósito, datos, métricas por subgrupo, limitaciones y consideraciones éticas. Permiten a los usuarios entender las capacidades y limitaciones del modelo antes de usarlo. Repasa el tema de transparencia en IA en los recursos del módulo.",
  },
];
