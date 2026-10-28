export const CONTENT_ES_PART1 = {
  1: {
    objective:
      "Al terminar este módulo podrás redactar prompts con la fórmula RTF (Rol + Tarea + Formato) y el contexto necesario, para obtener respuestas útiles de cualquier modelo de IA desde el primer intento.",
    learningPoints: [
      {
        text: "Explicar qué es la IA generativa y por qué a veces se equivoca",
        icon: "fa-brain",
      },
      {
        text: "Escribir prompts con la fórmula RTF y mejorarlos iterando",
        icon: "fa-wand-magic-sparkles",
      },
      {
        text: "Detectar sesgos, privacidad en riesgo y citas falsas antes de usar un resultado",
        icon: "fa-shield-halved",
      },
      {
        text: "Usar la IA con transparencia y dentro de la ley",
        icon: "fa-scale-balanced",
      },
    ],
    overviewData: {
      title:
        "El Artesano Digital: Prompts y Ética — Los Fundamentos de Toda Interacción con IA",
      description:
        "Todo artesano comienza con las herramientas básicas y, con práctica, se convierte en maestro. Aquí aprenderás a esculpir instrucciones que la IA entiende a la perfección. Desde los fundamentos hasta técnicas avanzadas que transformarán tu forma de trabajar con inteligencia artificial. Y un artesano responsable sabe cuándo no usar la herramienta: aquí aprenderás a verificar, proteger datos y usar la IA dentro de la ley.",
      mission:
        "Tu misión como artesano: completa cada lección y recurso multimedia (videos, guías y laboratorios). Cada herramienta que domines te acerca un 20% más a tu certificación. ¡Las instrucciones precisas son tu sello de calidad! Este módulo incluye el juramento del guardián: sin verificar, proteger datos y declarar tu uso de IA, ningún prompt está terminado.",
      topics: [
        {
          title: "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
          icon: "fa-brain",
          resources: 3,
          duration: "20 min",
          outcome:
            "Explicar con tus palabras qué es la IA generativa, qué hace bien y por qué a veces se equivoca.",
        },
        {
          title: "El Cincel del Artesano: ¿Qué es un Prompt?",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
          outcome:
            "Escribir un pedido claro con la fórmula Rol + Tarea + Formato y mejorarlo hasta que te sirva.",
        },
        {
          title: "El Escudo del Guardián: Lo que No Debes Compartir",
          icon: "fa-lock",
          resources: 3,
          duration: "20 min",
          outcome:
            "Decidir qué datos nunca compartes con una IA y anonimizar un texto antes de pegarlo.",
        },
        {
          title: "El Juramento del Guardián: Ética y Sesgos",
          icon: "fa-shield-halved",
          resources: 3,
          duration: "20 min",
          outcome:
            "Detectar un sesgo en una respuesta de IA, aplicar tres preguntas (¿es cierto?, ¿es justo?, ¿lo declaro?) y declarar cuándo usaste IA.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
        description: "Entiende la herramienta antes de usarla",
        detailedDescription:
          "Antes de pedirle algo a la IA, conviene saber cómo funciona. Verás qué es la IA generativa, qué hace bien y cuáles son sus límites: por qué puede inventar datos con seguridad (las llamadas alucinaciones) y por qué puede no conocer lo más reciente si no busca en la web. Con esa base podrás usarla con criterio desde el primer día, aunque nunca la hayas usado. Repasarás también cómo empezó la IA, desde sus primeros modelos hasta hoy, para entender de dónde vienen sus límites.",
        duration: "20 min",
        format: "Video",
        icon: "fa-brain",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#4DA8C4",
      },
      {
        id: 2,
        title: "El Cincel del Artesano: ¿Qué es un Prompt?",
        description: "Pide exactamente lo que necesitas",
        detailedDescription:
          "Un prompt es la instrucción que le das a la IA. Aprenderás la fórmula RTF (Rol + Tarea + Formato), a sumar el contexto que la IA no conoce y a mejorar una respuesta pidiendo ajustes en lugar de empezar de cero. Sumarás el tono y la extensión, darás un ejemplo del estilo que quieres, dividirás una tarea grande en pasos, quitarás lo que no aporta y guardarás tus mejores prompts como plantillas. Practicarás con casos de estudio, trabajo y vida diaria hasta obtener resultados útiles a la primera.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-comments",
        badgeColor: "bg-sky-100 text-sky-800",
        themeColor: "#199DB9",
      },
      {
        id: 3,
        title: "El Escudo del Guardián: Lo que No Debes Compartir",
        description: "Protege tus datos y los de otras personas",
        detailedDescription:
          "Todo lo que pegas en una IA sale de tu computador. Aprenderás qué datos nunca compartes (identidad, salud, menores, claves), cómo anonimizar un texto antes de pegarlo y qué hacer si ya compartiste algo sensible. Así proteges tu privacidad y la de otras personas. Qué dice la ley: en Colombia, la Ley 1581 de 2012 regula los datos personales; anonimizarlos antes de compartirlos con una IA es una buena práctica que reduce el riesgo.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-lock",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#0E7490",
      },
      {
        id: 4,
        title: "El Juramento del Guardián: Ética y Sesgos",
        description: "Decide con criterio, detecta sesgos y declara tu uso",
        detailedDescription:
          "La ética es decidir bien incluso cuando nadie te obliga. Aprenderás tres de las cinco preguntas para cada resultado (¿es cierto?, ¿es justo?, ¿lo declaro?), a detectar sesgos en una respuesta y a declarar tu uso de IA. Al final, verás cómo la Unión Europea clasifica los sistemas de IA por riesgo. También aprenderás que suplantar la identidad de alguien con IA es un uso no ético, y cómo proteger a los menores cuando un sistema responde mal.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-shield-halved",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#0E7490",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Los Fundamentos del Artesano",
        objectiveDesc:
          "Entiende qué es la IA generativa y cómo crea contenido nuevo. Aquí comienza tu oficio digital.",
      },
      2: {
        objective: "🎯 El Cincel del Artesano",
        objectiveDesc:
          "Un prompt bien forjado es tu herramienta más poderosa: aprende a escribir instrucciones que la IA entienda a la primera.",
      },
      3: {
        objective: "🔒 El Escudo del Guardián",
        objectiveDesc:
          "Antes de pegar algo en una IA, decide qué entra y qué se queda contigo.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar datos personales: cédulas, teléfonos, salud y datos de menores",
          },
          {
            icon: "fa-check",
            text: "Anonimizar un texto antes de pegarlo (roles en lugar de nombres)",
          },
          {
            icon: "fa-check",
            text: "Saber qué hacer si ya compartiste un dato sensible",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Pegar datos de otras personas sin su autorización",
          },
          {
            icon: "fa-times",
            text: "Subir información de menores de edad",
          },
          {
            icon: "fa-times",
            text: "Compartir contraseñas o códigos de verificación",
          },
        ],
        example: {
          label: "El Guardián vs. El Imprudente",
          weak: "❌ El imprudente: Pegó la lista de notas con nombres y apellidos de los estudiantes para pedir los comentarios del boletín.",
          strong:
            "✅ El guardián: Cambió los nombres por «Estudiante A, B, C», quitó el colegio y el documento, y pidió solo el formato del comentario.",
        },
      },
      4: {
        objective: "🛡️ El Juramento del Guardián",
        objectiveDesc:
          "Antes de confiar en un resultado, míralo en el espejo: detecta sesgos, decide con criterio, protege a las personas y declara cómo usaste la IA.",
        achievements: [
          {
            icon: "fa-check",
            text: "Reconocer qué personas o perspectivas quedan por fuera de una respuesta",
          },
          {
            icon: "fa-check",
            text: "Aplicar las tres preguntas: ¿es cierto?, ¿es justo?, ¿lo declaro?",
          },
          {
            icon: "fa-check",
            text: "Declarar cuándo y cómo usaste IA y dejar a una persona responsable de las decisiones",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Creer una respuesta solo porque suena segura: puede estar sesgada o traer citas inventadas",
          },
          {
            icon: "fa-times",
            text: "Dejar que la IA decida sola sobre contratar, evaluar o sancionar",
          },
          {
            icon: "fa-times",
            text: "Presentar como propio un trabajo generado por IA sin revisarlo ni declararlo",
          },
        ],
        example: {
          label: "El Guardián vs. El Imprudente",
          weak: "❌ El imprudente: Un estudiante entregó un ensayo generado por IA. Tenía citas inventadas y ejemplos de un solo tipo de persona; el profesor lo descubrió y perdió credibilidad.",
          strong:
            "✅ El guardián: Usó la IA como asistente, pidió la misma tarea con perfiles distintos para ver el sesgo, verificó cada fuente, declaró su uso y entregó un trabajo sólido y honesto.",
        },
      },
    },
  },
};
