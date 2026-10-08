const logger = require('../utils/logger');

/**
 * Registro de respuestas 4xx/5xx por ruta.
 *
 * En la auditoría de IngenIA la consola del navegador acumuló 38 errores de
 * carga (400, 404, 429 y un 501) y no había forma de atribuirlos desde el
 * servidor. Aquí cada respuesta de error deja una línea con método, ruta
 * (el patrón de Express, no la URL con ids), estado y duración, y se lleva un
 * contador por ruta+estado para ver cuáles se repiten.
 *
 * La ruta usa el patrón de Express cuando existe ("/api/ingenia/data/:userId")
 * y, para las que no coinciden con ninguna (404), solo los primeros segmentos:
 * así el contador no crece sin límite con URLs inventadas.
 */
const MAX_COUNTERS = 300;
const counters = new Map();

function routeLabel(req) {
  if (req.route?.path) return `${req.baseUrl || ''}${req.route.path}`;
  const path = String(req.originalUrl || req.url || '').split('?')[0];
  const head = path.split('/').filter(Boolean).slice(0, 3);
  // La raíz ("/") no tiene segmentos: antes salía como "//*".
  return head.length ? `/${head.join('/')}/*` : '/';
}

function count(key) {
  if (!counters.has(key) && counters.size >= MAX_COUNTERS) {
    key = 'otras/*'; // tope de cardinalidad
  }
  counters.set(key, (counters.get(key) || 0) + 1);
}

function httpErrorLog(req, res, next) {
  const startedAt = Date.now();
  res.on('finish', () => {
    if (res.statusCode < 400) return;
    const route = routeLabel(req);
    count(`${req.method} ${route} ${res.statusCode}`);
    const meta = {
      requestId: req.id,
      method: req.method,
      route,
      status: res.statusCode,
      ms: Date.now() - startedAt,
    };
    // Los 5xx son fallos del servidor; los 4xx, de la petición.
    if (res.statusCode >= 500) logger.error('http_error', meta);
    else logger.warn('http_error', meta);
  });
  next();
}

/** Contadores por «MÉTODO ruta estado», de mayor a menor. */
function getHttpErrorCounts() {
  return [...counters.entries()]
    .map(([key, total]) => ({ key, total }))
    .sort((a, b) => b.total - a.total);
}

function resetHttpErrorCounts() {
  counters.clear();
}

module.exports = { httpErrorLog, getHttpErrorCounts, resetHttpErrorCounts };
