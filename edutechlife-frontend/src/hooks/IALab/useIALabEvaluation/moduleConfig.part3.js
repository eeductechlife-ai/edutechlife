export const MODULE_CONFIG_PART3 = {
  4: {
    name: { es: "Inmersión NotebookLM", en: "NotebookLM Immersion" },
    totalSteps: 3,
    generateSystemPrompt: () =>
      "Eres un experto en NotebookLM, curación de fuentes y síntesis de documentos. Genera 3 ejercicios sobre organización y análisis de información con IA. Devuelve SOLO JSON.",
    generateUserPrompt: () => `Genera un JSON con 3 ejercicios sobre NotebookLM:
1. conceptos: Array con 5 objetos. Cada uno: { "titulo": "string", "contenido": "string", "tema": "string" }. El estudiante debe seleccionar hasta 4 y extraer el insight principal de cada uno.
2. preguntasSintesis: 2 preguntas que el estudiante debe responder integrando múltiples fuentes. Una de ellas debe exigir VERIFICAR UNA CITA contra las fuentes (el estudiante debe decir si una afirmación dada proviene realmente de un concepto y cuál). Ejemplo: "¿En qué coinciden y en qué se contradicen los conceptos seleccionados? ¿La afirmación 'el ejercicio físico promueve la neurogénesis' proviene realmente de alguno de los conceptos? ¿De cuál?"
3. guionTemplate: Un esquema de guión de podcast con secciones: introduccion, desarrollo (3 puntos), conclusion.

Formato JSON exacto:
{
  "conceptos": [{ "titulo": "string", "contenido": "string", "tema": "string" }],
  "preguntasSintesis": ["string"],
  "guionTemplate": { "introduccion": "", "desarrollo": ["", "", ""], "conclusion": "" }
}

Cada ejercicio debe incluir la información suficiente (contexto, datos y restricciones) para que el estudiante pueda responder sin ambigüedad.`,
    evaluateSystemPrompt:
      () => `Eres un evaluador EXPERTO en NotebookLM y síntesis documental. Sé BENÉVOLO. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Análisis de conceptos):
- Seleccionó conceptos: 50%
- Insights precisos y relevantes: 70%
- Insights profundos que conectan conceptos: 80-100%

CRITERIOS - EJERCICIO 2 (Síntesis):
La herramienta guiada recoge una tabla (hallazgo/implicación/limitación por concepto) y un
párrafo de síntesis. NO se piden respuestas a preguntas ni verificación de citas explícita: no lo exijas.
- Completó la tabla y escribió una síntesis: 60%
- La síntesis integra varios conceptos (no solo los lista): 75-85%
- La síntesis es profunda, conecta ideas de distintas fuentes y es coherente: 90-100%
- Sé BENÉVOLO: si hay tabla + síntesis, no bajes de 70.

CRITERIOS - EJERCICIO 3 (Guión de audio):
- Completó secciones: 50%
- Guión coherente y bien estructurado: 70%
- Guión profesional con narrativa atractiva: 80-100%

Formato: { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S" }`,
    evaluateUserPrompt: (
      exercises,
      responses,
    ) => `Evalúa estas respuestas de NotebookLM. Sé BENÉVOLO.

CONCEPTOS: ${JSON.stringify(exercises?.conceptos)}
Selección e insights del estudiante: ${responses.ej1}

PREGUNTAS DE SÍNTESIS: ${JSON.stringify(exercises?.preguntasSintesis)}
Respuestas del estudiante: ${responses.ej2}

GUIÓN del estudiante: ${responses.ej3}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === "en";
      return isEn
        ? {
            conceptos: [
              {
                titulo: "Neuroplasticity: The Brain's Ability to Rewire",
                contenido:
                  "The brain can form new neural connections throughout life. This ability is called neuroplasticity.",
                tema: "Neuroplasticity",
              },
              {
                titulo: "Exercise and Brain Health",
                contenido:
                  "Regular physical exercise increases BDNF levels, promoting neurogenesis in the hippocampus.",
                tema: "Exercise",
              },
              {
                titulo: "Sleep and Memory Consolidation",
                contenido:
                  "During sleep, the brain consolidates memories and clears metabolic waste.",
                tema: "Sleep",
              },
              {
                titulo: "Learning Music Changes the Brain",
                contenido:
                  "Musicians have larger gray matter volume in motor and auditory areas.",
                tema: "Music",
              },
              {
                titulo: "Digital Amnesia",
                contenido:
                  "Reliance on smartphones reduces memory retention. The Google Effect.",
                tema: "Technology",
              },
            ],
            preguntasSintesis: [
              "How do exercise and sleep complement each other in neuroplasticity?",
              "Which lifestyle factors impact brain health the most according to the concepts?",
            ],
            guionTemplate: {
              introduccion: "",
              desarrollo: ["", "", ""],
              conclusion: "",
            },
          }
        : {
            conceptos: [
              {
                titulo:
                  "Neuroplasticidad: La capacidad del cerebro de reconectarse",
                contenido:
                  "El cerebro puede formar nuevas conexiones neuronales durante toda la vida. Esta capacidad se llama neuroplasticidad.",
                tema: "Neuroplasticidad",
              },
              {
                titulo: "Ejercicio y salud cerebral",
                contenido:
                  "El ejercicio físico regular aumenta los niveles de BDNF, promoviendo la neurogénesis en el hipocampo.",
                tema: "Ejercicio",
              },
              {
                titulo: "Sueño y consolidación de memoria",
                contenido:
                  "Durante el sueño, el cerebro consolida memorias y elimina desechos metabólicos.",
                tema: "Sueño",
              },
              {
                titulo: "Aprender música cambia el cerebro",
                contenido:
                  "Los músicos tienen mayor volumen de materia gris en áreas motoras y auditivas.",
                tema: "Música",
              },
              {
                titulo: "Amnesia digital",
                contenido:
                  "La dependencia del smartphone reduce la retención de memoria. El Efecto Google.",
                tema: "Tecnología",
              },
            ],
            preguntasSintesis: [
              "¿Cómo se complementan el ejercicio físico y el sueño en la neuroplasticidad?",
              "¿Qué factores del estilo de vida impactan más en la salud cerebral según los conceptos?",
            ],
            guionTemplate: {
              introduccion: "",
              desarrollo: ["", "", ""],
              conclusion: "",
            },
          };
    },
    localEvaluate: (responses) => {
      let docCount = 0;
      let synthesisFilled = 0;
      let scriptFilled = 0;
      let quizCorrect = 0;
      try {
        const ej1 = JSON.parse(responses.ej1 || "{}");
        docCount = ej1?.documents?.length || 0;
      } catch {}
      try {
        const ej2 = JSON.parse(responses.ej2 || "{}");
        synthesisFilled = ej2?.synthesis?.trim().length > 0 ? 1 : 0;
      } catch {}
      try {
        const ej3 = JSON.parse(responses.ej3 || "{}");
        const filled = ["hook", "evidencia", "transicion", "cierre"].filter(
          (k) => ej3[k]?.trim().length > 0,
        ).length;
        quizCorrect =
          (ej3?.quiz?.[0] === true ? 1 : 0) + (ej3?.quiz?.[1] === true ? 1 : 0);
        scriptFilled = filled + quizCorrect;
      } catch {}
      const n1 =
        docCount === 0 ? 30 : docCount < 3 ? 60 : docCount >= 4 ? 100 : 80;
      const n2 = synthesisFilled ? 90 : 50;
      const n3 =
        scriptFilled < 2
          ? 40
          : scriptFilled < 4
            ? 70
            : scriptFilled >= 6
              ? 100
              : 85;
      return {
        nota_ej1: n1,
        nota_ej2: n2,
        nota_ej3: n3,
        notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10,
        feedback_ej1:
          docCount === 0
            ? "No seleccionaste conceptos. Selecciona al menos 2 conceptos para empezar."
            : docCount < 4
              ? "Buena selección. Intenta seleccionar 4 conceptos para tener más perspectivas."
              : "Excelente selección de 4 conceptos con categorías y rankings.",
        feedback_ej2: synthesisFilled
          ? "Buena síntesis. Asegúrate de que tu tabla comparativa esté completa."
          : "Completa la tabla comparativa y escribe una síntesis que integre todos los conceptos.",
        feedback_ej3:
          scriptFilled < 4
            ? "Completa más secciones del guión y responde las preguntas del MCQ."
            : "Buen guión. Asegúrate de que todas las secciones estén bien desarrolladas.",
      };
    },
  },
};
