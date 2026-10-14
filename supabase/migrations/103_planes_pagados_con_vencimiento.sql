-- ============================================================================
-- Migración 103 — Vencimiento de planes pagados con Wompi
--
-- Wompi Web Checkout cobra una sola vez. Para que un pago mensual no deje el
-- plan activo para siempre, se guarda hasta cuándo está pagado:
--   * smartboard.students.premium_until / premium_payment_id (IngenIA, niños)
--   * public.users.plan_paid_until / subscription_id ya existente (IALab)
-- NULL = sin vencimiento (planes de Stripe, que renuevan solos, y colegios).
-- El backend apaga cada hora los planes vencidos (services/paidPlans.js).
-- Idempotente: se puede ejecutar más de una vez.
-- ============================================================================

ALTER TABLE smartboard.students ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;
ALTER TABLE smartboard.students ADD COLUMN IF NOT EXISTS premium_payment_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan_paid_until TIMESTAMPTZ;

-- La vista de compatibilidad (095) fija sus columnas al crearse: se recrea
-- para que muestre las nuevas, que quedan al final.
CREATE OR REPLACE VIEW public.students WITH (security_invoker = on) AS
  SELECT * FROM smartboard.students;

CREATE INDEX IF NOT EXISTS idx_students_premium_until
  ON smartboard.students (premium_until) WHERE premium_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_plan_paid_until
  ON public.users (plan_paid_until) WHERE plan_paid_until IS NOT NULL;
