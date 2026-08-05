import { useState, useEffect, useCallback } from "react";

// Native Supabase Auth hook (replaces Clerk)
export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { supabase } = await import("../lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("auth_token", session.access_token);
          localStorage.setItem("refresh_token", session.refresh_token);
          localStorage.setItem(
            "student_name",
            session.user.email?.split("@")[0] || "Estudiante",
          );

          // Fetch profile
          const { data: profileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (e) {
        console.error("Auth init error:", e.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const setupListener = async () => {
      const { supabase } = await import("../lib/supabase");
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            localStorage.setItem("auth_token", session.access_token);
            localStorage.setItem("refresh_token", session.refresh_token);

            const { data: profileData } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setProfile(profileData);
          } else {
            setUser(null);
            setProfile(null);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }
        },
      );

      return listener;
    };

    let listener;
    setupListener().then((l) => {
      listener = l;
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  // Sign up
  const signUp = useCallback(
    async ({ email, password, username, firstName, lastName }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              username,
              firstName,
              lastName,
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Sign up failed");
        }

        return data;
      } catch (e) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Sign in
  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://edutechlife-backend.onrender.com"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign in failed");
      }

      // Store tokens
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem(
        "student_name",
        data.user.username || data.user.email.split("@")[0],
      );

      // Set local state immediately (no need to wait for supabase session)
      setUser({
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          username: data.user.username,
          first_name: data.user.firstName,
          last_name: data.user.lastName,
        },
      });
      setProfile(data.user);

      // Trigger supabase session update in background (non-blocking)
      import("../lib/supabase")
        .then(({ supabase }) =>
          supabase.auth.setSession({
            access_token: data.token,
            refresh_token: data.refreshToken,
          }),
        )
        .catch((err) =>
          console.warn(
            "Supabase session sync failed (non-blocking):",
            err.message,
          ),
        );

      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("student_name");
      setUser(null);
      setProfile(null);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isSignedIn: !!user,
    userId: user?.id,
    email: user?.email,
    signUp,
    signIn,
    signOut,
  };
};
