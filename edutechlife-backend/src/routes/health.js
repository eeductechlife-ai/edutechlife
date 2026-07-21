const { Router } = require('express');
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar estado del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 deepseekConfigured:
 *                   type: boolean
 *                 memoryUsage:
 *                   type: string
 *                   example: 45MB
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    deepseekConfigured: !!DEEPSEEK_API_KEY,
    memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
  });
});

module.exports = router;
