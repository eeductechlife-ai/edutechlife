-- Migration 056: RecommendationEngine storage (brief §52)
-- Every recommendation records motivo (reason), prioridad (priority),
-- fecha (created_at), estado (status) and resultado (result_json), and can
-- point at a concrete piece of learning_content (055). This lets the engine
-- explain WHY (§14) and learn from outcomes (accepted/completed/dismissed).
-- Idempotent: CREATE TABLE IF NOT EXISTS + pg_policies-guarded RLS.

CREATE TABLE IF NOT EXISTS recommendations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type         text NOT NULL                     -- what kind of recommendation
    CHECK (type IN ('activity','content','mission','challenge','reinforcement','exploration','habit')),
  content_id   text REFERENCES learning_content(id) ON DELETE SET NULL,   -- when it points to content
  competency_id text REFERENCES competencies(id) ON DELETE SET NULL,      -- when it targets a competency
  reason       text NOT NULL,                    -- §14 explainability: WHY this now
  priority     integer NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','shown','accepted','completed','dismissed','expired')),
  result_json  jsonb NOT NULL DEFAULT '{}',      -- outcome: {score, completedAt, feedback}
  metadata     jsonb NOT NULL DEFAULT '{}',      -- engine inputs snapshot (mastery, days_since, ...)
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz
);

-- Query paths: the current queue per student, history, and expiry sweeps.
CREATE INDEX IF NOT EXISTS idx_reco_student_status
  ON recommendations (student_id, status);
CREATE INDEX IF NOT EXISTS idx_reco_student_recent
  ON recommendations (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reco_pending
  ON recommendations (student_id, priority DESC) WHERE status = 'pending';

-- ── RLS: student reads own, engine (service_role) writes ─────────────────────
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recommendations' AND policyname = 'reco_own_read'
  ) THEN
    CREATE POLICY reco_own_read ON recommendations
      FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

-- Students may update the status/result of their own recommendations
-- (e.g. mark a suggestion as dismissed or completed from the UI).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recommendations' AND policyname = 'reco_own_update'
  ) THEN
    CREATE POLICY reco_own_update ON recommendations
      FOR UPDATE USING (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      )
      WITH CHECK (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recommendations' AND policyname = 'reco_service_write'
  ) THEN
    CREATE POLICY reco_service_write ON recommendations
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
