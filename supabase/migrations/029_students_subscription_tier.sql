-- ============================================================================
-- Migration 029 — `students.subscription_tier` (corrige drift de esquema)
--
-- La migración 011 definía `subscription_tier` en `students`, pero la tabla de
-- producción se construyó a mano sin esa columna (verificado vía PostgREST:
-- 42703 column students.subscription_tier does not exist).
--
-- El webhook de Stripe enruta el plan SmartBoard (smartboard_premium) a
-- `students.subscription_tier`; sin esta columna, activar premium para un niño
-- falla en silencio. Esta migración idempotente y no destructiva la restaura
-- con el mismo default y CHECK que 011.
-- ============================================================================

BEGIN;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- CHECK alineado con la definición original (011), tolerante a reejecución.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'students_subscription_tier_check'
  ) THEN
    ALTER TABLE students
      ADD CONSTRAINT students_subscription_tier_check
      CHECK (subscription_tier IN ('free', 'premium', 'premium_plus', 'institutional'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_students_subscription ON students(subscription_tier);

COMMIT;
