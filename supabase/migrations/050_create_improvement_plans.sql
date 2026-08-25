-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'IF') THEN
    -- Migration 050: Create improvement_plans table for SmartBoard student improvement tracking
    -- Each student has one active improvement plan generated from VAK + grades + upcoming exams

CREATE TABLE IF NOT EXISTS improvement_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  source_snapshot JSONB DEFAULT '{}' NOT NULL,
  -- source_snapshot contains: { vak: {predominantStyle, scores}, grades: [...], exams: [...] }
  plan JSONB DEFAULT '{}' NOT NULL,
  -- plan contains: { weeks: [{week, focus, activities: [{title, duration, type, done}], daniTip}],
  --                 topActions: [], weakSubjects: [] }
  progress JSONB DEFAULT '{}' NOT NULL,
  -- progress contains: { activitiesDone: 0, totalActivities: 0, weeklyProgress: {} }
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

    -- Index for fast lookup by student
CREATE INDEX IF NOT EXISTS improvement_plans_student_id_idx
  ON improvement_plans(student_id);

    -- Only one active plan per student
CREATE UNIQUE INDEX IF NOT EXISTS improvement_plans_student_active_idx
  ON improvement_plans(student_id)
  WHERE is_active = TRUE;

    -- Enable Row Level Security
ALTER TABLE improvement_plans ENABLE ROW LEVEL SECURITY;

    -- Policy: authenticated users can only access their own plans
    -- (student_id → students.id → students.auth_id = auth.uid())
CREATE POLICY "students_own_improvement_plans"
  ON improvement_plans
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE auth_id = auth.uid()
    )
  );

    -- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_improvement_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER improvement_plans_updated_at
  BEFORE UPDATE ON improvement_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_improvement_plans_updated_at();
  END IF;
END
$$;
