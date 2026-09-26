const { Router } = require('express');
const { chat } = require('../../services/deepseek');
const { extractTextWithGoogle } = require('../../services/googleOcr');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');
const { visionLimiter } = require('../../middleware/rateLimiter');

const router = Router();

const MAX_B64_CHARS = 5_500_000; // ~4 MB decoded
const MAX_TEXT_CHARS = 1400;

const TRANSCRIBE_PROMPT = `Eres un asistente que transcribe tareas escolares desde una foto.
Transcribe FIELMENTE el enunciado de la tarea o ejercicio que aparece en la imagen, en español.
- Escribe las fórmulas y operaciones en texto plano (ej: 3/4 + 1/2, x^2, raíz(9)).
- Si hay figuras, tablas o dibujos importantes, descríbelos en una línea entre corchetes, ej: [Figura: triángulo rectángulo con catetos 3 y 4].
- Conserva la numeración de los ejercicios.
- NO resuelvas nada, NO expliques, NO agregues comentarios.
- Si la imagen no contiene una tarea o texto legible, responde exactamente: SIN_TEXTO`;

async function transcribeWithVision(imageBase64, model) {
  const response = await chat(process.env.DEEPSEEK_API_KEY, {
    model,
    temperature: 0.1,
    maxTokens: 900,
    messages: [
      { role: 'system', content: TRANSCRIBE_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Transcribe la tarea de esta foto.' },
          { type: 'image_url', image_url: { url: imageBase64 } },
        ],
      },
    ],
  });
  const text = (response?.choices?.[0]?.message?.content || '').trim();
  return text === 'SIN_TEXTO' ? '' : text;
}

/**
 * POST /dani/photo
 * Body: { imageBase64: "data:image/jpeg;base64,..." }
 * Returns: { text, source: "vision" | "ocr" }
 *
 * Reads the homework statement from a photo so the student can review it
 * before sending it to Dani. Uses DeepSeek vision when DEEPSEEK_VISION_MODEL
 * is set (better with formulas and diagrams) and falls back to Google OCR.
 */
router.post('/dani/photo', requireAuth, requireVerifiedParentalConsent, visionLimiter, async (req, res) => {
  const { imageBase64 } = req.body || {};
  if (typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Formato de imagen inválido' });
  }
  if ((imageBase64.split(',')[1] || '').length > MAX_B64_CHARS) {
    return res.status(400).json({ error: 'La foto es demasiado grande (máx ~4MB)' });
  }

  const visionModel = process.env.DEEPSEEK_VISION_MODEL;
  if (visionModel && process.env.DEEPSEEK_API_KEY) {
    try {
      const text = await transcribeWithVision(imageBase64, visionModel);
      if (text) return res.json({ text: text.slice(0, MAX_TEXT_CHARS), source: 'vision' });
    } catch (e) {
      console.warn('[dani/photo] vision failed, falling back to OCR:', e.status || '', e.message);
    }
  }

  try {
    const text = await extractTextWithGoogle(imageBase64);
    res.json({ text: text.slice(0, MAX_TEXT_CHARS), source: 'ocr' });
  } catch (e) {
    console.error('[dani/photo] OCR failed:', e.message);
    res.status(e.status && e.status !== 500 ? e.status : 500).json({ error: 'No pude leer la foto. Intenta de nuevo.' });
  }
});

module.exports = router;
