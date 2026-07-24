/**
 * Crisis Detection Service
 * Detects indicators of suicidal ideation or mental health crisis
 * Language: Spanish + English
 */

const CRISIS_KEYWORDS = {
  // Spanish keywords
  es: {
    high_risk: [
      'suicidio',
      'suicidarme',
      'me quiero matar',
      'quiero matarme',
      'me voy a matar',
      'mejor muerto',
      'muerte',
      'ya no aguanto',
      'no puedo más',
      'acabar con todo',
      'acabar con mi vida',
      'terminar con mi vida',
      'despedida final',
      'último adiós',
      'ácido',
      'veneno',
      'cuerda',
      'medicina',
      'pastillas',
      'auto lesión',
      'autolesión',
      'me corto',
      'cortarme',
      'me hago daño',
      'hacerme daño'
    ],
    medium_risk: [
      'deprimido',
      'depresión',
      'ansioso',
      'ansiedad',
      'desesperado',
      'desesperación',
      'solo',
      'soledad',
      'inútil',
      'fracaso',
      'no sirvo',
      'nadie me ama',
      'nadie me quiere',
      'mejor sin mí',
      'soy un problema',
      'todos estarían mejor sin mí',
      'desaparecerme'
    ]
  },
  // English keywords
  en: {
    high_risk: [
      'suicide',
      'kill myself',
      'take my own life',
      'end it all',
      'don\'t want to live',
      'want to die',
      'poison',
      'rope',
      'pills',
      'overdose',
      'self harm',
      'self-harm',
      'cut myself',
      'hurt myself',
      'goodbye',
      'final goodbye',
      'farewell',
      'last goodbye'
    ],
    medium_risk: [
      'depressed',
      'depression',
      'anxious',
      'anxiety',
      'desperate',
      'despair',
      'lonely',
      'loneliness',
      'worthless',
      'failure',
      'useless',
      'nobody loves me',
      'nobody cares',
      'everyone would be better without me',
      'better off dead'
    ]
  }
};

/**
 * Detects crisis indicators in text
 * @param {string} text - Message to analyze
 * @param {string} language - Language code ('es' or 'en')
 * @returns {Object} {level: 'none'|'medium'|'high', keywords: Array}
 */
function detectCrisis(text, language = 'es') {
  if (!text) return { level: 'none', keywords: [] };

  const normalized = text.toLowerCase().trim();
  const langKeywords = CRISIS_KEYWORDS[language] || CRISIS_KEYWORDS.es;
  const foundKeywords = [];

  // Check high-risk keywords
  for (const keyword of langKeywords.high_risk) {
    if (normalized.includes(keyword)) {
      foundKeywords.push({ keyword, severity: 'high' });
    }
  }

  // Check medium-risk keywords (only if no high-risk found)
  if (foundKeywords.length === 0) {
    for (const keyword of langKeywords.medium_risk) {
      if (normalized.includes(keyword)) {
        foundKeywords.push({ keyword, severity: 'medium' });
      }
    }
  }

  // Determine crisis level
  const hasCritical = foundKeywords.some(k => k.severity === 'high');
  const hasMedium = foundKeywords.some(k => k.severity === 'medium');

  let level = 'none';
  if (hasCritical) level = 'high';
  else if (hasMedium && foundKeywords.length >= 2) level = 'medium';

  return {
    level,
    keywords: foundKeywords,
    timestamp: new Date().toISOString()
  };
}

/**
 * Formats crisis alert message for email
 */
function formatCrisisAlertEmail(studentName, studentAge, detectedContent, parentEmail) {
  const timestamp = new Date().toLocaleString('es-CO');

  return {
    subject: `⚠️ ALERTA: Apoyo emocional requerido para ${studentName}`,
    html: `
      <div style="font-family: Montserrat, sans-serif; max-width: 600px;">
        <div style="background: linear-gradient(to right, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">⚠️ ALERTA DE SEGURIDAD EMOCIONAL</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">SmartBoard - ${timestamp}</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #004B63; font-size: 18px; margin-top: 0;">Acción Requerida</h2>
          <p style="color: #374151; line-height: 1.6;">
            Hemos detectado indicadores de posible angustia emocional o ideación suicida en
            <strong>${studentName} (${studentAge} años)</strong> durante una sesión en SmartBoard.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            <strong>Este mensaje requiere tu atención inmediata.</strong>
          </p>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin-top: 0;">Indicadores Detectados</h3>
          <p style="color: #7c2d12; margin: 5px 0;">
            <strong>Contenido:</strong> "${detectedContent.substring(0, 150)}..."
          </p>
        </div>

        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">Recursos de Crisis - INMEDIATO</h3>
          <p style="color: #1e3a8a; margin: 10px 0; font-weight: bold;">
            🆘 Si hay riesgo inmediato de autolesión: LLAMA A EMERGENCIAS (123 Colombia)
          </p>
          <ul style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
            <li><strong>Línea PAS (Colombia):</strong> +57 (2) 5149100 - Servicio de crisis 24/7</li>
            <li><strong>Teléfono Amigo (Latin América):</strong> Disponible en tu país</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741 (USA/Canada)</li>
          </ul>
        </div>

        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: #166534; margin-top: 0;">Pasos Recomendados</h3>
          <ol style="color: #166534; margin: 10px 0; padding-left: 20px;">
            <li>Contacta a ${studentName} directamente y pregunta cómo se siente</li>
            <li>Considera una evaluación profesional de salud mental</li>
            <li>Mantén monitoreado el acceso a sustancias y métodos de daño</li>
            <li>Contacta a un profesional de salud mental certificado</li>
            <li>Responde este email si necesitas apoyo de EdutechLife</li>
          </ol>
        </div>

        <div style="color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
          <p style="margin: 5px 0;">
            Este es un sistema automatizado de detección de crisis basado en palabras clave.
            Si crees que es un falso positivo, contáctanos.
          </p>
          <p style="margin: 5px 0;">
            <strong>Privacidad:</strong> Este correo contiene información sensible del menor.
            Mantén confidencial.
          </p>
        </div>
      </div>
    `,
    text: `
ALERTA DE SEGURIDAD EMOCIONAL - SmartBoard

Acción Requerida: Hemos detectado indicadores de posible angustia emocional
o ideación suicida en ${studentName} (${studentAge} años).

RECURSOS DE CRISIS INMEDIATO:
- Emergencias: 123 (Colombia)
- Línea PAS: +57 (2) 5149100
- Teléfono Amigo: Disponible en tu país

Pasos recomendados:
1. Contacta a ${studentName} directamente
2. Considera evaluación profesional
3. Mantén monitoreado el acceso a métodos de daño
4. Contacta a profesional de salud mental
5. Responde este email si necesitas apoyo

Contenido detectado: "${detectedContent.substring(0, 100)}..."
    `
  };
}

module.exports = {
  detectCrisis,
  formatCrisisAlertEmail,
  CRISIS_KEYWORDS
};
