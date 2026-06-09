const { Router } = require('express');

const router = Router();
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;

router.post('/', async (req, res) => {
  if (!GOOGLE_TTS_API_KEY) {
    return res.status(500).json({ error: 'TTS API key not configured on server' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
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
  } catch (error) {
    console.error('[TTS] Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
