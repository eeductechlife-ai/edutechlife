// Contenido de las guías PDF del módulo 4 (Gemini Notebook).
// El cambio de nombre (NotebookLM → Gemini Notebook, 16 de julio de 2026) está confirmado.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;

export const M4_GUIA = {
  chip: "Módulo 4 · Gemini Notebook",
  module: 4,
  title: "Gemini Notebook",
  subtitle: "Guía didáctica: fuentes propias, respuestas con citas, resúmenes y audio para estudiar y trabajar",
  edition: "Edición 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Gemini Notebook es un cuaderno de investigación que responde <strong>solo con tus fuentes</strong> y cita de dónde sale cada respuesta. Es ideal para estudiar, sintetizar documentos y convertir material largo en resúmenes, mapas, tarjetas y audio.",
  kpis: [["16 jul", "fecha del cambio de nombre"], ["3–5", "fuentes para empezar"], ["Citas", "cada respuesta trae su fuente"]],
  sections: [
    {
      h: "El cambio de nombre",
      html: `<p>El <strong>16 de julio de 2026</strong> Google renombró NotebookLM como <strong>Gemini Notebook</strong>. Es el mismo producto: el nombre cambió y los cuadernos que empezaste en Gemini se sincronizan con la aplicación.</p>
${box("tip", "Si ves NotebookLM en un tutorial", "<p>Es la misma herramienta. Busca el cuaderno con el nombre actual y revisa las opciones de tu cuenta, porque algunas funciones se despliegan por etapas.</p>")}`,
    },
    {
      h: "Qué hace distinto a un chat",
      html: `${cards([
  ["Solo con tus fuentes", "Responde a partir de los documentos que subiste. Si la información no está, lo dice."],
  ["Citas verificables", "Cada afirmación lleva un número que lleva al fragmento exacto del documento."],
  ["Transforma lo que lees", "Genera resúmenes, mapas mentales, tarjetas de estudio, cuestionarios y audio."],
  ["Estudio sin invención", "Ideal para repasar tu propio material en lugar de depender de lo que el modelo recuerda."],
])}`,
    },
    {
      h: "Crea tu primer cuaderno",
      html: `<figure style="width:55%;margin:12px auto"><img src="/ialab-resources/modulo4/ilustraciones/cuaderno-fuentes.jpg"><figcaption>Sube tus fuentes: el cuaderno solo responde con lo que contienen.</figcaption></figure>${steps([
  "Entra con tu cuenta de Google y crea un cuaderno nuevo con un nombre que describa el tema.",
  "Sube de 3 a 5 fuentes de calidad: apuntes, un artículo académico, un informe oficial.",
  "Espera a que las fuentes se procesen y revisa el resumen que propone el cuaderno.",
  "Haz tu primera pregunta concreta y abre una cita para comprobar el fragmento original.",
])}`,
    },
    {
      h: "Elegir buenas fuentes",
      html: `<p>La calidad de las fuentes define la calidad de las respuestas. Más fuentes no siempre significan mejores resultados: un cuaderno con 50 documentos desordenados responde peor que uno con cinco bien elegidos.</p>
${table(["Buena fuente", "Fuente débil"], [
  ["Informe de un organismo oficial con fecha y autor", "Texto sin autor, sin fecha y sin fuentes"],
  ["Artículo académico revisado por pares", "Publicación anónima o sin referencias"],
  ["Tus propios apuntes ordenados por tema", "Notas sueltas que se contradicen"],
  ["Documentos del mismo periodo y tema", "Mezcla de fechas que cambian la conclusión"],
])}`,
    },
    {
      h: "Preguntar con citas",
      html: `<p>Las respuestas incluyen números entre corchetes. Cada número abre el fragmento del documento del que sale la afirmación.</p>
${checks([
  "Abre al menos una cita por respuesta importante.",
  "Si una afirmación no tiene cita, no la uses sin verificarla.",
  "Pide comparaciones: «¿en qué se contradicen estas fuentes?»",
])}
${box("warn", "Regla práctica", "<p>Una respuesta sin citas es una hipótesis. Una respuesta con citas sigue necesitando tu criterio: confirma que el fragmento dice lo que la respuesta afirma.</p>")}`,
    },
    {
      h: "Formatos de estudio",
      html: `${table(["Formato", "Para qué sirve", "Cómo pedirlo"], [
  ["<b>Resumen</b>", "Entender la idea central en minutos", "«Resume las fuentes en 5 ideas con su cita»"],
  ["<b>Mapa mental</b>", "Ver relaciones entre conceptos", "«Crea un mapa de los conceptos clave y sus relaciones»"],
  ["<b>Tarjetas de estudio</b>", "Memorizar términos y definiciones", "«Crea 15 tarjetas de pregunta y respuesta con cita»"],
  ["<b>Cuestionario</b>", "Comprobar lo que entendiste", "«Crea 10 preguntas de opción múltiple con justificación»"],
])}`,
    },
    {
      h: "Audio Overviews: repasar escuchando",
      html: `<figure style="width:52%;margin:12px auto"><img src="/ialab-resources/modulo4/ilustraciones/audio-overview.jpg"><figcaption>Escucha primero; luego verifica en las citas.</figcaption></figure><p>Los resúmenes de audio convierten tus fuentes en una conversación entre dos voces. Son excelentes para repasar en movimiento. Úsalos como primera lectura, no como sustituto de las fuentes críticas: después, abre las citas que te interesan.</p>
${box("tip", "Cómo sacarle provecho", "<p>Escucha el audio una vez sin pausar, luego escribe tres ideas con tus palabras y compara con las citas.</p>")}`,
    },
    {
      h: "Análisis con código",
      html: `<p>Gemini Notebook puede escribir y ejecutar código en un entorno seguro en la nube para analizar tus fuentes con más profundidad. Esta función se despliega por planes: revisa en tu cuenta si ya está disponible. Antes de usar sus resultados, verifica las cifras con una muestra.</p>`,
    },
    {
      h: "Curaduría y uso responsable",
      html: `<figure style="width:100%;margin:12px auto"><img src="/ialab-resources/modulo4/ilustraciones/equipo-curaduria.jpg"><figcaption>Curar en equipo: revisa, cita y decide qué entra al cuaderno.</figcaption></figure><p>Curar es elegir qué entra al cuaderno y cómo se usa. Antes de compartir un resumen generado:</p>
${checks([
  "Verifiqué las cifras y citas contra el documento original.",
  "No incluí datos personales de terceros ni información confidencial.",
  "Indiqué que el resumen fue generado con IA cuando corresponde.",
])}
<p class="muted">Consulta la <strong>Ley 1581 de 2012</strong> si trabajas con datos personales en Colombia.</p>`,
    },
    {
      h: "Plan de práctica",
      html: `<figure style="width:40%;margin:12px auto"><img src="/ialab-resources/modulo4/ilustraciones/mentor-practica.jpg"><figcaption>Practica con un plan: un paso cada vez.</figcaption></figure>${steps([
  "Crea un cuaderno con tres fuentes sobre un tema que estudias.",
  "Haz cinco preguntas y verifica una cita en cada una.",
  "Genera un mapa mental y unas tarjetas de estudio.",
  "Escucha un Audio Overview y escribe tres ideas con tus palabras.",
  "Compara dos fuentes y registra en qué se contradicen.",
])}`,
    },
    {
      h: "Caso práctico: preparar un examen en 60 minutos",
      html: `${steps([
  "<b>Minuto 0–10:</b> carga tus tres fuentes principales (apuntes, un capítulo, una guía oficial) y pide un resumen con las ideas centrales y sus citas.",
  "<b>Minuto 10–25:</b> pide un mapa mental de los conceptos y sus relaciones. Revisa que cada relación tenga cita.",
  "<b>Minuto 25–40:</b> genera 15 tarjetas de estudio con cita. Estudia primero las que fallas.",
  "<b>Minuto 40–60:</b> pide un cuestionario de 10 preguntas con justificación y cita. Responde sin mirar y revisa cada error con la cita original.",
])}
${box("tip", "Señal de que estudiaste bien", "<p>Puedes explicar cada concepto sin mirar el cuaderno y localizar la cita que lo respalda. Si no puedes, vuelve a la fuente.</p>")}`,
    },
  ],
  closing: `${checks([
    "Uso Gemini Notebook con fuentes de calidad y pocas, bien elegidas.",
    "Verifico las citas antes de usar una afirmación.",
    "Convierto el material en formatos de estudio que me obligan a recordar.",
    "Protejo los datos personales y declaro el uso de IA cuando corresponde.",
  ])}`,
};

