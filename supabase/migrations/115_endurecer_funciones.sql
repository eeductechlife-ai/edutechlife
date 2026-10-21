-- ============================================================================
-- 115_endurecer_funciones.sql
-- Re-auditoría de seguridad oct-2026: avisos del asesor de Supabase y revisión
-- de funciones SECURITY DEFINER.
--
-- 1. search_path fijo en 7 funciones (aviso function_search_path_mutable). Se
--    fija en «public», que es lo que ya resolvían por defecto: no cambia su
--    comportamiento. Cada ALTER corre solo si la función existe (la base
--    limpia de CI no las tiene todas).
-- 2. get_my_institution_id: solo la usa una política del rol authenticated.
--    Se le quita la ejecución a anon y a PUBLIC; authenticated y service_role
--    la conservan.
-- 3. assign_peer_reviews: la llama el frontend (usePeerReview) con la sesión
--    del estudiante, así que no se puede revocar. Pero era SECURITY DEFINER y
--    cualquier usuario con sesión podía crear asignaciones entre todos los
--    estudiantes que completaron un módulo, y cada llamada añadía más. Ahora:
--      - solo puede ejecutarla quien completó ese módulo (o el servidor, que
--        no tiene sesión de usuario);
--      - un revisor que ya tiene asignación en el módulo no recibe otra;
--      - anon y PUBLIC pierden la ejecución.
--
-- verify_certificate se mantiene pública a propósito (decisión del CEO,
-- 2026-10-21). ialab_leaderboard es el ranking de IALab: se mantiene.
--
-- APLICADA EN PRODUCCIÓN el 2026-10-21 (proyecto srirrwpgswlnuqfgtule), con
-- autorización del CEO, tras un ensayo en una transacción con ROLLBACK.
-- Idempotente. Deshacer: ver el bloque comentado al final.
-- ============================================================================

-- 1. search_path fijo --------------------------------------------------------
DO $$
DECLARE
  f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'public.get_user_rank(text)',
    'public.update_profiles_updated_at()',
    'public.get_top_leaderboard(integer)',
    'public.update_smartboard_updated_at()',
    'public.update_updated_at_column()',
    'public.set_updated_at()',
    'public.set_cert_number()'
  ] LOOP
    IF to_regprocedure(f) IS NOT NULL THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public', f);
    ELSE
      RAISE NOTICE '% no existe en esta base: se omite', f;
    END IF;
  END LOOP;
END $$;

-- 2. get_my_institution_id: fuera de anon ------------------------------------
DO $$
BEGIN
  IF to_regprocedure('public.get_my_institution_id()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.get_my_institution_id() FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.get_my_institution_id() TO authenticated, service_role;
  ELSE
    RAISE NOTICE 'get_my_institution_id no existe en esta base: se omite';
  END IF;
END $$;

-- 3. assign_peer_reviews: control de quién la ejecuta -------------------------
CREATE OR REPLACE FUNCTION public.assign_peer_reviews(
  p_course_id text,
  p_module_id integer,
  p_due_at timestamp with time zone DEFAULT NULL::timestamp with time zone
)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'ialab', 'smartboard', 'public'
AS $function$
DECLARE
  inserted INT := 0;
  rec RECORD;
  candidates UUID[];
BEGIN
  -- Con sesión de usuario, solo quien completó este módulo. Sin sesión
  -- (service_role, el backend) pasa.
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
       SELECT 1
         FROM user_progress
        WHERE user_id = auth.uid()::text
          AND module_id = p_module_id
          AND activity_type = 'module'
          AND is_completed = true
     ) THEN
    RETURN 0;
  END IF;

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
    -- Un revisor que ya tiene asignación en este módulo no recibe otra:
    -- llamar varias veces no multiplica las tareas.
    CONTINUE WHEN EXISTS (
      SELECT 1 FROM peer_assignments pa
       WHERE pa.module_id = p_module_id AND pa.reviewer_id = rec.uid
    );

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
$function$;

REVOKE EXECUTE ON FUNCTION public.assign_peer_reviews(text, integer, timestamp with time zone) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_peer_reviews(text, integer, timestamp with time zone) TO authenticated, service_role;

-- ── Deshacer (NO ejecutar salvo rotura grave) ───────────────────────────────
-- ALTER FUNCTION public.<nombre>(<args>) RESET search_path;   -- las 7 de la sección 1
-- GRANT EXECUTE ON FUNCTION public.get_my_institution_id() TO anon, PUBLIC;
-- assign_peer_reviews: volver a la definición anterior (sin el control de
-- quien la ejecuta ni el salto de revisores con asignación) guardada en el
-- historial de esta migración; los GRANT a anon y PUBLIC se restauran con
--   GRANT EXECUTE ON FUNCTION public.assign_peer_reviews(text, integer, timestamp with time zone) TO PUBLIC, anon;
