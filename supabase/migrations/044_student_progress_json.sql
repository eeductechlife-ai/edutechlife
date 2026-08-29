-- ============================================================================
-- Migration 044 — students.progress_json (avance de materias)
-- Idempotente.
-- ============================================================================

ALTER TABLE students ADD COLUMN IF NOT EXISTS progress_json JSONB DEFAULT '{}'::JSONB;

CREATE INDEX IF NOT EXISTS idx_students_progress_json ON students USING GIN (progress_json);
