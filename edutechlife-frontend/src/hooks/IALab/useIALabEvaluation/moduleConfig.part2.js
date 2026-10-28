export const MODULE_CONFIG_PART2 = {
  3: {
    name: {
      es: "Investigación con fuentes en Gemini",
      en: "Elite Research with Gemini",
    },
    totalSteps: 4,
    generateSystemPrompt: () =>
      "Eres un experto en Google Gemini, Deep Research y verificación de hechos. Genera 4 ejercicios de nivel medio para evaluación de investigación con IA. Devuelve SOLO JSON.",
    generateUserPrompt: () => {
      // Sin esto el modelo repetía el ejemplo (fusión nuclear) en casi todos los
      // intentos: se fuerza un ámbito distinto cada vez.
      const dominios = [
        "salud pública",
        "educación",
        "cambio climático y energía",
        "economía y empleo",
        "ciberseguridad y privacidad",
        "agricultura y alimentación",
        "movilidad y ciudades",
        "inteligencia artificial y sociedad",
      ];
      const dominio = dominios[Math.floor(Math.random() * dominios.length)];
      return `Genera un JSON con 4 ejercicios sobre Gemini Deep Research:
1. temaInvestigacion: Un tema de actualidad sobre ${dominio} con contexto (3 oraciones). El estudiante debe formular una pregunta de investigación. NO uses la fusión nuclear ni copies este ejemplo; solo es una guía del formato: "La energía de fusión nuclear ha alcanzado hitos importantes en 2024. Varios países están invirtiendo en reactores experimentales. El debate sobre su viabilidad comercial continúa."
2. fuentes: Array con 4 objetos. Cada uno: { "titulo": "string", "tipo": "articulo"|"tweet"|"grafico"|"paper", "contenido": "string", "esRelevante": true|false, "modalidad": "texto"|"imagen"|"video"|"audio" }. El estudiante debe identificar cuáles son relevantes y justificar la MODALIDAD de la fuente (qué tipo de entrada es y para qué conviene).
3. afirmaciones: Array con 4 objetos. Cada uno: { "texto": "string", "veracidad": "verdadero"|"falso"|"no_verificable" }. El estudiante debe clasificar cada una y citar la fuente que respalda su veredicto (GROUNDING).
4. informeTemplate: Un esquema de informe profesional con secciones a completar.

Formato JSON exacto:
{
  "temaInvestigacion": "texto",
  "fuentes": [{ "titulo": "string", "tipo": "string", "contenido": "string", "esRelevante": true|false, "modalidad": "string" }],
  "afirmaciones": [{ "texto": "string", "veracidad": "string" }],
  "informeTemplate": { "secciones": ["string"] }
}

Cada ejercicio debe incluir la información suficiente (contexto, datos y restricciones) para que el estudiante pueda responder sin ambigüedad.`;
    },
    evaluateSystemPrompt:
      () => `Eres un evaluador EXPERTO en investigación con Gemini. Sé BENÉVOLO. Devuelve SOLO JSON.

CRITERIOS - EJERCICIO 1 (Pregunta de investigación):
- Pregunta formulada: 50%
- Pregunta específica y bien enfocada: 70%
- Incluye sub-preguntas relevantes: 80-100%

CRITERIOS - EJERCICIO 2 (Análisis de fuentes):
La herramienta guiada solo recoge, por cada fuente: si es relevante (sí/no) y los datos clave
extraídos (texto). NO exijas justificar "modalidad" ni tipos de entrada: no hay campo para eso.
- Identificó correctamente qué fuentes son relevantes: 60%
- Además extrajo datos clave concretos de las fuentes relevantes: 75-85%
- El análisis es completo, preciso y conecta los datos con la pregunta de investigación: 90-100%
- Sé BENÉVOLO: si marcó relevancia y escribió datos clave, no bajes de 75.

CRITERIOS - EJERCICIO 3 (Verificación):
- Clasificó afirmaciones correctamente: 50%
- Razonamiento sólido en cada clasificación: 70%
- CITA la fuente específica que respalda cada veredicto (grounding): 80%
- Justificación detallada, precisa y con cita a fuente: 90-100%

CRITERIOS - EJERCICIO 4 (Informe):
- Completó las secciones básicas: 50%
- Informe coherente con fuentes citadas: 70%
- Informe profesional con conclusiones propias: 80-100%

NOTA GLOBAL = promedio. { "nota_ej1": N, "nota_ej2": N, "nota_ej3": N, "nota_ej4": N, "notaGlobal": N, "feedback_ej1": "S", "feedback_ej2": "S", "feedback_ej3": "S", "feedback_ej4": "S" }`,
    evaluateUserPrompt: (
      exercises,
      responses,
    ) => `Evalúa estas respuestas de investigación. Sé BENÉVOLO.

TEMA: ${exercises?.temaInvestigacion || "N/A"}
Pregunta del estudiante: ${responses.ej1}

FUENTES: ${JSON.stringify(exercises?.fuentes)}
Análisis del estudiante (JSON { sources: [{ index, isRelevant, keyData }] }; no incluye modalidad):
${responses.ej2}

AFIRMACIONES: ${JSON.stringify(exercises?.afirmaciones)}
Clasificación del estudiante: ${responses.ej3}

INFORME del estudiante: ${responses.ej4}

Devuelve SOLO JSON válido.`,
    fallbackExercises: (locale) => {
      const isEn = locale === "en";
      return isEn
        ? {
            temaInvestigacion:
              "Nuclear fusion energy has reached important milestones in 2024. Several countries are investing in experimental reactors. The debate about its commercial viability continues.",
            fuentes: [
              {
                titulo: "New fusion reactor breaks record",
                tipo: "articulo",
                contenido:
                  "A new tokamak reactor maintained plasma for 5 minutes straight.",
                esRelevante: true,
              },
              {
                titulo: "Funny cat videos go viral",
                tipo: "tweet",
                contenido: "A cat playing piano gets 1M views.",
                esRelevante: false,
              },
              {
                titulo: "Fusion energy cost analysis 2024",
                tipo: "grafico",
                contenido:
                  "Graph showing cost per MW of fusion vs solar vs coal.",
                esRelevante: true,
              },
              {
                titulo: "Plasma physics review paper",
                tipo: "paper",
                contenido: "Peer-reviewed analysis of confinement techniques.",
                esRelevante: true,
              },
            ],
            afirmaciones: [
              {
                texto: "Fusion energy is already commercially viable.",
                veracidad: "falso",
              },
              {
                texto: "Several countries invest in fusion research.",
                veracidad: "verdadero",
              },
              {
                texto: "Fusion will be ready by next year.",
                veracidad: "falso",
              },
              { texto: "The sun uses nuclear fusion.", veracidad: "verdadero" },
            ],
            informeTemplate: {
              secciones: [
                "Introducción",
                "Metodología",
                "Hallazgos",
                "Verificación de fuentes",
                "Conclusiones",
              ],
            },
          }
        : {
            temaInvestigacion:
              "La energía de fusión nuclear ha alcanzado hitos importantes en 2024. Varios países están invirtiendo en reactores experimentales. El debate sobre su viabilidad comercial continúa.",
            fuentes: [
              {
                titulo: "Nuevo reactor de fusión rompe récord",
                tipo: "articulo",
                contenido:
                  "Un nuevo reactor tokamak mantuvo plasma durante 5 minutos seguidos.",
                esRelevante: true,
              },
              {
                titulo: "Videos de gatos graciosos se vuelven virales",
                tipo: "tweet",
                contenido: "Un gato tocando piano obtiene 1M de visitas.",
                esRelevante: false,
              },
              {
                titulo: "Análisis de costos de energía de fusión 2024",
                tipo: "grafico",
                contenido:
                  "Gráfico comparando costo por MW de fusión vs solar vs carbón.",
                esRelevante: true,
              },
              {
                titulo: "Paper de revisión sobre física de plasmas",
                tipo: "paper",
                contenido:
                  "Análisis revisado por pares de técnicas de confinamiento.",
                esRelevante: true,
              },
            ],
            afirmaciones: [
              {
                texto: "La energía de fusión ya es comercialmente viable.",
                veracidad: "falso",
              },
              {
                texto: "Varios países invierten en investigación de fusión.",
                veracidad: "verdadero",
              },
              {
                texto: "La fusión estará lista el próximo año.",
                veracidad: "falso",
              },
              {
                texto: "El sol utiliza fusión nuclear.",
                veracidad: "verdadero",
              },
            ],
            informeTemplate: {
              secciones: [
                "Introducción",
                "Metodología",
                "Hallazgos",
                "Verificación de fuentes",
                "Conclusiones",
              ],
            },
          };
    },
    localEvaluate: (responses) => {
      const [l1, l2, l3, l4] = [
        responses.ej1?.length || 0,
        responses.ej2?.length || 0,
        responses.ej3?.length || 0,
        responses.ej4?.length || 0,
      ];
      const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
      const n2 = l2 < 20 ? 40 : l2 < 80 ? 60 : l2 < 200 ? 80 : 90;
      const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
      const n4 = l4 < 50 ? 40 : l4 < 150 ? 60 : l4 < 400 ? 80 : 90;
      return {
        nota_ej1: n1,
        nota_ej2: n2,
        nota_ej3: n3,
        nota_ej4: n4,
        notaGlobal: Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10,
        feedback_ej1:
          "Buena pregunta de investigación. Para mejorarla, sé más específico y añade sub-preguntas.",
        feedback_ej2:
          "Buen análisis de fuentes. Asegúrate de justificar por qué cada fuente es o no relevante.",
        feedback_ej3:
          "Buena clasificación. Explica el razonamiento detrás de cada veredicto.",
        feedback_ej4:
          "Buen informe. Añade más detalles y citas específicas de las fuentes.",
      };
    },
  },
};
