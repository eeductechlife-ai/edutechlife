-- ============================================================================
-- Peer Review — usa is_completed como única señal de módulo aprobado
-- (Fase B)
-- services/progressSync/syncActivity.js escribe la fila resumen
-- (activity_type='module') con is_completed=true pero SIN module_score —
-- ese campo queda con basura heredada de otras filas con la misma clave de
-- conflicto (user_id, module_id, activity_type, resource_id). El frontend ya
-- solo agrega un módulo a `completedModules` (y por lo tanto sincroniza esta
-- fila) cuando currentScore cruza 80% (progressSlice.js), así que
-- is_completed=true en esta fila YA implica nota ≥80 — exigir module_score
-- >= 80 además era redundante y, al estar el campo sin escribir, bloqueaba
-- cualquier coincidencia real.
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
     AND activity_type = 'module'
     AND is_completed = true
     AND user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

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
