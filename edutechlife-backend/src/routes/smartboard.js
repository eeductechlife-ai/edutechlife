const { Router } = require('express');
const supabase = require('../db/supabase');
const { chat, chatStream, validateMessages } = require('../services/deepseek');
const { requireAuth } = require('../middleware/auth');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const DANI_SYSTEM_PROMPT = `Eres Dani, un tutor virtual amigable para estudiantes de 8 a 16 años.

Personalidad:
- Nombre: Dani
- Tono: cálido, motivador y paciente
- Usa emojis ocasionalmente para hacer la experiencia más divertida 🎉
- Habla siempre en español

Reglas importantes:
- Guía a los estudiantes con preguntas en lugar de dar respuestas directas
- Ayuda a desarrollar pensamiento crítico y habilidades de resolución de problemas
- Mantén un lenguaje apropiado para la edad del estudiante
- Sé paciente y alentador, celebra los pequeños logros
- Si el estudiante se frustra, ofrece pistas en lugar de soluciones
- Promueve un ambiente de aprendizaje positivo y sin juzgamiento`;

/**
 * @swagger
 * /api/smartboard/data/{userId}:
 *   get:
 *     summary: Obtener datos del SmartBoard para un usuario
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del SmartBoard
 *       404:
 *         description: Datos no encontrados
 *       500:
 *         description: Error del servidor
 */
router.get('/data/:userId', async (req, res) => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Acceso denegado — no puedes acceder a datos de otro usuario' });
  }

  try {
    const { data, error } = await supabase
      .from('smartboard_kids_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Data not found for this user' });
      }
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Data not found for this user' });
    }

    res.json(data.data);
  } catch (e) {
    console.error('Error fetching smartboard data:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/smartboard/chat:
 *   post:
 *     summary: Enviar mensaje al tutor virtual Dani
 *     tags: [SmartBoard]
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
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta del tutor
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
router.post('/chat', requireAuth, async (req, res) => {
  const { messages, context } = req.body;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    const data = await chat(DEEPSEEK_API_KEY, { messages: msgs });
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    res.json({ result: text });
  } catch (e) {
    console.error('Error calling Dani AI:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/smartboard/chat/stream:
 *   post:
 *     summary: Enviar mensaje al tutor virtual Dani con streaming
 *     tags: [SmartBoard]
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
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Streaming de respuesta del tutor
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/chat/stream', requireAuth, async (req, res) => {
  const { messages, context } = req.body;

  const validationError = validateMessages(messages);
  if (validationError) return res.status(400).json({ error: validationError });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const systemPrompt = context
    ? `${DANI_SYSTEM_PROMPT}\n\nContexto actual:\n${context}`
    : DANI_SYSTEM_PROMPT;

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await chatStream(DEEPSEEK_API_KEY, { messages: msgs }, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    console.error('Error calling Dani AI (stream):', e);
    res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
    res.end();
  }
});

/**
 * @swagger
 * /api/smartboard/progress/{userId}:
 *   get:
 *     summary: Obtener progreso del estudiante en SmartBoard
 *     tags: [SmartBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Progreso del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPoints:
 *                   type: integer
 *                 streak:
 *                   type: integer
 *                 completedMissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 subjectProgress:
 *                   type: object
 *                 totalActiveMinutes:
 *                   type: integer
 *                 vakResult:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/progress/:userId', async (req, res) => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Acceso denegado — no puedes acceder a datos de otro usuario' });
  }

  try {
    const { data, error } = await supabase
      .from('smartboard_kids_data')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Data not found for this user' });
      }
      throw error;
    }

    if (!data || !data.data) {
      return res.status(404).json({ error: 'Data not found for this user' });
    }

    const kidData = data.data;

    res.json({
      totalPoints: kidData.totalPoints ?? 0,
      streak: kidData.streak ?? 0,
      completedMissions: kidData.completedMissions ?? [],
      subjectProgress: kidData.subjectProgress ?? {},
      totalActiveMinutes: kidData.totalActiveMinutes ?? 0,
      vakResult: kidData.vakResult ?? null,
    });
  } catch (e) {
    console.error('Error fetching smartboard progress:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
