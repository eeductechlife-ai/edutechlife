-- ============================================================================
-- Migration 059 — RECONCILIACIÓN DE PRODUCCIÓN (SmartBoard)
--
-- La base remota se construyó a mano (scripts sueltos) y nunca recibió las
-- migraciones 003–058. El sondeo read-only (2026-08-29) confirmó que FALTAN en
-- producción: sessions, points_history, crisis_alerts, conversations,
-- achievements (+ catálogo 035). Esta migración los crea de forma idempotente
-- y SEGURA (solo CREATE IF NOT EXISTS + políticas con guard; NO elimina nada).
--
-- Las políticas de escritura siguen la convención endurecida de 025
-- ("Students ... own ..."), NO las viejas "Service role ..." alcanzables por
-- anon. El backend usa service_role (bypasea RLS).
--
-- Procedimiento (ver FOUNDATION_PHASE_C_REPORT.md):
--   1. Backup de producción (Supabase Dashboard → Database → Backups, o
--      `supabase db dump --linked`).
--   2. Dry run: ejecutar el contenido en una transacción con ROLLBACK contra un
--      clon, o `supabase db push --dry-run` (si el historial lo permite).
--   3. Aplicar vía `supabase db push` (job de CI) o SQL Editor (transacción).
--   4. Verificar con el sondeo de columnas (200 por tabla).
-- Rollback: como es aditivo y no destructivo, el rollback no es necesario; si
-- algo falla, la transacción se revierte sola.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Asegurar columna last_activity en students (los triggers de sessions la usan)
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT now();

-- ── sessions (011) ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'language', 'science', 'history', 'art', 'general')),
  points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
  type TEXT DEFAULT 'lesson' CHECK (type IN ('lesson', 'game', 'quiz', 'free_practice', 'challenge')),
  duration_minutes INTEGER,
  content_id UUID,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_student ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_student_start ON sessions(student_id, start_time DESC);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sessions' AND policyname = 'Students read own sessions') THEN
    CREATE POLICY "Students read own sessions" ON sessions FOR SELECT
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sessions' AND policyname = 'Students create sessions') THEN
    CREATE POLICY "Students create sessions" ON sessions FOR INSERT
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sessions' AND policyname = 'Students update own sessions') THEN
    CREATE POLICY "Students update own sessions" ON sessions FOR UPDATE
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_student_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE students SET last_activity = now(), updated_at = now() WHERE id = NEW.student_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_update_last_activity ON sessions;
CREATE TRIGGER trg_update_last_activity AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_student_last_activity();

CREATE OR REPLACE FUNCTION update_academic_context_on_session()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO academic_context (student_id, subject, total_points, lessons_completed, average_score, last_updated)
  VALUES (NEW.student_id, NEW.subject, COALESCE(NEW.points_earned, 0), 1, 0, now())
  ON CONFLICT (student_id, subject) DO UPDATE SET
    total_points = academic_context.total_points + COALESCE(NEW.points_earned, 0),
    lessons_completed = academic_context.lessons_completed + 1,
    last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_update_academic_context ON sessions;
CREATE TRIGGER trg_update_academic_context AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_academic_context_on_session();

CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  last_date := (SELECT last_activity_date FROM learning_streaks WHERE student_id = NEW.student_id);
  IF last_date IS NULL THEN
    INSERT INTO learning_streaks (student_id, current_streak, best_streak, last_activity_date, total_days_active)
    VALUES (NEW.student_id, 1, 1, CURRENT_DATE, 1);
  ELSIF last_date = CURRENT_DATE THEN
    NULL;
  ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE learning_streaks
    SET current_streak = current_streak + 1,
        best_streak = CASE WHEN current_streak + 1 > best_streak THEN current_streak + 1 ELSE best_streak END,
        last_activity_date = CURRENT_DATE,
        total_days_active = total_days_active + 1,
        updated_at = now()
    WHERE student_id = NEW.student_id;
  ELSE
    UPDATE learning_streaks
    SET current_streak = 1, last_activity_date = CURRENT_DATE,
        total_days_active = total_days_active + 1, freeze_used_today = false, updated_at = now()
    WHERE student_id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_update_streak ON sessions;
CREATE TRIGGER trg_update_streak AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_learning_streak();

-- ── points_history (011) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points != 0),
  reason TEXT NOT NULL,
  category TEXT DEFAULT 'achievement' CHECK (category IN (
    'lesson_complete', 'quiz_pass', 'quiz_excellent', 'streak_bonus',
    'achievement_unlock', 'challenge_complete', 'participation', 'correction', 'bonus', 'adjustment'
  )),
  related_session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_points_history_student ON points_history(student_id);
