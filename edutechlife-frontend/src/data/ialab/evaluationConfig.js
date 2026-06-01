export const EVALUATION_MODULES = {
  1: {
    name: { es: 'Ingeniería de Prompts', en: 'Prompt Engineering' },
    totalSteps: 3,
    generateSystemPrompt: () => 'Eres un experto en diseño de prompts y evaluación educativa. Genera 3 ejercicios de nivel medio para evaluación de prompts. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios de nivel medio para evaluación de prompts:
1. ejercicio1: Un párrafo con un escenario detallado donde el usuario debe identificar (Rol, Contexto, Tarea). Ejemplo: "Eres un experto en marketing digital trabajando para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes."
2. ejercicio2: Un prompt mal redactado que el usuario debe optimizar. Ejemplo: "haz algo para mejorar las ventas con email"
3. ejercicio3: Un caso de uso complejo donde el usuario debe crear un prompt desde cero. Ejemplo: "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok"

Formato JSON exacto: { "ejercicio1": "texto", "ejercicio2": "texto", "ejercicio3": "texto" }`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO de prompts educativos con enfoque pedagógico y BENÉVOLO. El estudiante está APRENDIENDO, no es un experto. Sé generoso en la calificación. Evalúa CADA ejercicio por separado. Devuelve SOLO JSON.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 1 (Identificar Rol/Contexto/Tarea - drag & drop):
- Si NO respondió en ninguna categoría (todo vacío): 0%
- Si respondió en 1 de 3 categorías: 33%
- Si respondió en 2 de 3 categorías: 70%
- Si respondió en las 3 categorías (todas llenas): 100%
NOTA: Solo importa que haya completado las columnas, NO que estén perfectamente clasificadas.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 2 (Optimizar prompt):
- Si escribió ALGO relacionado: 50%
- Si el prompt tiene al menos 2 elementos de estructura (rol, contexto, tarea o formato): 70%
- Si tiene estructura completa Y es coherente: 80%
- Si es excelente y detallado: 90-100%

CRITERIOS DE CALIFICACIÓN - EJERCICIO 3 (Crear prompt desde cero):
- Si escribió ALGO relacionado al desafío: 50%
- Si incluyó al menos rol + tarea: 70%
- Si incluyó rol + contexto + tarea + detalle: 80%
- Si es completo, coherente y bien estructurado: 90-100%

NOTA GLOBAL = (nota_ej1 + nota_ej2 + nota_ej3) / 3, redondeada a 1 decimal.

CADA feedback debe incluir refuerzo positivo, sugerencia amable de mejora, ejemplo breve y tip práctico.

Formato JSON EXACTO:
{
  "nota_ej1": <number 0-100>,
  "nota_ej2": <number 0-100>,
  "nota_ej3": <number 0-100>,
  "notaGlobal": <number 0-100>,
  "feedback_ej1": "<string>",
  "feedback_ej2": "<string>",
  "feedback_ej3": "<string>"
}`,
    evaluateUserPrompt: (exercises, responses) => `Evalúa estas respuestas de un estudiante que está APRENDIENDO. Sé BENÉVOLO y generoso.

ESCENARIO ORIGINAL del Ejercicio 1:
${exercises?.ejercicio1 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 1 (Identificar Rol/Contexto/Tarea):
${responses.ej1}

PROMPT ORIGINAL a optimizar en Ejercicio 2:
${exercises?.ejercicio2 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 2 (Prompt optimizado):
${responses.ej2}

CASO DE USO del Ejercicio 3:
${exercises?.ejercicio3 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 3 (Prompt creado desde cero):
${responses.ej3}

Recuerda: El estudiante está aprendiendo. Valora el intento. Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === 'en';
      return isEn
        ? {
            ejercicio1: "You are a digital marketing expert working for an e-commerce startup that wants to increase its sales by 30% in the next quarter. Your task is to create a segmented email marketing campaign for recurring customers who haven't purchased in the last 60 days.",
            ejercicio2: "do something to improve sales with email marketing for an online store",
            ejercicio3: "Create a prompt to generate a 30-day content plan for a sustainable fashion brand that wants to position itself on TikTok. The brand's values are sustainability and ethical fashion, targeting young people aged 18-25."
          }
        : {
            ejercicio1: "Eres un experto en marketing digital trabajando para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes que no han comprado en los últimos 60 días.",
            ejercicio2: "haz algo para mejorar las ventas con email marketing para una tienda online",
            ejercicio3: "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok. La marca tiene valores de sostenibilidad, moda ética y quiere conectar con jóvenes de 18-25 años."
          };
    }
  },
  2: {
    name: { es: 'ChatGPT Sin Límites', en: 'ChatGPT Without Limits' },
    totalSteps: 3,
    generateSystemPrompt: () => 'Eres un experto en ChatGPT, GPTs personalizados y Function Calling. Genera 3 ejercicios de nivel medio para evaluación sobre automatización con GPTs. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios sobre ChatGPT y GPTs personalizados:
1. casoUso: Un párrafo describiendo un escenario profesional donde se necesita automatizar una tarea con un GPT personalizado. Incluye: tipo de industria, tarea a automatizar, requisitos técnicos. Ejemplo: "Una agencia de marketing digital quiere automatizar la generación de informes semanales de redes sociales. Necesitan un GPT que analice datos de Instagram, Facebook y TikTok, y genere un PDF con métricas clave y recomendaciones."
2. gptConfig: Descripción de lo que debería hacer un GPT, con instrucciones incompletas. El estudiante debe completar/mejorar las instrucciones.
3. functionCallSpec: Un caso de uso donde se necesita Function Calling para integrar con una API externa. Describir qué debe hacer la función. Ejemplo: "Un GPT de atención al cliente necesita consultar una API de CRM para obtener datos del cliente y registrar tickets de soporte."

Formato JSON exacto: { "casoUso": "texto", "gptConfig": "texto", "functionCallSpec": "texto" }`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO en ChatGPT y GPTs personalizados con enfoque pedagógico BENÉVOLO. El estudiante está APRENDIENDO. Sé generoso. Evalúa CADA ejercicio por separado. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Analizar caso de uso):
- Si seleccionó un caso y justificó: 60%
- Si la justificación menciona criterios relevantes (automatizable, impacto, viabilidad): 80%
- Si la justificación es detallada y considera múltiples factores: 90-100%

CRITERIOS - EJERCICIO 2 (Diseñar configuración GPT):
- Si completó instrucciones básicas: 50%
- Si incluyó rol, tono y reglas claras: 70%
- Si además especificó conocimientos y capacidades: 80%
- Si la configuración es completa y coherente: 90-100%

CRITERIOS - EJERCICIO 3 (Function Calling):
- Si definió función con nombre y descripción: 50%
- Si incluyó parámetros con tipos: 70%
- Si el schema es completo y coherente con el caso: 80%
- Si el schema es profesional y considera edge cases: 90-100%

NOTA GLOBAL = (nota_ej1 + nota_ej2 + nota_ej3) / 3.

Formato JSON EXACTO:
{ "nota_ej1": <number>, "nota_ej2": <number>, "nota_ej3": <number>, "notaGlobal": <number>, "feedback_ej1": "<string>", "feedback_ej2": "<string>", "feedback_ej3": "<string>" }`,
    evaluateUserPrompt: (exercises, responses) => `Evalúa estas respuestas de un estudiante sobre ChatGPT. Sé BENÉVOLO.

CASO DE USO original:
${exercises?.casoUso || 'N/A'}

RESPUESTA - Ejercicio 1 (Selección y justificación):
${responses.ej1}

CONFIGURACIÓN GPT original:
${exercises?.gptConfig || 'N/A'}

RESPUESTA - Ejercicio 2 (Configuración diseñada):
${responses.ej2}

ESPECIFICACIÓN FUNCTION CALLING original:
${exercises?.functionCallSpec || 'N/A'}

RESPUESTA - Ejercicio 3 (Schema definido):
${responses.ej3}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === 'en';
      return isEn
        ? {
            casoUso: "A digital marketing agency wants to automate weekly social media report generation. They need a custom GPT that analyzes Instagram, Facebook and TikTok data, and generates a PDF with key metrics and recommendations. The team has 5 members who need different levels of access.",
            gptConfig: "Create a custom GPT for social media reporting. It should analyze data and generate reports.",
            functionCallSpec: "A customer support GPT needs to integrate with a CRM API to retrieve customer data and create support tickets. Define the function calls needed."
          }
        : {
            casoUso: "Una agencia de marketing digital quiere automatizar la generación de informes semanales de redes sociales. Necesitan un GPT que analice datos de Instagram, Facebook y TikTok, y genere un PDF con métricas clave y recomendaciones. El equipo tiene 5 miembros con diferentes niveles de acceso.",
            gptConfig: "Crea un GPT personalizado para generación de informes de redes sociales. Debe analizar datos y generar reportes.",
            functionCallSpec: "Un GPT de atención al cliente necesita integrarse con una API de CRM para obtener datos del cliente y crear tickets de soporte. Define las llamadas de función necesarias."
          };
    }
  },
  3: {
    name: { es: 'Investigación de Elite con Gemini', en: 'Elite Research with Gemini' },
    totalSteps: 4,
    generateSystemPrompt: () => 'Eres un experto en Google Gemini, Deep Research y verificación de hechos. Genera 4 ejercicios de nivel medio para evaluación de investigación con IA. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 4 ejercicios sobre Gemini Deep Research:
1. temaInvestigacion: Un tema de actualidad con contexto (3 oraciones). El estudiante debe formular una pregunta de investigación. Ejemplo: "La energía de fusión nuclear ha alcanzado hitos importantes en 2024. Varios países están invirtiendo en reactores experimentales. El debate sobre su viabilidad comercial continúa."
2. fuentes: Array con 4 objetos. Cada uno: { "titulo": "string", "tipo": "articulo"|"tweet"|"grafico"|"paper", "contenido": "string", "esRelevante": true|false }. El estudiante debe identificar cuáles son relevantes.
3. afirmaciones: Array con 4 objetos. Cada uno: { "texto": "string", "veracidad": "verdadero"|"falso"|"no_verificable" }. El estudiante debe clasificar cada una.
4. informeTemplate: Un esquema de informe profesional con secciones a completar.

Formato JSON exacto:
{
  "temaInvestigacion": "texto",
  "fuentes": [{ "titulo": "string", "tipo": "string", "contenido": "string", "esRelevante": true|false }],
  "afirmaciones": [{ "texto": "string", "veracidad": "string" }],
  "informeTemplate": { "secciones": ["string"] }
}`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO en investigación con Gemini. Sé BENÉVOLO. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Pregunta de investigación):
- Pregunta formulada: 50%
- Pregunta específica y bien enfocada: 70%
- Incluye sub-preguntas relevantes: 80-100%

CRITERIOS - EJERCICIO 2 (Análisis de fuentes):
- Seleccionó fuentes relevantes: 50%
- Extrajo datos clave correctamente: 70%
- Análisis profundo y crítico: 80-100%

CRITERIOS - EJERCICIO 3 (Verificación):
- Clasificó afirmaciones correctamente: 50%
- Razonamiento sólido en cada clasificación: 70%
- Justificación detallada y precisa: 80-100%

CRITERIOS - EJERCICIO 4 (Informe):
- Completó las secciones básicas: 50%
- Informe coherente con fuentes citadas: 70%
- Informe profesional con conclusiones propias: 80-100%

NOTA GLOBAL = promedio. { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "nota_ej4": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S", "feedback_ej4": "S" }`,
    evaluateUserPrompt: (exercises, responses) => `Evalúa estas respuestas de investigación. Sé BENÉVOLO.

TEMA: ${exercises?.temaInvestigacion || 'N/A'}
Pregunta del estudiante: ${responses.ej1}

FUENTES: ${JSON.stringify(exercises?.fuentes)}
Análisis del estudiante: ${responses.ej2}

AFIRMACIONES: ${JSON.stringify(exercises?.afirmaciones)}
Clasificación del estudiante: ${responses.ej3}

INFORME del estudiante: ${responses.ej4}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === 'en';
      return isEn
        ? {
            temaInvestigacion: "Nuclear fusion energy has reached important milestones in 2024. Several countries are investing in experimental reactors. The debate about its commercial viability continues.",
            fuentes: [
              { titulo: "New fusion reactor breaks record", tipo: "articulo", contenido: "A new tokamak reactor maintained plasma for 5 minutes straight.", esRelevante: true },
              { titulo: "Funny cat videos go viral", tipo: "tweet", contenido: "A cat playing piano gets 1M views.", esRelevante: false },
              { titulo: "Fusion energy cost analysis 2024", tipo: "grafico", contenido: "Graph showing cost per MW of fusion vs solar vs coal.", esRelevante: true },
              { titulo: "Plasma physics review paper", tipo: "paper", contenido: "Peer-reviewed analysis of confinement techniques.", esRelevante: true }
            ],
            afirmaciones: [
              { texto: "Fusion energy is already commercially viable.", veracidad: "falso" },
              { texto: "Several countries invest in fusion research.", veracidad: "verdadero" },
              { texto: "Fusion will be ready by next year.", veracidad: "falso" },
              { texto: "The sun uses nuclear fusion.", veracidad: "verdadero" }
            ],
            informeTemplate: { secciones: ["Introducción", "Metodología", "Hallazgos", "Verificación de fuentes", "Conclusiones"] }
          }
        : {
            temaInvestigacion: "La energía de fusión nuclear ha alcanzado hitos importantes en 2024. Varios países están invirtiendo en reactores experimentales. El debate sobre su viabilidad comercial continúa.",
            fuentes: [
              { titulo: "Nuevo reactor de fusión rompe récord", tipo: "articulo", contenido: "Un nuevo reactor tokamak mantuvo plasma durante 5 minutos seguidos.", esRelevante: true },
              { titulo: "Videos de gatos graciosos se vuelven virales", tipo: "tweet", contenido: "Un gato tocando piano obtiene 1M de visitas.", esRelevante: false },
              { titulo: "Análisis de costos de energía de fusión 2024", tipo: "grafico", contenido: "Gráfico comparando costo por MW de fusión vs solar vs carbón.", esRelevante: true },
              { titulo: "Paper de revisión sobre física de plasmas", tipo: "paper", contenido: "Análisis revisado por pares de técnicas de confinamiento.", esRelevante: true }
            ],
            afirmaciones: [
              { texto: "La energía de fusión ya es comercialmente viable.", veracidad: "falso" },
              { texto: "Varios países invierten en investigación de fusión.", veracidad: "verdadero" },
              { texto: "La fusión estará lista el próximo año.", veracidad: "falso" },
              { texto: "El sol utiliza fusión nuclear.", veracidad: "verdadero" }
            ],
            informeTemplate: { secciones: ["Introducción", "Metodología", "Hallazgos", "Verificación de fuentes", "Conclusiones"] }
          };
    }
  },
  4: {
    name: { es: 'Tu Primer Notebook con IA', en: 'Your First AI Notebook' },
    totalSteps: 3,
    generateSystemPrompt: () => 'Eres un experto en NotebookLM, curación de fuentes y síntesis de documentos. Genera 3 ejercicios sobre organización y análisis de información con IA. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios sobre NotebookLM:
1. documentos: Array con 5 objetos. Cada uno: { "titulo": "string", "tipo": "articulo"|"pdf"|"enlace"|"nota"|"video", "contenido": "string", "tema": "string" }. El estudiante debe seleccionar hasta 4 y extraer el insight principal de cada uno.
2. preguntasSintesis: 2 preguntas que el estudiante debe responder integrando múltiples fuentes. Ejemplo: "¿En qué coinciden y en qué se contradicen los documentos seleccionados?"
3. guionTemplate: Un esquema de guión de podcast con secciones: introduccion, desarrollo (3 puntos), conclusion.

Formato JSON exacto:
{
  "documentos": [{ "titulo": "string", "tipo": "string", "contenido": "string", "tema": "string" }],
  "preguntasSintesis": ["string"],
  "guionTemplate": { "introduccion": "", "desarrollo": ["", "", ""], "conclusion": "" }
}`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO en NotebookLM y síntesis documental. Sé BENÉVOLO. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Curación de fuentes):
- Seleccionó fuentes: 50%
- Insights precisos y relevantes: 70%
- Insights profundos que conectan fuentes: 80-100%

