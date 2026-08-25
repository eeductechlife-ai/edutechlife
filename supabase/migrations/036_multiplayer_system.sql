-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leaderboards') THEN
    -- ============================================================================
    -- Migration 036 — Multiplayer & Leaderboard System
--
    -- Implements competitive features: leaderboards, competitions, and social ranking.
--
    -- Features:
    --   - leaderboards: Weekly/monthly/all-time rankings by points
    --   - student_competition_stats: Per-student competitive metrics
    --   - competition_events: Time-bound competitions (tournaments)
    --   - leaderboard_snapshots: Historical leaderboard states for analysis
    --   - RLS: Privacy-aware ranking visibility
    --   - Fast denormalized rank calculation
    -- ============================================================================

BEGIN;

    -- Leaderboard rankings (Denormalized for fast queries)
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'all_time'
  student_user_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  points_this_period INTEGER NOT NULL DEFAULT 0,
  streak_bonus INTEGER DEFAULT 0,
  achievement_count INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  active_days INTEGER DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_leaderboard_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(period, student_user_id)
);

    -- Historical leaderboard snapshots (For trend analysis)
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(20) NOT NULL,
  snapshot_date TIMESTAMPTZ DEFAULT NOW(),
  student_user_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  points_this_period INTEGER NOT NULL,
  streak_bonus INTEGER DEFAULT 0,
  achievement_count INTEGER DEFAULT 0,
  CONSTRAINT fk_snapshot_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

    -- Competition events (Tournaments, challenges, events)
CREATE TABLE IF NOT EXISTS competition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL, -- 'tournament', 'challenge', 'race'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'active', 'ended'
  rules JSONB DEFAULT '{}'::JSONB, -- { pointMultiplier, bonusForStreak, ... }
  prize_pool INTEGER DEFAULT 0,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Student participation in competitions
CREATE TABLE IF NOT EXISTS competition_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competition_events(id) ON DELETE CASCADE,
  student_user_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  points_earned_in_event INTEGER DEFAULT 0,
  final_rank INTEGER,
  prize_won INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  CONSTRAINT fk_participant_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(competition_id, student_user_id)
);

    -- Per-student competitive stats (Denormalized for dashboards)
CREATE TABLE IF NOT EXISTS student_competition_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL UNIQUE,
  total_competitions INTEGER DEFAULT 0,
  competitions_won INTEGER DEFAULT 0,
  competitions_top_3 INTEGER DEFAULT 0,
  total_prize_points INTEGER DEFAULT 0,
  win_rate NUMERIC(5, 2) DEFAULT 0,
  best_rank INTEGER DEFAULT 999,
  current_event_rank INTEGER,
  last_competition_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_stats_student FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

    -- Create indexes for query performance
CREATE INDEX idx_leaderboards_period_rank ON leaderboards(period, rank);
CREATE INDEX idx_leaderboards_student ON leaderboards(student_user_id);
CREATE INDEX idx_leaderboards_points ON leaderboards(total_points DESC);
CREATE INDEX idx_competition_events_status ON competition_events(status);
CREATE INDEX idx_competition_events_dates ON competition_events(start_date, end_date);
CREATE INDEX idx_competition_participants_student ON competition_participants(student_user_id);
CREATE INDEX idx_competition_participants_competition ON competition_participants(competition_id);
CREATE INDEX idx_competition_stats_student ON student_competition_stats(student_user_id);
CREATE INDEX idx_leaderboard_snapshots_date ON leaderboard_snapshots(snapshot_date DESC);

    -- Enable RLS
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_competition_stats ENABLE ROW LEVEL SECURITY;

    -- RLS Policies: Leaderboards are public (privacy is handled at app level)
CREATE POLICY "leaderboards_readable" ON leaderboards FOR SELECT USING (true);

CREATE POLICY "leaderboard_snapshots_readable" ON leaderboard_snapshots FOR SELECT USING (true);

CREATE POLICY "competition_events_readable" ON competition_events FOR SELECT USING (true);

CREATE POLICY "competition_participants_own_or_public" ON competition_participants
  FOR SELECT USING (student_user_id = auth.uid()::TEXT OR EXISTS (
    SELECT 1 FROM competition_events ce WHERE ce.id = competition_id AND ce.status = 'ended'
  ));

CREATE POLICY "student_competition_stats_readable" ON student_competition_stats FOR SELECT USING (true);

    -- Function to compute leaderboard rankings (Called nightly or on-demand)
CREATE OR REPLACE FUNCTION compute_leaderboards()
RETURNS TABLE(computed_count INTEGER, error_message TEXT) AS $$
DECLARE
  v_count INTEGER := 0;
  v_error TEXT := NULL;
BEGIN
  BEGIN
    -- All-time leaderboard
    WITH ranked AS (
      SELECT
        ph.user_id,
        RANK() OVER (ORDER BY SUM(ph.points) DESC) as rank,
        SUM(ph.points) as total_points,
        COUNT(*) as achievement_count
      FROM points_history ph
      GROUP BY ph.user_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, total_points, achievement_count, computed_at)
    SELECT 'all_time', user_id, rank, total_points, achievement_count, NOW()
    FROM ranked
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank,
      total_points = EXCLUDED.total_points,
      achievement_count = EXCLUDED.achievement_count,
      computed_at = NOW();

    -- Weekly leaderboard
    WITH ranked_weekly AS (
      SELECT
        ph.user_id,
        RANK() OVER (ORDER BY SUM(ph.points) DESC) as rank,
        SUM(ph.points) as weekly_points
      FROM points_history ph
      WHERE ph.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY ph.user_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, points_this_period, computed_at)
    SELECT 'weekly', user_id, rank, weekly_points, NOW()
    FROM ranked_weekly
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank,
      points_this_period = EXCLUDED.points_this_period,
      computed_at = NOW();

    -- Monthly leaderboard
    WITH ranked_monthly AS (
      SELECT
        ph.user_id,
        RANK() OVER (ORDER BY SUM(ph.points) DESC) as rank,
        SUM(ph.points) as monthly_points
      FROM points_history ph
      WHERE ph.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY ph.user_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, points_this_period, computed_at)
    SELECT 'monthly', user_id, rank, monthly_points, NOW()
    FROM ranked_monthly
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank,
      points_this_period = EXCLUDED.points_this_period,
      computed_at = NOW();

    v_count := 1;
  EXCEPTION WHEN OTHERS THEN
    v_error := SQLERRM;
    RAISE WARNING 'Error computing leaderboards: %', v_error;
  END;

  RETURN QUERY SELECT v_count, v_error;
END;
$$ LANGUAGE plpgsql;

    -- Seed initial competition event (Demo tournament)
INSERT INTO competition_events (title, description, event_type, start_date, end_date, status, rules)
VALUES (
  'Tournament Semanal',
  'Compite con otros estudiantes por puntos y premios',
  'tournament',
  NOW(),
  NOW() + INTERVAL '7 days',
  'active',
  '{"pointMultiplier": 1.5, "bonusForStreak": 10, "minParticipants": 5}'::JSONB
)
ON CONFLICT DO NOTHING;

COMMIT;
  END IF;
END
$$;
