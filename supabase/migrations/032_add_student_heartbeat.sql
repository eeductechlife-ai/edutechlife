-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Student Heartbeat: Track last activity for online/offline status
    -- Enables parent dashboard to show if child is active in real-time
    -- last_activity updated every 60-90 seconds via heartbeat endpoint

ALTER TABLE students
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    -- Index for efficient queries on last_activity (e.g., "is_online = last_activity > NOW() - INTERVAL '2 minutes'")
CREATE INDEX IF NOT EXISTS idx_students_last_activity ON students(last_activity);

    -- Index for parent queries filtering by recent activity
CREATE INDEX IF NOT EXISTS idx_students_activity_by_school ON students(school, last_activity)
  WHERE last_activity > NOW() - INTERVAL '2 hours';

    -- RLS policy: Allow students to update their own last_activity (via heartbeat)
    -- This ensures a student can only update their own heartbeat timestamp
CREATE POLICY "Students can update their own heartbeat" ON students
  FOR UPDATE USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

    -- Comment for documentation
COMMENT ON COLUMN students.last_activity IS 'Timestamp of the student''s last activity. Updated by heartbeat endpoint every 60-90 seconds. Used to calculate is_online status (last_activity > NOW() - INTERVAL ''2 minutes'')';
  END IF;
END
$$;
