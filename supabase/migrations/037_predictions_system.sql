-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'student_risk_scores') THEN
    -- ============================================================================
    -- Migration 037 — Predictive Analytics & Parent Alerts
--
    -- Implements ML-ready prediction engine for at-risk students and learning gaps.
--
    -- Features:
    --   - student_risk_scores: Real-time risk assessment (engagement, performance)
    --   - predictive_alerts: Parent notifications for interventions
    --   - learning_gap_predictions: Subject-area recommendations
    --   - alert_actions: Tracking which interventions were taken by parent
    --   - RLS: Parents see only their linked students' predictions
    --   - Scoring: Engagement, performance, streak, emotional indicators
    -- ============================================================================

BEGIN;

    -- Risk scoring (Denormalized ML-ready features)
CREATE TABLE IF NOT EXISTS student_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL UNIQUE,
  engagement_score NUMERIC(5, 2) DEFAULT 50, -- 0-100: activity, consistency
  performance_score NUMERIC(5, 2) DEFAULT 50, -- 0-100: accuracy, completion
  emotional_risk_score NUMERIC(5, 2) DEFAULT 0, -- 0-100: crisis indicators
  overall_risk_level VARCHAR(20) DEFAULT 'low', -- low, medium, high
  days_inactive INTEGER DEFAULT 0,
  recent_point_velocity NUMERIC(8, 2) DEFAULT 0, -- Points/day trend
  streak_broken_count INTEGER DEFAULT 0,
  predicted_churn_probability NUMERIC(5, 2) DEFAULT 0, -- 0-100% risk of disengagement
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_risk_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

    -- Predictive alerts (Triggers for parent intervention)
CREATE TABLE IF NOT EXISTS predictive_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  alert_type VARCHAR(50) NOT NULL, -- 'disengagement', 'performance_drop', 'struggle', 'streak_risk'
  severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recommendation TEXT,
  data JSONB DEFAULT '{}'::JSONB, -- { score, threshold, metric, ... }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  action_taken BOOLEAN DEFAULT false,
  action_taken_at TIMESTAMPTZ,
  action_type VARCHAR(50), -- 'reached_out', 'encouraged', 'tutoring_requested', ...
  CONSTRAINT fk_alert_parent FOREIGN KEY (parent_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_alert_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_alert_link FOREIGN KEY (parent_user_id, student_user_id)
    REFERENCES parent_student_links(parent_user_id, student_user_id) ON DELETE CASCADE
);

    -- Learning gap predictions (Subject-specific recommendations)
CREATE TABLE IF NOT EXISTS learning_gap_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  gap_type VARCHAR(50) NOT NULL, -- 'concept_mastery', 'practice_needed', 'prerequisite'
  confidence_score NUMERIC(5, 2) DEFAULT 0, -- 0-100: Model confidence
  recommended_resource TEXT,
  priority_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actioned_at TIMESTAMPTZ,
  resource_completed BOOLEAN DEFAULT false,
  CONSTRAINT fk_gap_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(student_user_id, subject_name, gap_type)
);

    -- Alert action history (Track interventions)
CREATE TABLE IF NOT EXISTS alert_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES predictive_alerts(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_description TEXT,
  action_result VARCHAR(50), -- 'positive', 'neutral', 'negative', 'pending'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

    -- Prediction model performance (For ML improvements)
CREATE TABLE IF NOT EXISTS prediction_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC(8, 4),
  computed_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  UNIQUE(model_version, metric_name, computed_date)
);

    -- Create indexes for query performance
