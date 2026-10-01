import { createClient } from "@supabase/supabase-js";

// Respaldo de autenticación cuando el backend (Render) no responde: alta e
// inicio de sesión directos contra Supabase Auth. El trigger
// public.handle_new_user crea las filas de profiles/users a partir de los
// metadatos, igual que el alta vía backend.
//
// Cliente propio sin persistencia: no toca el cliente compartido ni su lock
// interno (ver seedClientSession en SupabaseLoginForm); la sesión la siembran
// los formularios como con la respuesta del backend.

// Roles con MFA gestionado por el backend (mfaService.MFA_ROLES). El respaldo
// no puede verificar el segundo factor, así que no inicia sesión por ellos.
const MFA_ROLES = ["admin", "parent", "educator"];

let _client = null;
const directClient = () => {
  if (!_client) {
    _client = createClient(
      import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
      import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }
  return _client;
};

/** true si la respuesta indica backend caído/suspendido (5xx o no-JSON). */
export const isBackendUnavailable = (response) => {
  if (!response) return true;
  if (response.status >= 500) return true;
  const type = response.headers?.get?.("content-type") || "";
  return !type.includes("application/json");
};

const toResult = (session, user) => ({
  token: session?.access_token || null,
  refreshToken: session?.refresh_token || null,
  user: { id: user?.id, email: user?.email },
});

export async function directSignUp({
  email,
  password,
  username,
  firstName,
  lastName,
  accountType,
}) {
  const product = accountType === "smartboard" ? "smartboard" : "ialab";
  const { data, error } = await directClient().auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || email.split("@")[0],
        first_name: firstName,
        last_name: lastName,
        // El trigger handle_new_user usa full_name para profiles.full_name; sin
        // él cae al prefijo del correo, que luego se ve en foro y ranking.
        full_name:
          [firstName, lastName].filter(Boolean).join(" ").trim() || undefined,
        account_type: product,
        platform: product,
        registration_source:
          product === "smartboard" ? "smartboard_signup" : "ialab_signup",
      },
    },
  });
  if (error) {
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      const dup = new Error("email_already_registered");
      dup.code = "email_already_registered";
      throw dup;
    }
    throw error;
  }
  // Con confirmación de correo activa, Supabase no devuelve sesión y además
  // oculta los duplicados como un usuario sin identidades.
  if (!data.session && data.user && data.user.identities?.length === 0) {
    const dup = new Error("email_already_registered");
    dup.code = "email_already_registered";
    throw dup;
  }
  return toResult(data.session, data.user);
}

export async function directSignIn(identifier, password) {
  // Resolver usernames requiere el backend; sin él solo se admite correo.
  if (!identifier || !identifier.includes("@")) {
    const err = new Error("username_requires_backend");
    err.code = "username_requires_backend";
    throw err;
  }
  const client = directClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: identifier.trim().toLowerCase(),
    password,
  });
  if (error) {
    const msg = (error.message || "").toLowerCase();
    const err = new Error(error.message);
    err.code = msg.includes("not confirmed")
      ? "email_not_confirmed"
      : "invalid_credentials";
    throw err;
  }

  // Falla cerrado: si no se puede confirmar que la cuenta no usa MFA, no se
  // entrega la sesión.
  const { data: profile, error: profileError } = await client
    .from("users")
    .select("user_type, mfa_enabled")
    .eq("id", data.user.id)
    .maybeSingle();
  if (
    profileError ||
    (profile?.mfa_enabled && MFA_ROLES.includes(profile.user_type))
  ) {
    await client.auth.signOut({ scope: "local" }).catch(() => {});
    const err = new Error("mfa_requires_backend");
    err.code = "mfa_requires_backend";
    throw err;
  }
  return toResult(data.session, data.user);
}
