const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] || levels.info;

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const TOKEN_RE = /\b[A-Za-z0-9_\-]{40,}\b/g;

const redactString = (s) =>
  s.replace(EMAIL_RE, '***@***.***')
   .replace(UUID_RE, (m) => m.slice(0, 8) + '****')
   .replace(TOKEN_RE, '[REDACTED]');

const redactMeta = (meta) => {
  try {
    return JSON.parse(redactString(JSON.stringify(meta)));
  } catch {
    return { _redacted: true };
  }
};

const formatLog = (level, message, meta = {}) => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...redactMeta(meta),
  });
  if (level === 'error') console.error(entry);
  else if (level === 'warn') console.warn(entry);
  else console.log(entry);
};

const logger = {
  debug: (msg, meta) => { if (currentLevel <= levels.debug) formatLog('debug', msg, meta); },
  info: (msg, meta) => { if (currentLevel <= levels.info) formatLog('info', msg, meta); },
  warn: (msg, meta) => { if (currentLevel <= levels.warn) formatLog('warn', msg, meta); },
  error: (msg, meta) => { if (currentLevel <= levels.error) formatLog('error', msg, meta); },
};

module.exports = logger;
