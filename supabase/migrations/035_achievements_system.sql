-- ============================================================================
-- Migration 035 — Achievements catalog (categorías + stats)
-- NOTA: la tabla `achievements` YA existe (011, student-scoped). Para no crear
-- un duplicado con schema conflictivo, aquí SOLO se crean las tablas nuevas
-- (achievement_categories, student_achievements, achievement_stats) que
-- referencian a `achievements(id)` de 011. Idempotente.
-- ============================================================================

CREATE TABLE IF NOT EXISTS achievement_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO achievement_categories (slug, label, description, icon_url) VALUES
  ('academic', 'Académicos', 'Logros por rendimiento académico', 'https://api.iconify.design/mdi:book.svg'),
  ('social', 'Sociales', 'Logros por interacción con pares', 'https://api.iconify.design/mdi:users.svg'),
  ('streak', 'Racha', 'Logros por consistencia y racha', 'https://api.iconify.design/mdi:flame.svg'),
  ('exploration', 'Exploración', 'Logros por descubrir nuevas áreas', 'https://api.iconify.design/mdi:compass.svg'),
  ('leadership', 'Liderazgo', 'Logros por ayudar a otros', 'https://api.iconify.design/mdi:crown.svg')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id TEXT NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,
  reward_claimed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  UNIQUE(student_user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS achievement_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  total_unlocks INTEGER DEFAULT 0,
  unlock_percentage NUMERIC(5, 2) DEFAULT 0,
  average_unlock_time_days INTEGER,
  rarity_score NUMERIC(3, 2) DEFAULT 1.0,
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_student_achievements_student ON student_achievements(student_user_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_unlocked ON student_achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_achievements_achievement ON student_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_stats_rarity ON achievement_stats(rarity_score DESC);

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_achievements' AND policyname = 'student_achievements_own') THEN
    CREATE POLICY "student_achievements_own" ON student_achievements
      FOR SELECT USING (student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_achievements' AND policyname = 'student_achievements_insert_own') THEN
    CREATE POLICY "student_achievements_insert_own" ON student_achievements
      FOR INSERT WITH CHECK (student_user_id = auth.uid()::TEXT);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'achievement_categories' AND policyname = 'achievement_categories_readable') THEN
    CREATE POLICY "achievement_categories_readable" ON achievement_categories FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'achievement_stats' AND policyname = 'achievement_stats_readable') THEN
    CREATE POLICY "achievement_stats_readable" ON achievement_stats FOR SELECT USING (true);
  END IF;
END $$;
