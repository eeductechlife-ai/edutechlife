-- Migration 057: Feedback emocional log (brief §47)
-- Persists the student's emotional self-report after each activity
-- (OralExam result, Flashcard result, ExamPrep result). Used to track
-- wellbeing over time and adapt difficulty/pace.

CREATE TABLE IF NOT EXISTS feedback_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  activity    text NOT NULL CHECK (activity IN (
    'oral_exam','flashcard','exam_prep','challenge','mission','general'
  )),
  emotion     text NOT NULL CHECK (emotion IN (
    'happy','neutral','frustrated','confused','proud','tired'
  )),
  score       numeric,
  context     jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_student
  ON feedback_log (student_id, created_at DESC);

ALTER TABLE feedback_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'feedback_log' AND policyname = 'feedback_own_read'
  ) THEN
    CREATE POLICY feedback_own_read ON feedback_log
      FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'feedback_log' AND policyname = 'feedback_own_insert'
  ) THEN
    CREATE POLICY feedback_own_insert ON feedback_log
      FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'feedback_log' AND policyname = 'feedback_service_all'
  ) THEN
    CREATE POLICY feedback_service_all ON feedback_log
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
