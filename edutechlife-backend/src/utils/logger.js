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

const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Error);

const texto = (v) => {
  if (v instanceof Error) return v.message;
  if (typeof v === 'string') return v;
  if (v !== null && typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

const formatLog = (level, args) => {
  // Firma antigua: (mensaje, { metadatos }). Firma de consola: varios valores.
  const conMeta = args.length === 2 && esObjeto(args[1]);
  const message = conMeta ? args[0] : args.map(texto).join(' ');
  const meta = conMeta ? args[1] : {};
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message: redactString(texto(message)),
    ...redactMeta(meta),
  });
  if (level === 'error') console.error(entry);
  else if (level === 'warn') console.warn(entry);
  else console.log(entry);
};

const logger = {
  debug: (...args) => { if (currentLevel <= levels.debug) formatLog('debug', args); },
  info: (...args) => { if (currentLevel <= levels.info) formatLog('info', args); },
  warn: (...args) => { if (currentLevel <= levels.warn) formatLog('warn', args); },
  error: (...args) => { if (currentLevel <= levels.error) formatLog('error', args); },
};

module.exports = logger;
