-- ============================================================================
-- Migration 050 — improvement_plans
-- Idempotente: CREATE IF NOT EXISTS + política/trigger con guard.
-- ============================================================================

CREATE TABLE IF NOT EXISTS improvement_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  source_snapshot JSONB DEFAULT '{}' NOT NULL,
  plan JSONB DEFAULT '{}' NOT NULL,
  progress JSONB DEFAULT '{}' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS improvement_plans_student_id_idx ON improvement_plans(student_id);

CREATE UNIQUE INDEX IF NOT EXISTS improvement_plans_student_active_idx
  ON improvement_plans(student_id) WHERE is_active = TRUE;

ALTER TABLE improvement_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'improvement_plans' AND policyname = 'students_own_improvement_plans') THEN
    CREATE POLICY "students_own_improvement_plans"
      ON improvement_plans FOR ALL TO authenticated
      USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()))
      WITH CHECK (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_improvement_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS improvement_plans_updated_at ON improvement_plans;
CREATE TRIGGER improvement_plans_updated_at
  BEFORE UPDATE ON improvement_plans
  FOR EACH ROW EXECUTE FUNCTION update_improvement_plans_updated_at();
