const supabase = require('../db/supabase');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado — token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify Supabase JWT — auth migrated from Clerk to Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    req.userId = user.id;
    req.userEmail = user.email;
    req.userToken = token;
    // Rol de confianza (app_metadata, no editable por el usuario). Lo usa el
    // guard de producto para dejar pasar a admin/content_creator.
    req.userRole = user.app_metadata?.role || null;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/** Etiquetas legibles de cada producto (para mensajes de error). */
const PRODUCT_LABELS = { ialab: 'IALab', smartboard: 'IngenIA' };

/**
 * ¿La cuenta es padre/madre con al menos un hijo vinculado?
 * La relación vive en parent_student_links (la misma fuente que usa
 * /api/smartboard/user-role), no en la tabla `parents`.
 */
async function hasActiveParentLink(userId) {
  const { data } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('parent_user_id', userId)
    .eq('is_active', true)
    .limit(1);
  return Array.isArray(data) && data.length > 0;
}

/**
 * Guard de producto: impide que una cuenta de un producto consuma la API del
 * otro (IALab 16+ vs IngenIA 6–16). Son audiencias distintas.
 *
 * Deja pasar:
 *   - admin / content_creator (app_metadata.role)
 *   - padres con vínculo activo cuando el producto es smartboard
 *   - cuentas sin account_type (transición: no bloquear a nadie legítimo)
 *   - rutas declaradas en allowPaths (p. ej. /user-role, que ambos productos
 *     consultan para saber el rol)
 * Si requireAuth no corrió antes (no hay req.userId), lo ejecuta él mismo.
 */
function requireProduct(product, { allowPaths = [] } = {}) {
  const guard = async (req, res, next) => {
    // req.path es relativo al punto de montaje (app.use('/api/smartboard', …));
    // originalUrl cubre el caso de rutas registradas directamente.
    const fullPath = String(req.originalUrl || '').split('?')[0];
    const isExempt = allowPaths.some(
      (p) =>
        req.path === p ||
        req.path.startsWith(p) ||
        fullPath === p ||
        fullPath.endsWith(p),
    );
    if (isExempt) return next();
    try {
      if (req.userRole === 'admin' || req.userRole === 'content_creator') {
        return next();
      }

      if (product === 'smartboard' && (await hasActiveParentLink(req.userId))) {
        return next();
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('account_type')
        .eq('id', req.userId)
        .maybeSingle();

      if (error) {
        (req.log || console).error('[product-guard]', error.message);
        return res
          .status(500)
          .json({ error: 'Error verificando el producto de la cuenta' });
      }

      const accountType = profile?.account_type || null;
      if (!accountType || accountType === product) return next();

      return res.status(403).json({
        error: 'product_mismatch',
        product: accountType,
        message: `Esta cuenta pertenece a ${
          PRODUCT_LABELS[accountType] || accountType
        }. Ingresa desde su propio acceso.`,
      });
    } catch (e) {
      (req.log || console).error('[product-guard-error]', e.message);
      return res
        .status(500)
        .json({ error: 'Error verificando el producto de la cuenta' });
    }
  };

  return (req, res, next) => {
    if (req.userId) return guard(req, res, next);
    // Sin identidad previa: se autentica aquí (evita exigir requireAuth a cada
    // ruta y no duplica la llamada cuando otro middleware ya la hizo).
    return requireAuth(req, res, () => guard(req, res, next));
  };
}

/**
 * Verifica el Bearer token cuando está presente, pero nunca rechaza la
 * petición si no lo está. Deja req.userId/req.userEmail definidos solo
 * cuando la identidad pudo validarse.
 *
 * Uso: rutas públicas que quieren atribuir la llamada a un usuario
 * autenticado (p. ej. /api/chat) sin romper a los clientes anónimos.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return next();
    }
    req.userId = user.id;
    req.userEmail = user.email;
  } catch {
    // Identidad no verificable — continuar como anónimo.
  }
  next();
}

module.exports = { requireAuth, optionalAuth, requireProduct };
