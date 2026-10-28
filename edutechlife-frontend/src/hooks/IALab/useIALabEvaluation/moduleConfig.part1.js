export const MODULE_CONFIG_PART1 = {
  1: {
    name: { es: "Ingeniería de Prompts", en: "Prompt Engineering" },
    totalSteps: 3,
    generateSystemPrompt: () =>
      "Eres un experto en diseño de prompts y evaluación educativa. Genera 3 ejercicios de nivel medio para evaluación de prompts. Devuelve SOLO JSON.",
    generateUserPrompt:
      () => `Genera un JSON con 3 ejercicios de nivel medio para evaluación de prompts:
1. ejercicio1: Un escenario de EXACTAMENTE tres oraciones cortas, cada una separada por un punto y con un único elemento: la primera dice el ROL (quién es), la segunda el CONTEXTO (dónde/situación) y la tercera la TAREA (qué debe hacer). No fundas dos elementos en una misma oración. Ejemplo: "Eres un experto en marketing digital. Trabajas para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes."
2. ejercicio2: Un prompt mal redactado que el usuario debe optimizar. Ejemplo: "haz algo para mejorar las ventas con email"
3. ejercicio3: Un caso de uso complejo donde el usuario debe crear un prompt desde cero, indicando EXPLÍCITAMENTE el FORMATO de salida esperado (estructura, longitud, tono). Ejemplo: "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok"

Formato JSON exacto: { "ejercicio1": "texto", "ejercicio2": "texto", "ejercicio3": "texto" }`,
    evaluateSystemPrompt:
      () => `Eres un evaluador EXPERTO de prompts educativos con enfoque pedagógico y BENÉVOLO. El estudiante está APRENDIENDO, no es un experto. Sé generoso en la calificación. Evalúa CADA ejercicio por separado. Devuelve SOLO JSON.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 1 (Identificar Rol/Contexto/Tarea - drag & drop):
- Si NO respondió en ninguna categoría (todo vacío): 0%
- Cada categoría completada suma 20% (máximo 60% por completar las 3)
- Cada categoría correctamente clasificada (la frase elegida cumple realmente ese rol: Rol = quién es, Contexto = situación, Tarea = qué debe hacer) suma 13% adicional (máximo 40%)
- Las 3 completas y correctas: 100%. Las 3 completas pero mal clasificadas: 60% como máximo.
NOTA: Evalúa que cada frase corresponda a su categoría; explica con amabilidad cuál estaba mal ubicada y por qué.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 2 (Optimizar prompt):
- Si escribió ALGO relacionado: 50%
- Si el prompt tiene al menos 2 elementos de estructura (rol, contexto, tarea o formato): 70%
- Si tiene estructura completa Y es coherente: 80%
- Si es excelente y detallado: 90-100%

CRITERIOS DE CALIFICACIÓN - EJERCICIO 3 (Crear prompt desde cero):
- Si escribió ALGO relacionado al desafío: 50%
- Si incluyó al menos rol + tarea: 70%
- Si incluyó rol + contexto + tarea + detalle: 80%
- Si incluyó además el FORMATO de salida esperado (estructura, longitud, tono): 90%
- Si es completo, coherente y bien estructurado: 95-100%

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
    evaluateUserPrompt: (
      exercises,
      responses,
    ) => `Evalúa estas respuestas de un estudiante que está APRENDIENDO. Sé BENÉVOLO y generoso.

ESCENARIO ORIGINAL del Ejercicio 1:
${exercises?.ejercicio1 || "N/A"}

RESPUESTA del estudiante - Ejercicio 1 (Identificar Rol/Contexto/Tarea):
${responses.ej1}

PROMPT ORIGINAL a optimizar en Ejercicio 2:
${exercises?.ejercicio2 || "N/A"}

RESPUESTA del estudiante - Ejercicio 2 (Prompt optimizado):
${responses.ej2}

CASO DE USO del Ejercicio 3:
${exercises?.ejercicio3 || "N/A"}

RESPUESTA del estudiante - Ejercicio 3 (Prompt creado desde cero):
${responses.ej3}

Recuerda: El estudiante está aprendiendo. Valora el intento. Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === "en";
      return isEn
        ? {
            ejercicio1:
              "You are a digital marketing expert. You work for an e-commerce startup that wants to increase its sales by 30% in the next quarter. Your task is to create a segmented email marketing campaign for recurring customers who haven't purchased in the last 60 days.",
            ejercicio2:
              "do something to improve sales with email marketing for an online store",
            ejercicio3:
              "Create a prompt to generate a 30-day content plan for a sustainable fashion brand that wants to position itself on TikTok. The brand's values are sustainability and ethical fashion, targeting young people aged 18-25.",
          }
        : {
            ejercicio1:
              "Eres un experto en marketing digital. Trabajas para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes que no han comprado en los últimos 60 días.",
            ejercicio2:
              "haz algo para mejorar las ventas con email marketing para una tienda online",
            ejercicio3:
              "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok. La marca tiene valores de sostenibilidad, moda ética y quiere conectar con jóvenes de 18-25 años.",
          };
    },
    localEvaluate: (responses) => {
      const ej1Length = responses.ej1?.length || 0;
      const ej2Length = responses.ej2?.length || 0;
      const ej3Length = responses.ej3?.length || 0;

      let nota_ej1 = 0;
      let feedback_ej1 = "";
      try {
        const parsed = JSON.parse(responses.ej1);
        const hasRol = parsed.rol && parsed.rol.trim().length > 0;
        const hasContexto =
          parsed.contexto && parsed.contexto.trim().length > 0;
        const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
        const filledCount =
          (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);

        if (filledCount === 0) {
          nota_ej1 = 0;
          feedback_ej1 =
            "No completaste ninguna categoría. Este ejercicio requiere identificar y arrastrar elementos a las 3 columnas: Rol, Contexto y Tarea.";
        } else if (filledCount === 1) {
          nota_ej1 = 33;
          feedback_ej1 =
            "Completaste 1 de 3 categorías. Buen inicio. Completa las otras 2 columnas.";
        } else if (filledCount === 2) {
          nota_ej1 = 70;
          feedback_ej1 =
            "Muy bien! Completaste 2 de 3 categorías. Revisa qué columna quedó vacía.";
        } else {
          nota_ej1 = 100;
          feedback_ej1 =
            "Excelente! Completaste las 3 categorías. Dominas la estructura Rol + Contexto + Tarea.";
        }
      } catch {
        nota_ej1 = 0;
        feedback_ej1 =
          "No se detectó tu respuesta. Asegúrate de arrastrar al menos un elemento a cada columna.";
      }

      let nota_ej2 = 50;
      let feedback_ej2 = "";
      if (ej2Length < 20) {
        nota_ej2 = 50;
        feedback_ej2 =
          "Respuesta corta. Intenta incluir Rol, Contexto, Tarea y Formato.";
      } else if (ej2Length < 100) {
        nota_ej2 = 60;
        feedback_ej2 =
          "Tu respuesta mejoró el prompt original. Organiza en secciones claras.";
      } else if (ej2Length < 250) {
        nota_ej2 = 80;
        feedback_ej2 =
          "Buen trabajo! Prompt optimizado con estructura y detalles.";
      } else {
        nota_ej2 = 90;
        feedback_ej2 =
          "Excelente prompt optimizado! Estructura completa y coherente.";
      }

      let nota_ej3 = 50;
      let feedback_ej3 = "";
      if (ej3Length < 30) {
        nota_ej3 = 50;
        feedback_ej3 =
          "Buen primer paso. Un prompt efectivo necesita Rol, Contexto, Tarea y Formato.";
      } else if (ej3Length < 150) {
        nota_ej3 = 60;
        feedback_ej3 =
          "Tu prompt aborda el tema. Incluye un Rol claro y Tarea específica.";
      } else if (ej3Length < 350) {
        nota_ej3 = 80;
        feedback_ej3 =
          "Buen prompt con estructura. Haz cada sección más específica al caso.";
      } else {
        nota_ej3 = 90;
        feedback_ej3 =
          "Prompt muy completo y coherente! Excelente entendimiento.";
      }

      const notaGlobal =
        Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;
      return {
        nota_ej1,
        nota_ej2,
        nota_ej3,
        notaGlobal,
        feedback_ej1,
        feedback_ej2,
        feedback_ej3,
      };
    },
  },
  2: {
    name: { es: "ChatGPT Sin Límites", en: "ChatGPT Without Limits" },
    totalSteps: 3,
    generateSystemPrompt: () =>
      "Eres un experto en ChatGPT, GPTs personalizados y Function Calling. Genera 3 ejercicios de nivel medio para evaluación sobre automatización con GPTs. Devuelve SOLO JSON.",
    generateUserPrompt:
      () => `Genera un JSON con 3 ejercicios sobre ChatGPT y GPTs personalizados:
1. casoUso: Un párrafo describiendo un escenario profesional donde se necesita automatizar una tarea con un GPT personalizado. Incluye: tipo de industria, tarea a automatizar, requisitos técnicos y un componente de ANÁLISIS PREDICTIVO (p. ej. prever demanda, churn o tendencia). Ejemplo: "Una agencia de marketing digital quiere automatizar la generación de informes semanales de redes sociales. Necesitan un GPT que analice datos de Instagram, Facebook y TikTok, genere un PDF con métricas clave y PREDIGA qué tipo de contenido tendrá mejor rendimiento la próxima semana según las tendencias históricas."
2. gptConfig: Descripción de lo que debería hacer un GPT, con instrucciones incompletas. El estudiante debe completar/mejorar las instrucciones.
3. functionCallSpec: Un caso de uso de Function Calling coherente con el escenario del ejercicio 1 (misma industria y tarea). Describir qué debe hacer la función. Ejemplo: "La agencia de marketing necesita que su GPT consulte una API de analítica social para obtener métricas de campaña y generar un informe semanal."

Formato JSON exacto: { "casoUso": "texto", "gptConfig": "texto", "functionCallSpec": "texto" }

Cada ejercicio debe incluir la información suficiente (contexto, datos y restricciones) para que el estudiante pueda responder sin ambigüedad.`,
    evaluateSystemPrompt:
      () => `Eres un evaluador EXPERTO en ChatGPT y GPTs personalizados con enfoque pedagógico BENÉVOLO. El estudiante está APRENDIENDO. Sé generoso. Evalúa CADA ejercicio por separado. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Analizar caso de uso):
- Si seleccionó un caso y justificó: 60%
- Si la justificación menciona criterios relevantes (automatizable, impacto, viabilidad): 80%
- Si la justificación considera además el componente de ANÁLISIS PREDICTIVO (datos históricos, tendencia, proyección): 85-90%
- Si la justificación es detallada y considera múltiples factores: 95-100%

CRITERIOS - EJERCICIO 2 (Diseñar configuración GPT):
- Si completó instrucciones básicas: 50%
- Si incluyó rol, tono y reglas claras: 70%
- Si además especificó conocimientos y capacidades: 80%
- Si la configuración es completa y coherente: 90-100%

CRITERIOS - EJERCICIO 3 (Function Calling con HERRAMIENTA GUIADA):
IMPORTANTE: el estudiante NO escribe el schema a mano. Usa una herramienta guiada y su
respuesta es un JSON con { "functionName", "selectedFields": [...], "returnValue" }.
La app genera por él los tipos, los "required" y la descripción del schema. Por eso NO debes
exigir JSON schema escrito, tipos explícitos ni "edge cases": eso no lo controla el estudiante.
Evalúa con BENEVOLENCIA solo lo que el estudiante sí decide:
- Nombró la función con un nombre claro y descriptivo: 60-70%
- Además seleccionó datos (selectedFields) coherentes con el caso: 75-85%
- Además describió con claridad qué debe devolver la función (returnValue): 85-95%
- La selección de datos es completa/suficiente para el caso y el retorno es claro y específico: 95-100%
- NUNCA bajes de 60 si completó nombre + al menos un dato + una idea de retorno.

NOTA GLOBAL = (nota_ej1 + nota_ej2 + nota_ej3) / 3.

Formato JSON EXACTO:
{ "nota_ej1": <number>, "nota_ej2": <number>, "nota_ej3": <number>, "notaGlobal": <number>, "feedback_ej1": "<string>", "feedback_ej2": "<string>", "feedback_ej3": "<string>" }`,
    evaluateUserPrompt: (
      exercises,
      responses,
    ) => `Evalúa estas respuestas de un estudiante sobre ChatGPT. Sé BENÉVOLO.

CASO DE USO original:
${exercises?.casoUso || "N/A"}

RESPUESTA - Ejercicio 1 (Selección y justificación):
${responses.ej1}

CONFIGURACIÓN GPT original:
${exercises?.gptConfig || "N/A"}

RESPUESTA - Ejercicio 2 (Configuración diseñada):
${responses.ej2}

ESPECIFICACIÓN FUNCTION CALLING original:
${exercises?.functionCallSpec || "N/A"}

RESPUESTA - Ejercicio 3 (Función configurada con la herramienta guiada; es un JSON con
{ functionName, selectedFields, returnValue }; NO es un schema escrito a mano, no penalices
la ausencia de tipos/required/edge cases):
${responses.ej3}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === "en";
      return isEn
        ? {
            casoUso:
              "A digital marketing agency wants to automate weekly social media report generation. They need a custom GPT that analyzes Instagram, Facebook and TikTok data, and generates a PDF with key metrics and recommendations. The team has 5 members who need different levels of access.",
            gptConfig:
              "Create a custom GPT for social media reporting. It should analyze data and generate reports.",
            functionCallSpec:
              "The marketing agency needs its GPT to call a social analytics API to retrieve campaign metrics and generate a weekly report. Define the function calls needed.",
          }
        : {
            casoUso:
              "Una agencia de marketing digital quiere automatizar la generación de informes semanales de redes sociales. Necesitan un GPT que analice datos de Instagram, Facebook y TikTok, y genere un PDF con métricas clave y recomendaciones. El equipo tiene 5 miembros con diferentes niveles de acceso.",
            gptConfig:
              "Crea un GPT personalizado para generación de informes de redes sociales. Debe analizar datos y generar reportes.",
            functionCallSpec:
              "La agencia de marketing necesita que su GPT se integre con una API de analítica social para obtener métricas de campaña y generar un informe semanal. Define las llamadas de función necesarias.",
          };
    },
    localEvaluate: (responses) => {
      const l1 = responses.ej1?.length || 0;
      const l2 = responses.ej2?.length || 0;
      const l3 = responses.ej3?.length || 0;
      const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
      const n2 = l2 < 30 ? 40 : l2 < 100 ? 60 : l2 < 250 ? 80 : 90;

      // El ejercicio 3 se responde con una herramienta guiada: un JSON con
      // { functionName, selectedFields, returnValue }. La app genera el schema
      // (tipos/required), así que puntuamos solo lo que el estudiante decide y
      // con benevolencia. Si no es JSON (texto libre/legado), usamos longitud.
      let n3;
      let ej3Parsed = null;
      try {
        ej3Parsed = responses.ej3 ? JSON.parse(responses.ej3) : null;
      } catch {
        ej3Parsed = null;
      }
      if (
        ej3Parsed &&
        typeof ej3Parsed === "object" &&
        !Array.isArray(ej3Parsed)
      ) {
        const nombre = String(ej3Parsed.functionName || "").trim();
        const campos = Array.isArray(ej3Parsed.selectedFields)
          ? ej3Parsed.selectedFields
          : [];
        const retorno = String(ej3Parsed.returnValue || "").trim();
        n3 = 40;
        if (nombre.length >= 3) n3 = 60;
        if (campos.length >= 1) n3 = Math.max(n3, 70);
        if (campos.length >= 2 && retorno.length >= 10) n3 = Math.max(n3, 80);
        if (campos.length >= 2 && retorno.length >= 25) n3 = Math.max(n3, 90);
        if (campos.length >= 3 && retorno.length >= 40) n3 = Math.max(n3, 100);
      } else {
        n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
      }

      return {
        nota_ej1: n1,
        nota_ej2: n2,
        nota_ej3: n3,
        notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10,
        feedback_ej1:
          "Has analizado el caso. Para mejorar, considera criterios como impacto, viabilidad y automatización.",
        feedback_ej2:
          "Tu configuración del GPT es un buen inicio. Añade instrucciones detalladas, tono y capacidades específicas.",
        feedback_ej3:
          "Buen diseño de la función. Revisa que el nombre sea descriptivo, que hayas elegido los datos que la función realmente necesita y que el retorno sea claro.",
      };
    },
  },
};
