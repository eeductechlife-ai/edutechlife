import { useState, useEffect, useCallback } from "react";
// Import estático (no dinámico): lib/supabase ya se importa estáticamente en
// ~28 módulos. Mezclar import estático + dinámico del mismo módulo crea chunks
// compartidos frágiles que Rollup enlaza mal en el build de Vercel
// ("Export 'X' is not defined" → pantalla en blanco).
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../config/api";
import { readAuthIdentity } from "./useAuthIdentity";

// Native Supabase Auth hook (replaces Clerk)
export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera la sesión desde lo que realmente persiste el login: la sesión
  // sembrada para supabase-js (localStorage) o, si no, el token de
  // sessionStorage que usa el resto de la app. Sin esto, tras el login con
  // navegación client-side el AuthProvider ya montado nunca se enteraba y
  // `useAuth().user` quedaba null (el foro pedía iniciar sesión aunque el
  // usuario estuviera logueado).
  const hydrateSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        sessionStorage.setItem("auth_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);
        try {
          const { data: profileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(profileData);
        } catch {
          /* perfil no crítico */
        }
        return;
      }
    } catch (e) {
      console.warn("hydrateSession getSession failed:", e?.message);
    }
    const identity = readAuthIdentity();
    if (identity.isSignedIn) {
      setUser({ id: identity.userId, email: identity.email });
    }
  }, []);

  // Login/logout en la MISMA pestaña: reacciona al evento que dispara el login
  // (y al signOutUser), replicando lo que antes solo ocurría con un reload.
  useEffect(() => {
    const onSignedIn = () => {
      hydrateSession();
    };
    const onSignedOut = () => {
      setUser(null);
      setProfile(null);
    };
    window.addEventListener("auth:signed-in", onSignedIn);
    window.addEventListener("auth:signout", onSignedOut);
    return () => {
      window.removeEventListener("auth:signed-in", onSignedIn);
      window.removeEventListener("auth:signout", onSignedOut);
    };
  }, [hydrateSession]);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          sessionStorage.setItem("auth_token", session.access_token);
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
          // The SmartBoard login/sign-up flows persist the backend-issued tokens
          // in localStorage without a supabase-js session. Restore that session
          // here (which also re-enables auto-refresh), instead of wiping the
          // tokens and leaving the dashboard stuck on its loading skeleton.
          const storedToken = sessionStorage.getItem("auth_token");
          const storedRefresh = localStorage.getItem("refresh_token");
          if (storedToken) {
            let restored = null;
            let restoreError = null;
            try {
              const res = await supabase.auth.setSession({
                access_token: storedToken,
                refresh_token: storedRefresh || undefined,
              });
              restored = res?.data;
              restoreError = res?.error;
            } catch (restoreErr) {
              restoreError = restoreErr;
            }
            if (restored?.user && !restoreError) {
              setUser(restored.user);
              const { data: profileData } = await supabase
                .from("users")
                .select("*")
                .eq("id", restored.user.id)
                .single();
              setProfile(profileData);
              return;
            }
            // setSession no pudo restaurar la sesión del SDK, pero el token
            // de sessionStorage puede ser válido (es lo que usa el resto de la
            // app). No lo borres: trátalo como sesión activa para no mostrar
            // "inicia sesión" a un usuario logueado.
            const identity = readAuthIdentity();
            if (identity.isSignedIn) {
              setUser({ id: identity.userId, email: identity.email });
              return;
            }
          }
          setUser(null);
          setProfile(null);
          sessionStorage.removeItem("auth_token");
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
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            sessionStorage.setItem("auth_token", session.access_token);
            localStorage.setItem("refresh_token", session.refresh_token);

            const { data: profileData } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setProfile(profileData);
          } else {
            // El SDK puede emitir INITIAL_SESSION/SIGNED_OUT con sesión null
            // tras un login que sembró la sesión a mano. Si la identidad que
            // usa el resto de la app sigue siendo válida, NO cierres sesión:
            // antes esto borraba el token y el foro pedía iniciar sesión.
            const identity = readAuthIdentity();
            if (identity.isSignedIn) {
              setUser({ id: identity.userId, email: identity.email });
              return;
            }
            setUser(null);
            setProfile(null);
            sessionStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }
        },
      );

      return subscription;
    };

    let listener;
    setupListener().then((l) => {
      listener = l;
    });

    return () => {
      listener?.unsubscribe?.();
    };
  }, []);

  // Sign up
  const signUp = useCallback(
    async ({
      email,
      password,
      username,
      firstName,
      lastName,
      accountType = "ialab",
    }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            username,
            firstName,
            lastName,
            accountType,
          }),
        });

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

  // Sign in — retries on network errors (Render cold start)
  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);

    let lastError = null;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, attempt * 2000));
        }
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        });
        clearTimeout(tid);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Sign in failed");
        }

        sessionStorage.setItem("auth_token", data.token);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem(
          "student_name",
          data.user.username || data.user.email.split("@")[0],
        );

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

        Promise.resolve(
          supabase.auth.setSession({
            access_token: data.token,
            refresh_token: data.refreshToken,
          }),
        ).catch((err) =>
          console.warn(
            "Supabase session sync failed (non-blocking):",
            err.message,
          ),
        );

        return data;
      } catch (e) {
        lastError = e;
        if (
          attempt < 2 &&
          (e.name === "AbortError" || e.name === "TypeError")
        ) {
          continue;
        }
        break;
      }
    }

    const msg =
      lastError?.name === "AbortError" || lastError?.name === "TypeError"
        ? "Error de conexión. Verifica tu internet e intenta de nuevo."
        : lastError?.message || "Sign in failed";
    setError(msg);
    throw new Error(msg);
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("auth_token");
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
