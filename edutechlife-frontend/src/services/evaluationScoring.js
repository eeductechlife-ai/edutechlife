export const scoreModule1 = (responses) => {
  const ej1Length = responses.ej1?.length || 0;
  const ej2Length = responses.ej2?.length || 0;
  const ej3Length = responses.ej3?.length || 0;

  let nota_ej1 = 0;
  let feedback_ej1 = '';
  try {
    const parsed = JSON.parse(responses.ej1);
    const hasRol = parsed.rol && parsed.rol.trim().length > 0;
    const hasContexto = parsed.contexto && parsed.contexto.trim().length > 0;
    const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
    const filledCount = (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);

    if (filledCount === 0) { nota_ej1 = 0; feedback_ej1 = 'No completaste ninguna categoría. Este ejercicio requiere identificar y arrastrar elementos a las 3 columnas: Rol, Contexto y Tarea.'; }
    else if (filledCount === 1) { nota_ej1 = 33; feedback_ej1 = 'Completaste 1 de 3 categorías. Buen inicio. Completa las otras 2 columnas.'; }
    else if (filledCount === 2) { nota_ej1 = 70; feedback_ej1 = 'Muy bien! Completaste 2 de 3 categorías. Revisa qué columna quedó vacía.'; }
    else { nota_ej1 = 100; feedback_ej1 = 'Excelente! Completaste las 3 categorías. Dominas la estructura Rol + Contexto + Tarea.'; }
  } catch { nota_ej1 = 0; feedback_ej1 = 'No se detectó tu respuesta. Asegúrate de arrastrar al menos un elemento a cada columna.'; }

  let nota_ej2 = 50;
  let feedback_ej2 = '';
  if (ej2Length < 20) { nota_ej2 = 50; feedback_ej2 = 'Respuesta corta. Intenta incluir Rol, Contexto, Tarea y Formato.'; }
  else if (ej2Length < 100) { nota_ej2 = 60; feedback_ej2 = 'Tu respuesta mejoró el prompt original. Organiza en secciones claras.'; }
  else if (ej2Length < 250) { nota_ej2 = 80; feedback_ej2 = 'Buen trabajo! Prompt optimizado con estructura y detalles.'; }
  else { nota_ej2 = 90; feedback_ej2 = 'Excelente prompt optimizado! Estructura completa y coherente.'; }

  let nota_ej3 = 50;
  let feedback_ej3 = '';
  if (ej3Length < 30) { nota_ej3 = 50; feedback_ej3 = 'Buen primer paso. Un prompt efectivo necesita Rol, Contexto, Tarea y Formato.'; }
  else if (ej3Length < 150) { nota_ej3 = 60; feedback_ej3 = 'Tu prompt aborda el tema. Incluye un Rol claro y Tarea específica.'; }
  else if (ej3Length < 350) { nota_ej3 = 80; feedback_ej3 = 'Buen prompt con estructura. Haz cada sección más específica al caso.'; }
  else { nota_ej3 = 90; feedback_ej3 = 'Prompt muy completo y coherente! Excelente entendimiento.'; }

  const notaGlobal = Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;
  return { nota_ej1, nota_ej2, nota_ej3, notaGlobal, feedback_ej1, feedback_ej2, feedback_ej3 };
};

export const scoreModule2 = (responses) => {
  const l1 = responses.ej1?.length || 0;
  const l2 = responses.ej2?.length || 0;
  const l3 = responses.ej3?.length || 0;
  const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
  const n2 = l2 < 30 ? 40 : l2 < 100 ? 60 : l2 < 250 ? 80 : 90;
  const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
  return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10, feedback_ej1: 'Has analizado el caso. Para mejorar, considera criterios como impacto, viabilidad y automatización.', feedback_ej2: 'Tu configuración del GPT es un buen inicio. Añade instrucciones detalladas, tono y capacidades específicas.', feedback_ej3: 'Buen schema de Function Calling. Asegúrate de incluir todos los parámetros necesarios con tipos y descripciones.' };
};

