const { Router } = require('express');
const { optionalAuth } = require('../middleware/auth');

const router = Router();

const GOOGLE_VISION_URL = 'https://vision.googleapis.com/v1/images:annotate';
const GOOGLE_API_KEY = process.env.GOOGLE_VISION_API_KEY || process.env.GOOGLE_TTS_API_KEY;

// POST /api/smartboard/scan-image
// Body: { imageBase64: "data:image/jpeg;base64,..." }
// Returns: { text: "raw OCR text", grades: [{subject, score}] }
//
// Uses Google Cloud Vision API (TEXT_DETECTION). Returns raw OCR text —
// the frontend passes it to DeepSeek to structure into subject/score pairs.
router.post('/scan-image', optionalAuth, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 requerido' });
  }
  if (!imageBase64.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Formato de imagen inválido' });
  }
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'Google API key no configurada' });
  }

  // Strip the "data:image/xxx;base64," prefix — Vision API wants raw base64.
  const b64 = imageBase64.split(',')[1] || imageBase64;

  const payload = {
    requests: [
      {
        image: { content: b64 },
        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        imageContext: { languageHints: ['es'] },
      },
    ],
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${GOOGLE_VISION_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[scan-image] Vision API error:', response.status, errText.slice(0, 300));
      if (response.status === 403) {
        return res.status(503).json({
          error: 'Vision API no habilitada. Contacta al administrador.',
        });
      }
      return res.status(response.status).json({ error: 'Error de Vision API' });
    }

    const data = await response.json();
    const text = data.responses?.[0]?.fullTextAnnotation?.text
      || data.responses?.[0]?.textAnnotations?.[0]?.description
      || '';

    res.json({ text: text.trim() });
  } catch (e) {
    console.error('[scan-image] Error:', e.message);
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
});

module.exports = router;
