// Contenido de los PDFs pendientes: módulo 1 (prompts y privacidad) y módulo 3 (práctica con Gemini).
// Se reescribieron porque las versiones anteriores tenían modelos y datos caducos.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap) => `<figure><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const M1_PROMPT = {
  chip: "Módulo 1 · Prompts",
  module: 1,
  title: "El arte del prompt",
  subtitle: "Anatomía de un prompt, la fórmula RTF y cómo mejorarlo en cada intento",
  edition: "Guía didáctica 2026",
  art: null,
  lead: "Un prompt es la instrucción que le das a la IA. La diferencia entre una respuesta mediocre y una útil casi siempre está en <strong>cuánto contexto</strong> le das y en <strong>cómo pides el resultado</strong>. Esta guía te enseña a escribir prompts que funcionan desde el primer intento.",
  kpis: [["RTF", "Rol, Tarea y Formato"], ["5", "piezas de un prompt completo"], ["3", "intentos para mejorarlo"]],
  sections: [
    {
      h: "Qué es un prompt",
      html: `<p>Puede ser una pregunta corta o un encargo detallado. La IA no sabe lo que tienes en mente: solo tiene lo que escribes. Por eso, lo que no dices, lo adivina.</p>
${box("tip", "Idea central", "<p>Un prompt es un encargo a un colaborador muy rápido que no conoce tu contexto. Cuanto mejor le expliques el trabajo, menos tendrás que corregir.</p>")}`,
    },
    {
      h: "La fórmula RTF",
      html: `<p>La fórmula RTF organiza cualquier prompt en tres piezas básicas:</p>
${cards([
  ["R · Rol", "Quién debe responder. Ejemplo: «Eres un profesor de historia de bachillerato»."],
  ["T · Tarea", "Qué debe hacer, con un verbo claro. Ejemplo: «Explica la Revolución Industrial»."],
  ["F · Formato", "Cómo debe verse el resultado. Ejemplo: «Tres párrafos y una tabla de fechas»."],
])}
<p>A la fórmula le sumamos dos elementos que suben mucho la calidad: el <strong>contexto</strong> (para quién, con qué objetivo) y las <strong>restricciones</strong> (qué no debe hacer). Y si puedes, un <strong>ejemplo</strong> del resultado que esperas.</p>`,
    },
    {
      h: "Débil frente a sólido",
      html: `<p>Otro ejemplo, esta vez de historia. Pedido débil: «Explícame la Revolución Industrial». El mismo pedido, pero sólido:</p>
${box("tip", "Sólido", `<div class="prompt">Eres un profesor de historia de bachillerato.
Contexto: mis alumnos tienen 15 años y es su primer contacto con el tema.
Tarea: explica las causas de la Revolución Industrial en Inglaterra.
Formato: tres párrafos cortos y una tabla con las 4 causas principales.
Restricciones: no uses fechas que no estés seguro de recordar bien; si dudas, dilo.</div>`)}
<p class="muted">Esto reduce el riesgo de errores, no lo elimina: igual verifica las fechas.</p>`,
    },
    {
      h: "Mejorar un prompt iterando",
      html: `<p>Casi nadie acierta a la primera, y no hace falta. Lo importante es <strong>mejorar con método</strong>.</p>
${steps([
  "<b>Primer intento:</b> escribe el prompt con RTF. Revisa la respuesta sin corregirla todavía.",
  "<b>Diagnóstico:</b> ¿qué falta? ¿Tono, nivel, longitud, ejemplos, datos concretos?",
  "<b>Segundo intento:</b> añade solo lo que faltó. Un cambio cada vez te dice qué funcionó.",
  "<b>Compara y guarda:</b> si el resultado sirve, guarda el prompt como plantilla para la próxima vez.",
])}`,
    },
    {
      h: "Errores frecuentes",
      html: `${table(["Error", "Por qué falla", "Cómo corregirlo"], [
  ["Pedir sin contexto", "La IA adivina el público y el nivel", "Agrega para quién y con qué objetivo"],
  ["Pedir «algo bueno»", "«Bueno» no tiene criterio medible", "Define el formato y la extensión"],
  ["Pedir muchas cosas a la vez", "Las respuestas se diluyen", "Divide el encargo en pasos"],
  ["Aceptar datos sin verificar", "El modelo puede equivocarse con seguridad", "Pide fuentes y verifica las cifras"],
  ["Subir datos personales", "Riesgo para la privacidad", "Anonimiza antes de pegar el texto"],
])}`,
    },
    {
      h: "Plantillas listas para usar",
      html: `<h3>Para estudiar</h3>
<div class="prompt">Eres un tutor paciente de [materia].
Explica [tema] a alguien de [nivel].
Usa una analogía cotidiana, un ejemplo resuelto y tres preguntas para comprobar mi comprensión.</div>
<h3>Para escribir</h3>
<div class="prompt">Eres un editor de textos claros para [público].
Reescribe el texto que te pego para que sea breve, sin jerga y con un tono [tono].
Conserva todos los datos y avísame si cambiaste alguno.</div>
<h3>Para revisar</h3>
<div class="prompt">Revisa este texto como lo haría un evaluador exigente.
Dime tres fortalezas, tres problemas concretos y una mejora por cada problema.</div>`,
    },
    {
      h: "Una regla para cerrar: lo que NO debes pegar",
      html: `<p>Un prompt es un documento que viaja a un servicio externo. Antes de pegar información, pregúntate si la compartirías con un desconocido.</p>
<ul class="check nocheck">${[
  "Documentos de identidad, contraseñas o datos bancarios.",
  "Historias clínicas o información de salud de otras personas.",
  "Datos personales de estudiantes o de menores de edad.",
  "Información confidencial de tu empresa o de tus clientes.",
].map((x) => `<li>${x}</li>`).join("")}</ul>
<p class="muted">En Colombia, el tratamiento de datos personales se rige por la Ley 1581 de 2012.</p>`,
    },
    {
      h: "Registro de iteración: un ejemplo real",
      html: `<p>Así se ve mejorar un prompt de forma ordenada. Cada intento cambia una sola cosa.</p>
${table(["Intento", "Prompt", "Qué faltaba", "Cambio"], [
  ["1", "Escribe un anuncio para mi curso de Excel.", "Público, precio, tono y longitud", "Agregar público y tono"],
  ["2", "Escribe un anuncio para un curso de Excel para contadores, tono cercano, 60 palabras.", "Beneficio concreto y llamado a la acción", "Pedir un beneficio medible"],
  ["3", "Igual que el 2, pero destaca cómo ahorrar 3 horas al mes en cierres contables y cierra con una invitación a inscribirse.", "Ninguno importante", "Listo para revisar"],
])}
<p class="muted">Resultado: el tercer intento es publicable tras verificar que el beneficio sea real y no prometa lo que el curso no cumple.</p>`,
    },
  ],
  closing: `${checks([
    "Escribo prompts con rol, tarea y formato, y agrego contexto.",
    "Mejoro los prompts con un cambio cada vez y comparo resultados.",
    "Verifico cifras y fuentes antes de usar una respuesta.",
    "No pego datos personales ni confidenciales en la IA.",
  ])}`,
};

