-- ============================================================================
-- Migration 043 — students.grades_json (calificaciones persistentes)
-- Idempotente.
-- ============================================================================

ALTER TABLE students ADD COLUMN IF NOT EXISTS grades_json JSONB DEFAULT '[]'::JSONB;

CREATE INDEX IF NOT EXISTS idx_students_grades_json ON students USING GIN (grades_json);
