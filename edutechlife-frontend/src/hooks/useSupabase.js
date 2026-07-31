import { useState, useEffect, useCallback, useRef } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";
import { useAuthIdentity } from "./useAuthIdentity";

/**
 * Supabase client bound to the signed-in student.
 *
 * Previously this derived the session from Clerk (`useSession`). Auth now runs
 * on Supabase, so Clerk reported no session, `userId` stayed null and every
 * consumer that gated on it — progress sync above all — silently did nothing.
 * The token now comes from the Supabase session, which is what RLS checks.
 *
 * The return shape is unchanged so existing consumers keep working.
 */
export const useSupabase = () => {
  const { userId, token, isSignedIn, isLoaded } = useAuthIdentity();
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingJWT, setIsUsingJWT] = useState(false);

  // The client is rebuilt whenever the token changes, so a fresh login does not
  // keep querying with the previous student's credentials.
  const currentTokenRef = useRef(null);

  const updateSupabaseClient = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Passing the access token makes PostgREST run as this user, so the
      // row-level-security policies on user_progress apply: a student reads and
      // writes only their own rows.
      const client = createClerkSupabaseClient(token || null);

      setSupabaseClient(client);
      setIsUsingJWT(!!token);
      currentTokenRef.current = token || null;
    } catch (err) {
      console.error("Error creando cliente Supabase:", err);
      setError(err.message);
      setSupabaseClient(createClerkSupabaseClient());
      setIsUsingJWT(false);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoaded) return;
    if (supabaseClient && currentTokenRef.current === (token || null)) return;
    updateSupabaseClient();
  }, [isLoaded, token, supabaseClient, updateSupabaseClient]);

  return {
    supabase: supabaseClient,
    isLoading: isLoading || !isLoaded,
    error,
    isUsingJWT,
    userId,
    // Kept for backwards compatibility with call sites that still read it;
    // it now reports the Supabase session, not a Clerk one.
    hasClerkSession: isSignedIn,
    isSignedIn,
    session: isSignedIn ? { userId, token } : null,
    refreshClient: updateSupabaseClient,
  };
};

export default useSupabase;
