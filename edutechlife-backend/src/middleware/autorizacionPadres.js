const supabase = require('../db/supabase');
const { estaActivo, estadoAutorizacion } = require('../services/autorizacionPadres');

// Rutas que un estudiante con acceso limitado sí puede usar: su estado de
// autorización, su rol, el consentimiento y su perfil (ahí se guarda el
// resultado del diagnóstico VAK).
const RUTAS_LIBRES = ['/user-role', '/authorization', '/parental-consent', '/student-profile'];

function rutaLibre(path = '') {
  return RUTAS_LIBRES.some((ruta) => path === ruta || path.startsWith(`${ruta}/`));
}

async function resolverUsuario(req) {
  if (req.userId) return req.userId;
  const header = req.headers?.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  const { data: { user }, error } = await supabase.auth.getUser(header.slice(7));
  if (error || !user) return null;
  return user.id;
}

/**
 * Restringe a los estudiantes sin autorización de padre/madre. Se monta en el
 * router de IngenIA, antes que los requireAuth de cada ruta. Con la variable
 * apagada no hace ninguna consulta. Si no hay sesión válida, deja que la ruta
 * responda 401. Si no puede verificar, responde 503 (falla cerrada).
 */
function requireAutorizacionPadres() {
  return async function autorizacionPadres(req, res, next) {
    if (!estaActivo() || rutaLibre(req.path)) return next();

    try {
      const userId = await resolverUsuario(req);
      if (!userId) return next();

      const estado = await estadoAutorizacion(userId);
      if (estado.restringido) {
        return res.status(403).json({
          error: 'Tu papá o mamá debe autorizar tu acceso para continuar.',
          code: 'AUTORIZACION_PADRES_REQUERIDA',
          estado: estado.estado,
        });
      }
      return next();
    } catch (e) {
      console.error('[autorizacion-padres] no se pudo verificar la autorización:', e.message);
      return res.status(503).json({
        error: 'No pudimos verificar la autorización. Intenta de nuevo en unos minutos.',
        code: 'AUTORIZACION_PADRES_NO_VERIFICABLE',
      });
    }
  };
}

module.exports = { requireAutorizacionPadres, rutaLibre, RUTAS_LIBRES };