export const M1_PRIVACIDAD = {
  chip: "Módulo 1 · Uso responsable",
  module: 1,
  title: "Privacidad y uso responsable de la IA",
  subtitle: "Datos personales, menores, sesgos y transparencia para usar la IA con criterio",
  edition: "Manual 2026",
  art: null,
  lead: "La IA es útil cuando sabes qué le entregas, cómo verificas lo que recibes y a quién le debes explicar que la usaste. Este manual reúne los principios que todo estudiante y profesional debería aplicar.",
  kpis: [["1581", "ley de protección de datos en Colombia (2012)"], ["4", "principios de la ley que más usarás"], ["4", "preguntas antes de compartir"]],
  sections: [
    {
      h: "Por qué la privacidad importa",
      html: `<p>Cada texto que pegas en una herramienta de IA es información que sale de tu computador. Muchas veces no sabes cómo se guarda, quién puede verla o si se usa para mejorar servicios. Tratar la privacidad como un hábito, y no como un trámite, es lo que la protege.</p>
<p><strong>Un primer paso:</strong> revisa en los ajustes de tu herramienta si tus conversaciones se usan para mejorar el servicio y desactívalo si puedes.</p>`,
    },
    {
      h: "El dilema práctico",
      html: `<p>Una profesora quiere que la IA le ayude a redactar los comentarios de los boletines. ¿Qué hace?</p>
${box("warn", "Opción A · Pegar la lista tal cual", "<p>Copia la lista de notas con nombres, apellidos y colegio de cada estudiante y pide los comentarios.</p><p>Esos datos quedan en un servicio externo: si la conversación se guarda o se comparte, se filtran datos de menores.</p>")}
${box("tip", "Opción B · Anonimizar primero", "<p>Cambia los nombres por «Estudiante A, B, C», quita el colegio y el documento, y pide solo el formato del comentario. Después ella personaliza cada texto.</p><p>La IA ayuda con la estructura y los datos de los estudiantes no salen de su control.</p>")}
<p><strong>¿Cuál protege mejor?</strong> La B: la IA puede ayudarte sin conocer a nadie. Más sobre honestidad académica en la guía de Ética.</p>`,
    },
    {
      h: "Qué datos no compartir",
      html: `${table(["Tipo de dato", "Ejemplo", "Por qué"], [
  ["Identificación", "Cédula, pasaporte, fecha de nacimiento", "Permite suplantar identidad"],
  ["Financieros", "Números de cuenta, tarjetas, ingresos", "Riesgo de fraude"],
  ["Salud", "Diagnósticos, historias clínicas", "Dato sensible con protección especial"],
  ["Menores", "Nombres, colegios, notas de niños o adolescentes", "Protección reforzada por la ley"],
  ["Credenciales", "Contraseñas, códigos de verificación", "Acceso directo a tus cuentas"],
])}`,
    },
    {
      h: "La Ley 1581 de 2012",
      html: `<p>En Colombia, la <strong>Ley 1581 de 2012</strong> regula el tratamiento de datos personales. Algunos de sus principios, los que más usarás:</p>
${cards([
  ["Finalidad", "Los datos se usan para un propósito claro e informado a la persona."],
  ["Seguridad y confidencialidad", "Quien trata los datos debe protegerlos y limitar su acceso."],
  ["Veracidad", "Los datos deben ser exactos, completos y actualizados."],
  ["Libertad", "Nadie puede usar tus datos sin tu autorización previa."],
])}
<p>La ley incluye otros principios (legalidad, transparencia, acceso y circulación restringida). Como titular, puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización que diste.</p>`,
    },
    {
      h: "Anonimizar antes de subir",
      html: `${steps([
  "Quita nombres, correos, teléfonos y direcciones del texto.",
  "Reemplaza personas por roles: «el estudiante A», «la paciente», «el proveedor».",
  "Redondea o cambia cifras sensibles sin alterar la conclusión.",
  "Revisa encabezados, firmas y datos ocultos en documentos antes de subirlos.",
])}`,
    },
    {
      h: "Sesgos y transparencia, en breve",
      html: `<p>Un modelo aprende de datos creados por personas y puede repetir sus desigualdades; a veces el sesgo aparece en lo que la respuesta <strong>omite</strong>. Pide la misma tarea con perfiles distintos y compara.</p>
${box("tip", "Frase para declarar el uso de IA", "<p>«Este borrador fue elaborado con apoyo de IA y revisado y ajustado por mí. Las cifras fueron verificadas con las fuentes citadas.»</p>")}
<p class="muted">Más sobre sesgos y transparencia en la guía de Ética.</p>`,
    },
    {
      h: "Menores de edad",
      html: `<p>Cuando la IA se usa con niños o adolescentes, un adulto responsable decide qué se comparte, elige las herramientas y supervisa el uso. La ley restringe el tratamiento de datos de niñas, niños y adolescentes y exige proteger sus derechos.</p>`,
    },
    {
      h: "Protocolo antes de compartir",
      html: `<p>Antes de compartir cualquier resultado hecho con IA, responde «sí» a las cuatro preguntas: verifiqué cada cifra, cita y nombre en la fuente original; eliminé los datos personales o confidenciales; una persona responsable revisó la decisión; y declaré el uso de IA cuando corresponde.</p>`,
    },
    {
      h: "Si ya compartiste un dato sensible",
      html: `<p>Pasa, incluso a personas cuidadosas. Lo importante es actuar rápido y con orden.</p>
${steps([
  "<b>Detén el uso:</b> no sigas pegando información en esa conversación.",
  "<b>Revisa el historial:</b> si la herramienta permite borrar conversaciones o desactivar el historial, hazlo.",
  "<b>Protege tus cuentas:</b> si compartiste contraseñas o códigos, cámbialos hoy y activa la verificación en dos pasos.",
  "<b>Informa si son datos de terceros o de menores:</b> avisa a la persona responsable de datos de tu organización o colegio.",
  "<b>Documenta lo ocurrido:</b> qué dato, cuándo y qué hiciste. Esto ayuda a decidir si hay que avisar a alguien más.",
])}`,
    },
  ],
  closing: `${checks([
    "Pego solo lo necesario y anonimizo lo que sea personal.",
    "Verifico lo que la IA me entrega antes de usarlo.",
    "Declaro cuándo usé IA y protejo los datos de terceros y de menores.",
  ])}`,
};

