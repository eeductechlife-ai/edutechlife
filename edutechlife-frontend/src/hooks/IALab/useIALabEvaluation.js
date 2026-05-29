import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClerkSupabaseClient } from '../../lib/supabase';

const MODULE_CONFIG = {
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
    },
    localEvaluate: (responses) => {
      const ej1Length = responses.ej1?.length || 0;
      const ej2Length = responses.ej2?.length || 0;
      const ej3Length = responses.ej3?.length || 0;

      let nota_ej1 = 0;
      let feedback_ej1 = '';
      try {
        const parsed = JSON.parse(responses.ej1);
        const hasRol = parsed.rol && parsed.rol.trim().length > 0;
        const hasContexto = parsed.contexto && parsed.contexto.trim().length > 0;
        const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
        const filledCount = (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);

        if (filledCount === 0) { nota_ej1 = 0; feedback_ej1 = 'No completaste ninguna categoría. Este ejercicio requiere identificar y arrastrar elementos a las 3 columnas: Rol, Contexto y Tarea.'; }
        else if (filledCount === 1) { nota_ej1 = 33; feedback_ej1 = 'Completaste 1 de 3 categorías. Buen inicio. Completa las otras 2 columnas.'; }
        else if (filledCount === 2) { nota_ej1 = 70; feedback_ej1 = 'Muy bien! Completaste 2 de 3 categorías. Revisa qué columna quedó vacía.'; }
        else { nota_ej1 = 100; feedback_ej1 = 'Excelente! Completaste las 3 categorías. Dominas la estructura Rol + Contexto + Tarea.'; }
      } catch { nota_ej1 = 0; feedback_ej1 = 'No se detectó tu respuesta. Asegúrate de arrastrar al menos un elemento a cada columna.'; }

      let nota_ej2 = 50;
      let feedback_ej2 = '';
      if (ej2Length < 20) { nota_ej2 = 50; feedback_ej2 = 'Respuesta corta. Intenta incluir Rol, Contexto, Tarea y Formato.'; }
      else if (ej2Length < 100) { nota_ej2 = 60; feedback_ej2 = 'Tu respuesta mejoró el prompt original. Organiza en secciones claras.'; }
      else if (ej2Length < 250) { nota_ej2 = 80; feedback_ej2 = 'Buen trabajo! Prompt optimizado con estructura y detalles.'; }
      else { nota_ej2 = 90; feedback_ej2 = 'Excelente prompt optimizado! Estructura completa y coherente.'; }

      let nota_ej3 = 50;
      let feedback_ej3 = '';
      if (ej3Length < 30) { nota_ej3 = 50; feedback_ej3 = 'Buen primer paso. Un prompt efectivo necesita Rol, Contexto, Tarea y Formato.'; }
      else if (ej3Length < 150) { nota_ej3 = 60; feedback_ej3 = 'Tu prompt aborda el tema. Incluye un Rol claro y Tarea específica.'; }
      else if (ej3Length < 350) { nota_ej3 = 80; feedback_ej3 = 'Buen prompt con estructura. Haz cada sección más específica al caso.'; }
      else { nota_ej3 = 90; feedback_ej3 = 'Prompt muy completo y coherente! Excelente entendimiento.'; }

      const notaGlobal = Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;
      return { nota_ej1, nota_ej2, nota_ej3, notaGlobal, feedback_ej1, feedback_ej2, feedback_ej3 };
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
    },
    localEvaluate: (responses) => {
      const l1 = responses.ej1?.length || 0;
      const l2 = responses.ej2?.length || 0;
      const l3 = responses.ej3?.length || 0;
      const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
      const n2 = l2 < 30 ? 40 : l2 < 100 ? 60 : l2 < 250 ? 80 : 90;
      const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
      return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10, feedback_ej1: 'Has analizado el caso. Para mejorar, considera criterios como impacto, viabilidad y automatización.', feedback_ej2: 'Tu configuración del GPT es un buen inicio. Añade instrucciones detalladas, tono y capacidades específicas.', feedback_ej3: 'Buen schema de Function Calling. Asegúrate de incluir todos los parámetros necesarios con tipos y descripciones.' };
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
    },
    localEvaluate: (responses) => {
      const [l1, l2, l3, l4] = [responses.ej1?.length || 0, responses.ej2?.length || 0, responses.ej3?.length || 0, responses.ej4?.length || 0];
      const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
      const n2 = l2 < 20 ? 40 : l2 < 80 ? 60 : l2 < 200 ? 80 : 90;
      const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
      const n4 = l4 < 50 ? 40 : l4 < 150 ? 60 : l4 < 400 ? 80 : 90;
      return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, nota_ej4: n4, notaGlobal: Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10, feedback_ej1: 'Buena pregunta de investigación. Para mejorarla, sé más específico y añade sub-preguntas.', feedback_ej2: 'Buen análisis de fuentes. Asegúrate de justificar por qué cada fuente es o no relevante.', feedback_ej3: 'Buena clasificación. Explica el razonamiento detrás de cada veredicto.', feedback_ej4: 'Buen informe. Añade más detalles y citas específicas de las fuentes.' };
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
    },
    localEvaluate: (responses) => {
      let docCount = 0;
      let synthesisFilled = 0;
      let scriptFilled = 0;
      let quizCorrect = 0;
      try {
        const ej1 = JSON.parse(responses.ej1 || '{}');
        docCount = ej1?.documents?.length || 0;
      } catch {}
      try {
        const ej2 = JSON.parse(responses.ej2 || '{}');
        synthesisFilled = ej2?.synthesis?.trim().length > 0 ? 1 : 0;
      } catch {}
      try {
        const ej3 = JSON.parse(responses.ej3 || '{}');
        const filled = ['hook', 'evidencia', 'transicion', 'cierre'].filter(k => ej3[k]?.trim().length > 0).length;
        quizCorrect = (ej3?.quiz?.[0] === true ? 1 : 0) + (ej3?.quiz?.[1] === true ? 1 : 0);
        scriptFilled = filled + quizCorrect;
      } catch {}
      const n1 = docCount === 0 ? 30 : docCount < 3 ? 60 : docCount >= 4 ? 100 : 80;
      const n2 = synthesisFilled ? 90 : 50;
      const n3 = scriptFilled < 2 ? 40 : scriptFilled < 4 ? 70 : scriptFilled >= 6 ? 100 : 85;
      return {
        nota_ej1: n1, nota_ej2: n2, nota_ej3: n3,
        notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10,
        feedback_ej1: docCount === 0 ? 'No seleccionaste documentos. Selecciona al menos 2 documentos para empezar.' : docCount < 4 ? 'Buena selección. Intenta seleccionar 4 documentos para tener más perspectivas.' : 'Excelente selección de 4 documentos con categorías y rankings.',
        feedback_ej2: synthesisFilled ? 'Buena síntesis. Asegúrate de que tu tabla comparativa esté completa.' : 'Completa la tabla comparativa y escribe una síntesis que integre todos los documentos.',
        feedback_ej3: scriptFilled < 4 ? 'Completa más secciones del guión y responde las preguntas del MCQ.' : 'Buen guión. Asegúrate de que todas las secciones estén bien desarrolladas.'
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
    },
    localEvaluate: (responses) => {
      let n1 = 0;
      let feedback_ej1 = '';
      try {
        const parsed = JSON.parse(responses.ej1 || '{}');
        const biases = parsed.biases || [];
        const biasCount = biases.length;
        const hasJustifications = biases.every((b) => b.justification?.trim().length > 20);
        const hasPipelines = biases.every((b) => b.pipeline);
        const hasSeverity = biases.some((b) => b.severity === 1) && biases.some((b) => b.severity === 2);

        if (biasCount === 0) { n1 = 0; feedback_ej1 = 'No se identificaron sesgos. Revisa el caso y busca patrones de discriminación o sesgo algorítmico.'; }
        else if (biasCount === 1) { n1 = hasJustifications ? 60 : 40; feedback_ej1 = 'Identificaste al menos un sesgo. Para mejorar, justifica con evidencia del caso y selecciona la etapa del pipeline.'; }
        else if (biasCount >= 2 && !hasSeverity) { n1 = hasJustifications && hasPipelines ? 75 : 60; feedback_ej1 = 'Buena identificación de sesgos. Completa la justificación, pipeline y ranking de severidad para cada uno.'; }
        else if (biasCount >= 2 && hasSeverity) { n1 = hasJustifications && hasPipelines ? 90 : 75; feedback_ej1 = 'Excelente análisis forense. Has identificado, justificado y priorizado los sesgos correctamente.'; }
        else { n1 = 85; feedback_ej1 = 'Buen trabajo identificando sesgos. Revisa si hay más sesgos en el caso.'; }
      } catch {
        n1 = 0;
        feedback_ej1 = 'No se pudo analizar tu respuesta. Asegúrate de completar el análisis forense.';
      }

      let n2 = 0;
      let feedback_ej2 = '';
      try {
        const parsed = JSON.parse(responses.ej2 || '{}');
        const impact = parsed.impact || {};
        const rootCauses = parsed.rootCauses || {};
        const severityMatrix = parsed.severityMatrix || {};

        const impactFields = ['candidates', 'company', 'society'].filter((k) => impact[k]?.trim().length > 20).length;
        const rootCauseCount = Object.values(rootCauses).filter((c) => c?.justification?.trim().length > 20).length;
        const matrixFilled = Object.keys(severityMatrix).length >= 6;

        if (impactFields === 0) { n2 = 0; feedback_ej2 = 'No se evaluó el impacto. Describe cómo el sesgo afecta a cada grupo.'; }
        else if (impactFields < 3 || rootCauseCount === 0) { n2 = 50; feedback_ej2 = 'Evalúa el impacto en los 3 grupos y al menos 2 causas raíz para un mejor análisis.'; }
        else if (rootCauseCount >= 2 && !matrixFilled) { n2 = 70; feedback_ej2 = 'Buen análisis de impacto y causas. Completa la matriz de severidad para un análisis más profundo.'; }
        else if (rootCauseCount >= 2 && matrixFilled) { n2 = 90; feedback_ej2 = 'Excelente evaluación de impacto con causas raíz identificadas y matriz de severidad completa.'; }
        else { n2 = 75; feedback_ej2 = 'Buen análisis. Revisa si hay más causas raíz que puedas identificar.'; }
      } catch {
        n2 = 0;
        feedback_ej2 = 'No se pudo analizar tu respuesta. Completa la evaluación de impacto.';
      }

      let n3 = 0;
      let feedback_ej3 = '';
      try {
        const parsed = JSON.parse(responses.ej3 || '{}');
        const principles = parsed.principles || [];
        const actions = parsed.actions || [];

        const hasPrinciples = principles.length > 0;
        const hasRelevance = principles.every((p) => p.relevance);
        const actionsWithMeasures = actions.filter((a) => a.measure?.trim().length > 20).length;
        const actionsWithTimeline = actions.filter((a) => a.timeline).length;

        if (!hasPrinciples && actionsWithMeasures === 0) { n3 = 0; feedback_ej3 = 'No se propusieron principios ni acciones. Diseña un protocolo ético completo.'; }
        else if (hasPrinciples && !hasRelevance) { n3 = 50; feedback_ej3 = 'Buenos principios. Indica por qué cada principio es relevante para este caso.'; }
        else if (hasRelevance && actionsWithMeasures > 0 && actionsWithTimeline < actionsWithMeasures) { n3 = 70; feedback_ej3 = 'Buen plan de remediación. Asigna un plazo a cada acción.'; }
        else if (hasRelevance && actionsWithMeasures > 0 && actionsWithTimeline >= actionsWithMeasures) { n3 = 90; feedback_ej3 = 'Excelente protocolo ético con principios sólidos, acciones concretas y plazos definidos.'; }
        else { n3 = 75; feedback_ej3 = 'Buen protocolo. Revisa si todas las acciones tienen medida y plazo.'; }
      } catch {
        n3 = 0;
        feedback_ej3 = 'No se pudo analizar tu respuesta. Completa el diseño del protocolo ético.';
      }

      const notaGlobal = Math.round(((n1 + n2 + n3) / 3) * 10) / 10;
      return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, notaGlobal, feedback_ej1, feedback_ej2, feedback_ej3 };
    }
  }
};

