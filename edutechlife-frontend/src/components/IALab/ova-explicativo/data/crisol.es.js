export default {
  badge: "Módulo 4 · Explicación",
  title: "El Crisol",
  subtitle:
    "Cómo fundir varias fuentes en una síntesis propia y evaluarla con mirada crítica",
  intro:
    "Un crisol funde metales distintos para obtener una aleación nueva. Sintetizar hace lo mismo con fuentes: une lo que dicen varios documentos en una conclusión propia, y luego la examina con criterio. Aquí aprenderás los términos para hacerlo bien.",
  objectives: [
    "Distinguir fuentes primarias y secundarias en una síntesis",
    "Construir una matriz de síntesis cruzada",
    "Explicar qué es una muestra representativa y un sesgo de confirmación",
    "Diferenciar correlación de causalidad",
  ],
  sections: [
    {
      title: "1. Síntesis cruzada",
      explain: [
        "Sintetizar es unir ideas de varias fuentes en una conclusión. La síntesis cruzada compara las fuentes entre sí: qué dicen igual, qué dicen distinto y qué no dice ninguna.",
        "Una tabla de dos ejes (fuentes en filas, ideas en columnas) hace visible el cruce y evita quedarse con una sola voz.",
      ],
      terms: [
        {
          term: "Síntesis",
          def: "Conclusión propia que une ideas de varias fuentes.",
        },
        {
          term: "Síntesis cruzada",
          def: "Comparación de varias fuentes para ver coincidencias, diferencias y vacíos.",
        },
        {
          term: "Matriz",
          def: "Tabla que cruza fuentes y temas para comparar sin perder detalle.",
        },
      ],
      how: [
        "Escribe las fuentes en filas y los temas en columnas.",
        "Marca en cada celda qué dice cada fuente sobre cada tema.",
        "Redacta la conclusión a partir de las coincidencias y de las diferencias.",
      ],
      example:
        "Tres informes sobre energía solar: dos coinciden en el costo inicial y uno lo omite. La síntesis dice «el costo inicial es alto según dos fuentes; la tercera no lo menciona».",
      mistake:
        "Escribir un resumen de cada fuente por separado y llamarlo síntesis. Sin cruce, no hay conclusión propia.",
    },
    {
      title: "2. Fuentes primarias y secundarias en la síntesis",
      explain: [
        "Al sintetizar, prefiere la fuente primaria: el documento original. Una secundaria puede simplificar o cambiar un dato sin que te des cuenta.",
        "Si solo tienes secundarias, indícalo en la síntesis y busca la primaria cuando sea posible.",
      ],
      terms: [
        {
          term: "Fuente primaria",
          def: "Documento original: estudio, norma, registro oficial.",
        },
        {
          term: "Fuente secundaria",
          def: "Texto que comenta, resume o interpreta una fuente primaria.",
        },
      ],
      how: [
        "Identifica qué fuente es primaria y cuál secundaria.",
        "Usa la primaria para los datos y la secundaria para el contexto.",
        "Deja clara la procedencia de cada dato en la síntesis.",
      ],
      example:
        "Un blog dice «el 40 % de los jóvenes usa IA». La encuesta original es la primaria; sin ella, el 40 % no se puede usar con seguridad.",
      mistake:
        "Citar la secundaria como si fuera la fuente de un dato que nunca revisó en el original.",
    },
    {
      title: "3. Muestra y sesgo de confirmación",
      explain: [
        "Una muestra es el grupo de personas o casos que se estudió. Es representativa si refleja bien a la población de la que se habla. Una muestra pequeña o elegida a conveniencia puede dar conclusiones falsas.",
        "El sesgo de confirmación es buscar y aceptar solo las fuentes que confirman lo que ya pensabas. Una síntesis honesta incluye también las fuentes que contradicen tu idea.",
      ],
      terms: [
        {
          term: "Muestra representativa",
          def: "Grupo estudiado que refleja bien a la población total.",
        },
        {
          term: "Sesgo de confirmación",
          def: "Tendencia a buscar y aceptar solo lo que confirma lo que ya creemos.",
        },
      ],
      how: [
        "Pregunta cuántas personas o casos se estudiaron y a quiénes.",
        "Busca fuentes que contradigan tu hipótesis.",
        "Escribe la síntesis incluyendo lo que no encaja.",
      ],
      example:
        "Una encuesta a 30 estudiantes de un solo colegio no permite afirmar algo sobre todos los jóvenes del país.",
      mistake:
        "Dar por válida una conclusión general a partir de una muestra pequeña o de un grupo muy específico.",
    },
    {
      title: "4. Correlación no es causalidad",
      explain: [
        "Correlación significa que dos cosas cambian juntas. Causalidad significa que una provoca a la otra. Que ocurran juntas no prueba que una cause la otra.",
        "Antes de afirmar una causa, busca otra explicación posible: una tercera variable o una simple coincidencia.",
      ],
      terms: [
        {
          term: "Correlación",
          def: "Relación en la que dos variables tienden a cambiar juntas.",
        },
        {
          term: "Causalidad",
          def: "Relación en la que una variable produce el cambio de otra.",
        },
      ],
      how: [
        "Identifica las dos variables que aparecen juntas.",
        "Pregunta si hay una tercera variable que explique ambas.",
        "Afirma una causa solo si la fuente la demuestra.",
      ],
      example:
        "Los países con más heladerías tienen más ahogamientos: la temperatura explica ambos. La correlación no indica que las heladerías causen ahogamientos.",
      mistake:
        "Afirmar que una cosa causa otra porque aparecen juntas en un gráfico.",
    },
  ],
  summary: [
    "Sintetizar es unir ideas de varias fuentes; la síntesis cruzada compara coincidencias, diferencias y vacíos.",
    "Usa la fuente primaria para los datos y reconoce cuando solo hay secundarias.",
    "Una muestra debe representar a la población; el sesgo de confirmación exige incluir lo que contradice.",
    "Correlación no es causalidad: busca otras explicaciones antes de afirmar una causa.",
    "Una buena síntesis es una conclusión propia, con su procedencia clara y sus límites.",
  ],
  check: [
    {
      q: "¿Qué hace la síntesis cruzada?",
      options: [
        "Copia el resumen de cada fuente por separado.",
        "Compara las fuentes para ver coincidencias, diferencias y vacíos.",
        "Elige la fuente más larga y la usa.",
      ],
      correct: 1,
      feedback:
        "La síntesis cruzada compara las fuentes entre sí; sin ese cruce no hay conclusión propia.",
    },
    {
      q: "Una encuesta a 30 estudiantes de un solo colegio. ¿Qué conclusión es válida?",
      options: [
        "Lo que opinan todos los jóvenes del país.",
        "Lo que opinan esos 30 estudiantes, sin generalizar.",
        "Nada: las encuestas nunca sirven.",
      ],
      correct: 1,
      feedback:
        "Una muestra pequeña y específica solo describe a ese grupo; no permite generalizar.",
    },
    {
      q: "Dos variables suben juntas. ¿Qué puedes afirmar?",
      options: [
        "Que una causa a la otra.",
        "Que están relacionadas, pero hay que comprobar si hay una causa.",
        "Que una de ellas es falsa.",
      ],
      correct: 1,
      feedback:
        "Correlación no demuestra causalidad: hay que buscar otra explicación antes de afirmar una causa.",
    },
  ],
};
