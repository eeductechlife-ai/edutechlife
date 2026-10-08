const { Router } = require('express');
const { chat } = require('../../services/deepseek');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_VISION_API_KEY || process.env.GOOGLE_TTS_API_KEY;
const GOOGLE_VISION_URL = 'https://vision.googleapis.com/v1/images:annotate';

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

function normalizeResult(result) {
  return {
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
  };
}

function parseJsonResponse(raw) {
  if (typeof raw === 'object' && raw !== null) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('La IA no devolvió JSON válido');
  }
}

// Fallback: Google Vision API OCR → DeepSeek text analysis
async function analyzeImageViaOCR(imageBase64, systemPrompt, subject) {
  if (!GOOGLE_API_KEY) {
    throw new Error('La imagen no pudo procesarse: configura Google Vision API o un modelo de IA con visión.');
  }

  const fetch = (await import('node-fetch')).default;
  const b64 = imageBase64.split(',')[1] || imageBase64;

  const visionRes = await fetch(`${GOOGLE_VISION_URL}?key=${GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { content: b64 },
        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        imageContext: { languageHints: ['es'] },
      }],
    }),
  });

  if (!visionRes.ok) throw new Error('Error al leer el texto de la imagen');

  const visionData = await visionRes.json();
  const extractedText = visionData.responses?.[0]?.fullTextAnnotation?.text
    || visionData.responses?.[0]?.textAnnotations?.[0]?.description
    || '';

  if (!extractedText || extractedText.trim().length < 10) {
    throw new Error('No se pudo extraer texto de la imagen. Asegúrate de que la imagen sea nítida y tenga texto legible.');
  }

  const material = extractedText.trim().slice(0, 6000);
  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Material del estudiante${subject ? ` (materia: ${subject})` : ''} (texto extraído de imagen):\n"""\n${material}\n"""\n\nGenera el resumen educativo en JSON.`,
    },
  ];

  const response = await chat(DEEPSEEK_API_KEY, {
    messages,
    isJson: true,
    temperature: 0.5,
    maxTokens: 2000,
  });

  return parseJsonResponse(response?.choices?.[0]?.message?.content || '');
}

// Vision via DeepSeek multimodal
async function analyzeImageViaVision(imageBase64, systemPrompt, subject) {
  const messages = [
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

  const response = await chat(DEEPSEEK_API_KEY, {
    messages,
    isJson: true,
    temperature: 0.5,
    maxTokens: 2000,
    model: process.env.DEEPSEEK_VISION_MODEL,
  });

  return parseJsonResponse(response?.choices?.[0]?.message?.content || '');
}

/**
 * POST /scan
 * Body: { imageBase64?, text?, subject?, ageKey? }
 * - imageBase64: "data:image/jpeg;base64,..." — intenta DeepSeek vision, fallback a Google Vision + texto
 * - text: texto ya extraído (PDF, DOCX) — usa solo texto
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
    let result;

    if (imageBase64) {
      if (!imageBase64.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Formato de imagen inválido' });
      }
      const b64data = imageBase64.split(',')[1] || '';
      if (b64data.length > 5_500_000) {
        return res.status(400).json({ error: 'La imagen es demasiado grande (máx ~4MB)' });
      }

      // Intenta visión nativa con DeepSeek; si falla (modelo sin visión), usa OCR fallback
      try {
        result = await analyzeImageViaVision(imageBase64, systemPrompt, subject);
        console.log('[scan] vision: ok');
      } catch (visionErr) {
        const msg = visionErr.message || '';
        const isVisionUnsupported =
          msg.includes('does not support') ||
          msg.includes('vision') ||
          msg.includes('image') ||
          msg.includes('multimodal') ||
          visionErr.status === 400;

        if (isVisionUnsupported) {
          console.log('[scan] DeepSeek vision not supported, falling back to Google Vision OCR');
          result = await analyzeImageViaOCR(imageBase64, systemPrompt, subject);
        } else {
          throw visionErr;
        }
      }
    } else {
      // PDF, DOCX, TXT — texto ya extraído en el cliente
      const material = text.trim().slice(0, 6000);
      const messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Material del estudiante${subject ? ` (materia: ${subject})` : ''}:\n"""\n${material}\n"""\n\nGenera el resumen educativo en JSON.`,
        },
      ];

      const response = await chat(DEEPSEEK_API_KEY, {
        messages,
        isJson: true,
        temperature: 0.5,
        maxTokens: 2000,
      });

      result = parseJsonResponse(response?.choices?.[0]?.message?.content || '');
    }

    res.json(normalizeResult(result));
  } catch (e) {
    console.error('[scan] Error:', e.message);
    res.status(500).json({ error: e.message || 'Error procesando el material' });
  }
});

module.exports = router;
