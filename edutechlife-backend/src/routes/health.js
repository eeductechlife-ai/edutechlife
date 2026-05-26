const { Router } = require('express');
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const router = Router();

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
