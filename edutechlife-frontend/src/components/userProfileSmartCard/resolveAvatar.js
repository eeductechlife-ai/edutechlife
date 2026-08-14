import { useEffect, useState } from "react";
import { ls } from "../../utils/ialab";
import { LS_KEYS } from "../../constants/ialab";

/**
 * Resuelve la URL del avatar del usuario.
 *
 * El modal `ChangeAvatarModal` guarda la foto en localStorage (clave scoped
 * `LS_KEYS.AVATAR`) porque la columna `avatar_url` de la tabla `users` no está
 * garantizada. Este helper da prioridad a la foto local (lo que el usuario ve
 * en el modal de cambio) y usa `profile.avatar_url` de la BD solo como
 * respaldo.
 *
 * @param {{ avatar_url?: string|null }|null} profile Fila de la tabla users
 * @returns {string|null} URL/data-uri del avatar, o null si no hay ninguno
 */
export const resolveAvatarUrl = (profile) => {
  try {
    const local = ls.get(LS_KEYS.AVATAR, null);
    if (local) return local;
  } catch {
    /* localStorage no disponible */
  }
  return profile?.avatar_url || null;
};

/**
 * Hook reactivo: devuelve la URL del avatar y se re-evalúa cuando
 * ChangeAvatarModal guarda/borra la foto (evento "avatar-updated").
 */
export const useAvatarUrl = (profile) => {
  const [avatarUrl, setAvatarUrl] = useState(() => resolveAvatarUrl(profile));

  useEffect(() => {
    setAvatarUrl(resolveAvatarUrl(profile));
    const handler = () => setAvatarUrl(resolveAvatarUrl(profile));
    window.addEventListener("avatar-updated", handler);
    return () => window.removeEventListener("avatar-updated", handler);
  }, [profile]);

  return avatarUrl;
};

export default resolveAvatarUrl;
