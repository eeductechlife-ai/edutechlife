require('dotenv').config();
const { setupTelemetry } = require('./lib/telemetry');
setupTelemetry();

const app = require('./app');
const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_api_key_here') {
  console.warn('WARNING: DEEPSEEK_API_KEY is not properly configured.');
  console.warn('  Please set a valid API key in the .env file.');
  console.warn('  Get your key from: https://platform.deepseek.com/');
}

async function startServer() {
  // Initialize Redis (non-blocking; logs warning if unavailable)
  await app.initializeRedis();

  app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    console.log('API Key configured: ' + !!DEEPSEEK_API_KEY);
    console.log('Redis: ' + (app.redis.isReady() ? 'connected' : 'unavailable (fallback)'));
  });
}

// Start server
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
