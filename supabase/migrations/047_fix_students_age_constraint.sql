-- ============================================================================
-- Migration 047 — Fix students.age CHECK constraint
-- El CHECK inline de 011 se auto-nombró students_age_check. La API acepta 5-25;
-- la BD rechazaba fuera de 6-16. Aquí se reemplaza por 5-25. Idempotente.
-- ============================================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'students_age_check' AND conrelid = 'public.students'::regclass) THEN
    ALTER TABLE public.students DROP CONSTRAINT students_age_check;
  END IF;
END $$;

-- Forma literal por si el constraint se creó con ese nombre explícito.
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS "age >= 6 AND age <= 16";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'students_age_check' AND conrelid = 'public.students'::regclass) THEN
    ALTER TABLE public.students ADD CONSTRAINT students_age_check CHECK (age >= 5 AND age <= 25);
  END IF;
END $$;
