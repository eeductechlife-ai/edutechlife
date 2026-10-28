export const CONTENT_ES_PART5 = {
  5: {
    objective:
      "Dirige a Claude como un director de orquesta: delega trabajo real, crea documentos y piezas, y supervisa cada resultado con criterio humano.",
    learningPoints: [
      {
        text: "Escribir instrucciones que Claude entiende a la primera",
        icon: "fa-comments",
      },
      {
        text: "Crear documentos, presentaciones y piezas interactivas con Artifacts",
        icon: "fa-pen-nib",
      },
      {
        text: "Delegar trabajo recurrente con Proyectos, conectores y Skills",
        icon: "fa-diagram-project",
      },
      {
        text: "Supervisar cada resultado: verificar datos y proteger información",
        icon: "fa-shield-halved",
      },
    ],
    overviewData: {
      title: "El Director de Orquesta: Claude — Delega con Criterio",
      description:
        "Claude ya no es solo un chat: crea documentos y presentaciones, se conecta a tus herramientas de trabajo, recuerda contexto y puede ejecutar tareas de varios pasos. Este módulo te enseña a dirigirlo: qué pedirle, cómo revisar lo que entrega y qué nunca debes delegar.",
      mission:
        "Tu misión como director: completa cada lección y delega una tarea real de tu trabajo. Un buen director no toca todos los instrumentos; define la partitura, escucha y corrige. ¡Dirige con criterio!",
      topics: [
        {
          title: "Conoce a Claude: la IA que trabaja contigo",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
          outcome:
            "Escribir un primer pedido completo para Claude, con objetivo, público, formato y límites.",
        },
        {
          title: "Crea con Claude: Artifacts, documentos y presentaciones",
          icon: "fa-pen-nib",
          resources: 3,
          duration: "25 min",
          outcome:
            "Pedirle a Claude un documento o una presentación, ajustarlo con cambios pequeños y revisar los datos antes de compartirlo.",
        },
        {
          title: "Delega con Claude: Proyectos, conectores y Skills",
          icon: "fa-diagram-project",
          resources: 3,
          duration: "30 min",
          outcome:
            "Decidir qué delegar a Claude, qué revisar tú y qué nunca delegar, y armar un Proyecto para el trabajo recurrente.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Conoce a Claude: la IA que trabaja contigo",
        description: "Cómo pensar y pedir como un director de orquesta",
        detailedDescription:
          "Antes de dar instrucciones, conoce el instrumento. Qué es Claude, en qué se diferencia de un buscador, cómo escribir un pedido con objetivo, audiencia y formato, cómo funciona la memoria y cuándo elegir un modelo más rápido o uno más capaz. Un buscador te muestra páginas para que leas y compares; Claude redacta una respuesta propia a tu pedido, que puede sonar segura y tener errores o no conocer cambios recientes: confirma los datos clave en una fuente actual. Para tareas simples y repetidas basta un modelo rápido; uno más capaz conviene para textos largos o que exigen razonar. La memoria se revisa y se ajusta en la configuración; un chat de incógnito no se guarda en el historial ni en la memoria, y solo existe fuera de los Proyectos (centro de ayuda de Claude, verificado en octubre de 2026).",
        duration: "20 min",
        format: "Reading",
        icon: "fa-comments",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#D97757",
      },
      {
        id: 2,
        title: "Crea con Claude: Artifacts, documentos y presentaciones",
        description:
          "De una idea a un documento o una pieza lista para compartir",
        detailedDescription:
          "Los Artifacts son piezas que ves y editas al lado de la conversación: documentos, gráficos, presentaciones y pequeñas aplicaciones. Aprende a describir el resultado, iterar con ajustes pequeños, comparar versiones y revisar antes de compartir. Con cifras, pide los pasos del cálculo y comprueba una parte por tu cuenta; después de cada ajuste, revisa que nombres, fechas y lugares sigan bien, y prueba una pieza interactiva con casos cuyo resultado ya conoces antes de compartirla.",
        duration: "25 min",
        format: "Lab",
        icon: "fa-pen-nib",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#E8A33D",
      },
      {
        id: 3,
        title: "Delega con Claude: Proyectos, conectores y Skills",
        description: "Trabajo recurrente sin perder el control",
        detailedDescription:
          "Un Proyecto guarda el contexto de un trabajo; los conectores dan acceso a tus herramientas con permisos que apruebas, y puedes desconectarlos cuando ya no los necesites; una Skill reutiliza un procedimiento; las tareas programadas automatizan lo recurrente. Delegar es definir el objetivo, los límites y la revisión: la decisión final sigue siendo tuya. Al entregar, declara cómo usaste la IA y quién responde por el contenido.",
        duration: "30 min",
        format: "Video",
        icon: "fa-diagram-project",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#0097A7",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎼 Conoce tu instrumento",
        objectiveDesc:
          "Entiende qué es Claude, cómo recuerda contexto y cómo pedir lo que necesitas a la primera.",
        achievements: [
          {
            icon: "fa-check",
            text: "Escribir un pedido con objetivo, audiencia, formato y tono",
          },
          {
            icon: "fa-check",
            text: "Controlar qué recuerda Claude entre conversaciones",
          },
          {
            icon: "fa-check",
            text: "Elegir el modelo adecuado para cada tipo de tarea",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Pedir sin contexto y esperar que adivine el resultado",
          },
          {
            icon: "fa-times",
            text: "Usar el modelo más potente para tareas simples: gasto sin ganancia",
          },
          {
            icon: "fa-times",
            text: "Dar por hecho datos recientes sin verificarlos en una fuente actual",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Vago: 'Escríbeme una propuesta para un cliente'. Resultado genérico, sin público ni tono.",
          strong:
            "✅ Claro: 'Propuesta de 2 páginas para una rectoría de colegio en Manizales, tono formal y cercano, con objetivo, plan de 3 meses y precio en pesos'. Resultado útil a la primera.",
        },
      },
      2: {
        objective: "🖋️ Crea con Artifacts",
        objectiveDesc:
          "Convierte una idea en un documento, una presentación o una pieza interactiva, y revísala antes de compartirla.",
        achievements: [
          {
            icon: "fa-check",
            text: "Describir el resultado final antes de pedir el contenido",
          },
          {
            icon: "fa-check",
            text: "Iterar con ajustes pequeños en lugar de rehacer todo",
          },
          {
            icon: "fa-check",
            text: "Verificar cifras, nombres y fechas antes de presentar",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceptar un cambio sin comparar con tu versión",
          },
          {
            icon: "fa-times",
            text: "Presentar una cifra sin revisar su origen",
          },
          {
            icon: "fa-times",
            text: "Compartir una pieza interactiva sin probarla",
          },
        ],
        example: {
          label: "Ejemplo de iteración",
          weak: "❌ Una sola petición: 'Hazme una presentación de la empresa'. Diez diapositivas genéricas.",
          strong:
            "✅ Iterando: primero el esquema de 6 diapositivas, luego el mensaje de cada una, después los gráficos con las cifras verificadas. Tres pasos, un resultado listo para la junta.",
        },
      },
      3: {
        objective: "🎛️ Delega con criterio",
        objectiveDesc:
          "Usa Proyectos, conectores y Skills para que el trabajo recurrente avance, sin perder el control de lo que se decide.",
        achievements: [
          {
            icon: "fa-check",
            text: "Crear un Proyecto con instrucciones y archivos de referencia",
          },
          {
            icon: "fa-check",
            text: "Conectar una herramienta revisando los permisos que concedes",
          },
          {
            icon: "fa-check",
            text: "Convertir un procedimiento repetido en una Skill reutilizable",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Dar contraseñas en el chat o aceptar permisos sin leerlos",
          },
          {
            icon: "fa-times",
            text: "Dejar que una tarea de varios pasos actúe sin confirmar las acciones importantes",
          },
          {
            icon: "fa-times",
            text: "Subir datos personales de terceros sin criterio ni política clara",
          },
        ],
        example: {
          label: "El director vs. el espectador",
          weak: "❌ Espectador: Conectó su correo, pidió 'responde a todo' y envió respuestas sin leerlas. Un cliente recibió un dato equivocado.",
          strong:
            "✅ Director: Definió qué responder, revisó cada borrador y dejó que Claude preparara el resumen semanal con una tarea programada. Él decide qué se envía.",
        },
      },
    },
  },
};
