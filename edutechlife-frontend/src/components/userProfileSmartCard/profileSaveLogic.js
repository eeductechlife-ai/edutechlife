/**
 * Lógica pura del guardado de perfil (nombre/teléfono) del UserMenu.
 * Separada del hook para poder testear el comportamiento sin Supabase.
 */

/**
 * Decide si el botón "Guardar cambios" debe estar deshabilitado.
 *
 * Un error de teléfono NO debe bloquear el guardado: el nombre es un campo
 * independiente y el usuario siempre debe poder guardarlo aunque el teléfono
 * esté incompleto (el teléfono se guarda por separado y de forma tolerante).
 *
 * @param {{ isSaving: boolean }} state
 * @returns {boolean}
 */
export const shouldDisableSave = ({ isSaving }) => Boolean(isSaving);

/**
 * Normaliza un teléfono a solo dígitos.
 * @param {string|null|undefined} phone
 * @returns {string}
 */
export const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
};
