-- Tabla de rankings semanales para leaderboard social multi-usuario
CREATE TABLE IF NOT EXISTS league_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  league_tier TEXT NOT NULL CHECK (league_tier IN ('bronze', 'silver', 'gold', 'diamond')),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_league_rankings_week ON league_rankings(week_start, league_tier);
CREATE INDEX IF NOT EXISTS idx_league_rankings_user ON league_rankings(user_id);

ALTER TABLE league_rankings ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver rankings (público)
CREATE POLICY "rankings_select_all" ON league_rankings
  FOR SELECT USING (true);

-- Solo el sistema (service_role) puede insertar/actualizar
CREATE POLICY "rankings_insert_service" ON league_rankings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "rankings_update_service" ON league_rankings
  FOR UPDATE USING (auth.role() = 'service_role');
