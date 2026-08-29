-- ============================================================================
-- Migration 037 — Predictive Analytics & Parent Alerts
-- Idempotente. Se eliminan FKs text→uuid inválidos. compute_risk_scores()
-- corregido para leer las tablas reales (sessions, learning_streaks,
-- points_history.student_id) y calcular days_inactive real.
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL UNIQUE,
  engagement_score NUMERIC(5, 2) DEFAULT 50,
  performance_score NUMERIC(5, 2) DEFAULT 50,
  emotional_risk_score NUMERIC(5, 2) DEFAULT 0,
  overall_risk_level VARCHAR(20) DEFAULT 'low',
  days_inactive INTEGER DEFAULT 0,
  recent_point_velocity NUMERIC(8, 2) DEFAULT 0,
  streak_broken_count INTEGER DEFAULT 0,
  predicted_churn_probability NUMERIC(5, 2) DEFAULT 0,
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictive_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recommendation TEXT,
  data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  action_taken BOOLEAN DEFAULT false,
  action_taken_at TIMESTAMPTZ,
  action_type VARCHAR(50),
  CONSTRAINT fk_alert_link FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_gap_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  gap_type VARCHAR(50) NOT NULL,
  confidence_score NUMERIC(5, 2) DEFAULT 0,
  recommended_resource TEXT,
  priority_level VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actioned_at TIMESTAMPTZ,
  resource_completed BOOLEAN DEFAULT false,
  UNIQUE(student_user_id, subject_name, gap_type)
);

CREATE TABLE IF NOT EXISTS alert_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES predictive_alerts(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_description TEXT,
  action_result VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

CREATE TABLE IF NOT EXISTS prediction_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC(8, 4),
  computed_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  UNIQUE(model_version, metric_name, computed_date)
);

CREATE INDEX IF NOT EXISTS idx_risk_scores_level ON student_risk_scores(overall_risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_scores_churn ON student_risk_scores(predicted_churn_probability DESC);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_parent ON predictive_alerts(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_student ON predictive_alerts(student_user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_created ON predictive_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_severity ON predictive_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_unread ON predictive_alerts(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_learning_gaps_student ON learning_gap_predictions(student_user_id);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_subject ON learning_gap_predictions(subject_name);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_confidence ON learning_gap_predictions(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_alert_actions_alert ON alert_actions(alert_id);
CREATE INDEX IF NOT EXISTS idx_prediction_metrics_date ON prediction_metrics(computed_date DESC);

ALTER TABLE student_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_gap_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_metrics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_risk_scores' AND policyname = 'risk_scores_own') THEN
    CREATE POLICY "risk_scores_own" ON student_risk_scores
      FOR SELECT USING (student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'predictive_alerts' AND policyname = 'predictive_alerts_parent_or_student') THEN
    CREATE POLICY "predictive_alerts_parent_or_student" ON predictive_alerts
      FOR SELECT USING (parent_user_id = auth.uid()::TEXT OR student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'predictive_alerts' AND policyname = 'predictive_alerts_parent_insert') THEN
    CREATE POLICY "predictive_alerts_parent_insert" ON predictive_alerts
      FOR INSERT WITH CHECK (parent_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'predictive_alerts' AND policyname = 'predictive_alerts_parent_update') THEN
    CREATE POLICY "predictive_alerts_parent_update" ON predictive_alerts
      FOR UPDATE USING (parent_user_id = auth.uid()::TEXT OR student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'learning_gap_predictions' AND policyname = 'learning_gaps_own') THEN
    CREATE POLICY "learning_gaps_own" ON learning_gap_predictions
      FOR SELECT USING (student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'alert_actions' AND policyname = 'alert_actions_readable') THEN
    CREATE POLICY "alert_actions_readable" ON alert_actions
      FOR SELECT USING (EXISTS (
        SELECT 1 FROM predictive_alerts pa WHERE pa.id = alert_id AND (
          pa.parent_user_id = auth.uid()::TEXT OR pa.student_user_id = auth.uid()::TEXT
        )
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prediction_metrics' AND policyname = 'prediction_metrics_readable') THEN
    CREATE POLICY "prediction_metrics_readable" ON prediction_metrics FOR SELECT USING (true);
  END IF;
END $$;

-- Cómputo de riesgo (tablas reales: sessions, learning_streaks, points_history)
CREATE OR REPLACE FUNCTION compute_risk_scores()
RETURNS TABLE(computed_count INTEGER) AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  WITH risk_data AS (
    SELECT
      s.auth_id,
      COALESCE(COUNT(DISTINCT DATE(ss.created_at)), 0)::NUMERIC AS active_days,
      COALESCE(SUM(CASE WHEN ss.created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END), 0)::INTEGER AS recent_activity,
      COALESCE(lsr.current_streak, 0)::INTEGER AS current_streak,
      COALESCE(
        (SUM(ph.points) FILTER (WHERE ph.created_at >= NOW() - INTERVAL '7 days'))::NUMERIC / 7,
        0
      ) AS recent_velocity,
      MAX(ss.created_at) AS last_session,
      CASE WHEN MAX(ss.created_at) < NOW() - INTERVAL '7 days' OR MAX(ss.created_at) IS NULL THEN 1 ELSE 0 END AS is_inactive,
      ROUND(
        (COUNT(DISTINCT DATE(ss.created_at))::NUMERIC / NULLIF(
          (DATE(NOW()) - DATE(s.created_at))::INTEGER + 1, 0
        )) * 100, 2
      )::NUMERIC AS engagement_score
    FROM students s
    LEFT JOIN sessions ss ON ss.student_id = s.id
    LEFT JOIN learning_streaks lsr ON lsr.student_id = s.id
    LEFT JOIN points_history ph ON ph.student_id = s.id
    GROUP BY s.auth_id, s.created_at, lsr.current_streak
  )
  INSERT INTO student_risk_scores (
    student_user_id, engagement_score, performance_score, days_inactive,
    recent_point_velocity, predicted_churn_probability, overall_risk_level, last_computed_at
  )
  SELECT
    auth_id::TEXT,
    LEAST(engagement_score, 100),
    50,
    CASE WHEN last_session IS NULL THEN 99 ELSE (EXTRACT(EPOCH FROM (NOW() - last_session)) / 86400)::INTEGER END,
    recent_velocity,
    CASE
      WHEN engagement_score < 20 OR is_inactive::INTEGER = 1 THEN 75
      WHEN engagement_score < 40 THEN 50
      ELSE 25
    END::NUMERIC,
    CASE
      WHEN engagement_score < 20 THEN 'high'
      WHEN engagement_score < 40 THEN 'medium'
      ELSE 'low'
    END,
    NOW()
  FROM risk_data
  ON CONFLICT (student_user_id) DO UPDATE SET
    engagement_score = EXCLUDED.engagement_score,
    performance_score = EXCLUDED.performance_score,
    days_inactive = EXCLUDED.days_inactive,
    recent_point_velocity = EXCLUDED.recent_point_velocity,
    predicted_churn_probability = EXCLUDED.predicted_churn_probability,
    overall_risk_level = EXCLUDED.overall_risk_level,
    updated_at = NOW();

  v_count := 1;
  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;
