-- ============================================================================
-- Peer Review — Corrige el criterio de selección de candidatos (Fase B)
-- La función assign_peer_reviews() de 083_peer_review.sql seleccionaba
-- candidatos con `activity_type = 'gamification' AND gamification_data IS
-- NOT NULL`, un criterio que no identifica una finalización real de módulo
-- (cualquier fila de gamificación calificaba, sin importar el módulo ni el
-- puntaje). Esta migración reemplaza esa selección por el criterio correcto:
-- usuarios con una fila en user_progress para ESE módulo, is_completed=true
-- y module_score >= 80. El resto de la función (emparejamiento aleatorio,
-- inserción idempotente) queda igual.
-- ============================================================================

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
  SELECT array_agg(DISTINCT user_id::uuid)
    INTO candidates
    FROM user_progress
   WHERE module_id = p_module_id
     AND is_completed = true
     AND COALESCE(module_score, 0) >= 80;

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
