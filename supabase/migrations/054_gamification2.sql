-- Migration 054: Gamification 2.0 — Dynamic Missions & Badges
-- Idempotent: all CREATE TABLE IF NOT EXISTS

-- ── Missions catalog ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS missions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key           TEXT UNIQUE NOT NULL,         -- stable identifier
  type          TEXT NOT NULL,                -- 'daily' | 'weekly' | 'exploration' | 'competency'
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT DEFAULT '🎯',
  xp_reward     INTEGER DEFAULT 50,
  criteria_json JSONB DEFAULT '{}',           -- { activity, minScore, count, subject }
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Student missions (progress per student) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS student_missions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  mission_id    UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  progress      INTEGER DEFAULT 0,
  target        INTEGER DEFAULT 1,
  completed     BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_student_missions_student ON student_missions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_missions_active ON student_missions(student_id) WHERE completed = FALSE;

-- ── Badges catalog ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key           TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT DEFAULT '🏅',
  criteria_json JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Student badges (unlocked) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_badges (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id      UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at   TIMESTAMPTZ DEFAULT NOW(),
  evidence_json JSONB DEFAULT '{}',
  UNIQUE(student_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read missions" ON missions;
CREATE POLICY "Public read missions" ON missions FOR SELECT USING (TRUE);

ALTER TABLE student_missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students read own missions" ON student_missions;
CREATE POLICY "Students read own missions" ON student_missions
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read badges" ON badges;
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (TRUE);

ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students read own badges" ON student_badges;
CREATE POLICY "Students read own badges" ON student_badges
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE auth_id = auth.uid()));

-- ── Seed base missions ────────────────────────────────────────────────────────
INSERT INTO missions (key, type, title, description, icon, xp_reward, criteria_json) VALUES
  ('daily_chat', 'daily', 'Habla con Dani', 'Chatea con tu tutora virtual hoy', '💬', 30,
    '{"activity": "dani_chat", "count": 1}'),
  ('daily_practice', 'daily', 'Practica 10 minutos', 'Completa una actividad de práctica', '⏱️', 40,
    '{"activity": "any", "duration_minutes": 10}'),
  ('weekly_exam', 'weekly', 'Prepara un examen', 'Completa una sesión de preparación de examen', '📝', 80,
    '{"activity": "exam_prep", "count": 1}'),
  ('weekly_oral', 'weekly', 'Simulacro oral', 'Haz un simulacro de examen oral', '🎤', 80,
    '{"activity": "oral_exam", "count": 1}'),
  ('exploration_podcast', 'exploration', 'Podcast educativo', 'Escucha un podcast de estudio', '🎧', 60,
    '{"activity": "podcast", "count": 1}'),
  ('competency_math', 'competency', 'Dominio en Matemáticas', 'Alcanza 70% de dominio en Matemáticas', '🔢', 150,
    '{"subject": "matematicas", "min_mastery": 0.7}'),
  ('competency_lang', 'competency', 'Dominio en Lenguaje', 'Alcanza 70% de dominio en Lenguaje', '📖', 150,
    '{"subject": "lenguaje", "min_mastery": 0.7}')
ON CONFLICT (key) DO NOTHING;

-- ── Seed base badges ──────────────────────────────────────────────────────────
INSERT INTO badges (key, name, description, icon, criteria_json) VALUES
  ('first_chat', '¡Primer Chat!', 'Hablaste con Dani por primera vez', '💬',
    '{"activity": "dani_chat", "count": 1}'),
  ('streak_7', 'Racha de 7 días', 'Estudia 7 días seguidos', '🔥',
    '{"streak_days": 7}'),
  ('math_master', 'Maestro de Matemáticas', '70% de dominio en Matemáticas', '🔢',
    '{"subject": "matematicas", "min_mastery": 0.7}'),
  ('oral_ace', 'As del Oral', 'Completa 3 simulacros orales', '🎤',
    '{"activity": "oral_exam", "count": 3}'),
  ('explorer', 'Explorador Digital', 'Usa 5 módulos diferentes', '🌍',
    '{"unique_activities": 5}')
ON CONFLICT (key) DO NOTHING;
