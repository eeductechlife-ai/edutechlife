-- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'IF') THEN
    -- Idempotent: only applies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'achievements') THEN
    -- ============================================================================
    -- Migration 035 — Achievements System for SmartBoard
--
    -- Implements gamified achievement badges with unlock conditions and analytics.
--
    -- Features:
    --   - achievements: Badge definitions (visual assets, unlock criteria)
    --   - student_achievements: Tracking when students unlock achievements
    --   - achievement_categories: Organization (academic, social, streak-based)
    --   - RLS: Students see only their own achievement data
    --   - Indexes: Fast lookups by student, category, date
    -- ============================================================================

BEGIN;

    -- Create achievement categories (Extensible for future types)
CREATE TABLE IF NOT EXISTS achievement_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Predefined categories
INSERT INTO achievement_categories (slug, label, description, icon_url) VALUES
  ('academic', 'Académicos', 'Logros por rendimiento académico', 'https://api.iconify.design/mdi:book.svg'),
  ('social', 'Sociales', 'Logros por interacción con pares', 'https://api.iconify.design/mdi:users.svg'),
  ('streak', 'Racha', 'Logros por consistencia y racha', 'https://api.iconify.design/mdi:flame.svg'),
  ('exploration', 'Exploración', 'Logros por descubrir nuevas áreas', 'https://api.iconify.design/mdi:compass.svg'),
  ('leadership', 'Liderazgo', 'Logros por ayudar a otros', 'https://api.iconify.design/mdi:crown.svg')
ON CONFLICT (slug) DO NOTHING;

    -- Achievement definitions (Badge catalog)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES achievement_categories(id) ON DELETE CASCADE,
  badge_url TEXT NOT NULL,
  badge_locked_url TEXT,
  points_reward INTEGER DEFAULT 100,
  rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
  unlock_condition JSONB NOT NULL, -- { type: 'points'|'streak'|'leaderboard'|'mission', value: N, ... }
  is_hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

    -- Student achievement unlocks (Timestamped progress)
CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,
  reward_claimed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB, -- { milestone_number, streak_count, ... }
  UNIQUE(student_user_id, achievement_id),
  CONSTRAINT fk_student_achievement FOREIGN KEY (student_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

    -- Achievement analytics (For recommendations & milestones)
CREATE TABLE IF NOT EXISTS achievement_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  total_unlocks INTEGER DEFAULT 0,
  unlock_percentage NUMERIC(5, 2) DEFAULT 0,
  average_unlock_time_days INTEGER,
  rarity_score NUMERIC(3, 2) DEFAULT 1.0, -- 1.0 = common, 2.0+ = rare
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(achievement_id)
);

    -- Create indexes for query performance
CREATE INDEX idx_student_achievements_student ON student_achievements(student_user_id);
CREATE INDEX idx_student_achievements_unlocked ON student_achievements(unlocked_at DESC);
CREATE INDEX idx_student_achievements_achievement ON student_achievements(achievement_id);
CREATE INDEX idx_achievements_category ON achievements(category_id);
CREATE INDEX idx_achievements_slug ON achievements(slug);
CREATE INDEX idx_achievement_stats_rarity ON achievement_stats(rarity_score DESC);

    -- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_stats ENABLE ROW LEVEL SECURITY;

    -- RLS Policies: Students see all achievement definitions but only their own unlocks
CREATE POLICY "achievements_all_readable" ON achievements FOR SELECT USING (true);

CREATE POLICY "student_achievements_own" ON student_achievements
  FOR SELECT USING (student_user_id = auth.uid()::TEXT);

CREATE POLICY "student_achievements_insert_own" ON student_achievements
  FOR INSERT WITH CHECK (student_user_id = auth.uid()::TEXT);

CREATE POLICY "achievement_categories_readable" ON achievement_categories FOR SELECT USING (true);

CREATE POLICY "achievement_stats_readable" ON achievement_stats FOR SELECT USING (true);

    -- Seed initial achievements (10 starter badges)
INSERT INTO achievements (slug, title, description, category_id, badge_url, points_reward, rarity, unlock_condition, display_order)
SELECT
  'first_login', 'Primer Paso', 'Accede a SmartBoard por primera vez', c.id, 'https://api.iconify.design/mdi:login.svg?color=66cccc', 10, 'common',
  '{"type": "first_event", "event": "login"}'::JSONB, 1
FROM achievement_categories c WHERE c.slug = 'academic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO achievements (slug, title, description, category_id, badge_url, points_reward, rarity, unlock_condition, display_order)
SELECT
  'first_100_points', 'Cien Puntos', 'Acumula 100 puntos en total', c.id, 'https://api.iconify.design/mdi:star.svg?color=ffd166', 50, 'common',
  '{"type": "points", "value": 100}'::JSONB, 2
FROM achievement_categories c WHERE c.slug = 'academic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO achievements (slug, title, description, category_id, badge_url, points_reward, rarity, unlock_condition, display_order)
SELECT
  'week_streak_7', 'Racha Semanal', 'Mantén una racha de 7 días consecutivos', c.id, 'https://api.iconify.design/mdi:flame.svg?color=ff8e53', 100, 'rare',
  '{"type": "streak", "value": 7}'::JSONB, 3
FROM achievement_categories c WHERE c.slug = 'streak'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO achievements (slug, title, description, category_id, badge_url, points_reward, rarity, unlock_condition, display_order)
SELECT
  'leaderboard_top_10', 'Top 10', 'Entra en el top 10 del leaderboard', c.id, 'https://api.iconify.design/mdi:trophy.svg?color=ffd166', 150, 'rare',
  '{"type": "leaderboard", "rank": 10}'::JSONB, 4
FROM achievement_categories c WHERE c.slug = 'leadership'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO achievements (slug, title, description, category_id, badge_url, points_reward, rarity, unlock_condition, display_order)
SELECT
  'all_subjects_started', 'Explorador', 'Inicia una lección en todas las materias', c.id, 'https://api.iconify.design/mdi:compass.svg?color=4da8c4', 75, 'uncommon',
  '{"type": "mission", "count": 5}'::JSONB, 5
FROM achievement_categories c WHERE c.slug = 'exploration'
ON CONFLICT (slug) DO NOTHING;

COMMIT;
  END IF;
END
$$;
  END IF;
END
$$;
