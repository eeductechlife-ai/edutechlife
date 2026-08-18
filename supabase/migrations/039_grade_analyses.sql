-- ============================================================================
-- Migration 039 — grade_analyses
--
-- Stores AI-generated grade analysis results from the SmartBoard GradeScanner.
-- Each row is one analysis session: the grades input + AI plan output.
-- RLS: students can only read/write their own analyses.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS grade_analyses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT     NOT NULL,
  grades       JSONB       NOT NULL,   -- [{subject, score}, ...]
  plan         JSONB       NOT NULL,   -- {overall, strengths, weaknesses, studyPlan, motivation}
  avg_score    DECIMAL(3,1),
  vak_style    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grade_analyses_student ON grade_analyses(student_user_id);
CREATE INDEX IF NOT EXISTS idx_grade_analyses_created ON grade_analyses(created_at DESC);

ALTER TABLE grade_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own analyses" ON grade_analyses
  FOR SELECT USING (auth.uid()::TEXT = student_user_id);

CREATE POLICY "Students insert own analyses" ON grade_analyses
  FOR INSERT WITH CHECK (auth.uid()::TEXT = student_user_id);

CREATE POLICY "Students delete own analyses" ON grade_analyses
  FOR DELETE USING (auth.uid()::TEXT = student_user_id);

COMMIT;