export const M3_PRACTICA = {
  chip: "Módulo 3 · Práctica",
  module: 3,
  title: "Gemini a la práctica",
  subtitle: "Plantillas, ejercicios de campo y tablas de evidencia para investigar con fuentes",
  edition: "Plantillas 2026",
  art: null,
  lead: "Investigar bien es comprobar. Estas plantillas te permiten llevar a Gemini a casos reales, pedir fuentes en cada respuesta y dejar un registro de lo que verificaste.",
  kpis: [["5", "ejercicios de campo"], ["5", "columnas en la tabla de evidencia"], ["3", "fuentes antes de concluir"]],
  sections: [
    {
      h: "Antes de empezar",
      html: `<p>Gemini cambia con frecuencia. Antes de cada ejercicio, revisa qué modelo ofrece tu cuenta y qué funciones incluye tu plan. Anota la fecha de tu investigación: una fuente de hace dos años puede no servir hoy.</p>
${box("key", "¿Qué es «anclar» una respuesta (grounding)?", "<p>Es cuando la IA apoya lo que dice en fuentes reales que puedes abrir, en lugar de responder solo de memoria.</p><p><strong>Suena bien, pero no se puede comprobar:</strong> «El 70 % de los colegios ya usa IA» (sin fuente).<br><strong>Anclada:</strong> «Según [nombre del informe], página X, [dato]» con enlace y fecha. Tu trabajo: abrir el enlace y confirmar que el dato está ahí.</p>")}
<h3>Ejercicio 0 · La misma pregunta dos veces</h3><p>Haz la misma pregunta dos veces: la primera sin pedir fuentes y la segunda con «cita cada dato con enlace y fecha». ¿Con cuál puedes comprobar lo que dice?</p>`,
    },
    {
      h: "Ejercicio 1: mapa local de competidores",
      html: `<p>Identifica tres competidores de tu ciudad o sector y compáralos con fuentes públicas.</p>
<div class="prompt">Investiga los tres principales [servicio] en [ciudad].
Para cada uno entrega: propuesta de valor, precio publicado, canal de contacto y la fuente de cada dato.
Si un dato no aparece en una fuente pública, escribe «no verificado».</div>
<p class="muted">Variante cotidiana: compara tres opciones de un producto o servicio que quieras comprar en tu ciudad, con precio publicado, fuente y fecha.</p>`,
    },
    {
      h: "Ejercicio 2: verificar una noticia",
      html: `${steps([
  "Copia el titular y la frase que más te llamó la atención.",
  "Pide a Gemini que busque fuentes que la confirmen y fuentes que la desmientan.",
  "Para una noticia, abre al menos dos fuentes primarias (organismos oficiales, medios con autoría); para un informe, tres.",
  "Clasifica la noticia: confirmada, parcial, no verificada o falsa.",
])}`,
    },
    {
      h: "Ejercicio 3: informe con Deep Research",
      html: `<div class="prompt">Investiga [tema] para [público], con fuentes de los últimos [número] años.
Entrega: 1) resumen de 5 líneas, 2) hallazgos con su fuente, 3) contradicciones entre fuentes, 4) qué no pudiste verificar.</div>
${box("warn", "Antes de usar el informe", "<p>Abre tres fuentes que sostengan las conclusiones clave. Si una cifra no aparece en la fuente citada, no la uses.</p>")}`,
    },
    {
      h: "Ejercicio 4: resumir tu correo",
      html: `<p>Si tienes un hilo de correo largo, puedes pedir un resumen con las decisiones pendientes. Antes de resumir, quita o ignora datos personales de terceros (cédulas, teléfonos, datos de menores); si el hilo es confidencial, practica con uno inventado. Revisa siempre el resumen contra el hilo original antes de responder.</p>
<div class="prompt">Resume este hilo de correo en: 1) contexto en dos líneas, 2) decisiones tomadas, 3) pendientes con responsable y fecha si aparece.
No inventes fechas ni responsables: si no están en el hilo, escribe «no aparece».</div>`,
    },
    {
      h: "Tabla de evidencia",
      html: `<p>Lleva un registro de lo que investigaste. Cada afirmación importante debe tener una fila.</p>
${table(["Afirmación", "Fuente", "Fecha", "Verificada (sí / no)", "Notas"], [
  ["Ej. 1: «el precio subió 10 %»", "Informe oficial (enlace)", "12-sep-2026", "Sí", "Lo encontré en la página 4 del original"],
  ["Ej. 2: «el 70 % de colegios usa IA»", "Ninguna encontrada", "—", "No", "Cifra sin fuente: no la uso"],
  ["<span class=\"muted\">Tu afirmación…</span>", "<span class=\"muted\">Enlace…</span>", "<span class=\"muted\">Fecha…</span>", "<span class=\"muted\">Sí / no</span>", "<span class=\"muted\">Qué comprobaste</span>"],
])}`,
    },
    {
      h: "Errores frecuentes",
      html: `${table(["Error", "Cómo evitarlo"], [
  ["Confiar en el resumen sin abrir la fuente", "Abre la parte del original que sustenta cada conclusión"],
  ["Usar fuentes sin fecha", "Anota la fecha y descarta lo que esté desactualizado"],
  ["Mezclar hechos con opiniones", "Separa en la tabla lo verificado de lo que es interpretación"],
  ["Pegar datos personales de terceros", "Anonimiza antes de compartir documentos"],
])}`,
    },
  ],
  closing: `${checks([
    "Antes de investigar revisé el modelo y el plan de mi cuenta.",
    "Cada afirmación importante tiene una fuente en mi tabla de evidencia.",
    "No uso una cifra que no encuentro en la fuente citada.",
  ])}`,
};
