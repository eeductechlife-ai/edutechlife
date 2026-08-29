-- ============================================================================
-- Migration 033 — parent_alerts (notificaciones en tiempo real al padre)
-- Idempotente: CREATE IF NOT EXISTS + políticas con guard.
-- ============================================================================

CREATE TABLE IF NOT EXISTS parent_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('crisis', 'achievement', 'milestone', 'offline', 'unusual_activity')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_parent_student_link FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_parent_alerts_parent ON parent_alerts(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_student ON parent_alerts(student_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_created ON parent_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_type ON parent_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_read ON parent_alerts(read_at);
CREATE INDEX IF NOT EXISTS idx_parent_alerts_parent_read ON parent_alerts(parent_user_id, read_at);

ALTER TABLE parent_alerts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts' AND policyname = 'Parents read own alerts') THEN
    CREATE POLICY "Parents read own alerts" ON parent_alerts FOR SELECT
      USING (auth.uid()::TEXT = parent_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts' AND policyname = 'Parents update own alerts') THEN
    CREATE POLICY "Parents update own alerts" ON parent_alerts FOR UPDATE
      USING (auth.uid()::TEXT = parent_user_id)
      WITH CHECK (auth.uid()::TEXT = parent_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts' AND policyname = 'Parents delete own alerts') THEN
    CREATE POLICY "Parents delete own alerts" ON parent_alerts FOR DELETE
      USING (auth.uid()::TEXT = parent_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parent_alerts' AND policyname = 'Service role manage alerts') THEN
    CREATE POLICY "Service role manage alerts" ON parent_alerts FOR ALL
      TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
