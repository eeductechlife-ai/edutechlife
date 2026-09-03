const { Router } = require('express');

const router = Router();
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

/**
 * @swagger
 * /api/tts:
 *   post:
 *     summary: Convertir texto a voz usando Google TTS
 *     tags: [TTS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *               voice:
 *                 type: object
 *                 properties:
 *                   languageCode:
 *                     type: string
 *                     example: es-US
 *                   name:
 *                     type: string
 *                     example: es-US-Neural2-A
 *               audioConfig:
 *                 type: object
 *                 properties:
 *                   audioEncoding:
 *                     type: string
 *                     example: MP3
 *     responses:
 *       200:
 *         description: Audio generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audioContent:
 *                   type: string
 *                   format: byte
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  if (!GOOGLE_TTS_API_KEY) {
    return res.status(500).json({ error: 'TTS API key not configured on server' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const text = req.body.input?.text || '';

    // Google TTS has a 5000 character limit per request.
    // If text is longer, split into chunks and concatenate audio.
    const MAX_CHARS = 5000;
    if (text.length <= MAX_CHARS) {
      const response = await fetch(GOOGLE_TTS_URL + '?key=' + GOOGLE_TTS_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('[TTS] Error:', err);
        return res.status(response.status).json({ error: 'TTS upstream error' });
      }

      const data = await response.json();
      res.json(data);
      return;
    }

    // Text is too long — split by sentences and combine audio
    const sentences = text.match(/[^.!?]*[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > MAX_CHARS) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    // Fetch audio for each chunk and concatenate
    const audioBuffers = [];
    for (const chunk of chunks) {
      const chunkBody = {
        ...req.body,
        input: { text: chunk }
      };
      const response = await fetch(GOOGLE_TTS_URL + '?key=' + GOOGLE_TTS_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunkBody)
      });

      if (!response.ok) {
        console.error(`[TTS] Error on chunk "${chunk.slice(0, 50)}..."`, response.status);
        continue;
      }

      const data = await response.json();
      if (data.audioContent) {
        audioBuffers.push(data.audioContent);
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(500).json({ error: 'Failed to generate audio' });
    }

    // Concatenate base64 audio buffers
    const concatenated = audioBuffers.join('');
    res.json({ audioContent: concatenated });
  } catch (error) {
    console.error('[TTS] Proxy error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
