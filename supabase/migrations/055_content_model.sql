-- Migration 055: Content Model — taggable learning content (brief §51)
-- Foundation the Adaptive Engine (§13) and RecommendationEngine (§52) need to
-- recommend REAL content instead of generic actions. Content is tagged by age,
-- grade, subject, competency, skill, difficulty, duration, type and objective.
-- Idempotent: CREATE TABLE IF NOT EXISTS + pg_policies-guarded RLS + seeded
-- with ON CONFLICT DO NOTHING.

-- ── learning_content ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS learning_content (
  id                 text PRIMARY KEY,                 -- stable key, e.g. co_mat_6-7_ecuaciones_video_01
  country_code       text NOT NULL DEFAULT 'CO',
  title              text NOT NULL,
  type               text NOT NULL                     -- how it is consumed
    CHECK (type IN ('video','article','exercise','quiz','challenge','podcast','game','reading')),
  subject            text NOT NULL,                    -- normalized key: matematicas, lenguaje, ...
  area               text,                             -- sub-area within the subject (optional)
  competency_id      text REFERENCES competencies(id) ON DELETE SET NULL,
  skill              text,                             -- fine-grained skill label (optional)
  age_min            integer NOT NULL DEFAULT 6,
  age_max            integer NOT NULL DEFAULT 16,
  grade_min          integer,
  grade_max          integer,
  difficulty         integer NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  duration_min       integer NOT NULL DEFAULT 10 CHECK (duration_min > 0),
  learning_objective text NOT NULL,
  vak_style          text CHECK (vak_style IN ('visual','auditivo','kinestesico')),
  url                text,                             -- external resource (optional)
  body               jsonb NOT NULL DEFAULT '{}',      -- inline payload (optional)
  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (age_max >= age_min)
);

-- Query paths the Adaptive Engine uses: by competency, by subject+difficulty,
-- by age band, by type.
CREATE INDEX IF NOT EXISTS idx_content_competency ON learning_content (competency_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_content_subject_diff ON learning_content (subject, difficulty) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_content_age ON learning_content (age_min, age_max) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_content_type ON learning_content (type) WHERE is_active;

-- ── RLS: public read of active content (curriculum), service_role writes ──────
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'learning_content' AND policyname = 'content_public_read'
  ) THEN
    CREATE POLICY content_public_read ON learning_content
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'learning_content' AND policyname = 'content_service_write'
  ) THEN
    CREATE POLICY content_service_write ON learning_content
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ── Seed: a few examples tied to existing competencies (real content via CMS) ─
INSERT INTO learning_content
  (id, title, type, subject, area, competency_id, skill, age_min, age_max, grade_min, grade_max, difficulty, duration_min, learning_objective, vak_style)
VALUES
  ('co_mat_6-7_ecuaciones_video_01', 'Ecuaciones de primer grado, paso a paso', 'video',
    'matematicas', 'algebra', 'co_matematicas_6-7_1', 'ecuaciones_lineales',
    11, 13, 6, 7, 2, 8, 'Plantear y resolver ecuaciones lineales sencillas', 'visual'),
  ('co_mat_6-7_ecuaciones_reto_01', 'Reto: despeja la incógnita', 'challenge',
    'matematicas', 'algebra', 'co_matematicas_6-7_1', 'ecuaciones_lineales',
    11, 13, 6, 7, 3, 12, 'Aplicar el despeje en problemas contextualizados', 'kinestesico'),
  ('co_len_6-7_argumentacion_article_01', 'Cómo construir un argumento sólido', 'article',
    'lenguaje', 'produccion_textual', 'co_lenguaje_6-7_1', 'argumentacion',
    11, 13, 6, 7, 2, 10, 'Producir textos argumentativos con coherencia y cohesión', 'auditivo'),
  ('co_tec_6-7_ia_challenge_01', 'Crea tu primer asistente con IA', 'challenge',
    'tecnologia', 'inteligencia_artificial', 'co_tecnologia_6-7_0', 'ia_basica',
    11, 16, 6, 11, 3, 20, 'Programar una solución simple asistida por IA', 'kinestesico')
ON CONFLICT (id) DO NOTHING;
