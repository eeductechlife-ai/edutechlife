export default {
  badge: "Módulo 1 · Explicación",
  title: "El Espejo de la Verdad",
  subtitle:
    "Qué es un sesgo en la IA, de dónde viene, cómo detectarlo y cómo reducirlo",
  intro:
    "La IA aprende de textos escritos por personas, y esos textos tienen prejuicios. Un espejo muestra lo que hay: aquí aprenderás a ver los sesgos que la IA puede reflejar y repetir, y qué hacer para no amplificarlos.",
  objectives: [
    "Definir sesgo algorítmico y explicar su origen",
    "Reconocer cuatro tipos de sesgo con ejemplos",
    "Aplicar una prueba sencilla para detectar un sesgo",
    "Proponer medidas para reducir un sesgo en un resultado",
  ],
  sections: [
    {
      title: "1. De dónde viene un sesgo",
      explain: [
        "Un sesgo es una inclinación que favorece o perjudica de forma sistemática a un grupo de personas. Un sistema de IA puede tenerlo porque aprendió de datos que ya lo tenían.",
        "El sesgo no siempre es intencional. Puede venir de los datos, de cómo se etiquetaron, o de quién diseñó el sistema y qué problema se propuso resolver.",
      ],
      terms: [
        {
          term: "Sesgo algorítmico",
          def: "Resultado sistemáticamente injusto que produce un sistema automático.",
        },
        {
          term: "Datos de entrenamiento",
          def: "Los textos o registros con los que el sistema aprendió a responder.",
        },
      ],
      how: [
        "Los datos reflejan decisiones y prejuicios del pasado.",
        "El sistema aprende esos patrones como si fueran normales.",
        "Repite el patrón en sus respuestas y decisiones.",
      ],
      example:
        "Si en los datos de contratación de una empresa casi nunca aparecen mujeres en cargos de dirección, un sistema entrenado con ellos puede asociar «dirección» con hombres.",
      mistake:
        "Pensar que, como es una máquina, no puede ser injusta. Si aprende de datos injustos, reproduce la injusticia.",
    },
    {
      title: "2. Cuatro tipos de sesgo",
      explain: [
        "Hay varias formas de sesgo. Reconocer el tipo te ayuda a buscarlo en el lugar correcto.",
        "Sesgo de datos: los datos no representan a todos. Sesgo de muestreo: se eligió mal a quién medir. Sesgo de etiquetado: quien clasificó los datos tenía una visión sesgada. Sesgo de confirmación: el sistema tiende a dar lo que se espera.",
      ],
      terms: [
        {
          term: "Sesgo de datos",
          def: "Los datos no representan bien a la población real.",
        },
        {
          term: "Sesgo de muestreo",
          def: "Se eligieron de forma que algunos grupos quedan fuera.",
        },
        {
          term: "Sesgo de etiquetado",
          def: "Las etiquetas que se asignaron a los datos reflejan prejuicios de quien las puso.",
        },
      ],
      how: [
        "Pregunta a quién representan los datos.",
        "Pregunta quién los clasificó y con qué criterio.",
        "Revisa si el resultado favorece a unos grupos más que a otros.",
      ],
      example:
        "Un sistema para detectar «buenos candidatos» entrenado solo con perfiles de una ciudad puede penalizar a candidatos de otras regiones: sesgo de muestreo.",
      mistake:
        "Buscar el sesgo solo en el resultado final. A veces empieza en los datos o en cómo se etiquetaron.",
    },
    {
      title: "3. Cómo detectar un sesgo",
      explain: [
        "Una prueba sencilla consiste en hacer la misma pregunta cambiando solo un dato que no debería importar, como el nombre, la edad o el lugar de origen, y comparar las respuestas.",
        "Si la respuesta cambia de forma injusta, hay un sesgo que conviene reportar y corregir.",
      ],
      terms: [
        {
          term: "Prueba contrafactual",
          def: "Cambiar un solo dato y observar si el resultado cambia injustamente.",
        },
        {
          term: "Grupo afectado",
          def: "Las personas que reciben un trato injusto por el sesgo.",
        },
      ],
      how: [
        "Elige el dato a cambiar (nombre, edad, región).",
        "Haz la misma pregunta dos o tres veces, cambiando solo ese dato.",
        "Compara las respuestas y anota las diferencias injustas.",
      ],
      example:
        "Pides una recomendación de carrera para «Ana» y para «Andrés», con el mismo perfil académico. Si una recomendación es más ambiciosa para uno, hay un sesgo que revisar.",
      mistake:
        "Probar una sola vez. Un sesgo se confirma con varias pruebas y casos distintos.",
    },
    {
      title: "4. Reducir el sesgo",
      explain: [
        "Reducir un sesgo significa cambiar el proceso: incluir datos más representativos, revisar las etiquetas, pedir justificaciones y dejar una persona que decida en los casos que afectan a otros.",
        "Ningún método lo elimina por completo. Lo importante es detectarlo, reportarlo y corregirlo a tiempo.",
      ],
      terms: [
        {
          term: "Mitigación",
          def: "Medidas para reducir un sesgo sin pretender eliminarlo del todo.",
        },
        {
          term: "Revisión humana",
          def: "Una persona que revisa y decide cuando el resultado afecta a personas.",
        },
      ],
      how: [
        "Pide al sistema que explique sus criterios.",
        "Revisa si faltan grupos en los datos y completa la información.",
        "Deja una persona a cargo de las decisiones que afectan a otros.",
      ],
      example:
        "Antes de usar una herramienta de selección, pides los criterios y pruebas con casos de distintos grupos. Solo después decides cómo usarla.",
      mistake:
        "Confiar en que un resultado es justo porque el sistema lo dice. Hay que verificarlo.",
    },
  ],
  summary: [
    "Un sesgo es una inclinación injusta y sistemática; la IA puede aprenderlo de los datos.",
    "Puede venir de los datos, del muestreo, del etiquetado o del propio diseño del sistema.",
    "La prueba contrafactual cambia un solo dato para ver si el resultado cambia injustamente.",
    "Reducir un sesgo exige revisar datos, pedir criterios y dejar una persona a cargo.",
    "Detectar, reportar y corregir a tiempo es más importante que pensar que no existe.",
  ],
  check: [
    {
      q: "¿De dónde puede venir un sesgo en la IA?",
      options: [
        "Solo de errores de programación evidentes.",
        "De los datos, del etiquetado o de cómo se diseñó el sistema.",
        "Del color de la pantalla donde se usa.",
      ],
      correct: 1,
      feedback:
        "El sesgo puede empezar en los datos, en las etiquetas o en el diseño, no solo en el código.",
    },
    {
      q: "¿Qué es una prueba contrafactual?",
      options: [
        "Cambiar un solo dato y observar si el resultado cambia injustamente.",
        "Pedir a la IA que se evalúe a sí misma.",
        "Borrar los datos antes de probar.",
      ],
      correct: 0,
      feedback:
        "Cambiar un solo dato que no debería importar permite ver si hay un trato injusto.",
    },
    {
      q: "Un sistema da respuestas distintas a dos perfiles iguales que solo difieren en el lugar de origen. ¿Qué haces?",
      options: [
        "Lo acepto, porque la IA no tiene prejuicios.",
        "Lo reporto y reviso los datos y criterios que lo producen.",
        "Elijo siempre la respuesta más favorable.",
      ],
      correct: 1,
      feedback:
        "Una diferencia injusta entre perfiles iguales es un sesgo: hay que reportarlo y revisar su origen.",
    },
  ],
};
