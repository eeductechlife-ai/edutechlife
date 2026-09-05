-- Migration 058: Cosmetic rewards catalog + student unlocks (brief §48)
-- Replaces the hardcoded REWARDS array in gamificationData.js with a
-- DB-driven catalog that admins can manage without code deploys.

CREATE TABLE IF NOT EXISTS rewards (
  id          serial PRIMARY KEY,
  name        text NOT NULL,
  icon        text NOT NULL DEFAULT '🎁',
  cost        integer NOT NULL CHECK (cost > 0),
  description text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT 'cosmetic'
    CHECK (category IN ('cosmetic','access','certificate','special')),
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_rewards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  reward_id   integer NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, reward_id)
);

CREATE INDEX IF NOT EXISTS idx_student_rewards_student
  ON student_rewards (student_id);

-- RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_rewards ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rewards' AND policyname = 'rewards_public_read'
  ) THEN
    CREATE POLICY rewards_public_read ON rewards
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rewards' AND policyname = 'rewards_service_write'
  ) THEN
    CREATE POLICY rewards_service_write ON rewards
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'student_rewards' AND policyname = 'student_rewards_own_read'
  ) THEN
    CREATE POLICY student_rewards_own_read ON student_rewards
      FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'student_rewards' AND policyname = 'student_rewards_own_insert'
  ) THEN
    CREATE POLICY student_rewards_own_insert ON student_rewards
      FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM students WHERE auth_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'student_rewards' AND policyname = 'student_rewards_service_all'
  ) THEN
    CREATE POLICY student_rewards_service_all ON student_rewards
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Seed: the 6 original hardcoded rewards
INSERT INTO rewards (id, name, icon, cost, description, category, sort_order)
VALUES
  (1, 'Tema Oscuro',         '🌙', 500,  'Cambia a modo oscuro el dashboard',       'cosmetic',    1),
  (2, 'Avatar Dani Animado', '🤖', 750,  'Desbloquea avatar animado de Dani',       'cosmetic',    2),
  (3, 'Fondo Galaxia',       '🌌', 1000, 'Fondo de pantalla espacial',              'cosmetic',    3),
  (4, 'Día Libre',           '🏖️', 1500, 'Un día sin tareas asignadas',             'special',     4),
  (5, 'Curso IA Básico',     '🤖', 2000, 'Acceso a curso introductorio de IA',      'access',      5),
  (6, 'Certificado VAK',     '📜', 3000, 'Certificado oficial de tu perfil VAK',    'certificate', 6)
ON CONFLICT (id) DO NOTHING;

SELECT setval('rewards_id_seq', 6, true);
