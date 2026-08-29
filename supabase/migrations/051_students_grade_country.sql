-- ============================================================================
-- Migration 051 — students.grade_level + country_code
-- Idempotente.
-- ============================================================================

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS grade_level SMALLINT CHECK (grade_level BETWEEN 1 AND 13),
  ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'CO'
    CHECK (country_code ~ '^[A-Z]{2}$');

COMMENT ON COLUMN public.students.grade_level  IS 'School grade 1-11 (Colombia: 1-5 primaria, 6-9 secundaria, 10-11 media)';
COMMENT ON COLUMN public.students.country_code IS 'ISO 3166-1 alpha-2 country code; determines curriculum standard used. Default CO (Colombia).';

CREATE INDEX IF NOT EXISTS idx_students_grade_country
  ON public.students (country_code, grade_level);
