// Datos de estudiantes (chats de Dani, notas, memoria, plan, resultado del ADN…)
// que IngenIA guarda en el navegador bajo claves terminadas en el id del usuario:
//   edutechlife_<nombre>_<uuid>   improvement_plan_<uuid>
// El servidor tiene la copia buena; esto es solo caché. Si queda ahí después de
// cerrar sesión, la siguiente persona del mismo computador puede leerlo.
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const PER_USER_KEY = new RegExp(
  `^(?:edutechlife_.+|improvement_plan)_(${UUID})$`,
  "i",
);

// Claves sin dueño que identifican a la última persona que entró.
const SIGNED_IN_GLOBALS = [
  "refresh_token",
  "student_name",
  "student_age",
  "student_grade",
  "edutechlife_student_info",
];

/**
 * Borra los datos de estudiantes guardados en el navegador.
 *
 * - Sin `keepUserId` (cerrar sesión): borra los de todas las cuentas y las
 *   claves globales de la última sesión.
 * - Con `keepUserId` (iniciar sesión): borra solo los de OTRAS cuentas que
 *   hayan quedado de antes y respeta los de la cuenta actual.
 *
 * @returns {number} cuántas claves borró
 */
export function clearIngenIAUserData({ keepUserId = null } = {}) {
  let removed = 0;
  try {
    const keep = keepUserId ? String(keepUserId).toLowerCase() : null;
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const match = key.match(PER_USER_KEY);
      if (match && (!keep || match[1].toLowerCase() !== keep)) doomed.push(key);
    }
    if (!keep) {
      SIGNED_IN_GLOBALS.forEach((key) => {
        if (localStorage.getItem(key) !== null) doomed.push(key);
      });
    }
    doomed.forEach((key) => {
      localStorage.removeItem(key);
      removed += 1;
    });
  } catch {
    /* modo privado o almacenamiento bloqueado: no hay nada que limpiar */
  }
  return removed;
}
