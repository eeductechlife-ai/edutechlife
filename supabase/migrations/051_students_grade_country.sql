-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'public.students') THEN
    -- Migration 051: Add grade_level and country_code to students table
    -- Purpose: Enable curriculum-aligned study plan generation (MEN Colombia and other countries)
    -- Grados: 1-11 (Básica Primaria, Básica Secundaria, Media)
    -- Default country: CO (Colombia — primary market)

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS grade_level   SMALLINT CHECK (grade_level BETWEEN 1 AND 13),
  ADD COLUMN IF NOT EXISTS country_code  TEXT     NOT NULL DEFAULT 'CO'
    CHECK (country_code ~ '^[A-Z]{2}$');

    -- grade_level 1-11 = Primaria + Bachillerato colombiano
    -- grade_level 12-13 reserved for technical/technological education (post-media)

COMMENT ON COLUMN public.students.grade_level  IS 'School grade 1-11 (Colombia: 1-5 primaria, 6-9 secundaria, 10-11 media)';
COMMENT ON COLUMN public.students.country_code IS 'ISO 3166-1 alpha-2 country code; determines curriculum standard used. Default CO (Colombia).';

    -- Index for analytics queries by grade/country
CREATE INDEX IF NOT EXISTS idx_students_grade_country
  ON public.students (country_code, grade_level);
  END IF;
END
$$;
