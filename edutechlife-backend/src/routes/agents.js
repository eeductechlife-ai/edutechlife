const { Router } = require('express');
const { chatStream } = require('../services/deepseek');
const { nicoStreamLimiter } = require('../middleware/rateLimiter');
const { buildNicoMessages } = require('../agents/nico');
const logger = require('../utils/logger');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * POST /api/agents/nico/stream
 * Body: { messages: [{ role: 'user'|'assistant', content }] }
 * Público (visitantes sin cuenta), con límite por IP. Responde en SSE igual que /api/chat/stream.
 */
router.post('/nico/stream', nicoStreamLimiter, async (req, res) => {
  const msgs = buildNicoMessages(req.body?.messages);
  if (!msgs) return res.status(400).json({ error: 'Escribe un mensaje para empezar.' });
  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'API key not configured on server' });

  let streamClosed = false;
  req.on('close', () => {
    streamClosed = true;
    res.end();
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs, temperature: 0.65, maxTokens: 500 }, (chunk) => {
      if (streamClosed) return;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    if (streamClosed) return;
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    if (streamClosed) return;
    logger.error('Error in Nico stream:', e);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Error generando respuesta' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

module.exports = router;
