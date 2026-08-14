-- ============================================================================
-- Migration 027 — Suscripción del usuario en la tabla `users`
--
-- El frontend lee el plan del usuario desde `users` (usePremiumStatus →
-- useStudentProfile: `user.plan`). Tras migrar auth de Clerk a Supabase, el
-- webhook de Stripe seguía escribiendo el estado de suscripción SOLO en el
-- metadata de Clerk, que la app ya no lee — por lo que un pago nunca activaba
-- el plan premium. Estas columnas idempotentes dan al webhook un destino real
-- en Supabase. Sin ellas el UPDATE del webhook fallaría por esquema.
--
-- Idempotente y no destructiva: `plan` arranca en 'free', igual que el
-- comportamiento por defecto actual de usePremiumStatus (ningún usuario
-- existente cambia de estado al aplicarla).
-- ============================================================================

BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT;

COMMIT;
