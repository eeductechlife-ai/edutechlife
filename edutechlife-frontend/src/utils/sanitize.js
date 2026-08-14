import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'id'];

export function sanitize(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Rechaza URLs de redirección que no sean rutas internas de la app.
 * Previene open redirects vía `?returnTo=`: solo admite rutas que arrancan
 * con "/" y no contienen protocolo, host ni backslashes.
 */
export function safeReturnTo(candidate, fallback = '/ialab') {
  if (typeof candidate !== 'string' || !candidate.startsWith('/')) {
    return fallback;
  }
  if (candidate.includes('://') || candidate.includes('\\\\') || candidate.startsWith('//')) {
    return fallback;
  }
  return candidate;
}
