const { Router } = require('express');
const { chat, chatStream, validateMessages } = require('../services/deepseek');
const { chatMessageLimiter } = require('../middleware/rateLimiter');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function checkApiKey(req, res) {
  if (!DEEPSEEK_API_KEY) {
    res.status(500).json({ error: 'API key not configured on server' });
    return false;
  }
  return true;
}

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Enviar mensaje y obtener respuesta de IA
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               prompt:
 *                 type: string
 *               systemPrompt:
 *                 type: string
 *               isJson:
 *                 type: boolean
 *               temperature:
 *                 type: number
 *               maxTokens:
 *                 type: integer
 *               model:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta generada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', chatMessageLimiter, async (req, res) => {
  const { messages, prompt, systemPrompt, isJson, temperature, maxTokens, model } = req.body;

  let msgs = messages;
  if (!msgs && prompt) {
    msgs = [
      { role: 'system', content: systemPrompt || '' },
      { role: 'user', content: prompt }
    ];
  }

  const validationError = validateMessages(msgs);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!checkApiKey(req, res)) return;

  try {
    const data = await chat(DEEPSEEK_API_KEY, { messages: msgs, isJson, temperature, maxTokens, model });
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    console.log(`[DeepSeek] Response time: ${Date.now() - new Date().getTime()}ms`);
    res.json({ result: text });
  } catch (e) {
    console.error('Error calling DeepSeek API:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/chat/stream:
 *   post:
 *     summary: Enviar mensaje y recibir respuesta en streaming (SSE)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               prompt:
 *                 type: string
 *               systemPrompt:
 *                 type: string
 *               isJson:
 *                 type: boolean
 *               temperature:
 *                 type: number
 *               maxTokens:
 *                 type: integer
 *               model:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stream de eventos SSE
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/stream', async (req, res) => {
  const { messages, prompt, systemPrompt, isJson, temperature, maxTokens, model } = req.body;

  let msgs = messages;
  if (!msgs && prompt) {
    msgs = [
      { role: 'system', content: systemPrompt || '' },
      { role: 'user', content: prompt }
    ];
  }

  const validationError = validateMessages(msgs);
  if (validationError) return res.status(400).json({ error: validationError });
  if (!checkApiKey(req, res)) return;

  let streamClosed = false;
  req.on('close', () => {
    streamClosed = true;
    res.end();
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs, isJson, temperature, maxTokens, model }, (chunk) => {
      if (streamClosed) return;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    if (streamClosed) return;
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    if (streamClosed) return;
    console.error('Error in streaming:', e);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

module.exports = router;
