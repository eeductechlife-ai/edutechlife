const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sanitizeMiddleware = require('./middleware/sanitize');
const { apiLimiter, deepseekLimiter, authLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const chatRoutes = require('./routes/chat');
const ialabRoutes = require('./routes/ialab');
const voiceRoutes = require('./routes/voice');

const ALLOWED_ORIGINS = [
  'https://edutechlife.co',
  'https://www.edutechlife.co',
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
];

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeMiddleware);

app.use('/api', apiLimiter);
app.use('/api/chat', deepseekLimiter);
app.use('/api/ialab/prompts', deepseekLimiter);
app.use('/api/voice-token', authLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ialab', ialabRoutes);
app.use('/api/voice-token', voiceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
