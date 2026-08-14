const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde.' },
  skip: (req) => process.env.NODE_ENV !== 'production'
});

const deepseekLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes a DeepSeek, espera un momento.' },
  skip: (req) => process.env.NODE_ENV !== 'production'
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, espera un momento.' },
  skip: (req) => process.env.NODE_ENV !== 'production'
});

// Limiters granulares para endpoints específicos (IALab)
const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados mensajes. Intenta de nuevo en 1 minuto.', retryAfter: 60 },
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  skip: (req) => process.env.NODE_ENV !== 'production'
});

const examSubmissionLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados envíos. Intenta de nuevo después.', retryAfter: 30 },
  keyGenerator: (req) => `${req.userId || ipKeyGenerator(req)}-${req.params.examId || 'unknown'}`,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

const challengeSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados envíos de desafío. Intenta de nuevo.', retryAfter: 60 },
  keyGenerator: (req) => `${req.userId || ipKeyGenerator(req)}-${req.params.challengeId || 'unknown'}`,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

module.exports = {
  apiLimiter,
  deepseekLimiter,
  authLimiter,
  chatMessageLimiter,
  examSubmissionLimiter,
  challengeSubmissionLimiter
};
