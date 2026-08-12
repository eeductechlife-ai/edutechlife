-- ============================================================================
-- Migration 026 — Perfil de usuario: garantizar columnas de edición
-- El UserMenu de IALab guarda nombre y teléfono del perfil. La tabla `users`
-- se creó sin `phone_number` (supabase_auth_users_native.sql) y en algunos
-- entornos la BD se construyó a mano con drift. Estas columnas idempotentes
-- garantizan que el UPDATE del perfil no falle por esquema.
-- ============================================================================

BEGIN;

-- --- users: columnas usadas por useProfileData.js ---------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- --- profiles (tabla poblada por el trigger handle_new_user) ----------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

COMMIT;
