const { Router } = require('express');
const { chat } = require('../../services/deepseek');
const { IALAB_SYSTEM_PROMPT, generateFallbackResult } = require('../../services/ialabPrompts');

const router = Router();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * @swagger
 * /api/ialab/prompts:
 *   post:
 *     summary: Generar un MasterPrompt optimizado con IA
 *     tags: [IALab]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 maxLength: 2000
 *               templateType:
 *                 type: string
 *                 default: general
 *     responses:
 *       200:
 *         description: MasterPrompt generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 masterPrompt:
 *                   type: string
 *                 feedback:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                   enum: [beginner, intermediate, advanced]
 *                 templateType:
 *                   type: string
 *                 originalPrompt:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 responseTime:
 *                   type: integer
 *       400:
 *         description: Prompt inválido
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  const { prompt, templateType = 'general' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
  }
  if (prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt too long (max 2000 characters for IALab)' });
  }
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const startTime = Date.now();
  const systemPrompt = IALAB_SYSTEM_PROMPT.replace('{templateType}', templateType);

  try {
    const data = await chat(DEEPSEEK_API_KEY, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Genera un MasterPrompt para: "' + prompt + '"' }
      ],
      isJson: true,
      temperature: process.env.IALAB_TEMPERATURE || 0.7,
      maxTokens: process.env.IALAB_MAX_TOKENS || 800,
      model: 'deepseek-chat'
    });

    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from API' });

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
      if (!parsedResult.masterPrompt || !parsedResult.feedback) {
        throw new Error('Invalid response structure from AI');
      }
      parsedResult.templateType = templateType;
      parsedResult.originalPrompt = prompt;
      parsedResult.timestamp = new Date().toISOString();
      parsedResult.responseTime = Date.now() - startTime;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      parsedResult = generateFallbackResult(prompt, templateType, startTime);
    }

    console.log('[IALab Prompts] Generated prompt for template: ' + templateType + ' | Time: ' + (Date.now() - startTime) + 'ms');
    res.json(parsedResult);
  } catch (e) {
    console.error('Error in IALab prompts endpoint:', e);
    res.status(500).json({
      error: 'Error interno del servidor',
      fallback: {
        masterPrompt: 'Genera un prompt profesional para: ' + prompt + '. Sé específico con el contexto y formato de respuesta.',
        feedback: 'Error en la generación. Revisa tu prompt e intenta de nuevo.',
        difficulty: 'beginner',
        templateType: templateType
      }
    });
  }
});

module.exports = router;
