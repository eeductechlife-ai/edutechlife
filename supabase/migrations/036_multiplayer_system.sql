-- ============================================================================
-- Migration 036 — Multiplayer & Leaderboard System
-- Idempotente. Los *_user_id son TEXT (auth.uid()::TEXT); se eliminan los FKs a
-- auth.users(id) que fallaban por tipos incompatibles (text ≠ uuid). El
-- ownership se valida en capa de app / RLS. compute_leaderboards() corregido
-- para leer points_history.student_id → students.auth_id.
-- ============================================================================

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
  UNIQUE(period, student_user_id)
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(20) NOT NULL,
  snapshot_date TIMESTAMPTZ DEFAULT NOW(),
  student_user_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  points_this_period INTEGER NOT NULL,
  streak_bonus INTEGER DEFAULT 0,
  achievement_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS competition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming',
  rules JSONB DEFAULT '{}'::JSONB,
  prize_pool INTEGER DEFAULT 0,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competition_events(id) ON DELETE CASCADE,
  student_user_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  points_earned_in_event INTEGER DEFAULT 0,
  final_rank INTEGER,
  prize_won INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  UNIQUE(competition_id, student_user_id)
);

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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboards_period_rank ON leaderboards(period, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboards_student ON leaderboards(student_user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_points ON leaderboards(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_competition_events_status ON competition_events(status);
CREATE INDEX IF NOT EXISTS idx_competition_events_dates ON competition_events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_competition_participants_student ON competition_participants(student_user_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_competition ON competition_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_stats_student ON student_competition_stats(student_user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_date ON leaderboard_snapshots(snapshot_date DESC);

ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_competition_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'leaderboards' AND policyname = 'leaderboards_readable') THEN
    CREATE POLICY "leaderboards_readable" ON leaderboards FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'leaderboard_snapshots' AND policyname = 'leaderboard_snapshots_readable') THEN
    CREATE POLICY "leaderboard_snapshots_readable" ON leaderboard_snapshots FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'competition_events' AND policyname = 'competition_events_readable') THEN
    CREATE POLICY "competition_events_readable" ON competition_events FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'competition_participants' AND policyname = 'competition_participants_own_or_public') THEN
    CREATE POLICY "competition_participants_own_or_public" ON competition_participants
      FOR SELECT USING (student_user_id = auth.uid()::TEXT OR EXISTS (
        SELECT 1 FROM competition_events ce WHERE ce.id = competition_id AND ce.status = 'ended'
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_competition_stats' AND policyname = 'student_competition_stats_readable') THEN
    CREATE POLICY "student_competition_stats_readable" ON student_competition_stats FOR SELECT USING (true);
  END IF;
END $$;

-- Cómputo de leaderboards (all-time / weekly / monthly)
-- points_history.student_id → students.auth_id (auth uid, TEXT)
CREATE OR REPLACE FUNCTION compute_leaderboards()
RETURNS TABLE(computed_count INTEGER, error_message TEXT) AS $$
DECLARE
  v_count INTEGER := 0;
  v_error TEXT := NULL;
BEGIN
  BEGIN
    WITH ranked AS (
      SELECT s.auth_id::TEXT AS user_id,
             RANK() OVER (ORDER BY SUM(ph.points) DESC) AS rank,
             SUM(ph.points) AS total_points,
             COUNT(*) AS achievement_count
      FROM points_history ph
      JOIN students s ON s.id = ph.student_id
      GROUP BY s.auth_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, total_points, achievement_count, computed_at)
    SELECT 'all_time', user_id, rank, total_points, achievement_count, NOW()
    FROM ranked
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank, total_points = EXCLUDED.total_points,
      achievement_count = EXCLUDED.achievement_count, computed_at = NOW();

    WITH ranked_weekly AS (
      SELECT s.auth_id::TEXT AS user_id,
             RANK() OVER (ORDER BY SUM(ph.points) DESC) AS rank,
             SUM(ph.points) AS weekly_points
      FROM points_history ph
      JOIN students s ON s.id = ph.student_id
      WHERE ph.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY s.auth_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, points_this_period, computed_at)
    SELECT 'weekly', user_id, rank, weekly_points, NOW()
    FROM ranked_weekly
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank, points_this_period = EXCLUDED.points_this_period, computed_at = NOW();

    WITH ranked_monthly AS (
      SELECT s.auth_id::TEXT AS user_id,
             RANK() OVER (ORDER BY SUM(ph.points) DESC) AS rank,
             SUM(ph.points) AS monthly_points
      FROM points_history ph
      JOIN students s ON s.id = ph.student_id
      WHERE ph.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY s.auth_id
    )
    INSERT INTO leaderboards (period, student_user_id, rank, points_this_period, computed_at)
    SELECT 'monthly', user_id, rank, monthly_points, NOW()
    FROM ranked_monthly
    ON CONFLICT (period, student_user_id) DO UPDATE SET
      rank = EXCLUDED.rank, points_this_period = EXCLUDED.points_this_period, computed_at = NOW();

    v_count := 1;
  EXCEPTION WHEN OTHERS THEN
    v_error := SQLERRM;
    RAISE WARNING 'Error computing leaderboards: %', v_error;
  END;

  RETURN QUERY SELECT v_count, v_error;
END;
$$ LANGUAGE plpgsql;

INSERT INTO competition_events (title, description, event_type, start_date, end_date, status, rules)
SELECT 'Tournament Semanal', 'Compite con otros estudiantes por puntos y premios', 'tournament',
       NOW(), NOW() + INTERVAL '7 days', 'active',
       '{"pointMultiplier": 1.5, "bonusForStreak": 10, "minParticipants": 5}'::JSONB
WHERE NOT EXISTS (SELECT 1 FROM competition_events WHERE title = 'Tournament Semanal');