CREATE INDEX idx_risk_scores_level ON student_risk_scores(overall_risk_level);
CREATE INDEX idx_risk_scores_churn ON student_risk_scores(predicted_churn_probability DESC);
CREATE INDEX idx_predictive_alerts_parent ON predictive_alerts(parent_user_id);
CREATE INDEX idx_predictive_alerts_student ON predictive_alerts(student_user_id);
CREATE INDEX idx_predictive_alerts_created ON predictive_alerts(created_at DESC);
CREATE INDEX idx_predictive_alerts_severity ON predictive_alerts(severity);
CREATE INDEX idx_predictive_alerts_unread ON predictive_alerts(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_learning_gaps_student ON learning_gap_predictions(student_user_id);
CREATE INDEX idx_learning_gaps_subject ON learning_gap_predictions(subject_name);
CREATE INDEX idx_learning_gaps_confidence ON learning_gap_predictions(confidence_score DESC);
CREATE INDEX idx_alert_actions_alert ON alert_actions(alert_id);
CREATE INDEX idx_prediction_metrics_date ON prediction_metrics(computed_date DESC);

    -- Enable RLS
ALTER TABLE student_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_gap_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_metrics ENABLE ROW LEVEL SECURITY;

    -- RLS Policies
CREATE POLICY "risk_scores_own" ON student_risk_scores
  FOR SELECT USING (student_user_id = auth.uid()::TEXT);

CREATE POLICY "predictive_alerts_parent_or_student" ON predictive_alerts
  FOR SELECT USING (
    parent_user_id = auth.uid()::TEXT OR
    student_user_id = auth.uid()::TEXT
  );

CREATE POLICY "predictive_alerts_parent_insert" ON predictive_alerts
  FOR INSERT WITH CHECK (parent_user_id = auth.uid()::TEXT);

CREATE POLICY "predictive_alerts_parent_update" ON predictive_alerts
  FOR UPDATE USING (parent_user_id = auth.uid()::TEXT OR student_user_id = auth.uid()::TEXT);

CREATE POLICY "learning_gaps_own" ON learning_gap_predictions
  FOR SELECT USING (student_user_id = auth.uid()::TEXT);

CREATE POLICY "alert_actions_readable" ON alert_actions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM predictive_alerts pa WHERE pa.id = alert_id AND (
      pa.parent_user_id = auth.uid()::TEXT OR pa.student_user_id = auth.uid()::TEXT
    ))
  );

CREATE POLICY "prediction_metrics_readable" ON prediction_metrics FOR SELECT USING (true);

    -- Function to compute risk scores (Run nightly or on-demand)
CREATE OR REPLACE FUNCTION compute_risk_scores()
RETURNS TABLE(computed_count INTEGER) AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  WITH risk_data AS (
    SELECT
      s.auth_id,
      COALESCE(COUNT(DISTINCT DATE(ls.created_at)), 0)::NUMERIC as active_days,
      COALESCE(SUM(CASE WHEN ls.created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END), 0)::INTEGER as recent_activity,
      COALESCE(sr.current_streak, 0)::INTEGER as current_streak,
      COALESCE(
        (SUM(ph.points) FILTER (WHERE ph.created_at >= NOW() - INTERVAL '7 days'))::NUMERIC / 7,
        0
      ) as recent_velocity,
      CASE WHEN ls.created_at < NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END as is_inactive,
      ROUND(
        (COUNT(DISTINCT DATE(ls.created_at))::NUMERIC / NULLIF(
          (DATE(NOW()) - DATE(s.created_at))::INTEGER + 1, 0
        )) * 100, 2
      )::NUMERIC as engagement_score
    FROM students s
    LEFT JOIN learning_sessions ls ON ls.student_id = s.id
    LEFT JOIN student_streaks sr ON sr.student_id = s.id
    LEFT JOIN points_history ph ON ph.user_id = s.auth_id
    GROUP BY s.auth_id, s.created_at, sr.current_streak
  )
  INSERT INTO student_risk_scores (
    student_user_id,
    engagement_score,
    performance_score,
    days_inactive,
    recent_point_velocity,
    predicted_churn_probability,
    overall_risk_level,
    last_computed_at
  )
  SELECT
    auth_id,
    LEAST(engagement_score, 100),
    50, -- Placeholder for actual performance calculation
    EXTRACT(DAY FROM NOW() - CURRENT_DATE)::INTEGER,
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

COMMIT;
  END IF;
END
$$;
