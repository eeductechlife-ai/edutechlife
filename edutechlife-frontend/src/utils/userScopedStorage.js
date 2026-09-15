/**
 * Per-user localStorage scoping.
 *
 * IALab progress (XP, streak, badges, module/course progress, exam results)
 * lives only in localStorage — there is no server-side progress table. Those
 * values used to be written under fixed keys such as `ialab-store`, so every
 * account signing in from the same browser read and wrote the *same* record:
 * three different students all saw one shared progress.
 *
 * Keys are namespaced with the signed-in user's identity so each account keeps
 * its own record on the device. Signed-out visitors fall back to `anon`.
 */

const OWNER_KEY = "ialab_storage_owner";

/** Identity of the signed-in user, or "anon" when signed out. */
export const getCurrentUserKey = () => {
  try {
    const email = localStorage.getItem("user_email");
    return email ? email.trim().toLowerCase() : "anon";
  } catch {
    return "anon";
  }
};

/** Namespaced key for the current user, e.g. `ialab-store::ana@x.com`. */
export const scopedKey = (baseKey) => `${baseKey}::${getCurrentUserKey()}`;

/** Read a user-scoped value. */
export const scopedGet = (baseKey) => {
  try {
    return localStorage.getItem(scopedKey(baseKey));
  } catch {
    return null;
  }
};

/** Write a user-scoped value. */
export const scopedSet = (baseKey, value) => {
  try {
    localStorage.setItem(scopedKey(baseKey), value);
  } catch {
    /* quota or private mode — losing a cached value must not break the app */
  }
};

/** Remove a user-scoped value. */
export const scopedRemove = (baseKey) => {
  try {
    localStorage.removeItem(scopedKey(baseKey));
  } catch {
    /* ignore */
  }
};

/**
 * Storage adapter for Zustand's `persist` middleware.
 * Resolves the user on every access, so it always follows the active account.
 */
export const createUserScopedStorage = () => ({
  getItem: (name) => scopedGet(name),
  setItem: (name, value) => scopedSet(name, value),
  removeItem: (name) => scopedRemove(name),
});

/**
 * Legacy keys written before scoping existed. They belong to whoever happened
 * to use the browser first, so they are cleared once a different account signs
 * in — otherwise the first user's progress leaks into everyone else's session.
 */
const LEGACY_UNSCOPED_KEYS = [
  "ialab-store",
  "ialab_adaptive_v1",
  "ialab_completed_exams",
  "ialab_avatar",
  "ialab_notifications",
  "ialab_notif_prefs",
  "ialab_forum_notifications",
  "ialab_last_activity_date",
  "ialab_last_study_reminder",
  "edutechlife_student_data",
  "edutechlife_student_info",
];

// Claves de progreso "legacy" sin scope que antes eran compartidas entre
// cuentas. Antes de borrarlas, se migran a la clave por cuenta para no perder
// las notas/avance del usuario al iniciar sesión.
const LEGACY_PROGRESS_KEYS = [
  "ialab_completed_videos",
  "ialab_completed_modules",
  "ialab_completed_exams",
  "ialab_completed_infographics",
  "ialab_completed_activities",
  "ialab_challenge_scores",
  "ialab_completed_community",
  "ialab_overall_progress",
  "ialab_last_activity_date",
  "ialab_last_viewed_topic",
];

const LEGACY_UNSCOPED_PREFIXES = [
  "exam_attempts_remaining_m",
  "exam_next_attempt_m",
];

/**
 * Call right after the signed-in identity changes.
 *
 * Returns true when the account is different from the one the cached data
 * belongs to, meaning the caller should reload so stores rehydrate under the
 * new namespace instead of keeping the previous user's in-memory state.
 */
export const claimStorageForCurrentUser = () => {
  let previousOwner = null;
  try {
    previousOwner = localStorage.getItem(OWNER_KEY);
  } catch {
    return false;
  }

  const currentOwner = getCurrentUserKey();
  if (previousOwner === currentOwner) return false;

  try {
    // Primero migrar el progreso legacy a la clave por cuenta (si esa cuenta
    // aún no tiene dato), y luego limpiar las claves sin scope. Sin este paso,
    // borrar `ialab_completed_exams` (nota del reto) hacía "desaparecer" las
    // notas al reingresar.
    LEGACY_PROGRESS_KEYS.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw === null) return;
      const scoped = scopedKey(key);
      if (localStorage.getItem(scoped) === null) {
        localStorage.setItem(scoped, raw);
      }
      localStorage.removeItem(key);
    });
    LEGACY_UNSCOPED_KEYS.forEach((key) => localStorage.removeItem(key));
    Object.keys(localStorage)
      .filter((key) =>
        LEGACY_UNSCOPED_PREFIXES.some((prefix) => key.startsWith(prefix)),
      )
      .forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(OWNER_KEY, currentOwner);
  } catch {
    /* ignore */
  }

  // Only a real account switch needs a reload; the first claim on a fresh
  // browser has nothing stale to discard.
  return previousOwner !== null;
};
