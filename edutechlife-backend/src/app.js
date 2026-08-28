const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
const sanitizeMiddleware = require('./middleware/sanitize');
const { requireAuth } = require('./middleware/auth');
const { apiLimiter, deepseekLimiter, authLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/health');
const chatRoutes = require('./routes/chat');
const ialabRoutes = require('./routes/ialab');
const voiceRoutes = require('./routes/voice');
const ttsRoutes = require('./routes/tts');
const smartboardRoutes = require('./routes/smartboard');
const scanImageRoutes = require('./routes/scanImage');
const stripeRoutes = require('./routes/stripe');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const { webhookHandler } = require('./routes/stripe');

const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'",
    'https://edutechlife.co',
    'https://*.clerk.accounts.dev',
    'https://challenges.cloudflare.com',
  ],
  styleSrc: ["'self'",
    'https://fonts.googleapis.com',
    'https://edutechlife.co',
  ],
  imgSrc: ["'self'", 'data:', 'blob:',
    'https://edutechlife.co',
    'https://*.supabase.co',
  ],
  connectSrc: ["'self'",
    'https://edutechlife.co',
    'https://*.clerk.accounts.dev',
    'https://*.supabase.co',
    'https://api.stripe.com',
    'https://challenges.cloudflare.com',
    'wss://*.clerk.accounts.dev',
  ],
  fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
  frameSrc: ["'self'", 'https://challenges.cloudflare.com'],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'", 'blob:'],
  upgradeInsecureRequests: null,
};

const ALLOWED_ORIGINS = [
  'https://edutechlife.co',
  'https://www.edutechlife.co',
  'https://edutechlife-api.vercel.app',
];

// Precompile regex for performance (avoid recompilation per request)
const LOCALHOST_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|517[0-9]|518[0-9]|519[0-9])$/;

const isAllowed = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Always allow localhost origins for local development, regardless of NODE_ENV
  if (LOCALHOST_REGEX.test(origin)) return true;
  return false;
};

const app = express();

app.set('etag', 'strong');
app.set('trust proxy', 1);
app.use(compression());
app.use(cors({
  origin: (origin, callback) => callback(null, isAllowed(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: { directives: CSP_DIRECTIVES },
  crossOriginEmbedderPolicy: false,
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
}));

app.use((req, res, next) => {
  req.id = crypto.randomUUID().slice(0, 8);
  req.log = {
    info: (msg, meta) => logger.info(msg, { requestId: req.id, ...meta }),
    warn: (msg, meta) => logger.warn(msg, { requestId: req.id, ...meta }),
    error: (msg, meta) => logger.error(msg, { requestId: req.id, ...meta }),
  };
  next();
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Edutechlife API Docs',
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json({ limit: '8mb' }));
app.use(sanitizeMiddleware);

app.use('/api', apiLimiter);
app.use('/api/chat', deepseekLimiter);
app.use('/api/ialab/prompts', deepseekLimiter);
app.use('/api/voice-token', requireAuth, authLimiter);
app.use('/api/smartboard/data', requireAuth);
app.use('/api/smartboard/progress', requireAuth);
app.use('/api/smartboard/chat', requireAuth, deepseekLimiter);
app.use('/api/ialab/progress', requireAuth);
app.use('/api/ialab/templates', requireAuth);

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ialab', ialabRoutes);
app.use('/api/voice-token', voiceRoutes);
app.use('/api/tts', requireAuth, ttsRoutes);
app.use('/api/smartboard', smartboardRoutes);
app.use('/api/smartboard', scanImageRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
