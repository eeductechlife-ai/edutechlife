const { Router } = require('express');
const { chat } = require('../../services/deepseek');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Niveles de lenguaje por edad
const AGE_LEVELS = {
  '6-8':   { tone: 'muy sencillo, con palabras simples y frases cortas', depth: 'explicaciones básicas con ejemplos de la vida diaria' },
  '9-11':  { tone: 'sencillo y claro, con vocabulario apropiado', depth: 'explicaciones claras con ejemplos concretos' },
  '12-14': { tone: 'académico pero accesible', depth: 'explicaciones con algo de detalle y relaciones entre conceptos' },
  '15-17': { tone: 'académico y preciso', depth: 'explicaciones completas con matices y aplicaciones' },
};

function buildSystemPrompt(subject, ageKey) {
  const level = AGE_LEVELS[ageKey] || AGE_LEVELS['12-14'];
  return `Eres un profesor experto${subject ? ` de ${subject}` : ''} que ayuda a estudiantes de ${ageKey || '12-14'} años a entender material de estudio.

Analiza el material que te comparte el estudiante (puede ser una foto, documento o texto) y explícalo como lo haría un buen profesor: claro, ordenado y con calidad pedagógica.

Adapta el lenguaje: ${level.tone}. ${level.depth}.

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura EXACTA:
{
  "title": "Título claro y específico del tema (máximo 60 caracteres)",
  "overview": "Resumen general del tema en 2-3 frases, como lo introduciría un profesor en clase",
  "keyConcepts": [
    { "term": "Concepto clave", "explanation": "Explicación clara adaptada a la edad" }
  ],
  "learningPoints": ["Idea importante que el estudiante debe recordar"],
  "example": "Un ejemplo concreto o analogía apropiado para la edad",
  "difficulty": "básico"
}

REGLAS:
- "keyConcepts": entre 3 y 6 conceptos, los MÁS importantes del material
- "learningPoints": entre 3 y 5 ideas clave
- "difficulty": exactamente "básico", "intermedio" o "avanzado"
- Contenido pedagógicamente correcto, sin inventar datos
- Si el material es una imagen con ejercicios, identifica qué tema evalúa y explícalo
- Sin markdown, sin asteriscos dentro de los textos
- Todo en español`;
}

/**
 * POST /scan
 * Body: { imageBase64?, text?, subject?, ageKey? }
 * - imageBase64: "data:image/jpeg;base64,..." — envía la imagen directamente a DeepSeek vision
 * - text: texto ya extraído (PDF, DOCX) — usa solo texto
 * Returns: structured summary JSON
 */
router.post('/scan', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  const { imageBase64, text, subject = '', ageKey = '12-14' } = req.body;

  if (!imageBase64 && (!text || text.trim().length < 10)) {
    return res.status(400).json({ error: 'Se requiere imageBase64 o text con contenido' });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key de IA no configurada' });
  }

  try {
    const systemPrompt = buildSystemPrompt(subject, ageKey);
    let messages;

    if (imageBase64) {
      // Validate image format
      if (!imageBase64.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Formato de imagen inválido' });
      }
      // Limit image size to 4MB
      const b64data = imageBase64.split(',')[1] || '';
      if (b64data.length > 4 * 1024 * 1024 * 4 / 3) {
        return res.status(400).json({ error: 'La imagen es demasiado grande (máx 4MB)' });
      }

      // Multimodal message: image + text prompt
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza esta imagen${subject ? ` de ${subject}` : ''}. Identifica de qué tema trata y explícalo como un profesor. Genera el resumen educativo en JSON.`,
            },
            {
              type: 'image_url',
              image_url: { url: imageBase64 },
            },
          ],
        },
      ];
    } else {
      // Text-only message (PDF, DOCX content)
      const material = text.trim().slice(0, 6000);
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Material del estudiante${subject ? ` (materia: ${subject})` : ''}:\n"""\n${material}\n"""\n\nGenera el resumen educativo en JSON.`,
        },
      ];
    }

    const response = await chat(DEEPSEEK_API_KEY, {
      messages,
      isJson: true,
      temperature: 0.5,
      maxTokens: 2000,
      model: process.env.DEEPSEEK_VISION_MODEL || 'deepseek-chat',
    });

    const raw = response?.choices?.[0]?.message?.content || '';
    let result;
    try {
      result = typeof raw === 'object' ? raw : JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error('La IA no devolvió JSON válido');
    }

    // Normalize
    res.json({
      title: result.title || 'Resumen del material',
      overview: result.overview || '',
      keyConcepts: Array.isArray(result.keyConcepts)
        ? result.keyConcepts.filter(c => c?.term || c?.explanation).map(c => ({
            term: c.term || 'Concepto',
            explanation: c.explanation || '',
          }))
        : [],
      learningPoints: Array.isArray(result.learningPoints)
        ? result.learningPoints.filter(Boolean)
        : [],
      example: result.example || '',
      difficulty: ['básico', 'intermedio', 'avanzado'].includes(result.difficulty)
        ? result.difficulty
        : 'intermedio',
    });
  } catch (e) {
    console.error('[scan] Error:', e.message);
    res.status(500).json({ error: e.message || 'Error procesando el material' });
  }
});

module.exports = router;