export const M4_PLANTILLAS = {
  chip: "Módulo 4 · Plantillas",
  module: 4,
  title: "El cuaderno del futuro",
  subtitle: "Plantillas de resumen y estudio para cada tipo de documento en Gemini Notebook",
  edition: "Kit de herramientas 2026",
  art: null,
  lead: "Un buen resumen empieza con una buena instrucción. Estas plantillas sirven para pedir resúmenes según el tipo de documento y el objetivo, y para comprobar que el resultado sea fiel a la fuente.",
  kpis: [["6", "plantillas listas para usar"], ["4", "pasos para revisar un resumen"], ["1", "regla: toda idea con cita"]],
  sections: [
    {
      h: "Cómo usar estas plantillas",
      html: `<figure style="width:40%;margin:12px auto"><img src="/ialab-resources/modulo4/ilustraciones/mentor-practica.jpg"><figcaption>Cada plantilla sirve para pedir y también para revisar.</figcaption></figure>${steps([
  "Elige la plantilla según el tipo de documento.",
  "Reemplaza los corchetes con tu contexto real.",
  "Pide la cita por cada idea y revisa dos de ellas.",
  "Guarda el resumen con el nombre de la fuente y la fecha.",
])}`,
    },
    {
      h: "Plantilla 1: documento académico",
      html: `<p><b>Cuándo usarla:</b> artículos, tesis, capítulos de libros.</p>
<div class="prompt">Resume [documento] para [público] en 5 ideas.
Para cada idea: afirmación, evidencia principal con cita y limitación del estudio.
Termina con las 3 preguntas que quedan abiertas.</div>`,
    },
    {
      h: "Plantilla 2: informe empresarial",
      html: `<p><b>Cuándo usarla:</b> informes de gestión, propuestas, actas de reunión.</p>
<div class="prompt">Resume [documento] para una decisión sobre [decisión].
Entrega: 1) resultado principal con cifra y cita, 2) riesgos, 3) acciones con responsable si aparece, 4) datos que faltan.</div>`,
    },
    {
      h: "Plantilla 3: documento técnico",
      html: `<p><b>Cuándo usarla:</b> manuales, especificaciones, documentación de software.</p>
<div class="prompt">Explica [documento] a alguien sin formación técnica.
Incluye: qué hace, cómo se usa paso a paso, errores comunes y en qué sección está cada punto.</div>`,
    },
    {
      h: "Plantilla 4: normativa o documento legal",
      html: `<p><b>Cuándo usarla:</b> normas, políticas internas, contratos. El resumen orienta; no reemplaza la asesoría jurídica.</p>
<div class="prompt">Resume las obligaciones y plazos de [documento].
Indica cada artículo o cláusula con su cita.
No interpretes consecuencias legales: marca lo que debe revisar un abogado.</div>`,
    },
    {
      h: "Plantilla 5: noticias e investigación",
      html: `<p><b>Cuándo usarla:</b> artículos de prensa, reportes de mercado, estudios de caso.</p>
<div class="prompt">Compara [fuente A] y [fuente B] sobre [tema].
Entrega: datos en los que coinciden, datos en los que difieren, qué fuente tiene más respaldo y por qué.</div>`,
    },
    {
      h: "Plantilla 6: estudio personal",
      html: `<p><b>Cuándo usarla:</b> preparar un examen o repasar un tema.</p>
<div class="prompt">Crea 10 preguntas de opción múltiple sobre [tema] basadas solo en estas fuentes.
Para cada pregunta: 4 opciones, la correcta, la cita que la respalda y una explicación de por qué las otras fallan.</div>`,
    },
    {
      h: "Cómo revisar un resumen",
      html: `${table(["Paso", "Pregunta de revisión"], [
  ["1. Fidelidad", "¿Cada idea aparece en el documento original?"],
  ["2. Cifras", "¿Las cifras coinciden exactamente con la fuente?"],
  ["3. Matices", "¿Se perdió alguna condición, excepción o limitación?"],
  ["4. Uso", "¿Lo que voy a hacer con el resumen es coherente con lo que dice la fuente?"],
])}
${box("warn", "Antes de compartir", "<p>Un resumen compartido es tu responsabilidad. Verifica, declara el uso de IA cuando corresponda y no incluyas datos personales de terceros.</p>")}`,
    },
  ],
  closing: `${checks([
    "Elegí la plantilla según el tipo de documento.",
    "Revisé cada cifra y cada cita contra la fuente.",
    "Declaré el uso de IA y protegí los datos personales.",
  ])}`,
};
