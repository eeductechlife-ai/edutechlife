const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Use Redis store when available so rate limits survive restarts and work
// across multiple instances. Falls back to in-memory when Redis is absent.
function buildStore() {
  if (!process.env.UPSTASH_REDIS_URL) return undefined;
  try {
    const { RedisStore } = require('rate-limit-redis');
    const redis = require('../lib/redis');
    return new RedisStore({
      sendCommand: (...args) => redis.getClient()?.sendCommand(args),
      prefix: 'rl:',
    });
  } catch {
    return undefined;
  }
}

const store = buildStore();

// Clave de rate limit por USUARIO cuando se puede identificar, y por IP si no.
// Motivo: en un aula los 30 estudiantes comparten IP; con la clave por IP
// (por defecto) agotaban el cupo y recibían 429. `req.userId` lo fija el
// middleware de auth en rutas autenticadas; para los limitadores globales
// (que corren antes de la auth por ruta) se decodifica el `sub` del JWT del
// header Authorization. Si no hay token válido, cae a IP (comportamiento
// anterior). No se verifica la firma aquí: para conteo de cuota basta el sub,
// y sin token el cupo por IP sigue aplicando.
function userAwareKey(req) {
  if (req.userId) return `u:${req.userId}`;
  const header = req.headers?.authorization || "";
  if (header.startsWith("Bearer ")) {
    try {
      const payload = header.slice(7).split(".")[1];
      const json = JSON.parse(
        Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
      );
      if (json?.sub) return `u:${json.sub}`;
    } catch {
      /* token no decodificable: usar IP */
    }
  }
  return ipKeyGenerator(req.ip || "");
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  keyGenerator: userAwareKey,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde.' },
  // El health check de Render llama cada pocos segundos desde la misma IP:
  // contarlo devolvía 429, Render daba la instancia por caída y respondía 502.
  skip: (req) =>
    process.env.NODE_ENV !== 'production' || req.originalUrl.split('?')[0] === '/api/health',
});

const deepseekLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  keyGenerator: userAwareKey,
  message: { error: 'Demasiadas solicitudes a DeepSeek, espera un momento.' },
  skip: (req) => process.env.NODE_ENV !== 'production',
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Demasiados intentos, espera un momento.' },
  skip: (req) => process.env.NODE_ENV !== 'production',
});

// Limiters granulares para endpoints específicos (IALab)
const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Demasiados mensajes. Intenta de nuevo en 1 minuto.', retryAfter: 60 },
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  skip: (req) => process.env.NODE_ENV !== 'production',
});

const examSubmissionLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Demasiados envíos. Intenta de nuevo después.', retryAfter: 30 },
  keyGenerator: (req) => `${req.userId || ipKeyGenerator(req)}-${req.params.examId || 'unknown'}`,
  skip: (req) => process.env.NODE_ENV !== 'production',
});

const challengeSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Demasiados envíos de desafío. Intenta de nuevo.', retryAfter: 60 },
  keyGenerator: (req) => `${req.userId || ipKeyGenerator(req)}-${req.params.challengeId || 'unknown'}`,
  skip: (req) => process.env.NODE_ENV !== 'production',
});

// Google TTS — billed per character; open to anonymous visitors (public Nico
// assistant) so it MUST be rate-limited per user (when authed) or per IP.
// The frontend speaks short sentences (~1 request each) plus cached audio,
// so generous per-minute + a harder per-hour ceiling contain abuse cost.
const ttsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Demasiadas solicitudes de voz. Espera un momento.', retryAfter: 60 },
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  skip: (req) => process.env.NODE_ENV !== 'production',
});

const ttsHourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Has alcanzado el límite de voz de esta hora.', retryAfter: 3600 },
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  skip: (req) => process.env.NODE_ENV !== 'production',
});

// Google Vision API — billed per call; limit tightly per authenticated user
const visionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { error: 'Límite de escaneos alcanzado. Intenta de nuevo en 1 minuto.', retryAfter: 60 },
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  skip: (req) => process.env.NODE_ENV !== 'production',
});

module.exports = {
  apiLimiter,
  deepseekLimiter,
  authLimiter,
  chatMessageLimiter,
  examSubmissionLimiter,
  challengeSubmissionLimiter,
  ttsLimiter,
  ttsHourlyLimiter,
  visionLimiter,
};
