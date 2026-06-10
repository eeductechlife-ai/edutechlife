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
