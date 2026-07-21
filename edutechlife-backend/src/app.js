const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const sanitizeMiddleware = require('./middleware/sanitize');
const { requireAuth } = require('./middleware/auth');
const { apiLimiter, deepseekLimiter, authLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const healthRoutes = require('./routes/health');
const chatRoutes = require('./routes/chat');
const ialabRoutes = require('./routes/ialab');
const voiceRoutes = require('./routes/voice');
const ttsRoutes = require('./routes/tts');
const smartboardRoutes = require('./routes/smartboard');
const stripeRoutes = require('./routes/stripe');
const { webhookHandler } = require('./routes/stripe');

const ALLOWED_ORIGINS = [
  'https://edutechlife.co',
  'https://www.edutechlife.co',
  'https://edutechlife-api.vercel.app',
];

const isAllowed = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

const app = express();

app.use(compression());
app.use(cors({
  origin: (origin, callback) => callback(null, isAllowed(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Edutechlife API Docs',
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json({ limit: '1mb' }));
app.use(sanitizeMiddleware);

app.use('/api', apiLimiter);
app.use('/api/chat', deepseekLimiter);
app.use('/api/ialab/prompts', deepseekLimiter);
app.use('/api/voice-token', authLimiter);
app.use('/api/smartboard/data', requireAuth);
app.use('/api/smartboard/progress', requireAuth);
app.use('/api/smartboard/chat', deepseekLimiter);
app.use('/api/ialab/progress', requireAuth);
app.use('/api/ialab/templates', requireAuth);

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ialab', ialabRoutes);
app.use('/api/voice-token', voiceRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/smartboard', smartboardRoutes);
app.use('/api/stripe', stripeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