export const scoreModule3 = (responses) => {
  const [l1, l2, l3, l4] = [responses.ej1?.length || 0, responses.ej2?.length || 0, responses.ej3?.length || 0, responses.ej4?.length || 0];
  const n1 = l1 < 20 ? 40 : l1 < 80 ? 60 : l1 < 200 ? 80 : 90;
  const n2 = l2 < 20 ? 40 : l2 < 80 ? 60 : l2 < 200 ? 80 : 90;
  const n3 = l3 < 30 ? 40 : l3 < 100 ? 60 : l3 < 250 ? 80 : 90;
  const n4 = l4 < 50 ? 40 : l4 < 150 ? 60 : l4 < 400 ? 80 : 90;
  return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, nota_ej4: n4, notaGlobal: Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10, feedback_ej1: 'Buena pregunta de investigación. Para mejorarla, sé más específico y añade sub-preguntas.', feedback_ej2: 'Buen análisis de fuentes. Asegúrate de justificar por qué cada fuente es o no relevante.', feedback_ej3: 'Buena clasificación. Explica el razonamiento detrás de cada veredicto.', feedback_ej4: 'Buen informe. Añade más detalles y citas específicas de las fuentes.' };
};

export const scoreModule4 = (responses) => {
  let docCount = 0;
  let synthesisFilled = 0;
  let scriptFilled = 0;
  let quizCorrect = 0;
  try {
    const ej1 = JSON.parse(responses.ej1 || '{}');
    docCount = ej1?.documents?.length || 0;
  } catch {}
  try {
    const ej2 = JSON.parse(responses.ej2 || '{}');
    synthesisFilled = ej2?.synthesis?.trim().length > 0 ? 1 : 0;
  } catch {}
  try {
    const ej3 = JSON.parse(responses.ej3 || '{}');
    const filled = ['hook', 'evidencia', 'transicion', 'cierre'].filter(k => ej3[k]?.trim().length > 0).length;
    quizCorrect = (ej3?.quiz?.[0] === true ? 1 : 0) + (ej3?.quiz?.[1] === true ? 1 : 0);
    scriptFilled = filled + quizCorrect;
  } catch {}
  const n1 = docCount === 0 ? 30 : docCount < 3 ? 60 : docCount >= 4 ? 100 : 80;
  const n2 = synthesisFilled ? 90 : 50;
  const n3 = scriptFilled < 2 ? 40 : scriptFilled < 4 ? 70 : scriptFilled >= 6 ? 100 : 85;
  return {
    nota_ej1: n1, nota_ej2: n2, nota_ej3: n3,
    notaGlobal: Math.round(((n1 + n2 + n3) / 3) * 10) / 10,
    feedback_ej1: docCount === 0 ? 'No seleccionaste documentos. Selecciona al menos 2 documentos para empezar.' : docCount < 4 ? 'Buena selección. Intenta seleccionar 4 documentos para tener más perspectivas.' : 'Excelente selección de 4 documentos con categorías y rankings.',
    feedback_ej2: synthesisFilled ? 'Buena síntesis. Asegúrate de que tu tabla comparativa esté completa.' : 'Completa la tabla comparativa y escribe una síntesis que integre todos los documentos.',
    feedback_ej3: scriptFilled < 4 ? 'Completa más secciones del guión y responde las preguntas del MCQ.' : 'Buen guión. Asegúrate de que todas las secciones estén bien desarrolladas.'
  };
};

