const GOOGLE_VISION_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Raw text from an image via Google Cloud Vision TEXT_DETECTION.
 * Throws an Error with `.status` (503 when the API is not enabled).
 * @param {string} imageBase64 "data:image/...;base64,..." or raw base64
 */
async function extractTextWithGoogle(imageBase64) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY || process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    const err = new Error('Google API key no configurada');
    err.status = 500;
    throw err;
  }

  const content = imageBase64.split(',')[1] || imageBase64;
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`${GOOGLE_VISION_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          image: { content },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          imageContext: { languageHints: ['es'] },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[googleOcr] Vision API error:', response.status, errText.slice(0, 300));
    const err = new Error(
      response.status === 403 ? 'Vision API no habilitada. Contacta al administrador.' : 'Error de Vision API'
    );
    err.status = response.status === 403 ? 503 : response.status;
    throw err;
  }

  const data = await response.json();
  const text =
    data.responses?.[0]?.fullTextAnnotation?.text ||
    data.responses?.[0]?.textAnnotations?.[0]?.description ||
    '';
  return text.trim();
}

module.exports = { extractTextWithGoogle };
