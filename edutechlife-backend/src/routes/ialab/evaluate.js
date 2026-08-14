const { Router } = require('express');
const { challengeSubmissionLimiter } = require('../../middleware/rateLimiter');

const router = Router();

/**
 * @swagger
 * /api/ialab/evaluate-prompt:
 *   post:
 *     summary: Evaluar la calidad de un prompt
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
 *     responses:
 *       200:
 *         description: Evaluación del prompt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 evaluation:
 *                   type: object
 *                   properties:
 *                     scores:
 *                       type: object
 *                       properties:
 *                         clarity:
 *                           type: integer
 *                         structure:
 *                           type: integer
 *                         completeness:
 *                           type: integer
 *                         tone:
 *                           type: integer
 *                         actionability:
 *                           type: integer
 *                     totalScore:
 *                       type: string
 *                     grade:
 *                       type: string
 *       400:
 *         description: Prompt requerido
 *       500:
 *         description: Error del servidor
 */
router.post('/', challengeSubmissionLimiter, (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required for evaluation' });

    const wordCount = prompt.split(/\s+/).length;
    const hasRole = /eres|you are/i.test(prompt);
    const hasTask = /tarea|task/i.test(prompt);
    const hasConstraints = /evita|avoid/i.test(prompt);

    const scores = {
      clarity: Math.min(10, Math.floor(wordCount / 50) + (hasRole ? 3 : 0)),
      structure: Math.min(10, (hasRole && hasTask && hasConstraints) ? 9 : 6),
      completeness: Math.min(10, Math.floor(prompt.length / 200)),
      tone: 8,
      actionability: hasTask ? 9 : 5
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    const feedback = [];
    if (wordCount < 50) feedback.push('Considera agregar más detalles al prompt');
    if (!hasRole) feedback.push('Agrega un rol específico para el asistente de IA');
    if (!hasTask) feedback.push('Define claramente la tarea principal');
    if (!hasConstraints) feedback.push('Considera agregar restricciones para mejores resultados');

    console.log('[IALab Evaluation] Evaluated prompt of ' + wordCount + ' words, score: ' + totalScore.toFixed(1) + '/10');
    res.json({
      success: true,
      evaluation: {
        scores, totalScore: totalScore.toFixed(1),
        metrics: { length: prompt.length, wordCount, hasRole, hasTask, hasConstraints },
        feedback,
        grade: totalScore >= 8 ? 'Excelente' : totalScore >= 6 ? 'Bueno' : 'Necesita mejora',
        suggestions: [
          'Usa un rol específico para el asistente',
          'Define la tarea principal claramente',
          'Incluye ejemplos concretos cuando sea posible',
          'Especifica el formato de respuesta deseado'
        ]
      }
    });
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    res.status(500).json({ error: 'Failed to evaluate prompt', details: 'Error interno' });
  }
});

module.exports = router;
