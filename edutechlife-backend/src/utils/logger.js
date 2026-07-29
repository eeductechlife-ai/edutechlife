const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] || levels.info;

const formatLog = (level, message, meta = {}) => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
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