export const scoreModule5 = (responses) => {
  let n1 = 0;
  let feedback_ej1 = '';
  try {
    const parsed = JSON.parse(responses.ej1 || '{}');
    const biases = parsed.biases || [];
    const biasCount = biases.length;
    const hasJustifications = biases.every((b) => b.justification?.trim().length > 20);
    const hasPipelines = biases.every((b) => b.pipeline);
    const hasSeverity = biases.some((b) => b.severity === 1) && biases.some((b) => b.severity === 2);

    if (biasCount === 0) { n1 = 0; feedback_ej1 = 'No se identificaron sesgos. Revisa el caso y busca patrones de discriminación o sesgo algorítmico.'; }
    else if (biasCount === 1) { n1 = hasJustifications ? 60 : 40; feedback_ej1 = 'Identificaste al menos un sesgo. Para mejorar, justifica con evidencia del caso y selecciona la etapa del pipeline.'; }
    else if (biasCount >= 2 && !hasSeverity) { n1 = hasJustifications && hasPipelines ? 75 : 60; feedback_ej1 = 'Buena identificación de sesgos. Completa la justificación, pipeline y ranking de severidad para cada uno.'; }
    else if (biasCount >= 2 && hasSeverity) { n1 = hasJustifications && hasPipelines ? 90 : 75; feedback_ej1 = 'Excelente análisis forense. Has identificado, justificado y priorizado los sesgos correctamente.'; }
    else { n1 = 85; feedback_ej1 = 'Buen trabajo identificando sesgos. Revisa si hay más sesgos en el caso.'; }
  } catch {
    n1 = 0;
    feedback_ej1 = 'No se pudo analizar tu respuesta. Asegúrate de completar el análisis forense.';
  }

  let n2 = 0;
  let feedback_ej2 = '';
  try {
    const parsed = JSON.parse(responses.ej2 || '{}');
    const impact = parsed.impact || {};
    const rootCauses = parsed.rootCauses || {};
    const severityMatrix = parsed.severityMatrix || {};

    const impactFields = ['candidates', 'company', 'society'].filter((k) => impact[k]?.trim().length > 20).length;
    const rootCauseCount = Object.values(rootCauses).filter((c) => c?.justification?.trim().length > 20).length;
    const matrixFilled = Object.keys(severityMatrix).length >= 6;

    if (impactFields === 0) { n2 = 0; feedback_ej2 = 'No se evaluó el impacto. Describe cómo el sesgo afecta a cada grupo.'; }
    else if (impactFields < 3 || rootCauseCount === 0) { n2 = 50; feedback_ej2 = 'Evalúa el impacto en los 3 grupos y al menos 2 causas raíz para un mejor análisis.'; }
    else if (rootCauseCount >= 2 && !matrixFilled) { n2 = 70; feedback_ej2 = 'Buen análisis de impacto y causas. Completa la matriz de severidad para un análisis más profundo.'; }
    else if (rootCauseCount >= 2 && matrixFilled) { n2 = 90; feedback_ej2 = 'Excelente evaluación de impacto con causas raíz identificadas y matriz de severidad completa.'; }
    else { n2 = 75; feedback_ej2 = 'Buen análisis. Revisa si hay más causas raíz que puedas identificar.'; }
  } catch {
    n2 = 0;
    feedback_ej2 = 'No se pudo analizar tu respuesta. Completa la evaluación de impacto.';
  }

  let n3 = 0;
  let feedback_ej3 = '';
  try {
    const parsed = JSON.parse(responses.ej3 || '{}');
    const principles = parsed.principles || [];
    const actions = parsed.actions || [];

    const hasPrinciples = principles.length > 0;
    const hasRelevance = principles.every((p) => p.relevance);
    const actionsWithMeasures = actions.filter((a) => a.measure?.trim().length > 20).length;
    const actionsWithTimeline = actions.filter((a) => a.timeline).length;

    if (!hasPrinciples && actionsWithMeasures === 0) { n3 = 0; feedback_ej3 = 'No se propusieron principios ni acciones. Diseña un protocolo ético completo.'; }
    else if (hasPrinciples && !hasRelevance) { n3 = 50; feedback_ej3 = 'Buenos principios. Indica por qué cada principio es relevante para este caso.'; }
    else if (hasRelevance && actionsWithMeasures > 0 && actionsWithTimeline < actionsWithMeasures) { n3 = 70; feedback_ej3 = 'Buen plan de remediación. Asigna un plazo a cada acción.'; }
    else if (hasRelevance && actionsWithMeasures > 0 && actionsWithTimeline >= actionsWithMeasures) { n3 = 90; feedback_ej3 = 'Excelente protocolo ético con principios sólidos, acciones concretas y plazos definidos.'; }
    else { n3 = 75; feedback_ej3 = 'Buen protocolo. Revisa si todas las acciones tienen medida y plazo.'; }
  } catch {
    n3 = 0;
    feedback_ej3 = 'No se pudo analizar tu respuesta. Completa el diseño del protocolo ético.';
  }

  const notaGlobal = Math.round(((n1 + n2 + n3) / 3) * 10) / 10;
  return { nota_ej1: n1, nota_ej2: n2, nota_ej3: n3, notaGlobal, feedback_ej1, feedback_ej2, feedback_ej3 };
};

const SCORERS = { 1: scoreModule1, 2: scoreModule2, 3: scoreModule3, 4: scoreModule4, 5: scoreModule5 };

export const scoreEvaluation = (moduleId, responses) => {
  const scorer = SCORERS[moduleId] || scoreModule1;
  return scorer(responses);
};


