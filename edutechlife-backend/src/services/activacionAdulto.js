/**
 * Activación de la cuenta de un estudiante de IngenIA por su adulto
 * responsable (Ley 1581 de 2012). Decisión del CEO (2026-10-15): el padre,
 * madre o acudiente activa la cuenta UNA sola vez y desde ese momento el
 * niño usa todas las herramientas de su plan, sin volver a pedirlo.
 *
 * Dos marcas:
 * - Evidencia (fuente de verdad): una fila por estudiante en
 *   activaciones_adulto_menor con fecha, adulto, método y versión del texto de
 *   autorización aceptado. La primera activación nunca se sobrescribe.
 * - Atajo de sesión: app_metadata.ingenia_adulto_activado_at del usuario.
 *   Llega con supabase.auth.getUser() en requireAuth, así que un niño
 *   activado no necesita ninguna consulta extra (ni puede fallar en ella).
 *   app_metadata solo lo escribe el backend (service_role), no el usuario.
 *
 * Solo lee y escribe; quien decide bloquear es el middleware
 * requireAdultoActivado y solo con ADULTO_OBLIGATORIO=true.
 */
const supabase = require('../db/supabase');

const TABLA = 'activaciones_adulto_menor';
// Si cambia, cambiar también activadoEnSesion.
const CLAVE_SESION = 'ingenia_adulto_activado_at';
const MAYORIA_DE_EDAD = 18;

/** Versión del texto de autorización que ve el adulto al confirmar. */
const VERSION_AUTORIZACION_VIGENTE = 'adulto-menor-v1-2026-10-20';
const VERSIONES_AUTORIZACION = [VERSION_AUTORIZACION_VIGENTE];

const METODOS = ['invitacion', 'codigo_padre', 'vinculo_existente', 'consentimiento_existente'];

/** Tabla inexistente (migración sin aplicar): se trata como vacía. */
function tablaAusente(error) {
  return error && (error.code === '42P01' || error.code === 'PGRST205');
}

function activadoEnSesion(appMetadata) {
  return Boolean(appMetadata?.ingenia_adulto_activado_at);
}

function versionValida(version) {
  return VERSIONES_AUTORIZACION.includes(version);
}

/** Copia la marca en app_metadata. Nunca lanza: la fila de evidencia manda. */
async function marcarEnSesion(estudianteId, activadaAt) {
  try {
    const { error } = await supabase.auth.admin.updateUserById(estudianteId, {
      app_metadata: { [CLAVE_SESION]: activadaAt || new Date().toISOString() },
    });
    if (error) throw error;
  } catch (e) {
    console.warn('[activacion-adulto] no se pudo copiar la marca a la sesión:', e.message);
  }
}

/**
 * Guarda la activación (solo la primera; las siguientes se ignoran) y copia la
 * marca a la sesión. Lanza si la fila de evidencia no se pudo escribir.
 */
async function registrarActivacion({
  estudianteId,
  adultoId = null,
  adultoEmail = null,
  metodo,
  versionAutorizacion = null,
  invitacionId = null,
}) {
  if (!estudianteId) throw new Error('estudianteId requerido');
  if (!METODOS.includes(metodo)) throw new Error(`método de activación no válido: ${metodo}`);

  const activadaAt = new Date().toISOString();
  const { error } = await supabase.from(TABLA).upsert(
    {
      estudiante_id: estudianteId,
      adulto_id: adultoId,
      adulto_email: adultoEmail ? String(adultoEmail).trim().toLowerCase() : null,
      metodo,
      version_autorizacion: versionAutorizacion,
      invitacion_id: invitacionId,
      activada_at: activadaAt,
    },
    { onConflict: 'estudiante_id', ignoreDuplicates: true },
  );
  if (error) throw error;

  await marcarEnSesion(estudianteId, activadaAt);
}

/** Igual que registrarActivacion pero nunca lanza (para caminos secundarios). */
async function registrarActivacionSinFallar(datos) {
  try {
    await registrarActivacion(datos);
  } catch (e) {
    console.error('[activacion-adulto] no se pudo registrar la activación:', e.message);
  }
}

function leer(resultado, { tolerarAusente = false } = {}) {
  const { data, error } = resultado || {};
  if (error) {
    if (tolerarAusente && tablaAusente(error)) return null;
    throw error;
  }
  return data ?? null;
}

/**
 * Decide si el estudiante necesita que un adulto active su cuenta.
 * Devuelve { activado, exento, requiereAdulto }. Lanza si una consulta falla:
 * el middleware lo trata como "dejar pasar".
 *
 * Exentos: padres (user_type 'parent' o con hijo vinculado), cuentas de IALab,
 * cuentas que no son de IngenIA y estudiantes con 18 años o más.
 * Activados: fila de activación, o (estudiantes existentes) vínculo activo en
 * parent_student_links o consentimiento verificado en parent_consents; en ese
 * caso se registra la activación para no volver a calcularlo.
 */
async function estadoActivacion(userId) {
  const [activacionR, usuarioR, comoPadreR, estudianteR, vinculoR, consentimientoR] = await Promise.all([
    supabase.from(TABLA).select('estudiante_id').eq('estudiante_id', userId).maybeSingle(),
    supabase.from('users').select('user_type, account_type').eq('id', userId).maybeSingle(),
    supabase
      .from('parent_student_links')
      .select('student_user_id')
      .eq('parent_user_id', userId)
      .eq('is_active', true)
      .limit(1),
    supabase.from('students').select('age').eq('auth_id', userId).maybeSingle(),
    supabase
      .from('parent_student_links')
      .select('parent_user_id')
      .eq('student_user_id', userId)
      .eq('is_active', true)
      .limit(1),
    supabase
      .from('parent_consents')
      .select('parent_email')
      .eq('student_id', userId)
      .eq('verification_status', 'verified')
      .limit(1),
  ]);

  if (leer(activacionR)) {
    // Fila de evidencia sin copia en sesión (p. ej. backfill de la migración).
    marcarEnSesion(userId);
    return { activado: true, exento: false, requiereAdulto: false };
  }

  const usuario = leer(usuarioR);
  const comoPadre = leer(comoPadreR) || [];
  const estudiante = leer(estudianteR);
  const exento = { activado: false, exento: true, requiereAdulto: false };

  if (usuario?.user_type === 'parent' || comoPadre.length > 0) return exento;
  if (usuario?.account_type === 'ialab') return exento;
  if (usuario?.account_type !== 'smartboard' && !estudiante) return exento;

  const edad = estudiante?.age;
  if (edad !== null && edad !== undefined && Number(edad) >= MAYORIA_DE_EDAD) return exento;

  const vinculo = (leer(vinculoR) || [])[0];
  if (vinculo) {
    await registrarActivacionSinFallar({
      estudianteId: userId,
      adultoId: vinculo.parent_user_id,
      metodo: 'vinculo_existente',
    });
    return { activado: true, exento: false, requiereAdulto: false };
  }

  const consentimiento = (leer(consentimientoR, { tolerarAusente: true }) || [])[0];
  if (consentimiento) {
    await registrarActivacionSinFallar({
      estudianteId: userId,
      adultoEmail: consentimiento.parent_email,
      metodo: 'consentimiento_existente',
    });
    return { activado: true, exento: false, requiereAdulto: false };
  }

  return { activado: false, exento: false, requiereAdulto: true };
}

module.exports = {
  CLAVE_SESION,
  VERSION_AUTORIZACION_VIGENTE,
  VERSIONES_AUTORIZACION,
  activadoEnSesion,
  versionValida,
  registrarActivacion,
  registrarActivacionSinFallar,
  estadoActivacion,
};
