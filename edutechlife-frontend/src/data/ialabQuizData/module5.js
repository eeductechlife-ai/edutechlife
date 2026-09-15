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
  {
    id: "m5q11",
    question: "¿Cuáles son los 4 principios éticos clave que guían el uso responsable de la IA?",
    options: [
      {
        id: "m5q11_a",
        label: "Transparencia, equidad, responsabilidad y privacidad",
      },
      { id: "m5q11_b", label: "Velocidad, ahorro, automatización y eficiencia" },
      { id: "m5q11_c", label: "Popularidad, beneficio, escala y competencia" },
      { id: "m5q11_d", label: "Innovación, inversión, patente y propiedad" },
    ],
    correctAnswer: "m5q11_a",
    topic: "Principios Éticos",
    difficulty: "fácil",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Transparencia, equidad, responsabilidad y privacidad son los pilares. Repasa el video de principios y práctica.",
  },
  {
    id: "m5q12",
    question: "¿Qué significa el principio de transparencia en un sistema de IA?",
    options: [
      {
        id: "m5q12_a",
        label: "Que las personas puedan entender cómo y por qué decide la IA",
      },
      { id: "m5q12_b", label: "Que el sistema funcione sin que nadie sepa cómo lo hace" },
      { id: "m5q12_c", label: "Que use solo datos públicos sin ningún tipo de control" },
      { id: "m5q12_d", label: "Que su código sea secreto para proteger el negocio" },
    ],
    correctAnswer: "m5q12_a",
    topic: "Transparencia",
    difficulty: "fácil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La transparencia permite entender y auditar las decisiones. Revisa el código de ética.",
  },
  {
    id: "m5q13",
    question: "¿Qué es el sesgo de muestreo en un modelo de IA?",
    options: [
      {
        id: "m5q13_a",
        label: "Los datos de entrenamiento no representan a toda la población",
      },
      { id: "m5q13_b", label: "El sistema funciona lento con bases de datos grandes" },
      { id: "m5q13_c", label: "El modelo cambia de idioma sin que se lo pidas" },
      { id: "m5q13_d", label: "La IA olvida los datos al apagarse por completo" },
    ],
    correctAnswer: "m5q13_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "El sesgo de muestreo nace de datos no representativos. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m5q14",
    question: "¿Qué es el sesgo de confirmación aplicado a la IA?",
    options: [
      {
        id: "m5q14_a",
        label: "El sistema refuerza patrones existentes sin cuestionarlos",
      },
      { id: "m5q14_b", label: "La IA confirma siempre que sus datos están completos" },
      { id: "m5q14_c", label: "El modelo pide confirmación antes de cada respuesta" },
      { id: "m5q14_d", label: "El usuario confirma su contraseña para usar la IA" },
    ],
    correctAnswer: "m5q14_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "El sesgo de confirmación refuerza lo ya presente en los datos. Repasa el laboratorio de sesgos.",
  },
  {
    id: "m5q15",
    question: "¿Qué es el sesgo de etiquetado?",
    options: [
      {
        id: "m5q15_a",
        label: "Las etiquetas de entrenamiento arrastran prejuicios de quienes las crean",
      },
      { id: "m5q15_b", label: "El sistema clasifica los datos de forma automática y neutral" },
      { id: "m5q15_c", label: "La IA coloca una etiqueta visible a cada respuesta generada" },
      { id: "m5q15_d", label: "El modelo desactiva las etiquetas cuando hay muchos datos" },
    ],
    correctAnswer: "m5q15_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Si quien etiqueta tiene sesgos, el modelo los aprende. Repasa el laboratorio de sesgos.",
  },
  {
    id: "m5q16",
    question: "¿Qué es el sesgo de automatización?",
    options: [
      {
        id: "m5q16_a",
        label: "Confiar en la máquina sin supervisión humana suficiente",
      },
      { id: "m5q16_b", label: "Automatizar una tarea sin documentar el proceso interno" },
      { id: "m5q16_c", label: "Que la IA automatice todos los sesgos de los datos" },
      { id: "m5q16_d", label: "Usar demasiadas herramientas de IA a la vez" },
    ],
    correctAnswer: "m5q16_a",
    topic: "Sesgo de Automatización",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "El sesgo de automatización es confiar en exceso en la máquina. Mantén la supervisión activa.",
  },
  {
    id: "m5q17",
    question: "Una IA penaliza sistemáticamente a cierto grupo en contratación. ¿Qué haces?",
    options: [
      {
        id: "m5q17_a",
        label: "Detener el sistema, documentar el sesgo y corregir los datos",
      },
      { id: "m5q17_b", label: "Ignorarlo porque el modelo funciona rápido y barato" },
      { id: "m5q17_c", label: "Ocultar los resultados para evitar reclamos legales" },
      { id: "m5q17_d", label: "Subir más datos históricos iguales al sistema afectado" },
    ],
    correctAnswer: "m5q17_a",
    topic: "Mitigación de Sesgos",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Ante un sesgo detectado, detén, documenta y corrige. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m5q18",
    question: "¿Qué es la equidad (fairness) en un sistema de IA?",
    options: [
      {
        id: "m5q18_a",
        label: "Tratar a los grupos de forma justa y evitar impactos desproporcionados",
      },
      { id: "m5q18_b", label: "Dar siempre la misma respuesta a cualquier tipo de usuario" },
      { id: "m5q18_c", label: "Asignar los recursos al usuario con más antigüedad" },
      { id: "m5q18_d", label: "Optimizar solo la velocidad del sistema informático" },
    ],
    correctAnswer: "m5q18_a",
    topic: "Equidad",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La equidad busca evitar impactos injustos entre grupos. Revisa el código de ética.",
  },
  {
    id: "m5q19",
    question: "¿Qué busca la explicabilidad de un modelo de IA?",
    options: [
      {
        id: "m5q19_a",
        label: "Que las decisiones automáticas se puedan justificar ante las personas",
      },
      { id: "m5q19_b", label: "Que el modelo explique por qué consume tantos recursos" },
      { id: "m5q19_c", label: "Que el sistema resuma sus respuestas en menos palabras" },
      { id: "m5q19_d", label: "Que se puedan traducir sus respuestas a otros idiomas" },
    ],
    correctAnswer: "m5q19_a",
    topic: "Explicabilidad",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La explicabilidad permite justificar decisiones ante las personas afectadas. Repasa el código de ética.",
  },
  {
    id: "m5q20",
    question: "¿Qué implica el principio de responsabilidad (accountability)?",
    options: [
      {
        id: "m5q20_a",
        label: "Que haya personas y procesos claros que respondan por los resultados",
      },
      { id: "m5q20_b", label: "Que la IA sea la única responsable de todo fallo posible" },
      { id: "m5q20_c", label: "Que se garantice que el sistema nunca tendrá errores" },
      { id: "m5q20_d", label: "Que la responsabilidad se diluya entre todos los usuarios" },
    ],
    correctAnswer: "m5q20_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Siempre debe haber personas responsables de los resultados. Revisa el código de ética.",
  },
  {
    id: "m5q21",
    question:
      "Una IA médica sugiere un tratamiento. ¿Cuál es la mejor práctica de supervisión?",
    options: [
      {
        id: "m5q21_a",
        label: "Un profesional valida la sugerencia antes de aplicarla al paciente",
      },
      { id: "m5q21_b", label: "Aplicar el tratamiento recomendado sin ninguna revisión" },
      { id: "m5q21_c", label: "Descartar la IA porque nunca puede ser útil en salud" },
      { id: "m5q21_d", label: "Dejar que el paciente decida sin consultar a nadie" },
    ],
    correctAnswer: "m5q21_a",
    topic: "Supervisión Humana",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "En ámbitos críticos, la decisión final la valida un profesional. Repasa el video de principios.",
  },
  {
    id: "m5q22",
    question: "¿Cuál es un ejemplo de dato sensible que NO deberías subir a una IA pública?",
    options: [
      {
        id: "m5q22_a",
        label: "Historial médico o documentos de identidad de clientes reales",
      },
      { id: "m5q22_b", label: "Un texto público de Wikipedia sobre historia antigua" },
      { id: "m5q22_c", label: "Una idea general para un titular de periódico" },
      { id: "m5q22_d", label: "Una pregunta sobre un tema académico cualquiera" },
    ],
    correctAnswer: "m5q22_a",
    topic: "Privacidad",
    difficulty: "fácil",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "Datos de salud o identidad son sensibles: nunca los subas a herramientas públicas. Repasa el manual.",
  },
  {
    id: "m5q23",
    question: "¿Qué es la privacidad por diseño?",
    options: [
      {
        id: "m5q23_a",
        label: "Incorporar la protección de datos desde el inicio del sistema",
      },
      { id: "m5q23_b", label: "Añadir la privacidad solo si hay una queja de usuarios" },
      { id: "m5q23_c", label: "Ocultar el uso de datos en la letra pequeña del contrato" },
      { id: "m5q23_d", label: "Recolectar todo y decidir la privacidad al final del proyecto" },
    ],
    correctAnswer: "m5q23_a",
    topic: "Privacidad por Diseño",
    difficulty: "medio",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "La privacidad se diseña desde el inicio, no se agrega al final. Repasa el manual de privacidad.",
  },
  {
    id: "m5q24",
    question: "¿Qué es el principio de minimización de datos?",
    options: [
      {
        id: "m5q24_a",
        label: "Recolectar y guardar solo los datos estrictamente necesarios",
      },
      { id: "m5q24_b", label: "Recolectar todos los datos posibles por si acaso" },
      { id: "m5q24_c", label: "Comprimir los datos para que ocupen menos espacio" },
      { id: "m5q24_d", label: "Eliminar los datos de forma aleatoria cada cierto tiempo" },
    ],
    correctAnswer: "m5q24_a",
    topic: "Protección de Datos",
    difficulty: "medio",
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "Minimizar es pedir y guardar solo lo necesario. Repasa el manual de privacidad.",
  },
  {
    id: "m5q25",
    question: "¿Cómo se clasifican los sistemas de IA según el nivel de riesgo (UE)?",
    options: [
      {
        id: "m5q25_a",
        label: "Riesgo inaceptable, alto, limitado y mínimo",
      },
      { id: "m5q25_b", label: "Riesgo pequeño, mediano, grande y gigante" },
      { id: "m5q25_c", label: "Riesgo técnico, humano y financiero solamente" },
      { id: "m5q25_d", label: "Riesgo público, privado y confidencial únicamente" },
    ],
    correctAnswer: "m5q25_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La UE distingue riesgo inaceptable, alto, limitado y mínimo. Repasa el código de ética.",
  },
  {
    id: "m5q26",
    question: "¿Qué tipo de sistemas de IA están prohibidos por su riesgo inaceptable?",
    options: [
      {
        id: "m5q26_a",
        label: "Los que manipulan o discriminan gravemente a las personas",
      },
      { id: "m5q26_b", label: "Los que resumen documentos internos de empresas" },
      { id: "m5q26_c", label: "Los que traducen textos a otros idiomas comunes" },
      { id: "m5q26_d", label: "Los que sugieren ideas para una campaña de marketing" },
    ],
    correctAnswer: "m5q26_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Los usos que manipulan o discriminan gravemente están prohibidos. Repasa el código de ética.",
  },
  {
    id: "m5q27",
    question: "Un sistema de IA de alto riesgo debe, entre otras cosas…",
    options: [
      {
        id: "m5q27_a",
        label: "Documentarse, evaluarse y contar con supervisión humana",
      },
      { id: "m5q27_b", label: "Funcionar sin registro ni evaluación de ningún tipo" },
      { id: "m5q27_c", label: "Operar solo de noche para consumir menos energía" },
      { id: "m5q27_d", label: "Publicar todo su código en abierto de forma obligatoria" },
    ],
    correctAnswer: "m5q27_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "El alto riesgo exige documentación, evaluación y supervisión humana. Repasa el marco regulatorio.",
  },
  {
    id: "m5q28",
    question:
      "Una app de IA toma decisiones sobre becas de estudiantes. ¿Qué debes garantizar?",
    options: [
      {
        id: "m5q28_a",
        label: "Criterios justos, revisión humana y posibilidad de apelar la decisión",
      },
      { id: "m5q28_b", label: "Que decida sin explicar nunca sus criterios de selección" },
      { id: "m5q28_c", label: "Que otorgue becas solo a quien más interactúa en la app" },
      { id: "m5q28_d", label: "Que la decisión sea final y sin ninguna posibilidad de reclamo" },
    ],
    correctAnswer: "m5q28_a",
    topic: "Gobernanza",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Decisiones que afectan a personas requieren justicia, revisión y derecho a apelar.",
  },
  {
    id: "m5q29",
    question: "¿Qué es una auditoría de sesgo en un sistema de IA?",
    options: [
      {
        id: "m5q29_a",
        label: "Revisar sistemáticamente si el modelo trata injustamente a algún grupo",
      },
      { id: "m5q29_b", label: "Medir solo la velocidad de respuesta del sistema completo" },
      { id: "m5q29_c", label: "Comprobar cuántos usuarios tiene registrados la plataforma" },
      { id: "m5q29_d", label: "Verificar únicamente el costo mensual de la herramienta" },
    ],
    correctAnswer: "m5q29_a",
    topic: "Auditoría",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Auditar el sesgo es revisar si algún grupo resulta perjudicado. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m5q30",
    question:
      "Un modelo discrimina pese a eliminarse el campo 'género'. ¿Qué haces?",
    options: [
      {
        id: "m5q30_a",
        label: "Buscar variables sustitutas y corregir el sesgo indirecto",
      },
      { id: "m5q30_b", label: "Dar por resuelto el problema solo por quitar ese campo" },
      { id: "m5q30_c", label: "Añadir más datos y confiar en que se corrija solo" },
      { id: "m5q30_d", label: "Ocultar los resultados hasta que nadie vuelva a notarlo" },
    ],
    correctAnswer: "m5q30_a",
    topic: "Mitigación de Sesgos",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Hay variables que sustituyen al atributo eliminado (sesgo indirecto). Repasa el laboratorio de sesgos.",
  },
  {
    id: "m5q31",
    question: "¿Cuál es un uso NO ético de la IA?",
    options: [
      {
        id: "m5q31_a",
        label: "Suplantar la identidad de una persona con voz o imagen generadas",
      },
      { id: "m5q31_b", label: "Resumir un informe propio para una reunión de trabajo" },
      { id: "m5q31_c", label: "Revisar la ortografía de un texto antes de publicarlo" },
      { id: "m5q31_d", label: "Generar ideas para un proyecto personal de aprendizaje" },
    ],
    correctAnswer: "m5q31_a",
    topic: "Uso Responsable",
    difficulty: "fácil",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Suplantar identidades con IA es un uso no ético y puede ser ilegal. Repasa el video de principios.",
  },
  {
    id: "m5q32",
    question:
      "Debes explicar a un usuario por qué la IA rechazó su solicitud. ¿Qué aplicas?",
    options: [
      {
        id: "m5q32_a",
        label: "Explicabilidad: dar motivos comprensibles y opción de revisión",
      },
      { id: "m5q32_b", label: "Opacidad: responder solo que 'el sistema lo decidió así'" },
      { id: "m5q32_c", label: "Velocidad: cerrar el caso cuanto antes sin explicar nada" },
      { id: "m5q32_d", label: "Automatización: dejar que nadie más intervenga en el caso" },
    ],
    correctAnswer: "m5q32_a",
    topic: "Explicabilidad",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Explica los motivos en lenguaje claro y permite revisión. Revisa el código de ética.",
  },
  {
    id: "m5q33",
    question:
      "Un chatbot educativo empieza a dar respuestas inapropiadas a menores. ¿Qué haces?",
    options: [
      {
        id: "m5q33_a",
        label: "Pausar el sistema, investigar y añadir salvaguardas de contenido",
      },
      { id: "m5q33_b", label: "Dejar que siga funcionando y avisar solo si alguien se queja" },
      { id: "m5q33_c", label: "Eliminar la moderación para que responda con más libertad" },
      { id: "m5q33_d", label: "Culpar a los menores por el uso que le dan al sistema" },
    ],
    correctAnswer: "m5q33_a",
    topic: "Salvaguardas",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Con menores, pausa, investiga y refuerza las salvaguardas de contenido. Repasa el laboratorio de dilemas.",
  },
  {
    id: "m5q34",
    question: "¿Qué implica que un sistema de IA sea 'auditable'?",
    options: [
      {
        id: "m5q34_a",
        label: "Que se pueda revisar su funcionamiento y sus decisiones por terceros",
      },
      { id: "m5q34_b", label: "Que su código permanezca oculto incluso para su creador" },
      { id: "m5q34_c", label: "Que no requiera mantenimiento técnico durante su vida útil" },
      { id: "m5q34_d", label: "Que funcione igual aunque cambien por completo los datos base" },
    ],
    correctAnswer: "m5q34_a",
    topic: "Auditoría",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Auditable significa que se puede revisar por terceros. Repasa el código de ética.",
  },
  {
    id: "m5q35",
    question:
      "La IA sugiere una decisión que afecta a muchas personas. ¿Qué principio exige revisarla?",
    options: [
      {
        id: "m5q35_a",
        label: "Responsabilidad y transparencia con supervisión humana",
      },
      { id: "m5q35_b", label: "Eficiencia, para resolver el caso en el menor tiempo posible" },
      { id: "m5q35_c", label: "Escalabilidad, para que la IA decida el mayor volumen posible" },
      { id: "m5q35_d", label: "Automatización, para eliminar la intervención de las personas" },
    ],
    correctAnswer: "m5q35_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Decisiones con impacto requieren transparencia y supervisión humana. Repasa el video de principios.",
  },
  {
    id: "m5q36",
    question: "¿Cómo se mitiga un sesgo detectado en un modelo?",
    options: [
      {
        id: "m5q36_a",
        label: "Mejorando los datos y añadiendo pruebas y monitoreo continuo",
      },
      { id: "m5q36_b", label: "Ignorándolo, porque los sesgos suelen corregirse solos" },
      { id: "m5q36_c", label: "Ocultando los resultados negativos del sistema nuevo" },
      { id: "m5q36_d", label: "Aumentando la velocidad del modelo para que no se note" },
    ],
    correctAnswer: "m5q36_a",
    topic: "Mitigación de Sesgos",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "La mitigación combina mejores datos, pruebas y monitoreo. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m5q37",
    question: "¿Qué caracteriza a los sistemas de IA de riesgo limitado (UE)?",
    options: [
      {
        id: "m5q37_a",
        label: "Obligaciones de transparencia, sin ser de alto riesgo",
      },
      { id: "m5q37_b", label: "Prohibición total de su uso en cualquier contexto posible" },
      { id: "m5q37_c", label: "Exigencia de licencia especial para poder desarrollarlos" },
      { id: "m5q37_d", label: "Prohibición de publicar que se está usando IA en ellos" },
    ],
    correctAnswer: "m5q37_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "El riesgo limitado exige transparencia, no prohibición. Repasa el código de ética.",
  },
  {
    id: "m5q38",
    question:
      "Vas a desplegar un sistema de IA en el trabajo. ¿Qué práctica de gobernanza ayuda más?",
    options: [
      {
        id: "m5q38_a",
        label: "Definir responsables, métricas de equidad y un plan de monitoreo",
      },
      { id: "m5q38_b", label: "Publicarlo sin responsables ni métricas de seguimiento" },
      { id: "m5q38_c", label: "Medir solo cuánto dinero ahorra el sistema cada mes" },
      { id: "m5q38_d", label: "Evitar registrar cualquier incidente que ocurra después" },
    ],
    correctAnswer: "m5q38_a",
    topic: "Gobernanza",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Responsables, métricas y monitoreo son la base de la gobernanza. Repasa el código de ética.",
  },
  {
    id: "m5q39",
    question:
      "Un empleado usa IA para decidir sobre personas sin dejar rastro. ¿Qué se incumple?",
    options: [
      {
        id: "m5q39_a",
        label: "La trazabilidad y la rendición de cuentas de las decisiones",
      },
      { id: "m5q39_b", label: "La velocidad del proceso para resolver el caso puntual" },
      { id: "m5q39_c", label: "La popularidad del sistema entre los usuarios internos" },
      { id: "m5q39_d", label: "El costo operativo de mantener esa herramienta activa" },
    ],
    correctAnswer: "m5q39_a",
    topic: "Responsabilidad",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Sin trazabilidad no hay rendición de cuentas posible. Repasa el laboratorio de dilemas éticos.",
  },
  {
    id: "m5q40",
    question:
      "Caso: IA que decide sobre créditos debe ser justa, explicable y regulada. ¿Qué plan es el más completo?",
    options: [
      {
        id: "m5q40_a",
        label: "Auditar sesgos, explicar decisiones, supervisar humanos y cumplir la norma",
      },
      { id: "m5q40_b", label: "Automatizar todo para eliminar cualquier intervención humana" },
      { id: "m5q40_c", label: "Ocultar los criterios para evitar preguntas de los solicitantes" },
      { id: "m5q40_d", label: "Optimizar solo la velocidad de aprobación de cada solicitud" },
    ],
    correctAnswer: "m5q40_a",
    topic: "Gobernanza",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "El plan completo combina auditoría, explicabilidad, supervisión y cumplimiento normativo.",
  },
];