const useIALabEvaluation = (moduleId = 1, locale = 'es') => {
    const { user } = useAuth();
    const abortRef = useRef(null);
    const config = MODULE_CONFIG[moduleId] || MODULE_CONFIG[1];

    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    const [state, setState] = useState({
        step: 1,
        exercises: null,
        responses: { ej1: '', ej2: '', ej3: '', ej4: '' },
        evaluation: null,
        loading: false,
        error: null,
        fallbackMode: false
    });

    const generateExercises = useCallback(async (overridelocale) => {
        const activeLocale = overridelocale || locale;
        setState(prev => ({ ...prev, loading: true, error: null, fallbackMode: false }));

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    isJson: true,
                    messages: [{
                        role: 'system',
                        content: config.generateSystemPrompt(activeLocale)
                    }, {
                        role: 'user',
                        content: config.generateUserPrompt(activeLocale)
                    }],
                    temperature: 0.7,
                    max_tokens: 1000
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }

            const data = await response.json();
            const content = data.result;

            const jsonMatch = content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/)
                || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta');
            }

            const exercises = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            if (!exercises || typeof exercises !== 'object' || Object.keys(exercises).length === 0) {
                throw new Error('Estructura de ejercicios inválida');
            }

            setState(prev => ({
                ...prev,
                exercises,
                loading: false,
                step: 1
            }));

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Error generando ejercicios:', error);

            const fallbackExercises = config.fallbackExercises(activeLocale);
            setState(prev => ({
                ...prev,
                exercises: fallbackExercises,
                loading: false,
                step: 1,
                fallbackMode: true
            }));
        }
    }, [locale, config]);

    const evaluateAnswers = useCallback(async (responses) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    isJson: true,
                    messages: [{
                        role: 'system',
                        content: config.evaluateSystemPrompt()
                    }, {
                        role: 'user',
                        content: config.evaluateUserPrompt(state.exercises, responses)
                    }],
                    temperature: 0.3,
                    max_tokens: 2000
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }

            const data = await response.json();
            const content = data.result;

            const jsonMatch = content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/)
                || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la evaluación');
            }

            const evaluation = JSON.parse(jsonMatch[1] || jsonMatch[0]);

            const notas = ['nota_ej1', 'nota_ej2', 'nota_ej3', 'nota_ej4'];
            for (const key of notas) {
                if (typeof evaluation[key] !== 'number') evaluation[key] = 0;
            }
            if (typeof evaluation.notaGlobal !== 'number') {
                evaluation.notaGlobal = Math.round(
                    ((evaluation.nota_ej1 || 0) + (evaluation.nota_ej2 || 0) + (evaluation.nota_ej3 || 0) + (evaluation.nota_ej4 || 0)) / config.totalSteps * 10
                ) / 10;
            }

            setState(prev => ({
                ...prev,
                evaluation,
                loading: false
            }));

            return evaluation;

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Error evaluando respuestas:', error);

            const fallbackEvaluation = config.localEvaluate(responses);
            setState(prev => ({
                ...prev,
                evaluation: fallbackEvaluation,
                loading: false,
                fallbackMode: true
            }));

            return fallbackEvaluation;
        }
    }, [state.exercises, config]);

    const getAuthDb = useCallback(async () => {
        if (typeof window !== 'undefined' && window.Clerk?.session) {
            try {
                const token = await window.Clerk.session.getToken({ template: 'supabase' });
                if (token) return createClerkSupabaseClient(token);
            } catch (e) {}
        }
        return createClerkSupabaseClient();
    }, []);

    const saveGradeToSupabase = useCallback(async (evaluation, modId) => {
        const targetModuleId = modId || moduleId;
        if (!user?.id) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const numericModuleId = Number(targetModuleId) || 1;
            const db = await getAuthDb();
            const { data, error } = await db
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    module_id: numericModuleId,
                    activity_type: 'challenge',
                    resource_id: null,
                    score: Math.round(Number(evaluation.notaGlobal)),
                    completed_lessons: evaluation,
                    is_completed: true,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,module_id,activity_type,resource_id',
                    ignoreDuplicates: false,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error guardando nota en Supabase:', error);
            return { success: false, error: error.message };
        }
    }, [user, getAuthDb, moduleId]);

    const setStep = useCallback((step) => {
        setState(prev => ({ ...prev, step }));
    }, []);

    const setResponse = useCallback((exerciseKey, response) => {
        setState(prev => ({
            ...prev,
            responses: { ...prev.responses, [exerciseKey]: response }
        }));
    }, []);

    const resetEvaluation = useCallback(() => {
        setState({
            step: 1,
            exercises: null,
            responses: { ej1: '', ej2: '', ej3: '', ej4: '' },
            evaluation: null,
            loading: false,
            error: null
        });
    }, []);

    return {
        state,
        generateExercises,
        evaluateAnswers,
        saveGradeToSupabase,
        setStep,
        setResponse,
        resetEvaluation,
        config
    };
};

export default useIALabEvaluation;
export { MODULE_CONFIG };