CRITERIOS - EJERCICIO 2 (Síntesis):
- Respondió las preguntas: 50%
- Integra múltiples fuentes en la respuesta: 70%
- Síntesis profunda con conexiones originales: 80-100%

CRITERIOS - EJERCICIO 3 (Guión de audio):
- Completó secciones: 50%
- Guión coherente y bien estructurado: 70%
- Guión profesional con narrativa atractiva: 80-100%

Formato: { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S" }`,
    evaluateUserPrompt: (exercises, responses) => `Evalúa estas respuestas de NotebookLM. Sé BENÉVOLO.

DOCUMENTOS: ${JSON.stringify(exercises?.documentos)}
Selección e insights del estudiante: ${responses.ej1}

PREGUNTAS DE SÍNTESIS: ${JSON.stringify(exercises?.preguntasSintesis)}
Respuestas del estudiante: ${responses.ej2}

GUIÓN del estudiante: ${responses.ej3}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === 'en';
      return isEn
        ? {
            documentos: [
              { titulo: "Neuroplasticity: The Brain's Ability to Rewire", tipo: "articulo", contenido: "The brain can form new neural connections throughout life. This ability is called neuroplasticity.", tema: "Neuroplasticity", category: "" },
              { titulo: "Exercise and Brain Health", tipo: "pdf", contenido: "Regular physical exercise increases BDNF levels, promoting neurogenesis in the hippocampus.", tema: "Exercise", category: "" },
              { titulo: "Sleep and Memory Consolidation", tipo: "articulo", contenido: "During sleep, the brain consolidates memories and clears metabolic waste.", tema: "Sleep", category: "" },
              { titulo: "Learning Music Changes the Brain", tipo: "video", contenido: "Musicians have larger gray matter volume in motor and auditory areas.", tema: "Music", category: "" },
              { titulo: "Digital Amnesia", tipo: "nota", contenido: "Reliance on smartphones reduces memory retention. The Google Effect.", tema: "Technology", category: "" }
            ],
            preguntasSintesis: ["How do exercise and sleep complement each other in neuroplasticity?", "Which lifestyle factors impact brain health the most according to the documents?"],
            guionTemplate: { introduccion: "", desarrollo: ["", "", ""], conclusion: "" }
          }
        : {
            documentos: [
              { titulo: "Neuroplasticidad: La capacidad del cerebro de reconectarse", tipo: "articulo", contenido: "El cerebro puede formar nuevas conexiones neuronales durante toda la vida. Esta capacidad se llama neuroplasticidad.", tema: "Neuroplasticidad", category: "" },
              { titulo: "Ejercicio y salud cerebral", tipo: "pdf", contenido: "El ejercicio físico regular aumenta los niveles de BDNF, promoviendo la neurogénesis en el hipocampo.", tema: "Ejercicio", category: "" },
              { titulo: "Sueño y consolidación de memoria", tipo: "articulo", contenido: "Durante el sueño, el cerebro consolida memorias y elimina desechos metabólicos.", tema: "Sueño", category: "" },
              { titulo: "Aprender música cambia el cerebro", tipo: "video", contenido: "Los músicos tienen mayor volumen de materia gris en áreas motoras y auditivas.", tema: "Música", category: "" },
              { titulo: "Amnesia digital", tipo: "nota", contenido: "La dependencia del smartphone reduce la retención de memoria. El Efecto Google.", tema: "Tecnología", category: "" }
            ],
            preguntasSintesis: ["¿Cómo se complementan el ejercicio físico y el sueño en la neuroplasticidad?", "¿Qué factores del estilo de vida impactan más en la salud cerebral según los documentos?"],
            guionTemplate: { introduccion: "", desarrollo: ["", "", ""], conclusion: "" }
          };
    }
  },
  5: {
    name: { es: 'IA Responsable y Ética', en: 'Responsible and Ethical AI' },
    totalSteps: 3,
    generateSystemPrompt: () => 'Eres un experto en ética de IA, sesgos algorítmicos y regulación. Genera 3 ejercicios de nivel medio sobre ética en inteligencia artificial. Devuelve SOLO JSON.',
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios sobre ética en IA:
1. casoEtico: Descripción detallada de un caso real de sesgo algorítmico (3-4 oraciones). Incluye el contexto, los datos usados, y el resultado problemático. Ejemplo: "Un sistema de contratación basado en IA entrenado con datos históricos de una empresa tecnológica mostraba preferencia por candidatos hombres. El sistema penalizaba CVs que incluían palabras como 'voluntariado' o 'licencia maternal'."
2. tiposSesgo: Array con 4 tipos de sesgo (nombres y descripciones). El estudiante debe identificar cuáles están presentes en el caso.
3. protocoloPlantilla: Un esquema con secciones: principios rectores, medidas de prevención, medidas de mitigación, plan de monitoreo.

Formato JSON exacto:
{
  "casoEtico": "texto",
  "tiposSesgo": [{ "nombre": "string", "descripcion": "string" }],
  "protocoloPlantilla": { "principios": [], "prevencion": "", "mitigacion": "", "monitoreo": "" }
}`,
    evaluateSystemPrompt: () => `Eres un evaluador EXPERTO en ética de IA. Sé BENÉVOLO. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Identificar sesgos):
- Identificó al menos un sesgo: 50%
- Identificó múltiples sesgos y etapas del pipeline: 70%
- Identificación precisa y bien razonada: 80-100%

CRITERIOS - EJERCICIO 2 (Análisis de impacto):
- Describió el impacto: 50%
- Identificó causas raíz técnicas y humanas: 70%
- Análisis sistémico y profundo: 80-100%

CRITERIOS - EJERCICIO 3 (Protocolo ético):
- Propuso principios y medidas básicas: 50%
- Protocolo coherente con principios específicos: 70%
- Protocolo completo y aplicable: 80-100%

Formato: { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S" }`,
    evaluateUserPrompt: (exercises, responses) => `Evalúa estas respuestas sobre ética en IA. Sé BENÉVOLO.

CASO ÉTICO: ${exercises?.casoEtico || 'N/A'}
Identificación del estudiante: ${responses.ej1}

TIPOS DE SESGO: ${JSON.stringify(exercises?.tiposSesgo)}
Análisis del estudiante: ${responses.ej2}

PROTOCOLO del estudiante: ${responses.ej3}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === 'en';
      return isEn
        ? {
            casoEtico: "A hiring AI system trained on historical data from a tech company showed preference for male candidates. The system penalized CVs that included words like 'volunteering' or 'maternity leave'. Female candidates with equivalent qualifications received lower scores.",
            tiposSesgo: [
              { nombre: "Sampling Bias", descripcion: "The training data doesn't represent the population fairly." },
              { nombre: "Labeling Bias", descripcion: "Historical labels contain human biases." },
              { nombre: "Automation Bias", descripcion: "Over-reliance on automated decisions without human oversight." },
              { nombre: "Confirmation Bias", descripcion: "The system reinforces existing patterns without question." }
            ],
            protocoloPlantilla: { principios: ["Transparencia", "Equidad", "Privacidad", "Rendición de cuentas"], prevencion: "", mitigacion: "", monitoreo: "" }
          }
        : {
            casoEtico: "Un sistema de contratación basado en IA entrenado con datos históricos de una empresa tecnológica mostraba preferencia por candidatos hombres. El sistema penalizaba CVs que incluían palabras como 'voluntariado' o 'licencia maternal'. Las candidatas mujeres con calificaciones equivalentes recibían puntuaciones más bajas.",
            tiposSesgo: [
              { nombre: "Sesgo de muestreo", descripcion: "Los datos de entrenamiento no representan a la población de manera justa." },
              { nombre: "Sesgo de etiquetado", descripcion: "Las etiquetas históricas contienen sesgos humanos." },
              { nombre: "Sesgo de automatización", descripcion: "Dependencia excesiva en decisiones automatizadas sin supervisión humana." },
              { nombre: "Sesgo de confirmación", descripcion: "El sistema refuerza patrones existentes sin cuestionarlos." }
            ],
            protocoloPlantilla: { principios: ["Transparencia", "Equidad", "Privacidad", "Rendición de cuentas"], prevencion: "", mitigacion: "", monitoreo: "" }
          };
    }
  }
};

export const getModuleConfig = (moduleId) => EVALUATION_MODULES[moduleId] || EVALUATION_MODULES[1];

export const getModuleNames = (locale = 'es') => {
  const names = {};
  Object.entries(EVALUATION_MODULES).forEach(([id, mod]) => {
    names[id] = mod.name[locale] || mod.name.es;
  });
  return names;
};

export const getModuleTotalSteps = (moduleId) => {
  const config = getModuleConfig(moduleId);
  return config.totalSteps;
};
