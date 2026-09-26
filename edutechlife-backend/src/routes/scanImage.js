const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { visionLimiter } = require('../middleware/rateLimiter');
const { extractTextWithGoogle } = require('../services/googleOcr');

const router = Router();

// POST /api/smartboard/scan-image
// Body: { imageBase64: "data:image/jpeg;base64,..." }
// Returns: { text: "raw OCR text" }
//
// Uses Google Cloud Vision API (TEXT_DETECTION). Returns raw OCR text —
// the frontend passes it to DeepSeek to structure into subject/score pairs.
router.post('/scan-image', requireAuth, visionLimiter, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 requerido' });
  }
  if (!imageBase64.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Formato de imagen inválido' });
  }

  try {
    const text = await extractTextWithGoogle(imageBase64);
    res.json({ text });
  } catch (e) {
    console.error('[scan-image] Error:', e.message);
    if (e.status && e.status !== 500) return res.status(e.status).json({ error: e.message });
    res.status(500).json({ error: e.message === 'Google API key no configurada' ? e.message : 'Error procesando la imagen' });
  }
});

module.exports = router;
