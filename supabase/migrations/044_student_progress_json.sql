-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- ============================================================================
    -- Migration 044 — Student Progress JSON (Avance de Materias)
--
    -- Adds progress_json column to students table to persist subject time and session data.
    -- Fallback for SmartBoard progress tracking across sessions and devices.
    -- ============================================================================

BEGIN;

    -- Add progress_json column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS progress_json JSONB DEFAULT '{}'::JSONB;

    -- Index for progress lookups
CREATE INDEX IF NOT EXISTS idx_students_progress_json ON students USING GIN (progress_json);

COMMIT;
  END IF;
END
$$;
  END IF;
END
$$;
