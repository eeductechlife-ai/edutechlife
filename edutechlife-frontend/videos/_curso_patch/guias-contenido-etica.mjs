// Guía de ética para el módulo 1 (reemplaza el PDF con emblema ajeno de bias-guide-1).

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;

export const M1_ETICA = {
  chip: "Módulo 1 · Ética",
  module: 1,
  title: "Ética de la IA",
  subtitle: "Principios para usar la inteligencia artificial con honestidad, equidad y responsabilidad",
  edition: "Guía didáctica 2026",
  art: null,
  lead: "Usar la IA bien no es solo obtener buenos resultados: es saber cuándo confiar, cuándo verificar y cuándo decir que la usaste. Esta guía reúne los principios que sostienen un uso responsable en la escuela, el trabajo y la vida diaria.",
  kpis: [["5", "principios de uso responsable"], ["3", "preguntas antes de publicar"], ["1982", "Ley de derechos de autor en Colombia (Ley 23)"]],
  sections: [
    {
      h: "Por qué la ética importa en la IA",
      html: `<p>Un sistema de IA puede escribir con seguridad algo falso, repetir prejuicios de sus datos y producir contenido que nadie firmó. Cuando lo usamos sin criterio, los errores se multiplican y las consecuencias recaen en personas reales: un estudiante acusado injustamente, un cliente mal informado o una decisión tomada con datos sesgados.</p>`,
    },
    {
      h: "Los cinco principios",
      html: `${cards([
  ["Transparencia", "Declara cuándo usaste IA y explica qué parte revisaste tú."],
  ["Veracidad", "Verifica datos, citas y nombres antes de usarlos o compartirlos."],
  ["Equidad", "Revisa si la respuesta trata a todas las personas con el mismo rigor."],
  ["Privacidad", "No compartas datos personales, de menores ni confidenciales."],
  ["Responsabilidad humana", "La decisión final y sus consecuencias siguen siendo de una persona."],
])}`,
    },
    {
      h: "Honestidad académica",
      html: `<p>Usar la IA para entender un tema, organizar ideas o revisar la gramática puede ser un apoyo legítimo, siempre que el texto final refleje tu aprendizaje. Entregar un trabajo que no escribiste ni comprendes daña tu formación y engaña a quien evalúa.</p>
${table(["Uso aceptable", "Uso que no es honesto"], [
  ["Pedir explicaciones y ejemplos del tema", "Entregar un ensayo redactado completo por la IA"],
  ["Revisar la gramática de un texto propio", "Presentar como propio un texto que no entiendes"],
  ["Generar preguntas para estudiar", "Responder un examen con respuestas generadas en vivo"],
  ["Declarar el apoyo de IA en tu trabajo", "Ocultar que usaste IA cuando la norma lo exige"],
])}`,
    },
    {
      h: "Sesgos y equidad",
      html: `<p>Los modelos aprenden de datos creados por personas, y pueden repetir sus desigualdades: estereotipos de género, de región, de edad o de nivel socioeconómico. El sesgo a veces no está en lo que la respuesta dice, sino en lo que omite.</p>
${steps([
  "Pide la misma tarea con perfiles distintos y compara las respuestas.",
  "Pregunta qué perspectivas faltan y busca al menos una fuente que las represente.",
  "Antes de decidir algo que afecta a personas, consulta con quien conoce el contexto.",
])}`,
    },
    {
      h: "Veracidad y desinformación",
      html: `<p>La IA puede inventar citas, cifras y referencias con total seguridad. Y la desinformación se produce también con imágenes, audio y video generados por IA.</p>
${box("warn", "Antes de compartir algo", "<ul><li>¿Puedo abrir la fuente original?</li><li>¿La fecha es reciente y el autor es confiable?</li><li>¿Confirma esto al menos otra fuente independiente?</li></ul>")}`,
    },
    {
      h: "Propiedad intelectual y derechos de autor",
      html: `<p>En Colombia, la <strong>Ley 23 de 1982</strong> protege las obras de sus autores. Usar la IA no te da derecho sobre obras de otros: cita las fuentes, no copies textos protegidos y pide permiso cuando el uso lo requiere. Lo que generes con IA también debe declararse cuando se publica o se entrega.</p>`,
    },
    {
      h: "Datos personales y menores",
      html: `<p>La <strong>Ley 1581 de 2012</strong> regula el tratamiento de datos personales en Colombia. No compartas datos de terceros sin autorización, y ten especial cuidado con los datos de menores de edad: su uso requiere protección reforzada y, cuando se trata de niños y adolescentes, la supervisión de un adulto responsable.</p>`,
    },
    {
      h: "Decisiones sobre personas",
      html: `<p>La IA puede ayudar a organizar información sobre personas, pero no debe tomar sola decisiones que afecten a alguien: contratar, evaluar, sancionar o diagnosticar. Esas decisiones requieren criterio humano, explicación y posibilidad de revisión.</p>`,
    },
    {
      h: "Protocolo de uso responsable",
      html: `${checks([
  "Verifiqué datos, citas y nombres en la fuente original.",
  "Declaré el uso de IA cuando corresponde.",
  "No incluí datos personales de terceros ni de menores sin autorización.",
  "Revisé si el resultado trata a todas las personas con equidad.",
  "Una persona responsable revisó y aprobó la decisión final.",
])}`,
    },
    {
      h: "Casos para discutir",
      html: `<p>Lee cada caso y responde las preguntas. No hay una única respuesta correcta; lo importante es justificar tu decisión.</p>
${box("tip", "Caso 1 · El ensayo perfecto", "<p>Una estudiante entrega un ensayo generado casi por completo por la IA. Nadie lo nota. ¿Hubo daño? ¿A quién? ¿Qué habría sido un uso honesto de la misma herramienta?</p>")}
${box("tip", "Caso 2 · El filtro de currículos", "<p>Una empresa usa IA para ordenar candidatos. Descubre que el sistema penaliza nombres de ciertas regiones. ¿Qué debe hacer la empresa? ¿Quién responde por la decisión?</p>")}
${box("tip", "Caso 3 · La foto que no existió", "<p>Circula en redes una imagen de un evento que nunca ocurrió, creada con IA. ¿Qué verificarías antes de compartirla? ¿Qué le dirías a alguien que ya la compartió?</p>")}`,
    },
  ],
  closing: `${checks([
    "Declaro cuándo uso IA y qué revisé yo.",
    "Verifico antes de compartir y cito mis fuentes.",
    "Protejo los datos personales, en especial los de menores.",
    "Mantengo a una persona responsable en cada decisión que afecta a otros.",
  ])}`,
};
