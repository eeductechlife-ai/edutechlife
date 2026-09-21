/**
 * Display helpers for the signed-in user.
 *
 * Replaces `getClerkUserInfo`, which expected Clerk's user shape
 * (`fullName`, `primaryEmailAddress.emailAddress`). Profiles now come from the
 * Supabase `users` table (`first_name`, `last_name`, `email`, `username`), so
 * the old helper silently fell through to its "Usuario" placeholder for
 * everyone.
 *
 * @param {object|null} profile row from the `users` table
 * @param {string} [fallbackEmail] email from the session, when the profile row
 *   has not loaded yet
 * @returns {{initials: string, displayName: string, displayEmail: string, avatarUrl: string|null}}
 */
/**
 * Deriva un nombre legible a partir del correo, para cuando el perfil no
 * trae nombre. "juan.perez99@gmail.com" → "Juan Perez".
 *
 * @param {string} email
 * @returns {string} nombre derivado o "" si no hay nada utilizable
 */
export const deriveNameFromEmail = (email = "") => {
  const local = String(email).trim().split("@")[0] || "";
  const cleaned = local
    .replace(/[._\-+]+/g, " ")
    .replace(/\d+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getUserInfo = (profile, fallbackEmail = "") => {
  const email = (profile?.email || fallbackEmail || "").trim();

  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const displayName =
    fullName || profile?.username || deriveNameFromEmail(email) || "Usuario";

  const initials = (() => {
    if (fullName) {
      const parts = fullName.split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (profile?.username) return profile.username[0].toUpperCase();
    const derived = deriveNameFromEmail(email);
    if (derived) {
      const parts = derived.split(/\s+/);
      return (
        parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0]
      ).toUpperCase();
    }
    return "U";
  })();

  return {
    initials,
    displayName,
    displayEmail: email || "",
    avatarUrl: profile?.avatar_url || null,
  };
};

export default getUserInfo;
