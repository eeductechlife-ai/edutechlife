-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- ============================================================================
    -- Migration 043 — Student Grades JSON (Calificaciones Persistentes)
--
    -- Adds grades_json column to students table to persist grade data across sessions.
    -- Fallback for GradeScanner when localStorage is lost or across devices.
    -- ============================================================================

BEGIN;

    -- Add grades_json column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS grades_json JSONB DEFAULT '[]'::JSONB;

    -- Index for quick lookups (optional, but useful for analytics)
CREATE INDEX IF NOT EXISTS idx_students_grades_json ON students USING GIN (grades_json);

COMMIT;
  END IF;
END
$$;