CREATE INDEX IF NOT EXISTS idx_points_history_timestamp ON points_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_points_history_category ON points_history(category);
CREATE INDEX IF NOT EXISTS idx_points_history_student_timestamp ON points_history(student_id, timestamp DESC);

ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'points_history' AND policyname = 'Students read own points') THEN
    CREATE POLICY "Students read own points" ON points_history FOR SELECT
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'points_history' AND policyname = 'Students insert own points') THEN
    CREATE POLICY "Students insert own points" ON points_history FOR INSERT
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

-- ── conversations (011) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  emotional_context JSONB DEFAULT '{
    "sentiment": "neutral", "engagement_level": 0.5, "confidence": null,
    "frustration_level": 0, "energy_level": 0.5
  }'::JSONB,
  subject TEXT,
  learning_style_applied TEXT,
  messages_in_context INTEGER DEFAULT 1,
  token_count INTEGER,
  model_used TEXT DEFAULT 'nico-v1',
  parent_session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversations_subject ON conversations(subject);
CREATE INDEX IF NOT EXISTS idx_conversations_student_timestamp ON conversations(student_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_parent_session ON conversations(parent_session_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations' AND policyname = 'Students read own conversations') THEN
    CREATE POLICY "Students read own conversations" ON conversations FOR SELECT
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations' AND policyname = 'Students create conversations') THEN
    CREATE POLICY "Students create conversations" ON conversations FOR INSERT
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

-- ── achievements (011, student-scoped) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  points_awarded INTEGER DEFAULT 0,
  is_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_achievements_student ON achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'achievements' AND policyname = 'Students read own achievements') THEN
    CREATE POLICY "Students read own achievements" ON achievements FOR SELECT
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'achievements' AND policyname = 'Students insert own achievements') THEN
    CREATE POLICY "Students insert own achievements" ON achievements FOR INSERT
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION award_achievement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_milestone THEN
    INSERT INTO points_history (student_id, points, reason, category)
    VALUES (NEW.student_id, COALESCE(NEW.points_awarded, 0), NEW.title, 'achievement_unlock');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_award_achievement ON achievements;
CREATE TRIGGER trg_award_achievement AFTER INSERT ON achievements
  FOR EACH ROW EXECUTE FUNCTION award_achievement();

-- ── crisis_alerts (009) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crisis_alerts (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_age INTEGER,
  detected_content TEXT NOT NULL,
  crisis_level VARCHAR(50) NOT NULL,
  parent_email VARCHAR(255),
  alert_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crisis_alerts_student_id ON crisis_alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_level ON crisis_alerts(crisis_level);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_created_at ON crisis_alerts(created_at);

ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crisis_alerts' AND policyname = 'Admins can view crisis alerts') THEN
    CREATE POLICY "Admins can view crisis alerts" ON crisis_alerts FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
      ));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crisis_alerts' AND policyname = 'Students insert own crisis alerts') THEN
    CREATE POLICY "Students insert own crisis alerts" ON crisis_alerts FOR INSERT
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

-- ── academic_context (necesario para el trigger de sessions; 011) ───────────
CREATE TABLE IF NOT EXISTS academic_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'language', 'science', 'history', 'art', 'general')),
  performance_level TEXT DEFAULT 'beginner' CHECK (performance_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
  average_score NUMERIC(5,2) DEFAULT 0.0 CHECK (average_score >= 0 AND average_score <= 100),
  quiz_attempts INTEGER DEFAULT 0,
  quiz_passed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  topics_mastered TEXT[] DEFAULT '{}',
  topics_in_progress TEXT[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_academic_context_student ON academic_context(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_context_student_subject ON academic_context(student_id, subject);

ALTER TABLE academic_context ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'academic_context' AND policyname = 'Students read own academic context') THEN
    CREATE POLICY "Students read own academic context" ON academic_context FOR SELECT
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'academic_context' AND policyname = 'Students insert own academic context') THEN
    CREATE POLICY "Students insert own academic context" ON academic_context FOR INSERT
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'academic_context' AND policyname = 'Students update own academic context') THEN
    CREATE POLICY "Students update own academic context" ON academic_context FOR UPDATE
      USING (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()))
      WITH CHECK (student_id = (SELECT id FROM students WHERE auth_id = auth.uid()));
  END IF;
END $$;

-- ── Catálogo de achievements (035, sin duplicar `achievements`) ─────────────
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

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_achievements' AND policyname = 'student_achievements_own') THEN
    CREATE POLICY "student_achievements_own" ON student_achievements FOR SELECT USING (student_user_id = auth.uid()::TEXT);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_achievements' AND policyname = 'student_achievements_insert_own') THEN
    CREATE POLICY "student_achievements_insert_own" ON student_achievements FOR INSERT WITH CHECK (student_user_id = auth.uid()::TEXT);
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
