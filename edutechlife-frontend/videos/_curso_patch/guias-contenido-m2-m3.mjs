// Contenido de las guías PDF de los módulos 2 (ChatGPT) y 3 (Gemini).
// Solo afirmaciones verificables; los nombres de modelos cambian según el plan y se remiten al selector de la cuenta.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap) => `<figure><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const M2_CHATGPT = {
  chip: "Módulo 2 · ChatGPT",
  module: 2,
  title: "Guía Completa de ChatGPT",
  subtitle: "De los planos a la obra: herramientas, Proyectos, GPTs y agentes para trabajar con criterio",
  edition: "Edición 2026",
  art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "ChatGPT no es un buscador ni una enciclopedia: es un colaborador que escribe, analiza y ejecuta tareas cuando le das <strong>contexto</strong>, <strong>objetivo</strong> y <strong>revisión</strong>. Esta guía reúne lo que necesitas para usarlo como un profesional.",
  kpis: [["6", "elementos de un prompt sólido"], ["3", "pasos para verificar antes de usar"], ["8", "herramientas del ecosistema"]],
  sections: [
    {
      h: "El mapa del ecosistema",
      html: `<p>Cada herramienta resuelve un tipo distinto de trabajo. Elegir la correcta ahorra tiempo y reduce errores.</p>
${table(["Herramienta", "Para qué sirve", "Cuándo usarla"], [
  ["<b>Chat</b>", "Pensar, redactar, resumir y explicar", "Casi siempre es el punto de partida"],
  ["<b>Búsqueda web</b>", "Datos recientes con fuentes", "Cifras, precios, noticias, normas vigentes"],
  ["<b>Análisis de datos</b>", "Procesar CSV, Excel y tablas; generar gráficos", "Cuando hay números que revisar"],
  ["<b>Generación de imágenes</b>", "Ilustraciones y piezas visuales", "Ideas visuales; el texto de las imágenes se escribe aparte"],
  ["<b>Canvas</b>", "Editar un documento o código lado a lado con la conversación", "Textos largos que cambian con el tiempo"],
  ["<b>Proyectos</b>", "Agrupar instrucciones y archivos de un mismo trabajo", "Cuando el contexto se repite"],
  ["<b>GPTs</b>", "Asistentes con instrucciones y conocimiento propios", "Tareas que repites con las mismas reglas"],
  ["<b>Agente</b>", "Ejecutar tareas de varios pasos con supervisión", "Investigar, comparar y armar un entregable"],
])}`,
    },
    {
      h: "Elegir el modelo correcto",
      html: `<p>ChatGPT ofrece varios modelos de la familia GPT-6. Su nombre, sus límites y los modelos disponibles <strong>dependen de tu plan</strong> y cambian con frecuencia. Lo estable es la regla de decisión:</p>
${cards([
  ["Modelo rápido", "Borradores, resúmenes, correos, ideas, traducciones y tareas sencillas."],
  ["Modelo de razonamiento o más potente", "Análisis complejos, decisiones con varios factores, revisión de documentos largos y lógica."],
])}
${box("warn", "Antes de decidir", "<p>Abre el selector de modelos de tu cuenta: lo que ves depende de tu plan. Un modelo más potente no siempre es mejor: es más lento y consume más recursos. Úsalo cuando la tarea lo justifique.</p>")}`,
    },
    {
      h: "Prompts que sí funcionan: los seis elementos",
      html: `<p>Un prompt sólido responde a seis preguntas. No todas son necesarias en cada caso, pero cuantas más respondas, menos adivina el modelo.</p>
${table(["Elemento", "Pregunta que responde", "Ejemplo"], [
  ["<b>Rol</b>", "¿Quién debe responder?", "Eres asesora de atención al cliente de una escuela de idiomas en Manizales."],
  ["<b>Contexto</b>", "¿Qué pasó y qué sabemos?", "Un alumno pidió reembolso tras la cancelación de una clase."],
  ["<b>Tarea</b>", "¿Qué debe producir?", "Redacta un correo empático que explique la política de reembolsos."],
  ["<b>Formato</b>", "¿Cómo debe verse?", "Tres párrafos, máximo 150 palabras, sin listas."],
  ["<b>Restricciones</b>", "¿Qué no debe hacer?", "No prometer fechas ni montos que no estén en la política."],
  ["<b>Ejemplos</b>", "¿Cómo se ve bien?", "Incluye un ejemplo de tono cercano y profesional."],
])}
<h3>Comparación real</h3>
${box("warn", "Débil", `<div class="prompt">Escribe un correo para clientes.</div>`)}
${box("tip", "Sólido", `<div class="prompt">Eres asesora de atención al cliente de una escuela de idiomas en Manizales.
Contexto: un alumno pidió reembolso tras la cancelación de una clase.
Tarea: redacta un correo empático que explique la política de reembolsos.
Formato: tres párrafos, máximo 150 palabras, sin listas.
Restricciones: no prometas fechas ni montos que no estén en la política.</div>`)}
<p class="muted">Itera: pide cambios pequeños ("acorta el segundo párrafo") en lugar de rehacer todo, y compara versiones antes de aceptar.</p>`,
    },
    {
      h: "Búsqueda web y análisis de datos",
      html: `<h3>Búsqueda web</h3>
<p>Actívala cuando necesites información reciente. Pide siempre las fuentes y abre al menos una antes de usar una cifra. Si una respuesta no cita fuentes, trátala como una hipótesis.</p>
<h3>Análisis de datos</h3>
<p>Sube tu archivo (CSV o Excel), formula la pregunta concreta y pide el método. Verifica el resultado con una muestra pequeña y pide el paso a paso o el código usado.</p>
${box("tip", "Buena pregunta", "<p>¿Cuál es la variación mensual de inscripciones entre enero y septiembre? Muéstrame la tabla, el método y un gráfico de barras, y avísame si hay meses con datos faltantes.</p>")}`,
    },
    {
      h: "Proyectos: el contexto que no se repite",
      html: `<figure style="width:60%;margin:12px auto"><img src="/ialab-resources/modulo2/portada-chatgpt.jpg"><figcaption>Trabajo con contexto: un espacio para cada proyecto.</figcaption></figure><p>Un <strong>Proyecto</strong> reúne instrucciones y archivos de un mismo trabajo. Todas las conversaciones dentro del Proyecto usan ese contexto sin que lo vuelvas a pegar.</p>
${checks([
  "Crea un Proyecto por tema (no uno gigante para todo).",
  "Escribe instrucciones claras: rol, tono, límites y lo que siempre debe revisarse.",
  "Sube solo los archivos necesarios y revisa qué información contienen.",
])}`,
    },
    {
      h: "GPTs personalizados: asistentes a tu medida",
      html: `${box("warn", "Estado de los GPTs", "<p>OpenAI anunció el retiro de los GPTs personalizados en fechas provisionales: revisa en tu cuenta si tu GPT sigue disponible y considera migrar sus instrucciones a un Proyecto.</p>")}
<p>Un GPT combina tres piezas: <strong>instrucciones</strong> (rol, tono y límites), <strong>conocimiento</strong> (archivos de referencia) y, si lo necesitas, <strong>acciones</strong> (conexiones con otros servicios).</p>
${box("warn", "Antes de compartir un GPT", "<p>Decide quién puede usarlo y revisa qué archivos contiene. Nunca cargues datos personales de terceros, datos de menores ni documentos confidenciales sin autorización.</p>")}`,
    },
    {
      h: "El agente: tareas de varios pasos",
      html: `<p>El agente ejecuta una secuencia de pasos (buscar, comparar, resumir y armar un entregable). Tú no pierdes el control: <strong>apruebas cada paso</strong> antes de usar el resultado.</p>
${steps([
  "Define el entregable: qué debe quedar al final y con qué formato.",
  "Fija los límites: fuentes permitidas, plazo de búsqueda y datos que no debe usar.",
  "Revisa el plan que propone el agente antes de que ejecute.",
  "Verifica cada fuente y cada cifra del resultado final.",
])}`,
    },
    {
      h: "Aplicaciones y conectores",
      html: `<p>ChatGPT puede conectarse con aplicaciones externas (por ejemplo, de viajes, música, diseño o productividad). Cada conexión pide permisos que debes leer antes de aprobar.</p>
${figure("/ialab-resources/modulo2/infografia-conectores-chatgpt-es.jpg", "Infografía: el ecosistema de aplicaciones de ChatGPT y cómo se autoriza cada conexión.")}
${checks([
  "Conecta solo las aplicaciones que vas a usar.",
  "Revisa qué permisos pide cada una antes de aprobarlos.",
  "Desconecta lo que ya no uses. Nunca des contraseñas en el chat.",
])}`,
    },
    {
      h: "Verificar antes de usar",
      html: `<p>Los modelos pueden equivocarse con seguridad. La verificación es parte del trabajo, no un paso opcional.</p>
${steps([
  "<b>Fuentes:</b> ¿cada dato tiene una fuente que puedes abrir?",
  "<b>Cifras y nombres:</b> ¿los comprobaste contra el original?",
  "<b>Sentido:</b> ¿el resultado responde al objetivo y a la audiencia?",
])}
${box("tip", "Regla de oro", "<p>Si una cifra, una cita o una norma es importante para tu decisión, verifícala en la fuente original antes de usarla.</p>")}`,
    },
    {
      h: "Datos personales y menores",
      html: `<p>En Colombia, el tratamiento de datos personales se rige por la <strong>Ley 1581 de 2012</strong>. Minimiza: comparte solo lo necesario, anonimiza antes de subir y no cargues datos de menores, documentos de identidad ni información financiera de terceros.</p>`,
    },
    {
      h: "Plan de práctica: 5 pasos",
      html: `${steps([
  "Crea un Proyecto para un trabajo real tuyo y escribe sus instrucciones.",
  "Redacta un pedido con los seis elementos y compáralo con una versión débil.",
  "Haz una búsqueda con fuentes y verifica dos de ellas.",
  "Analiza una tabla pequeña y pide el método y un gráfico.",
  "Diseña un GPT con instrucciones, límites y una prueba con tres casos reales.",
])}`,
    },
    {
      h: "Caso práctico resuelto: una propuesta comercial",
      html: `<p>Objetivo: preparar una propuesta de tres páginas para la rectoría de un colegio. Así se trabaja de principio a fin, con cuatro pasos.</p>
${steps([
  "<b>Primer prompt con los seis elementos:</b> rol (asesor educativo), contexto (colegio de 900 estudiantes en Manizales), tarea (propuesta de capacitación docente en IA), formato (tres páginas, con objetivo, plan de tres meses y precio), restricciones (sin promesas de resultados garantizados).",
  "<b>Revisa la primera respuesta:</b> detecta qué falta. En este caso, el precio no tiene supuestos y el tono es demasiado comercial.",
  "<b>Itera con un cambio a la vez:</b> «Mantén la estructura. Cambia el tono a institucional y explica el precio por estudiante con los supuestos».",
  "<b>Verifica antes de enviar:</b> pide fuentes para las cifras del mercado educativo, abre dos de ellas y ajusta lo que no se confirme.",
])}
<div class="prompt">Eres asesor educativo. Contexto: colegio de 900 estudiantes en Manizales, interesado en capacitar a sus docentes en IA.
Tarea: redacta una propuesta de tres páginas con objetivo, plan de tres meses y precio por estudiante.
Formato: títulos claros y una tabla de cronograma.
Restricciones: tono institucional; no prometas resultados garantizados; marca con [VERIFICAR] toda cifra del mercado.</div>`,
    },
    {
      h: "Cómo evaluar un GPT antes de compartirlo",
      html: `<p>Un GPT puede parecer bueno en tu primera conversación y fallar en un caso real. Pruébalo con estos cinco casos antes de compartirlo.</p>
${table(["Prueba", "Qué esperas que haga el GPT"], [
  ["Caso normal", "Responde bien a la tarea para la que fue diseñado"],
  ["Caso límite", "Pide la información que falta antes de responder"],
  ["Fuera de alcance", "Dice con claridad que no puede ayudar y sugiere a quién consultar"],
  ["Dato sensible", "No pide ni repite datos personales o de menores"],
  ["Coherencia", "Mantiene el tono y las reglas durante toda la conversación"],
])}`,
    },
  ],
  closing: `${checks([
    "Elegí el modelo según la tarea y revisé el selector de mi plan.",
    "Mis pedidos tienen objetivo, contexto, formato y restricciones.",
    "Verifiqué las fuentes y las cifras antes de usar el resultado.",
    "No cargué datos personales ni de menores sin autorización.",
  ])}`,
};

