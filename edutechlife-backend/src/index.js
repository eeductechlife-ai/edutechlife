require('dotenv').config();
const { setupTelemetry } = require('./lib/telemetry');
setupTelemetry();

const app = require('./app');
const { startPaidPlanExpiry } = require('./services/paidPlans');
const { startRecordatoriosVencimiento } = require('./services/recordatorioVencimiento');
const { startInformesSemanalesPadres } = require('./services/informeSemanalPadres');
const logger = require('./utils/logger');
const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_api_key_here') {
  logger.warn('WARNING: DEEPSEEK_API_KEY is not properly configured.');
  logger.warn('  Please set a valid API key in the .env file.');
  logger.warn('  Get your key from: https://platform.deepseek.com/');
}

async function startServer() {
  // Initialize Redis (non-blocking; logs warning if unavailable)
  await app.initializeRedis();

  startPaidPlanExpiry();
  startRecordatoriosVencimiento();
  startInformesSemanalesPadres();

  app.listen(PORT, () => {
    logger.info('Server running on http://localhost:' + PORT);
    logger.info('API Key configured: ' + !!DEEPSEEK_API_KEY);
    logger.info('Redis: ' + (app.redis.isReady() ? 'connected' : 'unavailable (fallback)'));
  });
}

// Start server
startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
