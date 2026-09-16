-- ============================================================================
-- Peer Review — Usa la fila resumen por módulo, no cualquier fila de recurso
-- (Fase B)
-- user_progress es un log por actividad (video, exam, challenge, document,
-- etc.). Cada actividad individual trae su propio module_score parcial, que
-- casi nunca llega a 80. La fila que sí resume la nota compuesta real del
-- módulo (examen 40% + reto 40% + recursos 20%, calculada en el frontend) es
-- la de activity_type = 'module'. Sin este filtro, assign_peer_reviews()
-- nunca encontraba candidatos aunque hubiera estudiantes con módulos
-- realmente aprobados.
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
     AND COALESCE(module_score, 0) >= 80
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