export const M3_GEMINI = {
  chip: "Módulo 3 · Gemini",
  module: 3,
  title: "Gemini en la Práctica",
  subtitle: "El ecosistema de IA de Google, Deep Research y flujos para investigar con fuentes verificables",
  edition: "Edición 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Gemini es la familia de modelos de Google para conversar, analizar y investigar. Su mayor ventaja es que <strong>vive donde ya trabajas</strong>: Gmail, Docs, Drive y Search. Aquí aprenderás a usarlo para investigar sin que te invente datos.",
  kpis: [["5", "productos del ecosistema"], ["4", "pasos de Deep Research"], ["3", "fuentes mínimas para verificar"]],
  sections: [
    {
      h: "Qué es Gemini hoy",
      html: `<p>Gemini es desarrollado por Google DeepMind y está disponible en la aplicación Gemini, en Google Search y dentro de Google Workspace. Google actualiza sus modelos con frecuencia, así que la versión que usas depende de tu cuenta.</p>
${box("tip", "Revisa tu versión", "<p>Abre el selector de modelos de tu cuenta y anota qué versión tienes. Si un tutorial menciona otra, es probable que ya haya cambiado.</p>")}`,
    },
    {
      h: "El ecosistema que ya usas",
      html: `<figure style="width:38%;margin:12px auto"><img src="/ialab-resources/modulo3/ilustraciones/explorador-gemini.jpg"><figcaption>Tu punto de partida: una pregunta clara antes de cualquier herramienta.</figcaption></figure>${table(["Producto", "Qué aporta", "Ejemplo de uso"], [
  ["<b>Gmail</b>", "Resumen y redacción de hilos largos", "Resume 30 correos de un proveedor y lista los compromisos pendientes."],
  ["<b>Docs</b>", "Redactar, reescribir y revisar tono", "Convierte tus notas de clase en un texto con introducción y conclusión."],
  ["<b>Drive</b>", "Buscar y resumir tus propios archivos", "Encuentra dónde mencionaste un presupuesto en tus documentos del año."],
  ["<b>Sheets</b>", "Analizar tablas y proponer fórmulas", "Calcula el promedio por curso y marca los valores atípicos."],
  ["<b>Search</b>", "Respuestas con enlaces a fuentes", "Compara dos normas o precios y revisa los sitios que cita."],
])}`,
    },
    {
      h: "Deep Research: investigación en varios pasos",
      html: `<figure style="width:55%;margin:12px auto"><img src="/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg"><figcaption>Deep Research explora fuentes; tú revisas el plan y el informe.</figcaption></figure><p>Deep Research explora decenas de fuentes, las sintetiza y entrega un informe. Es poderoso, pero <strong>tú defines la pregunta y verificas el resultado</strong>.</p>
${steps([
  "<b>Define la pregunta:</b> tema, público, alcance temporal y lo que no debe incluir.",
  "<b>Revisa el plan:</b> el investigador propone las líneas de búsqueda; ajusta lo que sobra o falta.",
  "<b>Lee el informe con sus fuentes:</b> abre al menos tres fuentes que respalden las conclusiones clave.",
  "<b>Pide la limitación:</b> ¿qué no pudo verificar? Esa parte no la uses sin revisión adicional.",
])}`,
    },
    {
      h: "Investigar sin que invente",
      html: `<p>Un buen flujo de investigación separa tres cosas: <strong>hechos con fuente</strong>, <strong>interpretaciones</strong> y <strong>suposiciones</strong>. Pide esa separación de forma explícita.</p>
${box("warn", "Señales de alerta", "<ul><li>Una cifra sin fuente o con fuente que no la menciona.</li><li>Un nombre o una cita que no encuentras al buscarla.</li><li>Una respuesta que suena muy segura sobre un tema reciente.</li></ul>")}`,
    },
    {
      h: "Multimodal: texto, imágenes, audio y video",
      html: `<p>Gemini puede analizar documentos, imágenes, gráficos, audio y video. Úsalo para extraer información de un gráfico, transcribir una grabación o comparar dos documentos. Revisa los límites de tamaño y de formato de tu plan.</p>
<figure style="width:38%;margin:12px auto"><img src="/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg"><figcaption>Modelos multimodales: texto, imagen y audio en un mismo flujo.</figcaption></figure>`,
    },
    {
      h: "Un prompt de investigación",
      html: `<div class="prompt">Investiga [tema] para [público].
Busca fuentes de los últimos [años] años de organismos oficiales, universidades o medios reconocidos.
Entrega: 1) resumen de 5 líneas, 2) hallazgos con su fuente, 3) contradicciones entre fuentes.
Cita cada afirmación con su fuente y separa los hechos de las interpretaciones.
Indica qué no pudiste verificar.</div>`,
    },
    {
      h: "Privacidad y permisos",
      html: `<p>Antes de conectar Gmail, Drive o Docs, revisa qué permisos pide y concede solo los necesarios. No subas datos personales de terceros, historias clínicas, datos de menores ni información financiera sin autorización. En Colombia aplica la <strong>Ley 1581 de 2012</strong>.</p>`,
    },
    {
      h: "Errores frecuentes",
      html: `${table(["Error", "Qué pasa", "Cómo evitarlo"], [
  ["Aceptar el primer resultado", "Se usan datos no verificados", "Abre y revisa las fuentes clave"],
  ["Preguntas demasiado amplias", "Respuestas genéricas", "Acota tema, público y periodo"],
  ["Confiar en el resumen y no en el original", "Se pierden matices", "Lee la parte del original que sustenta cada conclusión"],
  ["Subir datos sensibles", "Riesgo de privacidad", "Anonimiza antes de cargar archivos"],
])}`,
    },
    {
      h: "Ejercicios de campo",
      html: `${steps([
  "<b>Mapa local:</b> investiga tres competidores de tu ciudad con fuentes públicas. Entrega una tabla con precio, propuesta y fuente.",
  "<b>Verificación:</b> toma una noticia que te llegó por WhatsApp y verifícala con Search. Indica qué fuentes la confirman o la desmienten.",
  "<b>Informe con Deep Research:</b> investiga un tema de tu área, verifica tres fuentes y reescribe el informe en tus palabras.",
])}`,
    },
    {
      h: "Caso práctico: informe de mercado con Deep Research",
      html: `<p>Ejemplo completo: investigar la demanda de cursos de inteligencia artificial para adultos en Colombia.</p>
<div class="prompt">Investiga la demanda de cursos de inteligencia artificial para adultos en Colombia en los últimos dos años.
Público: directora de una institución de educación continua.
Entrega: 1) resumen ejecutivo de cinco líneas, 2) cinco hallazgos con su fuente y fecha, 3) datos que se contradicen entre fuentes, 4) qué no pudiste verificar.</div>
${steps([
  "<b>Revisa el plan propuesto:</b> ¿incluye fuentes oficiales, cifras de mercado y tendencias? Ajusta lo que falte antes de que ejecute.",
  "<b>Revisa el informe contra su estructura:</b> cada hallazgo debe tener fuente y fecha.",
  "<b>Abre tres fuentes que sostengan las conclusiones.</b> Si una cifra no aparece en la fuente citada, descártala.",
  "<b>Reescribe en tus palabras</b> y marca lo que sigue sin verificar.",
])}`,
    },
    {
      h: "Rúbrica para evaluar un informe",
      html: `<p>Usa esta rúbrica para decidir si un informe está listo para una decisión. Cada criterio se califica como sólido, parcial o insuficiente.</p>
${table(["Criterio", "Sólido", "Parcial", "Insuficiente"], [
  ["Fuentes", "Cada hallazgo tiene fuente y fecha verificables", "Algunas fuentes sin fecha", "Afirmaciones sin fuente"],
  ["Precisión", "Las cifras coinciden con la fuente original", "Cifras redondeadas sin aclarar", "Cifras que no aparecen en la fuente"],
  ["Matices", "Señala contradicciones y condiciones", "Solo presenta una versión", "Presenta la conclusión como definitiva"],
  ["Limitaciones", "Declara lo que no pudo verificar", "Menciona límites de forma general", "No declara límites"],
])}`,
    },
  ],
  closing: `${checks([
    "Defino la pregunta, el público y el alcance antes de investigar.",
    "Verifico al menos tres fuentes antes de usar una conclusión.",
    "Separo hechos, interpretaciones y suposiciones.",
    "Reviso permisos y no comparto datos sensibles de terceros.",
  ])}`,
};
