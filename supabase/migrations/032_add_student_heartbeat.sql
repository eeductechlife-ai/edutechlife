-- Idempotent: Student Heartbeat tracking — only if students table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Add column for tracking last activity
    ALTER TABLE students ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    -- Indexes for efficient queries
    CREATE INDEX IF NOT EXISTS idx_students_last_activity ON students(last_activity);
    CREATE INDEX IF NOT EXISTS idx_students_activity_by_school ON students(school, last_activity)
      WHERE last_activity > NOW() - INTERVAL '2 hours';

    -- RLS policy for heartbeat updates (guard: CREATE POLICY no soporta IF NOT EXISTS)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students' AND policyname = 'Students can update their own heartbeat') THEN
      CREATE POLICY "Students can update their own heartbeat" ON students
        FOR UPDATE USING (auth_id = auth.uid())
        WITH CHECK (auth_id = auth.uid());
    END IF;

    -- Comment for documentation
    COMMENT ON COLUMN students.last_activity IS 'Timestamp of the student''s last activity. Updated every 60-90 seconds.';
  END IF;
END
$$;
