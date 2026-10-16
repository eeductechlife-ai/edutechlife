/**
 * Arquitecto de automatización (sitio público, /automation).
 * El servidor arma el prompt y valida los datos; el navegador solo manda el formulario.
 */
const { AUTOMATION_SYSTEM_PROMPT, PLAN_AVISO, PLAN_MAX_TOKENS } = require('./prompt.generated');

const MAX_EMPRESA = 80;
const MAX_OBJETIVOS = 500;
const MAX_PROCESOS = 300;

// Datos del visitante: se recortan y se quitan < y > para que no puedan cerrar
// el delimitador <datos> ni inyectar etiquetas.
const sanitizeField = (value, max) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function buildAutomationMessages(form = {}, selectedArchitecture = null) {
  const procesos = Array.isArray(form.procesos) ? form.procesos.map(String) : [];
  const arquitectura = sanitizeField(selectedArchitecture?.nombre || 'Por definir', 80);
  const prompt = `Genera un plan de automatización con IA para la siguiente empresa.

<datos>
Empresa: ${sanitizeField(form.empresa, MAX_EMPRESA)}
Industria: ${sanitizeField(form.industria, 60)}
Número de empleados: ${Number(form.empleados) || 0}
Procesos a automatizar: ${sanitizeField(procesos.join(', '), MAX_PROCESOS)}
Objetivos: ${sanitizeField(form.objetivos, MAX_OBJETIVOS)}
Presupuesto: ${sanitizeField(form.presupuesto, 40)}
Tiempo estimado: ${sanitizeField(form.tiempo, 40)}
Arquitectura seleccionada: ${arquitectura}
</datos>

El plan debe incluir:
1. Arquitectura recomendada (basada en la seleccionada)
2. Fases de implementación con cronograma
3. Tecnologías y herramientas específicas
4. KPIs de éxito y ROI estimado como rango con su supuesto
5. Análisis de riesgos y mitigaciones
6. Marcos de referencia útiles (orientativos, sin certificación)

Formato: Título, descripción, y secciones claras con viñetas.`;

  return {
    messages: [
      { role: 'system', content: AUTOMATION_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    options: { maxTokens: PLAN_MAX_TOKENS, temperature: 0.5 },
  };
}

// Garantiza el aviso al final aunque el modelo lo omita.
function ensurePlanAviso(plan) {
  const text = String(plan ?? '').trimEnd();
  return text.includes(PLAN_AVISO) ? text : `${text}\n\n${PLAN_AVISO}`;
}

module.exports = { buildAutomationMessages, ensurePlanAviso, sanitizeField, PLAN_AVISO };
