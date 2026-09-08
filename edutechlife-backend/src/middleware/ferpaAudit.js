const supabase = require('../db/supabase');

const EDUCATIONAL_ENDPOINTS = [
  '/api/smartboard/student-profile',
  '/api/smartboard/progress',
  '/api/smartboard/data',
  '/api/smartboard/export-user-data',
  '/api/smartboard/vak',
  '/api/admin/users',
];

function categorizePath(path) {
  if (path.includes('export')) return 'export';
  if (path.includes('profile')) return 'profile';
  if (path.includes('progress') || path.includes('vak') || path.includes('data')) return 'assessment';
  if (/admin/.test(path)) return 'educational_record';
  return 'educational_record';
}

function requestorType(req) {
  if (req.user?.role === 'admin') return 'admin';
  if (req.headers['x-api-key']) return 'api_key';
  return 'internal';
}

/**
 * Middleware: logs access to educational records for FERPA compliance.
 * Non-blocking — audit failures never interrupt the request.
 */
function ferpaAuditLog(req, res, next) {
  const matched = EDUCATIONAL_ENDPOINTS.some((ep) => req.path.startsWith(ep.replace('/api/smartboard', '').replace('/api/admin', '')));
  if (!matched) return next();

  res.on('finish', () => {
    if (res.statusCode >= 500) return; // Don't log server errors — no data was served
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;
    supabase.from('ferpa_access_log').insert({
      user_id: req.userId || null,
      target_user_id: req.params?.userId || req.userId || null,
      endpoint: req.path,
      method: req.method,
      ip_address: ip || null,
      requestor_type: requestorType(req),
      data_category: categorizePath(req.path),
    }).then(({ error }) => {
      if (error) console.warn('[FERPA] audit log insert failed:', error.message);
    });
  });

  next();
}

module.exports = { ferpaAuditLog };
