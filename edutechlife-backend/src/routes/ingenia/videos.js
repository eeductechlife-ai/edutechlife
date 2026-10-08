const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { recommendVideos } = require('../../services/youtubeVideos');

const router = Router();

/**
 * GET /api/ingenia/videos?q=...
 * Top educational videos for a search (most viewed + best rated, safe search).
 * 501 when YOUTUBE_API_KEY is not configured — the client falls back to a
 * YouTube search sorted by views.
 */
router.get('/videos', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2 || q.length > 120) {
    return res.status(400).json({ error: 'Búsqueda inválida' });
  }
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return res.status(501).json({ error: 'not_configured' });

  try {
    const videos = await recommendVideos(q, apiKey);
    res.json({ videos });
  } catch (e) {
    console.error('[IngenIA videos]', e.message);
    res.status(e.status === 403 ? 503 : 502).json({ error: 'No se pudieron cargar los videos' });
  }
});

module.exports = router;
