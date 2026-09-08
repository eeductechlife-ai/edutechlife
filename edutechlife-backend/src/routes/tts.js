const { Router } = require('express');

const router = Router();
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

// El endpoint es público (asistente Nico del sitio) pero la marca es
// hispanohablante: solo se sintetizan voces en español. Restringir el idioma
// limita la superficie de abuso/costo incluso si alguien usa el endpoint
// sin sesión. Google valida el par languageCode/name y rechaza combinaciones
// inválidas (400), así que esta es una primera barrera, no la única.
const ALLOWED_LANG_PREFIX = 'es-';

function isValidSpanishVoice(voice = {}) {
  const languageCode = String(voice.languageCode || '');
  const name = String(voice.name || '');
  if (!languageCode.startsWith(ALLOWED_LANG_PREFIX)) return false;
  if (name && !name.startsWith(languageCode)) return false;
  return true;
}

function sanitizeAudioConfig(audioConfig = {}) {
  const pitch = Number(audioConfig.pitch);
  const speakingRate = Number(audioConfig.speakingRate);
  return {
    audioEncoding: 'MP3',
    pitch: Number.isFinite(pitch) ? pitch : 0,
    speakingRate: Number.isFinite(speakingRate) ? speakingRate : 1.0,
  };
}

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

    if (!text.trim()) {
      return res.status(400).json({ error: 'input.text es requerido' });
    }

    // Barrera de idioma: solo voces en español (marca hispanohablante).
    if (!isValidSpanishVoice(req.body.voice)) {
      return res.status(400).json({ error: 'Solo se permiten voces en español (es-*)' });
    }

    // Reconstruir el payload con los campos que Google acepta; evita reenviar
    // claves desconocidas o parámetros no validados del cuerpo original.
    const buildGoogleBody = (segmentText) => ({
      input: { text: segmentText },
      voice: {
        languageCode: req.body.voice.languageCode,
        name: req.body.voice.name,
      },
      audioConfig: sanitizeAudioConfig(req.body.audioConfig),
    });

    // Google TTS has a 5000 character limit per request.
    // If text is longer, split into chunks and concatenate audio.
    const MAX_CHARS = 5000;
    if (text.length <= MAX_CHARS) {
      const response = await fetch(GOOGLE_TTS_URL + '?key=' + GOOGLE_TTS_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildGoogleBody(text))
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
      const response = await fetch(GOOGLE_TTS_URL + '?key=' + GOOGLE_TTS_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildGoogleBody(chunk))
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
