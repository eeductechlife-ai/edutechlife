export const challenges = [
  {
    id: 1,
    title: 'Investigación de Mercado',
    scenario: 'Eres consultor de negocio y tu cliente te pide un análisis competitivo del mercado de vehículos eléctricos en Latinoamérica para 2025. Necesitas datos actualizados, tendencias y proyecciones. ¿Cuál es la mejor estrategia usando Gemini?',
    context: 'Tienes acceso a Gemini Advanced con Deep Research y conexión a Google Workspace.',
    options: [
      'Pedir a Gemini que genere un informe completo basándose en su conocimiento de entrenamiento.',
      'Usar Gemini con Deep Research para que busque en tiempo real fuentes actualizadas, las analice y entregue un informe con citas verificables.',
      'Buscar manualmente en Google, copiar datos en un documento y luego pedir a Gemini que los resuma.'
    ],
    correct: 1,
    feedback: 'Deep Research es ideal para este caso: busca activamente en la web, cruza fuentes y entrega un informe con citas verificables. Los datos de entrenamiento pueden estar desactualizados y la búsqueda manual es ineficiente.',
    tip: 'Activa Deep Research desde Gemini Advanced y especifica: "Analiza el mercado de vehículos eléctricos en Latinoamérica, incluyendo principales actores, proyecciones de crecimiento y barreras de entrada. Cita todas las fuentes."'
  },
  {
    id: 2,
    title: 'Análisis de Documentos',
    scenario: 'Recibes un contrato de 45 páginas en PDF con términos complejos. Debes identificar cláusulas riesgosas, fechas clave y obligaciones antes de una reunión en 2 horas. ¿Cómo usas Gemini para maximizar tu tiempo?',
    context: 'Puedes subir archivos a Gemini y hacer preguntas sobre su contenido.',
    options: [
      'Leer el contrato completo y tomar notas manualmente, luego preguntar a Gemini dudas específicas.',
      'Subir el PDF a Gemini y pedir un resumen ejecutivo, luego hacer preguntas específicas sobre cláusulas riesgosas, fechas y obligaciones.',
      'Pedir a Gemini que redacte una contrapropuesta directamente sin leer el original.'
    ],
    correct: 1,
    feedback: 'Gemini puede procesar documentos extensos en segundos. Subir el PDF y hacer preguntas dirigidas te permite extraer la información crítica en minutos, no horas.',
    tip: 'Usa el prompt: "Analiza este contrato y extrae: 1) Cláusulas de riesgo, 2) Fechas y plazos críticos, 3) Obligaciones de cada parte, 4) Recomendaciones de negociación."'
  },
  {
    id: 3,
    title: 'Automatización con Workspace',
    scenario: 'Eres líder de proyecto y necesitas enviar un informe de avance semanal a 15 stakeholders, cada uno con datos personalizados según su departamento. Tienes los datos en una hoja de Sheets. ¿Cuál es el flujo más eficiente con Gemini en Google Workspace?',
    context: 'Gemini está integrado en Gmail, Docs, Sheets y Meet de Google Workspace.',
    options: [
      'Copiar y pegar manualmente cada informe en Gmail, ajustando los datos uno por uno.',
      'Usar Gemini en Sheets para analizar los datos, luego Gemini en Docs para redactar el informe base y Gemini en Gmail para personalizar y enviar cada correo.',
      'Enviar el mismo correo genérico a todos con los datos generales.'
    ],
    correct: 1,
    feedback: 'La integración de Gemini en Workspace permite un flujo continuo: analiza en Sheets, redacta en Docs y personaliza en Gmail sin salir del ecosistema. Esto ahorra horas de trabajo repetitivo.',
    tip: 'En Gmail, usa "Ayúdame a escribir" y especifica: "Redacta un correo para el departamento de [nombre] con los siguientes datos de avance: [pegar datos relevantes]. Tono profesional y conciso."'
  },
  {
    id: 4,
    title: 'Análisis Multimodal',
    scenario: 'Tu equipo de marketing recibió 50 capturas de pantalla de la competencia mostrando sus nuevas campañas. Necesitas un análisis visual rápido de tendencias: colores, mensajes clave, formatos y CTAs. ¿Cómo aprovechas las capacidades multimodales de Gemini?',
    context: 'Gemini puede analizar imágenes, extraer texto de ellas y reconocer patrones visuales.',
    options: [
      'Revisar cada captura manualmente y tomar notas en una hoja de cálculo.',
      'Subir todas las imágenes a Gemini y pedir un análisis visual comparativo: paletas de color, tipos de mensaje, formatos y llamadas a la acción detectadas.',
      'Solo leer el texto visible en cada captura e ignorar los elementos visuales.'
    ],
    correct: 1,
    feedback: 'La capacidad multimodal de Gemini analiza simultáneamente texto, colores, composición y elementos visuales. Puede identificar patrones que un análisis manual pasaría por alto y entrega resultados en segundos.',
    tip: 'Prompt sugerido: "Analiza estas 50 capturas de campañas de la competencia. Identifica: 1) Paletas de color dominantes, 2) Estructuras de mensaje recurrentes, 3) Formatos más usados, 4) CTAs comunes. Presenta un resumen con tendencias."'
  },
  {
    id: 5,
    title: 'Depuración de Código',
    scenario: 'Tienes un script en Python de 300 líneas que procesa datos financieros, pero está dando errores intermitentes y tarda 45 minutos en ejecutarse. Necesitas identificar bugs y optimizarlo. No eres experto en Python. ¿Cómo usas Gemini?',
    context: 'Gemini tiene capacidades avanzadas de generación y análisis de código en múltiples lenguajes.',
    options: [
      'Modificar el código al azar esperando que funcione, ya que no entiendes Python.',
      'Copiar el código completo en Gemini, pedirle que identifique los errores, explique cada problema y sugiera optimizaciones de rendimiento con explicaciones.',
      'Contratar a un desarrollador externo para que revise el código.'
    ],
    correct: 1,
    feedback: 'Gemini puede analizar código completo, identificar errores, sugerir optimizaciones y explicar cada cambio. Es como tener un desarrollador senior disponible al instante, sin necesidad de ser experto en el lenguaje.',
    tip: 'Prompt: "Analiza este script Python de procesamiento financiero. Identifica: 1) Errores que causan fallos intermitentes, 2) Cuellos de botella de rendimiento, 3) Sugiere optimizaciones específicas con código. Explica cada cambio en lenguaje simple."'
  },
  {
    id: 6,
    title: 'Insights de Datos',
    scenario: 'Tienes un archivo CSV con 10,000 filas de datos de ventas del último trimestre: productos, regiones, fechas, montos y canales. Necesitas identificar tendencias, anomalías y oportunidades de crecimiento antes de la junta directiva en 3 horas. ¿Cuál es tu estrategia con Gemini?',
    context: 'Gemini puede analizar archivos de datos, generar visualizaciones conceptuales y encontrar patrones.',
    options: [
      'Abrir el CSV en Excel y crear gráficos manualmente para cada variable.',
      'Subir el CSV a Gemini y pedir: análisis de tendencias por región y producto, detección de anomalías en ventas, identificación de canales con mejor rendimiento y recomendaciones accionables.',
      'Solo calcular el promedio de ventas totales y presentar ese número.'
    ],
    correct: 1,
    feedback: 'Gemini procesa grandes volúmenes de datos en segundos, identifica patrones que el ojo humano no detecta y entrega recomendaciones accionables. Lo que tomaría horas en Excel, Gemini lo hace en minutos.',
    tip: 'Prompt: "Analiza este CSV de ventas trimestrales. Necesito: 1) Top 5 productos por región, 2) Canales con mayor crecimiento mes a mes, 3) Anomalías o outliers, 4) Correlaciones entre variables, 5) 3 recomendaciones accionables para la junta directiva."'
  }
];
