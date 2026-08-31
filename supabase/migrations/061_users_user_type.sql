-- ============================================================================
-- Migration 061 — users.user_type (schema drift)
-- El backend (routes/auth.js) inserta `user_type` en `users`; la tabla base
-- (000) no lo tenía. Idempotente.
-- ============================================================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_type TEXT;
