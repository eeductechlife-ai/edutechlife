-- ============================================================================
-- Peer Review — Migration 026 (Fase B)
-- Sistema de revisión entre pares: rúbricas, asignaciones y revisiones.
-- Tablas NUEVAS con RLS. No modifica ninguna tabla existente.
-- ============================================================================

-- 1. Rúbricas por curso/módulo
CREATE TABLE IF NOT EXISTS peer_rubrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL DEFAULT 'ialab-ia-generativa',
  module_id INT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, module_id)
);

-- 2. Asignaciones (quién revisa a quién)
CREATE TABLE IF NOT EXISTS peer_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL DEFAULT 'ialab-ia-generativa',
  module_id INT NOT NULL,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'expired')),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (module_id, reviewer_id, reviewee_id),
  CHECK (reviewer_id <> reviewee_id)
);

-- 3. Revisiones enviadas
CREATE TABLE IF NOT EXISTS peer_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES peer_assignments(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  feedback TEXT,
  total NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assignment_id)
);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_peer_assignments_reviewer ON peer_assignments(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_peer_assignments_reviewee ON peer_assignments(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_assignment ON peer_reviews(assignment_id);

-- 5. RLS
ALTER TABLE peer_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_reviews ENABLE ROW LEVEL SECURITY;

-- Rúbricas: lectura para cualquier usuario autenticado; escritura por service role.
DROP POLICY IF EXISTS "read peer rubrics" ON peer_rubrics;
CREATE POLICY "read peer rubrics"
  ON peer_rubrics FOR SELECT TO authenticated USING (true);

-- Asignaciones: el revisor y el revisado ven las suyas.
DROP POLICY IF EXISTS "assignments reviewer read" ON peer_assignments;
CREATE POLICY "assignments reviewer read"
  ON peer_assignments FOR SELECT TO authenticated USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "assignments reviewee read" ON peer_assignments;
CREATE POLICY "assignments reviewee read"
  ON peer_assignments FOR SELECT TO authenticated USING (auth.uid() = reviewee_id);

-- Revisiones: el revisor lee/escribe la suya; el revisado lee las de sus asignaciones.
DROP POLICY IF EXISTS "reviews reviewer read" ON peer_reviews;
CREATE POLICY "reviews reviewer read"
  ON peer_reviews FOR SELECT TO authenticated USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "reviews reviewee read" ON peer_reviews;
CREATE POLICY "reviews reviewee read"
  ON peer_reviews FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM peer_assignments a
      WHERE a.id = peer_reviews.assignment_id AND a.reviewee_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "reviews insert own" ON peer_reviews;
CREATE POLICY "reviews insert own"
  ON peer_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

-- 6. Pairing (SECURITY DEFINER): asigna revisores de forma aleatoria entre
-- estudiantes del mismo módulo. Idempotente (ON CONFLICT DO NOTHING).
CREATE OR REPLACE FUNCTION assign_peer_reviews(
  p_course_id TEXT,
  p_module_id INT,
  p_due_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted INT := 0;
  rec RECORD;
  candidates UUID[];
BEGIN
  SELECT array_agg(DISTINCT user_id)
    INTO candidates
    FROM user_progress
   WHERE activity_type = 'gamification'
     AND gamification_data IS NOT NULL;

  IF candidates IS NULL OR array_length(candidates, 1) < 2 THEN
    RETURN 0;
  END IF;

  FOR rec IN SELECT unnest(candidates) AS uid LOOP
    DECLARE
      target UUID;
    BEGIN
      SELECT uid2 INTO target
        FROM unnest(candidates) AS uid2
       WHERE uid2 <> rec.uid
       ORDER BY random()
       LIMIT 1;

      IF target IS NOT NULL THEN
        INSERT INTO peer_assignments (course_id, module_id, reviewer_id, reviewee_id, due_at)
        VALUES (p_course_id, p_module_id, rec.uid, target, p_due_at)
        ON CONFLICT (module_id, reviewer_id, reviewee_id) DO NOTHING;
        inserted := inserted + 1;
      END IF;
    END;
  END LOOP;

  RETURN inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION assign_peer_reviews(TEXT, INT, TIMESTAMPTZ) TO authenticated;
