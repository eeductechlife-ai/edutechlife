import { useState, useEffect, useCallback } from "react";

/**
 * Identity of the signed-in student, sourced from the Supabase session.
 *
 * Auth moved from Clerk to Supabase, but the IALab hooks kept reading the
 * identity from Clerk's `useUser()` / `useAuth()`. With no Clerk session those
 * returned null, so `isSignedIn` was never true and progress sync never ran —
 * students' work was never written to Supabase. This reads the identity from
 * the Supabase access token instead, which is what actually authenticates now.
 *
 * @returns {{userId: string|null, email: string|null, token: string|null,
 *            isSignedIn: boolean, isLoaded: boolean, refresh: () => void}}
 */

/** Decode a JWT payload without verifying it (the server verifies on every call). */
const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/** Read the current identity straight from storage. Safe to call anywhere. */
export const readAuthIdentity = () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token)
      return { userId: null, email: null, token: null, isSignedIn: false };

    const payload = decodeJwtPayload(token);
    if (!payload?.sub) {
      return { userId: null, email: null, token: null, isSignedIn: false };
    }

    // An expired token cannot authenticate anything; treat it as signed out so
    // callers fall back to local-only behaviour instead of firing doomed writes.
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { userId: null, email: null, token: null, isSignedIn: false };
    }

    return {
      userId: payload.sub,
      email:
        (
          payload.email ||
          localStorage.getItem("user_email") ||
          ""
        ).toLowerCase() || null,
      token,
      isSignedIn: true,
    };
  } catch {
    return { userId: null, email: null, token: null, isSignedIn: false };
  }
};

export const useAuthIdentity = () => {
  const [identity, setIdentity] = useState(() => readAuthIdentity());

  const refresh = useCallback(() => setIdentity(readAuthIdentity()), []);

  useEffect(() => {
    // Sign-in/out in another tab must be reflected here too.
    const onStorage = (event) => {
      if (
        !event.key ||
        event.key === "auth_token" ||
        event.key === "user_email"
      ) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  // The session is read synchronously from storage, so it is already resolved
  // on the first render. Callers kept this flag from the Clerk era, where the
  // session arrived asynchronously.
  return { ...identity, isLoaded: true, refresh };
};

export default useAuthIdentity;
