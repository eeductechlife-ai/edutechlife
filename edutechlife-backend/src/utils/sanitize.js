function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '');
}

function sanitizeBody(obj) {
  if (Array.isArray(obj)) return obj.map(sanitizeBody);
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = typeof value === 'string' ? sanitizeString(value) : sanitizeBody(value);
    }
    return result;
  }
  return obj;
}

module.exports = { sanitizeString, sanitizeBody };
