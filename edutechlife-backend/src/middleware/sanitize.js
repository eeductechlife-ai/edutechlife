const { sanitizeString, sanitizeBody } = require('../utils/sanitize');

function sanitizeMiddleware(req, _res, next) {
  if (req.body) req.body = sanitizeBody(req.body);
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') req.query[key] = sanitizeString(req.query[key]);
    }
  }
  next();
}

module.exports = sanitizeMiddleware;
