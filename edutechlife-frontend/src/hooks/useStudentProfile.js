import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthIdentity } from "./useAuthIdentity";

/**
 * Profile of the signed-in student, read from the `users` table.
 *
 * Replaces the Clerk profile (`clerkUser.publicMetadata.role`, `username`,
 * `firstName`…). With auth on Supabase, Clerk returns no user at all, so role
 * checks silently fell back to "student" — including the admin check, which
 * meant nobody had admin rights in IALab.
 *
 * @returns {{profile: object|null, role: string, isAdmin: boolean,
 *            displayName: string, isLoading: boolean}}
 */
/**
 * Accounts with admin rights inside IALab. The Clerk implementation hardcoded
 * the username "johnbeltran22"; this keeps that account as admin and adds its
 * email so the check survives a username change.
 */
const ADMIN_USERNAMES = ["johnbeltran22"];
const ADMIN_EMAILS = ["eeductechlife@gmail.com"];

const isAdminAccount = (profile) => {
  if (!profile) return false;
  const username = (profile.username || "").toLowerCase();
  const email = (profile.email || "").toLowerCase();
  return ADMIN_USERNAMES.includes(username) || ADMIN_EMAILS.includes(email);
};

export const useStudentProfile = () => {
  const { userId, email, isSignedIn } = useAuthIdentity();
  const [fetched, setFetched] = useState({
    email: null,
    profile: null,
    userRole: null,
  });

  useEffect(() => {
    if (!isSignedIn || !email) return undefined;

    let cancelled = false;
    (async () => {
      try {
        // Obtener perfil del usuario desde tabla `users`
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        // Obtener rol desde tabla `user_roles` si existe
        let userRole = null;
        if (userId) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .maybeSingle();
          userRole = roleData?.role || null;
        }

        if (!cancelled) setFetched({ email, profile: data || null, userRole });
      } catch (err) {
        // A missing profile must not block access to the course.
        console.error("useStudentProfile:", err.message);
        if (!cancelled) setFetched({ email, profile: null, userRole: null });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, email, userId]);

  // Derived, not stored: avoids a render pass where a previous account's
  // profile is still showing after switching users.
  const profile =
    isSignedIn && fetched.email === email ? fetched.profile : null;
  const isLoading = isSignedIn ? fetched.email !== email : false;

  // `user_type` describes the audience (adult/kid), not permissions, so it is
  // not a role. Admins are recognised by:
  // 1. Explicit role in `user_roles` table (highest priority)
  // 2. Role column in `users` table
  // 3. Known admin account (username or email)
  const role =
    fetched.userRole ||
    profile?.role ||
    (isAdminAccount(profile) ? "admin" : "student");

  return {
    profile,
    role,
    isAdmin: role === "admin",
    displayName:
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      profile?.username ||
      email ||
      "",
    isLoading,
  };
};

export default useStudentProfile;
